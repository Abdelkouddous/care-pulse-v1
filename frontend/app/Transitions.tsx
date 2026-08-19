"use client";

import React, { useEffect, useRef } from "react";
import About from "@/components/About";
import CustomCard from "@/components/card/Card";
import ContactAdmin from "@/components/ContactAdmin";
import NewsLetter from "@/components/newsletter/NewsLetter";
import Plans from "@/components/payment/Plans";
import Services from "@/components/Ressources";
import { Testimonials } from "@/components/testimonials/Testimonials";
import DoctorsCard from "./doctors/doctorsCard";

/**
 * Layout Orchestrator: Transition & Rhythm Engine
 * Controls inter-section vertical rhythm strictly through calibrated CSS Gap tokens.
 */
export const Transitions = () => {
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
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
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

  const sectionComponents = [
    { component: <About />, key: "about" },
    { component: <CustomCard />, key: "metrics" },
    { component: <DoctorsCard />, key: "doctors" },
    { component: <Services />, key: "services" },
    { component: <Testimonials />, key: "testimonials" },
    { component: <Plans />, key: "plans" },
    { component: <NewsLetter />, key: "newsletter" },
    { component: <ContactAdmin />, key: "contact" },
  ];

  return (
    <div className="relative z-0 flex flex-col gap-y-20 md:gap-y-28 py-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
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
