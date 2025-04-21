"use client"

import Link from "next/link"
import { Home, Activity, Settings } from "lucide-react"

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="text-blue-600 dark:text-blue-500 font-bold text-xl">TrafficAuto</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              © {currentYear} TrafficAuto. All rights reserved.
            </p>
          </div>
          
          {/* Navigation links */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/select-services" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Services</span>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer