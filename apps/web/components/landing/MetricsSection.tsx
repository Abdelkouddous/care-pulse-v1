"use client";

import { motion } from "framer-motion";
import { Building2, Users, MapPin, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LANDING_STATS } from "@/constants/landing-stats";
import { useLanguage } from "@/context/LanguageContext";

const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const MetricsSection: React.FC = () => {
  const { t, locale } = useLanguage();

  const [metrics, setMetrics] = useState({
    clinics: 0,
    doctorCount: 0,
    wilayas: 0,
    fee: 0,
    isLoading: true,
  });

  useEffect(() => {
    const targets = {
      clinics: LANDING_STATS.partnerClinicsCount,
      doctorCount: LANDING_STATS.verifiedDoctorsCount,
      wilayas: LANDING_STATS.wilayasCount,
      fee: 0,
    };
    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setMetrics({
        clinics: Math.round(targets.clinics * eased),
        doctorCount: Math.round(targets.doctorCount * eased),
        wilayas: Math.round(targets.wilayas * eased),
        fee: 0,
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
    value: string | number;
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
            {metrics.isLoading ? "..." : value}
          </span>
          {suffix && <span className="text-sm font-bold text-slate-500">{suffix}</span>}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">{change}</p>
      </CardContent>
    </Card>
  );

  return (
    <section id="metrics" className="w-full">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInVariants}
        className="w-full"
      >
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold uppercase tracking-wider">
            {t.stats.wilayasTitle}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {locale === "ar" ? "مؤشرات المرحلة التجريبية" : "Indicateurs de la Phase Pilote"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {locale === "ar"
              ? "بيانات حقيقية وموثقة تعكس التغطية الصحية الحالية في ولايتي الجزائر العاصمة وتبسة."
              : "Données réelles reflétant la couverture médicale opérationnelle à Alger et Tébessa."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t.stats.wilayasTitle}
            value={metrics.wilayas}
            change={t.stats.wilayasSub}
            icon={MapPin}
          />
          <MetricCard
            title={t.stats.clinicsTitle}
            value={metrics.clinics}
            change={locale === "ar" ? "مراكز في الخدمة" : "Établissements partenaires"}
            icon={Building2}
          />
          <MetricCard
            title={t.stats.doctorsTitle}
            value={metrics.doctorCount}
            suffix="+"
            change={locale === "ar" ? "أطباء أخصائيون معتمدون" : "Praticiens agréés"}
            icon={Users}
          />
          <MetricCard
            title={t.stats.feesTitle}
            value="0 DA"
            change={t.stats.feesSub}
            icon={ShieldCheck}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default MetricsSection;
