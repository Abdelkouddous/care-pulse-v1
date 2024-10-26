import React, { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";
import "@/app/globals.css";

export const PasskeyDoctorModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;
  const path = usePathname();

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (
        accessKey === process.env.NEXT_PUBLIC_DOCTOR_PASSKEY
        // && admin
      ) {
        setOpen(false);
        // router.push(`/doctors/${doctorId}/my-patients`);
        router.push(`doctors/login`);
      } else {
        setOpen(true);
        setError("Invalid passkey. Please try again.");
        // router.push("/");
      }
    }
  }, [encryptedKey]);

  // validate passkey for the first time====
  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      passkey === process.env.NEXT_PUBLIC_DOCTOR_PASSKEY
      // && admin
    ) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);
      router.push(`/doctors/login`);
    } else {
      setError("Invalid Key. Please try again in 30 seconds");
      setTimeout(() => {
        setOpen(false);
        router.push("/");
      }, 30000);
    }
  };
  const closeModal = () => {
    router.push("/");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog ">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between z-50">
            Doctor Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={closeModal}
              className="cursor-pointer"
            ></Image>
          </AlertDialogTitle>
          <AlertDialogDescription className="z-1000">
            Enter the passkey to acess doctor panel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="m-auto ">
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp ">
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
            onClick={(e) => validatePasskey(e)}
            className="shadow-primary-btn w-full"
          >
            Enter Doctor Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyDoctorModal;
