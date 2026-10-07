"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Lock,
  Mail,
  ArrowLeft,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DemoTourModal } from "@/components/DemoTourModal";
import { authService } from "@/lib/api/auth.service";
import { toast } from "@/hooks/use-toast";
import { TokenManager } from "@/lib/auth";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await authService.doctorLogin(email.trim(), password);

      if (res?.token) {
        TokenManager.setSession(res.token, "doctor", res.user, false);

        if (typeof window !== "undefined") {
          localStorage.setItem("vitalbook_token", res.token);
          localStorage.setItem("vitalbook_token", res.token);
          localStorage.setItem("vitalbook_role", "doctor");
          localStorage.setItem("vitalbook_role", "doctor");
          localStorage.removeItem("vitalbook_demo");
          localStorage.removeItem("vitalbook_demo");
          const userStr = JSON.stringify(res.user);
          localStorage.setItem("vitalbook_user", userStr);
          localStorage.setItem("vitalbook_user", userStr);
          document.cookie = `vitalbook_token=${res.token}; path=/; max-age=86400; samesite=lax`;
          document.cookie = `vitalbook_token=${res.token}; path=/; max-age=86400; samesite=lax`;
          document.cookie = `vitalbook_role=doctor; path=/; max-age=86400; samesite=lax`;
          document.cookie = `vitalbook_role=doctor; path=/; max-age=86400; samesite=lax`;
          document.cookie = `vitalbook_demo=; path=/; max-age=0; samesite=lax`;
          document.cookie = `vitalbook_demo=; path=/; max-age=0; samesite=lax`;
        }

        toast({
          title: "Physician Access Granted",
          description: `Welcome back, ${res.user?.name || "Dr. Amine Mansouri"}.`,
        });

        router.push("/doctors/dashboard");
      } else {
        throw new Error("Missing authentication token from server.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "Invalid doctor credentials. Please check your clinical email and password.";
      setErrorMessage(message);
      toast({
        title: "Authentication Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground">
      {/* Brand & Security Panel (Left) */}
      <div className="lg:w-1/2 bg-gradient-to-br from-sky-950 via-slate-900 to-[#031d28] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/40 relative">
        <div className="flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-900/40">
              <Activity className="size-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block">VitalBook</span>
              <span className="text-[10px] text-sky-300 font-semibold tracking-wider uppercase block">
                Doctor Portal
              </span>
            </div>
          </Link>

          <Link href="/">
            <Button
              roleVariant="ghost"
              size="sm"
              className="text-sky-200 hover:text-white hover:bg-white/10 rounded-xl gap-2 text-xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back Home</span>
            </Button>
          </Link>
        </div>

        <div className="my-12 lg:my-0 space-y-6 z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <Stethoscope className="size-3.5 text-sky-400" />
            <span>Certified Physician Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Streamlined Clinical Appointments & Patient Triage.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Review your daily patient consultations, log clinical diagnostics, update appointment statuses, and maintain continuous patient follow-up care.
          </p>

          <div className="flex items-center gap-2 text-xs text-sky-300 pt-4 border-t border-white/10">
            <CheckCircle2 className="size-4 text-sky-400" />
            <span>Active Clinic: VitalBook Medical Center (Cardiology / Pediatrics / General)</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 z-10">
          Encrypted Physician Session · Medical Confidentiality Protected
        </div>
      </div>

      {/* Real Doctor Form Card (Right) */}
      <div className="lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-background">
        <div className="flex items-center justify-between mb-4">
          <DemoTourModal />
          <ThemeToggle className="size-9 rounded-xl border border-border" />
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-7">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
              Real Physician Sign-In
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Sign In to Doctor Workspace
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your clinical credentials to access your daily schedule and patients.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Clinical Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="dr.mansouri@vitalbook.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all shadow-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-600 transition-all shadow-xs"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-destructive font-medium">{errorMessage}</p>
            )}

            <Button
              type="submit"
              roleVariant="doctor"
              disabled={isLoading}
              className="w-full h-12 font-bold shadow-md rounded-xl mt-2"
            >
              {isLoading ? "Authenticating with Clinic API..." : "Open Clinical Workspace"}
            </Button>
          </form>

          {/* Quick Helper for evaluation */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">Pediatrics (Dr. Yasmine Benali):</span>
              <button
                type="button"
                onClick={() => {
                  setEmail("dr.benali@vitalbook.com");
                  setPassword("password123");
                }}
                className="font-mono text-sky-600 dark:text-sky-400 font-bold hover:underline"
              >
                dr.benali@vitalbook.com (fill)
              </button>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <span className="text-muted-foreground">Cardiology (Dr. Mansouri):</span>
              <button
                type="button"
                onClick={() => {
                  setEmail("dr.mansouri@vitalbook.com");
                  setPassword("password123");
                }}
                className="font-mono text-muted-foreground hover:text-foreground font-bold hover:underline"
              >
                dr.mansouri (fill)
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">
              ← Patient Sign-In
            </Link>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
