"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/stores/useAuthStore"
import { ArrowLeft, RefreshCw, Users, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface DetectionData {
  _id: string
  userId: string
  vehicle_number: string
  vehicle_type: string
  helmet_detected: boolean
  helmet_detected_image_path: string
  image_path: string
  non_helmet_rider: boolean
  non_helmet_rider_image_path: string
  passenger_with_helmet: boolean
  passenger_with_helmet_image_path: string
}

const FetchApprovalPage = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const [detections, setDetections] = useState<DetectionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDetection, setSelectedDetection] = useState<DetectionData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      const authStorage = localStorage.getItem("auth-storage")
      if (!authStorage || !JSON.parse(authStorage).state.user?.isAdmin) {
        router.push("/login")
        return
      }
    } else if (!user.isAdmin) {
      router.push("/")
      return
    }

    fetchDetections()
  }, [user, router])

  const fetchDetections = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3000/api/admin/fetch-detections")

      if (!response.ok) {
        throw new Error("Failed to fetch detection data")
      }

      const result = await response.json()
      setDetections(result.data)
    } catch (error) {
      console.error("Error fetching detections:", error)
      setError("Failed to load detection data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDetection = async (id: string, field: string, value: boolean) => {
    try {
      // Create fields object with the field to update
      const fields = { [field]: value }

      const response = await fetch(`http://localhost:3000/api/admin/update-detections`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          fields,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update detection")
      }

      // Update local state to reflect the change
      setDetections(
        detections.map((detection) => (detection._id === id ? { ...detection, [field]: value } : detection)),
      )
    } catch (error) {
      console.error("Error updating detection:", error)
      alert("Failed to update detection. Please try again.")
    }
  }

  const openImageModal = (detection: DetectionData) => {
    setSelectedDetection(detection)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-8xl mx-auto p-4 md:p-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Detection Approvals
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Review and manage detection data submissions</p>
          </div>

          <Button
            onClick={fetchDetections}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="flex items-center text-xl">
              <Users className="mr-2 h-5 w-5 text-indigo-600" />
              Detection Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8">
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchDetections} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : detections.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No detection data available.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-center">Helmet Detected</TableHead>
                      <TableHead className="text-center">Non-Helmet Rider</TableHead>
                      <TableHead className="text-center">Passenger with Helmet</TableHead>
                      <TableHead className="text-center">Images</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detections.map((detection) => (
                      <TableRow key={detection._id}>
                        <TableCell className="font-mono text-xs">{detection._id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {detection.userId.substring(0, 8)}...
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{detection.vehicle_number}</span>
                            <span className="text-xs text-gray-500">{detection.vehicle_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={detection.helmet_detected}
                            onCheckedChange={(checked) =>
                              handleUpdateDetection(detection._id, "helmet_detected", checked)
                            }
                            className="data-[state=checked]:bg-green-500 cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={detection.non_helmet_rider}
                            onCheckedChange={(checked) =>
                              handleUpdateDetection(detection._id, "non_helmet_rider", checked)
                            }
                            className="data-[state=checked]:bg-red-500 cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={detection.passenger_with_helmet}
                            onCheckedChange={(checked) =>
                              handleUpdateDetection(detection._id, "passenger_with_helmet", checked)
                            }
                            className="data-[state=checked]:bg-blue-500 cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openImageModal(detection)}
                            className="text-indigo-600 border-indigo-200 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer"
                          >
                            View Images
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Detection Images</DialogTitle>
            </div>
            <DialogDescription>
              {selectedDetection && (
                <span className="text-sm text-gray-500 cursor-pointer">
                  Vehicle: {selectedDetection.vehicle_number} ({selectedDetection.vehicle_type})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedDetection && (
            <div className="grid grid-cols-1 gap-8 py-4">
              <div className="flex flex-col items-center">
                <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Image
                    src={selectedDetection.helmet_detected_image_path || "/api/placeholder/800/600"}
                    alt="Helmet detection image"
                    layout="fill"
                    objectFit="contain"
                    className="bg-gray-100 dark:bg-gray-900"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Helmet detected:</p>
                  <Switch
                    checked={selectedDetection.helmet_detected}
                    onCheckedChange={(checked) => {
                      handleUpdateDetection(selectedDetection._id, "helmet_detected", checked)
                      setSelectedDetection({
                        ...selectedDetection,
                        helmet_detected: checked,
                      })
                    }}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Image
                    src={selectedDetection.non_helmet_rider_image_path || "/api/placeholder/800/600"}
                    alt="Non-helmet rider image"
                    layout="fill"
                    objectFit="contain"
                    className="bg-gray-100 dark:bg-gray-900"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Non-helmet rider:</p>
                  <Switch
                    checked={selectedDetection.non_helmet_rider}
                    onCheckedChange={(checked) => {
                      handleUpdateDetection(selectedDetection._id, "non_helmet_rider", checked)
                      setSelectedDetection({
                        ...selectedDetection,
                        non_helmet_rider: checked,
                      })
                    }}
                    className="data-[state=checked]:bg-red-500"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Image
                    src={selectedDetection.passenger_with_helmet_image_path || "/api/placeholder/800/600"}
                    alt="Passenger with helmet image"
                    layout="fill"
                    objectFit="contain"
                    className="bg-gray-100 dark:bg-gray-900"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Passenger with helmet:</p>
                  <Switch
                    checked={selectedDetection.passenger_with_helmet}
                    onCheckedChange={(checked) => {
                      handleUpdateDetection(selectedDetection._id, "passenger_with_helmet", checked)
                      setSelectedDetection({
                        ...selectedDetection,
                        passenger_with_helmet: checked,
                      })
                    }}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FetchApprovalPage
