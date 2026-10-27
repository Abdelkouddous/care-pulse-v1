"use client";

import { useEffect, useState } from "react";

import { HeroSection } from "@/components/landing/HeroSection";
import { PhoneBookingSection } from "@/components/landing/PhoneBookingSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ClinicGeolocationSection } from "@/components/landing/ClinicGeolocationSection";
import { TrustedBySection } from "@/components/landing/TrustedBySection";
import { TrendingDoctorsSection } from "@/components/landing/TrendingDoctorsSection";
import { PasskeyDoctorModal } from "@/components/PassKeyDoctorModal";
import { PatientFastTrackAuthModal } from "@/components/auth/PatientFastTrackAuthModal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Transitions from "@/components/common/Transitions";
import { BrandSplashLoader } from "@/components/common/BrandSplashLoader";

interface SearchParamProps {
  searchParams: { doctor?: string; user?: string };
}

export default function Home({ searchParams }: SearchParamProps) {
  // Modal triggers based on search params
  const isDoctor = searchParams?.doctor === "true";

  const [isOffline, setIsOffline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  const handleSpecialtySelect = (specialty: string) => {
    setSearchFilters((prev) => ({ ...prev, specialty }));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50/60 dark:bg-[#0b1320] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Full-Screen Branded Splash Loader */}
      <BrandSplashLoader minDisplayTimeMs={700} />

      {/* Sticky Global Navigation with Scroll-Spy & RTL-Safe Spacing */}
      <header className="sticky top-0 z-40 w-full">
        <SiteHeader />
      </header>

      {/* Network Offline Alert Banner */}
      {isMounted && isOffline && (
        <div className="sticky top-16 z-50 mx-auto mt-2 max-w-md rounded-xl bg-amber-500/90 px-4 py-2 text-center text-xs font-semibold text-white shadow-lg backdrop-blur-md">
          Offline Mode: Active network connection required for live booking.
        </div>
      )}

      {/* Role-Based Passkey Modals */}
      {isDoctor && <PasskeyDoctorModal />}

      {/* Fast-Track Phone & 6-Digit OTP Auth Dialog */}
      <PatientFastTrackAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo="/patient/dashboard"
      />

      {/* Main Landing Page Content Flow */}
      <main className="w-full flex-1 flex flex-col items-center">
        {/* 1. Hero Section with Integrated Search & Unified Trust Strip */}
        <HeroSection
          onSearchChange={(filters) => setSearchFilters(filters)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* 2. Fast-Track Phone Number Booking Section (Algerian Mobile & Instant Confirmation) */}
        <PhoneBookingSection
          searchFilters={searchFilters}
        />

        {/* 3. How It Works (3 Steps: Search -> Slot -> WhatsApp Confirmation) */}
        <HowItWorksSection />

        {/* 3. Partner Clinics & Lazy-Loaded Google Map (Pilot: Alger & Tébessa) */}
        <ClinicGeolocationSection />

        {/* 4. Trending Doctors & Specialists (Initials Fallback, DZD Fee, Book CTA) */}
        <TrendingDoctorsSection
          filterSpecialty={searchFilters.specialty}
          filterWilaya={searchFilters.wilaya}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* 5. Gated Hospital Partners Section */}
        <TrustedBySection />

        {/* 6. Lower Rhythm Sections (Services, Plans, ForDoctors, About, FAQ, Contact) */}
        <Transitions onSelectSpecialty={handleSpecialtySelect} />
      </main>

      {/* Professional Site Footer with Compact Newsletter & Loi 18-07 Legal Badges */}
      <SiteFooter />
    </div>
  );
}
