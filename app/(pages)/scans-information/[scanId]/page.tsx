"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import {
  CheckCircle,
  XCircle,
  MapPin,
  Car,
  BikeIcon as Motorcycle,
  Truck,
  Clock,
  AlertTriangle,
  ArrowLeft,
  User,
  GaugeCircle,
  Share2,
  Info,
  Shield,
  Hash,
  FileText,
  Database,
  Tag,
  Printer,
  Download,
  FileWarning,
  RotateCcw,
  FileBarChart,
  Layers,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface ScanData {
  _id: string
  userId: string
  vehicle_number: string
  vehicle_type: string
  helmet_detected: boolean
  number_plate_type: string
  image_path: string
  location: string
  non_helmet_rider: boolean
  passenger_with_helmet: boolean
  vehicle_speed: number
  timestamp: string
  __v: number
}

function ScanInformation() {
  const { scanId } = useParams()
  const [scanData, setScanData] = useState<ScanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAuthStore()
  const router = useRouter()

  const userDisplayName = user?.name || user?.email?.split("@")[0] || "User"

  useEffect(() => {
    const fetchSingleScan = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/fetch-single-scans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scanId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch scan data")
        }

        const data = await response.json()
        setScanData(data.scanData)
      } catch (error: any) {
        console.error("Failed to fetch data", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (scanId) {
      fetchSingleScan()
    }
  }, [scanId, retryCount])

  // Format timestamp to readable date and time
  const formatDateTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format timestamp to get just the date
  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format timestamp to get just the time
  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get vehicle icon based on type
  const getVehicleIcon = () => {
    if (!scanData) return <Car className="h-5 w-5" />

    switch (scanData.vehicle_type.toLowerCase()) {
      case "car":
        return <Car className="h-5 w-5" />
      case "motorcycle":
      case "bike":
        return <Motorcycle className="h-5 w-5" />
      case "truck":
        return <Truck className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  // Generate data for pie chart - only using actual scan data
  const getPieChartData = () => {
    if (!scanData) return []

    const data = []

    // Only add data points that are true
    if (scanData.helmet_detected) {
      data.push({ name: "Helmet Detected", value: 1, fill: "#10b981" })
    } else {
      data.push({ name: "No Helmet", value: 1, fill: "#ef4444" })
    }

    if (scanData.non_helmet_rider) {
      data.push({ name: "Non-Helmet Rider", value: 1, fill: "#f59e0b" })
    }

    if (scanData.passenger_with_helmet) {
      data.push({ name: "Passenger with Helmet", value: 1, fill: "#3b82f6" })
    } else {
      data.push({ name: "Passenger without Helmet", value: 1, fill: "#ec4899" })
    }

    return data
  }

  // Generate bar chart data for violations - only using actual scan data
  const getViolationData = () => {
    if (!scanData) return []

    const violations = []

    // Only add actual violations
    if (!scanData.helmet_detected) {
      violations.push({ name: "No Helmet", value: 1 })
    }

    if (scanData.non_helmet_rider) {
      violations.push({ name: "Non-Helmet Rider", value: 1 })
    }

    if (!scanData.passenger_with_helmet) {
      violations.push({ name: "No Passenger Helmet", value: 1 })
    }

    if (scanData.vehicle_speed > 30) {
      violations.push({ name: "Speed Limit", value: 1 })
    }

    // If no violations, show compliance
    if (violations.length === 0) {
      violations.push({ name: "Fully Compliant", value: 1 })
    }

    return violations
  }

  // Generate compliance score based on actual data
  const getComplianceScore = () => {
    if (!scanData) return 0

    let score = 100
    if (!scanData.helmet_detected) score -= 40
    if (scanData.non_helmet_rider) score -= 30
    if (!scanData.passenger_with_helmet) score -= 20
    if (scanData.vehicle_speed > 30) score -= 10

    return Math.max(0, score)
  }

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899"]
  const COMPLIANCE_COLOR = getComplianceScore() >= 80 ? "#10b981" : getComplianceScore() >= 50 ? "#f59e0b" : "#ef4444"

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  // Share functionality
  const handleShare = () => {
    const url = window.location.href

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: `Vehicle Scan: ${scanData?.vehicle_number}`,
          text: `Check out this vehicle scan for ${scanData?.vehicle_number}`,
          url: url,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
          copyToClipboard(url)
        })
    } else {
      copyToClipboard(url)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Link copied to clipboard. You can now share it with others.")
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        alert("Failed to copy link. Please try again.")
      })
  }

  // Handle print scan report
  const handlePrintReport = () => {
    window.print()
  }

  // Handle generate report
  const handleGenerateReport = () => {
    setIsGeneratingReport(true)

    // Generate report with actual data
    setTimeout(() => {
      setIsGeneratingReport(false)
      // Download report with actual scan data
      const element = document.createElement("a")
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(scanData, null, 2)),
      )
      element.setAttribute("download", `scan-report-${scanData?._id?.substring(0, 8)}.json`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 1500)
  }

  // Handle retry
  const handleRetry = () => {
    setRetryCount((prevCount) => prevCount + 1)
  }

  // Loading state with better animation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading scan information...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Retrieving data for scan ID: {scanId}</p>
        </div>
      </div>
    )
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
              <FileWarning className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Error Loading Scan</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3 w-full">
              <Button onClick={handleRetry} variant="outline" className="w-1/2">
                <RotateCcw className="h-4 w-4 mr-2" /> Retry
              </Button>
              <Button onClick={handleBackToDashboard} className="w-1/2">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!scanData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Scan Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The requested scan information could not be found.</p>
            <Button onClick={handleBackToDashboard} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button and Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToDashboard}
              className="h-10 w-10 rounded-full cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Scan Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {scanData._id.substring(0, 8)}...</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Badge
              className={`px-3 py-1 text-sm ${
                !scanData.helmet_detected || scanData.non_helmet_rider
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {!scanData.helmet_detected || scanData.non_helmet_rider ? "Warning: Helmet Issue" : "Compliant"}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 text-sm">
              {scanData.vehicle_type}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 text-sm">
              {scanData.number_plate_type} Plate
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 mb-6 flex overflow-x-auto hide-scrollbar">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="flex-1 whitespace-nowrap"
            onClick={() => setActiveTab("overview")}
          >
            <Layers className="h-4 w-4 mr-2" /> Overview
          </Button>
          <Button
            variant={activeTab === "analysis" ? "default" : "ghost"}
            className="flex-1 whitespace-nowrap"
            onClick={() => setActiveTab("analysis")}
          >
            <FileBarChart className="h-4 w-4 mr-2" /> Analysis
          </Button>
          <Button
            variant={activeTab === "technical" ? "default" : "ghost"}
            className="flex-1 whitespace-nowrap"
            onClick={() => setActiveTab("technical")}
          >
            <FileText className="h-4 w-4 mr-2" /> Technical Details
          </Button>
        </div>

        {/* Main Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Scan Overview */}
            <Card className="col-span-1 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {getVehicleIcon()}
                    <span>{scanData.vehicle_number}</span>
                  </CardTitle>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                    {scanData.number_plate_type}
                  </Badge>
                </div>
                <CardDescription className="text-blue-100">
                  {formatDate(scanData.timestamp)} at {formatTime(scanData.timestamp)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-md">
                    <img
                      src={scanData.image_path || "/placeholder.svg"}
                      alt="Vehicle scan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-500 hover:bg-blue-600">{scanData.vehicle_type}</Badge>
                        <Badge className="bg-white/20 text-white">{scanData.vehicle_speed} km/h</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Location</span>
                    <span className="font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {scanData.location}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Date & Time</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {formatDateTime(scanData.timestamp)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Speed</span>
                    <span className="font-medium flex items-center gap-1">
                      <GaugeCircle className="h-4 w-4 text-blue-500" />
                      {scanData.vehicle_speed} km/h
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Scanned By</span>
                    <span className="font-medium flex items-center gap-1">
                      <User className="h-4 w-4 text-blue-500" />
                      {userDisplayName}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={handlePrintReport}
                >
                  <Printer className="h-4 w-4" /> Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Export
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Right Column - Compliance Score */}
            <div className="lg:col-span-2 space-y-6">
              {/* Compliance Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Compliance Assessment
                    </span>
                    <span className="text-2xl font-bold" style={{ color: COMPLIANCE_COLOR }}>
                      {getComplianceScore()}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Helmet Detection */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                      <div className="mb-2">
                        {scanData.helmet_detected ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                      <h4 className="font-medium text-center">Helmet Detection</h4>
                      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        {scanData.helmet_detected ? "Helmet properly worn" : "No helmet detected"}
                      </p>
                    </div>

                    {/* Non-Helmet Rider - Only show if true */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                      <div className="mb-2">
                        {scanData.non_helmet_rider ? (
                          <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        )}
                      </div>
                      <h4 className="font-medium text-center">Rider Status</h4>
                      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        {scanData.non_helmet_rider ? "Additional rider without helmet" : "All riders compliant"}
                      </p>
                    </div>

                    {/* Passenger Helmet */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                      <div className="mb-2">
                        {scanData.passenger_with_helmet ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                      <h4 className="font-medium text-center">Passenger Helmet</h4>
                      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        {scanData.passenger_with_helmet ? "Passenger wearing helmet" : "Passenger without helmet"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 border-t pt-4 dark:border-gray-700">
                    <h4 className="font-medium mb-2">Violation Assessment</h4>
                    <div className="text-sm">
                      <ul className="space-y-2">
                        {!scanData.helmet_detected && (
                          <li className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span>Driver not wearing a helmet - major safety violation</span>
                          </li>
                        )}
                        {/* Only show non-helmet rider violation if it's true */}
                        {scanData.non_helmet_rider && (
                          <li className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span>Additional rider without helmet detected - safety violation</span>
                          </li>
                        )}
                        {!scanData.passenger_with_helmet && (
                          <li className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span>Passenger without helmet - safety violation</span>
                          </li>
                        )}
                        {scanData.vehicle_speed > 30 && (
                          <li className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span>Speed exceeds recommended limit - potential risk</span>
                          </li>
                        )}
                        {scanData.helmet_detected &&
                          !scanData.non_helmet_rider &&
                          scanData.passenger_with_helmet &&
                          scanData.vehicle_speed <= 30 && (
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>No safety violations detected</span>
                            </li>
                          )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Safety Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!scanData.helmet_detected && (
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                          <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Helmet Required</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Driver must wear a helmet at all times when operating this vehicle. This is a critical
                            safety requirement.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Only show if non_helmet_rider is true */}
                    {scanData.non_helmet_rider && (
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">All Riders Need Helmets</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Every person on a two-wheeler must wear a proper helmet. Non-compliance may result in
                            penalties.
                          </p>
                        </div>
                      </div>
                    )}

                    {!scanData.passenger_with_helmet && (
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Passenger Helmet Required</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Passengers must also wear helmets. This is both a legal requirement and essential for
                            safety.
                          </p>
                        </div>
                      </div>
                    )}

                    {scanData.vehicle_speed > 30 && (
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                          <GaugeCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Speed Limit Reminder</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Maintain appropriate speed for conditions. Current speed ({scanData.vehicle_speed} km/h) may
                            be unsafe in certain areas.
                          </p>
                        </div>
                      </div>
                    )}

                    {scanData.helmet_detected &&
                      !scanData.non_helmet_rider &&
                      scanData.passenger_with_helmet &&
                      scanData.vehicle_speed <= 30 && (
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Fully Compliant</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              All safety requirements are being met. Continue to maintain these safe practices.
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Helmet Analysis Chart - Only using actual scan data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Helmet Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getPieChartData().length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPieChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No helmet data available for analysis</p>
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>This chart visualizes the actual helmet compliance status detected in this scan:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Green segments indicate proper helmet usage</li>
                    <li>Red segments indicate no helmet detected</li>
                    <li>Yellow segments indicate additional riders without helmets</li>
                    <li>Blue segments represent passenger with helmet</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Violation Analysis Chart - Only using actual scan data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  Violation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getViolationData().length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getViolationData()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill={getViolationData()[0].name === "Fully Compliant" ? "#10b981" : "#f59e0b"}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No violation data available for analysis</p>
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>This chart shows actual violations detected in this specific scan:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>A value of 1 indicates a detected violation</li>
                    <li>Green bars indicate full compliance</li>
                    <li>Yellow/orange bars represent areas requiring attention</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Current Compliance Score - Only using actual scan data */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Compliance Score
                </CardTitle>
                <CardDescription>Current compliance score based on this scan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6">
                  <div
                    className="w-48 h-48 rounded-full flex items-center justify-center text-4xl font-bold mb-6"
                    style={{
                      background: `conic-gradient(${COMPLIANCE_COLOR} ${getComplianceScore()}%, #e5e7eb ${getComplianceScore()}% 100%)`,
                      color: COMPLIANCE_COLOR,
                    }}
                  >
                    <div className="w-40 h-40 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {getComplianceScore()}%
                    </div>
                  </div>

                  <div className="text-center max-w-md">
                    <h3 className="text-xl font-semibold mb-2">
                      {getComplianceScore() >= 80
                        ? "Excellent Compliance"
                        : getComplianceScore() >= 50
                          ? "Moderate Compliance"
                          : "Poor Compliance"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {getComplianceScore() >= 80
                        ? "This vehicle meets most or all safety requirements. Continue maintaining these standards."
                        : getComplianceScore() >= 50
                          ? "This vehicle has some safety concerns that should be addressed soon."
                          : "This vehicle has significant safety violations that require immediate attention."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "technical" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Technical Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Technical Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">Scan ID</div>
                    <div className="col-span-2 font-mono text-sm">{scanData._id}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">User ID</div>
                    <div className="col-span-2 font-mono text-sm">{scanData.userId}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">Vehicle Number</div>
                    <div className="col-span-2 font-medium">{scanData.vehicle_number}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">Vehicle Type</div>
                    <div className="col-span-2">{scanData.vehicle_type}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">Plate Type</div>
                    <div className="col-span-2">{scanData.number_plate_type}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">Location</div>
                    <div className="col-span-2">{scanData.location}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">Timestamp</div>
                    <div className="col-span-2">{formatDateTime(scanData.timestamp)}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 rounded-lg">
                    <div className="col-span-1 text-gray-500 dark:text-gray-400">Image Path</div>
                    <div className="col-span-2 font-mono text-xs break-all">{scanData.image_path}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detection Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-blue-500" />
                  Detection Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Helmet Detected</div>
                      <div className="flex items-center gap-2">
                        {scanData.helmet_detected ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">{scanData.helmet_detected ? "Yes" : "No"}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Non-Helmet Rider</div>
                      <div className="flex items-center gap-2">
                        {scanData.non_helmet_rider ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <span className="font-medium">{scanData.non_helmet_rider ? "Yes" : "No"}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Passenger with Helmet</div>
                      <div className="flex items-center gap-2">
                        {scanData.passenger_with_helmet ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">{scanData.passenger_with_helmet ? "Yes" : "No"}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Vehicle Speed</div>
                      <div className="flex items-center gap-2">
                        {scanData.vehicle_speed > 30 ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <span className="font-medium">{scanData.vehicle_speed} km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      Raw Detection Data
                    </h4>
                    <pre className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded text-xs font-mono overflow-x-auto">
                      {JSON.stringify(
                        {
                          helmet_detected: scanData.helmet_detected,
                          non_helmet_rider: scanData.non_helmet_rider,
                          passenger_with_helmet: scanData.passenger_with_helmet,
                          vehicle_speed: scanData.vehicle_speed,
                          vehicle_number: scanData.vehicle_number,
                          number_plate_type: scanData.number_plate_type,
                          location: scanData.location,
                          timestamp: scanData.timestamp,
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JSON Data Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Complete JSON Data
                </CardTitle>
                <CardDescription>Raw data from the scan in JSON format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <pre className="text-xs font-mono overflow-x-auto">{JSON.stringify(scanData, null, 2)}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <>
                        <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" /> Export JSON
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScanInformation
