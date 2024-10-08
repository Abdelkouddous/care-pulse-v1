"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UserFormValidation } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { CustomFormField } from "@/components/forms/CustomFormField";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { getPatient } from "@/lib/actions/patient.actions";

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

export const Login = () => {
  // const token = await account.createPhoneToken(ID.unique(), "+14255550123");

  // const userId = token.userId;

  // const session = await account.createSession(userId, "[SECRET]");
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  // Define the form with `phone` as a field.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      phone: "",
    },
  });

  // Send verification code if it hasn't been sent, or verify code if it has.
  const onSubmit = async ({ phone }: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    try {
      if (!codeSent) {
        // Step 1: Send code to phone number
        const result = await signIn("credentials", {
          phoneNumber: phone,
          redirect: false,
        });

        if (result?.error) {
          console.error("Error sending verification code.");
          setIsLoading(false);
        } else {
          console.log("Code sent successfully!");
          setCodeSent(true); // Switch to verification step
        }
      } else {
        // Step 2: Verify the entered code
        const result = await signIn("credentials", {
          phoneNumber: phone,
          code: verificationCode,
          redirect: true, // Redirect upon successful login
          callbackUrl: "/",
        });

        if (result?.error) {
          console.error("Invalid verification code.");
        } else {
          console.log("Successfully logged in!");
          // router.push(`/${userId}}`);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <section className="mb-12 mt-10 space-y-4">
        <h1 className="header text-center">Welcome back! 👋🏻</h1>
        <p className="text-dark-600 text-center">
          Please enter your phone number to get OTP verification code
        </p>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Phone number field */}
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="21223456"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          disabled={codeSent} // Disable after sending code
        />

        {/* Verification code input if code was sent */}
        {codeSent && (
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            // onChange={(e: any) => setVerificationCode(e.target.value)}
            name="verificationCode"
            label="Verification Code"
            placeholder="Enter code here"
          />
        )}

        <SubmitButton isLoading={isLoading}>
          {codeSent ? "Verify Code" : "Send Verification Code"}
        </SubmitButton>

        <div className="m-auto place-items-center grid">
          <p className="text-dark-600 text-center ">
            Are you an <span className="text-green-400">Admin?</span> <br></br>
            <Link href="/?admin=true" className="text-green-400 text-center ">
              <SubmitButton isLoading={false}>Login as Admin</SubmitButton>
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default Login;
