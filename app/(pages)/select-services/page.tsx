"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Car, Shield, FileSearch, LogOut, ChevronRight, Camera, X } from 'lucide-react';

const SelectServices = () => {
  const router = useRouter();
  const { user, authToken, logout } = useAuthStore();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [currentService, setCurrentService] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Check authentication from localStorage directly as a fallback
    if (!user || !authToken) {
      // Try to get from localStorage directly
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage || !JSON.parse(authStorage).state.user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    
    // Clean up camera stream when component unmounts
    return () => {
      stopCamera();
    };
  }, [user, authToken, router]);

  const handleLogout = () => {
    stopCamera();
    logout();
    localStorage.removeItem('auth-storage');
    router.push('/login');
  };

  // Start camera stream
  const startCamera = async (serviceTitle: string) => {
    try {
      // Stop any existing stream
      stopCamera();
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // Use back camera on mobile if available
        audio: false 
      });
      
      // Store stream reference for cleanup
      streamRef.current = stream;
      
      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Show camera view and set current service
      setShowCamera(true);
      setCurrentService(serviceTitle);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions and try again.");
    }
  };
  
  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setShowCamera(false);
    setCurrentService(null);
  };

  const handleServiceSelect = (serviceTitle: string) => {
    startCamera(serviceTitle);
  };

  // Take a snapshot from the camera
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw the current video frame to the canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to image data
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Here you would typically send this image to your backend for processing
      console.log(`Processing ${currentService} image`, imageData.substring(0, 100) + '...');
      
      // For demo purposes, simulating successful scan
      alert(`${currentService} scan complete! Processing results...`);
      
      // Close camera after taking snapshot
      stopCamera();
    }
  };

  // Get user data from localStorage if not available in store
  const getUserData = () => {
    if (user) return user;
    
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsedStorage = JSON.parse(authStorage);
        return parsedStorage.state.user;
      }
    } catch (error) {
      console.error("Error parsing auth storage:", error);
    }
    
    return null;
  };
  
  const userData = getUserData();
  
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const services = [
    {
      id: 'vehicle-type-detect',
      title: 'Vehicle Type Detection',
      description: 'Automatically identify and classify different vehicle types (cars, trucks, bikes, etc.) using our advanced AI recognition system.',
      detail: 'Classify vehicles by make, model, and type with precision.',
      icon: <Car className="h-10 w-10" />
    },
    {
      id: 'helmet-detect', 
      title: 'Helmet Detection',
      description: 'Monitor and verify helmet usage for riders with real-time detection technology that ensures safety compliance.',
      detail: 'Keep riders safe with automated helmet verification.',
      icon: <Shield className="h-10 w-10" />
    },
    {
      id: 'number-plate',
      title: 'Number Plate Recognition',
      description: 'Scan and recognize vehicle registration plates with high accuracy for identification and verification purposes.',
      detail: 'Instantly capture and process vehicle registration details.',
      icon: <FileSearch className="h-10 w-10" />
    }
  ];

  // Use email from the user object based on your data structure
  const userEmail = userData.email || "user";
  const displayName = userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="bg-gray-900 p-4 flex justify-between items-center">
            <h2 className="text-white text-lg font-medium">{currentService}</h2>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white" 
              onClick={stopCamera}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-grow relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Camera guide overlay */}
            <div className="absolute inset-0 border-2 border-white border-opacity-50 m-8 pointer-events-none"></div>
          </div>
          
          <div className="bg-gray-900 p-4 flex justify-center">
            <Button
              onClick={takeSnapshot}
              className="rounded-full h-16 w-16 bg-white hover:bg-gray-200 flex items-center justify-center"
            >
              <Camera className="h-8 w-8 text-gray-900" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header with greeting and logout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {greeting}, {displayName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              Select a service to get started
            </p>
          </div>
        </div>

        {/* Service selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card 
              key={service.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:translate-y-[-4px] group h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
              <CardContent className="p-0 h-full">
                <div className="p-8 flex flex-col h-full">
                  {/* Icon Header */}
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-3 text-white mr-4">
                      {service.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{service.title}</h2>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                    {service.description}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <p className="text-gray-500 text-sm mb-6 italic">
                      "{service.detail}"
                    </p>
                    
                    <Button 
                      className="cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 group-hover:shadow-md transition-all"
                      onClick={() => handleServiceSelect(service.title)}
                    >
                      Open Camera
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectServices;