"use client";

import React, { useState } from "react";
import {
  Bell,
  Shield,
  CreditCard,
  User,
  KeyRound,
  CheckCircle2,
  Lock,
  Smartphone,
  Eye,
  Activity,
  Building2,
  Sliders,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function PatientSettingsPage() {
  const { user } = useAuth();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [cnasNumber, setCnasNumber] = useState("DZ-CNAS-99887711");
  const [emergencyPhone, setEmergencyPhone] = useState("+213 555 11 22 33");
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your patient preferences have been successfully updated.",
      });
    }, 600);
  };

  return (
    <AppShell role="patient" pageTitle="Patient Settings">
      <PageHeader
        title="Account & Security Settings"
        subtitle="Manage communication preferences, CNAS health insurance details, and login security."
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Account Preferences
          </span>
        }
      >
        <Button
          roleVariant="patient"
          size="default"
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="rounded-xl shadow-md text-xs font-bold"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </PageHeader>

      <div className="max-w-4xl space-y-6">
        {/* Notification Settings */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bell className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Notification Channels</h2>
              <p className="text-xs text-muted-foreground">
                Choose how you receive clinical consultation reminders and triage updates.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-foreground block">SMS Appointment Reminders</span>
                <span className="text-xs text-muted-foreground">
                  Receive SMS reminders 2 hours before your scheduled consultation.
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="size-5 rounded-md accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <span className="text-sm font-semibold text-foreground block">Digital Prescription Alerts</span>
                <span className="text-xs text-muted-foreground">
                  Email notification when your physician issues a signed clinical dossier.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="size-5 rounded-md accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* CNAS Insurance & Clinic Billing */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CreditCard className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">National Insurance & Coverage</h2>
              <p className="text-xs text-muted-foreground">
                Algerian Social Security (CNAS / CASNOS) coverage verification details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CNAS Policy Identifier
              </label>
              <input
                type="text"
                value={cnasNumber}
                onChange={(e) => setCnasNumber(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary text-foreground text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Emergency Contact Hotline
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Shield className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Login Security & Identity</h2>
              <p className="text-xs text-muted-foreground">
                Protect medical record confidentiality and patient identity access.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-foreground block">Two-Factor Passcode Verification</span>
                <span className="text-xs text-muted-foreground">
                  Require 6-digit SMS OTP verification on every new device session.
                </span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="size-5 rounded-md accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <span className="text-sm font-semibold text-foreground block">Interface Color Scheme</span>
                <span className="text-xs text-muted-foreground">
                  Switch between calm light and high-contrast dark medical themes.
                </span>
              </div>
              <ThemeToggle className="size-9 rounded-xl border border-border" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
