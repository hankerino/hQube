import React from 'react';
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
                src="/hqube_logo.jpeg"
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
}