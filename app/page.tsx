"use client";
import { useEffect, useRef, useState } from "react";
import { PasskeyModal } from "@/components/PasskeyModal";
import { PasskeyDoctorModal } from "@/components/PassKeyDoctorModal";
import { SiteHeader } from "@/components/site-header";
import Transitions from "./Transitions";
import PatientForm from "@/components/forms/PatientForm";

export default async function Home(
  // { params: { userId } }: SearchParamProps,
  { searchParams }: SearchParamProps
) {
  //logic when we click admin or doctor
  const isAdmin = searchParams?.admin === "true";
  const isDoctor = searchParams?.doctor === "true";

  //  searchParams?.user === 'true'
  // const patient = await getPatient(userId);
  //
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
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
      {
        threshold: 0.25,
      }
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

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  });

  // Get patient data on component mount
  // const patient = await getPatient(userId);
  // if (patient) {
  //   redirect(`/patients/${userId}/new-appointment`);
  // }

  return (
    <div className="flex justify-center flex-col m-auto p-3 min-h-screen">
      <div className=" sticky top-0 z-50 w-screen">
        <SiteHeader />
      </div>
      {/* Show offline notification */}
      {isOffline && (
        <div className="bg-red-500 sticky text-white p-4 mb-4 rounded-md">
          Connection not set
        </div>
      )}
      {/* OTP Verification */}
      {isDoctor && <PasskeyDoctorModal />}
      {isAdmin && <PasskeyModal />}
      {/* Patient form */}
      <PatientForm /> <Transitions />{" "}
    </div>
  );
}
