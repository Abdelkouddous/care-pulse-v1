"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createUser, getPatient } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";
import { SubmitButton } from "../ui/SubmitButton";
import { CustomFormField } from "./CustomFormField";
import { toast } from "@/hooks/use-toast";
import { DICTIONARY_EN } from "@/constants/locales/en";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  CUSTOM = "custom",
}

export function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: "" },
  });

  const onSubmit = async ({
    phone,
  }: z.infer<typeof UserFormValidation>): Promise<void> => {
    setIsLoading(true);

    try {
      const userData = { name: "Patient User", phone };
      const user = await createUser(userData);

      if (user) {
        const patient = await getPatient(user.$id);
        if (patient) {
          router.push(`/signin?phone=${encodeURIComponent(phone)}`);
        } else {
          router.push(`/register?phone=${encodeURIComponent(phone)}`);
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl">
        <div className="text-center space-y-4 py-8">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            {DICTIONARY_EN.hero.badge}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {DICTIONARY_EN.hero.titlePrimary}{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              {DICTIONARY_EN.hero.titleSecondary}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {DICTIONARY_EN.hero.subtitle}
          </p>
          {/* Trust Metric Indicator */}
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {DICTIONARY_EN.hero.trustBar}
          </p>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-stretch justify-center gap-8 px-4">
          {/* Main Appointment Scheduling Card */}
          <Card className="w-full md:max-w-lg overflow-hidden border border-slate-200 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 rounded-2xl backdrop-blur-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 sm:p-4">
                <CardHeader className="text-center space-y-1 pb-4 pt-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {DICTIONARY_EN.hero.form.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {DICTIONARY_EN.hero.form.subtitle}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label={DICTIONARY_EN.hero.form.phoneLabel}
                    placeholder={DICTIONARY_EN.hero.form.phonePlaceholder}
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                    onKeyDown={handleKeyDown}
                  />

                  {/* Unified Patient Submit Button */}
                  <SubmitButton
                    isLoading={isLoading}
                    roleVariant="patient"
                    size="lg"
                    className="w-full font-bold shadow-lg"
                  >
                    {DICTIONARY_EN.hero.form.submitButton}
                  </SubmitButton>

                  {/* Unified Role Portal Navigation Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                    <div className="text-center space-y-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {DICTIONARY_EN.hero.portals.adminTitle}
                      </p>
                      <Link href="/?admin=true" className="block">
                        <Button
                          type="button"
                          roleVariant="admin"
                          size="default"
                          className="w-full"
                        >
                          {DICTIONARY_EN.hero.portals.adminAction}
                        </Button>
                      </Link>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {DICTIONARY_EN.hero.portals.doctorTitle}
                      </p>
                      <Link href="/?doctor=true" className="block">
                        <Button
                          type="button"
                          roleVariant="doctor"
                          size="default"
                          className="w-full"
                        >
                          {DICTIONARY_EN.hero.portals.doctorAction}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Form>
          </Card>

          {/* Test Sandbox Credentials (Unified Roles: Patient, Doctor, Admin) */}
          {process.env.NODE_ENV === "development" && (
            <div className="w-full md:max-w-md flex flex-col justify-center space-y-4">
              <div className="text-left space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {DICTIONARY_EN.hero.testAccounts.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {DICTIONARY_EN.hero.testAccounts.subtitle}
                </p>
              </div>

              <div className="grid gap-3">
                <Card className="p-4 border-l-4 border-l-emerald-500 shadow-sm dark:bg-slate-900/60 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {DICTIONARY_EN.hero.testAccounts.patient.role}
                    </span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded">
                      Standard
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    Phone: {DICTIONARY_EN.hero.testAccounts.patient.phone}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    OTP: {DICTIONARY_EN.hero.testAccounts.patient.code}
                  </p>
                </Card>

                <Card className="p-4 border-l-4 border-l-sky-500 shadow-sm dark:bg-slate-900/60 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      {DICTIONARY_EN.hero.testAccounts.doctor.role}
                    </span>
                    <span className="text-xs bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 px-2 py-0.5 rounded">
                      Staff
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    Passkey: {DICTIONARY_EN.hero.testAccounts.doctor.passkey}
                  </p>
                </Card>

                <Card className="p-4 border-l-4 border-l-slate-600 shadow-sm dark:bg-slate-900/60 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {DICTIONARY_EN.hero.testAccounts.admin.role}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded">
                      Root
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    Passkey: {DICTIONARY_EN.hero.testAccounts.admin.passkey}
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PatientForm;
