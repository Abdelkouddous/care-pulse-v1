"use client";

import React from "react";
import { motion } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CarouselDApiDemo } from "./components/CarouselCard";
import { DICTIONARY_EN } from "@/constants/locales/en";

const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const DoctorsCard = () => {
  return (
    <section id="doctors" className="w-full">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInVariants}
        className="w-full"
      >
        <Card className="overflow-hidden border border-slate-200 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 rounded-3xl">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto max-w-3xl space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800/60">
                {DICTIONARY_EN.doctors.badge}
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                {DICTIONARY_EN.doctors.title}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                {DICTIONARY_EN.doctors.subtitle}
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-8 pt-4 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <CarouselDApiDemo />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default DoctorsCard;
