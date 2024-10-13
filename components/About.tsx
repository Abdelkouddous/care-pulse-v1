import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
const About = () => {
  return (
    <div
      className="h-screen flex flex-col justify-center items-center"
      id="about"
    >
      <div className="flex flex-col space-y-3">
        <Card x-chunk="dashboard-01-chunk-1 fade-in">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="flex text-sm font-medium items-center text-center "></CardTitle>
            <h1 className="text-center font-serif text-4xl m-4  fade-in">
              {" "}
              About Us
            </h1>
          </CardHeader>
          <CardContent>
            <p>
              Pulse is a comprehensive online appointment booking platform
              designed to connect patients with a wide range of trusted
              healthcare professionals. Our platform simplifies the often
              complicated process of finding, scheduling, and managing
              appointments with doctors. With an easy-to-navigate interface,
              patients can view available doctors, check their specialties, and
              select appointment slots that work best for them. Pulse
              prioritizes convenience, ensuring that healthcare access is just a
              few clicks away, helping users avoid long wait times and
              streamline their medical needs. Whether you need a general
              check-up or specialized care, Pulse connects you with the right
              doctor at the right time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
