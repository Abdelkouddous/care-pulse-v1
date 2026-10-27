"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  XCircle,
  Clock,
  Phone,
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ClinicalActivityItem } from "@/types/activity.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityTimelineItemProps {
  item: ClinicalActivityItem;
  isLast?: boolean;
}

export function ActivityTimelineItem({ item, isLast = false }: ActivityTimelineItemProps) {
  // Format timestamp cleanly
  const formattedDate = formatTimestamp(item.timestamp);

  // Icon, color accents and badges based on category and event_type
  const visualConfig = getVisualConfig(item);
  const Icon = visualConfig.icon;

  // Patient Initials
  const patientInitials = (item.patient?.name || "Patient")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex items-start gap-4 sm:gap-6 group">
      {/* 1. Vertical Spine Connector Line */}
      {!isLast && (
        <span
          className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-border/70 group-hover:bg-primary/30 transition-colors"
          aria-hidden="true"
        />
      )}

      {/* 2. Timeline Node Icon */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center size-10 rounded-2xl border shadow-sm transition-transform group-hover:scale-105 shrink-0",
          visualConfig.nodeBg,
          visualConfig.nodeBorder,
          visualConfig.textColor
        )}
      >
        <Icon className="size-4" />
      </div>

      {/* 3. Event Details Card */}
      <div className="flex-1 pb-6 min-w-0">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 group-hover:border-border transition-all shadow-sm hover:shadow-md">
          {/* Header Row: Title, Badges, Timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                  visualConfig.badgeBg,
                  visualConfig.badgeBorder,
                  visualConfig.badgeText
                )}
              >
                {item.category}
              </span>

              <h4 className="text-sm font-bold text-foreground">
                {item.title}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Clock className="size-3.5 text-muted-foreground/70" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          {/* Patient Profile Snapshot & Metadata Strip */}
          <div className="mt-3.5 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
            {/* Patient Identity */}
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="size-7 rounded-lg ring-1 ring-border">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                  {patientInitials}
                </AvatarFallback>
              </Avatar>

              <div className="truncate">
                <p className="text-xs font-semibold text-foreground truncate">
                  {item.patient?.name || "Patient"}
                </p>
                {item.patient?.phone && item.patient.phone !== "N/A" && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                    <Phone className="size-2.5" />
                    <span>{item.patient.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Metadata Badges & Link to Appointments */}
            <div className="flex items-center gap-2 flex-wrap">
              {item.metadata?.fee && (
                <span className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-medium text-foreground border border-border/50">
                  {item.metadata.fee}
                </span>
              )}

              {item.metadata?.status && (
                <span className="px-2 py-0.5 rounded-md bg-secondary/80 text-[10px] font-semibold text-muted-foreground uppercase border border-border/40">
                  Status: {item.metadata.status}
                </span>
              )}

              <Link
                href="/doctors/dashboard#appointments"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors ml-1"
              >
                <span>View in Schedule</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Format ISO timestamp into human-readable representation.
 */
function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Recently";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

/**
 * Maps event categories & types to medical colorways and iconography.
 */
function getVisualConfig(item: ClinicalActivityItem) {
  switch (item.event_type) {
    case "appointment_booked":
      return {
        icon: Calendar,
        nodeBg: "bg-emerald-500/10",
        nodeBorder: "border-emerald-500/30",
        textColor: "text-emerald-500",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/20",
        badgeText: "text-emerald-600 dark:text-emerald-400",
      };

    case "whatsapp_dispatched":
      return {
        icon: MessageSquare,
        nodeBg: "bg-blue-500/10",
        nodeBorder: "border-blue-500/30",
        textColor: "text-blue-500",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/20",
        badgeText: "text-blue-600 dark:text-blue-400",
      };

    case "whatsapp_confirmed":
      return {
        icon: CheckCircle2,
        nodeBg: "bg-teal-500/10",
        nodeBorder: "border-teal-500/30",
        textColor: "text-teal-500",
        badgeBg: "bg-teal-500/10",
        badgeBorder: "border-teal-500/20",
        badgeText: "text-teal-600 dark:text-teal-400",
      };

    case "in_consultation":
      return {
        icon: PlayCircle,
        nodeBg: "bg-indigo-500/10",
        nodeBorder: "border-indigo-500/30",
        textColor: "text-indigo-500",
        badgeBg: "bg-indigo-500/10",
        badgeBorder: "border-indigo-500/20",
        badgeText: "text-indigo-600 dark:text-indigo-400",
      };

    case "completed":
      return {
        icon: CheckCircle2,
        nodeBg: "bg-emerald-500/10",
        nodeBorder: "border-emerald-500/30",
        textColor: "text-emerald-500",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/20",
        badgeText: "text-emerald-600 dark:text-emerald-400",
      };

    case "cancelled":
    case "whatsapp_delivery_failed":
      return {
        icon: AlertCircle,
        nodeBg: "bg-rose-500/10",
        nodeBorder: "border-rose-500/30",
        textColor: "text-rose-500",
        badgeBg: "bg-rose-500/10",
        badgeBorder: "border-rose-500/20",
        badgeText: "text-rose-600 dark:text-rose-400",
      };

    default:
      return {
        icon: Clock,
        nodeBg: "bg-secondary",
        nodeBorder: "border-border",
        textColor: "text-foreground",
        badgeBg: "bg-secondary",
        badgeBorder: "border-border",
        badgeText: "text-muted-foreground",
      };
  }
}
