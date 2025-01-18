"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UserFormValidation } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { CustomFormField } from "@/components/forms/CustomFormField";

import { Card } from "@/components/ui/card";
import { Client, Account, ID } from "appwrite";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
}

export const Login = ({ user }: { user: User }) => {
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

  // Start countdown timer when OTP is sent
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (codeSent && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setOpen(false); // Close modal if time runs out
      setCodeSent(false); // Reset code sent state
      setTimeLeft(45); // Reset timer for next OTP request
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [codeSent, timeLeft]);

  const closeModal = () => {
    setOpen(false);
  };

  const deleteExistingSession = async () => {
    try {
      const sessions = await account.listSessions();
      if (sessions?.sessions?.length) {
        for (let session of sessions.sessions) {
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
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (verificationCode: string) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const session = await account.updatePhoneSession(
        userId,
        verificationCode
      );
      console.log("Session created successfully", session);
      setOpen(false); // Close modal on successful OTP verification
      router.push(`/dashboard/patients/${userId}/new-appointment`);
    } catch (error) {
      setError("Incorrect OTP. Please try again.");
      setOpen(true);
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: user.phone || " " },
  });

  return (
    <Form {...form}>
      <Card className="p-4 h-screen mx-4 my-2">
        <section className="my-10 space-y-4">
          <h1 className="header text-center">Welcome back! {user.name}</h1>
          <p className="text-center">
            We will send an OTP to verify your authentication.
          </p>
        </section>

        <form
          className="space-y-8"
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
          {!codeSent && (
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone number"
              placeholder="+14255550123"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
              disabled={codeSent}
            />
          )}

          {codeSent && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-start justify-between z-50">
                    Access verification
                    <Image
                      src="/assets/icons/close.svg"
                      alt="close"
                      width={20}
                      height={20}
                      onClick={closeModal}
                      className="cursor-pointer"
                    />
                  </AlertDialogTitle>
                  <AlertDialogDescription className="z-1000">
                    Enter OTP sent to your phone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="m-auto">
                  <InputOTP
                    maxLength={6}
                    value={passkey}
                    onChange={(value) => setPasskey(value)}
                  >
                    <InputOTPGroup className="shad-otp">
                      <InputOTPSlot className="shad-otp-slot m-1" index={0} />
                      <InputOTPSlot className="shad-otp-slot m-1" index={1} />
                      <InputOTPSlot className="shad-otp-slot m-1" index={2} />
                      <InputOTPSlot className="shad-otp-slot m-1" index={3} />
                      <InputOTPSlot className="shad-otp-slot m-1" index={4} />
                      <InputOTPSlot className="shad-otp-slot m-1" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <AlertDialogFooter className="m-auto">
                    Time remaining: {timeLeft}s
                  </AlertDialogFooter>
                  {error && (
                    <p className="shad-err text-14-regular mt-4 flex justify-center">
                      {error}
                    </p>
                  )}
                </div>

                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={() => verifyOtp(passkey)}
                    className="shadow-primary-btn w-full"
                  >
                    Enter OTP Passkey
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <SubmitButton isLoading={isLoading}>
            {codeSent ? "Verify Code" : "Send Verification Code"}
          </SubmitButton>
        </form>
      </Card>
    </Form>
  );
};

export default Login;
