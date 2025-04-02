"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import { SubmitButton } from "../ui/SubmitButton";

import { CustomFormField } from "./CustomFormField";

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
  const currentYear = new Date().getFullYear();

  // Define form with zod resolver
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: "" },
  });

  // Submit handler with proper typing and error handling
  const onSubmit = async ({
    phone,
  }: z.infer<typeof UserFormValidation>): Promise<void> => {
    setIsLoading(true);

    try {
      const userData = { name: "Your Name", phone };

      const newUser = await createUser(userData);

      if (newUser) {
        router.push(`/dashboard/patients/${newUser.$id}/register`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setIsLoading(false);
    }
  };

  // Prevent form submission on Enter key
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <section className="mt-16 md:mt-16">
      <div className=" py-3 ">
        <Card className="my-4 overflow-hidden border-0 shadow-lg md:my-2">
          <h1 className="px-6 pb-4 pt-8 text-center font-serif text-5xl font-bold tracking-tight text-gray-800 fade-in dark:text-white">
            Welcome to{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Pulse
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl px-4 text-center text-lg text-gray-600 dark:text-gray-300">
            Your health journey begins here. Schedule appointments with top
            healthcare professionals in minutes.
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
                      Book Your Appointment
                    </h2>
                    <p className="text-center text-base text-gray-600 dark:text-gray-300 md:text-lg">
                      Enter your phone number to get started
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6 px-6 pb-8">
                    <CustomFormField
                      fieldType={FormFieldType.PHONE_INPUT}
                      control={form.control}
                      name="phone"
                      label="Phone number"
                      placeholder="+213550123456"
                      iconSrc="/assets/icons/user.svg"
                      iconAlt="user"
                      onKeyDown={handleKeyDown}
                    />

                    <SubmitButton
                      isLoading={isLoading}
                      className="cssbuttons-io-button w-full bg-emerald-600 py-3 text-lg transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                      Schedule Now
                      <div className="icon center">
                        <svg
                          height="24"
                          width="24"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path
                            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </SubmitButton>

                    <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 md:grid-cols-2">
                      <div className="text-center">
                        <p className="mb-3 font-medium text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-green-500">
                            Admin Portal
                          </span>
                        </p>
                        <Link href="/?admin=true">
                          <SubmitButton
                            isLoading={false}
                            className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            Login as Admin
                          </SubmitButton>
                        </Link>
                      </div>

                      <div className="text-center">
                        <p className="mb-3 font-medium text-gray-700 dark:text-gray-300">
                          <span className="font-bold text-sky-500">
                            Healthcare Providers
                          </span>
                        </p>
                        <Link href="/?doctor=true">
                          <SubmitButton
                            isLoading={false}
                            className="w-full bg-sky-700 transition-all duration-300 hover:bg-sky-800 dark:bg-sky-600 dark:hover:bg-sky-700"
                          >
                            Login as Doctor
                          </SubmitButton>
                        </Link>
                      </div>
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

export default PatientForm;
