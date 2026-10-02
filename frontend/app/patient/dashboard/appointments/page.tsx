"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarPlus,
  Clock,
  User,
  Stethoscope,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppointments } from "@/hooks/useAppointments";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function MyAppointmentsPage() {
  const { appointments, isLoading, cancelAppointment } = useAppointments();
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past" | "cancelled">("all");
  const [targetCancelId, setTargetCancelId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Categorize appointments
  const upcomingList = appointments.filter(
    (a) => a.status === "scheduled" || a.status === "pending"
  );
  const pastList = appointments.filter(
    (a) => a.status === "completed" || a.status === "no_show"
  );
  const cancelledList = appointments.filter((a) => a.status === "cancelled");

  const displayedList =
    activeTab === "upcoming"
      ? upcomingList
      : activeTab === "past"
      ? pastList
      : activeTab === "cancelled"
      ? cancelledList
      : appointments;

  const handleConfirmCancel = async () => {
    if (!targetCancelId) return;
    setIsCancelling(true);

    try {
      await cancelAppointment.mutateAsync({
        id: targetCancelId,
        reason: cancellationReason || "Patient requested cancellation",
      });

      toast({
        title: "Appointment Cancelled",
        description: "Your consultation has been marked as cancelled.",
      });
      setTargetCancelId(null);
      setCancellationReason("");
    } catch (err: any) {
      toast({
        title: "Cancellation Error",
        description: "Could not cancel appointment. Please contact the clinic desk.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AppShell role="patient" pageTitle="My Appointments">
      <PageHeader
        title="Consultation Schedule & History"
        subtitle="Manage upcoming clinical visits, review consultation history, and cancel or reschedule bookings."
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {upcomingList.length} Active
          </span>
        }
      >
        <Link href="/patient/dashboard/book">
          <Button roleVariant="patient" size="default" className="shadow-md rounded-xl gap-2">
            <CalendarPlus className="size-4" />
            <span>Book New Appointment</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Tabs Filter Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex gap-2">
          {[
            { id: "all", label: "All Bookings", count: appointments.length },
            { id: "upcoming", label: "Upcoming", count: upcomingList.length },
            { id: "past", label: "Past Visits", count: pastList.length },
            { id: "cancelled", label: "Cancelled", count: cancelledList.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px]",
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-card text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards / Table */}
      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : displayedList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={
            activeTab === "upcoming"
              ? "No Upcoming Appointments"
              : activeTab === "past"
              ? "No Past Consultations"
              : activeTab === "cancelled"
              ? "No Cancelled Appointments"
              : "No Appointments Found"
          }
          description="Book your next consultation with one of our specialized clinic physicians."
          actionLabel="Book Your First Consultation"
          actionHref="/patient/dashboard/book"
        />
      ) : (
        <div className="grid gap-4">
          {displayedList.map((appt) => (
            <div
              key={appt.id}
              className="p-6 rounded-3xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all flex flex-col md:flex-row justify-between md:items-center gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="size-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-base text-foreground">
                      {appt.doctor?.name || "Dr. Amine Mansouri"}
                    </h3>
                    <StatusBadge status={appt.status} />
                  </div>

                  <p className="text-xs text-primary font-semibold">
                    {appt.doctor?.specialty?.name || "Cardiology"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      📅 {new Date(appt.scheduled_at).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <span>·</span>
                    <span>
                      Fee:{" "}
                      <span className="font-bold text-foreground">
                        {((appt.consultation_fee_cents || 300000) / 100).toLocaleString()} DZD
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground/90 italic pt-1">
                    &ldquo;{appt.reason}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                {appt.status !== "cancelled" && appt.status !== "completed" && (
                  <Button
                    size="sm"
                    roleVariant="outline"
                    onClick={() => setTargetCancelId(appt.id)}
                    className="text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    Cancel Booking
                  </Button>
                )}

                <Link href={`/patient/dashboard/book?doctorId=${appt.doctor_id || ""}`}>
                  <Button
                    size="sm"
                    roleVariant="secondary"
                    className="text-xs rounded-xl"
                  >
                    Book Follow-Up
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Cancellation */}
      <AlertDialog open={!!targetCancelId} onOpenChange={() => setTargetCancelId(null)}>
        <AlertDialogContent className="rounded-3xl p-6">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" /> Confirm Cancellation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Are you sure you want to cancel this consultation? This slot will immediately be made available to other patients.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-3">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Reason for Cancellation (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Schedule conflict, feeling better..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl text-xs">Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl text-xs"
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
