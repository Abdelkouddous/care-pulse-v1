"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";
import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface AboutProps {
  className?: string;
}

export const About: React.FC<AboutProps> = ({ className = "" }): JSX.Element => {
  const { t, locale } = useLanguage();

  const fadeInVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const points = [
    {
      icon: CheckCircle2,
      title:
        locale === "ar"
          ? "حجز فوري ومؤكد بدون طوابير انتظار"
          : "Réservation instantanée sans attente au cabinet",
      desc:
        locale === "ar"
          ? "اختر موعدك وتخصصك الطبي بكل دقة واحصل على تأكيد وتذكير مباشر على تطبيق واتساب."
          : "Choisissez l'horaire qui vous convient et recevez une confirmation instantanée sur votre téléphone.",
    },
    {
      icon: HeartHandshake,
      title:
        locale === "ar"
          ? "مجاني للمرضى وقبول بطاقة الشفاء"
          : "100% Gratuit pour les patients et compatible Chifa",
      desc:
        locale === "ar"
          ? "لا تدفع أي رسوم للمنصة. تدفع فقط كشف الطبيب بالعيادة مع إمكانية استرجاع مصاريف الضمان الاجتماعي."
          : "Aucun frais de réservation. Vos consultations sont prises en charge avec délivrance des feuilles CNAS.",
    },
    {
      icon: ShieldCheck,
      title:
        locale === "ar"
          ? "بيانات صحية مشفرة ومحمية قانونياً"
          : "Protection légale des données (Loi 18-07)",
      desc:
        locale === "ar"
          ? "معالجة سرية وآمنة للمعلومات الصحية الشخصية بما يتطابق تماماً مع التشريع الجزائري الساري."
          : "Plateforme rigoureusement conforme à la législation algérienne sur la protection des données personnelles.",
    },
  ];

  return (
    <section id="about" className={`w-full scroll-mt-20 ${className}`}>
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
                {locale === "ar" ? "رؤيتنا" : "Notre Mission"}
              </span>
              <h2 className="font-sans text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                {locale === "ar" ? "لماذا تختار وتين بوك؟" : "Pourquoi choisir Wateen Book ?"}
              </h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-10 pt-8 md:px-12">
            <div className="grid gap-6 md:grid-cols-3">
              {points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 text-left"
                >
                  <div className="size-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <pt.icon className="size-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default About;
