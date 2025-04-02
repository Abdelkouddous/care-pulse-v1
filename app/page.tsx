"use client";

import { useEffect, useRef, useState } from "react";

import PatientForm from "@/components/forms/PatientForm";
import { PasskeyDoctorModal } from "@/components/PassKeyDoctorModal";
import { PasskeyModal } from "@/components/PasskeyModal";
import { SiteHeader } from "@/components/site-header";

import Transitions from "./Transitions";

// Add the missing type definition
interface SearchParamProps {
  searchParams: { admin?: string; doctor?: string; user?: string };
}

export default function Home({ searchParams }: SearchParamProps) {
  // logic when we click admin or doctor
  const isAdmin = searchParams?.admin === "true";
  const isDoctor = searchParams?.doctor === "true";

  const sectionsRef = useRef<HTMLDivElement[]>([]);

  // Initialize isOffline state but don't render it immediately
  const [isOffline, setIsOffline] = useState(false);

  // Add a state to track if we're in the browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);

    // Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-on-scroll-visible");
          } else {
            entry.target.classList.remove("animate-on-scroll-visible");
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  // Network status listener
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    // Set initial offline status
    setIsOffline(!window.navigator.onLine);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="m-auto flex min-h-screen flex-col justify-center p-3">
      <div className="sticky top-0 z-50 w-screen">
        <SiteHeader />
      </div>
      {/* Show offline notification only after component is mounted */}
      {isMounted && isOffline && (
        <div className="sticky mb-4 rounded-md bg-red-500 p-4 text-white">
          Connection not set
        </div>
      )}
      {/* OTP Verification */}
      {isDoctor && <PasskeyDoctorModal />}
      {isAdmin && <PasskeyModal />}
      {/* Patient form */}
      <PatientForm />
      <Transitions />
    </div>
  );
}
