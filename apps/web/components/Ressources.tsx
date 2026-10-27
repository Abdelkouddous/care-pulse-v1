"use client";

import React from "react";
import {
  HeartPulse,
  Baby,
  Microscope,
  Stethoscope,
  Eye,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface ServicesProps {
  onSelectSpecialty?: (specialty: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectSpecialty }) => {
  const { t, locale } = useLanguage();

  const specialties = [
    {
      id: "Cardiology",
      title: locale === "ar" ? "أمراض القلب والشرايين" : "Cardiologie",
      description:
        locale === "ar"
          ? "تشخيص متقدم لأمراض القلب، تخطيط القلب والفحوصات الوقائية."
          : "Diagnostics cardiaques avancés, bilans préventifs et suivi cardiovasculaire.",
      icon: <HeartPulse className="size-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: "Pediatrics",
      title: locale === "ar" ? "طب الأطفال وحديثي الولادة" : "Pédiatrie",
      description:
        locale === "ar"
          ? "متابعة دورية لنمو الطفل، اللقاحات والرعاية الصحية المتكاملة."
          : "Suivi de croissance, médecine néonatale et bilans réguliers de santé de l'enfant.",
      icon: <Baby className="size-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: "General Medicine",
      title: locale === "ar" ? "الطب العام والاستشارات" : "Médecine Générale",
      description:
        locale === "ar"
          ? "فحوصات طبية روتينية، تشخيص شامل ومتابعة الحالات المزمنة."
          : "Consultations courantes, bilans de routine et prise en charge globale.",
      icon: <Stethoscope className="size-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: "Dermatology",
      title: locale === "ar" ? "الأمراض الجلدية" : "Dermatologie",
      description:
        locale === "ar"
          ? "علاج اضطرابات الجلد، الحساسية وفحوصات الليزر التخصصية."
          : "Diagnostic et traitement des affections de la peau, allergies et bilans cutanés.",
      icon: <Activity className="size-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: "Ophthalmology",
      title: locale === "ar" ? "طب وجراحة العيون" : "Ophtalmologie",
      description:
        locale === "ar"
          ? "فحص النظر، علاج أمراض الشبكية وجراحة العيون المتقدمة."
          : "Contrôle de la vision, chirurgie réfractive et soins ophtalmologiques complets.",
      icon: <Eye className="size-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: "Diagnostics",
      title: locale === "ar" ? "الأشعة والتحاليل الطبية" : "Imagerie & Analyses",
      description:
        locale === "ar"
          ? "تنسيق الفحوصات المخبرية، الموجات فوق الصوتية والرنين المغناطيسي."
          : "Coordination avec les laboratoires d'analyses et centres d'imagerie médicale.",
      icon: <Microscope className="size-6 text-emerald-600 dark:text-emerald-400" />,
    },
  ];

  const handleSpecialtyClick = (specialtyId: string) => {
    if (onSelectSpecialty) {
      onSelectSpecialty(specialtyId);
    }
    const doctorsSection = document.getElementById("doctors");
    if (doctorsSection) {
      doctorsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          {t.services?.badge || "SPÉCIALITÉS"}
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.services?.title || "Nos Spécialités Médicales"}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {locale === "ar"
            ? "انقر على أي تخصص لاستعراض الأطباء المعتمدين وحجز موعدكم فوراً."
            : "Sélectionnez une spécialité médicale pour filtrer les praticiens et réserver en un clic."}
        </p>
      </div>

      {/* Compact Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {specialties.map((spec) => (
          <Card
            key={spec.id}
            onClick={() => handleSpecialtyClick(spec.id)}
            className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/60 group-hover:scale-105 transition-transform">
                {spec.icon}
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {spec.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {spec.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>{locale === "ar" ? "عرض الأطباء" : "Voir les médecins"}</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Services;
