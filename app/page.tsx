import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scan, Car, QrCode, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

const TrafficAutoHomepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <header className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 dark:from-blue-600/20 dark:to-cyan-600/20" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Next-Gen Traffic Management
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Intelligent Urban Mobility Solutions
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transform your city's traffic management with AI-powered automation, real-time monitoring, and smart analytics for safer, more efficient urban mobility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <img
                  src="/hero.png"
                  alt="Hero"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Core Features</Badge>
            <h2 className="text-3xl font-bold mb-6">Comprehensive Traffic Management</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our system combines cutting-edge technologies to deliver a complete traffic automation solution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Car className="w-12 h-12 text-blue-600" />,
                title: "Smart Vehicle Detection",
                description: "AI-powered number plate recognition and vehicle classification system."
              },
              {
                icon: <Scan className="w-12 h-12 text-cyan-600" />,
                title: "Real-time Monitoring",
                description: "Live traffic flow analysis and instant violation detection."
              },
              {
                icon: <Shield className="w-12 h-12 text-indigo-600" />,
                title: "Advanced Security",
                description: "Multi-layer security protocols with encrypted data transmission."
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 w-fit group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary">Advanced Technology</Badge>
              <h2 className="text-4xl font-bold">State-of-the-art Infrastructure</h2>
              <div className="space-y-6">
                {[
                  "AI-Powered Vehicle Recognition",
                  "Real-time Data Processing",
                  "Cloud-based Analytics",
                  "Secure Data Encryption"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <CheckCircle2 className="text-green-500 h-6 w-6" />
                    <span className="text-gray-700 dark:text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                Learn More
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 absolute blur-3xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <QrCode className="w-full h-full text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-90" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-white space-y-8">
            <h2 className="text-4xl font-bold">Ready to Transform Your City?</h2>
            <p className="text-lg opacity-90">
              Join the future of intelligent traffic management with our comprehensive automation solution.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">TrafficAuto</h3>
              <p className="text-gray-400">Intelligent traffic management solutions for smart cities.</p>
            </div>
            {['Products', 'Company', 'Resources', 'Legal'].map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold">{section}</h4>
                <ul className="space-y-2">
                  {['Features', 'Pricing', 'About Us', 'Contact'].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 TrafficAuto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrafficAutoHomepage;