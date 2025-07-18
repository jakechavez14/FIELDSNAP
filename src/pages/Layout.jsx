

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  Camera,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: FileText,
  },
  {
    title: "New Report",
    url: createPageUrl("NewReport"),
    icon: PlusCircle,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

const bottomNavItems = [
  { name: 'Dashboard', href: createPageUrl('Dashboard'), icon: LayoutDashboard },
  { name: 'Reports', href: createPageUrl('Reports'), icon: FileText },
  { name: 'New', href: createPageUrl('NewReport'), icon: PlusCircle },
  { name: 'Settings', href: createPageUrl('Settings'), icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // These pages are public, no need to check for a user.
      if (currentPageName === 'ReportView' || currentPageName === 'Home' || currentPageName === 'Setup') {
        return;
      }
      try {
        await User.me();
      } catch (e) {
        // If User.me() fails, the user is not logged in. Redirect to home.
        navigate(createPageUrl('Home'));
      }
    };
    checkAuth();
  }, [location.pathname, currentPageName, navigate]);

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate(createPageUrl('Home'));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't show sidebar for public pages or the setup page
  if (currentPageName === 'ReportView' || currentPageName === 'Home' || currentPageName === 'Setup') {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: 251 146 60;
          --primary-foreground: 248 250 252;
          --secondary: 30 58 138;
          --secondary-foreground: 248 250 252;
          --accent: 241 245 249;
          --accent-foreground: 15 23 42;
          --muted: 248 250 252;
          --muted-foreground: 100 116 139;
          --border: 226 232 240;
          --input: 226 232 240;
          --ring: 251 146 60;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
        }
        
        .glass-effect {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="bg-white border-r border-slate-200 h-full flex flex-col">
          {/* Header */}
          <div className="gradient-bg border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white text-shadow">FieldSnap</h2>
                <p className="text-xs text-orange-100">Snap. Note. Send.</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.url 
                      ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-semibold text-sm">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-700 text-sm truncate">Professional</p>
                <p className="text-xs text-slate-500 truncate">Field Reports</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5 text-slate-500" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden fixed top-0 left-0 w-full z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">FieldSnap</h1>
          </div>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-semibold text-sm">P</span>
                  </span>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="sm:pl-64 pt-16 md:pt-0">
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <footer className="sm:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group transition-colors duration-200 ${
                location.pathname === item.href
                  ? 'text-orange-600'
                  : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold tracking-wide">{item.name}</span>
            </Link>
          ))}
        </div>
      </footer>

      {/* Spacer for bottom nav on mobile */}
      <div className="sm:hidden" style={{ height: '4rem' }}></div>
    </div>
  );
}

