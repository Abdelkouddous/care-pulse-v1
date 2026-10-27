/**
 * WateenSoft & Wateen Book Central Brand Configuration
 * Single Source of Truth for corporate identity, tokens, domains, and typography.
 */

export const BRAND_CONFIG = {
  company: {
    name: "WateenSoft",
    nameArabic: "وتين سوفت",
    tagline: "WateenSoft HealthTech Solutions",
    legalName: "WateenSoft HealthTech Solutions S.A.R.L.",
    website: "https://wateensoft.com",
    supportEmail: "support@wateensoft.com",
    contactEmail: "contact@wateensoft.com",
  },
  app: {
    id: "wateen_book",
    name: "Wateen Book",
    nameArabic: "وتين بوك",
    shortName: "Wateen Book",
    shortNameArabic: "وتين بوك",
    bundleId: "com.wateensoft.wateenbook",
    deepLinkScheme: "wateenbook",
    description:
      "Wateen Book by WateenSoft — Flagship Medical Appointment & Clinical Operations Platform.",
    version: "1.0.0",
  },
  ecosystem: {
    sso: {
      name: "Wateen ID",
      domain: "id.wateensoft.com",
    },
    work: {
      name: "Wateen Work",
      nameArabic: "وتين وورك",
      domain: "work.wateensoft.com",
    },
  },
  domains: {
    web: "book.wateensoft.com",
    api: "api.wateensoft.com",
    localApi: "http://localhost:8000/api/v1",
  },
  colors: {
    primary: "#008668", // Wateen Teal
    aqua: "#33CCCC", // Pulse Aqua
    accent: "#FF9B33", // Warm Empathy Orange
    surfaceLight: "#F2F2F2", // Soft Clinical Gray
    surfaceDark: "#0B131E", // Enterprise Slate
    surfaceDarkSecondary: "#111C2D",
  },
  typography: {
    headings: "Poppins, Cairo, sans-serif",
    body: "Inter, 'IBM Plex Sans Arabic', sans-serif",
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
export default BRAND_CONFIG;
