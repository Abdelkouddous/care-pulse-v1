import { motion } from "framer-motion";
import { Contact } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactAdmin = () => {
  // const fadeInVariants = {
  //   hidden: { opacity: 0, y: 40 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.8,
  //       ease: [0.6, 0.05, -0.01, 0.9],
  //     },
  //   },
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data);
    alert("Thank you for contacting us! We will get back to you soon.");
  };

  return (
    <section id="contact">
      <div>
        {/* className="container mx-auto px-4 sm:px-6 lg:px-8"> */}
        <Card className="mx-auto overflow-hidden border-0 px-4 shadow-xl dark:bg-gray-800 sm:px-6 lg:px-8">
          <CardHeader className="pb-6 pt-12">
            <div className="flex flex-col items-center space-y-4">
              <div className=" bg-emerald-100 p-4 dark:bg-emerald-900/30">
                <Contact className="size-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="flex flex-col items-center text-center">
                <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Get in Touch
                </span>
                <h2 className="mt-2 font-serif text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
                  Contact Us
                </h2>
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pb-12">
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="w-full focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-emerald-400"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-emerald-400"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Type your message here..."
                  required
                  rows={5}
                  className="w-full focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                className="bg-emerald-600 px-8 py-6 text-lg font-semibold transition-colors hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                onClick={handleSubmit}
              >
                Send Message
                <svg
                  className="ml-3 size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactAdmin;
