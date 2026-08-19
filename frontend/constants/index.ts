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
    name: "Mohamed Benali",
    speciality: {
      name: "Cardiologist",
      icon: "❤️",
    },
    exp: "10 Years",
    rating: 4.8,
    reviews: 127,
    idx: 1,
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Meriem Belkacem",
    speciality: {
      name: "Pediatrician",
      icon: "🧸",
    },
    exp: "8 Years",
    rating: 4.9,
    reviews: 212,
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Rachid Boumediene",
    speciality: {
      name: "Neurologist",
      icon: "🧠",
    },
    exp: "12 Years",
    rating: 4.6,
    reviews: 94,
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Amine Cherif",
    speciality: {
      name: "Orthopedic Surgeon",
      icon: "🦴",
    },
    exp: "15 Years",
    rating: 4.7,
    reviews: 183,
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Yasmin Mansouri",
    speciality: {
      name: "Dermatologist",
      icon: "🌞",
    },
    exp: "12 Years",
    rating: 4.5,
    reviews: 156,
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Karim Tebboune",
    speciality: {
      name: "Ophthalmologist",
      icon: "👁️",
    },
    exp: "14 Years",
    rating: 4.2,
    reviews: 78,
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Sofia Haddad",
    speciality: {
      name: "Dentist",
      icon: "🦷",
    },
    exp: "10 Years",
    rating: 4.9,
    reviews: 231,
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Sarah Ould",
    speciality: {
      name: "Gynecologist",
      icon: "👶",
    },
    exp: "11 Years",
    rating: 4.7,
    reviews: 143,
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Youcef Brahimi",
    speciality: {
      name: "Oncologist",
      icon: "🎗️",
    },
    exp: "13 Years",
    rating: 4.6,
    reviews: 92,
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Amina Bouaziz",
    speciality: {
      name: "Psychiatrist",
      icon: "🧘",
    },
    exp: "16 Years",
    rating: 4.4,
    reviews: 115,
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Lyes Hammoudi",
    speciality: {
      name: "Radiologist",
      icon: "📡",
    },
    exp: "14 Years",
    rating: 3.9,
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
    rating: 4.3,
    reviews: 76,
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Reda Bouteflika",
    speciality: {
      name: "Pulmonologist",
      icon: "🌬️",
    },
    exp: "13 Years",
    rating: 4.1,
    reviews: 68,
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Nadia Belhadj",
    speciality: {
      name: "Endocrinologist",
      icon: "💉",
    },
    exp: "12 Years",
    rating: 4.0,
    reviews: 51,
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Farid Zinedine",
    speciality: {
      name: "Gastroenterologist",
      icon: "🍴",
    },
    exp: "11 Years",
    rating: 3.8,
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
