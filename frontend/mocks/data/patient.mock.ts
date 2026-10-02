import { PatientUser } from "@/types/api.types";

/**
 * CANONICAL MOCK PATIENT FIXTURE
 * Exactly 1 mock patient reserved for demo tours, onboarding evaluations, and test OTP flows.
 * Uses test phone number (+213549882456) configured for free Firebase Phone Auth verification.
 */
export const MOCK_PATIENT: PatientUser & {
  national_id_nin: string;
  national_id: string;
  carte_chifa_number: string;
  chifa_number: string;
  wilaya_code: number;
  blood_type: string;
  member_since: string;
} = {
  id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
  first_name: "Sarah",
  last_name: "Benali",
  name: "Sarah Benali",
  email: "patient@carepulse.com",
  phone: "+213 549 88 24 56", // Test OTP verification number
  date_of_birth: "1995-04-12",
  gender: "female",
  address: "45 Boulevard des Martyrs, Alger, Algeria",
  emergency_contact_name: "Karim Benali",
  emergency_contact_phone: "+213 555 11 22 33",
  insurance_provider: "CNAS Algérie (Caisse Nationale des Assurances Sociales)",
  insurance_policy_number: "DZ-CNAS-99887711",
  allergies: "Penicillin & Beta-Lactam Antibiotics (Severe)",
  current_medications: "CardioPlus 75mg (1 tab/day), Omega-3 EPA 1000mg",
  // Algerian Civic Identifiers
  national_id_nin: "119951600000123456",
  national_id: "119951600000123456",
  carte_chifa_number: "9504121234",
  chifa_number: "9504121234",
  wilaya_code: 16, // Alger
  blood_type: "O+",
  member_since: "January 2024",
};

export const MOCK_PATIENTS_LIST = [MOCK_PATIENT];
