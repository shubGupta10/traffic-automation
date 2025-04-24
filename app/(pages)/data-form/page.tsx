"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from '@/stores/useAuthStore';
import { UploadIcon, MapPin, Save, ArrowLeft, Image } from 'lucide-react';

const DetectionForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_number: '',
    vehicle_type: 'Car',
    helmet_detected: false, // keeping the boolean field
    helmet_detected_image_path: '', // adding new image path field
    number_plate_type: 'White',
    image_path: '/uploads/sample-image.jpg', 
    location: '',
    non_helmet_rider: false, // keeping the boolean field
    non_helmet_rider_image_path: '', // adding new image path field
    passenger_with_helmet: false, // keeping the boolean field
    passenger_with_helmet_image_path: '', // adding new image path field
    vehicle_speed: 0,
  });

  useEffect(() => {
    if (!user) {
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage || !JSON.parse(authStorage).state.user) {
        router.push('/login');
      }
    }
  }, [user, router]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = user?.id || '';
      
      if (!userId) {
        alert("You must be logged in to submit this form.");
        router.push('/login');
        return;
      }

      const response = await fetch('/api/data-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      alert("Detection data saved successfully!");
      
      router.push('/select-services');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Submit Detection Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete the form below to submit vehicle and helmet detection data
          </p>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Number */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle_number">Vehicle Number</Label>
                  <Input
                    id="vehicle_number"
                    name="vehicle_number"
                    placeholder="e.g., ABC-123"
                    value={formData.vehicle_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Vehicle Type */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type</Label>
                  <Select 
                    value={formData.vehicle_type}
                    onValueChange={(value) => handleSelectChange('vehicle_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bike">Bike</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number Plate Type */}
                <div className="space-y-2">
                  <Label htmlFor="number_plate_type">Number Plate Type</Label>
                  <Select 
                    value={formData.number_plate_type}
                    onValueChange={(value) => handleSelectChange('number_plate_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vehicle Speed */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle_speed">Vehicle Speed (km/h)</Label>
                  <Input
                    id="vehicle_speed"
                    name="vehicle_speed"
                    type="number"
                    placeholder="0"
                    value={formData.vehicle_speed}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Location */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Main Street, City"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Main Image Path */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image_path" className="flex items-center gap-2">
                    <UploadIcon className="h-4 w-4" />
                    Main Image Path
                  </Label>
                  <Input
                    id="image_path"
                    name="image_path"
                    placeholder="/uploads/filename.jpg"
                    value={formData.image_path}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Enter the path where the main detection image is stored
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-medium text-lg mb-4">Helmet Detection Images</h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* Helmet Detected Image */}
                  <div className="space-y-2">
                    <Label htmlFor="helmet_detected_image_path" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Helmet Detected Image URL
                    </Label>
                    <Input
                      id="helmet_detected_image_path"
                      name="helmet_detected_image_path"
                      placeholder="https://example.com/helmet-detected.jpg"
                      value={formData.helmet_detected_image_path}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500">
                      URL to image showing helmet detection
                    </p>
                  </div>

                  {/* Non-Helmet Rider Image */}
                  <div className="space-y-2">
                    <Label htmlFor="non_helmet_rider_image_path" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Non-Helmet Rider Image URL
                    </Label>
                    <Input
                      id="non_helmet_rider_image_path"
                      name="non_helmet_rider_image_path"
                      placeholder="https://example.com/non-helmet-rider.jpg"
                      value={formData.non_helmet_rider_image_path}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500">
                      URL to image showing rider without helmet
                    </p>
                  </div>

                  {/* Passenger with Helmet Image */}
                  <div className="space-y-2">
                    <Label htmlFor="passenger_with_helmet_image_path" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Passenger with Helmet Image URL
                    </Label>
                    <Input
                      id="passenger_with_helmet_image_path"
                      name="passenger_with_helmet_image_path"
                      placeholder="https://example.com/passenger-with-helmet.jpg"
                      value={formData.passenger_with_helmet_image_path}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500">
                      URL to image showing passenger wearing helmet
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Detection Data
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetectionForm;