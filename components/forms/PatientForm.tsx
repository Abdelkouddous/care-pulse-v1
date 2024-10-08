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
        router.push(`/patients/login`);
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
    <Form {...form}>
      <section className="mb-12 space-y-4">
        <h1 className="header text-center">Hello 👋🏻 </h1>
        <p className="text-dark-600 text-center">
          Are you looking to schedule an appointment?
        </p>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* name */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Hml Tech"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        ></CustomFormField>
        {/* {email} */}
        {/* <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="email"
          placeholder="mail@mail.com"
        ></CustomFormField> */}
        {/* phone number */}
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
            Are you an <span className="text-green-400">Admin?</span> <br></br>
            {/* <Link href="/?admin=true" className="text-green-400 text-center ">
             */}
            <Link href="/?admin=true" className="text-green-400 text-center ">
              <SubmitButton
                isLoading={false}
                // className="text-green-400 shad-primary-btn max-w"
              >
                Login as Admin
              </SubmitButton>
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}

export default PatientForm;
