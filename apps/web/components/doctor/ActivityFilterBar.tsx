"use client";

import React from "react";
import {
  Search,
  X,
  RotateCw,
  Sparkles,
  Calendar,
  MessageSquare,
  Activity,
  Layers,
} from "lucide-react";
import { ActivityFilterCategory } from "@/types/activity.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityFilterBarProps {
  selectedCategory: ActivityFilterCategory;
  onSelectCategory: (cat: ActivityFilterCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
  filteredCount: number;
  isRefetching: boolean;
  onRefresh: () => void;
}

export function ActivityFilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  isRefetching,
  onRefresh,
}: ActivityFilterBarProps) {
  const tabs: Array<{
    id: ActivityFilterCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "all", label: "All Activity", icon: Layers },
    { id: "booking", label: "Bookings", icon: Calendar },
    { id: "communication", label: "WhatsApp & SMS", icon: MessageSquare },
    { id: "triage", label: "Triage & Consults", icon: Activity },
  ];

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
      {/* Top Row: Category Tabs + Refresh Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <Icon className={cn("size-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter & Refresh Action */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/40">
            Showing <strong className="text-foreground">{filteredCount}</strong> of{" "}
            <strong>{totalCount}</strong>
          </span>

          <Button
            roleVariant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefetching}
            className="h-8 px-2.5 rounded-xl border-border text-xs gap-1.5"
            aria-label="Refresh activity feed"
          >
            <RotateCw
              className={cn("size-3.5", isRefetching && "animate-spin text-primary")}
            />
            <span className="hidden sm:inline">Sync</span>
          </Button>
        </div>
      </div>

      {/* Bottom Row: Search Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by patient name, phone, consultation reason, or event details..."
          className="pl-9 pr-9 h-10 rounded-xl bg-background border-border text-xs focus-visible:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
