

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GraduationCap, User, Home, Target, PenTool, CheckSquare, Award, Heart, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Application",
    url: createPageUrl("Application"),
    icon: User,
  },
  {
    title: "My Results", 
    url: createPageUrl("Recommendations"),
    icon: Target,
  },
  {
    title: "My Colleges",
    url: createPageUrl("SelectedColleges"),
    icon: Heart,
  },
  {
    title: "Essay Coach",
    url: createPageUrl("EssayCoach"),
    icon: PenTool,
  },
  {
    title: "Applications",
    url: createPageUrl("ApplicationTracker"),
    icon: CheckSquare,
  },
  {
    title: "Scholarships",
    url: createPageUrl("ScholarshipFinder"),
    icon: Award,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700 shadow-sm backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-100" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                  CollegeMatch
                </h1>
                <p className="text-sm text-gray-400 font-medium">Your Complete College Journey</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    location.pathname === item.url
                      ? 'bg-blue-900/60 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="text-gray-300">
                      {currentUser.displayName || currentUser.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 overflow-x-auto">
        <div className="flex min-w-max">
          <nav className="flex gap-1 p-2">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 ${
                  location.pathname === item.url
                    ? 'bg-blue-900/60 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="truncate">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-gray-100">CollegeMatch</span>
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              Your comprehensive platform for college applications, essay coaching, and scholarship discovery.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

