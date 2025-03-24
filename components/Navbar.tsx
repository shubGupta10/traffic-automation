"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const Navbar: FC = () => {
    const router = useRouter();
  return (
    <nav className="fixed w-full bg-gradient-to-r from-indigo-600/95 to-blue-600/95 backdrop-blur-md border-b border-white/10 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span onClick={() => {router.push("/")}} className="cursor-pointer text-2xl font-bold text-white">
            TrafficAuto
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            <a href="#features" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#technology" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              Technology
            </a>
            <a href="#about" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              About
            </a>
            <a href="#contact" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              Contact
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => {router.push("/login")}} size="sm" className="text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button size="sm" className="bg-white text-indigo-600 hover:bg-white/90">
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gradient-to-br from-indigo-600 to-blue-600">
              <div className="flex flex-col space-y-4 mt-8">
                <a href="#features" className="text-lg font-medium text-white/90 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#technology" className="text-lg font-medium text-white/90 hover:text-white transition-colors">
                  Technology
                </a>
                <a href="#about" className="text-lg font-medium text-white/90 hover:text-white transition-colors">
                  About
                </a>
                <a href="#contact" className="text-lg font-medium text-white/90 hover:text-white transition-colors">
                  Contact
                </a>
                <div className="pt-4 space-y-4">
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                    Sign In
                  </Button>
                  <Button className="w-full bg-white text-indigo-600 hover:bg-white/90">
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;