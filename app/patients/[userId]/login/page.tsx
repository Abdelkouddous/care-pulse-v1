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
import { Card } from "@/components/ui/card";
import { Client, Account, ID } from "appwrite";

export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
}

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  // Form setup
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: "" },
  });

  const onSubmit = async ({ phone }: z.infer<typeof UserFormValidation>) => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("66b93571003a73b1ade3");

    const account = new Account(client);
    setIsLoading(true);

    try {
      if (!codeSent) {
        // Step 1: Send verification code
        console.log("Attempting to send verification code to:", phone);

        const token = await account.createPhoneToken(ID.unique(), phone);

        if (token) {
          console.log("Code sent successfully to:", phone);
          setCodeSent(true);
        } else {
          console.error("Failed to send verification code.");
        }
      } else {
        // Step 2: Verify code
        console.log("Attempting to verify with code:", verificationCode);

        const result = await signIn("credentials", {
          phoneNumber: phone,
          code: verificationCode,
          redirect: true,
          callbackUrl: "/", // Where to redirect on success
        });

        if (result?.error) {
          console.error("Invalid verification code:", result.error);
        } else {
          console.log("Verification successful! Redirecting...");
          router.push("/");
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred during login:", error);
      alert("An error occurred: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <Card className="p-4 h-screen mx-4 my-2">
        <section className="my-10 space-y-4">
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
              name="verificationCode"
              label="Verification Code"
              placeholder="Enter code here"
              onChange={(e) => {
                console.log("Verification code input:", e.target.value);
                setVerificationCode(e.target.value);
              }}
            />
          )}

          <SubmitButton isLoading={isLoading}>
            {codeSent ? "Verify Code" : "Send Verification Code"}
          </SubmitButton>

          <div className="m-auto place-items-center grid">
            <p className="text-dark-600 text-center ">
              Are you an <span className="text-green-400">Admin?</span> <br />
              <Link href="/?admin=true" className="text-green-400 text-center">
                <SubmitButton isLoading={false}>Login as Admin</SubmitButton>
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </Form>
  );
};

export default Login;
