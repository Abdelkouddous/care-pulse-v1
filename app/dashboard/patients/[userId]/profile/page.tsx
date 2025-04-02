"use client";
import {
  Bell,
  Settings,
  CalendarCheck,
  ClipboardList,
  Pill,
  Stethoscope,
} from "lucide-react";
import React from "react";

// Import UI components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PatientProfile = () => {
  const patientData = {
    name: "Emily Johnson",
    email: "emily.j@example.com",
    role: "Patient",
    patientId: "PT-2345-6789",
    phone: "+1 (555) 123-4567",
    joinedDate: "January 10, 2020",
    bloodType: "O+",
    primaryPhysician: "Dr. Sarah Johnson",
  };

  const healthStats = [
    { label: "Upcoming Appointments", value: "2", icon: CalendarCheck },
    { label: "Medical History Items", value: "5", icon: ClipboardList },
    { label: "Current Medications", value: "3", icon: Pill },
    // { label: "Allergies", value: "2", icon: Allergy },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Health Profile
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
                  <AvatarImage src="/avatars/emily-johnson.jpg" />
                  <AvatarFallback>EJ</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle className="text-2xl">{patientData.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {patientData.role}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Patient ID: {patientData.patientId}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Blood Type
                  </span>
                  <Badge variant="destructive">{patientData.bloodType}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Primary Physician
                  </span>
                  <span>{patientData.primaryPhysician}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Member Since
                  </span>
                  <span>{patientData.joinedDate}</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Request Records
              </Button>
            </CardContent>
          </Card>

          {/* Health Overview */}
          <div className="space-y-6 lg:col-span-2">
            {/* Health Stats */}
            <div className="grid grid-cols-2 gap-4">
              {healthStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </span>
                      {stat.icon && (
                        <stat.icon className="size-5 text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Medical Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Annual Physical Checkup - Completed",
                    "Blood Test Results - Reviewed",
                    "Allergy Consultation - Completed",
                    "Diabetes Management Plan - Updated",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                        <Stethoscope className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last updated {index + 1} week(s) ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Health Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24">
                    <CalendarCheck className="mr-2 size-5" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="h-24">
                    <ClipboardList className="mr-2 size-5" />
                    View Medical Records
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

export default PatientProfile;
