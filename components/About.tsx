import { motion } from "framer-motion";
import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AboutProps {
  className?: string;
}

const About: React.FC<AboutProps> = ({ className = "" }): JSX.Element => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="mt-16 md:mt-16">
      {/* Removed w-screen which was causing the horizontal overflow and left margin */}
      <div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="flex flex-col space-y-6"
        >
          <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 pb-2 text-center dark:border-gray-700">
              <CardTitle className="flex flex-col items-center justify-center">
                <span className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  OUR MISSION
                </span>
                <h2 className="font-serif text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
                  About Pulse
                </h2>
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-8 pt-6 md:px-8">
              <div className="space-y-4 leading-relaxed text-gray-600 dark:text-gray-300">
                <p className="text-lg">
                  Pulse is a comprehensive online appointment booking platform
                  designed to connect patients with a wide range of trusted
                  healthcare professionals.
                </p>

                <p>
                  Our platform simplifies the often complicated process of
                  finding, scheduling, and managing appointments with doctors.
                  With an easy-to-navigate interface, patients can view
                  available doctors, check their specialties, and select
                  appointment slots that work best for them.
                </p>

                <p>
                  Pulse prioritizes convenience, ensuring that healthcare access
                  is just a few clicks away, helping users avoid long wait times
                  and streamline their medical needs. Whether you need a general
                  check-up or specialized care, Pulse connects you with the
                  right doctor at the right time.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
