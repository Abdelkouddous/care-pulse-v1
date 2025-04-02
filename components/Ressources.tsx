import {
  HeartPulse,
  Stethoscope,
  AlertTriangle,
  Baby,
  Microscope,
  Pill,
} from "lucide-react";
import React from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick"; // Import Settings type

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Services = () => {
  // const Slider = Slider as React.ComponentType<Settings>;
  const services = [
    {
      title: "Emergency Care",
      description:
        "24/7 emergency services with state-of-the-art trauma centers and immediate response teams.",
      icon: <AlertTriangle className="mb-4 size-12 text-emerald-600" />,
    },
    {
      title: "Cardiology",
      description:
        "Advanced cardiac care including non-invasive surgeries and preventive cardiology programs.",
      icon: <HeartPulse className="mb-4 size-12 text-emerald-600" />,
    },
    {
      title: "Pediatrics",
      description:
        "Child-friendly environment with specialized neonatal and adolescent care units.",
      icon: <Baby className="mb-4 size-12 text-emerald-600" />,
    },
    {
      title: "Diagnostics",
      description:
        "Comprehensive imaging services including MRI, CT scans, and advanced laboratory testing.",
      icon: <Microscope className="mb-4 size-12 text-emerald-600" />,
    },
    {
      title: "Primary Care",
      description:
        "Holistic family medicine with preventive health screenings and wellness programs.",
      icon: <Stethoscope className="mb-4 size-12 text-emerald-600" />,
    },
    {
      title: "Pharmacy",
      description:
        "In-house pharmacy services with automated prescription management system.",
      icon: <Pill className="mb-4 size-12 text-emerald-600" />,
    },
  ];
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section id="services" className=" py-20  lg:py-28">
      <h2 className="text-center font-serif text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
        Our Services
      </h2>
      <div className="container mx-auto my-12 px-4 sm:px-6 lg:px-8">
        {/* Header section remains the same... */}

        <Slider {...settings}>
          {services.map((service, index) => (
            <div key={index} className="px-4 focus:outline-none">
              <Card className="h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
                <CardHeader className="flex flex-col items-center pb-4 pt-10">
                  <div className="mb-6">{service.icon}</div>
                  <CardTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-center leading-relaxed text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button className="flex items-center font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                      Learn More
                      <svg
                        className="ml-2 size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Services;
