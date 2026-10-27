"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Stethoscope, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export function ForDoctorsSection() {
  const { t, locale } = useLanguage();

  const benefits = [
    t.forDoctors.benefit1,
    t.forDoctors.benefit2,
    t.forDoctors.benefit3,
  ];

  return (
    <section id="for-doctors" className="w-full scroll-mt-20">
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 rounded-3xl shadow-xl p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Benefits */}
          <div className="lg:col-span-8 space-y-6 text-left rtl:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="size-3.5" />
              <span>{t.forDoctors.badge}</span>
            </div>

            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {t.forDoctors.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {t.forDoctors.subtitle}
            </p>

            {/* 3 Pillars */}
            <div className="space-y-3 pt-2">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: CTA Action Card */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <div className="w-full max-w-sm space-y-4 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-center">
              <div className="inline-flex size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <Sparkles className="size-6" />
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
                {t.nav.forClinics}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {locale === "ar"
                  ? "سجّل عيادتك وابدأ 3 أشهر تجربة مجانية دون أي التزام."
                  : "Inscrivez votre cabinet et bénéficiez de 3 mois d'essai sans engagement."}
              </p>
              <Link href="/doctors/login" className="block w-full">
                <Button
                  size="lg"
                  className="w-full rounded-xl text-sm font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  <span>{t.forDoctors.cta}</span>
                  <ArrowRight className="size-4 ms-2 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default ForDoctorsSection;
