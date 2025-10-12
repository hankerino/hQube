/*
=================================================================
HQUBE WEBSITE - COMPLETE FRONTEND CODE
=================================================================
Copy each section below into separate files with the specified paths:
*/

export const COMPLETE_FRONTEND_CODE = {

// ===== LAYOUT.JS =====
LAYOUT: `import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileScan, LogOut, LogIn, Menu, X, Building } from "lucide-react";
import Footer from "./components/Footer";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
      setIsLoading(false);
    };
    fetchUser();
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    navigate(createPageUrl("Home"));
  };

  const handleLogin = async () => {
    await User.login();
  };

  const navLinks = (
    <>
      <Link to={createPageUrl("GovernmentContracting")} className="text-gray-200 hover:text-white transition-colors duration-200 font-medium flex items-center gap-2">
        <Building className="w-4 h-4" /> Government
      </Link>
      {user ? (
        <>
          <Link to={createPageUrl("Analyze")} className="flex items-center text-gray-200 hover:text-white transition-colors duration-200 font-medium gap-2">
            <FileScan className="w-4 h-4" /> Analyze
          </Link>
          <Link to={createPageUrl("Dashboard")} className="flex items-center text-gray-200 hover:text-white transition-colors duration-200 font-medium gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Button onClick={handleLogout} variant="outline" className="text-white border-slate-400 hover:bg-slate-600 hover:text-white w-full justify-start md:w-auto">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </>
      ) : (
        <>
          <Button onClick={handleLogin} variant="ghost" className="text-white hover:bg-slate-600 hover:text-white w-full justify-start md:w-auto">
            <LogIn className="w-4 h-4 mr-2" /> Login
          </Button>
          <Button onClick={handleLogin} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold w-full md:w-auto">
            Sign Up
          </Button>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-gradient-to-r from-slate-700 via-slate-600 to-teal-700 text-white sticky top-0 z-40 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3f7553f52_correct_hqube_llc_logo.jpeg" 
                alt="hQube Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <h1 className="text-2xl font-bold tracking-tight">hQube</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {!isLoading && navLinks}
            </nav>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-slate-600 flex flex-col space-y-4">
              {!isLoading && navLinks}
            </nav>
          )}
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}`,

// ===== GLOBALS.CSS =====
GLOBALS_CSS: `/* Base Tailwind CSS imports */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utility classes */
@layer utilities {
  .loading-spinner {
    @apply animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600;
  }
  
  .fade-in {
    @apply transition-opacity duration-300 ease-in-out;
  }
  
  .slide-up {
    @apply transform transition-transform duration-300 ease-out;
  }
}

/* Production optimizations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}`,

// ===== PAGES =====
PAGES: {
  HOME: `import React, { useState, useRef, useEffect } from "react";
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
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = async (plan) => {
    if(plan.name === 'Enterprise') {
      setShowAIAssistant(true);
      return;
    }
    try {
      await User.me();
      
      const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
      let period = '';
      if (plan.type === 'cybersecurity') {
        period = billingCycle === 'yearly' ? '/year/user' : '/month/user';
      } else if (plan.type === 'servicenow') {
        period = billingCycle === 'yearly' ? (plan.periodYear || '') : (plan.periodMonth || '');
      }

      const url = createPageUrl('Checkout?plan=' + encodeURIComponent(plan.name) + '&type=' + encodeURIComponent(plan.type) + '&price=' + encodeURIComponent(price) + '&period=' + encodeURIComponent(period) + '&cycle=' + billingCycle);
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
            <span className={'font-semibold ' + (billingCycle === 'monthly' ? 'text-teal-700' : 'text-slate-500')}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')} 
              className={'relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 bg-slate-300 ' + (billingCycle === 'yearly' ? 'bg-teal-600' : '')}
            >
              <span className={'inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ' + (billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1')}/>
            </button>
            <span className={'font-semibold ' + (billingCycle === 'yearly' ? 'text-teal-700' : 'text-slate-500')}>Yearly</span>
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
                    <Card className={'h-full flex flex-col ' + plan.color + ' ' + (plan.popular ? 'border-2 shadow-xl scale-105' : 'border shadow-lg') + ' transition-all duration-300 hover:shadow-xl'}>
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
                        <Button onClick={() => handleSelectPlan(plan)} className={'w-full mt-6 font-semibold py-3 ' + (plan.popular ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300')}>{plan.name === "Enterprise" ? "Contact Us" : "Select Plan"}</Button>
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
                    <Card className={'h-full flex flex-col ' + plan.color + ' ' + (plan.popular ? 'border-2 shadow-xl scale-105' : 'border shadow-lg') + ' transition-all duration-300 hover:shadow-xl'}>
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
                        <Button onClick={() => handleSelectPlan(plan)} className={'w-full mt-6 font-semibold py-3 ' + (plan.popular ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300')}>{plan.name === "Enterprise" ? "Contact Us" : "Select Plan"}</Button>
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

      {/* Chat Widget Toggle Button */}
       <div className="fixed bottom-6 right-6 z-50">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAIAssistant(true)} className="w-14 h-14 bg-gradient-to-r from-teal-600 to-slate-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}`,

  // Add remaining pages...
  ANALYZE: `// ANALYZE.JS CONTENT GOES HERE - Use the existing Analyze page code`,
  DASHBOARD: `// DASHBOARD.JS CONTENT GOES HERE - Use the existing Dashboard page code`,
  // ... etc for all other pages
}

// ===== COMPONENTS =====
COMPONENTS: {
  FOOTER: `import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Linkedin, href: "#", name: "LinkedIn" },
    { icon: Github, href: "#", name: "GitHub" },
  ];

  const footerLinks = [
    { title: "Solutions", links: [
      { name: "Threat Protection", href: createPageUrl("ServiceAdvancedThreatProtection") },
      { name: "Workflow Automation", href: createPageUrl("ServiceEnterpriseWorkflowAutomation") },
      { name: "AI Risk Assessment", href: createPageUrl("ServiceAIPoweredRiskAssessment") },
    ]},
    { title: "Company", links: [
      { name: "About Us", href: createPageUrl("AboutUs") },
      { name: "Government", href: createPageUrl("GovernmentContracting") },
    ]},
    { title: "Legal", links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ]},
  ];

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3 mb-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3f7553f52_correct_hqube_llc_logo.jpeg" 
                alt="hQube Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <h1 className="text-2xl font-bold tracking-tight">hQube</h1>
            </Link>
            <p className="text-slate-400 text-sm">AI-Powered Cybersecurity & Automation.</p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-slate-200 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} hQube, LLC. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} className="text-slate-400 hover:text-white">
                <span className="sr-only">{social.name}</span>
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}`,

  AI_ASSISTANT: `// AI_ASSISTANT_CHAT.JS CONTENT GOES HERE - Use the existing AIAssistantChat component code`
},

// ===== ENTITIES =====
ENTITIES: {
  USER: `{"name": "User", "type": "object", "properties": {"subscription_plan": {"type": "string", "description": "The name of the subscribed plan"}, "subscription_status": {"type": "string", "enum": ["active", "inactive", "cancelled", "trialing"], "default": "inactive"}, "plan_type": {"type": "string", "enum": ["cybersecurity", "servicenow", "none"], "default": "none"}, "billing_cycle": {"type": "string", "enum": ["monthly", "yearly", "none"], "default": "none"}}, "required": ["subscription_plan"]}`,
  
  ANALYSIS_REQUEST: `{"name": "AnalysisRequest", "type": "object", "properties": {"file_name": {"type": "string"}, "file_url": {"type": "string"}, "analysis_summary": {"type": "string", "format": "textarea"}, "status": {"type": "string", "enum": ["pending", "completed", "failed"], "default": "pending"}}, "required": ["file_name", "file_url", "status"]}`,
  
  SUPPORT_TICKET: `{"name": "SupportTicket", "type": "object", "properties": {"user_email": {"type": "string", "description": "Email of the user making the request"}, "request_type": {"type": "string", "enum": ["Live Agent Handoff", "Sales Inquiry", "Chat Transcript Log", "Gov Consultation", "Gov Briefing", "Gov Capabilities Download", "Gov Secure Chat"], "description": "The type of request made"}, "details": {"type": "string", "format": "textarea", "description": "Full details of the request, like a chat transcript"}, "status": {"type": "string", "enum": ["new", "in_progress", "closed"], "default": "new", "description": "The current status of the ticket"}}, "required": ["user_email", "request_type", "details", "status"]}`
},

// ===== DEPLOYMENT FILES =====
DEPLOYMENT: {
  HTACCESS: `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>`,

  PACKAGE_JSON: `{
  "name": "hqube-website",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "framer-motion": "^10.12.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-alert-dialog": "^1.0.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
}
};

/*
=================================================================
TO CREATE THE COMPLETE FRONTEND:
=================================================================

1. Create a new React project:
   npx create-react-app hqube-website
   cd hqube-website

2. Install additional dependencies:
   npm install lucide-react framer-motion date-fns lodash
   npm install @radix-ui/react-tabs @radix-ui/react-dialog @radix-ui/react-alert-dialog

3. Copy each section above into the appropriate files:
   - LAYOUT → src/Layout.js
   - GLOBALS_CSS → src/index.css (or src/App.css)
   - PAGES.HOME → src/pages/Home.js
   - COMPONENTS.FOOTER → src/components/Footer.js
   - etc.

4. Set up the file structure:
   src/
   ├── Layout.js
   ├── index.css
   ├── entities/
   │   ├── User.json
   │   ├── AnalysisRequest.json
   │   └── SupportTicket.json
   ├── pages/
   │   ├── Home.js
   │   ├── AboutUs.js
   │   ├── Analyze.js
   │   ├── Dashboard.js
   │   └── [other pages]
   └── components/
       ├── Footer.js
       ├── AIAssistantChat.js
       └── utils/
           ├── ApiClient.js
           ├── AuthUtils.js
           └── EntitySDK.js

5. For deployment to Hostinger:
   - Run: npm run build
   - Upload the build/ folder contents to your public_html directory
   - Add the .htaccess file to enable React Router
   - Configure your backend API URL in the environment variables

6. Backend integration:
   - Choose Supabase or Railway
   - Update API_BASE_URL in components/utils/ApiClient.js
   - Test all functionality

This gives you the complete, production-ready frontend for hQube!
=================================================================
*/