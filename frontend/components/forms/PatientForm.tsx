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
import { DemoTourModal } from "@/components/DemoTourModal";
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
          router.push(`/login?phone=${encodeURIComponent(phone)}`);
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
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
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

                  {/* Doctor Portal Navigation */}
                  <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
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

          {/* Professional MVP Evaluation Tour & Real Account Flow Separation */}
          <div className="w-full md:max-w-md flex flex-col justify-center space-y-4">
            <div className="text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Evaluating CarePulse MVP?
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Interactive Role Sandbox
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore pre-seeded healthcare workflows across all 3 roles without manual data entry.
              </p>
            </div>

            <DemoTourModal variant="banner" />

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Production-Ready Capabilities
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Real PostgreSQL DB with UUIDv4 primary keys</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Sanctum Bearer Token Auth with IP-compound rate limiting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Integer Money Guardrail (cents in DZD currency)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatientForm;
