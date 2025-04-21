"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Shield, FileSearch, ArrowRight, CheckCircle2, Play, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/useAuthStore"

const TrafficAutoHomepage: React.FC = () => {
  const {user} = useAuthStore()
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: false })

  const featuresRef = useRef<HTMLDivElement>(null)
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 })

  const ctaRef = useRef<HTMLDivElement>(null)
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.5 })

  // Services data - using the exact data provided
  const services = [
    {
      id: "vehicle-type-detect",
      title: "Vehicle Type Detection",
      description:
        "Automatically identify and classify different vehicle types (cars, trucks, bikes, etc.) using our advanced AI recognition system.",
      detail: "Classify vehicles by make, model, and type with precision.",
      icon: <Car className="h-10 w-10" />,
    },
    {
      id: "helmet-detect",
      title: "Helmet Detection",
      description:
        "Monitor and verify helmet usage for riders with real-time detection technology that ensures safety compliance.",
      detail: "Keep riders safe with automated helmet verification.",
      icon: <Shield className="h-10 w-10" />,
    },
    {
      id: "number-plate",
      title: "Number Plate Recognition",
      description:
        "Scan and recognize vehicle registration plates with high accuracy for identification and verification purposes.",
      detail: "Instantly capture and process vehicle registration details.",
      icon: <FileSearch className="h-10 w-10" />,
    },
  ]

  // Benefits of each service
  const serviceBenefits = [
    "Accurate vehicle classification for traffic management",
    "Enhanced road safety with helmet compliance monitoring",
    "Efficient vehicle identification through plate recognition",
    "Real-time processing for immediate results",
    "Secure data handling with privacy protection",
    "Easy integration with existing traffic systems",
  ]

  const handleGetStarted = () => {
    {user ? router.push("/dashboard") : router.push("/register")}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <header ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 dark:from-blue-600/10 dark:to-cyan-600/10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-1.5 text-sm"
                >
                  Traffic Management Solution
                </Badge>
              </motion.div>

              <motion.h1
                className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-gray-700 dark:from-white dark:via-blue-300 dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Intelligent Traffic Monitoring System
              </motion.h1>

              <motion.p
                className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                Transform your traffic management with AI-powered vehicle detection, helmet compliance monitoring, and
                number plate recognition.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <Button
                onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 group cursor-pointer hover:text-blue-600 hover:border-blue-600 transition-colors dark:hover:text-blue-400 dark:hover:border-blue-400"
                >
                  <Play className="mr-2 h-4 w-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
                  <img
                    src="/dashboard-image.png"
                    alt="Traffic Management Dashboard"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Detection Rate</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">High Accuracy</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 dark:from-blue-600/10 dark:to-cyan-600/10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              Core Services
            </Badge>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Our Traffic Management Solutions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              TrafficAuto provides three powerful services to enhance traffic monitoring and safety.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full cursor-pointer"
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-gray-800 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  <CardHeader>
                    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 w-fit text-white group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">"{service.detail}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-1.5"
              >
                How It Works
              </Badge>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Advanced Traffic Monitoring
              </h2>
              <div className="space-y-6">
                {serviceBenefits.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                      <CheckCircle2 className="text-white h-5 w-5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">{item}</span>
                  </motion.div>
                ))}
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 cursor-pointer"
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isFeaturesInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src="/features-image.png"
                    alt="Traffic Monitoring System"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center text-black space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Ready to Enhance Your Traffic Monitoring?
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Start using TrafficAuto today for vehicle detection, helmet compliance, and number plate recognition.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Button
              onClick={handleGetStarted}
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Get Started Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>

            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

export default TrafficAutoHomepage