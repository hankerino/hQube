import Layout from "./Layout.jsx";

import Home from "./Home";

import Analyze from "./Analyze";

import Dashboard from "./Dashboard";

import Checkout from "./Checkout";

import ManageSubscription from "./ManageSubscription";

import ServiceAdvancedThreatProtection from "./ServiceAdvancedThreatProtection";

import ServiceEnterpriseWorkflowAutomation from "./ServiceEnterpriseWorkflowAutomation";

import ServiceAIPoweredRiskAssessment from "./ServiceAIPoweredRiskAssessment";

import GovernmentContracting from "./GovernmentContracting";

import AboutUs from "./AboutUs";

import StripeSetup from "./StripeSetup";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Analyze: Analyze,
    
    Dashboard: Dashboard,
    
    Checkout: Checkout,
    
    ManageSubscription: ManageSubscription,
    
    ServiceAdvancedThreatProtection: ServiceAdvancedThreatProtection,
    
    ServiceEnterpriseWorkflowAutomation: ServiceEnterpriseWorkflowAutomation,
    
    ServiceAIPoweredRiskAssessment: ServiceAIPoweredRiskAssessment,
    
    GovernmentContracting: GovernmentContracting,
    
    AboutUs: AboutUs,
    
    StripeSetup: StripeSetup,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Analyze" element={<Analyze />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/ManageSubscription" element={<ManageSubscription />} />
                
                <Route path="/ServiceAdvancedThreatProtection" element={<ServiceAdvancedThreatProtection />} />
                
                <Route path="/ServiceEnterpriseWorkflowAutomation" element={<ServiceEnterpriseWorkflowAutomation />} />
                
                <Route path="/ServiceAIPoweredRiskAssessment" element={<ServiceAIPoweredRiskAssessment />} />
                
                <Route path="/GovernmentContracting" element={<GovernmentContracting />} />
                
                <Route path="/AboutUs" element={<AboutUs />} />
                
                <Route path="/StripeSetup" element={<StripeSetup />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}