"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface HospitalLogoProps {
  name: string;
  subtitle: string;
  logo: React.ReactNode;
}

export function TrustedBySection() {
  const hospitals: HospitalLogoProps[] = [
    {
      name: "AL AZHAR",
      subtitle: "Groupe Al Azhar Santé • Alger",
      logo: (
        <div className="flex flex-col items-center justify-center">
          <svg className="w-24 h-10" viewBox="0 0 120 50" fill="none">
            {/* Yellow Arc */}
            <path
              d="M 10 40 Q 40 5, 80 40"
              stroke="#EAB308"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Red Curve */}
            <path
              d="M 5 44 Q 50 36, 115 44"
              stroke="#DC2626"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Blue Vertical Bars */}
            <line x1="26" y1="12" x2="26" y2="40" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="33" y1="12" x2="33" y2="40" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="text-center -mt-1">
            <span className="font-extrabold text-sm tracking-wider text-slate-800 dark:text-slate-100 block">
              AL AZHAR
            </span>
            <span className="text-[8px] font-semibold tracking-tighter text-sky-600 dark:text-sky-400 uppercase block">
              Groupe Al Azhar Santé
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "CLINIQUE CHIFA",
      subtitle: "Centre Médico-Chirurgical • Hydra",
      logo: (
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-lg shadow-xs">
            +
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-slate-100 block">
              CLINIQUE CHIFA
            </span>
            <span className="text-[9px] font-medium text-slate-400 uppercase block">
              Hydra • Alger
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "DIAR ES SAADA",
      subtitle: "Chirurgie Cardiaque • Alger",
      logo: (
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-base shadow-xs">
            DS
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-slate-100 block">
              DIAR ES SAADA
            </span>
            <span className="text-[9px] font-medium text-slate-400 uppercase block">
              Clinique Chirurgicale
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "CLINIQUE EL BORDJ",
      subtitle: "Pôle Médical Pluridisciplinaire",
      logo: (
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 font-extrabold text-sm shadow-xs">
            EB
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-slate-100 block">
              EL BORDJ SANTÉ
            </span>
            <span className="text-[9px] font-medium text-slate-400 uppercase block">
              Bordj El Kiffan
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "IBN ROCHD",
      subtitle: "Hôpital Privé • Annaba",
      logo: (
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shadow-xs">
            IR
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-slate-100 block">
              HÔPITAL IBN ROCHD
            </span>
            <span className="text-[9px] font-medium text-slate-400 uppercase block">
              Pôle Privé • Annaba
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "CLINIQUE PASTEUR",
      subtitle: "Centre Médical & Diagnostic • Oran",
      logo: (
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm shadow-xs">
            CP
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-slate-100 block">
              CLINIQUE PASTEUR
            </span>
            <span className="text-[9px] font-medium text-slate-400 uppercase block">
              Oran
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "LES OLIVIERS",
      subtitle: "Clinique Chirurgicale • Sétif",
      logo: (
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-sm shadow-xs">
            LO
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-slate-100 block">
              LES OLIVIERS
            </span>
            <span className="text-[9px] font-medium text-slate-400 uppercase block">
              Clinique &amp; Maternité • Sétif
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Duplicate for seamless 50% translation infinite loop
  const duplicatedHospitals = [...hospitals, ...hospitals];

  return (
    <section id="trusted-by" className="w-full py-12 border-y border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>Trusted by Leading Algerian Clinics &amp; Private Healthcare Groups</span>
        </p>
      </div>

      {/* Infinite Horizontal Marquee with Framer Motion */}
      <div className="relative w-full overflow-hidden mask-gradient-x">
        {/* Left & Right Gradient Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-slate-50/90 dark:from-[#0b1320] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-slate-50/90 dark:from-[#0b1320] to-transparent pointer-events-none" />

        <motion.div
          className="flex items-center gap-12 sm:gap-16 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 28,
            repeat: Infinity,
          }}
        >
          {duplicatedHospitals.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center justify-center w-[220px] h-[88px] px-5 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-800 transition-all shrink-0 grayscale hover:grayscale-0 opacity-80 hover:opacity-100"
            >
              {item.logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustedBySection;
