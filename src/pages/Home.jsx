
import React, { useState, useRef, useEffect } from "react";
import { User } from "@/api/entities";
import { Shield, CheckCircle2, MessageCircle, X, Send, Users, Clock, Award, ArrowRight, Star, Zap, Server, Video, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AIAssistantChat from '../components/AIAssistantChat';

const DemoModal = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: -20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg text-slate-800">hQube Product Demo</h3>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
      </div>
      <div className="p-6">
        <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
          <p className="text-slate-500">Video player placeholder</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default function Home() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = async (plan) => {
    if(plan.name === 'Enterprise') {
      setShowAIAssistant(true); // Open AI Assistant for Enterprise plan
      return;
    }
    try {
      await User.me(); // check if logged in
      
      const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
      let period = '';
      if (plan.type === 'cybersecurity') {
        period = billingCycle === 'yearly' ? '/year/user' : '/month/user';
      } else if (plan.type === 'servicenow') {
        period = billingCycle === 'yearly' ? (plan.periodYear || '') : (plan.periodMonth || '');
      }

      const url = createPageUrl(`Checkout?plan=${encodeURIComponent(plan.name)}&type=${encodeURIComponent(plan.type)}&price=${encodeURIComponent(price)}&period=${encodeURIComponent(period)}&cycle=${billingCycle}`);
      navigate(url);
    } catch (error) {
      toast({
        title: "Please Login First",
        description: "You need to log in or create an account to select a plan.",
        variant: "destructive",
      });
      setTimeout(() => User.login(), 1500);
    }
  };

  const plans = [
    { name: "Basic", price: { monthly: "€9", yearly: "€108" }, type: 'cybersecurity', popular: false, features: ["Real-time endpoint protection", "Weekly alerts dashboard", "Quick install, low footprint", "Email support", "Basic malware detection"], color: "border-gray-200" },
    { name: "Standard", price: { monthly: "€17", yearly: "€204" }, type: 'cybersecurity', popular: true, features: ["All Basic features", "USB/media device control", "Role-based access control (RBAC)", "Alert escalation workflows", "Real-time monitoring", "Priority support"], color: "border-teal-500" },
    { name: "Pro", price: { monthly: "€27", yearly: "€324" }, type: 'cybersecurity', popular: false, features: ["All Standard features", "Compliance reports & audit logs", "Device tagging & asset tracking", "Custom security policies", "Incident response", "24/7 phone support"], color: "border-slate-500" },
    { name: "Enterprise", price: { monthly: "Custom", yearly: "Custom" }, type: 'cybersecurity', popular: false, features: ["All Pro features", "White-labeled dashboard", "Multi-tenant control", "Custom SLA agreements", "Dedicated account manager", "On-site training"], color: "border-amber-500" }
  ];

  const serviceNowPlans = [
    { name: "Starter", price: { monthly: "€799", yearly: "€9,588" }, type: 'servicenow', periodMonth: "/month", periodYear: "/year", popular: false, features: ["Shared instance access", "1 module (SecOps or HAM)", "Basic ticketing workflow", "Free initial risk assessment", "Pre-configured templates", "Email support"], color: "border-gray-200" },
    { name: "Growth", price: { monthly: "€1,499", yearly: "€17,988" }, type: 'servicenow', periodMonth: "/month", periodYear: "/year", popular: true, features: ["Sandbox + shared prod instance", "Up to 3 modules", "Basic integrations", "Monthly performance reports", "GRC, IAM, SAM templates", "Priority support"], color: "border-teal-500" },
    { name: "Pro", price: { monthly: "€2,999", yearly: "€35,988" }, type: 'servicenow', periodMonth: "/month", periodYear: "/year", popular: false, features: ["Fully dedicated instance", "Up to 5 modules", "Customizable templates", "Quarterly business reviews", "Advanced automation", "24/7 support"], color: "border-slate-500" },
    { name: "Enterprise", price: { monthly: "Custom", yearly: "Custom" }, type: 'servicenow', periodMonth: "", periodYear: "", popular: false, features: ["All Pro features", "Unlimited modules", "Custom development", "White-label options", "Dedicated account manager", "On-site consulting"], color: "border-amber-500" }
  ];

  return (
    <div>
      <Toaster />
      <AnimatePresence>{showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}</AnimatePresence>
      <AIAssistantChat isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-teal-100 text-teal-800 border-teal-200 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-amber-200 hover:text-amber-800 hover:border-amber-200 transition-colors" onClick={() => setShowAIAssistant(true)}>
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Security Solutions - Click to Chat
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              AI-Powered Cybersecurity
              <span className="block bg-gradient-to-r from-teal-600 to-slate-600 bg-clip-text text-transparent">
                & ServiceNow Subscriptions
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              24/7 intelligent support & scalable automation for SMEs. Protect your business with enterprise-grade security that grows with you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => scrollToSection('plans')}
              >
                Explore Plans
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold"
                onClick={() => setShowDemoModal(true)}
              >
                <Video className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-8 text-slate-500 text-sm"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>500+ SMEs Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>99.9% Uptime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Complete Security & Automation Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From endpoint protection to workflow automation, we've got your business covered.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Advanced Threat Protection",
                description: "Multi-layered cybersecurity platform combining next-generation endpoint detection, behavioral analysis, and automated incident response to protect against sophisticated threats including zero-day attacks and advanced persistent threats.",
                link: createPageUrl("ServiceAdvancedThreatProtection")
              },
              {
                icon: Server,
                title: "Enterprise Workflow Automation",
                description: "Fully managed ServiceNow instances with pre-configured ITSM, SecOps, and GRC modules. Streamline IT operations, automate security workflows, and ensure compliance with industry standards through intelligent automation.",
                link: createPageUrl("ServiceEnterpriseWorkflowAutomation")
              },
              {
                icon: Award,
                title: "AI-Powered Risk Assessment",
                description: "Enterprise-grade large language model specifically tuned for cybersecurity analysis. Upload documents for comprehensive risk assessments, compliance gap analysis, and security policy reviews with actionable recommendations.",
                link: createPageUrl("ServiceAIPoweredRiskAssessment")
              }
            ].map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Link to={service.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md group">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-teal-500 to-slate-500 rounded-2xl flex items-center justify-center mb-4">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-slate-600 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Flexible Subscription Plans</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Choose the billing cycle that works for you. Annual plans include significant savings.</p>
          </div>
          
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-teal-700' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')} 
              className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 bg-slate-300 data-[state=checked]:bg-teal-600"
              data-state={billingCycle === 'yearly' ? 'checked' : 'unchecked'}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
            <span className={`font-semibold ${billingCycle === 'yearly' ? 'text-teal-700' : 'text-slate-500'}`}>Yearly</span>
            <Badge className="bg-green-100 text-green-800">Save up to 20%</Badge>
          </div>

          <Tabs defaultValue="cybersecurity" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-200 p-1 h-12 rounded-xl">
              <TabsTrigger value="cybersecurity" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg"><Shield className="w-5 h-5 mr-2" />Cybersecurity</TabsTrigger>
              <TabsTrigger value="servicenow" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg"><Server className="w-5 h-5 mr-2" />ServiceNow</TabsTrigger>
            </TabsList>
            <TabsContent value="cybersecurity" className="mt-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-slate-800">Advanced Threat Protection Platform</h3>
                <p className="text-slate-600">Comprehensive cybersecurity solution with AI-powered threat detection and response.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => {
                  const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
                  const periodDisplay = plan.price.monthly === "Custom" ? "" : (billingCycle === 'yearly' ? '/year/user' : '/month/user');
                  const showOriginalMonthly = billingCycle === 'yearly' && plan.price.monthly !== "Custom";

                  return (
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="relative">
                    <Card className={`h-full flex flex-col ${plan.color} ${plan.popular ? 'border-2 shadow-xl scale-105' : 'border shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
                      {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><Badge className="bg-amber-600 text-white px-4 py-1 font-semibold"><Star className="w-3 h-3 mr-1" />Most Popular</Badge></div>}
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</CardTitle>
                        <div className="mb-4 h-20 flex flex-col justify-center">
                          <span className="text-4xl font-bold text-slate-900">{price}</span>
                          {price !== "Custom" && (
                            <>
                              <span className="text-slate-600 text-sm font-medium">{periodDisplay}</span>
                              {showOriginalMonthly && (
                                <div className="text-sm text-slate-500 mt-1">
                                  (billed annually, was {plan.price.monthly}/month)
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow flex flex-col">
                        <ul className="space-y-3 flex-grow">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-slate-700 text-sm leading-relaxed">{feature}</span></li>
                          ))}
                        </ul>
                        <Button onClick={() => handleSelectPlan(plan)} className={`w-full mt-6 font-semibold py-3 ${plan.popular ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300'}`}>{plan.name === "Enterprise" ? "Contact Us" : "Select Plan"}</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )})}
              </div>
            </TabsContent>
            <TabsContent value="servicenow" className="mt-12">
               <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-slate-800">Managed ServiceNow Platform</h3>
                <p className="text-slate-600">Pre-configured ServiceNow instances for complete IT service management and automation.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {serviceNowPlans.map((plan, index) => {
                  const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
                  const periodDisplay = billingCycle === 'yearly' ? plan.periodYear : plan.periodMonth;
                  const showOriginalMonthly = billingCycle === 'yearly' && plan.price.monthly !== "Custom";
                  return(
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="relative">
                    <Card className={`h-full flex flex-col ${plan.color} ${plan.popular ? 'border-2 shadow-xl scale-105' : 'border shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
                      {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><Badge className="bg-teal-600 text-white px-4 py-1 font-semibold"><Star className="w-3 h-3 mr-1" />Most Popular</Badge></div>}
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</CardTitle>
                        <div className="mb-4 h-20 flex flex-col justify-center">
                          <span className="text-4xl font-bold text-slate-900">{price}</span>
                          {price !== "Custom" && (
                            <>
                              <span className="text-slate-600 text-sm font-medium">{periodDisplay}</span>
                              {showOriginalMonthly && (
                                <div className="text-sm text-slate-500 mt-1">
                                  (billed annually, was {plan.price.monthly}/month)
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow flex flex-col">
                        <ul className="space-y-3 flex-grow">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-slate-700 text-sm leading-relaxed">{feature}</span></li>
                          ))}
                        </ul>
                        <Button onClick={() => handleSelectPlan(plan)} className={`w-full mt-6 font-semibold py-3 ${plan.popular ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300'}`}>{plan.name === "Enterprise" ? "Contact Us" : "Select Plan"}</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )})}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-slate-800 via-slate-700 to-teal-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Secure Your Business?</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">Get in touch with our cybersecurity experts for a personalized consultation.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => setShowAIAssistant(true)} size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold">Schedule Consultation</Button>
            <Button
              onClick={() => toast({ title: "Brochure Download", description: "Your download will start shortly."})}
              size="lg"
              variant="outline"
              className="border-slate-400 text-slate-200 hover:bg-slate-700 px-8 py-4 text-lg font-semibold"
            >
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* Chat Widget Toggle Button - now opens AIAssistantChat */}
       <div className="fixed bottom-6 right-6 z-50">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAIAssistant(true)} className="w-14 h-14 bg-gradient-to-r from-teal-600 to-slate-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
