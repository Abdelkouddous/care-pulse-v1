"use client";
import { useEffect, useRef } from "react";
import About from "@/components/About";
import PatientForm from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import CustomCard from "@/components/card/Card";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams?.admin === "true";
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
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
        threshold: 0.01,
      } // 50% visibility triggers the animation
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

  return (
    <div className="flex justify-center flex-col m-auto p-3 min-h-screen fade-in-page">
      {/* OTP Verification */}
      {isAdmin && <PasskeyModal />}

      <section
        ref={(el) => (sectionsRef.current[0] = el!)}
        className="remove-scrollbar container  animate-on-scroll"
      >
        <PatientForm />
      </section>

      <section
        ref={(el) => (sectionsRef.current[1] = el!)}
        className="remove-scrollbar container  animate-on-scroll"
      >
        <About />
      </section>

      <section
        ref={(el) => (sectionsRef.current[2] = el!)}
        className="remove-scrollbar container  animate-on-scroll"
      >
        <CustomCard></CustomCard>
      </section>
    </div>
  );
}
