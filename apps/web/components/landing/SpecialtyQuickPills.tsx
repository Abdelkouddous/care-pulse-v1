"use client";

import React from "react";

export interface SpecialtyItem {
  id: string;
  labelEn: string;
  labelFr: string;
  labelAr: string;
  iconName?: string;
  isPopular?: boolean;
}

export interface SpecialtyQuickPillsProps {
  specialties: SpecialtyItem[];
  activeSpecialtyId: string;
  onSelectSpecialty: (specialtyId: string) => void;
  locale?: "fr" | "ar" | "en";
  className?: string;
}

export const POPULAR_SPECIALTIES: SpecialtyItem[] = [
  { id: "All", labelEn: "All", labelFr: "Tous", labelAr: "الكل" },
  { id: "Cardiology", labelEn: "Cardiology", labelFr: "Cardiologie", labelAr: "أمراض القلب" },
  { id: "Pediatrics", labelEn: "Pediatrics", labelFr: "Pédiatrie", labelAr: "طب الأطفال" },
  { id: "Dermatology", labelEn: "Dermatology", labelFr: "Dermatologie", labelAr: "أمراض جلدية" },
  { id: "General Medicine", labelEn: "General Medicine", labelFr: "Médecine Générale", labelAr: "طب عام" },
  { id: "Neurology", labelEn: "Neurology", labelFr: "Neurologie", labelAr: "مخ وأعصاب" },
  { id: "Orthopedics", labelEn: "Orthopedics", labelFr: "Orthopédie", labelAr: "عظام ومفاصل" },
];

/**
 * SpecialtyQuickPills
 *
 * Beesiha-grade horizontal scrollable pill selector.
 * Provides 1-tap filtering across specialties without opening dropdowns.
 */
export function SpecialtyQuickPills({
  specialties = POPULAR_SPECIALTIES,
  activeSpecialtyId,
  onSelectSpecialty,
  locale = "fr",
  className = "",
}: SpecialtyQuickPillsProps): React.JSX.Element {
  return (
    <div
      role="tablist"
      aria-label="Filter by Medical Specialty"
      className={`w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-2 ${className}`}
    >
      {specialties.map((item) => {
        const isSelected = item.id === activeSpecialtyId || (item.id === "All" && activeSpecialtyId === "All Specialties");
        const label =
          locale === "ar"
            ? item.labelAr
            : locale === "en"
            ? item.labelEn
            : item.labelFr;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectSpecialty(item.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              isSelected
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.03]"
                : "bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default SpecialtyQuickPills;
