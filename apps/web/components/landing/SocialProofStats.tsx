"use client";

import React from "react";
import { LANDING_STATS } from "@/constants/landing-stats";
import { useLanguage } from "@/context/LanguageContext";

export function SocialProofStats({ className = "" }: { className?: string }): React.JSX.Element {
  const { t, locale } = useLanguage();

  const stats = [
    {
      id: "wilayas",
      value: `${LANDING_STATS.wilayasCount} Wilayas`,
      label: t.stats.wilayasTitle,
      sublabel: t.stats.wilayasSub,
    },
    {
      id: "clinics",
      value: `${LANDING_STATS.partnerClinicsCount}`,
      label: t.stats.clinicsTitle,
      sublabel: locale === "ar" ? "مراكز طبية نشطة" : "Centres actifs",
    },
    {
      id: "doctors",
      value: `${LANDING_STATS.verifiedDoctorsCount}+`,
      label: t.stats.doctorsTitle,
      sublabel: locale === "ar" ? "أطباء مسجلون" : "Praticiens agréés",
    },
    {
      id: "fees",
      value: "0 DA",
      label: t.stats.feesTitle,
      sublabel: t.stats.feesSub,
    },
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto py-6 px-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xs text-center space-y-1 transition-all hover:border-emerald-500/40"
          >
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stat.value}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {stat.label}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {stat.sublabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SocialProofStats;
