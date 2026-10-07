import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === "undefined") return null;

  if (!firebaseConfig.apiKey) {
    console.warn("Firebase Web API Key is not set in NEXT_PUBLIC_FIREBASE_API_KEY.");
    return null;
  }

  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  if (!auth && app) {
    auth = getAuth(app);
    // Apply device language preferences automatically
    try {
      auth.useDeviceLanguage();
    } catch {
      auth.languageCode = "it";
    }
  }

  return auth;
};

export const createRecaptchaVerifier = (
  containerId: string = "recaptcha-container"
): RecaptchaVerifier | null => {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) return null;

  if (typeof window !== "undefined" && (window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch {
      // Ignored
    }
  }

  const verifier = new RecaptchaVerifier(currentAuth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved - will proceed with phone verification
    },
    "expired-callback": () => {
      console.warn("reCAPTCHA expired, user must retry.");
    },
  });

  if (typeof window !== "undefined") {
    (window as any).recaptchaVerifier = verifier;
  }

  return verifier;
};

export type { ConfirmationResult };
