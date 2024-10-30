"use client";

import { useState } from "react";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation"; // Import useRouter

export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
}

export const Login = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Store the user ID
  const [phone, setPhone] = useState<string>("");

  const client = new Client()
    // .setEndpoint("https://cloud.appwrite.io/v1")
    // .setProject("66b93571003a73b1ade3");
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

  const account = new Account(client);

  const [error, setError] = useState("");
  const [passkey, setPasskey] = useState("");
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };
  const router = useRouter();
  //func to delete existing session
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
  //  Function to send OTP Function to send OTP Function to send OTP  Function to send OTP
  const sendOtp = async (phone: string) => {
    try {
      setIsLoading(true);
      //delete all existing sessions so it can reuse the new OTP verification
      await deleteExistingSession();
      const token = await account.createPhoneToken(ID.unique(), phone);
      setUserId(token.userId); // Save the userId for later verification
      setCodeSent(true);
      setOpen(true); // Open the modal for OTP input
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify OTP Function to verify OTP Function to verify OTP
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
      // redirect(`/patients/${userId}/new-appointment`);
      router.push(`/patients/${userId}/new-appointment`);
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", error);
      setCodeSent(true);
    } finally {
      setIsLoading(false);
      setCodeSent(false);
    }
  };

  // Form setup
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: { phone: user.phone || " " },
  });

  return (
    <Form {...form}>
      <Card className="p-4 h-screen mx-4 my-2">
        <section className="my-10 space-y-4">
          <h1 className="header text-center">Welcome back! {user.name}</h1>
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
              sendOtp(phoneValue);
            } else {
              verifyOtp(passkey);

              // Use passkey (from OTP input) to verify OTP
            }
          }}
        >
          {/* Phone number field */}
          {!codeSent && (
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
          )}

          {/* OTP Modal */}
          {codeSent && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent className="shad-alert-dialog ">
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
                    Enter OTP sent to your phone
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="m-auto ">
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
                  {error && (
                    <p className="shad-err text-14-regular mt-4 flex justify-center">
                      {error}
                    </p>
                  )}
                </div>

                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={() => {
                      verifyOtp(passkey);
                    }}
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
