"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  PlayCircle,
  XCircle,
  User,
  ShieldCheck,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AppointmentsSectionProps {
  appointments: any[];
  isLoading: boolean;
  triageActionId: string | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

type FilterStatus = "all" | "scheduled" | "in_consultation" | "completed" | "cancelled";

export function AppointmentsSection({
  appointments,
  isLoading,
  triageActionId,
  onUpdateStatus,
}: AppointmentsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");

  // Filter computation
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const patientName = appt.patient?.name || "";
      const patientPhone = appt.patient?.phone || "";
      const reason = appt.reason || "";
      const apptId = appt.id || "";

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        patientName.toLowerCase().includes(query) ||
        patientPhone.toLowerCase().includes(query) ||
        reason.toLowerCase().includes(query) ||
        apptId.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "all" || appt.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, selectedStatus]);

  // Tab counts
  const totalCount = appointments.length;
  const scheduledCount = appointments.filter((a) => a.status === "scheduled").length;
  const inConsultCount = appointments.filter((a) => a.status === "in_consultation").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;

  const totalRevenueDzd = appointments.reduce((sum, a) => {
    if (a.status === "completed") {
      return sum + (a.consultation_fee_cents || 400000) / 100;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Consultation Bookings Ledger
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full clinical consultation log with instant status updates and Algerian Chifa coverage.
          </p>
        </div>

        {/* Financial KPI Chip */}
        <div className="flex items-center gap-3 bg-secondary/50 border border-border px-4 py-2 rounded-2xl shrink-0">
          <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Completed Consult Fees
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {totalRevenueDzd.toLocaleString()} DZD
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by patient name, phone, or clinical reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-secondary/50 border-border text-xs sm:text-sm"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "All Bookings", count: totalCount },
              { id: "scheduled", label: "Scheduled", count: scheduledCount },
              { id: "in_consultation", label: "In Consult", count: inConsultCount },
              { id: "completed", label: "Completed", count: completedCount },
              { id: "cancelled", label: "Cancelled", count: cancelledCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id as FilterStatus)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap",
                  selectedStatus === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-md text-[10px] font-mono",
                    selectedStatus === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-background text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Bookings Found"
          description={
            searchQuery || selectedStatus !== "all"
              ? "No appointments match your search and filter criteria. Try resetting filters."
              : "No clinical appointments are currently recorded in the booking system."
          }
        />
      ) : (
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-secondary/60 text-muted-foreground uppercase text-[11px] font-bold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Booking Ref</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Date & Slot</th>
                  <th className="px-6 py-4">Clinical Reason</th>
                  <th className="px-6 py-4">Consultation Fee</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAppointments.map((appt: any) => {
                  const patientName = appt.patient?.name || "Sarah Benali";
                  const patientPhone = appt.patient?.phone || "+213 549 88 24 56";
                  const patientInitials = patientName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();
                  const bookingRef = `#BK-${appt.id.substring(0, 8)}`;
                  const scheduledDate = new Date(appt.scheduled_at);

                  return (
                    <tr key={appt.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          {bookingRef}
                        </span>
                      </td>

                      <td className="px-6 py-4">
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
                                CNAS
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-0.5 font-mono text-xs">
                          <span className="text-foreground block font-bold">
                            {scheduledDate.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-muted-foreground">
                            {scheduledDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-foreground truncate font-medium" title={appt.reason}>
                          {appt.reason}
                        </p>
                        {appt.notes && (
                          <p className="text-[11px] text-muted-foreground truncate" title={appt.notes}>
                            {appt.notes}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold text-foreground">
                        {((appt.consultation_fee_cents || 400000) / 100).toLocaleString()} DZD
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={appt.status} />
                      </td>

                      <td className="px-6 py-4 text-right space-x-1.5">
                        {appt.status !== "in_consultation" && appt.status !== "completed" && (
                          <Button
                            size="sm"
                            roleVariant="outline"
                            disabled={triageActionId === appt.id}
                            onClick={() => onUpdateStatus(appt.id, "in_consultation")}
                            className="text-xs rounded-xl hover:bg-primary/10 hover:text-primary"
                            title="Start consultation"
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
                            title="Mark consultation completed"
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
                            title="Cancel booking"
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
  );
}
