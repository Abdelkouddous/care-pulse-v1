import { TranslationDictionary } from "./en";

/**
 * French (fr-DZ) Localization Dictionary
 * High-trust healthcare vocabulary matching Doctolib and official Algerian clinical standards.
 */
export const DICTIONARY_FR: TranslationDictionary = {
  common: {
    appName: "Wateen Book",
    brandSubtitle: "Rendez-vous Médicaux",
    tagline: "Votre santé, simplement organisée",
    currency: "DA",
    loading: "Chargement...",
    freeForPatients: "100% Gratuit pour les patients",
    carteChifaAccepted: "Carte Chifa & CNAS acceptées",
    instantConfirmation: "Confirmation instantanée SMS & WhatsApp",
    bookAppointment: "Prendre rendez-vous",
  },
  nav: {
    home: "Accueil",
    howItWorks: "Comment ça marche",
    doctors: "Médecins",
    clinics: "Cliniques",
    forClinics: "Pour les cabinets",
    pricing: "Tarifs cabinets",
    contact: "Contact",
    signIn: "Connexion",
    register: "Inscription",
    patientDashboard: "Espace Patient",
    doctorPortal: "Espace Praticien",
  },
  hero: {
    badge: "PHASE PILOTE • ALGER (16) & TÉBESSA (12)",
    titlePrimary: "Prenez rendez-vous avec un médecin en Algérie,",
    titleSecondary: "En toute simplicité.",
    subtitle:
      "Trouvez des cliniques partenaires et des spécialistes vérifiés à Alger et Tébessa. Réservation 100% gratuite pour les patients, tarifs transparents en Dinars Algériens (DA), et prise en charge Carte Chifa.",
    primaryCta: "Prendre rendez-vous",
    searchPill: "Rechercher un médecin ou une clinique",
  },
  stats: {
    doctorsTitle: "Médecins Référencés",
    clinicsTitle: "Cliniques Partenaires",
    wilayasTitle: "Wilayas Pilotes",
    wilayasSub: "Alger (16) & Tébessa (12)",
    feesTitle: "Frais de Réservation",
    feesSub: "Toujours 100% Gratuit",
  },
  search: {
    specialtyLabel: "Spécialité",
    wilayaLabel: "Wilaya / Ville",
    dateLabel: "Date souhaitée",
    modeLabel: "Type de consultation",
    inClinic: "Au cabinet",
    video: "En vidéo",
    searchButton: "Rechercher",
    allSpecialties: "Toutes les spécialités",
  },
  auth: {
    fastTrackBadge: "Accès Patient Rapide",
    fastTrackTitle: "Connexion ou Inscription avec Mobile",
    fastTrackSubtitle: "Entrez votre numéro de téléphone algérien pour gérer vos rendez-vous.",
    phoneLabel: "Numéro de téléphone mobile",
    phonePlaceholder: "549 88 24 56",
    continueButton: "Continuer vers la prise de rendez-vous",
    practitionerPrompt: "Vous êtes professionnel de santé ?",
    practitionerLink: "Espace Praticien",
  },
  clinics: {
    badge: "ÉTABLISSEMENTS DE SANTÉ",
    title: "Cliniques et Centres Médicaux Partenaires",
    subtitle:
      "Consultez les polycliniques et centres médicaux opérationnels dans nos wilayas pilotes.",
    radius: "Rayon de recherche",
    doctorsAvailable: "Médecins disponibles",
    bookAtClinic: "Prendre rendez-vous ici",
    directions: "Voir sur la carte",
  },
  doctors: {
    badge: "PRATICIENS VÉRIFIÉS",
    title: "Nos Spécialistes Médicaux",
    subtitle: "Des médecins certifiés disponibles en consultation au cabinet et téléconsultation.",
    consultationFee: "Tarif consultation",
    nextAvailable: "Prochain créneau",
    bookDoctor: "Prendre rendez-vous",
  },
  howItWorks: {
    badge: "FONCTIONNEMENT SIMPLE",
    title: "Comment fonctionne Wateen Book",
    subtitle: "Prenez rendez-vous en 3 étapes rapides.",
    step1Title: "1. Recherchez un praticien",
    step1Desc: "Filtrez par spécialité médicale, wilaya (Alger ou Tébessa) et date souhaitée.",
    step2Title: "2. Choisissez un créneau",
    step2Desc: "Sélectionnez l'horaire de consultation qui convient à votre emploi du temps.",
    step3Title: "3. Confirmation immédiate",
    step3Desc: "Recevez votre confirmation et rappel de rendez-vous directement sur WhatsApp.",
  },
  forDoctors: {
    badge: "POUR LES CLINIQUES & PRATICIENS",
    title: "Modernisez l'accueil de votre cabinet",
    subtitle: "Réduisez les rendez-vous non honorés jusqu'à 40% grâce à la confirmation WhatsApp.",
    benefit1: "Rappels et confirmations bidirectionnels automatisés par WhatsApp.",
    benefit2: "Synchronisation d'agenda en temps réel pour votre secrétariat médical.",
    benefit3: "3 mois d'essai gratuit offerts à toutes les cliniques partenaires du pilote.",
    cta: "Rejoindre le réseau de praticiens",
  },
  faq: {
    badge: "QUESTIONS FRÉQUENTES",
    title: "Questions & Réponses",
    q1: "La prise de rendez-vous est-elle gratuite pour les patients ?",
    a1: "Oui, la réservation sur Wateen Book est 100% gratuite pour les patients. Les honoraires médicaux sont réglés directement au cabinet selon les tarifs légaux.",
    q2: "La Carte Chifa et la CNAS sont-elles acceptées ?",
    a2: "Oui, l'ensemble de nos cliniques et médecins partenaires acceptent la Carte Chifa et délivrent les feuilles de soins CNAS.",
    q3: "Comment sont protégées mes données médicales ?",
    a3: "Vos données sont traitées en stricte conformité avec la Loi n° 18-07 relative à la protection des données à caractère personnel en Algérie.",
    q4: "Comment annuler ou déplacer un rendez-vous ?",
    a4: "Vous pouvez annuler ou reporter votre rendez-vous en un clic depuis votre espace patient ou en répondant au message WhatsApp reçu.",
    q5: "Comment régler ma consultation ?",
    a5: "La prise de rendez-vous sur Wateen Book est 100% gratuite (0 DA). Vous réglez vos honoraires directement au cabinet par espèces, BaridiMob ou carte CIB/Dahabia, avec remise d'une feuille de soins CNAS.",
  },
  pricing: {
    badge: "OFFRES CABINETS",
    title: "Solutions pour Cabinets et Cliniques",
    subtitle:
      "La prise de rendez-vous est toujours 100% gratuite (0 DA) pour les patients. Nos forfaits s'adressent aux secrétariats médicaux et gestionnaires de cliniques.",
    freeTrialBanner: "🎉 Offre Spéciale Pilote : 3 Mois d'Essai Gratuit pour Tout Nouveau Cabinet",
    monthly: "DA / mois",
    starterClinic: "Cabinet Solo",
    starterDesc: "Idéal pour les médecins spécialistes et généralistes en exercice individuel.",
    proClinic: "Polyclinique & Centre",
    proDesc: "Conçu pour les centres de santé multidisciplinaires et cliniques privées.",
    featuresTitle: "Services inclus :",
    ctaStartTrial: "Démarrer mes 3 mois d'essai gratuit",
    acceptedPaymentTitle: "Moyens de paiement acceptés en Algérie",
    gateways: ["BaridiMob", "Dahabia / CIB", "CCP", "Virement Bancaire"],
  },
  contact: {
    badge: "CONTACTEZ-NOUS",
    title: "Notre équipe est à votre écoute",
    subtitle: "Une question sur une clinique ou besoin d'assistance ? Écrivez-nous.",
    nameLabel: "Nom complet",
    namePlaceholder: "Amina Belarbi",
    phoneLabel: "Numéro de téléphone",
    phonePlaceholder: "+213 5XX XX XX XX",
    messageLabel: "Votre message",
    messagePlaceholder: "Comment pouvons-nous vous aider aujourd'hui ?",
    submitButton: "Envoyer le message",
    whatsappButton: "WhatsApp Direct",
    successMessage: "Merci ! Notre équipe vous répondra dans les meilleurs délais.",
  },
  testimonials: {
    badge: "AVIS PATIENTS",
    title: "Ce Que Disent Nos Patients",
    subtitle: "Témoignages vérifiés de patients et praticiens dans les wilayas pilotes.",
  },
  services: {
    badge: "SOINS COMPLETS",
    title: "Nos Spécialités Médicales",
    learnMore: "En savoir plus",
    items: [
      {
        title: "Urgences Médicales",
        description:
          "Assistance urgente coordonnée avec les structures de soins régionales.",
      },
      {
        title: "Cardiologie",
        description:
          "Diagnostics cardiaques avancés, bilans préventifs et suivi cardiovasculaire.",
      },
      {
        title: "Pédiatrie",
        description:
          "Suivi de santé de l'enfant, médecine néonatale et bilans de croissance.",
      },
      {
        title: "Imagerie & Radiologie",
        description:
          "IRM, scanner, échographie et analyses médicales de haute précision.",
      },
      {
        title: "Médecine Générale",
        description:
          "Consultations complètes, bilans de routine et prise en charge globale.",
      },
      {
        title: "Pharmacie & Ordonnances",
        description:
          "Ordonnances électroniques et coordination officinale simplifiée.",
      },
    ],
  },
  modals: {
    admin: {
      title: "Vérification Accès Administrateur",
      description: "Entrez votre clé de passe à 6 chiffres pour accéder au portail admin.",
      action: "Entrer la Clé Admin",
      error: "Clé de passe incorrecte. Veuillez réessayer.",
    },
    doctor: {
      title: "Vérification Accès Professionnel",
      description: "Entrez votre clé de passe à 6 chiffres pour accéder au portail praticien.",
      action: "Entrer la Clé Médecin",
      error: "Clé de passe incorrecte. Veuillez réessayer.",
    },
  },
  footer: {
    about:
      "Wateen Book est la plateforme algérienne de prise de rendez-vous médicaux reliant patients et professionnels de santé à Alger et Tébessa.",
    pilotNotice: "Actuellement disponible à Alger (16) et Tébessa (12). Déploiement national en cours.",
    dataProtection: "Protection des Données Personnelles (Loi 18-07)",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions Générales d'Utilisation",
    legalNotice: "Mentions Légales",
    medicalDisclaimer:
      "Wateen Book est un outil de prise de rendez-vous et ne remplace pas les services d'urgence médicale. En cas d'urgence vitale, contactez le SAMU (14) ou la Protection Civile (1021).",
  },
};
