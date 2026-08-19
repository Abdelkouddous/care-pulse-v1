"use client";

import { motion } from "framer-motion";
import { Activity, Users, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DICTIONARY_EN } from "@/constants/locales/en";

const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const DashboardOverview: React.FC = () => {
  // Hardcoded Algerian mock data — aligned with DTOs for upcoming Laravel API
  const [metrics, setMetrics] = useState({
    patientCount: 0,
    doctorCount: 0,
    activeDoctors: 0,
    wilayas: 0,
    isLoading: true,
  });

  useEffect(() => {
    const targets = { patientCount: 12500, doctorCount: 340, activeDoctors: 28, wilayas: 28 };
    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setMetrics({
        patientCount: Math.round(targets.patientCount * eased),
        doctorCount: Math.round(targets.doctorCount * eased),
        activeDoctors: Math.round(targets.activeDoctors * eased),
        wilayas: Math.round(targets.wilayas * eased),
        isLoading: false,
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const MetricCard = ({
    title,
    value,
    change,
    suffix = "",
    icon: Icon,
  }: {
    title: string;
    value: number;
    change: string;
    suffix?: string;
    icon: React.ElementType;
  }) => (
    <Card className="overflow-hidden border border-slate-200 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 pb-3 dark:border-slate-800">
        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</CardTitle>
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            +{metrics.isLoading ? "0" : value.toLocaleString("en-US")}
          </span>
          {suffix && <span className="text-sm text-slate-500 dark:text-slate-400">{suffix}</span>}
        </div>
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {change}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <section className="w-full">
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
                {DICTIONARY_EN.metrics.badge}
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                {DICTIONARY_EN.metrics.title}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-8 pt-6 md:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              <MetricCard
                title={DICTIONARY_EN.metrics.patients.title}
                value={metrics.patientCount}
                change={DICTIONARY_EN.metrics.patients.change}
                icon={Users}
              />
              <MetricCard
                title={DICTIONARY_EN.metrics.doctors.title}
                value={metrics.doctorCount}
                change={DICTIONARY_EN.metrics.doctors.change}
                icon={UserPlus}
              />
              <MetricCard
                title={DICTIONARY_EN.metrics.wilayas.title}
                value={metrics.wilayas}
                change={DICTIONARY_EN.metrics.wilayas.change}
                icon={Activity}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default DashboardOverview;
