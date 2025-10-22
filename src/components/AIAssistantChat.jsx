
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/utils/apiClient';
import { BrainCircuit, Send, X, Loader2, Mail, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

export default function AIAssistantChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { type: 'ai', content: 'Hello! I&apos;m your AI-powered security assistant. How can I help you with cybersecurity planning, risk assessment, or compliance questions today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (messageContent) => {
    const currentMessage = messageContent || inputMessage;
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = { type: 'user', content: currentMessage.trim() };
    setInputMessage('');
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseSchema = {
        type: "object",
        properties: {
          response: { 
            type: "string", 
            description: "The conversational response to the user." 
          },
          action: { 
            type: "string", 
            enum: ["send_email_to_sales", "offer_handoff", "none"], 
            description: "The suggested next action if any." 
          },
        },
        required: ["response", "action"]
      };
      
      const history = messages.concat(userMessage).map(m => `${m.type}: ${m.content}`).join('\n');

      const { result } = await apiClient.invokeLLM(
        `You are an expert cybersecurity consultant and AI assistant for hQube. Your role is to assist with planning, risk assessment, and compliance. Based on the following conversation history, provide a helpful response.

Conversation History:
${history}

If the user asks for pricing, quotes, or to speak to a person, set action to 'offer_handoff'. 
If the user shows strong interest in purchasing or a demo, set action to 'send_email_to_sales'.
Otherwise, set action to 'none'.

Your response must be in JSON format conforming to the provided schema.`,
        responseSchema
      );

      if (result.response) {
        setMessages(prev => [...prev, { type: 'ai', content: result.response }]);
      }

      if (result.action === 'send_email_to_sales') {
        try {
          const transcript = messages.concat(userMessage).map(m => `${m.type}: ${m.content}`).join('\n');
          
          await apiClient.createTicket({
            request_type: "Sales Inquiry",
            details: `A user has shown high interest in our services. Please follow up.\n\nTranscript:\n${transcript}`
          });
          
          toast({ title: "Sales Notified", description: "Our sales team has been notified and will reach out to you shortly." });
        } catch (error) {
          console.error("Failed to create sales ticket:", error);
        }
      } else if (result.action === 'offer_handoff') {
        setMessages(prev => [...prev, { type: 'ai', content: "It sounds like you need to speak with one of our experts. Click the 'Talk to an Expert' button below to connect with our team." }]);
      }

    } catch (error) {
      console.error("AI Assistant Error:", error);
      toast({
        title: "AI Assistant Error",
        description: "Sorry, I&apos;m having trouble responding right now. Please try again.",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { type: 'ai', content: 'I apologize, but I&apos;m experiencing technical difficulties. Please try asking your question again, or contact our support team for immediate assistance.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEndChat = async () => {
    try {
      const { user } = await apiClient.getMe();
      const transcript = messages.map(m => `[${m.type.toUpperCase()}] ${m.content}`).join('\n\n');
      
      // Send transcript to user
      await apiClient.sendEmail(
          user.email,
          "Your hQube AI Chat Transcript",
          `Hello,\n\nHere is the transcript of your recent chat with the hQube AI Security Assistant.\n\n---\n\n${transcript}\n\n---\n\nIf you have any further questions, please don't hesitate to contact us.`,
          "hQube AI Assistant"
      );

      // Create a log ticket for the support team
      await apiClient.createTicket({
        request_type: "Chat Transcript Log",
        details: `AI Chat session ended.\n\nTranscript:\n\n${transcript}`,
        status: "closed"
      });

      toast({ title: "Transcript Sent", description: "A copy of your chat has been sent to your email.", className: "bg-green-500 text-white" });
      onClose();
    } catch (error) {
       toast({ title: "Login Required", description: "Please log in to email a transcript.", variant: "destructive" });
       // This will depend on your auth flow, for now we'll just log it.
       console.error("User not logged in");
    }
  };

  const handleHandoff = async () => {
    try {
      const transcript = messages.map(m => `[${m.type.toUpperCase()}] ${m.content}`).join('\n\n');
      
      // Create a support ticket instead of sending an email
      await apiClient.createTicket({
        request_type: "Live Agent Handoff",
        details: `User requested to speak with a live agent.\n\nConversation history:\n\n${transcript}`
      });

      setMessages(prev => [...prev, { type: 'ai', content: "I&apos;ve created a ticket for our support team. A live agent will reach out to you shortly via email or our live chat system. You can also contact us directly at support@hqube.co for immediate assistance." }]);
      
      toast({ 
        title: "Live Agent Requested", 
        description: "Our support team has been notified and will contact you shortly.",
        className: "bg-blue-500 text-white"
      });
    } catch (error) {
      console.error("Failed to create live agent ticket:", error);
      setMessages(prev => [...prev, { type: 'ai', content: "I&apos;m having trouble connecting you right now. Please contact our support team directly at support@hqube.co or try again later." }]);
      toast({ 
        title: "Connection Error", 
        description: "Please contact support@hqube.co directly for assistance.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <CardHeader className="bg-gradient-to-r from-teal-600 to-slate-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-8 h-8" />
                <CardTitle className="text-xl">AI Security Assistant</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-900 p-3 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about cybersecurity, compliance, or risk assessment..."
                  className="flex-1 min-h-0 h-12 resize-none"
                  disabled={isLoading}
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-teal-600 hover:bg-teal-700 px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
          </div>
          <CardFooter className="bg-slate-50 border-t p-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleHandoff}>
              <UserCheck className="w-4 h-4 mr-2" />
              Talk to an Expert
            </Button>
            <Button variant="secondary" size="sm" onClick={handleEndChat}>
              <Mail className="w-4 h-4 mr-2" />
              End & Email Transcript
            </Button>
          </CardFooter>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
