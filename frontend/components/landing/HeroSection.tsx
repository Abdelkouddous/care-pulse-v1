"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const handleScrollToBooking = () => {
    const targetElement = document.getElementById("phone-booking");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Algeria&apos;s National Healthcare Network • 58 Wilayas Covered</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
          Book Certified Doctors in Algeria,{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
            Effortlessly.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Inspired by the seamless booking experience of modern digital platforms. Connect with verified Algerian specialists,
          review consultation fees strictly in Algerian Dinars (DZD), and manage bookings with Biometric NIN &amp; Carte Chifa.
        </p>

        {/* Hero Primary Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* 1. Book an Appointment (Scrolls down to #phone-booking full screen section) */}
          <Button
            type="button"
            roleVariant="patient"
            size="lg"
            onClick={handleScrollToBooking}
            className="w-full sm:w-auto px-8 py-6 rounded-2xl text-base font-bold shadow-xl hover:shadow-emerald-500/25 transition-all gap-2.5 cursor-pointer"
          >
            <CalendarPlus className="size-5" />
            <span>Book an Appointment</span>
          </Button>

          {/* 2. View Demo (Routes directly to /demo/login) */}
          <Link href="/demo/login" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-7 py-6 rounded-2xl text-base font-bold border-2 border-emerald-500/40 hover:border-emerald-500 text-slate-800 dark:text-white hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all gap-2.5 shadow-sm"
            >
              <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
              <span>View Demo</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                Mock User
              </span>
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Real-time Doctor &amp; Patient Sync</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Carte Chifa &amp; CNAS Compatible</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Integer Money Guardrail (DZD)</span>
          </span>
        </div>

        {/* Scroll Affordance Arrow */}
        <div className="pt-8">
          <button
            type="button"
            onClick={handleScrollToBooking}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer group"
            aria-label="Scroll to booking section"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider">Fast-Track Booking</span>
            <ChevronDown className="size-4 animate-bounce group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
