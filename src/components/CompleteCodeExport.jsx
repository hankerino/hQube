// This file contains the complete hQube website code for export
// Copy each section below into separate files as indicated

export const layoutCode = `import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import apiClient from "@/utils/apiClient";
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
        const currentUser = await apiClient.getProfile();
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
    await apiClient.logout();
    setUser(null);
    navigate(createPageUrl("Home"));
  };

  const handleLogin = async () => {
    await apiClient.login();
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
                src="/hqube_logo.jpeg"
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
}`;

export default function CompleteCodeExport() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">hQube Website - Complete Code Export</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Project Structure</h2>
          <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
            <div>src/</div>
            <div>├── Layout.js</div>
            <div>├── globals.css</div>
            <div>├── entities/</div>
            <div>│   ├── User.json</div>
            <div>│   ├── AnalysisRequest.json</div>
            <div>│   └── SupportTicket.json</div>
            <div>├── pages/</div>
            <div>│   ├── Home.js</div>
            <div>│   ├── AboutUs.js</div>
            <div>│   ├── Analyze.js</div>
            <div>│   ├── Dashboard.js</div>
            <div>│   ├── Checkout.js</div>
            <div>│   ├── ManageSubscription.js</div>
            <div>│   ├── GovernmentContracting.js</div>
            <div>│   ├── ServiceAdvancedThreatProtection.js</div>
            <div>│   ├── ServiceEnterpriseWorkflowAutomation.js</div>
            <div>│   └── ServiceAIPoweredRiskAssessment.js</div>
            <div>└── components/</div>
            <div>    ├── AIAssistantChat.js</div>
            <div>    ├── Footer.js</div>
            <div>    └── utils/</div>
            <div>        ├── ApiClient.js</div>
            <div>        ├── AuthUtils.js</div>
            <div>        └── EntitySDK.js</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Quick Start Guide</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>Create new React project: <code className="bg-slate-100 px-2 py-1 rounded">npx create-react-app hqube-website</code></li>
            <li>Install dependencies: <code className="bg-slate-100 px-2 py-1 rounded">npm install lucide-react framer-motion date-fns lodash</code></li>
            <li>Copy all page files from this project to your src/ folder</li>
            <li>Set up your backend (Supabase recommended)</li>
            <li>Build: <code className="bg-slate-100 px-2 py-1 rounded">npm run build</code></li>
            <li>Deploy to Hostinger and point www.hqube.co to your app</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">✅ Features Included</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-teal-700 mb-2">Frontend Features:</h3>
              <ul className="space-y-1 text-slate-600">
                <li>• Modern React with Tailwind CSS</li>
                <li>• Responsive design for all devices</li>
                <li>• AI-powered chatbot component</li>
                <li>• Interactive pricing plans</li>
                <li>• Government contracting pages</li>
                <li>• Service detail pages</li>
                <li>• User dashboard and analytics</li>
                <li>• Document analysis tool</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 mb-2">Ready for:</h3>
              <ul className="space-y-1 text-slate-600">
                <li>• Hostinger deployment</li>
                <li>• Custom domain (www.hqube.co)</li>
                <li>• Supabase/Railway backend</li>
                <li>• Payment processing integration</li>
                <li>• SSL/HTTPS support</li>
                <li>• CDN distribution</li>
                <li>• SEO optimization</li>
                <li>• Analytics integration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <strong>💡 Next Step:</strong> All your pages, components, and entities are already built in this project.
            You can copy them directly to create your standalone React app for deployment to Hostinger.
          </p>
        </div>
      </div>
    </div>
  );
}