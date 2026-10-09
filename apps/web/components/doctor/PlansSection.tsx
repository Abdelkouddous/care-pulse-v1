"use client";

import React, { useState } from "react";
import {
  Layers,
  Clock,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Sliders,
  DollarSign,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ConsultationPlan {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  feeDzd: number;
  feeCents: number;
  chifaCoverage: boolean;
  coveragePercentage: number;
  isActive: boolean;
  popular?: boolean;
}

export function PlansSection() {
  const [plans, setPlans] = useState<ConsultationPlan[]>([
    {
      id: "plan-1",
      title: "Standard In-Clinic Consultation",
      description:
        "Comprehensive cardiovascular clinical examination, vitals triage, and diagnostic heart assessment.",
      durationMinutes: 30,
      feeDzd: 4000,
      feeCents: 400000,
      chifaCoverage: true,
      coveragePercentage: 100,
      isActive: true,
      popular: true,
    },
    {
      id: "plan-2",
      title: "Cardiology Follow-Up Evaluation",
      description:
        "Post-treatment review, blood pressure log normalization, and routine ECG trace follow-up.",
      durationMinutes: 20,
      feeDzd: 2500,
      feeCents: 250000,
      chifaCoverage: true,
      coveragePercentage: 100,
      isActive: true,
    },
    {
      id: "plan-3",
      title: "Urgent Same-Day Clinical Slot",
      description:
        "Priority expedited triage slot reserved for acute symptoms and immediate physician evaluation.",
      durationMinutes: 45,
      feeDzd: 5500,
      feeCents: 550000,
      chifaCoverage: false,
      coveragePercentage: 0,
      isActive: true,
    },
    {
      id: "plan-4",
      title: "Comprehensive Preventive Heart Screening",
      description:
        "Full cardiovascular risk profiling, 12-lead ECG analysis, lifestyle advisory, and exertion counseling.",
      durationMinutes: 60,
      feeDzd: 6000,
      feeCents: 600000,
      chifaCoverage: true,
      coveragePercentage: 80,
      isActive: true,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFee, setNewFee] = useState("3500");
  const [newDuration, setNewDuration] = useState("30");
  const [newChifa, setNewChifa] = useState(true);

  const handleTogglePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const nextActive = !p.isActive;
          toast({
            title: nextActive ? "Plan Activated" : "Plan Paused",
            description: `"${p.title}" is now ${nextActive ? "accepting patient bookings" : "temporarily paused"}.`,
          });
          return { ...p, isActive: nextActive };
        }
        return p;
      })
    );
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify a title for the consultation plan.",
        variant: "destructive",
      });
      return;
    }

    const feeNum = parseInt(newFee, 10) || 3000;
    const durNum = parseInt(newDuration, 10) || 30;

    const newPlan: ConsultationPlan = {
      id: `plan-${Date.now()}`,
      title: newTitle,
      description: newDesc || "Clinical evaluation and patient booking service tier.",
      durationMinutes: durNum,
      feeDzd: feeNum,
      feeCents: feeNum * 100,
      chifaCoverage: newChifa,
      coveragePercentage: newChifa ? 100 : 0,
      isActive: true,
    };

    setPlans((prev) => [...prev, newPlan]);
    setModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewFee("3500");
    setNewDuration("30");

    toast({
      title: "Consultation Plan Created",
      description: `"${newPlan.title}" has been published to your booking schedule.`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Consultation Plans & Service Tiers
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure your clinical booking packages, fee schedules, and weekly patient availability. (Bookings Only)
          </p>
        </div>

        <Button
          roleVariant="doctor"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="text-xs rounded-xl gap-2 font-bold shrink-0"
        >
          <Plus className="size-4" />
          <span>New Consultation Plan</span>
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "p-6 rounded-3xl border bg-card shadow-xs transition-all relative flex flex-col justify-between space-y-6",
              plan.isActive ? "border-border hover:border-primary/40" : "border-border/60 opacity-60 bg-secondary/20"
            )}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 right-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary text-primary-foreground shadow-xs">
                Primary Tier
              </span>
            )}

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-foreground leading-tight">
                    {plan.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="size-3.5 text-primary" />
                      {plan.durationMinutes} mins slot
                    </span>
                    <span className="text-border">·</span>
                    {plan.chifaCoverage ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ShieldCheck className="size-3.5" />
                        Chifa {plan.coveragePercentage}% Eligible
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-medium">
                        Standard Fee (No Direct Chifa)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-extrabold font-mono text-foreground block">
                    {plan.feeDzd.toLocaleString()} DZD
                  </span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Per Consultation
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Bottom Actions & Status */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={cn(
                    "font-bold",
                    plan.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                  )}
                >
                  {plan.isActive ? "Accepting Bookings" : "Paused"}
                </span>
              </div>

              <Button
                size="sm"
                roleVariant="outline"
                onClick={() => handleTogglePlan(plan.id)}
                className="text-xs rounded-xl gap-1.5"
              >
                {plan.isActive ? (
                  <>
                    <ToggleRight className="size-4 text-emerald-500" />
                    <span>Pause Plan</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="size-4 text-muted-foreground" />
                    <span>Activate Plan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Availability & Booking Hours Schedule Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Weekly Consultation Working Schedule
            </h3>
            <p className="text-xs text-muted-foreground">
              Attending physician office hours and automated slot booking window.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { day: "Monday", hours: "09:00 - 17:00", active: true },
            { day: "Tuesday", hours: "09:00 - 17:00", active: true },
            { day: "Wednesday", hours: "09:00 - 17:00", active: true },
            { day: "Thursday", hours: "09:00 - 17:00", active: true },
            { day: "Friday", hours: "09:00 - 13:00", active: true },
          ].map((item) => (
            <div
              key={item.day}
              className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{item.day}</span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs font-mono font-semibold text-primary">
                {item.hours}
              </p>
              <span className="text-[10px] text-muted-foreground block">
                30-min consultation slots
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Plan Dialog Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Create Consultation Plan
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define a new clinical booking tier and pricing schedule.
                </p>
              </div>
              <Button
                roleVariant="ghost"
                size="icon"
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-xl"
              >
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Plan Title
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Pediatric Cardiology Initial Check"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 rounded-xl bg-secondary/50 border-border text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Clinical Description
                </label>
                <Input
                  type="text"
                  placeholder="Summary of consultation scope and patient deliverables..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="h-10 rounded-xl bg-secondary/50 border-border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Consultation Fee (DZD)
                  </label>
                  <Input
                    type="number"
                    step="500"
                    placeholder="3500"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    className="h-10 rounded-xl bg-secondary/50 border-border text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Slot Duration (Minutes)
                  </label>
                  <Input
                    type="number"
                    step="5"
                    placeholder="30"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="h-10 rounded-xl bg-secondary/50 border-border text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Carte Chifa Direct Coverage
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    CNAS / CASNOS direct social security reimbursement
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setNewChifa(!newChifa)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    newChifa ? "bg-emerald-500" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                      newChifa ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  roleVariant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  roleVariant="doctor"
                  size="sm"
                  className="text-xs rounded-xl font-bold"
                >
                  Publish Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
