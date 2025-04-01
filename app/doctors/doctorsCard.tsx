import { motion } from "framer-motion";
import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { CarouselDApiDemo } from "./components/CarouselCard";

const DoctorsCard = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  return (
    <section id="doctors">
      <Card className="my-12 overflow-hidden border-0  bg-white shadow-xl dark:bg-gray-800">
        <CardHeader>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 space-y-4 lg:mb-16">
              <CardTitle>
                <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Healthcare Experts
                </span>
              </CardTitle>
              <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
                Meet Our Medical Specialists
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 lg:text-xl">
                Board-certified professionals dedicated to your health and
                wellness
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 py-8 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <CarouselDApiDemo />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DoctorsCard;
// import React from "react";

// const doctorsCard = () => {
//   return <div>doctorsCard</div>;
// };

// export default doctorsCard;
