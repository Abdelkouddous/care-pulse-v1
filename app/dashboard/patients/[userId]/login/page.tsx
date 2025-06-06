"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client, Account, ID } from "appwrite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import Loading from "@/app/loading";

// Create a separate component for the login functionality
const LoginComponent = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState("");
  const [passkey, setPasskey] = useState("");
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

  const account = new Account(client);
  const router = useRouter();

  // Check for existing token on component mount
  useEffect(() => {
    const existingToken = TokenManager.getToken();
    if (existingToken) {
      // User is already logged in, redirect to dashboard
      router.push(`/dashboard/patients/${existingToken}/new-appointment`);
    }
  }, [router]);

  // Start countdown timer when OTP is sent
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (codeSent && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setOpen(false); // Close modal if time runs out
      setCodeSent(false); // Reset code sent state
      setTimeLeft(45); // Reset timer for next OTP request
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

  // Get phone number from URL and auto-trigger OTP
  useEffect(() => {
    // Get phone number from URL
    const params = new URLSearchParams(window.location.search);
    const phoneFromURL = params.get("phone");

    if (phoneFromURL) {
      // Set the phone number in the form
      form.setValue("phone", phoneFromURL);
      setPhone(phoneFromURL);

      // Automatically trigger OTP send
      sendOtp(phoneFromURL);
    }
  }, []);

  const closeModal = () => {
    setOpen(false);
  };

  const deleteExistingSession = async () => {
    try {
      const sessions = await account.listSessions();
      if (sessions?.sessions?.length) {
        for (const session of sessions.sessions) {
          await account.deleteSession(session.$id);
        }
        console.log("Existing sessions deleted");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const sendOtp = async (phone: string) => {
    try {
      setIsLoading(true);
      await deleteExistingSession();
      const token = await account.createPhoneToken(ID.unique(), phone);
      setUserId(token.userId);
      setCodeSent(true);
      setOpen(true);
      setTimeLeft(45); // Reset countdown timer

      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the OTP",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const verifyOtp = async (verificationCode: string) => {
  //   if (!userId) return;
  //   try {
  //     setIsLoading(true);
  //     const session = await account.updatePhoneSession(
  //       userId,
  //       verificationCode
  //     );
  //     console.log("Session created successfully", session);

  //     // Store the token with 24-hour expiration
  //     TokenManager.setToken(userId);

  //     setOpen(false); // Close modal on successful OTP verification
  //     toast({
  //       title: "Login Successful",
  //       description: "You have been successfully logged in.",
  //     });
  //     router.push(`/dashboard/patients/${userId}/new-appointment`);
  //   } catch (error) {
  //     setError("Incorrect OTP. Please try again.");
  //     setOpen(true);
  //     console.error("Error verifying OTP:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // In the LoginComponent, add this to the verifyOtp function:

  const verifyOtp = async (verificationCode: string) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const session = await account.updatePhoneSession(
        userId,
        verificationCode
      );
      console.log("Session created successfully", session);

      // Store the token with 24-hour expiration
      TokenManager.setToken(userId);

      setOpen(false); // Close modal on successful OTP verification
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
      });

      // Check if there's a redirect URL in the query parameters
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect");

      if (redirectUrl) {
        // Redirect to the original requested URL
        router.push(redirectUrl);
      } else {
        // Default redirect to new appointment
        router.push(`/dashboard/patients/${userId}/new-appointment`);
      }
    } catch (error) {
      setError("Incorrect OTP. Please try again.");
      setOpen(true);
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the form initialization to use the phone from URL
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      phone: user?.phone || "",
    },
  });

  // Add loading state UI
  if (isLoading) {
    return <Loading />;
  }

  // Add error state UI
  if (error && !open) {
    // Show global errors that aren't OTP related
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError("")}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <section className="mt-16 md:mt-16">
        <div className="py-3">
          <Card className="my-4 overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:my-2">
            <h1 className="px-6 pb-4 pt-8 text-center font-serif text-5xl font-bold tracking-tight text-gray-800 fade-in dark:text-white">
              Secure Verification
            </h1>

            <p className="mx-auto mb-8 max-w-2xl px-4 text-center text-lg text-gray-600 dark:text-gray-300">
              Protect your account with two-factor authentication
            </p>

            <div className="mx-auto my-2 flex max-w-6xl justify-between px-4 fade-in md:px-8">
              <Card className="mx-auto w-full overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:max-w-md">
                <form
                  className="space-y-8 p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!codeSent) {
                      const phoneValue = form.getValues("phone");
                      setPhone(phoneValue);
                      sendOtp(phoneValue);
                    } else {
                      verifyOtp(passkey);
                    }
                  }}
                >
                  <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-4 pt-6">
                    <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
                      Welcome back, {user?.name}!
                    </h2>
                    <p className="text-center text-base text-gray-600 dark:text-gray-300 md:text-lg">
                      We will send an OTP to verify your identity
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6 px-6 pb-8">
                    {!codeSent && !phone && (
                      <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone number"
                        placeholder="+213550123456"
                        iconSrc="/assets/icons/phone.svg"
                        iconAlt="phone"
                        disabled={codeSent}
                      />
                    )}

                    {!codeSent && phone && (
                      <div className="text-center text-gray-600 dark:text-gray-300">
                        Sending verification code to: {phone}
                      </div>
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
            </div>
          </Card>
        </div>
      </section>
    </Form>
  );
};

// This is the actual page component that Next.js will use
export default function LoginPage({ params }: { params: { userId: string } }) {
  // Fetch user data based on userId
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Replace this with your actual user fetching logic
        // For example: const userData = await getUserById(params.userId);
        const userData = { $id: params.userId, name: "User", phone: "" };
        setUser(userData as User);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.userId]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return <div className="text-center">User not found</div>;

  return <LoginComponent user={user} />;
}
