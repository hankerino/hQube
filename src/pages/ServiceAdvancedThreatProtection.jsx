
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Bot, BarChart, Lock, ArrowLeft, Target, Users, TrendingUp, CheckCircle, AlertTriangle, Eye, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import AIAssistantChat from '../components/AIAssistantChat';

const features = [
  { icon: Shield, title: "Multi-Layered Defense", description: "Combines signature-based detection, behavioral analysis, and machine learning to stop threats at every stage of the attack chain." },
  { icon: Zap, title: "Real-Time Response", description: "Automatically isolates compromised endpoints and terminates malicious processes to prevent lateral movement within your network." },
  { icon: Bot, title: "AI-Powered Analysis", description: "Leverages artificial intelligence to identify and predict emerging threats and zero-day vulnerabilities before they can cause damage." },
  { icon: BarChart, title: "Comprehensive Visibility", description: "A centralized dashboard provides complete visibility into your security posture with detailed reporting and threat intelligence." },
  { icon: Lock, title: "Ransomware Protection", description: "Advanced anti-ransomware technology detects and blocks unauthorized file encryption, ensuring business continuity and data protection." },
  { icon: Eye, title: "Continuous Monitoring", description: "24/7 monitoring of your environment with automated threat hunting and incident response capabilities." }
];

const resilienceFramework = [
  {
    phase: "Prepare",
    icon: Target,
    title: "Proactive Defense",
    description: "Build resilient infrastructure through risk assessment, security architecture design, and comprehensive policy development.",
    capabilities: ["Vulnerability assessments", "Security architecture review", "Policy framework development", "Staff training programs"]
  },
  {
    phase: "Detect",
    icon: Eye,
    title: "Advanced Detection",
    description: "Identify threats quickly using AI-powered monitoring, behavioral analytics, and threat intelligence integration.",
    capabilities: ["Behavioral analysis", "Threat intelligence feeds", "Anomaly detection", "Real-time alerting"]
  },
  {
    phase: "Respond",
    icon: Zap,
    title: "Rapid Response",
    description: "Execute coordinated incident response with automated containment, forensic analysis, and stakeholder communication.",
    capabilities: ["Automated containment", "Incident forensics", "Communication protocols", "Recovery procedures"]
  },
  {
    phase: "Recover",
    icon: TrendingUp,
    title: "Business Continuity",
    description: "Restore operations quickly while implementing lessons learned to strengthen future resilience capabilities.",
    capabilities: ["Business continuity planning", "Disaster recovery", "Post-incident analysis", "Continuous improvement"]
  }
];

const threats = [
  { name: "Advanced Persistent Threats (APTs)", severity: "Critical", description: "Long-term targeted attacks that remain undetected while stealing sensitive data." },
  { name: "Ransomware & Crypto-malware", severity: "High", description: "Malicious software that encrypts data and demands payment for decryption keys." },
  { name: "Zero-Day Exploits", severity: "Critical", description: "Attacks that exploit previously unknown vulnerabilities before patches are available." },
  { name: "Insider Threats", severity: "Medium", description: "Security risks posed by employees, contractors, or business associates with authorized access." },
  { name: "Supply Chain Attacks", severity: "High", description: "Compromise of third-party vendors to gain access to target organizations." },
  { name: "Social Engineering", severity: "Medium", description: "Manipulation of individuals to divulge confidential information or perform actions." }
];

const stats = [
  { number: "99.9%", label: "Threat Detection Rate", description: "AI-powered detection across multiple attack vectors" },
  { number: "<3min", label: "Average Response Time", description: "From detection to automated containment" },
  { number: "500+", label: "Organizations Protected", description: "Across government and enterprise sectors" },
  { number: "24/7", label: "Continuous Monitoring", description: "Round-the-clock security operations center" }
];

export default function ServiceAdvancedThreatProtectionPage() {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  return (
    <div className="bg-white">
      <AIAssistantChat isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
      
      {/* Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link to={createPageUrl("Home")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-slate-50 to-teal-50 py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Badge 
            className="mb-6 bg-red-100 text-red-800 border-red-200 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-red-200 transition-colors"
            onClick={() => setShowAIAssistant(true)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Cybersecurity Resilience Agent
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Advanced Threat Protection
            <span className="block bg-gradient-to-r from-teal-600 to-slate-600 bg-clip-text text-transparent">
              & Cyber Resilience
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Build organizational resilience against sophisticated cyber threats with our comprehensive security platform. From proactive defense to rapid recovery, we protect your business at every stage of the threat lifecycle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold">
              <Link to={createPageUrl("Home") + "#plans"}>View Security Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold">
              <Link to={createPageUrl("Analyze")}>Try Risk Assessment</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-slate-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-teal-100 mb-1">{stat.label}</div>
                <div className="text-sm text-teal-200">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cyber Resilience Framework */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Cybersecurity Resilience Framework</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive approach follows industry best practices to build, maintain, and improve your organization&apos;s cyber resilience across four critical phases.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {resilienceFramework.map((phase, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Card className="h-full shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-slate-500 rounded-2xl flex items-center justify-center">
                        <phase.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <Badge className="mb-2 bg-slate-100 text-slate-700">{phase.phase}</Badge>
                        <CardTitle className="text-2xl font-bold text-slate-900">{phase.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{phase.description}</p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-slate-800 mb-3">Key Capabilities:</h4>
                    <ul className="space-y-2">
                      {phase.capabilities.map((capability, capIndex) => (
                        <li key={capIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-slate-600 text-sm">{capability}</span>
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

      {/* Core Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Advanced Protection Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform combines multiple security technologies to provide comprehensive protection against the evolving threat landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                  <CardHeader>
                    <div className="w-12 h-12 mx-auto bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Landscape */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Today&apos;s Threat Landscape</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Understanding the threats your organization faces is the first step in building effective cyber resilience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {threats.map((threat, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-slate-900">{threat.name}</CardTitle>
                      <Badge className={`${
                        threat.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        threat.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {threat.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{threat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-teal-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold mb-4">Build Your Cyber Resilience Today</h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Don&apos;t wait for a cyber incident to test your defenses. Start building comprehensive resilience with hQube&apos;s advanced threat protection platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold">
                <Link to={createPageUrl("Home") + "#plans"}>Get Started Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-800 px-8 py-4 text-lg font-semibold">
                <Link to={createPageUrl("GovernmentContracting")}>Government Solutions</Link>
              </Button>
            </div>
            
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Activity className="w-8 h-8 mx-auto text-teal-200 mb-2" />
                <h3 className="font-semibold text-lg mb-1">Continuous Protection</h3>
                <p className="text-slate-200 text-sm">24/7 monitoring and automated response</p>
              </div>
              <div>
                <Users className="w-8 h-8 mx-auto text-teal-200 mb-2" />
                <h3 className="font-semibold text-lg mb-1">Expert Support</h3>
                <p className="text-slate-200 text-sm">Dedicated cybersecurity professionals</p>
              </div>
              <div>
                <TrendingUp className="w-8 h-8 mx-auto text-teal-200 mb-2" />
                <h3 className="font-semibold text-lg mb-1">Proven Results</h3>
                <p className="text-slate-200 text-sm">Track record of successful threat prevention</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
