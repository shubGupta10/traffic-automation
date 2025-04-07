"use client"

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/stores/useAuthStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  CheckCircle,
  Calendar, 
  ChevronDown
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState('weekly');
  
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
  const userDisplayName = userData?.email?.split('@')[0] || "User";

  // Simplified data for charts
  const scanData = [
    { name: 'Mon', scans: 28 },
    { name: 'Tue', scans: 35 },
    { name: 'Wed', scans: 42 },
    { name: 'Thu', scans: 30 },
    { name: 'Fri', scans: 45 },
    { name: 'Sat', scans: 20 },
    { name: 'Sun', scans: 15 },
  ];

  const vehicleTypeData = [
    { name: 'Cars', value: 54 },
    { name: 'Motorcycles', value: 28 },
    { name: 'Trucks', value: 12 },
    { name: 'Buses', value: 6 },
  ];

  const COLORS = ['#3b82f6', '#4f46e5', '#8b5cf6', '#6366f1'];
  
  const recentScans = [
    { id: 1, type: 'Vehicle Type', result: 'Car - Toyota Corolla', status: 'success' },
    { id: 2, type: 'Helmet Detection', result: 'No helmet detected', status: 'warning' },
    { id: 3, type: 'Number Plate', result: 'MH02AB1234', status: 'success' },
  ];

  const statCards = [
    { title: 'Total Scans Today', value: '128', icon: <Activity className="h-5 w-5" /> },
    { title: 'Success Rate', value: '94%', icon: <CheckCircle className="h-5 w-5" /> },
  ];

  // Simplified status icon function
  const getStatusBadge = (status: string): React.ReactElement => {
    const styles = {
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {userDisplayName}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {timeRange === 'weekly' ? 'Last 7 days' : 'Last 30 days'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scanData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scans" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {vehicleTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-4 pl-0">Type</th>
                    <th className="text-left font-medium p-4">Result</th>
                    <th className="text-left font-medium p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-4 pl-0">{scan.type}</td>
                      <td className="p-4">{scan.result}</td>
                      <td className="p-4">{getStatusBadge(scan.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;