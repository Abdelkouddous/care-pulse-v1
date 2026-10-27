"use client";

import React from "react";
import { Search, CalendarCheck, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export function HowItWorksSection() {
  const { t, locale } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: <Search className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
    },
    {
      number: "02",
      icon: <CalendarCheck className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
    },
    {
      number: "03",
      icon: <MessageSquare className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          {t.howItWorks.badge}
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.howItWorks.title}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          {t.howItWorks.subtitle}
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="relative p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/60">
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-200 dark:text-slate-800 select-none">
                  {step.number}
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Step sequence indicator */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700">
                {locale === "ar" ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;
