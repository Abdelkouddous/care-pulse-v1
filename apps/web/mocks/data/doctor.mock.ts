import { Doctor } from "@/types/api.types";

/**
 * CANONICAL MOCK DOCTOR FIXTURE
 * Exactly 1 mock physician reserved for demo tours, offline fallbacks, and UI testing.
 * Strict adherence to Integer Money Guard (consultation_fee_cents) & UUIDv4.
 */
export const MOCK_DOCTOR: Doctor = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  clinic_id: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
  specialty_id: "s1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
  first_name: "Amine",
  last_name: "Mansouri",
  name: "Dr. Amine Mansouri",
  email: "dr.mansouri@vitalbook.com",
  phone: "+213 550 11 22 33",
  avatar_url: "/assets/images/dr-remirez.png",
  bio: "Senior Consulting Cardiologist specializing in preventive cardiovascular diagnostics, non-invasive imaging, and hypertension management.",
  consultation_fee_cents: 400000, // 4,000.00 DZD in integer cents
  license_number: "DZ-MSPRH-16-10492",
  is_active: true,
  specialty: {
    id: "s1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    name: "Cardiology",
    description: "Cardiovascular clinical diagnostics and preventative heart health.",
  },
  availabilities: [
    {
      id: "v1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      day_of_week: 1, // Monday
      start_time: "09:00:00",
      end_time: "17:00:00",
      slot_duration_minutes: 30,
      is_active: true,
    },
    {
      id: "v1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      day_of_week: 2, // Tuesday
      start_time: "09:00:00",
      end_time: "17:00:00",
      slot_duration_minutes: 30,
      is_active: true,
    },
    {
      id: "v1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      day_of_week: 3, // Wednesday
      start_time: "09:00:00",
      end_time: "17:00:00",
      slot_duration_minutes: 30,
      is_active: true,
    },
    {
      id: "v1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      day_of_week: 4, // Thursday
      start_time: "09:00:00",
      end_time: "17:00:00",
      slot_duration_minutes: 30,
      is_active: true,
    },
    {
      id: "v1eebc99-9c0b-4ef8-bb6d-6bb9bd380a05",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      day_of_week: 5, // Friday
      start_time: "09:00:00",
      end_time: "13:00:00",
      slot_duration_minutes: 30,
      is_active: true,
    },
  ],
};

/**
 * Display Card Representation for Landing & Booking Carousels
 */
export interface MockDoctorDisplay {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  address: string;
  wilaya: string;
  fee_cents: number;
  fee_dzd: string;
  rating: number;
  reviewsCount: number;
  license: string;
  nextSlot: string;
  experience: string;
}

export const MOCK_DOCTOR_DISPLAY: MockDoctorDisplay = {
  id: MOCK_DOCTOR.id,
  name: MOCK_DOCTOR.name,
  specialty: MOCK_DOCTOR.specialty?.name || "Cardiology",
  avatar: "/assets/images/dr-remirez.png",
  address: "12 Rue Didouche Mourad, Alger",
  wilaya: "16 - Alger",
  fee_cents: MOCK_DOCTOR.consultation_fee_cents,
  fee_dzd: "4,000 DZD",
  rating: 4.9,
  reviewsCount: 142,
  license: MOCK_DOCTOR.license_number,
  nextSlot: "Tomorrow, 09:30 AM",
  experience: "14 Years",
};

/**
 * Legacy select option shape (image, name, speciality, exp, rating, reviews)
 */
export const MOCK_DOCTOR_LEGACY = {
  image: "/assets/images/dr-remirez.png",
  name: MOCK_DOCTOR.name,
  speciality: {
    name: "Cardiologist",
    icon: "❤️",
  },
  exp: "14 Years",
  rating: 4.9,
  reviews: 142,
  idx: 1,
};

export const MOCK_DOCTORS_LEGACY = [MOCK_DOCTOR_LEGACY];
export const MOCK_DOCTOR_LIST: Doctor[] = [MOCK_DOCTOR];
