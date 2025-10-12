
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Workflow, FileCheck2, Users, SlidersHorizontal, ArrowLeft, Shield, Building, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const features = [
  { icon: Server, title: "Managed ServiceNow Instance", description: "Get a pre-configured, fully managed ServiceNow environment without the overhead of maintaining your own infrastructure." },
  { icon: Workflow, title: "Pre-Built SecOps & ITSM", description: "Leverage industry-standard workflows for incident response, vulnerability management, and IT service requests from day one." },
  { icon: FileCheck2, title: "Automated GRC", description: "Streamline governance, risk, and compliance processes with automated evidence collection and continuous controls monitoring." },
  { icon: Users, title: "Role-Based Access", description: "Ensure the right people have the right access with pre-defined roles and permissions for IT, security, and business users." },
  { icon: SlidersHorizontal, title: "Customizable Modules", description: "Start with our core modules and scale your instance with additional capabilities like HAM, SAM, and custom applications as you grow." }
];

const automationSolutions = [
  {
    title: "IT Service Management (ITSM)",
    description: "Streamline IT operations with automated incident management, change control, and service request workflows.",
    benefits: ["Reduced mean time to resolution", "Improved service quality", "Enhanced user satisfaction", "Automated escalation procedures"]
  },
  {
    title: "Security Operations (SecOps)",
    description: "Integrate security tools and automate threat response workflows to accelerate incident resolution.",
    benefits: ["Faster threat detection", "Automated containment", "Compliance reporting", "Risk assessment automation"]
  },
  {
    title: "Governance, Risk & Compliance (GRC)",
    description: "Maintain compliance posture with automated controls monitoring and evidence collection.",
    benefits: ["Continuous compliance monitoring", "Automated audit preparation", "Risk visualization", "Policy management"]
  }
];

const partners = [
  {
    name: "Sotiotech",
    description: "Leading ServiceNow partner specializing in platform implementations and custom module development for government and enterprise sectors.",
    specialties: ["ServiceNow Implementation", "Custom Module Development", "ITSM Configuration", "Platform Integration"],
    website: "https://sotiotech.com"
  },
  {
    name: "Sattrix",
    description: "Cybersecurity solutions provider focused on threat detection, vulnerability management, and security operations for modern enterprises.",
    specialties: ["Threat Detection", "Vulnerability Management", "Security Operations", "Incident Response"],
    website: "https://sattrix.com"
  },
  {
    name: "SAM.GOV",
    description: "Official U.S. government system for award management and contractor registration for federal procurement opportunities.",
    specialties: ["Federal Contracting", "Vendor Registration", "Grant Management", "Procurement Compliance"],
    website: "https://sam.gov"
  }
];

export default function ServiceEnterpriseWorkflowAutomationPage() {
  return (
    <div className="bg-white">
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

      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-slate-50 to-teal-50 py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Server className="w-16 h-16 mx-auto text-teal-600 mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            Enterprise Workflow Automation
            <span className="block bg-gradient-to-r from-teal-600 to-slate-600 bg-clip-text text-transparent">
              & Digital Transformation
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Transform your organization with intelligent automation, streamlined workflows, and comprehensive digital solutions designed for modern enterprises and government agencies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold">
              <Link to={createPageUrl("Home") + "#plans"}>View ServiceNow Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg font-semibold">
              <Link to={createPageUrl("GovernmentContracting")}>Government Solutions</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Core Automation Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Automation Solutions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform combines ServiceNow's powerful automation capabilities with expert implementation and ongoing support.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {automationSolutions.map((solution, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Card className="h-full shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{solution.title}</CardTitle>
                    <p className="text-slate-600">{solution.description}</p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-slate-800 mb-3">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {solution.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0"></div>
                          <span className="text-slate-600 text-sm">{benefit}</span>
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

      {/* Platform Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Platform Features & Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built for enterprise scalability with government-grade security and compliance features.
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

      {/* Preferred Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Preferred Partners</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We collaborate with industry-leading organizations to deliver comprehensive solutions and exceptional service.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Card className="h-full shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-2xl font-bold text-slate-900">{partner.name}</CardTitle>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-800">Partner</Badge>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{partner.description}</p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-slate-800 mb-3">Specialties:</h4>
                    <ul className="space-y-2 mb-6">
                      {partner.specialties.map((specialty, specialtyIndex) => (
                        <li key={specialtyIndex} className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span className="text-slate-600 text-sm">{specialty}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-full">
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-slate-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Operations?</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Partner with hQube to implement enterprise workflow automation that scales with your organization's growth and security requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-100 px-8 py-4 text-lg font-semibold">
                <Link to={createPageUrl("Home") + "#plans"}>View Our Plans</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-slate-900 px-8 py-4 text-lg font-semibold">
                <Link to={createPageUrl("GovernmentContracting")}>Government Solutions</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
