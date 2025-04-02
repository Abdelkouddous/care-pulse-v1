import {
  User,
  Bell,
  Settings,
  Calendar,
  ClipboardList,
  HeartPulse,
} from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DoctorProfile = () => {
  const userData = {
    name: "Dr. Sarah Johnson",
    email: "s.johnson@medicalclinic.com",
    role: "Primary Care Physician",
    specialty: "Internal Medicine",
    phone: "+1 (555) 123-4567",
    joinedDate: "March 15, 2018",
  };

  const stats = [
    { label: "Patients", value: "243", icon: User },
    { label: "Appointments", value: "12", icon: Calendar },
    { label: "Prescriptions", value: "8", icon: ClipboardList },
    { label: "Health Plans", value: "5", icon: HeartPulse },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Dashboard
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Bell className="size-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="size-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="size-24">
                  <AvatarImage src="/avatars/sarah-johnson.jpg" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle className="text-2xl">{userData.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {userData.role}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {userData.specialty}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Email
                  </span>
                  <span>{userData.email}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Phone
                  </span>
                  <span>{userData.phone}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Member Since
                  </span>
                  <span>{userData.joinedDate}</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Stats and Activity */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </span>
                      <stat.icon className="size-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                        <Calendar className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Appointment with Patient #{item}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item} day{item !== 1 ? "s" : ""} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24">
                    <ClipboardList className="mr-2 size-5" />
                    New Prescription
                  </Button>
                  <Button variant="outline" className="h-24">
                    <Calendar className="mr-2 size-5" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
