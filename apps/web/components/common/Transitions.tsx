"use client";

import React, { useEffect, useRef } from "react";
import About from "@/components/About";
import Services from "@/components/Ressources";
import Plans from "@/components/payment/Plans";
import ContactAdmin from "@/components/ContactAdmin";
import { ForDoctorsSection } from "@/components/landing/ForDoctorsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Testimonials } from "@/components/testimonials/Testimonials";

interface TransitionsProps {
  onSelectSpecialty?: (specialty: string) => void;
}

/**
 * Layout Orchestrator: Transition & Rhythm Engine
 * Controls inter-section vertical rhythm strictly through calibrated CSS Gap tokens.
 */
export const Transitions: React.FC<TransitionsProps> = ({ onSelectSpecialty }) => {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentSections = [...sectionsRef.current];
    currentSections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const assignRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionsRef.current[index] = el;
  };

  // Testimonials is kept ready but hidden until real testimonials exist
  const showTestimonials = process.env.NEXT_PUBLIC_SHOW_TESTIMONIALS === "true";

  const sectionComponents = [
    { component: <Services onSelectSpecialty={onSelectSpecialty} />, key: "services" },
    { component: <Plans />, key: "plans" },
    { component: <ForDoctorsSection />, key: "for-doctors" },
    { component: <About />, key: "about" },
    ...(showTestimonials ? [{ component: <Testimonials />, key: "testimonials" }] : []),
    { component: <FaqSection />, key: "faq" },
    { component: <ContactAdmin />, key: "contact" },
  ];

  return (
    <div className="relative z-0 flex flex-col gap-y-16 md:gap-y-24 py-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      {sectionComponents.map(({ component, key }, index) => (
        <div
          key={key}
          ref={assignRef(index)}
          className="w-full opacity-0 transition-all duration-700 ease-out transform translate-y-6"
        >
          {component}
        </div>
      ))}
    </div>
  );
};

export default Transitions;
