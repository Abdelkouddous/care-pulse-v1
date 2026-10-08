"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  Stethoscope,
  ArrowRight,
  Activity,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { TokenManager } from "@/lib/auth";
import { authService } from "@/lib/api/auth.service";
import { MOCK_PATIENT, MOCK_DOCTOR } from "@/mocks/data";

interface DemoTourModalProps {
  variant?: "button" | "banner" | "outline";
  className?: string;
}

export function DemoTourModal({ variant = "button", className }: DemoTourModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLaunchRole = async (role: "patient" | "doctor") => {
    setOpen(false);

    try {
      if (role === "patient") {
        const session = await authService.login(MOCK_PATIENT.email, "password123");
        TokenManager.setSession(session.token, "patient", session.user, true);
        localStorage.setItem("vitalbook_token", session.token);
        localStorage.setItem("vitalbook_token", session.token);
        localStorage.setItem("vitalbook_role", "patient");
        localStorage.setItem("vitalbook_role", "patient");
        localStorage.setItem("vitalbook_demo", "true");
        localStorage.setItem("vitalbook_demo", "true");
        const userStr = JSON.stringify(session.user);
        localStorage.setItem("vitalbook_user", userStr);
        localStorage.setItem("vitalbook_user", userStr);
        document.cookie = `vitalbook_token=${session.token}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_token=${session.token}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_role=patient; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_role=patient; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_demo=true; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_demo=true; path=/; max-age=86400; samesite=lax`;

        toast({
          title: "Demo Patient Connected",
          description: `Logged in as ${session.user.name || MOCK_PATIENT.name}. Ready to book consultations.`,
        });
        router.push("/patient/dashboard");
      } else if (role === "doctor") {
        const session = await authService.doctorLogin(MOCK_DOCTOR.email, "password123");
        TokenManager.setSession(session.token, "doctor", session.user, true);
        localStorage.setItem("vitalbook_token", session.token);
        localStorage.setItem("vitalbook_token", session.token);
        localStorage.setItem("vitalbook_role", "doctor");
        localStorage.setItem("vitalbook_role", "doctor");
        localStorage.setItem("vitalbook_demo", "true");
        localStorage.setItem("vitalbook_demo", "true");
        const docUserStr = JSON.stringify(session.user);
        localStorage.setItem("vitalbook_user", docUserStr);
        localStorage.setItem("vitalbook_user", docUserStr);
        document.cookie = `vitalbook_token=${session.token}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_token=${session.token}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_role=doctor; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_role=doctor; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_demo=true; path=/; max-age=86400; samesite=lax`;
        document.cookie = `vitalbook_demo=true; path=/; max-age=86400; samesite=lax`;

        toast({
          title: "Demo Physician Connected",
          description: `Logged in as ${MOCK_DOCTOR.name} (${MOCK_DOCTOR.specialty?.name || "Cardiology"}). Inspecting live queue.`,
        });
        router.push("/doctors/dashboard");
      }
    } catch (err: any) {
      console.error(`Demo authentication failed for ${role}:`, err);
      toast({
        title: "Demo Authentication Error",
        description: err.response?.data?.message || "Could not authenticate with live backend.",
        variant: "destructive",
      });
      // Fallback redirect to dedicated demo login page
      router.push("/demo/login");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "banner" ? (
          <button
            type="button"
            className="w-full group p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-left transition-all flex items-center justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="size-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Interactive MVP Tour
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Evaluate VitalBook across Patient & Doctor roles in 1 click
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Sandbox</span>
              <ArrowRight className="size-4" />
            </div>
          </button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className={className || "rounded-xl gap-2 font-bold text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"}
          >
            <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>MVP Demo Sandbox</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl p-6 sm:p-8 rounded-3xl border border-border shadow-2xl">
        <DialogHeader className="space-y-2 text-left pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Instant MVP Tour
            </span>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-foreground">
            VitalBook Sandbox Environment
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Experience role-based clinical scheduling workflows in 1 click without manual registration.
          </DialogDescription>
        </DialogHeader>

        {/* 3 Role Sandbox Cards */}
        <div className="grid gap-3.5 pt-4">
          {/* Patient Card */}
          <Card
            onClick={() => handleLaunchRole("patient")}
            className="p-4 rounded-2xl border border-border hover:border-emerald-500 bg-card hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 cursor-pointer transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <User className="size-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">Patient Experience</h3>
                  <span className="text-[10px] font-semibold text-emerald-600 px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                    Sarah Benali
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  Scheduled visits, 4-step booking wizard, CNAS health profile & allergies.
                </p>
              </div>
            </div>

            <Button
              roleVariant="patient"
              size="sm"
              className="rounded-xl text-xs font-bold gap-1.5 shrink-0"
            >
              <span>Launch Patient</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Card>

          {/* Doctor Card */}
          <Card
            onClick={() => handleLaunchRole("doctor")}
            className="p-4 rounded-2xl border border-border hover:border-sky-500 bg-card hover:bg-sky-50/20 dark:hover:bg-sky-950/10 cursor-pointer transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center shrink-0">
                <Stethoscope className="size-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">Physician Workspace</h3>
                  <span className="text-[10px] font-semibold text-sky-600 px-2 py-0.2 rounded-full bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800">
                    Dr. Amine Mansouri (Cardiology)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  Today&apos;s consultation schedule, patient queue triage, and clinical status updates.
                </p>
              </div>
            </div>

            <Button
              roleVariant="doctor"
              size="sm"
              className="rounded-xl text-xs font-bold gap-1.5 shrink-0"
            >
              <span>Launch Doctor</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Card>
        </div>

        <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              router.push("/demo/login");
            }}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Open Dedicated Demo Gateway →
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              router.push("/login");
            }}
            className="text-xs text-slate-500 font-semibold hover:underline"
          >
            Real Account Sign In →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DemoTourModal;
