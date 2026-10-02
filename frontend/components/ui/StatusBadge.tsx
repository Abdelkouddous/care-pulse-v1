import React from "react";
import { cn } from "@/lib/utils";

export type AppointmentStatus =
  | "scheduled"
  | "pending"
  | "completed"
  | "cancelled"
  | "no_show"
  | string;

export interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const normalized = (status || "pending").toLowerCase();

  const styles: Record<string, { bg: string; dot: string; label: string }> = {
    scheduled: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
      label: "Scheduled",
    },
    in_consultation: {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
      dot: "bg-indigo-500 animate-pulse",
      label: "In Consultation",
    },
    pending: {
      bg: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
      dot: "bg-amber-500",
      label: "Pending Action",
    },
    completed: {
      bg: "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
      dot: "bg-sky-500",
      label: "Completed",
    },
    cancelled: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
      dot: "bg-rose-500",
      label: "Cancelled",
    },
    no_show: {
      bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      dot: "bg-slate-400",
      label: "No Show",
    },
  };

  const current = styles[normalized] || {
    bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
    label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
        current.bg,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("size-1.5 rounded-full animate-pulse", current.dot)}
          aria-hidden="true"
        />
      )}
      {current.label}
    </span>
  );
}

export default StatusBadge;
