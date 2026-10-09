"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, CheckCircle2, ShieldCheck, MapPin, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DICTIONARY_EN } from "@/constants/locales/en";

interface ZTestimonialItem {
  name: string;
  role: string;
  wilaya: string;
  initials: string;
  avatarBg: string;
  rating: number;
  doctorVisited: string;
  specialty: string;
  date: string;
  quote: string;
  highlight: string;
}

export function Testimonials() {
  const testimonialsList: ZTestimonialItem[] = [
    {
      name: "Amina Belarbi",
      role: "Verified Patient",
      wilaya: "16 - Alger (Didouche)",
      initials: "AB",
      avatarBg: "bg-emerald-600",
      rating: 5,
      doctorVisited: "Dr. Amine Mansouri",
      specialty: "Cardiology Consultation",
      date: "September 2026",
      quote:
        "Booking with Dr. Mansouri through VitalBook saved me hours of waiting in a crowded clinic. The DZD fee was clearly stated beforehand, my Carte Chifa was registered seamlessly, and I walked right into my 09:30 AM appointment without delay.",
      highlight: "Saved 3 hours of clinic queue time with guaranteed time-slot.",
    },
    {
      name: "Karim Haddad",
      role: "Verified Parent",
      wilaya: "31 - Oran (Es Senia)",
      initials: "KH",
      avatarBg: "bg-sky-600",
      rating: 5,
      doctorVisited: "Dr. Yasmine Benali",
      specialty: "Pediatrics & Vaccination",
      date: "August 2026",
      quote:
        "As a parent, having immediate access to verified pediatric specialists across wilayas gives total peace of mind. Dr. Benali was attentive, professional, and the follow-up instructions were immediately accessible on my patient dashboard.",
      highlight: "Complete digital pediatric health records with instant doctor triage.",
    },
    {
      name: "Fatima Zahra Mansour",
      role: "Verified Patient",
      wilaya: "25 - Constantine (Sidi Mabrouk)",
      initials: "FM",
      avatarBg: "bg-teal-600",
      rating: 5,
      doctorVisited: "Dr. Leila Khelifi",
      specialty: "Dermatology Follow-up",
      date: "September 2026",
      quote:
        "The authentication with mobile OTP and biometric NIN makes this feel like a truly modern European or North American healthcare portal, tailored specifically for Algerians. The whole booking process took less than 60 seconds.",
      highlight: "Under 60-second digital booking with verified national ID security.",
    },
  ];

  return (
    <section id="testimonials" className="w-full py-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Outer Container Card */}
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl dark:bg-slate-900/80 rounded-3xl">
          {/* Section Header */}
          <CardHeader className="text-center pb-6 pt-8 px-4 sm:px-8 border-b border-slate-100 dark:border-slate-800">
            <div className="mx-auto max-w-3xl space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                {DICTIONARY_EN.testimonials.badge}
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                {DICTIONARY_EN.testimonials.title}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                {DICTIONARY_EN.testimonials.subtitle}
              </p>
            </div>
          </CardHeader>

          {/* ======================================================================= */}
          {/* Z-PATTERN (ZIG-ZAG) TESTIMONIAL LAYOUT */}
          {/* ======================================================================= */}
          <CardContent className="p-6 sm:p-10 space-y-8">
            {testimonialsList.map((item, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={item.name}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  } items-stretch gap-6 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-md hover:shadow-xl transition-all duration-300`}
                >
                  {/* Z Column 1: Patient Profile & Metadata Card (1/3 width on desktop) */}
                  <div className="md:w-5/12 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`size-14 rounded-2xl ${item.avatarBg} text-white flex items-center justify-center font-black text-lg shadow-md shrink-0`}
                        >
                          {item.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {item.name}
                            </h3>
                            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
                            {item.role}
                          </span>
                        </div>
                      </div>

                      {/* Location & Star Rating */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <MapPin className="size-3.5 text-slate-400 shrink-0" />
                          <span>{item.wilaya}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Calendar className="size-3.5 text-slate-400 shrink-0" />
                          <span>Consultation: {item.date}</span>
                        </div>
                        <div className="flex items-center gap-1 pt-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="size-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                          <span className="ml-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                            5.0 / 5.0
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attending Physician Pill */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Physician:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.doctorVisited}
                      </span>
                    </div>
                  </div>

                  {/* Z Column 2: Testimonial Narrative & Highlight (7/12 width on desktop) */}
                  <div className="md:w-7/12 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.specialty}
                        </span>
                        <Quote className="size-8 text-emerald-500/20 dark:text-emerald-400/20" />
                      </div>

                      {/* Main Quote */}
                      <blockquote className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 italic font-medium">
                        &ldquo;{item.quote}&rdquo;
                      </blockquote>
                    </div>

                    {/* Verified Outcome Banner */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                        {item.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Testimonials;
