"use client";

import { useEffect, useState } from "react";

import { HeroSection } from "@/components/landing/HeroSection";
import { PhoneBookingSection } from "@/components/landing/PhoneBookingSection";
import { TrustedBySection } from "@/components/landing/TrustedBySection";
import { TrendingDoctorsSection } from "@/components/landing/TrendingDoctorsSection";
import { PasskeyDoctorModal } from "@/components/PassKeyDoctorModal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Transitions from "@/components/common/Transitions";

interface SearchParamProps {
  searchParams: { doctor?: string; user?: string };
}

export default function Home({ searchParams }: SearchParamProps) {
  // Modal pop triggers based on portal entry actions
  const isDoctor = searchParams?.doctor === "true";

  const [isOffline, setIsOffline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchFilters, setSearchFilters] = useState<{
    specialty: string;
    wilaya: string;
    date: string;
    visitType: string;
  }>({
    specialty: "All",
    wilaya: "16",
    date: "",
    visitType: "clinic",
  });

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

      {/* Main Landing Page Content Flow */}
      <main className="w-full flex-1 flex flex-col items-center">
        {/* 1. Full Screen Hero Section (View Demo & Book Appointment CTAs) */}
        <HeroSection />

        {/* 2. Full Screen Phone Booking & Search Section (Unified Width max-w-4xl) */}
        <PhoneBookingSection
          onSearchChange={(filters) => setSearchFilters(filters)}
        />

        {/* 3. Trusted By Section (Framer Motion Continuous Marquee of Algerian Private Hospitals) */}
        <TrustedBySection />

        {/* 4. Unified Autoplayed Trending Doctors & Specialists Section */}
        <TrendingDoctorsSection
          filterSpecialty={searchFilters.specialty}
          filterWilaya={searchFilters.wilaya}
        />

        {/* 5. Section Rhythm & Feature Components (About, Metrics, Autoplay Services, Z-form Testimonials, etc.) */}
        <Transitions />
      </main>

      {/* Professional Site Footer */}
      <SiteFooter />
    </div>
  );
}
