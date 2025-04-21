"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Home, BarChart3, Settings, PlusCircle, FormInputIcon, NotebookText } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: FC = () => {
  const router = useRouter();
  const { user, authToken, logout } = useAuthStore();
  console.log("Current User",user);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (authToken) {
        setIsAuthenticated(true);
      } else {
        const token = localStorage.getItem('auth-storage') ? 
          JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.authToken : null;
        
        setIsAuthenticated(!!token);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    checkAuth();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [authToken]);

  const handleLogout = () => {
    logout();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleGetStarted = () => {
    router.push("/register");
  };

  // Generate nav links based on user role
  const getNavLinks = () => {
    const links = [
      { name: "Home", icon: <Home className="h-4 w-4" />, path: "/" },
      { name: "Services", icon: <PlusCircle className="h-4 w-4" />, path: "/select-services" },
      { name: "Data Form", icon: <NotebookText className="h-4 w-4" />, path: "/data-form" },
    ];
    
    links.push({ name: "Dashboard", icon: <BarChart3 className="h-4 w-4" />, path: "/dashboard" });
    
    return links;
  };

  const getUserInitials = () => {
    if (!user?.email) return "TA";
    const parts = user.email.split('@')[0].split('.');
    return parts.map(part => part[0]?.toUpperCase() || "").join("");
  };

  return (
    <nav className={`sticky top-0 w-full bg-gradient-to-r from-indigo-600 to-blue-600 z-50 transition-all duration-300 ${scrolled ? 'shadow-md border-b border-white/10 py-2' : 'py-3'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span 
            onClick={() => {router.push("/")}} 
            className="cursor-pointer text-2xl font-bold text-white flex items-center"
          >
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="white" fillOpacity="0.5" />
            </svg>
            TrafficAuto
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              {getNavLinks().map((link) => (
                <TooltipProvider key={link.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        onClick={() => router.push(link.path)}
                        className="text-white hover:bg-white/10 hover:text-white cursor-pointer flex items-center gap-2"
                      >
                        {link.icon}
                        {link.name}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}

          <div className="flex items-center ml-4">
            {isAuthenticated ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-0 h-10 w-10 text-sm bg-white/10 hover:bg-white/20 cursor-pointer">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-700 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    {user?.email && (
                      <div className="px-2 py-1.5 text-sm text-gray-500">{user.email}</div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer hover:text-white">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/select-services")} className="cursor-pointer hover:text-white">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Select Services</span>
                    </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/data-form")} className="cursor-pointer hover:text-white">
                        <FormInputIcon className="mr-2 h-4 w-4" />
                        <span>Data Form</span>
                      </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer hover:text-white">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={handleLogin} 
                  size="sm" 
                  className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleGetStarted}
                  className="bg-white text-indigo-600 hover:bg-white/90 cursor-pointer"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 cursor-pointer">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-l border-white/10">
              <div className="flex flex-col space-y-4 mt-8">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 mb-6">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-700 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      {user?.email && (
                        <div className="text-white/90 font-medium truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {getNavLinks().map((link) => (
                        <Button 
                          key={link.path}
                          variant="ghost" 
                          onClick={() => router.push(link.path)}
                          className="w-full justify-start text-white hover:bg-white/10 hover:text-white cursor-pointer flex items-center gap-3"
                        >
                          {link.icon}
                          {link.name}
                        </Button>
                      ))}
                      
                      <Button 
                        variant="ghost" 
                        onClick={() => router.push("/profile")}
                        className="w-full justify-start text-white hover:bg-white/10 hover:text-white cursor-pointer flex items-center gap-3"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                    
                    <div className="pt-6">
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout} 
                        className="w-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center gap-2"
                      >
                        <LogOut className="h-5 w-5" /> Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="pt-4 space-y-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLogin}
                      className="w-full text-white bg-white/10 hover:bg-white/20 hover:text-white cursor-pointer border-white/20"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={handleGetStarted}
                      className="w-full bg-white text-indigo-600 hover:bg-white/90 cursor-pointer"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;