"use client";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";
import { getAdmin } from "@/lib/actions/admin.actions";

export const PasskeyModal = async () =>
  // { params: { userId } }: SearchParamProps) =>
  // { $adminId }: Admin,

  {
    //{ $adminId }: Admin
    // const admin = await getAdmin(userId);
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");
    ///
    const encryptedKey =
      typeof window !== "undefined"
        ? window.localStorage.getItem("accessKey")
        : null;
    const path = usePathname();

    useEffect(() => {
      const accessKey = encryptedKey && decryptKey(encryptedKey);
      if (path) {
        if (
          accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY
          // && admin
        ) {
          setOpen(false);
          router.push(`/admin/login`);
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
        passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY
        // && admin
      ) {
        const encryptedKey = encryptKey(passkey);
        localStorage.setItem("accessKey", encryptedKey);
        router.push(`/admin/login`);
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
    // =============================================================================
    // if (isAdmin){

    // }
    // else{}
    return (
      <div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-start justify-between">
                Admin Access Verification
                <Image
                  src="/assets/icons/close.svg"
                  alt="close"
                  width={20}
                  height={20}
                  onClick={closeModal}
                  className="cursor-pointer"
                ></Image>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Enter the passkey to acess admin panel.
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
                Enter Admin Passkey
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

export default PasskeyModal;
