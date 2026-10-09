"use client";

import { motion } from "framer-motion";
import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DICTIONARY_EN } from "@/constants/locales/en";

interface AboutProps {
  className?: string;
}

const About: React.FC<AboutProps> = ({ className = "" }): JSX.Element => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="about" className={`w-full ${className}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInVariants}
        className="w-full"
      >
        <Card className="overflow-hidden border border-slate-200 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 rounded-3xl">
          <CardHeader className="border-b border-slate-100 pb-6 pt-8 text-center dark:border-slate-800">
            <CardTitle className="flex flex-col items-center justify-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                {DICTIONARY_EN.about.badge}
              </span>
              <h2 className="font-sans text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                {DICTIONARY_EN.about.title}
              </h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-6 md:px-12">
            <div className="space-y-5 leading-relaxed text-slate-600 dark:text-slate-300 text-base md:text-lg">
              <p>{DICTIONARY_EN.about.p1}</p>
              <p>{DICTIONARY_EN.about.p2}</p>
              <p>{DICTIONARY_EN.about.p3}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default About;
