"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/forms/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { authService } from "@/lib/api/auth.service";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { ALGERIAN_WILAYAS } from "@/constants/algeria";

interface PhoneBookingSectionProps {
  searchFilters?: {
    specialty: string;
    wilaya: string;
    date: string;
    visitType: string;
  };
}

export function PhoneBookingSection({ searchFilters }: PhoneBookingSectionProps) {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  // Fast-track phone submission form
  const phoneForm = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: "" },
  });

  const buildQueryParams = (phoneNum: string) => {
    const params = new URLSearchParams({ phone: phoneNum });
    if (searchFilters?.specialty && searchFilters.specialty !== "All") {
      params.set("specialty", searchFilters.specialty);
    }
    if (searchFilters?.wilaya) {
      params.set("wilaya", searchFilters.wilaya);
    }
    if (searchFilters?.date) {
      params.set("date", searchFilters.date);
    }
    if (searchFilters?.visitType) {
      params.set("visitType", searchFilters.visitType);
    }
    return params.toString();
  };

  const onPhoneSubmit = async ({ phone }: z.infer<typeof UserFormValidation>) => {
    setIsSubmittingPhone(true);
    const queryStr = buildQueryParams(phone);
    try {
      const exists = await authService.checkPhone(phone);
      if (exists) {
        toast({
          title: "Compte Existant Détecté",
          description: "Bienvenue ! Veuillez vous connecter pour finaliser votre consultation.",
        });
        router.push(`/login?${queryStr}`);
      } else {
        toast({
          title: "Nouveau Patient",
          description: "Bienvenue sur Wateen Book ! Finalisez votre inscription en 30 secondes.",
        });
        router.push(`/register?${queryStr}`);
      }
    } catch (error) {
      console.error("Fast-track phone error:", error);
      router.push(`/register?${queryStr}`);
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const selectedWilayaObj = searchFilters?.wilaya
    ? ALGERIAN_WILAYAS.find((w) => w.code.toString() === searchFilters.wilaya)
    : null;

  return (
    <section
      id="phone-booking"
      className="w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Active Search Summary Pill (Reflects Hero criteria without duplicate inputs) */}
        {searchFilters && (searchFilters.specialty !== "All" || selectedWilayaObj) && (
          <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            <span className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="size-3.5" />
              {locale === "ar" ? "معايير الحجز المحددة:" : "Critères sélectionnés :"}
            </span>
            {searchFilters.specialty && searchFilters.specialty !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                <Stethoscope className="size-3 text-emerald-600 dark:text-emerald-400" />
                {searchFilters.specialty}
              </span>
            )}
            {selectedWilayaObj && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                <MapPin className="size-3 text-sky-600 dark:text-sky-400" />
                {selectedWilayaObj.name} ({selectedWilayaObj.code})
              </span>
            )}
            {searchFilters.date && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                <Calendar className="size-3 text-amber-600 dark:text-amber-400" />
                {searchFilters.date}
              </span>
            )}
          </div>
        )}

        {/* Primary Fast-Track Phone Card */}
        <Card className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300">
          <CardHeader className="p-0 pb-5 text-left rtl:text-right space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {t.auth.fastTrackBadge}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                {t.common.instantConfirmation}
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.auth.fastTrackTitle}
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.auth.fastTrackSubtitle}
            </p>

            {/* Reassurance Guarantees */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                {t.common.freeForPatients}
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.common.carteChifaAccepted}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-2">
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={phoneForm.control}
                  name="phone"
                  label={t.auth.phoneLabel}
                  placeholder={t.auth.phonePlaceholder}
                  iconSrc="/assets/icons/user.svg"
                  iconAlt="user"
                />

                <SubmitButton
                  isLoading={isSubmittingPhone}
                  roleVariant="patient"
                  size="lg"
                  className="w-full font-bold shadow-lg rounded-2xl py-6 text-sm sm:text-base cursor-pointer"
                >
                  {t.auth.continueButton}
                </SubmitButton>
              </form>
            </Form>

            {/* Clinician Workspace Switcher */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.auth.practitionerPrompt}
              </span>
              <Link href="/?doctor=true">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-semibold rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400">
                  {t.auth.practitionerLink}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default PhoneBookingSection;
