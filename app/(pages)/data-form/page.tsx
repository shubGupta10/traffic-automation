"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from '@/stores/useAuthStore';
import { UploadIcon, MapPin, Save, ArrowLeft } from 'lucide-react';

const DetectionForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_number: '',
    vehicle_type: 'Car', // Updated to match enum case
    helmet_detected: false,
    number_plate_type: 'White', // Updated to match enum case
    image_path: '/uploads/sample-image.jpg', 
    location: '',
    non_helmet_rider: false,
    passenger_with_helmet: false,
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

  const handleSwitchChange = (name: keyof typeof formData) => {
    setFormData({ ...formData, [name]: !formData[name] });
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
                      {/* Updated to match enum values from schema */}
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
                      {/* Updated to match enum values from schema */}
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

                {/* Image Path */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image_path" className="flex items-center gap-2">
                    <UploadIcon className="h-4 w-4" />
                    Image Path
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
                    Enter the path where the image is stored on the server
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-medium text-lg mb-4">Helmet Detection Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Helmet Detected */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="helmet_detected" className="cursor-pointer">
                      Helmet Detected
                    </Label>
                    <Switch
                      id="helmet_detected"
                      checked={formData.helmet_detected}
                      onCheckedChange={() => handleSwitchChange('helmet_detected')}
                    />
                  </div>

                  {/* Non-Helmet Rider */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="non_helmet_rider" className="cursor-pointer">
                      Non-Helmet Rider
                    </Label>
                    <Switch
                      id="non_helmet_rider"
                      checked={formData.non_helmet_rider}
                      onCheckedChange={() => handleSwitchChange('non_helmet_rider')}
                    />
                  </div>

                  {/* Passenger with Helmet */}
                  <div className="flex items-center justify-between md:col-span-2">
                    <Label htmlFor="passenger_with_helmet" className="cursor-pointer">
                      Passenger with Helmet
                    </Label>
                    <Switch
                      id="passenger_with_helmet"
                      checked={formData.passenger_with_helmet}
                      onCheckedChange={() => handleSwitchChange('passenger_with_helmet')}
                    />
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