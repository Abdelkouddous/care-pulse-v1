"use client";

import React from "react";
import Link from "next/link";
import {
  History,
  ArrowLeft,
  Radio,
  Wifi,
  WifiOff,
  Clock,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDoctorActivity } from "@/hooks/useDoctorActivity";
import { ActivityMetricsCards } from "@/components/doctor/ActivityMetricsCards";
import { ActivityFilterBar } from "@/components/doctor/ActivityFilterBar";
import { ActivityTimelineItem } from "@/components/doctor/ActivityTimelineItem";

export default function DoctorActivityPage() {
  const {
    activities,
    rawCount,
    isLoading,
    isRefetching,
    isLiveConnected,
    metrics,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    refetch,
  } = useDoctorActivity();

  return (
    <AppShell role="doctor" pageTitle="Clinical Activity Feed">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* 1. Page Header & Live Status Actions */}
        <PageHeader
          title="Clinical Activity Feed"
          subtitle="Real-time chronological audit trail of patient bookings, WhatsApp confirmations, and consultation triage progressions."
        >
          {/* Live Reverb Indicator */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isLiveConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isLiveConnected ? (
              <>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono">Reverb Live</span>
              </>
            ) : (
              <>
                <span className="size-2 rounded-full bg-amber-500" />
                <span className="font-mono">Sync Active</span>
              </>
            )}
          </div>

          {/* Back to Dashboard Navigation */}
          <Button
            asChild
            roleVariant="outline"
            size="sm"
            className="rounded-xl border-border text-xs gap-1.5 h-9"
          >
            <Link href="/doctors/dashboard">
              <ArrowLeft className="size-3.5" />
              <span>Doctor Workspace</span>
            </Link>
          </Button>
        </PageHeader>

        {/* 2. Clinical Metrics KPI Strip */}
        <ActivityMetricsCards
          metrics={metrics}
          isLiveConnected={isLiveConnected}
        />

        {/* 3. Filter & Search Controls */}
        <ActivityFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={rawCount}
          filteredCount={activities.length}
          isRefetching={isRefetching}
          onRefresh={refetch}
        />

        {/* 4. Timeline Stream Container */}
        <div className="p-4 sm:p-6 rounded-3xl bg-card/60 border border-border/70 backdrop-blur-sm shadow-sm">
          {isLoading ? (
            <TimelineSkeleton />
          ) : activities.length === 0 ? (
            <EmptyState
              icon={History}
              title="No activities recorded"
              description={
                searchQuery || selectedCategory !== "all"
                  ? "No activity events match your active filters. Try clearing your search query or selecting 'All Activity'."
                  : "No clinical transactions or booking events logged yet. Once patients book or confirm appointments, chronological events will appear here in real time."
              }
              actionLabel={searchQuery || selectedCategory !== "all" ? "Clear All Filters" : undefined}
              onAction={
                searchQuery || selectedCategory !== "all"
                  ? () => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-1 pt-2">
              {activities.map((item, index) => (
                <ActivityTimelineItem
                  key={item.id}
                  item={item}
                  isLast={index === activities.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

/**
 * Loading Skeleton matching the timeline node structure.
 */
function TimelineSkeleton() {
  return (
    <div className="space-y-6 pt-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-4 animate-pulse">
          <div className="size-10 rounded-2xl bg-secondary/80 shrink-0" />
          <div className="flex-1 space-y-3 p-5 rounded-2xl bg-secondary/40 border border-border/40">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-secondary/80 rounded" />
              <div className="h-3 w-16 bg-secondary/80 rounded" />
            </div>
            <div className="h-3 w-3/4 bg-secondary/60 rounded" />
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <div className="h-6 w-24 bg-secondary/80 rounded" />
              <div className="h-6 w-20 bg-secondary/80 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
