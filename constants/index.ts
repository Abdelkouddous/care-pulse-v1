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
/**
 * Doctors Data
 * This file contains information about doctors available on the Pulse Health platform.
 * Each doctor object includes personal information, specialization, experience, and ratings.
 *
 * Ratings are on a scale of 1-5 stars and represent patient satisfaction scores.
 */

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
    speciality: {
      name: "Cardiologist",
      icon: "❤️",
    },
    exp: "10 Years",
    rating: 4.8, // High rating for experienced cardiologist
    reviews: 127,
    idx: 1,
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
    speciality: {
      name: "Pediatrician",
      icon: "🧸",
    },
    exp: "8 Years",
    rating: 4.9, // Very high rating - pediatricians often get excellent feedback from parents
    reviews: 212,
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
    speciality: {
      name: "Neurologist",
      icon: "🧠",
    },
    exp: "12 Years",
    rating: 4.6, // Strong rating for experienced neurologist
    reviews: 94,
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
    speciality: {
      name: "Orthopedic Surgeon",
      icon: "🦴",
    },
    exp: "15 Years",
    rating: 4.7, // High rating for very experienced surgeon
    reviews: 183,
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
    speciality: {
      name: "Dermatologist",
      icon: "🌞",
    },
    exp: "12 Years",
    rating: 4.5, // Good rating for dermatologist
    reviews: 156,
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
    speciality: {
      name: "Ophthalmologist",
      icon: "👁️",
    },
    exp: "14 Years",
    rating: 4.2, // Slightly lower but still good rating
    reviews: 78,
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
    speciality: {
      name: "Dentist",
      icon: "🦷",
    },
    exp: "10 Years",
    rating: 4.9, // Very high rating - excellent dentist
    reviews: 231,
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
    speciality: {
      name: "Gynecologist",
      icon: "👶",
    },
    exp: "11 Years",
    rating: 4.7, // High rating for gynecologist
    reviews: 143,
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
    speciality: {
      name: "Oncologist",
      icon: "🎗️",
    },
    exp: "13 Years",
    rating: 4.6, // Strong rating for oncologist
    reviews: 92,
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Martha Watson",
    speciality: {
      name: "Psychiatrist",
      icon: "🧘",
    },
    exp: "16 Years",
    rating: 4.4, // Good rating for psychiatrist
    reviews: 115,
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Oliver Jones",
    speciality: {
      name: "Radiologist",
      icon: "📡",
    },
    exp: "14 Years",
    rating: 3.9, // Lower rating - radiologists have less direct patient interaction
    reviews: 47,
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Sophia Taylor",
    speciality: {
      name: "Urologist",
      icon: "🚻",
    },
    exp: "15 Years",
    rating: 4.3, // Good rating for urologist
    reviews: 76,
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Liam Brown",
    speciality: {
      name: "Pulmonologist",
      icon: "🌬️",
    },
    exp: "13 Years",
    rating: 4.1, // Above average rating
    reviews: 68,
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Emma Smith",
    speciality: {
      name: "Endocrinologist",
      icon: "💉",
    },
    exp: "12 Years",
    rating: 4.0, // Average rating - newer endocrinologist
    reviews: 51,
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Noah Thomas",
    speciality: {
      name: "Gastroenterologist",
      icon: "🍴",
    },
    exp: "11 Years",
    rating: 3.8, // Lower rating - specialty often deals with uncomfortable procedures
    reviews: 62,
  },
];

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
