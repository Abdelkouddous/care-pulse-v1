import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  href?: string;
  size?: number;
  subtitle?: string;
  isCollapsed?: boolean;
  className?: string;
  textClassName?: string;
  subtitleClassName?: string;
  priority?: boolean;
}

export function BrandLogo({
  href = "/",
  size = 38,
  subtitle,
  isCollapsed = false,
  className,
  textClassName,
  subtitleClassName,
  priority = true,
}: BrandLogoProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-2.5 transition-opacity hover:opacity-85 select-none group",
        className
      )}
    >
      <div className="shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
        <Image
          src="/favicon.svg"
          alt="VitalBook"
          width={size}
          height={size}
          priority={priority}
          className="rounded-xl shadow-xs"
          style={{ width: size, height: size }}
        />
      </div>

      {!isCollapsed && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={cn(
              "font-sans text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight",
              textClassName
            )}
          >
            Vital
            <span className="font-light text-teal-600 dark:text-teal-400">
              Book
            </span>
          </span>
          {subtitle && (
            <span
              className={cn(
                "text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5",
                subtitleClassName
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}

export default BrandLogo;
