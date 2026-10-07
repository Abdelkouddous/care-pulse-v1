"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  Pill,
  AlertCircle,
  FileText,
  Download,
  CalendarCheck,
  Stethoscope,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [isRequestingRecords, setIsRequestingRecords] = useState(false);

  const patient = {
    name: user?.name || "Sarah Benali",
    email: user?.email || "patient@vitalbook.com",
    phone: user?.phone || "+213 555 99 88 77",
    nationalId: "DZ-CNAS-99887711",
    dateOfBirth: "April 12, 1995",
    gender: "Female",
    bloodGroup: "O+",
    address: "45 Boulevard des Martyrs, Algiers, Algeria",
    emergencyContact: "Karim Benali (+213 555 11 22 33)",
    insuranceProvider: "CNAS Algeria National Fund",
    primaryPhysician: "Dr. Amine Mansouri (Cardiology)",
    memberSince: "January 2024",
  };

  const initials = patient.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleRequestRecords = () => {
    setIsRequestingRecords(true);
    setTimeout(() => {
      setIsRequestingRecords(false);
      toast({
        title: "Medical Dossier Export Generated",
        description: "Official stamped PDF records dispatched to your email address.",
      });
    }, 1200);
  };

  return (
    <AppShell role="patient" pageTitle="Health Profile">
      <PageHeader
        title="Comprehensive Health File"
        subtitle="Manage verified identity records, medical history, allergies, and active clinical prescriptions."
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            CNAS Verified
          </span>
        }
      >
        <Button
          roleVariant="outline"
          onClick={handleRequestRecords}
          disabled={isRequestingRecords}
          className="gap-2 rounded-xl text-xs"
        >
          <Download className="size-3.5" />
          <span>{isRequestingRecords ? "Exporting Dossier..." : "Request Official Records"}</span>
        </Button>
      </PageHeader>

      {/* Balanced 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Patient Identity & Primary Details Card (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-6">
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-border">
              <Avatar className="size-20 rounded-2xl border-2 border-primary/20 shadow-md">
                <AvatarFallback className="bg-primary/10 text-primary font-extrabold text-2xl rounded-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-extrabold text-foreground">{patient.name}</h2>
                <span className="text-xs text-primary font-semibold block">{patient.nationalId}</span>
                <span className="text-[11px] text-muted-foreground">Member since {patient.memberSince}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Phone className="size-3.5" /> Phone
                </span>
                <span className="font-semibold text-foreground">{patient.phone}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="size-3.5" /> Email
                </span>
                <span className="font-semibold text-foreground truncate max-w-[160px]">{patient.email}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Heart className="size-3.5 text-rose-500" /> Blood Group
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{patient.bloodGroup}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Shield className="size-3.5" /> Insurance
                </span>
                <span className="font-semibold text-foreground">{patient.insuranceProvider}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Stethoscope className="size-3.5" /> Primary Physician
                </span>
                <span className="font-semibold text-foreground">{patient.primaryPhysician}</span>
              </div>

              <div className="pt-2">
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Residential Address
                </span>
                <p className="text-xs text-foreground font-medium flex items-start gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  {patient.address}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold mb-1">
                  Emergency Contact
                </span>
                <p className="text-xs text-foreground font-semibold">
                  {patient.emergencyContact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clinical Tabs & Health Records (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Health Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">
                Total Visits
              </span>
              <span className="text-2xl font-extrabold text-foreground mt-1 block">5</span>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">
                Active Rx
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">2</span>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">
                Allergies Logged
              </span>
              <span className="text-2xl font-extrabold text-rose-500 mt-1 block">1</span>
            </div>
          </div>

          {/* Active Medications & Allergies Block */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-5">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Pill className="size-4 text-primary" /> Active Prescription Regimen
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border/80 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">CardioPlus 75mg</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-muted-foreground">1 tablet daily post breakfast</p>
                <p className="text-[10px] text-muted-foreground pt-1">Evaluated by Dr. Amine Mansouri</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border/80 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">Omega-3 EPA 1000mg</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Supplement
                  </span>
                </div>
                <p className="text-muted-foreground">1 capsule daily with water</p>
                <p className="text-[10px] text-muted-foreground pt-1">Cardiovascular preventive support</p>
              </div>
            </div>

            {/* Allergies Alert */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 dark:bg-rose-950/20 dark:border-rose-900/40 flex items-start gap-3">
              <AlertCircle className="size-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-rose-800 dark:text-rose-300 block">
                  Critical Drug Allergy: Penicillin & Beta-Lactam Antibiotics
                </span>
                <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-0.5">
                  Severity: High. Manifests as severe dermal hives and respiratory distress. Contraindicated across all prescriptions.
                </p>
              </div>
            </div>
          </div>

          {/* Clinical History Timeline */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Verified Consultation History
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 pb-3 border-b border-border/60">
                <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Cardiovascular Wellness Evaluation</span>
                    <span className="text-[11px] text-muted-foreground">Aug 15, 2026</span>
                  </div>
                  <p className="text-muted-foreground">Dr. Amine Mansouri · VitalBook Medical Center</p>
                  <p className="text-foreground/90 pt-1">
                    Electrocardiogram (ECG) normal. Blood pressure reading: 120/80 mmHg. Continued preventative regimen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-8 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FileText className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Annual Health Screening & Lab Panel</span>
                    <span className="text-[11px] text-muted-foreground">Feb 10, 2026</span>
                  </div>
                  <p className="text-muted-foreground">Dr. Hardik Sharma · General Medicine</p>
                  <p className="text-foreground/90 pt-1">
                    Comprehensive metabolic panel, lipid profile, and CBC within normal reference ranges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
