"use client";
import { useEffect, useRef, useState } from "react";
import About from "@/components/About";
import PatientForm from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import { PasskeyDoctorModal } from "@/components/PassKeyDoctorModal";
import CustomCard from "@/components/card/Card";
import Ressources from "@/components/Ressources";
import DoctorsCard from "./doctors/doctorsCard";
import { Contact } from "lucide-react";
import ContactAdmin from "@/components/ContactAdmin";
// import { getPatient } from "@/lib/actions/patient.actions";
// import { redirect } from "next/navigation";

export const Transitions = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
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
        threshold: 0.5,
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
  return (
    <>
      {" "}
      <section
        ref={(el) => (sectionsRef.current[0] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <About />
      </section>
      <section
        ref={(el) => (sectionsRef.current[1] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <CustomCard />
      </section>
      <section
        ref={(el) => (sectionsRef.current[2] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <DoctorsCard />
      </section>
      <section
        ref={(el) => (sectionsRef.current[3] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <Ressources />
      </section>
      <section
        ref={(el) => (sectionsRef.current[4] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <ContactAdmin></ContactAdmin>
      </section>
    </>
  );
};

export default Transitions;