
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { apiClient } from "@/utils/apiClient";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileScan, LogOut, LogIn, Menu, X, Building } from "lucide-react";
import Footer from "../components/Footer";

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
        const { user: currentUser } = await apiClient.getMe();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
      setIsLoading(false);
    };
    fetchUser();
    setIsMenuOpen(false); // Close menu on page change
  }, [location.pathname]);

  const handleLogout = async () => {
    await apiClient.logout();
    localStorage.removeItem('authToken');
    setUser(null);
    navigate(createPageUrl("Home"));
  };

  const handleLogin = async () => {
    // This will depend on your auth flow.
    // For now, we'll navigate to a login page.
    navigate('/login');
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
}
