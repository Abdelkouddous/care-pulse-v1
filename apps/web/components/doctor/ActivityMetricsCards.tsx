"use client";

import React from "react";
import {
  Activity,
  CalendarCheck2,
  MessageSquare,
  Stethoscope,
} from "lucide-react";
import { ActivityMetricsSummary } from "@/types/activity.types";

interface ActivityMetricsCardsProps {
  metrics: ActivityMetricsSummary;
  isLiveConnected: boolean;
}

export function ActivityMetricsCards({
  metrics,
  isLiveConnected,
}: ActivityMetricsCardsProps) {
  const cards = [
    {
      title: "Total Logged Events",
      value: metrics.totalEvents,
      label: "Audit history trail",
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      liveBadge: isLiveConnected,
    },
    {
      title: "New Bookings",
      value: metrics.newBookings,
      label: "Patient registrations",
      icon: CalendarCheck2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "WhatsApp Confirmations",
      value: metrics.confirmedDeliveries,
      label: "Interactive 2-way pings",
      icon: MessageSquare,
      color: "text-teal-500",
      bg: "bg-teal-500/10 border-teal-500/20",
    },
    {
      title: "Clinical Transitions",
      value: metrics.triageTransitions,
      label: "Triage & consult evolutions",
      icon: Stethoscope,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-card border border-border/70 hover:border-border transition-all shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.bg}`}>
                <Icon className={`size-4 ${card.color}`} />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {card.value}
              </span>

              {card.liveBadge && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground truncate">
              {card.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
