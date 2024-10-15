"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UserFormValidation } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { CustomFormField } from "@/components/forms/CustomFormField";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Client, Account, ID } from "appwrite";

export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
}

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Store the user ID
  const [phone, setPhone] = useState("");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66b93571003a73b1ade3");

  const account = new Account(client);

  // Function to send OTP
  const sendOtp = async (phone: z.infer<typeof UserFormValidation>) => {
    try {
      setIsLoading(true);
      const token = await account.createPhoneToken(ID.unique(), phone.phone);
      setUserId(token.userId); // Save the userId for later verification
      setCodeSent(true);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify OTP
  const verifyOtp = async (verificationCode: string) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const session = await account.updatePhoneSession(
        userId,
        verificationCode
      );
      console.log("Session created successfully", session);
      // Redirect or show success message after verification
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form setup
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: "" },
  });

  return (
    <Form {...form}>
      <Card className="p-4 h-screen mx-4 my-2">
        <section className="my-10 space-y-4">
          <h1 className="header text-center">Welcome back! 👋🏻</h1>
          <p className="text-dark-600 text-center">
            Please enter your phone number to get OTP verification code
          </p>
        </section>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (!codeSent) {
              const phoneValue = form.getValues("phone");
              setPhone(phoneValue);
              sendOtp({ phone: phoneValue });
              console.log(sendOtp);
            } else {
              const verificationCode = form.getValues("verificationCode");
              verifyOtp(verificationCode);
            }
          }}
        >
          {/* Phone number field */}
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="+14255550123"
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
