import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Briefcase, 
  Calendar, 
  Target, 
  MessageCircle, 
  TrendingUp, 
  Rocket, 
  Sparkles, 
  ExternalLink,
  Menu,
  Users 
} from "lucide-react";

import Testimonials from "./components/Testimonials";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProfileSetup from "./components/ProfileSetup";
import BuddyDiscovery from "./components/BuddyDiscovery";
import RequestManagement from "./components/RequestManagement";
import Chat from "./components/Chat";
import AdminLogin from "./components/AdminLogin";
import LegalFooter from "./components/LegalFooter";
import Tos from "./components/Tos";
import Privacy from "./components/Privacy";
import Refund from "./components/Refund";
const OnlineStatusBadge = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
        isOnline ? "bg-green-400" : "bg-red-400"
      }`}
    ></div>
  );
};

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

function AppContent() {
  const { user } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
  { name: 'Courses', href: 'https://aicollective.tech/courses', icon: BookOpen },
  { name: 'Jobs', href: 'https://aicollective.tech/jobs', icon: Briefcase },
  { name: 'Events', href: 'https://aicollective.tech/events', icon: Calendar },
  { name: 'Buddy Finder', href: '/', icon: Users },
];


  const adminUrl = import.meta.env.VITE_ADMIN_URL;
  const adminUrlEvents = import.meta.env.VITE_ADMIN_URL_EVENTS;

  const isActive = (path: string) => location.pathname === path; // Explicitly type path as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50' 
          : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <OnlineStatusBadge />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Collective
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Connect • Practice • Succeed</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
  const IconComponent = item.icon;
  const isExternal = item.href.startsWith("http");
  const itemClasses = `group relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
    isActive(isExternal ? item.href.replace("https://aicollective.tech", "") : item.href)
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
  }`;

  // External link buttons
  if (isExternal) {
    return (
      <a
        key={item.name}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClasses}
      >
        <span className="flex items-center space-x-2">
          <IconComponent size={16} className={isActive(item.href.replace("https://aicollective.tech", "")) ? 'text-white' : 'text-blue-600'} />
          <span>{item.name}</span>
          <ExternalLink size={14} className={isActive(item.href.replace("https://aicollective.tech", "")) ? 'text-white opacity-80' : 'text-blue-600 opacity-80'} />
        </span>
      </a>
    );
  }

  // Internal SPA Link
  return (
    <Link
      key={item.name}
      to={item.href}
      className={itemClasses}
    >
      <span className="flex items-center space-x-2">
        <IconComponent size={16} className={isActive(item.href) ? 'text-white' : 'text-blue-600'} />
        <span>{item.name}</span>
      </span>
    </Link>
  );
})}

            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <SignedIn>
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">
                      Welcome back!
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <div className="relative">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 rounded-xl shadow-lg ring-2 ring-blue-100"
                        }
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="lg:hidden">
                  <UserButton />
                </div>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-base rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <span>Sign In</span>
                    <Sparkles size={14} />
                  </button>
                </SignInButton>
              </SignedOut>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => {
  const IconComponent = item.icon;
  const isExternal = item.href.startsWith("http");
  const baseClasses = `block px-4 py-3 rounded-xl font-medium transition-all flex items-center space-x-3 ${
    isActive(isExternal ? item.href.replace("https://aicollective.tech", "") : item.href)
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
      : 'text-slate-700 hover:bg-blue-50'
  }`;

  if (isExternal) {
    return (
      <a
        key={item.name}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsMobileMenuOpen(false)}
        className={baseClasses}
      >
        <IconComponent size={18} className={isActive(item.href.replace("https://aicollective.tech", "")) ? 'text-white' : 'text-blue-600'} />
        <span>{item.name}</span>
        <ExternalLink size={14} className={isActive(item.href.replace("https://aicollective.tech", "")) ? 'text-white opacity-80' : 'text-blue-600 opacity-80'} />
      </a>
    );
  }

  return (
    <Link
      key={item.name}
      to={item.href}
      onClick={() => setIsMobileMenuOpen(false)}
      className={baseClasses}
    >
      <IconComponent size={18} className={isActive(item.href) ? 'text-white' : 'text-blue-600'} />
      <span>{item.name}</span>
    </Link>
  );
})}

            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 lg:pt-20 min-h-screen">
        <Routes>
          {/* Public Routes - Full Page Components */}
          
          <Route path={adminUrl} element={<AdminLogin />} />
          <Route path={adminUrlEvents} element={<AdminDashboard />} />

          {/* Home Route - Show Hero for signed out users, Dashboard for signed in */}
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <div className="relative overflow-hidden">
                    {/* Hero Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                      <div className="text-center relative z-10">
                        {/* Floating Elements */}
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-75"></div>
                        <div className="absolute -bottom-10 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-150"></div>

                        {/* Hero Content */}
                        <div className="relative">
                          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-blue-800 mb-6">
                            <Rocket size={16} className="text-blue-600" />
                            <span>Join 10,000+ Product Managers</span>
                          </div>
                          
                          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Find Your Perfect
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              PM Case Practice Buddy
                            </span>
                          </h2>
                          
                          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Connect with aspiring product managers at your experience level
                            and preparedness stage. Practice cases together and accelerate
                            your PM journey with personalized matching.
                          </p>

                          {/* CTA Buttons */}
                          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                            <SignInButton mode="modal">
                              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                                <span>Get Started Free</span>
                                <Sparkles size={20} />
                              </button>
                            </SignInButton>
                          </div>

                          {/* Feature Highlights */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
                            {[
                              { icon: Target, title: 'Smart Matching', desc: 'PM-powered buddy matching' },
                              { icon: MessageCircle, title: 'Real-time Chat', desc: 'Seamless communication' },
                              { icon: TrendingUp, title: 'Track Progress', desc: 'Monitor your improvement' }
                            ].map((feature, index) => {
                              const IconComponent = feature.icon;
                              return (
                                <div key={index} className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                  <div className="mb-4 group-hover:scale-110 transition-transform">
                                    <IconComponent size={40} className="text-blue-600" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {feature.title}
                                  </h3>
                                  <p className="text-slate-600">
                                    {feature.desc}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonials Section */}
                    <Testimonials />

                    {/* Background Pattern */}
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_70%)]"></div>
                    </div>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                    <Dashboard />
                  </div>
                </SignedIn>
              </>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile-setup"
            element={
              <SignedIn>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                  <ProfileSetup />
                </div>
              </SignedIn>
            }
          />
          <Route
            path="/discover"
            element={
              <SignedIn>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                  <BuddyDiscovery />
                </div>
              </SignedIn>
            }
          />
          <Route
            path="/requests"
            element={
              <SignedIn>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                  <RequestManagement />
                </div>
              </SignedIn>
            }
          />
          <Route
            path="/chat/:requestId"
            element={
              <SignedIn>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                  <Chat />
                </div>
              </SignedIn>
            }
          />
          <Route path="/terms" element={<Tos />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/refund" element={<Refund />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <LegalFooter/>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ConvexProvider client={convex}>
        <Router>
          <AppContent />
          <Toaster position="top-center" reverseOrder={false} />
        </Router>
      </ConvexProvider>
    </ClerkProvider>
  );
}