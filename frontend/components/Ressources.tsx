"use client";

import {
  HeartPulse,
  Stethoscope,
  AlertTriangle,
  Baby,
  Microscope,
  Pill,
  ArrowRight,
} from "lucide-react";
import React from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DICTIONARY_EN } from "@/constants/locales/en";

const serviceIcons = [
  <AlertTriangle key="0" className="size-10 text-emerald-600 dark:text-emerald-400" />,
  <HeartPulse key="1" className="size-10 text-emerald-600 dark:text-emerald-400" />,
  <Baby key="2" className="size-10 text-emerald-600 dark:text-emerald-400" />,
  <Microscope key="3" className="size-10 text-emerald-600 dark:text-emerald-400" />,
  <Stethoscope key="4" className="size-10 text-emerald-600 dark:text-emerald-400" />,
  <Pill key="5" className="size-10 text-emerald-600 dark:text-emerald-400" />,
];

const Services = () => {
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
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section id="services" className="w-full">
      <div className="text-center space-y-2 mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          {DICTIONARY_EN.services.badge}
        </span>
        <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          {DICTIONARY_EN.services.title}
        </h2>
      </div>

      <div className="mx-auto px-2">
        <Slider {...settings}>
          {DICTIONARY_EN.services.items.map((service, index) => (
            <div key={index} className="px-3 py-2 focus:outline-none">
              <Card className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 flex flex-col justify-between">
                <CardHeader className="flex flex-col items-center pb-3 pt-8">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60">
                    {serviceIcons[index % serviceIcons.length]}
                  </div>
                  <CardTitle className="text-center text-xl font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-2 text-center flex flex-col justify-between flex-1">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {service.description}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                      {DICTIONARY_EN.services.learnMore}
                      <ArrowRight className="size-3.5" />
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
