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
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 relative">
        {/* Back Button */}
        <div className="absolute left-4 top-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Image
              src="/assets/icons/arrow-left.svg"
              alt="Back"
              width={18}
              height={18}
            />
            <span>Back</span>
          </button>
        </div>

        <div className="w-full max-w-4xl mx-auto pt-6">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              Patient Authentication
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Secure Verification
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Protect your account with two-factor authentication
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
            <Card className="w-full md:max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md">
              <form
                className="space-y-6 p-4 sm:p-6"
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
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Welcome Back
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We will send an OTP to verify your identity
                  </p>
                </div>

                <CardContent className="space-y-6 p-0">
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
                    className="w-full bg-emerald-600 py-3 text-lg transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 font-bold"
                  >
                    {codeSent ? "Verify Code" : "Send Verification Code"}
                  </SubmitButton>

                  {codeSent && (
                    <AlertDialog open={open} onOpenChange={setOpen}>
                      <AlertDialogContent className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                        <AlertDialogHeader>
                          <div className="flex items-center justify-between">
                            <AlertDialogTitle className="text-lg font-bold text-white">
                              Enter Verification Code
                            </AlertDialogTitle>
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close"
                              width={20}
                              height={20}
                              onClick={closeModal}
                              className="cursor-pointer invert brightness-0 opacity-70 hover:opacity-100"
                            />
                          </div>
                          <AlertDialogDescription className="text-slate-400 text-xs">
                            Sent to ******{phone.slice(-4)}
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="space-y-4 pt-2">
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
                                    className="size-11 rounded-lg border border-slate-700 bg-slate-800/80 text-lg font-bold text-white focus:border-emerald-400"
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>

                          <div className="text-center text-xs text-slate-400">
                            Time remaining: {timeLeft}s
                          </div>

                          {error && (
                            <div className="text-center text-xs font-medium text-red-400">
                              {error}
                            </div>
                          )}

                          <AlertDialogFooter className="sm:justify-center pt-2">
                            <AlertDialogAction
                              onClick={() => verifyOtp(passkey)}
                              className="w-full bg-emerald-600 transition-all duration-300 hover:bg-emerald-500 font-bold text-white"
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

            {/* Test Account Credentials Box */}
            <div className="w-full md:max-w-xs flex flex-col justify-center">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🧪</span>
                  <h3 className="font-bold text-sm text-emerald-400">
                    Test Patient Account
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Use this mock credential to verify without registration:
                </p>
                <div className="space-y-2 rounded-xl bg-slate-900/80 p-3 text-xs border border-emerald-800/30 font-mono">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-emerald-300 font-bold">+213550123456</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">OTP:</span>
                    <span className="text-emerald-300 font-bold">Any 6 digits</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("phone", "+213550123456");
                  }}
                  className="mt-3 w-full rounded-xl bg-emerald-600/20 border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all duration-200 text-center"
                >
                  Auto-fill Phone Number
                </button>
              </div>
            </div>
          </div>
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
