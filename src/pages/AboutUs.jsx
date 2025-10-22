
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Target, Award, ArrowLeft, Building, Zap, Globe, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "We believe cybersecurity is not just a feature—it's the foundation of everything we build. Our solutions are designed with security at their core."
  },
  {
    icon: Users,
    title: "People-Centered",
    description: "Technology serves people, not the other way around. We create solutions that empower teams and enhance human capabilities."
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "We measure success by the tangible outcomes we deliver for our clients—reduced risk, improved efficiency, and enhanced security posture."
  },
  {
    icon: Award,
    title: "Excellence & Innovation",
    description: "We continuously push the boundaries of what&apos;s possible, combining cutting-edge AI with proven cybersecurity practices."
  }
];

const milestones = [
  {
    year: "Founded",
    title: "hQube Established",
    description: "Founded with a mission to democratize enterprise-grade cybersecurity for organizations of all sizes."
  },
  {
    year: "Innovation",
    title: "AI-Powered Platform",
    description: "Launched our AI-powered security platform, combining machine learning with traditional cybersecurity approaches."
  },
  {
    year: "Growth",
    title: "500+ Organizations",
    description: "Reached milestone of protecting over 500 organizations worldwide with our comprehensive security solutions."
  },
  {
    year: "Today",
    title: "Industry Leader",
    description: "Recognized as a trusted partner for government agencies and enterprises seeking advanced cybersecurity solutions."
  }
];

const partners = [
  {
    name: "Sotiotech",
    description: "Expert ServiceNow partner offering custom implementations and module development native to the ServiceNow platform.",
    specialties: ["ServiceNow Implementation", "Custom Module Development", "ITSM Configuration", "Platform Integration"],
    website: "https://sotiotech.com"
  },
  {
    name: "Sattrix",
    description: "A global cybersecurity partner providing advanced services in threat detection, vulnerability management, and security operations.",
    specialties: ["Threat Detection", "Vulnerability Management", "Security Operations", "Incident Response"],
    website: "https://sattrix.com"
  },
  {
    name: "The Win-Shift",
    description: "AI-powered business transformation partner specializing in intelligent automation, data-driven decision making, and AI-enhanced go-to-market strategies for technology companies.",
    specialties: ["AI Strategy & Implementation", "Intelligent Automation", "Data Analytics & ML", "AI-Enhanced Sales Enablement"],
    website: "https://www.thewinshift.com"
  }
];

export default function AboutUsPage() {
  return (
    <div className="bg-white">
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
        className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            About hQube
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We&apos;re on a mission to make enterprise-grade cybersecurity accessible to organizations of all sizes. Through innovative AI-powered solutions and expert guidance, we protect what matters most to your business.
          </p>
        </div>
      </motion.section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold text-slate-900 mb-8">Our Mission</h2>
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-8 rounded-2xl">
              <p className="text-2xl text-slate-700 leading-relaxed font-medium">
                &quot;To democratize cybersecurity by providing intelligent, accessible, and comprehensive protection that scales with your organization&apos;s growth.&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Born from the recognition that cybersecurity shouldn&apos;t be a luxury reserved for large enterprises.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">The Challenge We Saw</h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Small and medium enterprises were struggling with the same cyber threats as large corporations, but lacked access to the same level of security expertise and technology. Traditional cybersecurity solutions were either too complex, too expensive, or required dedicated security teams that most organizations couldn&apos;t afford.
                </p>
                <p>
                  At the same time, the cybersecurity landscape was evolving rapidly. AI and machine learning were transforming how threats could be detected and prevented, but these advanced capabilities remained out of reach for most businesses.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Solution</h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  We founded hQube with a clear vision: to bridge this gap by making enterprise-grade cybersecurity accessible, intelligent, and scalable. By combining cutting-edge AI technology with deep cybersecurity expertise, we created solutions that provide the protection of an enterprise security team without the complexity or cost.
                </p>
                <p>
                  Today, we&apos;re proud to protect organizations across industries, from small businesses to government agencies, helping them stay secure in an increasingly digital world.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do at hQube.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-slate-600 rounded-2xl flex items-center justify-center mb-4">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-xl text-slate-600">Key milestones in hQube&apos;s evolution.</p>
          </div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-xl text-slate-900">{milestone.title}</CardTitle>
                          <p className="text-blue-600 font-semibold">{milestone.year}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose hQube</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We&apos;re more than a cybersecurity provider—we&apos;re your trusted partner in digital transformation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="h-full shadow-lg border-0">
                <CardHeader>
                  <Building className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-slate-900">Enterprise Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Our team brings decades of combined experience from leading enterprise environments, government agencies, and cutting-edge technology companies. We don&apos;t just understand the challenges you face; we&apos;ve actively solved them.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card className="h-full shadow-lg border-0">
                <CardHeader>
                  <Zap className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-slate-900">AI-Powered Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    We harness the power of artificial intelligence and machine learning to deliver proactive threat detection, automated response, and intelligent risk assessment, constantly evolving to stay ahead of the latest threats.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card className="h-full shadow-lg border-0">
                <CardHeader>
                  <Globe className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-slate-900">Scalable Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Our solutions are engineered to grow with your business, seamlessly scaling from foundational protection for startups to comprehensive security orchestration for large enterprises.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Strategic Partners</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We collaborate with industry leaders to deliver comprehensive and innovative solutions.
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
                    <Button
                      asChild
                      variant="outline"
                      className={`w-full ${
                        partner.name === "Sotiotech"
                          ? "border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                          : partner.name === "Sattrix"
                          ? "border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
                          : ""
                      }`}
                    >
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 via-teal-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations that trust hQube to protect their digital assets and enable their growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold">
                <Link to={createPageUrl("Home") + "#plans"}>View Our Plans</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-amber-400 text-amber-200 hover:bg-amber-700 hover:text-white px-8 py-4 text-lg font-semibold">
                <Link to={createPageUrl("Analyze")}>Try Risk Assessment</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
