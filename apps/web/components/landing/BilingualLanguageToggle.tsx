"use client";

import React from "react";
import { useLanguage, SupportedLocale } from "@/context/LanguageContext";

export type { SupportedLocale };

export interface LocaleOption {
  code: SupportedLocale;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
}

export interface BilingualLanguageToggleProps {
  activeLocale?: SupportedLocale;
  onLocaleChange?: (locale: SupportedLocale) => void;
  availableLocales?: LocaleOption[];
  className?: string;
}

export function BilingualLanguageToggle({
  activeLocale,
  onLocaleChange,
  availableLocales = [
    { code: "fr", label: "FR", nativeLabel: "Français", dir: "ltr" },
    { code: "ar", label: "عربي", nativeLabel: "العربية", dir: "rtl" },
    { code: "en", label: "EN", nativeLabel: "English", dir: "ltr" },
  ],
  className = "",
}: BilingualLanguageToggleProps): React.JSX.Element {
  const ctx = useLanguage();
  const currentLocale = activeLocale || ctx.locale;
  const handleSelect = onLocaleChange || ctx.setLocale;

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`inline-flex items-center p-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xs backdrop-blur-md ${className}`}
    >
      {availableLocales.map((loc) => {
        const isActive = loc.code === currentLocale;
        return (
          <button
            key={loc.code}
            type="button"
            onClick={() => handleSelect(loc.code)}
            aria-pressed={isActive}
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
              isActive
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {loc.label}
          </button>
        );
      })}
    </div>
  );
}

export default BilingualLanguageToggle;
