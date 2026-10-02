"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Stethoscope,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  Clock,
  MapPin,
  Building2,
  ChevronRight,
  ExternalLink,
  Shield,
  CreditCard,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authService } from "@/lib/api/auth.service";
import { TokenManager } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { MOCK_PATIENT, MOCK_DOCTOR } from "@/mocks/data";

export default function DemoLoginPage() {
  const router = useRouter();
  const [activeLoadingRole, setActiveLoadingRole] = useState<string | null>(null);

  /**
   * Authentic Demo Authentication Handshake
   * Dispatches real API requests to Laravel Sanctum endpoints:
   * - Patient: POST /api/v1/auth/login
   * - Doctor:  POST /api/v1/auth/doctor/login
   * Sets authentic Bearer token in TokenManager, enabling live end-to-end appointment creation & triage.
   */
  const handleLiveDemoLogin = async (role: "patient" | "doctor") => {
    setActiveLoadingRole(role);

    try {
      if (role === "patient") {
        const session = await authService.login(MOCK_PATIENT.email, "password123");
        TokenManager.setSession(session.token, "patient");
        localStorage.setItem("carepulse_token", session.token);
        localStorage.setItem("carepulse_role", "patient");
        localStorage.setItem("carepulse_demo", "true");
        localStorage.setItem("carepulse_user", JSON.stringify(session.user));
        document.cookie = `carepulse_token=${session.token}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `carepulse_role=patient; path=/; max-age=86400; samesite=lax`;
        document.cookie = `carepulse_demo=true; path=/; max-age=86400; samesite=lax`;

        toast({
          title: "Connected as Mock Patient",
          description: `Welcome ${session.user.name || MOCK_PATIENT.name}! You can now book a real appointment.`,
        });

        router.push("/patient/dashboard");
      } else if (role === "doctor") {
        const session = await authService.doctorLogin(MOCK_DOCTOR.email, "password123");
        TokenManager.setSession(session.token, "doctor");
        localStorage.setItem("carepulse_token", session.token);
        localStorage.setItem("carepulse_role", "doctor");
        localStorage.setItem("carepulse_demo", "true");
        localStorage.setItem("carepulse_user", JSON.stringify(session.user));
        document.cookie = `carepulse_token=${session.token}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `carepulse_role=doctor; path=/; max-age=86400; samesite=lax`;
        document.cookie = `carepulse_demo=true; path=/; max-age=86400; samesite=lax`;

        toast({
          title: "Connected as Attending Doctor",
          description: `Logged in as ${MOCK_DOCTOR.name} (${MOCK_DOCTOR.specialty?.name || "Cardiology"}). Inspecting live consultation queue.`,
        });

        router.push("/doctors/dashboard");
      }
    } catch (err: any) {
      console.error(`Live demo login failed for ${role}:`, err);
      toast({
        title: "Demo Authentication Failed",
        description: err.response?.data?.message || "Could not authenticate live demo user with backend.",
        variant: "destructive",
      });
    } finally {
      setActiveLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/70 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Demo Header */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/favicon.svg" alt="CarePulse Logo" width={34} height={34} priority />
              <span className="font-extrabold text-lg tracking-tight">
                Care<span className="font-light text-emerald-600 dark:text-emerald-400">Pulse</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Interactive Demo Sandbox
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1.5 rounded-xl">
                <ArrowLeft className="size-3.5" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <ThemeToggle className="size-9 rounded-xl border border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>End-to-End Live System Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Experience the Complete <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Clinical Scheduling Ecosystem
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Unlike static prototypes, this sandbox executes against our live PostgreSQL database with real
            Laravel Sanctum authentication. Book an appointment as the mock patient, and immediately observe
            the attending physician receive it in real time.
          </p>
        </div>

        {/* 2-Step Live System Flow Guide */}
        <div className="mb-10 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              The Real-Time Consultation Flow (How It Works)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
              <div className="size-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Mock Patient Books</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Log in as Sarah Benali, pick a date & doctor slot (e.g. Dr. Amine Mansouri), and submit a live booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
              <div className="size-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Attending Doctor Triage</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Switch to Dr. Amine Mansouri. Notice Sarah&apos;s newly booked consultation is immediately visible on his clinic queue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Card 1: Mock Patient */}
          <Card className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-white/80 dark:bg-slate-900/90 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />

            <div>
              <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                    <User className="size-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Role: Patient
                  </span>
                </div>

                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{MOCK_PATIENT.name}</span>
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified Algerian Patient (CNAS & Chifa Card Active)
                </p>
              </CardHeader>

              <CardContent className="px-6 space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Account:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{MOCK_PATIENT.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-semibold">{MOCK_PATIENT.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Biometric NIN:</span>
                    <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {(MOCK_PATIENT as any).national_id || "119951600000123456"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Carte Chifa:</span>
                    <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {(MOCK_PATIENT as any).chifa_number || "9504121234"} (Wilaya 16)
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Available Actions:</span>
                  <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span>Browse specialist directory with live DZD pricing</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span>Execute 4-step wizard to book a guaranteed appointment</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span>Review past appointments and clinical instructions</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </div>

            <div className="p-6 pt-0">
              <Button
                type="button"
                roleVariant="patient"
                size="lg"
                disabled={activeLoadingRole !== null}
                onClick={() => handleLiveDemoLogin("patient")}
                className="w-full rounded-2xl font-bold shadow-md gap-2"
              >
                {activeLoadingRole === "patient" ? (
                  <span>Authenticating Mock Patient...</span>
                ) : (
                  <>
                    <span>Sign In as Mock Patient</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Card 2: Attending Doctor */}
          <Card className="relative overflow-hidden rounded-3xl border-2 border-sky-500/40 bg-white/80 dark:bg-slate-900/90 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -mr-10 -mt-10" />

            <div>
              <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="size-12 rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center shadow-xs">
                    <Stethoscope className="size-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                    Role: Physician
                  </span>
                </div>

                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{MOCK_DOCTOR.name}</span>
                  <span className="size-2 rounded-full bg-sky-500 animate-pulse" />
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cardiologist • Algiers (Clinic License {MOCK_DOCTOR.license_number})
                </p>
              </CardHeader>

              <CardContent className="px-6 space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Account:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{MOCK_DOCTOR.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Specialty:</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">{MOCK_DOCTOR.specialty?.name || "Cardiology"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Consultation Fee:</span>
                    <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                      {Math.round(MOCK_DOCTOR.consultation_fee_cents / 100).toLocaleString()} DZD ({MOCK_DOCTOR.consultation_fee_cents.toLocaleString()} cts)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Clinic:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      12 Rue Didouche, Alger
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Available Actions:</span>
                  <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-sky-500 shrink-0" />
                      <span>Inspect patient appointments booked in real time</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-sky-500 shrink-0" />
                      <span>Accept, triage, reschedule, or cancel consultations</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-sky-500 shrink-0" />
                      <span>Manage working hours & 30-min slot intervals</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </div>

            <div className="p-6 pt-0">
              <Button
                type="button"
                roleVariant="doctor"
                size="lg"
                disabled={activeLoadingRole !== null}
                onClick={() => handleLiveDemoLogin("doctor")}
                className="w-full rounded-2xl font-bold shadow-md gap-2"
              >
                {activeLoadingRole === "doctor" ? (
                  <span>Authenticating Physician...</span>
                ) : (
                  <>
                    <span>Sign In as Attending Doctor</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Bottom Callout: Real Accounts */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Want to test with your own phone number or credentials?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can register a brand new Algerian patient profile with OTP phone verification.
            </p>
          </div>
          <Link href="/login">
            <Button variant="outline" className="rounded-xl text-xs font-bold gap-2">
              <span>Go to Real Account Login</span>
              <ChevronRight className="size-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        CarePulse™ Health System Architecture • Built strictly with Integer Money Guard & UUIDv4 Entity Modeling.
      </footer>
    </div>
  );
}
