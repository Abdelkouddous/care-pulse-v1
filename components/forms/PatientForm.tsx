"use client";

//used for validation
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

/** */
export function PatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      // email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    name,
    // email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //we wanna create a patient
    setIsLoading(true);
    try {
      //this is currenthly userdata ( not created user yet)
      const userData = { name, phone }; //email,
      //this is logic to register user and put it in the db
      const newUser = await createUser(userData);
      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
        setIsLoading(false);
        // setIsLoggedIn(true);
      } else {
        router.push(`/patients/${newUser.$id}/login`);
      }
    } catch (err) {
      console.log(err);
      console.error(err);
    }
    console.log(
      `successfully submitted patient with Name : ${name} Phone: ${phone}`
    );
  }
  return (
    <div>
      <h1 className=" font-serif text-4xl m-4 fade-in"> Welcome to Pulse</h1>
      {/* <Card
        className="relative flex flex-1 m-auto w-screen  my-2 space-x-1
      justify-center md:bg-none md:w-screen md:p-5 border-collapse"
      >
        <CardHeader>Welcome to pulse</CardHeader>
      </Card> */}

      <div
        className=" flex m-auto max-w-screen relative space-x-1 
      justify-between fade-in
"
      >
        <Card
          className="relative flex flex-1 m-auto w-screen  my-2 space-x-1
      justify-center md:bg-none md:w-screen md:p-5"
        >
          {/* <Image
          src="/assets/main.jpg"
          height={1000}
          width={1000}
          alt="Doctor"
          className="hidden md:block max-w-[40%] my-2 mx-2 p-2 m-auto"
        />{" "} */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="min-w-64 my-2 mx-2 p-2 "
            >
              <Card
                x-chunk="dashboard-01-chunk-1 "
                className="fade-in my-2 mx-2 p-2 space-y-2 min-h-screen min-w-screen items-center"
              >
                <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
                  <h1 className="header text-center">Hello 👋🏻 </h1>
                  <span className="text-dark-600 text-center ">
                    Are you looking to schedule an appointment?
                  </span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Hml Tech"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                  ></CustomFormField>
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone number"
                    placeholder="+213550123456"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                  ></CustomFormField>
                  <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
                  <div className="m-auto place-items-center grid ">
                    {" "}
                    {/* <p className="text-dark-600 text-center ">
            Already registered ? <br></br>{" "}
          </p>
          <Link href="/?login=true" className="text-center ">
            <SubmitButton
              isLoading={false}
              className="mb-4 shad-primary-btn max-w"
            >
              Login
            </SubmitButton>{" "}
          </Link> */}
                    <p className="text-dark-600 text-center ">
                      Are you an <span className="text-green-400">Admin?</span>{" "}
                      <br></br>
                      {/* <Link href="/?admin=true" className="text-green-400 text-center ">
                       */}
                      <Link
                        href="/?admin=true"
                        className="text-green-400 text-center "
                      >
                        <SubmitButton
                          isLoading={false}
                          // className="text-green-400 shad-primary-btn max-w"
                        >
                          Login as Admin
                        </SubmitButton>
                      </Link>
                    </p>
                  </div>
                </CardContent>
                {/* name */}

                {/* {email} */}
                {/* <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="email"
          placeholder="mail@mail.com"
        ></CustomFormField> */}
                {/* phone number */}
              </Card>{" "}
            </form>
          </Form>
          <Image
            src="/assets/main.jpg"
            height={1000}
            width={1000}
            alt="Doctor"
            className=" hidden md:m-auto md:fade-in md:flex  md:max-w-[50%] my-2 mx-2 p-2 md:min-h-screen md:rounded-3xl md:shadow-gray-400 dark:shadow-slate-300 md:shadow-sm opacity-95"
          />{" "}
        </Card>
      </div>
    </div>
  );
}

export default PatientForm;
