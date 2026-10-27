"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Stethoscope,
  MapPin,
  Calendar,
  Building2,
  Video,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ALGERIAN_WILAYAS } from "@/constants/algeria";
import { LANDING_STATS } from "@/constants/landing-stats";

interface HeroSectionProps {
  onSearchChange?: (filters: {
    specialty: string;
    wilaya: string;
    date: string;
    visitType: string;
  }) => void;
  onOpenAuthModal?: () => void;
}

export function HeroSection({ onSearchChange, onOpenAuthModal }: HeroSectionProps) {
  const { t, locale } = useLanguage();

  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedWilaya, setSelectedWilaya] = useState("16"); // Default Algiers
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [visitType, setVisitType] = useState<"clinic" | "video">("clinic");

  const specialties = [
    { value: "All", label: t.search.allSpecialties },
    { value: "Cardiology", label: locale === "ar" ? "أمراض القلب" : "Cardiologie" },
    { value: "Pediatrics", label: locale === "ar" ? "طب الأطفال" : "Pédiatrie" },
    { value: "General Medicine", label: locale === "ar" ? "طب عام" : "Médecine Générale" },
    { value: "Dermatology", label: locale === "ar" ? "أمراض جلدية" : "Dermatologie" },
    { value: "Neurology", label: locale === "ar" ? "أمراض الأعصاب" : "Neurologie" },
    { value: "Orthopedics", label: locale === "ar" ? "جراحة العظام" : "Orthopédie" },
    { value: "Ophthalmology", label: locale === "ar" ? "طب العيون" : "Ophtalmologie" },
  ];

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange({
        specialty: selectedSpecialty,
        wilaya: selectedWilaya,
        date: selectedDate,
        visitType,
      });
    }

    const phoneBookingSection = document.getElementById("phone-booking");
    if (phoneBookingSection) {
      phoneBookingSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const phoneInput = phoneBookingSection.querySelector(
          "input[type='tel'], input[name='phone'], input"
        ) as HTMLInputElement | null;
        phoneInput?.focus();
      }, 500);
    }
  };

  const handleScrollToBooking = () => {
    const phoneBookingSection = document.getElementById("phone-booking");
    if (phoneBookingSection) {
      phoneBookingSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const phoneInput = phoneBookingSection.querySelector(
          "input[type='tel'], input[name='phone'], input"
        ) as HTMLInputElement | null;
        phoneInput?.focus();
      }, 500);
    }
  };

  const showDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <section className="relative w-full flex flex-col items-center pt-8 pb-12 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 overflow-hidden text-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center w-full">
        {/* 1. Top Badge: Honest Pilot Scope */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{t.hero.badge}</span>
        </div>

        {/* 2. Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {t.hero.titlePrimary}{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
            {t.hero.titleSecondary}
          </span>
        </h1>

        {/* 3. Hero Subtitle (Strict max 2 lines, no competitor mentions) */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* ======================================================================= */}
        {/* 4. UNIFIED SEARCH & DISCOVERY BAR (MERGED INTO HERO)                   */}
        {/* ======================================================================= */}
        <div className="w-full mt-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-md p-3.5 sm:p-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Specialty Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Stethoscope className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.search.specialtyLabel}</span>
              </label>
              <div className="relative">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label={t.search.specialtyLabel}
                >
                  {specialties.map((spec) => (
                    <option key={spec.value} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Wilaya / City Select (No Truncation) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.search.wilayaLabel}</span>
              </label>
              <div className="relative">
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label={t.search.wilayaLabel}
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w.code} value={w.code.toString()}>
                      {w.code} - {locale === "ar" ? w.arabicName : w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.search.dateLabel}</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-11 px-3 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label={t.search.dateLabel}
                />
              </div>
            </div>

            {/* Visit Mode Segmented Control (Never Wraps) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {t.search.modeLabel}
              </label>
              <div className="flex h-11 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center">
                <button
                  type="button"
                  onClick={() => setVisitType("clinic")}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    visitType === "clinic"
                      ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="size-3.5 flex-shrink-0" />
                  <span>{t.search.inClinic}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType("video")}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    visitType === "video"
                      ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Video className="size-3.5 flex-shrink-0" />
                  <span>{t.search.video}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Button (Identical Label Everywhere: "Book an Appointment") */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.common.freeForPatients}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.common.carteChifaAccepted}
              </span>
            </div>

            <Button
              type="button"
              roleVariant="patient"
              size="lg"
              onClick={handleSearch}
              className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-emerald-500/20 transition-all gap-2 cursor-pointer"
            >
              <CalendarPlus className="size-4" />
              <span>{t.common.bookAppointment}</span>
            </Button>
          </div>
        </div>

        {/* 4.5 Dedicated Phone Number Fast-Track & Direct Helpline Row */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleScrollToBooking}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Phone className="size-4" />
            <span>{locale === "ar" ? "حجز مباشر برقم الهاتف الجزائري" : "Réservation directe par numéro de téléphone"}</span>
          </button>
          <a
            href="tel:+213549882456"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold shadow-xs hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
            title="Appelez notre équipe"
          >
            <Phone className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>{locale === "ar" ? "خط المساعدة: 56 24 88 549 213+" : "Ligne d'assistance : +213 549 88 24 56"}</span>
          </a>
        </div>

        {/* 5. Optional Demo Tour Button (Only in Demo Mode) */}
        {showDemoMode && (
          <div className="pt-1">
            <Link href="/demo/login">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-emerald-500/40 hover:border-emerald-500 text-slate-700 dark:text-slate-200"
              >
                <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400 me-1.5" />
                <span>Explore Interactive Demo Sandbox</span>
              </Button>
            </Link>
          </div>
        )}

        {/* ======================================================================= */}
        {/* 6. ONE UNIFIED TRUST STRIP UNDER HERO (Key Stats + Payment Channels)   */}
        {/* ======================================================================= */}
        <div className="w-full pt-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xs space-y-4">
            {/* Key Canonical Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {LANDING_STATS.wilayasCount}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.stats.wilayasTitle}
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  {t.stats.wilayasSub}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {LANDING_STATS.partnerClinicsCount}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.stats.clinicsTitle}
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  {locale === "ar" ? "مراكز طبية نشطة" : "Centres actifs"}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {LANDING_STATS.verifiedDoctorsCount}+
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.stats.doctorsTitle}
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  {locale === "ar" ? "أطباء معتمدون" : "Praticiens agréés"}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  0 DA
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.stats.feesTitle}
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  {t.stats.feesSub}
                </div>
              </div>
            </div>

            {/* Payment & Insurance Acceptance Badges (High Contrast WCAG AA) */}
            <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-semibold me-1">
                {t.pricing.acceptedPaymentTitle}:
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700">
                BaridiMob
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700">
                Dahabia / CIB
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700">
                CCP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Carte Chifa / CNAS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
