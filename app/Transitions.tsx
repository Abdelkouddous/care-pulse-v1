"use client";
import { useEffect, useRef } from "react"; // Third-party imports

// Absolute imports
import About from "@/components/About";
import CustomCard from "@/components/card/Card";
import ContactAdmin from "@/components/ContactAdmin"; // Ensure this is above Services
import NewsLetter from "@/components/newsletter/NewsLetter";
import Plans from "@/components/payment/Plans";
import Services from "@/components/Ressources";

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
        threshold: 0.3, // Trigger the animation when 10% of the section is visible
        rootMargin: "0px 0px -50px 0px", // Adjust the root margin to trigger the animation earlier
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
        ref={(el: HTMLDivElement) => {
          sectionsRef.current[1] = el!;
        }}
        className="remove-scrollbar animate-on-scroll container"
      >
        <About />
      </section>
      <section
        ref={(el: HTMLDivElement) => {
          sectionsRef.current[2] = el!;
        }}
        className="remove-scrollbar animate-on-scroll container"
      >
        <CustomCard />
      </section>
      <section
        ref={(el: HTMLDivElement) => {
          sectionsRef.current[3] = el!;
        }}
        className="remove-scrollbar animate-on-scroll container"
      >
        <DoctorsCard />
      </section>
      <section
        ref={(el: HTMLDivElement) => {
          sectionsRef.current[4] = el!;
        }}
        className="remove-scrollbar animate-on-scroll container"
      >
        <Services />
      </section>
      <section
        ref={(el: HTMLDivElement | null) => {
          sectionsRef.current[5] = el!;
        }}
        className="remove-scrollbar animate-on-scroll-bot container"
      >
        <Plans></Plans>
      </section>
      <section
        ref={(el: HTMLDivElement | null) => {
          sectionsRef.current[6] = el!;
        }}
        className="remove-scrollbar animate-on-scroll-bot container"
      >
        <NewsLetter />
      </section>
      <section
        ref={(el: HTMLDivElement | null) => {
          sectionsRef.current[7] = el!;
        }}
        className="remove-scrollbar animate-on-scroll-bot container"
      >
        <ContactAdmin />
      </section>
    </>
  );
};

export default Transitions;
