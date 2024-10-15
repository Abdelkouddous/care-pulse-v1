// "use client";
// import { useEffect, useRef } from "react";
// import About from "@/components/About";
// import PatientForm from "@/components/forms/PatientForm";
// import { PasskeyModal } from "@/components/PasskeyModal";
// import CustomCard from "@/components/card/Card";
// import Ressources from "@/components/Ressources";
// import DoctorsCard from "./doctors/doctorsCard";
// import { Contact } from "lucide-react";

// export default function Home({ searchParams }: SearchParamProps) {
//   const isAdmin = searchParams?.admin === "true";
//   const sectionsRef = useRef<HTMLDivElement[]>([]);
//   //================================================================
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("animate-on-scroll-visible");
//           } else {
//             entry.target.classList.remove("animate-on-scroll-visible");
//           }
//         });
//       },
//       {
//         threshold: 0.25,
//       } // 50% visibility triggers the animation
//     );

//     sectionsRef.current.forEach((section) => {
//       if (section) {
//         observer.observe(section);
//       }
//     });

//     return () => {
//       sectionsRef.current.forEach((section) => {
//         if (section) {
//           observer.unobserve(section);
//         }
//       });
//     };
//   }, []);

//   return (
//     <div className="flex justify-center flex-col m-auto p-3 min-h-screen fade-in-page">
//       {/* OTP Verification */}
//       {isAdmin && <PasskeyModal />}

//       <section
//         ref={(el) => (sectionsRef.current[0] = el!)}
//         className="remove-scrollbar container  animate-on-scroll"
//       >
//         <PatientForm />
//       </section>

//       <section
//         ref={(el) => (sectionsRef.current[1] = el!)}
//         className="remove-scrollbar container  animate-on-scroll"
//       >
//         <About />
//       </section>
//       <section
//         ref={(el) => (sectionsRef.current[2] = el!)}
//         className="remove-scrollbar container  animate-on-scroll"
//       >
//         <CustomCard></CustomCard>
//       </section>
//       <section
//         ref={(el) => (sectionsRef.current[3] = el!)}
//         className="remove-scrollbar container  animate-on-scroll"
//       >
//         <DoctorsCard />
//       </section>

//       <section
//         ref={(el) => (sectionsRef.current[4] = el!)}
//         className="remove-scrollbar container  animate-on-scroll"
//       >
//         <Ressources></Ressources>
//       </section>

//       <section
//         ref={(el) => (sectionsRef.current[5] = el!)}
//         className="remove-scrollbar container  animate-on-scroll"
//       >
//         <Contact id="contact"> Contact us</Contact>
//       </section>
//     </div>
//   );
// }
"use client";
import { useEffect, useRef, useState } from "react";
import About from "@/components/About";
import PatientForm from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import CustomCard from "@/components/card/Card";
import Ressources from "@/components/Ressources";
import DoctorsCard from "./doctors/doctorsCard";
import { Contact } from "lucide-react";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams?.admin === "true";
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
  }, []);

  return (
    <div className="flex justify-center flex-col m-auto p-3 min-h-screen fade-in-page">
      {/* Show offline notification */}
      {isOffline && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          Connection not set
        </div>
      )}

      {/* OTP Verification */}
      {isAdmin && <PasskeyModal />}

      <section
        ref={(el) => (sectionsRef.current[0] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <PatientForm />
      </section>

      <section
        ref={(el) => (sectionsRef.current[1] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <About />
      </section>
      <section
        ref={(el) => (sectionsRef.current[2] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <CustomCard />
      </section>
      <section
        ref={(el) => (sectionsRef.current[3] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <DoctorsCard />
      </section>

      <section
        ref={(el) => (sectionsRef.current[4] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <Ressources />
      </section>

      <section
        ref={(el) => (sectionsRef.current[5] = el!)}
        className="remove-scrollbar container animate-on-scroll"
      >
        <Contact id="contact">Contact us</Contact>
      </section>
    </div>
  );
}
