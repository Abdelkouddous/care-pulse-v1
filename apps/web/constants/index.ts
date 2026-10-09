export const GenderOptions = ["Male", "Female"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  primaryPhysician: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
  // email: "",  // occupation: "",
  // emergencyContactName: "",
  // emergencyContactNumber: "",  // insuranceProvider: "",
  // insurancePolicyNumber: "",
  // allergies: "",
  // currentMedication: "",
  // familyMedicalHistory: "",
  // pastMedicalHistory: "",
  // identificationType: "Birth Certificate",
  // identificationNumber: "",
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];
import { MOCK_DOCTORS_LEGACY } from "@/mocks/data";

/**
 * Doctors Data
 * Centralized from @/mocks/data: contains exactly 1 canonical mock physician.
 */
export const Doctors = MOCK_DOCTORS_LEGACY;

/**
 * Utility function to render star ratings
 * @param rating - Doctor's rating (1-5)
 * @param maxStars - Maximum number of stars (default: 5)
 * @returns Array of star types (full, half, or empty)
 */
export const getRatingStars = (rating: number, maxStars: number = 5) => {
  const stars = [];

  // Calculate full and partial stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push("full");
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push("half");
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push("empty");
  }

  return stars;
};

/**
 * Format number of reviews to be more readable
 * @param reviews - Number of reviews
 * @returns Formatted string (e.g., "127 reviews")
 */
export const formatReviews = (reviews: number) => {
  if (reviews === 1) return "1 review";
  return `${reviews} reviews`;
};

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
