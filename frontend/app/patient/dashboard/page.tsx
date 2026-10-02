"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarPlus,
  Clock,
  User,
  Stethoscope,
  Pill,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  MapPin,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const { appointments, isLoading, cancelAppointment } = useAppointments();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const patientName = user?.name || "Sarah Benali";

  // Filter appointments
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "scheduled" || a.status === "pending"
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled" || a.status === "no_show"
  );

  const nextAppointment = upcomingAppointments[0];

  const handleCancel = async (id: string) => {
    if (!cancelReason.trim()) return;
    await cancelAppointment.mutateAsync({ id, reason: cancelReason });
    setCancellingId(null);
    setCancelReason("");
  };

  return (
    <AppShell role="patient" pageTitle="Patient Dashboard">
      <PageHeader
        title={`Welcome Back, ${patientName}`}
        subtitle="Track your scheduled consultations, review physician instructions, and book clinic visits."
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Active Patient
          </span>
        }
      >
        <Link href="/patient/dashboard/book">
          <Button roleVariant="patient" size="default" className="shadow-md rounded-xl gap-2">
            <CalendarPlus className="size-4" />
            <span>Book Appointment</span>
          </Button>
        </Link>
      </PageHeader>

      {/* 3 Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Upcoming Visits"
          value={upcomingAppointments.length}
          description="Confirmed consultations on schedule"
          icon={Calendar}
          variant="emerald"
        />
        <StatCard
          title="Past Consultations"
          value={pastAppointments.length}
          description="Completed clinic appointments"
          icon={Clock}
          variant="sky"
        />
        <StatCard
          title="Active Prescriptions"
          value="2"
          description="Verified medications on record"
          icon={Pill}
          variant="default"
        />
      </div>

      {/* Hero "Next Appointment" Card */}
      {isLoading ? (
        <CardSkeleton className="mb-8" />
      ) : nextAppointment ? (
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Stethoscope className="size-48" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">
                <Clock className="size-3.5" /> Next Scheduled Consultation
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {nextAppointment.doctor?.name || "Dr. Amine Mansouri"}
              </h2>

              <p className="text-emerald-100 text-sm font-medium">
                Specialty: {nextAppointment.doctor?.specialty?.name || "Cardiology Consultation"}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-emerald-50 pt-1">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
                  📅 {new Date(nextAppointment.scheduled_at).toLocaleDateString([], {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
                  <MapPin className="size-3.5" /> CarePulse Medical Center (Room 204)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/patient/dashboard/appointments">
                <Button className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold px-5">
                  Manage Booking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Grid: Upcoming Consultations & Clinical History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Consultations (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Upcoming Consultations</h2>
            <Link
              href="/patient/dashboard/appointments"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Consultations"
              description="You have no pending or scheduled appointments at the clinic right now."
              actionLabel="Book Your Consultation"
              actionHref="/patient/dashboard/book"
            />
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-base text-foreground">
                        {appt.doctor?.name || "Consulting Physician"}
                      </h3>
                      <StatusBadge status={appt.status} />
                    </div>
                    <p className="text-xs text-primary font-medium">
                      {appt.doctor?.specialty?.name || "Clinical Evaluation"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📅 {new Date(appt.scheduled_at).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      · Fee:{" "}
                      <span className="font-semibold text-foreground">
                        {((appt.consultation_fee_cents || 300000) / 100).toLocaleString()} DZD
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground/80 italic mt-1">
                      Reason: &ldquo;{appt.reason}&rdquo;
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {cancellingId === appt.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Reason for cancellation..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-border bg-secondary text-foreground"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            roleVariant="ghost"
                            onClick={() => setCancellingId(null)}
                            className="text-xs"
                          >
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            roleVariant="destructive"
                            disabled={!cancelReason.trim()}
                            onClick={() => handleCancel(appt.id)}
                            className="text-xs rounded-xl"
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        roleVariant="outline"
                        onClick={() => setCancellingId(appt.id)}
                        className="text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Medical History Timeline & Records (1 col) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Medical Records & Timeline</h2>

          <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-5">
            <div className="space-y-4">
              <div className="flex gap-3 items-start relative pb-4 border-b border-border/60">
                <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Routine Cardiovascular Exam</p>
                  <p className="text-[11px] text-muted-foreground">Dr. Amine Mansouri · Aug 15, 2026</p>
                  <p className="text-xs text-muted-foreground pt-1">
                    Normal sinus rhythm. Blood pressure normalized at 120/80 mmHg.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start relative pb-4 border-b border-border/60">
                <div className="size-8 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FileText className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Prescription Renewal</p>
                  <p className="text-[11px] text-muted-foreground">CNAS Algeria Policy DZ-9988</p>
                  <p className="text-xs text-muted-foreground pt-1">
                    Amoxicillin 500mg (Completed) · Omega-3 Cardio supplements active.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="size-8 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <AlertCircle className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Known Allergy Logged</p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    Penicillin (Severe)
                  </p>
                  <p className="text-xs text-muted-foreground pt-1">
                    Documented across all prescribing physician desks.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/patient/dashboard/profile" className="block">
              <Button roleVariant="outline" size="sm" className="w-full text-xs rounded-xl">
                View Comprehensive Health File
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
