/**
 * Canonical English Localization Dictionary
 * Serves as reference token tree for future Arabic (ar-DZ) and French (fr-DZ) modules.
 */
export const DICTIONARY_EN = {
  common: {
    appName: "CarePulse",
    brandSubtitle: "Pulse",
    tagline: "Your Health, Our Priority",
    currency: "DZD",
    loading: "Processing...",
  },
  nav: {
    home: "Home",
    about: "About",
    doctors: "Our Doctors",
    services: "Services",
    testimonials: "Testimonials",
    pricing: "Plans",
    contact: "Contact",
    signIn: "Sign In",
    adminPortal: "Admin Portal",
    doctorPortal: "Doctor Portal",
  },
  hero: {
    badge: "NATIONAL HEALTHCARE NETWORK",
    titlePrimary: "Your Health,",
    titleSecondary: "Our Priority",
    subtitle:
      "Algeria's trusted digital healthcare network — connect with certified medical specialists in minutes.",
    trustBar:
      "✓ +12,500 Patients Registered · ✓ +340 Verified Doctors · ✓ 28 Wilayas Covered",
    form: {
      title: "Book Your Appointment",
      subtitle: "Enter your phone number to get started",
      phoneLabel: "Phone number",
      phonePlaceholder: "+213550123456",
      submitButton: "Schedule Now",
    },
    portals: {
      adminTitle: "Admin Portal",
      adminAction: "Login as Admin",
      doctorTitle: "Healthcare Providers",
      doctorAction: "Login as Doctor",
    },
    testAccounts: {
      title: "Test Accounts",
      subtitle: "Use these credentials to test the platform.",
      patient: {
        role: "Patient",
        phone: "+213550123456",
        code: "Any 6 digits",
      },
      doctor: {
        role: "Doctor",
        passkey: "654321",
      },
      admin: {
        role: "Admin",
        passkey: "123456",
      },
    },
  },
  metrics: {
    badge: "NATIONAL NETWORK",
    title: "CarePulse by the Numbers",
    patients: {
      title: "Patients Treated",
      change: "↑ 7.2% this month — Algiers, Oran, Constantine",
    },
    doctors: {
      title: "Partner Doctors",
      change: "↑ Across all medical specialties",
    },
    wilayas: {
      title: "Wilayas Covered",
      change: "From Tamanrasset to Annaba",
    },
  },
  about: {
    badge: "OUR MISSION",
    title: "About CarePulse",
    p1: "CarePulse is a modern healthcare appointment booking network engineered to bridge patients with qualified and verified medical practitioners across Algeria.",
    p2: "Our platform removes long hospital queues and scheduling friction. Patients can easily search practitioners by specialty, review credentials, and secure verified consultation slots instantly.",
    p3: "CarePulse prioritizes patient privacy, rapid triage, and streamlined healthcare management, ensuring quality care is accessible with a single click.",
  },
  doctors: {
    badge: "HEALTHCARE EXPERTS",
    title: "Meet Our Medical Specialists",
    subtitle: "Board-certified professionals dedicated to your health and wellness across Algeria",
  },
  services: {
    badge: "COMPREHENSIVE CARE",
    title: "Our Medical Services",
    learnMore: "Learn More",
    items: [
      {
        title: "Emergency Care",
        description:
          "24/7 urgent medical assistance with coordinated regional trauma dispatch teams.",
      },
      {
        title: "Cardiology",
        description:
          "Advanced cardiac diagnostics, preventive screenings, and cardiovascular treatment plans.",
      },
      {
        title: "Pediatrics",
        description:
          "Dedicated child wellness, neonatal care, and regular pediatric health checkups.",
      },
      {
        title: "Diagnostics & Imaging",
        description:
          "High-precision MRI, CT scanning, ultrasound, and digitized pathology laboratories.",
      },
      {
        title: "Primary Care",
        description:
          "Holistic general medicine, preventive chronic care, and routine health evaluations.",
      },
      {
        title: "Pharmacy Services",
        description:
          "Digital e-prescriptions with verified local pharmacy fulfillment networks.",
      },
    ],
  },
  testimonials: {
    badge: "PATIENT FEEDBACK",
    title: "What Our Patients Say",
    subtitle: "Verified experiences from patients and doctors across Algerian wilayas",
    list: [
      {
        name: "Amina Belarbi",
        role: "Regular Patient, Algiers",
        initials: "AB",
        color: "bg-emerald-500",
        quote:
          "CarePulse completely transformed how I manage my family's healthcare. Booking a specialist in seconds saves hours of waiting.",
        rating: 5,
      },
      {
        name: "Karim Touati",
        role: "Patient, Oran",
        initials: "KT",
        color: "bg-sky-500",
        quote:
          "Finally a platform tailored specifically for Algeria. Verified doctors, clear appointments, and SMS reminders keep everything on track.",
        rating: 5,
      },
      {
        name: "Dr. Fatima Mansouri",
        role: "General Practitioner, Constantine",
        initials: "FM",
        color: "bg-teal-500",
        quote:
          "Since adopting CarePulse in my clinic, patient scheduling is organized and no-shows have dropped significantly. A must-have tool.",
        rating: 5,
      },
      {
        name: "Yasmine Boudaoud",
        role: "Patient, Annaba",
        initials: "YB",
        color: "bg-violet-500",
        quote:
          "Extremely intuitive and fast. I found a pediatric specialist for my son within 5 minutes. Outstanding service for all Algerians.",
        rating: 5,
      },
      {
        name: "Mohamed Hamidi",
        role: "Patient, Tizi Ouzou",
        initials: "MH",
        color: "bg-orange-500",
        quote:
          "CarePulse gives me quick access to verified medical records and appointment histories in one place. Reliable and secure.",
        rating: 4,
      },
    ],
  },
  pricing: {
    badge: "PRICING PLANS",
    title: "Transparent Memberships",
    subtitle: "Select the plan tailored to your healthcare needs and budget.",
    forever: "Free Forever",
    perMonth: "DZD / month",
    popularBadge: "MOST POPULAR",
    paymentMethodsTitle: "Accepted Payment Gateways",
    gateways: ["BaridiMob", "Dahabia / CIB", "CCP", "Bank Transfer"],
  },
  newsletter: {
    badge: "NEWSLETTER",
    title: "Stay Informed on Your Health",
    subtitle:
      "Medical insights, new specialist availability, and public health advisories — delivered directly to your inbox.",
    placeholder: "your.email@example.dz",
    action: "Subscribe",
    disclaimer: "No spam. Unsubscribe anytime. 🇩🇿",
  },
  contact: {
    badge: "CONTACT US",
    title: "We Are Here to Help",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Amina Belarbi",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+213 5XX XX XX XX",
    messageLabel: "Your Message",
    messagePlaceholder: "Type your message or inquiry here...",
    submitButton: "Send Message",
    whatsappButton: "WhatsApp Direct",
    alertSuccess: "Thank you for reaching out! Our team will contact you shortly.",
  },
  modals: {
    admin: {
      title: "Admin Access Verification",
      description: "Enter your 6-digit passkey to access the admin portal.",
      action: "Enter Admin Passkey",
      error: "Invalid Passkey. Please try again.",
    },
    doctor: {
      title: "Doctor Access Verification",
      description: "Enter your 6-digit passkey to access the healthcare provider portal.",
      action: "Enter Doctor Passkey",
      error: "Invalid Passkey. Please try again.",
    },
  },
} as const;

export type TranslationDictionary = typeof DICTIONARY_EN;
