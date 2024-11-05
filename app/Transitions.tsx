"use client";
import { useEffect, useRef } from "react"; // Third-party imports

// Absolute imports
import About from "@/components/About";
import CustomCard from "@/components/card/Card";
import ContactAdmin from "@/components/ContactAdmin"; // Ensure this is above Ressources
import Ressources from "@/components/Ressources";

// Relative imports
import DoctorsCard from "./doctors/doctorsCard"; // This should be below absolute imports

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
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) {
            sectionsRef.current[0] = el;
          }
        }}
        className="remove-scrollbar container animate-on-scroll"
      >
        <About />
      </section>
      <section
        ref={(el: HTMLDivElement | null) => {
          el ? (sectionsRef.current[1] = el!) : null;
        }}
        className="remove-scrollbar container animate-on-scroll"
      >
        <CustomCard />
      </section>
      <section
        ref={(el: HTMLDivElement | null) => {
          sectionsRef.current[2] = el!;
        }}
        className="remove-scrollbar container animate-on-scroll"
      >
        <DoctorsCard />
      </section>
      <section
        ref={(el: HTMLDivElement | null) => {
          sectionsRef.current[3] = el!;
        }}
        className="remove-scrollbar container animate-on-scroll"
      >
        <Ressources />
      </section>
      <section
        ref={(el: HTMLDivElement | null) => {
          sectionsRef.current[4] = el!;
        }}
        className="remove-scrollbar container animate-on-scroll"
      >
        <ContactAdmin />
      </section>
    </>
  );
};

export default Transitions;
