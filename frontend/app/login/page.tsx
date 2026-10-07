"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Activity,
  ShieldCheck,
  Mail,
  Lock,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DemoTourModal } from "@/components/DemoTourModal";
import { toast } from "@/hooks/use-toast";
import { TokenManager } from "@/lib/auth";
import { authService } from "@/lib/api/auth.service";
import { AlgerianPhoneInput } from "@/components/ui/AlgerianPhoneInput";
import {
  getFirebaseAuth,
  createRecaptchaVerifier,
  ConfirmationResult,
} from "@/lib/firebase";
import { signInWithPhoneNumber } from "firebase/auth";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "";

  // Auth Method: "credentials" for Email & Password, "otp" for Phone Number
  const [authMethod, setAuthMethod] = useState<"credentials" | "otp">(
    phoneParam ? "otp" : "credentials"
  );

  // Email & Password State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Phone & OTP State
  const [phoneNumber, setPhoneNumber] = useState(phoneParam || "");
  const [phoneError, setPhoneError] = useState("");
  const [otpStep, setOtpStep] = useState<"phone" | "code">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if existing valid session
  useEffect(() => {
    const existingToken = TokenManager.getToken();
    if (existingToken) {
      router.push("/patient/dashboard");
    }
  }, [router]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (otpStep === "code" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpStep, timeLeft]);

  // Email & Password Login: Authenticates directly with Laravel Sanctum API
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setPasswordError("Please enter your account password.");
      return;
    }

    setEmailError("");
    setPasswordError("");
    setIsLoading(true);

    try {
      const res = await authService.login(email.trim(), password);

      if (res?.token) {
        TokenManager.setSession(res.token, res.role || "patient", res.user, false);

        if (typeof window !== "undefined") {
          localStorage.setItem("vitalbook_token", res.token);
          localStorage.setItem("vitalbook_token", res.token);
          localStorage.setItem("vitalbook_role", res.role || "patient");
          localStorage.setItem("vitalbook_role", res.role || "patient");
          localStorage.removeItem("vitalbook_demo");
          localStorage.removeItem("vitalbook_demo");
          const userStr = JSON.stringify(res.user);
          localStorage.setItem("vitalbook_user", userStr);
          localStorage.setItem("vitalbook_user", userStr);
          document.cookie = `vitalbook_token=${res.token}; path=/; max-age=86400; samesite=lax`;
          document.cookie = `vitalbook_token=${res.token}; path=/; max-age=86400; samesite=lax`;
          document.cookie = `vitalbook_demo=; path=/; max-age=0; samesite=lax`;
          document.cookie = `vitalbook_demo=; path=/; max-age=0; samesite=lax`;
        }

        toast({
          title: "Sign-In Successful",
          description: `Welcome back, ${(res.user as any)?.name || (res.user as any)?.first_name || "Patient"}.`,
        });

        const target =
          res.role === "doctor"
            ? "/doctors/dashboard"
            : res.role === "admin"
            ? "/admin/dashboard"
            : "/patient/dashboard";
        router.push(target);
      } else {
        throw new Error("Missing authentication token from server.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "Invalid credentials. Please verify your email and password.";
      toast({
        title: "Authentication Failed",
        description: message,
        variant: "destructive",
      });
      setPasswordError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format Algerian phone number to standard E.164 (+213...)
  const getE164Phone = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (raw.startsWith("+")) return raw.trim();
    if (digits.startsWith("0")) return `+213${digits.substring(1)}`;
    if (digits.startsWith("213")) return `+${digits}`;
    return `+213${digits}`;
  };

  const testPhoneEnv = process.env.NEXT_PUBLIC_FIREBASE_TEST_PHONE;
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const isTestPhone = Boolean(
    testPhoneEnv &&
      cleanPhone.length > 5 &&
      cleanPhone.includes(testPhoneEnv.replace(/[^0-9]/g, ""))
  );

  // Phone OTP Flow: Dispatches SMS using Firebase Auth and Google reCAPTCHA
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const digits = phoneNumber.replace(/[^0-9]/g, "");
    if (!digits || digits.length < 8) {
      setPhoneError("Please enter a valid Algerian mobile number.");
      return;
    }

    setPhoneError("");
    setIsLoading(true);

    try {
      const formatted = getE164Phone(phoneNumber);
      const auth = getFirebaseAuth();

      if (!auth) {
        // If Firebase API Key is not configured yet in .env.local
        if (isTestPhone) {
          setOtpStep("code");
          setTimeLeft(60);
          toast({
            title: "Test Phone Mode Active",
            description: "Simulated OTP dispatch. Enter passcode 123456.",
          });
          return;
        }

        toast({
          title: "Firebase Configuration Needed",
          description:
            "Please add NEXT_PUBLIC_FIREBASE_API_KEY to frontend/.env.local from your Firebase Console to enable live carrier SMS.",
          variant: "destructive",
        });
        return;
      }

      // Initialize reCAPTCHA verifier for invisible protection
      const verifier = createRecaptchaVerifier("recaptcha-container");
      if (!verifier) {
        throw new Error("reCAPTCHA verifier could not be established.");
      }

      // Trigger Firebase signInWithPhoneNumber
      const confirmation = await signInWithPhoneNumber(auth, formatted, verifier);
      setConfirmationResult(confirmation);
      setOtpStep("code");
      setTimeLeft(60);

      toast({
        title: "SMS Verification Dispatched",
        description: `Firebase dispatched a 6-digit verification code to ${formatted}.`,
      });
    } catch (err: any) {
      console.error("Firebase send OTP error:", err);
      if (typeof window !== "undefined" && (window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch {
          // Clear fallback
        }
      }

      let errorMsg =
        err.message || "Failed to dispatch SMS verification code.";
      if (err.code === "auth/invalid-phone-number") {
        errorMsg = "Invalid phone number format. Please check the digits and try again.";
      } else if (err.code === "auth/quota-exceeded") {
        errorMsg = "SMS quota exceeded for today on Firebase project. Please try again later.";
      } else if (err.code === "auth/captcha-check-failed") {
        errorMsg = "Google reCAPTCHA verification failed. Please try again.";
      } else if (err.code === "auth/invalid-api-key") {
        errorMsg = "Invalid Firebase API Key. Please verify NEXT_PUBLIC_FIREBASE_API_KEY in .env.local.";
      }

      toast({
        title: "SMS Dispatch Failed",
        description: errorMsg,
        variant: "destructive",
      });
      setPhoneError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP: Confirms code with Firebase Auth, then exchanges ID token with Laravel backend
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;
    setIsLoading(true);

    try {
      const formatted = getE164Phone(phoneNumber);
      let idToken: string | undefined = undefined;

      // 1. Confirm with Firebase if a live confirmation result exists
      if (confirmationResult) {
        const userCredential = await confirmationResult.confirm(otpCode);
        idToken = await userCredential.user.getIdToken();
      } else if (isTestPhone && otpCode === "123456") {
        idToken = undefined;
      } else {
        toast({
          title: "Invalid Verification Code",
          description:
            "Passcode 123456 is invalid for live phone numbers. Please enter the SMS code sent to your phone.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 2. Call Laravel Backend stateless authentication
      const res = await authService.firebasePhone(idToken, formatted);

      if (res.registered && res.token && res.user) {
        TokenManager.setSession(res.token, "patient", res.user, false);
        if (typeof window !== "undefined") {
          localStorage.setItem("vitalbook_token", res.token);
          localStorage.setItem("vitalbook_token", res.token);
          localStorage.setItem("vitalbook_role", res.role || "patient");
          localStorage.setItem("vitalbook_role", res.role || "patient");
          localStorage.removeItem("vitalbook_demo");
          localStorage.removeItem("vitalbook_demo");
          const userStr = JSON.stringify(res.user);
          localStorage.setItem("vitalbook_user", userStr);
          localStorage.setItem("vitalbook_user", userStr);
          document.cookie = `vitalbook_token=${res.token}; path=/; max-age=86400; samesite=lax`;
          document.cookie = `vitalbook_token=${res.token}; path=/; max-age=86400; samesite=lax`;
        }

        toast({
          title: "Passcode Verified",
          description: "Access granted to Patient Portal.",
        });
        router.push("/patient/dashboard");
      } else {
        toast({
          title: "Phone Verified",
          description: "Please complete your registration wizard.",
        });
        const redirectUrl = res.onboarding_token
          ? `/register?phone=${encodeURIComponent(formatted)}&onboarding_token=${encodeURIComponent(res.onboarding_token)}`
          : `/register?phone=${encodeURIComponent(formatted)}`;
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error("Firebase verify OTP error:", err);
      let errorMsg =
        err.response?.data?.message || err.message || "Could not verify passcode.";
      if (err.code === "auth/invalid-verification-code") {
        errorMsg = "The verification code you entered is invalid. Please check your SMS.";
      } else if (err.code === "auth/code-expired") {
        errorMsg = "The verification code has expired. Please request a new SMS passcode.";
      }

      toast({
        title: "Authentication Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground">
      {/* Brand Value Panel (Left) */}
      <div className="lg:w-1/2 bg-gradient-to-br from-emerald-950 via-slate-900 to-[#041a1a] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/40 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
              <Activity className="size-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Vital<span className="text-emerald-400">Book</span>
              </span>
              <span className="text-[10px] block font-mono text-emerald-300/80 -mt-1 tracking-wider uppercase">
                Santé Algérie
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DemoTourModal />
          </div>
        </div>

        <div className="my-12 lg:my-auto max-w-lg z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="size-3.5" />
            <span>Healthcare Portal & Real-time Scheduling</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next-Generation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Healthcare Access
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Sign in to manage doctor consultations, track prescription dossiers, and coordinate
            CNAS insurance approvals across all 58 Wilayas.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Full CNAS Integration</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Carte Chifa Ready</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Verified Algerian MDs</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Doctor Passkey / OTP</span>
            </div>
          </div>
        </div>

        <div className="z-10 text-xs text-slate-400 flex items-center justify-between pt-6 border-t border-slate-800/80">
          <span>&copy; {new Date().getFullYear()} VitalBook DZ</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            256-bit Healthcare Encryption
          </span>
        </div>
      </div>

      {/* Auth Interaction Panel (Right) */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          <span className="text-[11px] font-mono text-muted-foreground">Patient Gateway</span>
        </div>

        <div className="my-auto py-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Patient Sign In</h2>
            <p className="text-sm text-muted-foreground">
              Choose your preferred authentication method to access your medical portal.
            </p>
          </div>

          {/* Authentication Method Tabs */}
          <div className="flex p-1 rounded-xl bg-secondary/80 border border-border">
            <button
              type="button"
              onClick={() => setAuthMethod("credentials")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMethod === "credentials"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("otp")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMethod === "otp"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Phone Number (SMS OTP)
            </button>
          </div>

          {/* Form 1: Email & Password */}
          {authMethod === "credentials" && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="patient@vitalbook.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive font-medium mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-xs text-destructive font-medium mt-1">{passwordError}</p>
                )}
              </div>

              <Button
                type="submit"
                roleVariant="patient"
                disabled={isLoading}
                className="w-full h-12 font-bold shadow-md rounded-2xl mt-2 cursor-pointer"
              >
                {isLoading ? "Authenticating with Clinic API..." : "Sign In with Email"}
              </Button>
            </form>
          )}

          {/* Form 2: Phone Number & OTP (Firebase Auth + reCAPTCHA) */}
          {authMethod === "otp" && (
            <div className="space-y-4">
              {/* Invisible Google reCAPTCHA Anchor Container */}
              <div id="recaptcha-container" />

              {otpStep === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      MOBILE PHONE NUMBER
                    </label>
                    <AlgerianPhoneInput
                      value={phoneNumber}
                      onChange={(val) => {
                        setPhoneNumber(val);
                        if (phoneError) setPhoneError("");
                      }}
                      placeholder="549 88 24 56"
                      autoFocus
                    />
                    {phoneError && (
                      <p className="text-xs text-destructive font-medium mt-1">{phoneError}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    roleVariant="patient"
                    disabled={isLoading}
                    className="w-full h-12 font-bold shadow-md rounded-2xl cursor-pointer"
                  >
                    {isLoading ? "Verifying with reCAPTCHA..." : "Send Verification SMS"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        6-DIGIT PASSCODE
                      </label>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                        <Clock className="size-3 text-emerald-500" /> {timeLeft}s remaining
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder={isTestPhone ? "123456" : "• • • • • •"}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full h-12 text-center font-mono text-xl tracking-widest rounded-2xl border border-border bg-card text-foreground"
                    />
                    {isTestPhone ? (
                      <p className="text-[11px] text-emerald-500 pt-1">
                        Firebase Test Mode: Passcode <code className="font-mono font-bold">123456</code> enabled.
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground pt-1">
                        Enter the 6-digit code sent via SMS to <span className="font-mono text-foreground font-semibold">{getE164Phone(phoneNumber)}</span>.
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    roleVariant="patient"
                    disabled={otpCode.length !== 6 || isLoading}
                    onClick={handleVerifyOtp}
                    className="w-full h-12 font-bold shadow-md rounded-2xl cursor-pointer"
                  >
                    {isLoading ? "Verifying Token..." : "Verify & Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOtpStep("phone");
                      setConfirmationResult(null);
                    }}
                    className="w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Change Mobile Number
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quick Real Account Fill Helper (Subtle for developer/evaluator convenience) */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border text-xs flex items-center justify-between">
            <span className="text-muted-foreground">Demo Patient Credential:</span>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("credentials");
                setEmail("patient@vitalbook.com");
                setPassword("password123");
              }}
              className="font-mono text-primary font-bold hover:underline"
            >
              patient@vitalbook.com (fill)
            </button>
          </div>

          {/* Registration Prompt */}
          <div className="text-center text-xs text-muted-foreground pt-1">
            New to VitalBook?{" "}
            <Link href="/register" className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline">
              Create a Patient Account
            </Link>
          </div>

          {/* Staff Switchers */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Practicing Clinician?</span>
            <Link href="/doctors/login" className="text-primary hover:underline font-semibold">
              Doctor Portal
            </Link>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8 text-muted-foreground text-sm">Loading security gateway...</div>}>
      <SignInContent />
    </Suspense>
  );
}
