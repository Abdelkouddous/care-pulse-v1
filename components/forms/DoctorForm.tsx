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
        (doc: any) => doc.$id === doctorId
      );

      if (doctorExists) {
        router.push(`../doctor/${doctorId}/page`);
      } else {
        alert(
          "You are not a doctor. Please contact the tech team for a doctor account."
        );
      }
    } catch (err) {
      console.log("Error during doctor login:", err);
      alert("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <section className="mt-16 md:mt-16">
      <div className="py-3">
        <Card className="my-4 overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:my-2">
          <h1 className="px-6 pb-4 pt-8 text-center font-serif text-5xl font-bold tracking-tight text-gray-800 fade-in dark:text-white">
            Doctor Portal
          </h1>

          <p className="mx-auto mb-8 max-w-2xl px-4 text-center text-lg text-gray-600 dark:text-gray-300">
            Access your medical dashboard and patient management tools
          </p>

          <div className="mx-auto my-2 flex max-w-6xl justify-between px-4 fade-in md:px-8">
            <Card className="mx-auto w-full overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:max-w-md">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-1 md:p-2"
                >
                  <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-4 pt-6">
                    <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
                      Doctor Authentication
                    </h2>
                    <p className="text-center text-base text-gray-600 dark:text-gray-300 md:text-lg">
                      Enter your doctor ID to continue
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6 px-6 pb-8">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="doctorId"
                      label="Doctor ID"
                      placeholder="example: 66fef3z40dd29b9ab761"
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

                    <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4 text-center dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300">
                        Don't have an ID?{" "}
                        <Link
                          href="/contact"
                          className="font-semibold text-sky-600 hover:underline dark:text-sky-400"
                        >
                          Contact us
                        </Link>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
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
        </Card>
      </div>
    </section>
  );
}
