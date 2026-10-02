"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  Award,
  Stethoscope,
  HeartPulse,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_DOCTOR } from "@/mocks/data/doctor.mock";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(MOCK_DOCTOR.name);
  const [specialty, setSpecialty] = useState(MOCK_DOCTOR.specialty?.name || "Cardiology");
  const [email, setEmail] = useState(MOCK_DOCTOR.email);
  const [phone, setPhone] = useState(MOCK_DOCTOR.phone);
  const [license, setLicense] = useState(MOCK_DOCTOR.license_number);
  const [bio, setBio] = useState(MOCK_DOCTOR.bio);
  const [feeDzd, setFeeDzd] = useState((MOCK_DOCTOR.consultation_fee_cents / 100).toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Physician credentials and clinical details saved successfully.",
    });
  };

  const doctorInitials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="size-20 sm:size-24 rounded-3xl border-2 border-primary/20 shadow-md">
              <AvatarImage src={MOCK_DOCTOR.avatar_url} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">
                {doctorInitials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  {name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  Attending Specialist
                </span>
              </div>
              <p className="text-xs sm:text-sm text-primary font-semibold">
                Department of {specialty} · CarePulse Medical Center
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-0.5">
                <Building2 className="size-3.5 text-muted-foreground" />
                <span>Clinique El Azhar · 12 Rue Didouche Mourad, Alger</span>
              </div>
            </div>
          </div>

          <Button
            roleVariant="doctor"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs rounded-xl font-bold self-start sm:self-center"
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* 4 Quick Stat KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Consultations</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <span className="text-2xl font-black text-foreground font-mono">48</span>
          <p className="text-[11px] text-muted-foreground">Completed bookings</p>
        </div>

        <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Standard Fee</span>
            <Stethoscope className="size-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-foreground font-mono">
            {parseInt(feeDzd, 10).toLocaleString()} DZD
          </span>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% CNAS Chifa Eligible
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Active Plans</span>
            <HeartPulse className="size-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-foreground font-mono">4 Tiers</span>
          <p className="text-[11px] text-muted-foreground">Clinical service tiers</p>
        </div>

        <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Weekly Window</span>
            <Clock className="size-4 text-sky-500" />
          </div>
          <span className="text-2xl font-black text-foreground font-mono">Mon – Fri</span>
          <p className="text-[11px] text-muted-foreground">09:00 - 17:00 (30m slots)</p>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form / Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Award className="size-4 text-primary" />
              <h3 className="text-base font-bold text-foreground">
                Clinical Credentials & Identity
              </h3>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Full Practitioner Name
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/50 border-border text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Medical Specialty
                    </label>
                    <Input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/50 border-border text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/50 border-border text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/50 border-border text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      MSPRH License Registration
                    </label>
                    <Input
                      type="text"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/50 border-border text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Standard Consultation Fee (DZD)
                    </label>
                    <Input
                      type="number"
                      step="500"
                      value={feeDzd}
                      onChange={(e) => setFeeDzd(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/50 border-border text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Physician Bio & Scope of Practice
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    roleVariant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    roleVariant="doctor"
                    size="sm"
                    className="text-xs rounded-xl font-bold gap-1.5"
                  >
                    <Save className="size-3.5" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Email Address
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-foreground mt-0.5">
                      <Mail className="size-3.5 text-muted-foreground" />
                      <span>{email}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Phone Number
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-foreground mt-0.5">
                      <Phone className="size-3.5 text-muted-foreground" />
                      <span>{phone}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Algerian MSPRH License
                    </span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-foreground mt-0.5">
                      <ShieldCheck className="size-3.5 text-emerald-500" />
                      <span>{license}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      CNAS Provider Status
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <CheckCircle2 className="size-3.5" />
                      <span>Verified & Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Clinical Biography & Specializations
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Accreditation & Working Policy */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>National Health Affiliation</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dr. Amine Mansouri is officially certified under the Algerian Ministry of Health (MSPRH) and recognized for direct Carte Chifa electronic reimbursement through CNAS and CASNOS.
            </p>
            <div className="pt-2 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wilaya District:</span>
                <span className="font-semibold text-foreground">16 - Alger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consultation Model:</span>
                <span className="font-semibold text-foreground">In-Clinic Bookings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prescription Policy:</span>
                <span className="font-semibold text-foreground">Bookings Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
