"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatDzd } from "@/lib/format-currency";
import { useLanguage } from "@/context/LanguageContext";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const Plans: React.FC = () => {
  const { t, locale } = useLanguage();

  const plans = [
    {
      id: "clinic-solo",
      name: t.pricing.starterClinic,
      price_cents: 69000, // 690 DA/mo
      badge: "3 MOIS GRATUITS",
      description: t.pricing.starterDesc,
      features: [
        { text: locale === "ar" ? "تأكيدات المواعيد التلقائية عبر واتساب" : "Confirmations automatiques de rendez-vous WhatsApp", included: true },
        { text: locale === "ar" ? "مزامنة فورية للمواعيد مع أمانة العيادة" : "Synchronisation d'agenda en temps réel", included: true },
        { text: locale === "ar" ? "لوحة تحكم الطبيب ومتابعة المرضى" : "Tableau de bord praticien et historique", included: true },
        { text: locale === "ar" ? "ملف المريض الإلكتروني المتوافق مع الشفاء" : "Dossier patient numérique compatible Chifa", included: true },
        { text: locale === "ar" ? "قاعات كشف متعددة (مجمع طبي)" : "Salles de consultation multiples", included: false },
      ],
      button_text: t.pricing.ctaStartTrial,
      is_highlighted: false,
    },
    {
      id: "clinic-pro",
      name: t.pricing.proClinic,
      price_cents: 149000, // 1490 DA/mo
      badge: "RECOMMANDÉ",
      description: t.pricing.proDesc,
      features: [
        { text: locale === "ar" ? "كافة ميزات العيادة الفردية" : "Toutes les fonctionnalités Solo", included: true },
        { text: locale === "ar" ? "إدارة قاعات وأطباء متعددين في نفس المركز" : "Multi-praticiens et secrétariat centralisé", included: true },
        { text: locale === "ar" ? "تأكيد واتساب ذكي يقلل الغياب بنسبة 40%" : "Triage WhatsApp anti-désistement (40% de no-show en moins)", included: true },
        { text: locale === "ar" ? "دعم فني وأولوية اتصال على مدار الساعة" : "Support technique dédié et formation du secrétariat", included: true },
        { text: locale === "ar" ? "تقارير إحصائية دورية لنشاط العيادة" : "Rapports statistiques d'activité du centre", included: true },
      ],
      button_text: t.pricing.ctaStartTrial,
      is_highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="w-full scroll-mt-20">
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
                {t.pricing.badge}
              </span>
              <h2 className="font-sans text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                {t.pricing.title}
              </h2>
            </CardTitle>

            {/* Clear Patient Protection & Free Trial Banner */}
            <div className="pt-4 max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold">
                <Sparkles className="size-4 text-emerald-500 shrink-0" />
                <span>{t.pricing.freeTrialBanner}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t.pricing.subtitle}
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-8 md:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto items-stretch"
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={fadeInVariants}
                  className="flex flex-col"
                >
                  <Card
                    className={`h-full flex flex-col justify-between overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl ${
                      plan.is_highlighted
                        ? "border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 dark:border-emerald-400 dark:bg-slate-900"
                        : "border border-slate-200 dark:border-slate-800 dark:bg-slate-900/50"
                    }`}
                  >
                    <CardHeader className="text-center pt-8 pb-4 relative">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {plan.badge}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {t.pricing.monthly}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-black text-slate-900 dark:text-white pt-2 text-left">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-3 flex items-baseline justify-start gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                          {formatDzd(plan.price_cents, { locale })}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          / {locale === "ar" ? "شهر" : "mois"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-left">
                        {plan.description}
                      </p>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <ul className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-xs sm:text-sm">
                            <div
                              className={`mr-2.5 mt-0.5 flex size-4 items-center justify-center rounded-full shrink-0 ${
                                feature.included
                                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                              }`}
                            >
                              <Check className="size-2.5" />
                            </div>
                            <span
                              className={
                                feature.included
                                  ? "text-slate-700 dark:text-slate-200 font-medium"
                                  : "text-slate-400 dark:text-slate-500"
                              }
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-4 pb-6">
                      <Button
                        type="button"
                        roleVariant="patient"
                        className={`w-full font-bold py-6 rounded-2xl shadow-md ${
                          plan.is_highlighted
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700"
                        }`}
                      >
                        {plan.button_text}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>

          {/* Payment Gateways Bar with Clear Algerian Channels */}
          <div className="border-t border-slate-100 px-8 py-5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {t.pricing.acceptedPaymentTitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.pricing.gateways.map((gw, idx) => (
                <span
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800 font-bold"
                >
                  {gw}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default Plans;
