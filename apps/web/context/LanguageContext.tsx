"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DICTIONARY_EN, TranslationDictionary } from "@/constants/locales/en";
import { DICTIONARY_FR } from "@/constants/locales/fr";
import { DICTIONARY_AR } from "@/constants/locales/ar";

export type SupportedLocale = "fr" | "ar" | "en";

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "fr",
  setLocale: () => {},
  t: DICTIONARY_FR,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("fr");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = (localStorage.getItem("wateenbook_locale") ||
        localStorage.getItem("vitalbook_locale")) as SupportedLocale;
      if (savedLocale && (savedLocale === "fr" || savedLocale === "ar" || savedLocale === "en")) {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("wateenbook_locale", newLocale);
      localStorage.setItem("vitalbook_locale", newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    }
  };

  const t: TranslationDictionary =
    locale === "ar" ? DICTIONARY_AR : locale === "en" ? DICTIONARY_EN : DICTIONARY_FR;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}

export default LanguageContext;
