
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, FileSearch, ShieldCheck, ListChecks, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const features = [
  { icon: FileSearch, title: "Deep Document Analysis", description: "Our LLM reads and understands complex documents, including security policies, contracts, and compliance reports." },
  { icon: ShieldCheck, title: "Security Risk Identification", description: "Automatically pinpoints potential vulnerabilities, weak configurations, and security gaps mentioned in your documentation." },
  { icon: ListChecks, title: "Compliance Gap Analysis", description: "Cross-references your policies against major regulatory frameworks (like GDPR, ISO 27001) to identify non-compliance." },
  { icon: BrainCircuit, title: "Actionable Recommendations", description: "Provides clear, context-aware suggestions and remediation steps to address identified risks and compliance issues." },
];

export default function ServiceAIPoweredRiskAssessmentPage() {
  return (
    <div className="bg-white">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 py-4">
        <div className="max-w-5xl mx-auto px-6">
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
        className="relative bg-gradient-to-br from-slate-50 to-amber-50 py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <BrainCircuit className="w-16 h-16 mx-auto text-amber-600 mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            AI-Powered Risk Assessment
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Leverage our secure, enterprise-grade LLM to perform rapid and comprehensive risk assessments on your business documents.
          </p>
        </div>
      </motion.section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Intelligent Insights, Instantly</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Go from lengthy manual reviews to automated, in-depth analysis in minutes. Upload your documents and let our AI do the heavy lifting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="h-full text-left shadow-lg hover:shadow-xl transition-shadow border-0 p-4">
                  <CardHeader className="flex flex-row items-center gap-4 p-2">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-100 p-10 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Start Your First Analysis</h3>
            <p className="text-lg text-slate-600 mb-8">
              Log in to your dashboard to access the secure document analysis tool.
            </p>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold">
              <Link to={createPageUrl("Analyze")}>
                Analyze a Document <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
