"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { decryptKey, encryptKey } from "@/lib/utils";
import { DICTIONARY_EN } from "@/constants/locales/en";

export const PasskeyModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const modalContentRef = useRef<HTMLDivElement>(null);

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;
  const path = usePathname();

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push(`/admin/login`);
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey, path, router]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const newEncryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", newEncryptedKey);
      router.push(`/admin/login`);
    } else {
      setError(DICTIONARY_EN.modals.admin.error);
    }
  };

  // Close modal when clicking outside the dialog content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      closeModal();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-white">
              {DICTIONARY_EN.modals.admin.title}
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={18}
              height={18}
              className="invert brightness-0"
            />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          {DICTIONARY_EN.modals.admin.description}
        </p>

        <div className="my-6 flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot className="size-11 rounded-lg border border-slate-700 bg-slate-800/80 text-lg font-bold text-white focus:border-slate-400" index={0} />
              <InputOTPSlot className="size-11 rounded-lg border border-slate-700 bg-slate-800/80 text-lg font-bold text-white focus:border-slate-400" index={1} />
              <InputOTPSlot className="size-11 rounded-lg border border-slate-700 bg-slate-800/80 text-lg font-bold text-white focus:border-slate-400" index={2} />
              <InputOTPSlot className="size-11 rounded-lg border border-slate-700 bg-slate-800/80 text-lg font-bold text-white focus:border-slate-400" index={3} />
              <InputOTPSlot className="size-11 rounded-lg border border-slate-700 bg-slate-800/80 text-lg font-bold text-white focus:border-slate-400" index={4} />
              <InputOTPSlot className="size-11 rounded-lg border border-slate-700 bg-slate-800/80 text-lg font-bold text-white focus:border-slate-400" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="mt-4 text-xs font-medium text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            roleVariant="admin"
            size="lg"
            onClick={validatePasskey}
            className="w-full bg-slate-800 hover:bg-slate-700"
          >
            {DICTIONARY_EN.modals.admin.action}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasskeyModal;
