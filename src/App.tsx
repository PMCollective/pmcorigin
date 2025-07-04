import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./components/Dashboard";
import ProfileSetup from "./components/ProfileSetup";
import BuddyDiscovery from "./components/BuddyDiscovery";
import RequestManagement from "./components/RequestManagement";
import Chat from "./components/Chat";
import { Courses } from "./components/Courses"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

function AppContent() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">PM Collective</h1>
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-500">Buddy Finder</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <SignedIn>
                <Link to="/courses" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Courses
                </Link>
                <span className="hidden sm:inline text-sm text-gray-700">Welcome, {user?.firstName}</span>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <SignedOut>
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect PM Case Practice Buddy
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Connect with aspiring product managers at your experience level and preparedness stage. 
              Practice cases together and accelerate your PM journey.
            </p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-md text-base sm:text-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/discover" element={<BuddyDiscovery />} />
            <Route path="/requests" element={<RequestManagement />} />
            <Route path="/chat/:requestId" element={<Chat />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SignedIn>
      </main>
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
        </Router>
      </ConvexProvider>
    </ClerkProvider>
  );
}
