/**
 * Single Source of Truth for VitalBook Public Metrics & Pilot Scope.
 * No landing page component may hard-code numbers, prices, or conflicting wilaya counts.
 */

export interface PilotWilaya {
  code: 16 | 12;
  slug: "algiers" | "tebessa";
  nameFr: string;
  nameEn: string;
  nameAr: string;
  clinicsCount: number;
}

export interface LandingStats {
  /** Active Pilot Wilayas */
  wilayasCount: number;
  wilayasList: PilotWilaya[];
  /** Partner Medical Centers & Polyclinics in Pilot */
  partnerClinicsCount: number;
  /** Active Verified Medical Specialists */
  verifiedDoctorsCount: number;
  /** Patient booking fee in integer cents (0 = Free) */
  patientBookingFeeCents: number;
  /** Free trial period for partner clinics in months */
  clinicFreeTrialMonths: number;
  /** Legal data protection reference */
  legalDataProtectionRef: string;
  /** Official support contact email */
  contactEmail: string;
  /** Forwarding email behind the scenes */
  forwardEmail: string;
}

export const LANDING_STATS: LandingStats = {
  wilayasCount: 2,
  wilayasList: [
    {
      code: 16,
      slug: "algiers",
      nameFr: "Alger",
      nameEn: "Algiers",
      nameAr: "الجزائر",
      clinicsCount: 2,
    },
    {
      code: 12,
      slug: "tebessa",
      nameFr: "Tébessa",
      nameEn: "Tébessa",
      nameAr: "تبسة",
      clinicsCount: 2,
    },
  ],
  partnerClinicsCount: 4,
  verifiedDoctorsCount: 6,
  patientBookingFeeCents: 0,
  clinicFreeTrialMonths: 3,
  legalDataProtectionRef: "Loi n° 18-07 (Protection des données personnelles)",
  contactEmail: "contact@wateensoft.com",
  forwardEmail: "abdelkouddous.hamel@gmail.com",
};

/**
 * Helper to get localized pilot wilaya summary string.
 */
export function getPilotScopeText(locale: "fr" | "ar" | "en" = "fr"): string {
  if (locale === "ar") {
    return "مرحلة الإطلاق التجريبي • الجزائر (16) وتبسة (12)";
  }
  if (locale === "en") {
    return "Pilot Phase • Live in Algiers (16) & Tébessa (12)";
  }
  return "Phase Pilote • Disponible à Alger (16) et Tébessa (12)";
}
