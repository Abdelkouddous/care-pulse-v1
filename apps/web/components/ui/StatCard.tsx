import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const statCardVariants = cva(
  "relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-card border-border text-card-foreground",
        emerald:
          "bg-card border-emerald-200/70 dark:border-emerald-900/50 text-card-foreground",
        amber:
          "bg-card border-amber-200/70 dark:border-amber-900/50 text-card-foreground",
        rose:
          "bg-card border-rose-200/70 dark:border-rose-900/50 text-card-foreground",
        sky:
          "bg-card border-sky-200/70 dark:border-sky-900/50 text-card-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconWrapperVariants = cva(
  "flex size-11 items-center justify-center rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
        rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
        sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant,
  className,
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {Icon && (
          <div className={iconWrapperVariants({ variant })}>
            <Icon className="size-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trend.isPositive
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
