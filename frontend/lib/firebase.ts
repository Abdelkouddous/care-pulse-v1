import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBq92zsz4vH2y0C9ExsbOppHawHJKswd8Y",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0222855501.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gen-lang-client-0222855501",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0222855501.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "723461514000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:723461514000:web:214ddfa6f6a3a3ab41fb95",
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
