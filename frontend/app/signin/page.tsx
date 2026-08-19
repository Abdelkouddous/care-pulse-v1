"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormFieldType } from "@/components/CustomFormField";
import { CustomFormField } from "@/components/forms/CustomFormField";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "@/hooks/use-toast";
import { TokenManager } from "@/lib/auth";
import { UserFormValidation } from "@/lib/validation";

function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState("");
  const [passkey, setPasskey] = useState("");
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "";

  // Check for existing token on component mount
  useEffect(() => {
    const existingToken = TokenManager.getToken();
    if (existingToken) {
      router.push(`/dashboard/patients/${existingToken}/new-appointment`);
    }
  }, [router]);

  // Start countdown timer when OTP is sent
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (codeSent && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setOpen(false);
      setCodeSent(false);
      setTimeLeft(45);
      toast({
        title: "Time Expired",
        description: "Verification code has expired. Please request a new one.",
        variant: "destructive",
      });
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [codeSent, timeLeft]);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: phoneParam },
  });

  // Pre-fill phone if passed in URL params
  useEffect(() => {
    if (phoneParam) {
      form.setValue("phone", phoneParam);
    }
  }, [phoneParam, form]);

  const closeModal = () => {
    setOpen(false);
  };

  const [expectedCode, setExpectedCode] = useState<string>("");
  const deleteExistingSession = async () => {
    // Backend-agnostic: no-op until auth backend is wired
    return;
  };

  const sendOtp = async (phone: string) => {
    try {
      setIsLoading(true);
      setError(""); // Clear any previous errors

      // Delete existing sessions before creating a new one (no-op)
      await deleteExistingSession();

      // Generate a mock OTP code and a temporary userId
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedCode(code);
      setUserId(`user_${Date.now()}`);
      setCodeSent(true);
      setOpen(true);
      setTimeLeft(45);

      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the OTP",
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      const errorMessage =
        error.message || "Failed to send verification code. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (verificationCode: string) => {
    if (!userId) {
      setError("Session expired. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(""); // Clear any previous errors

      // Accept any 6-digit code for now or match the generated code
      const isValid = verificationCode?.length === 6;
      if (!isValid) {
        throw new Error("Incorrect OTP. Please try again.");
      }

      TokenManager.setToken(userId);
      setOpen(false);

      toast({
        title: "Login Successful",
        description:
          "You have been successfully logged in. This is a temporary session.",
      });

      router.push(`/dashboard/patients/${userId}/new-appointment`);
    } catch (error: any) {
      const errorMessage = error.message || "Incorrect OTP. Please try again.";
      setError(errorMessage);
      setOpen(true);
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <section className="mt-16 md:mt-16">
        <div className="py-3">
          <Card className="my-4 overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:my-2">
            {/* Add Back Button */}
            <div className="absolute left-4 top-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Image
                  src="/assets/icons/arrow-left.svg"
                  alt="Back"
                  width={20}
                  height={20}
                />
                <span>Back</span>
              </button>
            </div>

            <h1 className="px-6 pb-4 pt-8 text-center font-serif text-5xl font-bold tracking-tight text-gray-800 fade-in dark:text-white">
              Secure Verification
            </h1>

            <p className="mx-auto mb-8 max-w-2xl px-4 text-center text-lg text-gray-600 dark:text-gray-300">
              Protect your account with two-factor authentication
            </p>

            <div className="mx-auto my-2 flex flex-col md:flex-row max-w-6xl items-start gap-8 px-4 fade-in md:px-8">
              <Card className="mx-auto w-full overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:max-w-md">
                <form
                  className="space-y-8 p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!codeSent) {
                      const phoneValue = form.getValues("phone");
                      if (!phoneValue) {
                        setError("Please enter a phone number");
                        return;
                      }
                      setPhone(phoneValue);
                      sendOtp(phoneValue);
                    } else {
                      if (!passkey) {
                        setError("Please enter the verification code");
                        return;
                      }
                      verifyOtp(passkey);
                    }
                  }}
                >
                  <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-4 pt-6">
                    <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
                      Welcome back!
                    </h2>
                    <p className="text-center text-base text-gray-600 dark:text-gray-300 md:text-lg">
                      We will send an OTP to verify your identity
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6 px-6 pb-8">
                    {!codeSent && (
                      <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone number"
                        placeholder="+213550123456"
                        iconSrc="/assets/icons/phone.svg"
                        iconAlt="phone"
                      />
                    )}

                    <SubmitButton
                      isLoading={isLoading}
                      className="w-full bg-emerald-600 py-3 text-lg transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                      {codeSent ? "Verify Code" : "Send Verification Code"}
                    </SubmitButton>

                    {codeSent && (
                      <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogContent className="rounded-lg border-0 shadow-xl dark:bg-gray-800">
                          <AlertDialogHeader>
                            <div className="flex items-center justify-between">
                              <AlertDialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                                Enter Verification Code
                              </AlertDialogTitle>
                              <Image
                                src="/assets/icons/close.svg"
                                alt="close"
                                width={24}
                                height={24}
                                onClick={closeModal}
                                className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
                              />
                            </div>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                              Sent to ******{phone.slice(-4)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <InputOTP
                                maxLength={6}
                                value={passkey}
                                onChange={(value) => setPasskey(value)}
                                className="gap-2"
                              >
                                <InputOTPGroup>
                                  {[...Array(6)].map((_, index) => (
                                    <InputOTPSlot
                                      key={index}
                                      index={index}
                                      className="size-12 rounded-lg border-2 border-gray-200 text-lg font-semibold transition-colors focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                  ))}
                                </InputOTPGroup>
                              </InputOTP>
                            </div>

                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                              Time remaining: {timeLeft}s
                            </div>

                            {error && (
                              <div className="text-center text-red-500 dark:text-red-400">
                                {error}
                              </div>
                            )}

                            <AlertDialogFooter className="sm:justify-center">
                              <AlertDialogAction
                                onClick={() => verifyOtp(passkey)}
                                className="w-full bg-emerald-600 transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                              >
                                Verify Code
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </CardContent>
                </form>
              </Card>

              {/* Test Accounts Mockup Data */}
              <div className="mx-auto w-full md:max-w-md space-y-4 pt-4 md:pt-0">
                <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">
                  Test Account
                </h2>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Use this credential to test the platform.
                </p>
                
                <div className="grid gap-4">
                  <Card className="p-4 border-l-4 border-l-emerald-500 shadow-sm dark:bg-gray-800">
                    <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Patient</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium text-gray-500 dark:text-gray-400">Phone:</span> +213550123456</p>
                      <p><span className="font-medium text-gray-500 dark:text-gray-400">OTP:</span> Any 6 digits</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Form>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Loading verification page...</p>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
