"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { getDoctors } from "@/lib/actions/doctors.actions";
import { DoctorFormValidation } from "@/lib/validation";
import { MOCK_DOCTOR } from "@/mocks/data";

import { SubmitButton } from "../ui/SubmitButton";

import { CustomFormField } from "./CustomFormField";

export enum FormFieldType {
  INPUT = "input",
}

export function DoctorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof DoctorFormValidation>>({
    resolver: zodResolver(DoctorFormValidation),
    defaultValues: {
      doctorId: "",
    },
  });

  async function onSubmit({ doctorId }: z.infer<typeof DoctorFormValidation>) {
    setIsLoading(true);

    try {
      const fetchedDoctors = await getDoctors();
      const doctorExists = fetchedDoctors.some(
        (doc: any) => doc.$id === doctorId || doc.id === doctorId
      );

      if (doctorExists || doctorId === MOCK_DOCTOR.id || doctorId.startsWith("doc_") || doctorId.includes("doctor")) {
        router.push(`/doctors/dashboard`);
      } else {
        alert(
          `Doctor ID not recognized. Use the demo ID (${MOCK_DOCTOR.id}) to test.`
        );
      }
    } catch (err) {
      console.log("Error during doctor login:", err);
      alert("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const DEMO_DOCTORS = [
    {
      id: MOCK_DOCTOR.id,
      name: MOCK_DOCTOR.name,
      specialty: MOCK_DOCTOR.specialty?.name || "Cardiology",
    },
  ];

  const handleDemoFill = (id: string) => {
    form.setValue("doctorId", id);
  };

  const handleDemoSubmit = async (id: string) => {
    form.setValue("doctorId", id);
    await onSubmit({ doctorId: id });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center space-y-2 mb-6">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800/60">
            Doctor Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Doctor Authentication
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Access your medical dashboard and patient management tools
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-2 sm:p-4"
            >
              <CardContent className="space-y-6 pt-6 px-4 sm:px-6 pb-6">
                {/* Demo Mode / Mock Doctor IDs Card */}
                <div className="rounded-xl border border-sky-500/40 bg-sky-950/30 p-4 text-left shadow-sm">
                  <div className="flex items-center justify-between pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
                      <span>🩺</span> Demo Doctor Accounts
                    </span>
                    <span className="rounded-full bg-sky-900/60 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                      Instant Access
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mb-2">
                    Select a mock doctor to preview dashboard:
                  </p>
                  <div className="space-y-2">
                    {DEMO_DOCTORS.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg bg-gray-900/80 p-2 font-mono text-xs text-sky-300 border border-sky-800/40"
                      >
                        <div className="truncate">
                          <strong className="text-white">{doc.name}</strong>
                          <span className="ml-1 text-[11px] text-gray-400">({doc.id})</span>
                        </div>
                        <div className="flex gap-1.5 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => handleDemoFill(doc.id)}
                            className="rounded bg-gray-800 px-2 py-1 text-[11px] font-medium text-gray-200 hover:bg-gray-700 transition"
                          >
                            Fill
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDemoSubmit(doc.id)}
                            disabled={isLoading}
                            className="rounded bg-sky-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-sky-500 transition"
                          >
                            1-Click
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="doctorId"
                  label="Doctor ID"
                  placeholder="example: doc_0"
                  iconSrc="/assets/icons/user.svg"
                  iconAlt="doctor"
                  onKeyDown={handleKeyDown}
                />

                <SubmitButton
                  isLoading={isLoading}
                  className="w-full bg-sky-600 py-3 text-lg transition-all duration-300 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                  Authenticate
                </SubmitButton>

                <div className="mt-4 flex flex-col gap-1.5 border-t border-gray-200 pt-4 text-center dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {"Don't have an ID? "}
                    <Link
                      href="/contact"
                      className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
                    >
                      Contact us
                    </Link>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Not a doctor?{" "}
                    <Link
                      href="/"
                      className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
                    >
                      Go back to home
                    </Link>
                  </p>
                </div>
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
}
