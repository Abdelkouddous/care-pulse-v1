"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stethoscope,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Phone,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/forms/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { createUser, getPatient } from "@/lib/actions/patient.actions";
import { useDoctorsList } from "@/hooks/useDoctors";
import { MOCK_DOCTOR_DISPLAY } from "@/mocks/data";
import { toast } from "@/hooks/use-toast";
import { DICTIONARY_EN } from "@/constants/locales/en";

interface BookAppointmentSectionProps {
  filterSpecialty?: string;
  filterWilaya?: string;
}

export function BookAppointmentSection({
  filterSpecialty = "All",
  filterWilaya = "16",
}: BookAppointmentSectionProps) {
  const router = useRouter();
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [selectedSpecialtyTab, setSelectedSpecialtyTab] = useState(filterSpecialty);

  const { data: doctorsData, isLoading: isDoctorsLoading } = useDoctorsList();

  // Resolve doctors from API or centralized canonical mock fixture
  const doctorsList = doctorsData?.doctors && doctorsData.doctors.length > 0
    ? doctorsData.doctors.map((doc) => ({
        id: doc.id,
        name: doc.name || `Dr. ${doc.first_name} ${doc.last_name}`,
        specialty: doc.specialty?.name || "General Medicine",
        avatar: doc.avatar_url?.startsWith("/assets") ? doc.avatar_url : MOCK_DOCTOR_DISPLAY.avatar,
        address: (doc as any).clinic?.address || "12 Rue Didouche Mourad, Alger",
        wilaya: "16 - Alger",
        fee_cents: doc.consultation_fee_cents || 400000,
        fee_dzd: `${Math.round((doc.consultation_fee_cents || 400000) / 100).toLocaleString()} DZD`,
        rating: 4.9,
        reviewsCount: 120,
        license: doc.license_number || MOCK_DOCTOR_DISPLAY.license,
        nextSlot: "Tomorrow, 09:30 AM",
      }))
    : [MOCK_DOCTOR_DISPLAY];

  // Filter doctors by active tab
  const filteredDoctors = doctorsList.filter((doc) => {
    if (selectedSpecialtyTab === "All" || selectedSpecialtyTab === "All Specialties") return true;
    return doc.specialty.toLowerCase() === selectedSpecialtyTab.toLowerCase();
  });

  // Fast-track phone submission
  const phoneForm = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: "" },
  });

  const onPhoneSubmit = async ({ phone }: z.infer<typeof UserFormValidation>) => {
    setIsSubmittingPhone(true);
    try {
      const userData = { name: "Patient User", phone };
      const user = await createUser(userData);

      if (user) {
        const patient = await getPatient(user.$id);
        if (patient) {
          router.push(`/login?phone=${encodeURIComponent(phone)}`);
        } else {
          router.push(`/register?phone=${encodeURIComponent(phone)}`);
        }
      }
    } catch (error) {
      console.error("Fast-track phone error:", error);
      toast({
        title: "Submission Error",
        description: "Could not proceed with phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleBookDoctor = (doctorId: string) => {
    router.push(`/appointments/new?doctorId=${encodeURIComponent(doctorId)}`);
  };

  const specialtyTabs = ["All", "Cardiology", "Pediatrics", "General Medicine", "Dermatology"];

  return (
    <section id="book-appointment" className="w-full py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Guaranteed Clinical Scheduling
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Book Your Appointment
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Select an attending physician from our verified national roster with transparent fees in Algerian Dinars (DZD),
            or enter your phone number to start instant booking.
          </p>

          {/* Specialty Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {specialtyTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedSpecialtyTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedSpecialtyTab === tab
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Layout: Doctors Roster (Airbnb style) + Fast-track Phone & Portals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Airbnb-Style Doctor Cards Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredDoctors.map((doc) => (
              <Card
                key={doc.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Doctor Avatar Header */}
                <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={doc.avatar}
                    alt={doc.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Specialty Badge & Rating */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-xs">
                      {doc.specialty}
                    </span>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold">
                      <Star className="size-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-white/70">({doc.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Bottom Doctor Name & License */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base tracking-tight">{doc.name}</h3>
                      <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-white/80 font-mono">License: {doc.license}</p>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.address}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                      <Clock className="size-3.5 text-emerald-500" />
                      <span>{doc.nextSlot}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Fee</span>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {doc.fee_dzd}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    roleVariant="patient"
                    size="default"
                    onClick={() => handleBookDoctor(doc.id)}
                    className="w-full rounded-xl text-xs font-bold shadow-sm gap-2"
                  >
                    <span>Reserve Consultation</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column: Fast-Track Mobile Form + Portals + Demo Tour (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Phone Sign In Form */}
            <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl p-6 backdrop-blur-md">
              <CardHeader className="p-0 pb-4 text-left space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Fast-Track Access
                </span>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Continue with Phone
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your mobile number to sign in or register with OTP verification.
                </p>
              </CardHeader>

              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={phoneForm.control}
                    name="phone"
                    label="Algerian Mobile Number"
                    placeholder="+213 550 12 34 56"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                  />

                  <SubmitButton
                    isLoading={isSubmittingPhone}
                    roleVariant="patient"
                    size="lg"
                    className="w-full font-bold shadow-md rounded-xl"
                  >
                    Continue to Booking
                  </SubmitButton>
                </form>
              </Form>

              {/* Portal Access Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Practicing Clinician?
                </p>
                <Link href="/?doctor=true" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-xl">
                    Doctor Portal
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Sandbox Evaluation Banner */}
            <div className="p-5 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Evaluating CarePulse SaaS?
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                Test the Complete Booking Loop
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Log in as Mock Patient Sarah Benali to book a consultation, then switch to Attending Physician Dr. Amine Mansouri to verify queue triage in real time.
              </p>
              <Link href="/demo/login" className="block pt-1">
                <Button
                  roleVariant="patient"
                  size="sm"
                  className="w-full rounded-xl text-xs font-bold gap-1.5 shadow-sm"
                >
                  <span>Launch Demo Sandbox</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookAppointmentSection;
