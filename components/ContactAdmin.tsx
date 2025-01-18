import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Contact } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactAdmin = () => {
  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data); // Replace this with your form submission logic
    alert("Thank you for contacting us! We will get back to you soon.");
  };

  return (
    <div
      className="h-screen flex m-auto flex-col max-w-screen relative my-3 justify-center"
      id="contact"
    >
      <Card x-chunk="dashboard-01-chunk-1" className="p-5 fade-in">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <CardTitle className="flex text-sm font-medium items-center text-center"></CardTitle>
          <span className="flex items-center text-center font-serif text-4xl m-4 space-x-3 fade-in">
            <Contact className="mr-4 h-full" /> Contact Us
          </span>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
                className="mt-1"
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                required
                className="mt-1"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                required
                className="mt-1"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactAdmin;
