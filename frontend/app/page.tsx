"use client";

import { useEffect, useState } from "react";

import PatientForm from "@/components/forms/PatientForm";
import { PasskeyDoctorModal } from "@/components/PassKeyDoctorModal";
import { PasskeyModal } from "@/components/PasskeyModal";
import { SiteHeader } from "@/components/site-header";
import Transitions from "./Transitions";

interface SearchParamProps {
  searchParams: { admin?: string; doctor?: string; user?: string };
}

export default function Home({ searchParams }: SearchParamProps) {
  // Modal pop triggers based on portal entry actions
  const isAdmin = searchParams?.admin === "true";
  const isDoctor = searchParams?.doctor === "true";

  const [isOffline, setIsOffline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Network offline state listener
  useEffect(() => {
    setIsMounted(true);
    setIsOffline(!window.navigator.onLine);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50/60 dark:bg-[#0b1320] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sticky Global Navigation */}
      <header className="sticky top-0 z-40 w-full">
        <SiteHeader />
      </header>

      {/* Network Offline Alert Banner */}
      {isMounted && isOffline && (
        <div className="sticky top-16 z-50 mx-auto mt-2 max-w-md rounded-xl bg-amber-500/90 px-4 py-2 text-center text-xs font-semibold text-white shadow-lg backdrop-blur-md">
          Offline Mode: Active network connection required for live booking.
        </div>
      )}

      {/* Role-Based Passkey Verification Modals */}
      {isDoctor && <PasskeyDoctorModal />}
      {isAdmin && <PasskeyModal />}

      {/* Main Landing Page Content Flow */}
      <main className="w-full flex-1 flex flex-col items-center pt-4 pb-16 px-3 sm:px-6">
        <PatientForm />
        <Transitions />
      </main>
    </div>
  );
}
