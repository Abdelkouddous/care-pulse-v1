"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Shield,
  HeartPulse,
  AlertCircle,
  FileCheck,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { registerPatient } from "@/lib/actions/patient.actions";
import { TokenManager } from "@/lib/auth";
import { useDoctorsList } from "@/hooks/useDoctors";

interface StepItem {
  num: number;
  label: string;
  sub: string;
}

const WIZARD_STEPS: StepItem[] = [
  { num: 1, label: "Identity & Access", sub: "Personal credentials" },
  { num: 2, label: "Clinical & Insurance", sub: "CNAS & health data" },
  { num: 3, label: "Emergency & Consent", sub: "Legal agreements" },
];

export default function RegisterForm({ user }: { user?: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "";
  const { data: doctorsData } = useDoctorsList();
  const availableDoctors = doctorsData?.doctors && doctorsData.doctors.length > 0
    ? doctorsData.doctors
    : [];

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    firstName: user?.name ? user.name.split(" ")[0] : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
    email: user?.email || "",
    phone: phoneParam || user?.phone || "+213 ",
    password: "",
    confirmPassword: "",

    // Step 2
    dateOfBirth: "1995-06-15",
    gender: "male",
    address: "Algiers, Algeria",
    insuranceProvider: "CNAS",
    insurancePolicyNumber: "DZ-CNAS-",
    primaryPhysician: "Dr. Amine Mansouri",

    // Step 3
    emergencyContactName: "",
    emergencyContactPhone: "+213 ",
    allergies: "None",
    currentMedications: "None",
    treatmentConsent: true,
    privacyConsent: true,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "Valid email address is required.";
    }
    if (formData.phone.trim().length < 9) {
      errors.phone = "Valid phone number is required (e.g. +213 555 99 88 77).";
    }
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
    if (!formData.address.trim()) errors.address = "Residential address is required.";
    if (!formData.insurancePolicyNumber.trim()) {
      errors.insurancePolicyNumber = "Insurance / CNAS card number is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.emergencyContactName.trim()) {
      errors.emergencyContactName = "Emergency contact name is required.";
    }
    if (formData.emergencyContactPhone.trim().length < 9) {
      errors.emergencyContactPhone = "Valid emergency phone number is required.";
    }
    if (!formData.privacyConsent) {
      errors.privacyConsent = "You must acknowledge and accept the privacy policy.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        insurance_provider: formData.insuranceProvider,
        insurance_policy_number: formData.insurancePolicyNumber,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        allergies: formData.allergies,
        current_medications: formData.currentMedications,
        primaryPhysician: formData.primaryPhysician,
      };

      const result = await registerPatient(payload);

      if (result) {
        if (result.token) {
          TokenManager.setSession(result.token, "patient", result.user);
          localStorage.setItem("vitalbook_token", result.token);
          localStorage.setItem("carepulse_token", result.token);
          localStorage.setItem("vitalbook_role", "patient");
          localStorage.setItem("carepulse_role", "patient");
        }
        if (result.user || result.$id) {
          const userStr = JSON.stringify(result.user || { name: payload.name, email: payload.email, role: "patient" });
          localStorage.setItem("vitalbook_user", userStr);
          localStorage.setItem("carepulse_user", userStr);
        }

        toast({
          title: "Registration Successful! 🎉",
          description: `Welcome to VitalBook, ${formData.firstName}!`,
        });

        setCurrentStep(4); // Success step
      }
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err?.response?.data?.message || "An error occurred during account creation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {/* ======================================================================= */}
      {/* 3-STEP WIZARD PROGRESS BAR */}
      {/* ======================================================================= */}
      {currentStep <= 3 && (
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-300 -z-0"
              style={{
                width: `${((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100}%`,
              }}
            />

            {WIZARD_STEPS.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                      isDone
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isCurrent
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-md"
                        : "bg-card text-muted-foreground border border-border"
                    )}
                  >
                    {isDone ? <CheckCircle2 className="size-5" /> : s.num}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold mt-2 hidden sm:block",
                      isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">
                    {s.sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* STEP 1: IDENTITY & ACCESS */}
      {/* ======================================================================= */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Step 1: Patient Identity & Credentials</h2>
              <p className="text-xs text-muted-foreground">Create your clinical access account and verify your identity.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="Sarah"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={cn(
                    "w-full h-11 px-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                    fieldErrors.firstName ? "border-red-500" : "border-border"
                  )}
                />
                {fieldErrors.firstName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Benali"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={cn(
                    "w-full h-11 px-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                    fieldErrors.lastName ? "border-red-500" : "border-border"
                  )}
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="sarah.benali@example.dz"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={cn(
                    "w-full h-11 pl-10 pr-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                    fieldErrors.email ? "border-red-500" : "border-border"
                  )}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Mobile Phone (Algeria) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="+213 555 99 88 77"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={cn(
                    "w-full h-11 pl-10 pr-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                    fieldErrors.phone ? "border-red-500" : "border-border"
                  )}
                />
              </div>
              {fieldErrors.phone && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.phone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password (min 8 chars) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className={cn(
                      "w-full h-11 pl-10 pr-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                      fieldErrors.password ? "border-red-500" : "border-border"
                    )}
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className={cn(
                      "w-full h-11 pl-10 pr-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                      fieldErrors.confirmPassword ? "border-red-500" : "border-border"
                    )}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground">
              Already have an account? <span className="text-emerald-500 font-bold underline">Sign In</span>
            </Link>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 font-bold shadow-sm"
            >
              Continue to Step 2 <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* STEP 2: CLINICAL & INSURANCE */}
      {/* ======================================================================= */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <HeartPulse className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Step 2: Medical Profile & CNAS Insurance</h2>
              <p className="text-xs text-muted-foreground">Provide demographic details and healthcare coverage.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Residential Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="45 Boulevard des Martyrs, Algiers, Algeria"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Insurance Provider
                </label>
                <select
                  value={formData.insuranceProvider}
                  onChange={(e) => updateField("insuranceProvider", e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="CNAS">CNAS (Caisse Nationale des Assurances Sociales)</option>
                  <option value="CASNOS">CASNOS (Non-Salariés)</option>
                  <option value="Mutuelle">Mutuelle d&apos;Assurance Privée</option>
                  <option value="Self-Pay">Self-Pay / Non-Assuré</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Card / Policy Number *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="DZ-CNAS-99887711"
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => updateField("insurancePolicyNumber", e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Preferred Primary Physician
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <select
                  value={formData.primaryPhysician}
                  onChange={(e) => updateField("primaryPhysician", e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {availableDoctors.length > 0 ? (
                    availableDoctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} - {doc.specialty?.name || "General Medicine"}
                      </option>
                    ))
                  ) : (
                    <option value="Dr. Amine Mansouri">Dr. Amine Mansouri - Cardiology</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="rounded-xl px-5 h-11"
            >
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 font-bold shadow-sm"
            >
              Continue to Step 3 <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* STEP 3: EMERGENCY CONTACT & CONSENT */}
      {/* ======================================================================= */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FileCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Step 3: Emergency Contact & Legal Consent</h2>
              <p className="text-xs text-muted-foreground">Emergency contacts and clinical privacy authorizations.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  placeholder="Karim Benali (Spouse / Guardian)"
                  value={formData.emergencyContactName}
                  onChange={(e) => updateField("emergencyContactName", e.target.value)}
                  className={cn(
                    "w-full h-11 px-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                    fieldErrors.emergencyContactName ? "border-red-500" : "border-border"
                  )}
                />
                {fieldErrors.emergencyContactName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.emergencyContactName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  placeholder="+213 555 11 22 33"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                  className={cn(
                    "w-full h-11 px-3.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none",
                    fieldErrors.emergencyContactPhone ? "border-red-500" : "border-border"
                  )}
                />
                {fieldErrors.emergencyContactPhone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.emergencyContactPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Known Allergies
                </label>
                <input
                  type="text"
                  placeholder="Penicillin, Peanuts, None..."
                  value={formData.allergies}
                  onChange={(e) => updateField("allergies", e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Current Medications
                </label>
                <input
                  type="text"
                  placeholder="Aspirin, Insulin, None..."
                  value={formData.currentMedications}
                  onChange={(e) => updateField("currentMedications", e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Consents */}
            <div className="space-y-3 pt-3 border-t border-border">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.treatmentConsent}
                  onChange={(e) => updateField("treatmentConsent", e.target.checked)}
                  className="mt-1 size-4 rounded text-emerald-600 focus:ring-emerald-500 border-border"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I consent to receive healthcare consultations and clinical triage through the VitalBook medical network.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) => updateField("privacyConsent", e.target.checked)}
                  className="mt-1 size-4 rounded text-emerald-600 focus:ring-emerald-500 border-border"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the electronic processing of my medical records in compliance with CNAS, HIPAA, and GDPR standards. *
                </span>
              </label>
              {fieldErrors.privacyConsent && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.privacyConsent}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="rounded-xl px-5 h-11"
            >
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-11 font-bold shadow-md cursor-pointer"
            >
              {isSubmitting ? "Creating Account..." : "Complete Registration"}
            </Button>
          </div>
        </form>
      )}

      {/* ======================================================================= */}
      {/* STEP 4: SUCCESS CONFIRMATION */}
      {/* ======================================================================= */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center shadow-lg animate-in fade-in zoom-in-95 duration-300">
          <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10 text-emerald-500 animate-bounce" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider mb-2">
            Registration Completed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
            Welcome to VitalBook, {formData.firstName}!
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
            Your patient record and CNAS policy ({formData.insurancePolicyNumber}) have been securely registered. Your session is active.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/appointments/new">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-12 font-bold shadow-md cursor-pointer">
                Book First Consultation <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/dashboard/patients/me/profile">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl px-6 h-12 font-bold cursor-pointer">
                View Health Profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
