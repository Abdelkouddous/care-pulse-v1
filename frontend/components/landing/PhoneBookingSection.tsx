"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stethoscope,
  MapPin,
  Calendar,
  Search,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/forms/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { authService } from "@/lib/api/auth.service";
import { ALGERIAN_WILAYAS } from "@/constants/algeria";
import { toast } from "@/hooks/use-toast";

interface PhoneBookingSectionProps {
  onSearchChange?: (filters: { specialty: string; wilaya: string; date: string; visitType: string }) => void;
}

export function PhoneBookingSection({ onSearchChange }: PhoneBookingSectionProps) {
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedWilaya, setSelectedWilaya] = useState("16"); // Default Algiers
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [visitType, setVisitType] = useState<"clinic" | "telehealth">("clinic");
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Pediatrics",
    "General Medicine",
    "Dermatology",
    "Neurology",
    "Orthopedics",
  ];

  // Fast-track phone submission
  const phoneForm = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: "" },
  });

  const onPhoneSubmit = async ({ phone }: z.infer<typeof UserFormValidation>) => {
    setIsSubmittingPhone(true);
    try {
      const exists = await authService.checkPhone(phone);
      if (exists) {
        toast({
          title: "Existing Account Detected",
          description: "Welcome back! Please sign in to book your consultation.",
        });
        router.push(`/login?phone=${encodeURIComponent(phone)}`);
      } else {
        toast({
          title: "New Patient Registration",
          description: "Welcome to VitalBook! Please complete your registration wizard.",
        });
        router.push(`/register?phone=${encodeURIComponent(phone)}`);
      }
    } catch (error) {
      console.error("Fast-track phone error:", error);
      // Fallback for new patients
      router.push(`/register?phone=${encodeURIComponent(phone)}`);
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleSearchAndScroll = () => {
    if (onSearchChange) {
      onSearchChange({
        specialty: selectedSpecialty === "All Specialties" ? "All" : selectedSpecialty,
        wilaya: selectedWilaya,
        date: selectedDate,
        visitType,
      });
    }

    const doctorsElement = document.getElementById("trending-doctors") || document.getElementById("book-appointment");
    if (doctorsElement) {
      doctorsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="phone-booking"
      className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 scroll-mt-16"
    >
      {/* Unified Width Container (Strictly matching max-w-4xl for visual harmony) */}
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* ======================================================================= */}
        {/* 1. FAST-TRACK "CONTINUE WITH PHONE" CARD (UNIFIED WIDTH: max-w-4xl) */}
        {/* ======================================================================= */}
        <Card className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300">
          <CardHeader className="p-0 pb-4 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Fast-Track Patient Access
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                Instant OTP Verification
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Continue with Phone
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Enter your mobile number to sign in or register with verified patient credentials.
            </p>
          </CardHeader>

          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4 pt-2">
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={phoneForm.control}
                name="phone"
                label="MOBILE PHONE NUMBER"
                placeholder="549 88 24 56"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
              />

              <SubmitButton
                isLoading={isSubmittingPhone}
                roleVariant="patient"
                size="lg"
                className="w-full font-bold shadow-lg rounded-2xl py-6 text-sm sm:text-base cursor-pointer"
              >
                Continue to Booking
              </SubmitButton>
            </form>
          </Form>

          {/* Clinician Workspace Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-xs font-semibold text-slate-400">
              Practicing Clinician?
            </span>
            <Link href="/?doctor=true">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold rounded-xl hover:text-sky-600">
                Doctor Portal
              </Button>
            </Link>
          </div>
        </Card>

        {/* Separator / Context Affordance (Unified Width) */}
        <div className="w-full flex items-center justify-center gap-4 py-1">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Or search by specialty, location &amp; date
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* ======================================================================= */}
        {/* 2. AIRBNB-INSPIRED SEARCH BAR (UNIFIED WIDTH: EXACTLY MATCHING max-w-4xl) */}
        {/* ======================================================================= */}
        <div className="w-full">
          <div className="p-2 sm:p-3 rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-left">
              {/* Pill 1: Specialty */}
              <div className="p-3 sm:p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Stethoscope className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    aria-label="Medical Specialty"
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none cursor-pointer truncate"
                  >
                    {specialties.map((spec) => (
                      <option key={spec} value={spec} className="dark:bg-slate-900">
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pill 2: Wilaya / Location */}
              <div className="p-3 sm:p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Wilaya / City
                  </label>
                  <select
                    value={selectedWilaya}
                    aria-label="Wilaya / City"
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none cursor-pointer truncate"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code.toString()} className="dark:bg-slate-900">
                        {w.code < 10 ? `0${w.code}` : w.code} - {w.name} ({w.arabicName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pill 3: Date */}
              <div className="p-3 sm:p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Calendar className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    aria-label="Target Date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 dark:text-white outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Pill 4: Visit Mode & Action Button */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-2 border border-slate-200/60 dark:border-slate-800">
                <div className="flex-1 min-w-0 px-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Visit Mode
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setVisitType("clinic")}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        visitType === "clinic"
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      In-Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisitType("telehealth")}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        visitType === "telehealth"
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      Video
                    </button>
                  </div>
                </div>

                {/* Airbnb Style Search Button */}
                <Button
                  type="button"
                  roleVariant="patient"
                  size="icon"
                  onClick={handleSearchAndScroll}
                  className="size-11 sm:size-12 rounded-2xl shadow-lg shrink-0 cursor-pointer"
                  aria-label="Search and filter specialists"
                >
                  <Search className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhoneBookingSection;
