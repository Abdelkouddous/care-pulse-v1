/**
 * API Contract Specifications & Data Transfer Objects (DTOs)
 * Architectural Layer: Decouples UI from Persistence Layer (Laravel Backend Ready)
 */

// Sharding & Scalability Guard: Universally Unique Identifier
export type UUID = string;

// Integer Money Guard: Financial types strictly represented in integer cents / centimes
export interface PricingPlanDTO {
  id: UUID;
  name: string;
  price_cents: number; // e.g. 69000 represents 690.00 DZD
  currency: "DZD";
  billing_cycle: "forever" | "monthly" | "yearly";
  description: string;
  features: Array<{
    id: UUID;
    text: string;
    included: boolean;
  }>;
  button_text: string;
  is_highlighted?: boolean;
}

export interface MetricSummaryDTO {
  patients_count: number;
  doctors_count: number;
  active_doctors_count: number;
  wilayas_count: number;
}

export interface DoctorDTO {
  id: UUID;
  name: string;
  speciality: {
    name: string;
    icon: string;
  };
  experience_years: number;
  rating: number;
  review_count: number;
  image_url: string;
}

export interface PatientFormDTO {
  phone: string;
  name?: string;
}
