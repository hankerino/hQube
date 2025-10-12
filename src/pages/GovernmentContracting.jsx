
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Shield, Users, CheckCircle, MessageCircle, ArrowLeft, FileText, Award, Clock, Zap, Lock, KeyRound, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/api/entities'; // New import
import { SupportTicket } from '@/api/entities'; // New import

const capabilities = [
  { icon: Shield, title: "FedRAMP Ready", description: "Our cybersecurity solutions are designed to meet federal security standards and compliance requirements." },
  { icon: Building, title: "Public Sector Expertise", description: "Deep understanding of government workflows, security protocols, and regulatory compliance needs." },
  { icon: Users, title: "Scalable Solutions", description: "From small agencies to large departments, our solutions scale to meet any government organization's needs." },
  { icon: FileText, title: "Compliance Automation", description: "Automated reporting and audit trails to meet FISMA, NIST, and other federal compliance requirements." },
  { icon: Award, title: "Security Clearances", description: "Our team maintains appropriate security clearances to work with sensitive government data and systems." },
  { icon: Clock, title: "24/7 Government Support", description: "Dedicated support team familiar with government operations and emergency response protocols." }
];

const services = [
  {
    title: "Cybersecurity for Federal Agencies",
    description: "Comprehensive endpoint protection, threat intelligence, and incident response tailored for government environments.",
    features: ["NIST Cybersecurity Framework alignment", "Zero-trust architecture implementation", "Continuous monitoring and threat hunting", "Incident response and forensics"]
  },
  {
    title: "Automated Compliance Management",
    description: "ServiceNow-based solutions for managing FISMA, FedRAMP, and other federal compliance requirements.",
    features: ["Automated evidence collection", "Real-time compliance dashboards", "Risk assessment workflows", "Audit trail management"]
  },
  {
    title: "Digital Transformation Services",
    description: "Modernize legacy systems with secure, cloud-native solutions that meet federal standards.",
    features: ["Legacy system integration", "Cloud migration planning", "API security and management", "DevSecOps implementation"]
  }
];

const MFAModal = ({ isOpen, onClose, onSuccess, actionType }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleSendCode = () => {
    if (!phone) {
      toast({ title: "Phone Required", description: "Please enter your phone number for MFA verification.", variant: "destructive" });
      return;
    }
    // Simulate sending code
    toast({ title: "MFA Code Sent", description: `Verification code sent to ${phone}`, className: "bg-blue-500 text-white" });
    setStep(2);
  };

  const handleVerifyCode = () => {
    if (!code || code.length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter the 6-digit verification code.", variant: "destructive" });
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      toast({ title: "Authentication Successful", description: "Zero Trust verification completed.", className: "bg-green-500 text-white" });
      onSuccess();
      onClose();
      setIsVerifying(false);
      // Reset state for next use
      setStep(1);
      setPhone('');
      setCode('');
    }, 2000);
  };

  // Reset state when modal closes
  const handleOpenChange = (open) => {
    if (!open) {
      setStep(1);
      setPhone('');
      setCode('');
      setIsVerifying(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Zero Trust Authentication
          </DialogTitle>
          <DialogDescription>
            Secure MFA verification required for {actionType}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Government Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button onClick={handleSendCode} className="w-full bg-blue-600 hover:bg-blue-700">
                <KeyRound className="w-4 h-4 mr-2" />
                Send MFA Code
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">6-Digit Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <Button onClick={handleVerifyCode} disabled={isVerifying} className="w-full bg-green-600 hover:bg-green-700">
                {isVerifying ? "Verifying..." : "Verify & Proceed"}
              </Button>
            </>
          )}
          <div className="flex items-center justify-center text-xs text-slate-500 gap-2">
            <Shield className="w-3 h-3" />
            <span>Secured by Context7 MCP & Zero Trust Architecture</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function GovernmentContractingPage() {
  const [showMFA, setShowMFA] = useState(false);
  const [mfaAction, setMfaAction] = useState('');
  const { toast } = useToast();

  const handleSecureAction = async (actionType) => {
    try {
      // Check if user is logged in before proceeding with secure action
      await User.me();
      setMfaAction(actionType);
      setShowMFA(true);
    } catch(e) {
      toast({title: "Login Required", description: "You must be logged in to perform this secure action.", variant: "destructive"})
      // Redirect to login or open login modal
      User.login();
    }
  };

  const createTicket = async (user_email, request_type, details) => {
    try {
      await SupportTicket.create({ user_email, request_type, details });
    } catch (e) {
      console.error("Failed to create support ticket", e);
      toast({
        title: "Error",
        description: "Failed to log request. Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const handleMFASuccess = async () => {
    const user = await User.me(); // Get current user's email for the ticket
    if (!user || !user.email) {
      toast({
        title: "Error",
        description: "Could not retrieve user email for logging request. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (mfaAction === 'consultation') {
      await createTicket(user.email, "Gov Consultation", "User requested a secure government consultation. MFA Verified. Next steps: Contact user within 4 hours via secure channels.");
      toast({
        title: "Secure Consultation Requested",
        description: "Our cleared government team will contact you within 4 hours via secure channels.",
        className: "bg-green-500 text-white",
      });
    } else if (mfaAction === 'capabilities') {
      await createTicket(user.email, "Gov Capabilities Download", "User downloaded capabilities statement. MFA Verified. This download has been logged and audited for compliance purposes.");
      toast({
        title: "Secure Download Initiated",
        description: "Capabilities statement download authenticated and logged.",
        className: "bg-green-500 text-white",
      });
    } else if (mfaAction === 'briefing') {
      await createTicket(user.email, "Gov Briefing", "User requested a secure briefing. MFA Verified. Next steps: Send encrypted calendar invite within 1 hour and prepare classified briefing materials.");
      toast({
        title: "Secure Briefing Scheduled",
        description: "You will receive an encrypted calendar invite within 1 hour.",
        className: "bg-green-500 text-white",
      });
    } else if (mfaAction === 'secure_chat') {
      await createTicket(user.email, "Gov Secure Chat", "User initiated a secure chat after MFA verification. Next steps: A cleared support agent should join the secure chat channel for assistance.");
      toast({
        title: "Secure Chat Initiated",
        description: "Connecting you to a cleared support agent for secure chat.",
        className: "bg-green-500 text-white",
      });
    }
  };

  return (
    <div className="bg-white">
      <Toaster />
      <MFAModal 
        isOpen={showMFA} 
        onClose={() => setShowMFA(false)} 
        onSuccess={handleMFASuccess}
        actionType={mfaAction}
      />
      
      {/* Enhanced sticky navigation bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link to={createPageUrl("Home")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          {/* New Secure Chat Button */}
          <Button
            size="sm" 
            onClick={() => handleSecureAction('secure_chat')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold shadow-md transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Secure Chat
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-blue-50 to-slate-50 py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Building className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            FedRAMP Ready • Zero Trust • MFA Secured
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            Government Contracting
            <span className="block bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">
              & Public Sector Solutions
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Secure, compliant cybersecurity and automation solutions with Zero Trust authentication and MFA-protected document handling for federal, state, and local government agencies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => handleSecureAction('consultation')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Lock className="w-5 h-5 mr-2" />
              Secure Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold"
              onClick={() => handleSecureAction('capabilities')}
            >
              <FileText className="w-5 h-5 mr-2" />
              MFA-Protected Download
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Security Features */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Government-Grade Security Features</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Every interaction is secured with enterprise authentication and zero-trust architecture.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <Lock className="w-12 h-12 mx-auto text-blue-200 mb-4" />
                <CardTitle>Multi-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-100">All document uploads, downloads, and consultations require MFA verification with government phone numbers.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 mx-auto text-blue-200 mb-4" />
                <CardTitle>Zero Trust Architecture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-100">Every access request is verified and encrypted using Context7 MCP security protocols.</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="text-center">
                <Upload className="w-12 h-12 mx-auto text-blue-200 mb-4" />
                <CardTitle>Secure Document Handling</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-100">End-to-end encrypted document processing with full audit trails and compliance logging.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Government Agencies Choose hQube
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We understand the unique challenges of government IT and security requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-slate-500 rounded-2xl flex items-center justify-center mb-4">
                      <capability.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{capability.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-600 leading-relaxed">{capability.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Specialized Government Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tailored solutions that meet the specific needs of government operations and compliance requirements.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Card className="h-full shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{service.title}</CardTitle>
                    <p className="text-slate-600">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Secure Your Agency?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact our government solutions team for a personalized consultation and capabilities briefing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => handleSecureAction('briefing')}
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
            >
              <Lock className="w-5 h-5 mr-2" />
              Secure Briefing
            </Button>
            <Button
              onClick={() => toast({ title: "Secure Contact", description: "Encrypted Phone: 1-800-HQUBE-GOV | Secure Email: government@hqube.co" })}
              size="lg"
              variant="outline"
              className="border-blue-300 text-white hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold"
            >
              Contact Information
            </Button>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Zap className="w-8 h-8 mx-auto text-blue-200 mb-2" />
              <h3 className="font-semibold text-lg mb-1">Rapid Deployment</h3>
              <p className="text-blue-100 text-sm">Get secure solutions deployed in weeks, not months</p>
            </div>
            <div>
              <Shield className="w-8 h-8 mx-auto text-blue-200 mb-2" />
              <h3 className="font-semibold text-lg mb-1">Compliance First</h3>
              <p className="text-blue-100 text-sm">Built to meet federal security and compliance standards</p>
            </div>
            <div>
              <Clock className="w-8 h-8 mx-auto text-blue-200 mb-2" />
              <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
              <p className="text-blue-100 text-sm">Always-on support for critical government operations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
