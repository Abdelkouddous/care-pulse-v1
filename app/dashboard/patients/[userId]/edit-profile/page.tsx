"use client";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  Stethoscope,
  Save,
  X,
} from "lucide-react";
import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const EditProfile = () => {
  // Initial state with patient data (this would typically come from an API or context)
  const [formData, setFormData] = useState({
    name: "Emily Johnson",
    email: "emily.j@example.com",
    phone: "+1 (555) 123-4567",
    patientId: "PT-2345-6789",
    bloodType: "O+",
    primaryPhysician: "Dr. Sarah Johnson",
    joinedDate: "January 10, 2020",
    allergies: "Penicillin, Peanuts",
    medicalNotes:
      "Patient has a history of mild asthma. Regular check-ups recommended every 6 months.",
    emergencyContact: "Michael Johnson (Husband) - +1 (555) 987-6543",
    profileImage: "/avatars/emily-johnson.jpg",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Submitting updated profile:", formData);

    // Show success toast
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  // Handle cancel
  const handleCancel = () => {
    // In a real app, you might redirect back to the profile page
    console.log("Edit cancelled");
    // For demo purposes, we'll just show a toast
    toast({
      title: "Edit cancelled",
      description: "No changes were made to your profile.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Health Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Profile Image Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="size-32">
                  <AvatarImage src={formData.profileImage} />
                  <AvatarFallback>
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">
                  Change Photo
                </Button>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      name="patientId"
                      value={formData.patientId}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500">
                      Patient ID cannot be changed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <div className="relative">
                      <Droplet className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Select
                        value={formData.bloodType}
                        onValueChange={(value) =>
                          handleSelectChange("bloodType", value)
                        }
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryPhysician">Primary Physician</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="primaryPhysician"
                        name="primaryPhysician"
                        value={formData.primaryPhysician}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinedDate">Member Since</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="joinedDate"
                        name="joinedDate"
                        value={formData.joinedDate}
                        disabled
                        className="bg-gray-100 pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Join date cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Medical Notes</Label>
                  <Textarea
                    id="medicalNotes"
                    name="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center"
                  >
                    <X className="mr-2 size-4" />
                    Cancel
                  </Button>
                  <Button type="submit" className="flex items-center">
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
