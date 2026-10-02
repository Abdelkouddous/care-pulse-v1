import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-border bg-card/50",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-4">
        <Icon className="size-7" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {actionLabel && (
        <>
          {actionHref ? (
            <a href={actionHref}>
              <Button roleVariant="patient" size="sm" className="rounded-xl">
                {actionLabel}
              </Button>
            </a>
          ) : (
            <Button
              onClick={onAction}
              roleVariant="patient"
              size="sm"
              className="rounded-xl"
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}

      {children}
    </div>
  );
}

export default EmptyState;
