import React from "react";
import { MessageSquare, Check, X, Clock, AlertCircle } from "lucide-react";
import { WhatsAppStatus } from "@/types/api.types";
import { cn } from "@/lib/utils";

interface WhatsAppBadgeProps {
  status?: WhatsAppStatus | string;
  confirmedAt?: string;
  className?: string;
}

export function WhatsAppBadge({ status = "not_sent", confirmedAt, className }: WhatsAppBadgeProps) {
  const normalized = (status || "not_sent").toLowerCase();

  switch (normalized) {
    case "confirmed":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
            className
          )}
          title={confirmedAt ? `Confirmed via WhatsApp at ${new Date(confirmedAt).toLocaleTimeString()}` : "Confirmed via WhatsApp"}
        >
          <MessageSquare className="size-3 text-emerald-600 dark:text-emerald-400" />
          <Check className="size-2.5 stroke-[3] text-emerald-600 dark:text-emerald-400" />
          <span>WA Confirmed</span>
        </span>
      );

    case "sent":
    case "pending":
    case "delivered":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800",
            className
          )}
          title="WhatsApp reminder dispatched, waiting for patient reply"
        >
          <MessageSquare className="size-3 text-sky-600 dark:text-sky-400" />
          <Clock className="size-2.5 text-sky-600 dark:text-sky-400 animate-spin" />
          <span>WA Awaiting</span>
        </span>
      );

    case "cancelled":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
            className
          )}
          title="Patient replied 2 (Cancel) via WhatsApp"
        >
          <MessageSquare className="size-3 text-rose-600 dark:text-rose-400" />
          <X className="size-2.5 stroke-[3] text-rose-600 dark:text-rose-400" />
          <span>WA Cancelled</span>
        </span>
      );

    case "failed":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
            className
          )}
          title="WhatsApp delivery failed or invalid phone number"
        >
          <AlertCircle className="size-3 text-amber-600" />
          <span>WA Failed</span>
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
            className
          )}
          title="No WhatsApp reminder has been sent yet"
        >
          <MessageSquare className="size-3 text-slate-400" />
          <span>No WA Ping</span>
        </span>
      );
  }
}
