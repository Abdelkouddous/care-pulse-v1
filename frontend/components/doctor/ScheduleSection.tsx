"use client";

import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Sliders,
  Users,
  Activity,
  DoorOpen,
  DoorClosed,
  ChevronRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ScheduleSectionProps {
  appointments: any[];
  isLoading: boolean;
  dailyCapacityQuota: number;
  setDailyCapacityQuota: React.Dispatch<React.SetStateAction<number>>;
  acceptingWalkIns: boolean;
  setAcceptingWalkIns: (val: boolean) => void;
  triageActionId: string | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onNavigateToSection?: (section: "schedule" | "appointments" | "patients" | "plans") => void;
}

export function ScheduleSection({
  appointments,
  isLoading,
  dailyCapacityQuota,
  setDailyCapacityQuota,
  acceptingWalkIns,
  setAcceptingWalkIns,
  triageActionId,
  onUpdateStatus,
  onNavigateToSection,
}: ScheduleSectionProps) {
  const pendingCount = appointments.filter((a: any) => a.status === "pending").length;
  const scheduledCount = appointments.filter((a: any) => a.status === "scheduled").length;
  const inConsultCount = appointments.filter((a: any) => a.status === "in_consultation").length;
  const completedCount = appointments.filter((a: any) => a.status === "completed").length;

  const totalBookedToday = appointments.length;
  const remainingToday = pendingCount + scheduledCount + inConsultCount;
  const capacityUtilization = Math.min(
    Math.round((totalBookedToday / Math.max(dailyCapacityQuota, 1)) * 100),
    100
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 4 KPI Summary Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Booked Today"
          value={totalBookedToday}
          description="Active consultations on schedule"
          icon={Calendar}
          variant="sky"
        />
        <StatCard
          title="In Queue / Waiting"
          value={remainingToday}
          description="Patients awaiting clinical evaluation"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Consults Completed"
          value={completedCount}
          description="Finalized clinical bookings"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Daily Quota Intake"
          value={`${totalBookedToday} / ${dailyCapacityQuota}`}
          description={`${capacityUtilization}% of daily intake target`}
          icon={Users}
          variant={capacityUtilization >= 100 ? "rose" : "default"}
        />
      </div>

      {/* Intake Capacity Limiter Bar */}
      <div className="p-5 sm:p-6 rounded-3xl border border-border bg-card shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-lg">
          <div className="flex items-center gap-2">
            <Sliders className="size-4 text-primary" />
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Daily Intake Capacity Limiter
            </h3>
            {acceptingWalkIns ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Walk-ins Open
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                Capped
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Enforce a clinical intake barrier ({dailyCapacityQuota} patients/day) to prevent fatigue and guarantee quality care.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <div className="w-48 sm:w-60 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  capacityUtilization >= 90
                    ? "bg-rose-500"
                    : capacityUtilization >= 70
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                )}
                style={{ width: `${capacityUtilization}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {capacityUtilization}% Used
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-secondary/60 p-1.5 rounded-2xl border border-border">
            <span className="text-xs font-semibold text-muted-foreground px-2">Quota:</span>
            <Button
              size="sm"
              roleVariant="outline"
              onClick={() => setDailyCapacityQuota((prev) => Math.max(5, prev - 1))}
              className="size-7 rounded-xl font-bold p-0"
              aria-label="Decrease daily quota"
            >
              -
            </Button>
            <span className="text-sm font-extrabold font-mono text-primary w-8 text-center">
              {dailyCapacityQuota}
            </span>
            <Button
              size="sm"
              roleVariant="outline"
              onClick={() => setDailyCapacityQuota((prev) => Math.min(50, prev + 1))}
              className="size-7 rounded-xl font-bold p-0"
              aria-label="Increase daily quota"
            >
              +
            </Button>
          </div>

          <Button
            size="sm"
            roleVariant="outline"
            onClick={() => {
              const nextState = !acceptingWalkIns;
              setAcceptingWalkIns(nextState);
              toast({
                title: nextState ? "Walk-ins Enabled" : "Walk-ins Capped",
                description: nextState
                  ? "Clinic desk can now register walk-in patients up to daily quota."
                  : "Walk-in registration is temporarily closed.",
              });
            }}
            className={cn(
              "text-xs rounded-xl gap-1.5 font-bold transition-all",
              acceptingWalkIns
                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                : "border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
            )}
          >
            {acceptingWalkIns ? (
              <>
                <DoorOpen className="size-3.5" />
                <span>Walk-ins Allowed</span>
              </>
            ) : (
              <>
                <DoorClosed className="size-3.5" />
                <span>Capacity Capped</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sequential Clinical Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Today&apos;s Clinical Triage Queue
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sequential booking tickets with immediate consultation status transitions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
              {appointments.length} Consultations Assigned
            </span>
            {onNavigateToSection && (
              <Button
                roleVariant="outline"
                size="sm"
                onClick={() => onNavigateToSection("appointments")}
                className="text-xs rounded-xl gap-1"
              >
                <span>View Full Ledger</span>
                <ChevronRight className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Scheduled Consultations"
            description="You have no active patient appointments on your schedule for today."
          />
        ) : (
          <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-secondary/60 text-muted-foreground uppercase text-[11px] font-bold border-b border-border">
                  <tr>
                    <th className="px-5 py-4">Ticket</th>
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Timeslot</th>
                    <th className="px-5 py-4">Clinical Reason</th>
                    <th className="px-5 py-4">Fee (DZD)</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Triage Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.map((appt: any, idx: number) => {
                    const patientName = appt.patient?.name || "Sarah Benali";
                    const patientPhone = appt.patient?.phone || "+213 549 88 24 56";
                    const chifaNumber = appt.patient?.carte_chifa_number || "9504121234";
                    const patientInitials = patientName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();
                    const queueTicket = `Q-${String(idx + 1).padStart(2, "0")}`;

                    return (
                      <tr key={appt.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold bg-primary/10 text-primary border border-primary/20">
                            {queueTicket}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 rounded-xl border border-border">
                              <AvatarFallback className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold text-xs">
                                {patientInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-bold text-foreground block">
                                {patientName}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span>{patientPhone}</span>
                                <span className="text-border">·</span>
                                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                  <ShieldCheck className="size-3" />
                                  Chifa
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-foreground">
                          {new Date(appt.scheduled_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-xs text-foreground truncate" title={appt.reason}>
                            {appt.reason}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-bold text-foreground">
                          {((appt.consultation_fee_cents || 400000) / 100).toLocaleString()} DZD
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={appt.status} />
                        </td>

                        <td className="px-5 py-4 text-right space-x-1.5">
                          {appt.status !== "in_consultation" && appt.status !== "completed" && (
                            <Button
                              size="sm"
                              roleVariant="outline"
                              disabled={triageActionId === appt.id}
                              onClick={() => onUpdateStatus(appt.id, "in_consultation")}
                              className="text-xs rounded-xl hover:bg-primary/10 hover:text-primary"
                              title="Start patient consultation evaluation"
                            >
                              <PlayCircle className="size-3.5 mr-1" />
                              <span>In Consult</span>
                            </Button>
                          )}

                          {appt.status !== "completed" && (
                            <Button
                              size="sm"
                              roleVariant="doctor"
                              disabled={triageActionId === appt.id}
                              onClick={() => onUpdateStatus(appt.id, "completed")}
                              className="text-xs rounded-xl"
                              title="Finalize consultation booking"
                            >
                              <CheckCircle2 className="size-3.5 mr-1" />
                              <span>Complete</span>
                            </Button>
                          )}

                          {appt.status !== "cancelled" && appt.status !== "completed" && (
                            <Button
                              size="sm"
                              roleVariant="ghost"
                              disabled={triageActionId === appt.id}
                              onClick={() => onUpdateStatus(appt.id, "cancelled")}
                              className="text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                              title="Cancel consultation slot"
                            >
                              <XCircle className="size-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
