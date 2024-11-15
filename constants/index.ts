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

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
    speciality: {
      name: "Cardiologist",
      icon: "❤️",
    },
    exp: "10 Years",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
    speciality: {
      name: "Pediatrician",
      icon: "🧸",
    },
    exp: "8 Years",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
    speciality: {
      name: "Neurologist",
      icon: "🧠",
    },
    exp: "12 Years",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
    speciality: {
      name: "Orthopedic Surgeon",
      icon: "🦴",
    },
    exp: "15 Years",
  },

  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
    speciality: {
      name: "Dermatologist",
      icon: "🌞",
    },
    exp: "12 Years",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
    speciality: {
      name: "Ophthalmologist",
      icon: "👁️",
    },
    exp: "14 Years",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
    speciality: {
      name: "Dentist",
      icon: "🦷",
    },
    exp: "10 Years",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
    speciality: {
      name: "Gynecologist",
      icon: "👶",
    },
    exp: "11 Years",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
    speciality: {
      name: "Oncologist",
      icon: "🎗️",
    },
    exp: "13 Years",
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Martha Watson",
    speciality: {
      name: "Psychiatrist",
      icon: "🧘",
    },
    exp: "16 Years",
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Oliver Jones",
    speciality: {
      name: "Radiologist",
      icon: "📡",
    },
    exp: "14 Years",
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Sophia Taylor",
    speciality: {
      name: "Urologist",
      icon: "🚻",
    },
    exp: "15 Years",
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Liam Brown",
    speciality: {
      name: "Pulmonologist",
      icon: "🌬️",
    },
    exp: "13 Years",
  },
  {
    image: "/assets/images/dr-watson.png",
    name: "Emma Smith",
    speciality: {
      name: "Endocrinologist",
      icon: "💉",
    },
    exp: "12 Years",
  },
  {
    image: "/assets/images/dr-brown.png",
    name: "Noah Thomas",
    speciality: {
      name: "Gastroenterologist",
      icon: "🍴",
    },
    exp: "11 Years",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
