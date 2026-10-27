import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BRAND_CONFIG from "@/config/brand.config";

export interface BrandLogoProps {
  href?: string;
  size?: number;
  subtitle?: string;
  showBadge?: boolean;
  isCollapsed?: boolean;
  className?: string;
  textClassName?: string;
  subtitleClassName?: string;
  priority?: boolean;
}

/**
 * WateenSoft Shield + Pulse Emblem SVG Vector
 * Precision gradient: #008668 (Wateen Teal) to #33CCCC (Pulse Aqua)
 */
export function WateenShieldPulseEmblem({
  size = 38,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 drop-shadow-xs", className)}
      aria-label="WateenSoft Shield and Pulse Emblem"
    >
      <defs>
        <linearGradient id="wateenGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#008668" />
          <stop offset="100%" stopColor="#33CCCC" />
        </linearGradient>
        <linearGradient id="wateenPulseGlow" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0FFFF" />
        </linearGradient>
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#008668" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Smooth Clinical Shield Background */}
      <path
        d="M50 8C68 18 84 18 88 32C92 56 78 80 50 92C22 80 8 56 12 32C16 18 32 18 50 8Z"
        fill="url(#wateenGradient)"
        filter="url(#softGlow)"
      />

      {/* Protective Inner Border Accent */}
      <path
        d="M50 13C66 22 79 22 83 34C86 54 74 74 50 85C26 74 14 54 17 34C21 22 34 22 50 13Z"
        stroke="#FFFFFF"
        strokeOpacity="0.25"
        strokeWidth="2"
      />

      {/* Dynamic ECG Pulse Line intersecting Heart Apex */}
      <path
        d="M22 52H34L40 40L48 64L54 44L60 56L66 52H78"
        stroke="url(#wateenPulseGlow)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Vital Pulse Node Dot */}
      <circle cx="54" cy="44" r="3.5" fill="#FFFFFF" />
    </svg>
  );
}

export function BrandLogo({
  href = "/",
  size = 38,
  subtitle = "BY WATEENSOFT",
  showBadge = true,
  isCollapsed = false,
  className,
  textClassName,
  subtitleClassName,
}: BrandLogoProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 transition-opacity hover:opacity-90 select-none group",
        className
      )}
    >
      <div className="shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
        <WateenShieldPulseEmblem size={size} />
      </div>

      {!isCollapsed && (
        <div className="flex flex-col justify-center leading-none whitespace-nowrap shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-heading text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight whitespace-nowrap",
                textClassName
              )}
            >
              Wateen
              <span className="font-semibold text-[#33CCCC] ms-0.5">
                Book
              </span>
            </span>

            {showBadge && (
              <span
                dir="rtl"
                className="font-arabic inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#008668]/15 text-[#008668] dark:text-[#33CCCC] dark:bg-[#33CCCC]/15 leading-none"
              >
                {BRAND_CONFIG.app.nameArabic}
              </span>
            )}
          </div>

          {subtitle && (
            <span
              className={cn(
                "text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mt-1",
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
