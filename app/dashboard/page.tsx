"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Activity, CheckCircle, Car, Truck, Clock } from "lucide-react"

interface Scan {
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

interface User {
  id?: string
  email?: string
}

interface VehicleTypeData {
  name: string
  value: number
}

interface DailyScansData {
  name: string
  scans: number
}

function Dashboard() {
  const { user } = useAuthStore()
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly")
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [userDisplayName, setUserDisplayName] = useState<string>("") // Start with empty string
  const router = useRouter()

  // Move user data fetching to useEffect to avoid hydration mismatch
  useEffect(() => {
    const getUserData = (): User | null => {
      if (user) return user

      try {
        const authStorage = localStorage.getItem("auth-storage")
        if (authStorage) {
          const parsedStorage = JSON.parse(authStorage)
          return parsedStorage.state.user
        }
      } catch (error) {
        console.error("Error parsing auth storage:", error)
      }

      return null
    }

    const userData = getUserData()
    setUserDisplayName(userData?.email?.split("@")[0] || "User")
  }, [user])

  useEffect(() => {
    const fetchUserScans = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/fetch-scans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        })
        const result = await response.json()
        console.log("User Scans", result)
        if (result.data) {
          setScans(result.data)
        }
      } catch (error) {
        console.error("Error fetching scans:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchUserScans()
    }
  }, [user])

  // Navigate to scan details
  const handleScanClick = (scanId: string) => {
    router.push(`/scans-information/${scanId}`)
  }

  // Generate data for vehicle type chart
  const getVehicleTypeData = (): VehicleTypeData[] => {
    const vehicleTypes: Record<string, number> = {}

    scans.forEach((scan) => {
      if (scan.vehicle_type) {
        vehicleTypes[scan.vehicle_type] = (vehicleTypes[scan.vehicle_type] || 0) + 1
      }
    })

    return Object.keys(vehicleTypes).map((type) => ({
      name: type,
      value: vehicleTypes[type],
    }))
  }

  // Generate data for daily scans chart
  const getDailyScansData = (): DailyScansData[] => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dailyCounts = Array(7).fill(0)

    scans.forEach((scan) => {
      const date = new Date(scan.timestamp)
      const dayIndex = date.getDay() // 0 is Sunday, 1 is Monday, etc.
      dailyCounts[dayIndex]++
    })

    return days.map((day, index) => ({
      name: day,
      scans: dailyCounts[index],
    }))
  }

  const COLORS = ["#3b82f6", "#4f46e5", "#8b5cf6", "#6366f1"]

  // Format timestamp to readable date
  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString()
  }

  // Simplified status icon function
  const getStatusBadge = (status: string): React.ReactElement => {
    const styles: Record<string, string> = {
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>
  }

  // Determine scan status based on properties
  const getScanStatus = (scan: Scan): string => {
    if (scan.non_helmet_rider) {
      return "warning"
    }
    return "success"
  }

  // Check if there is data for charts
  const hasVehicleTypeData = getVehicleTypeData().length > 0
  const hasDailyScansData = scans.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {/* Only show welcome message when userDisplayName is available */}
              {userDisplayName && `Welcome back, ${userDisplayName}`}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Scans</p>
                  <p className="text-2xl font-bold mt-2">{scans.length}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Helmet Issues</p>
                  <p className="text-2xl font-bold mt-2">{scans.filter((scan) => scan.non_helmet_rider).length}</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-2">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Speed</p>
                  <p className="text-2xl font-bold mt-2">
                    {scans.length
                      ? (scans.reduce((sum, scan) => sum + (scan.vehicle_speed || 0), 0) / scans.length).toFixed(1)
                      : "0"}{" "}
                    km/h
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2">
                  <Car className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Scans Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Scan Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : hasDailyScansData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getDailyScansData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="scans" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No data found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : hasVehicleTypeData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getVehicleTypeData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getVehicleTypeData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No data found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading scans...</p>
              </div>
            ) : scans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No data found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-4 pl-0">Vehicle</th>
                      <th className="text-left font-medium p-4">Number Plate</th>
                      <th className="text-left font-medium p-4">Helmet Status</th>
                      <th className="text-left font-medium p-4">Location</th>
                      <th className="text-left font-medium p-4">Time</th>
                      <th className="text-left font-medium p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((scan) => (
                      <tr
                        key={scan._id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleScanClick(scan._id)}
                      >
                        <td className="p-4 pl-0">
                          <div className="flex items-center gap-2">
                            {scan.vehicle_type === "Car" ? <Car className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                            {scan.vehicle_type}
                          </div>
                        </td>
                        <td className="p-4">{scan.vehicle_number}</td>
                        <td className="p-4">
                          {scan.helmet_detected ? (
                            <span className="text-green-600 font-medium">Helmet Detected</span>
                          ) : (
                            <span className="text-red-600 font-medium">No Helmet</span>
                          )}
                        </td>
                        <td className="p-4">{scan.location}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(scan.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(getScanStatus(scan))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard