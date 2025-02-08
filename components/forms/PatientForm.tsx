"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "../ui/SubmitButton";
import { CustomFormField } from "./CustomFormField";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({ phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const userData = {
        name: "Your Name",
        phone,
      };
      const newUser = await createUser(userData);
      if (newUser) {
        router.push(`/dashboard/patients/${newUser.$id}/register`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // 3. Define the onKeyDown handler to prevent form submission on "Enter" key press.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div className="relative h-screen">
      <h1 className="font-serif text-4xl m-4 fade-in">Welcome to Pulse</h1>
      <div className="flex m-auto max-w-screen space-x-1 justify-between fade-in">
        <Card className="flex flex-1 m-auto w-screen my-2 space-x-1 justify-center md:bg-none md:p-5 p-auto items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="min-w-64 my-2 mx-2 p-2"
            >
              <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
                <h1 className="header text-center">Hello 👋🏻</h1>
                <span className="text-dark-600 text-center">
                  Are you looking to schedule an appointment?
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label="Phone number"
                  placeholder="+213550123456"
                  iconSrc="/assets/icons/user.svg"
                  iconAlt="user"
                  // Add the onKeyDown handler here
                />
                <SubmitButton
                  isLoading={isLoading}
                  className="cssbuttons-io-button flex m-auto"
                >
                  Get started
                  <div className="icon center">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </SubmitButton>
                <div className="m-auto place-items-center grid grid-cols-2">
                  <p className="text-dark-600 text-center">
                    Are you an <span className="text-green-400">Admin?</span>{" "}
                    <br />
                    <Link href="/?admin=true">
                      <SubmitButton isLoading={false}>
                        Login as Admin
                      </SubmitButton>
                    </Link>
                  </p>
                  <p className="text-center my-2">
                    Are you a <span className="text-sky-400">Doctor?</span>{" "}
                    <br />
                    <Link href="/?doctor=true">
                      <SubmitButton
                        isLoading={false}
                        className="shad-primary-btn hover:scale-105 bg-sky-800 hover:bg-sky-900 dark:bg-sky-50 dark:hover:bg-sky-800 dark:hover:text-sky-50 max-w"
                      >
                        <span>Login as Doctor</span>
                      </SubmitButton>
                    </Link>
                  </p>
                </div>
              </CardContent>
            </form>
          </Form>
          <Image
            src="/assets/main.jpg"
            height={1000}
            width={1000}
            alt="Doctor"
            className="hidden md:m-auto md:fade-in md:flex md:max-w-[50%] my-2 mx-2 p-2 md:min-h-full md:rounded-3xl md:shadow-gray-400 dark:shadow-slate-300 md:shadow-sm opacity-95"
          />
        </Card>
      </div>
    </div>
  );
}

export default PatientForm;
