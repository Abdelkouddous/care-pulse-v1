"use client";

import React, { useEffect, useState } from "react";
import { WateenShieldPulseEmblem } from "@/components/BrandLogo";
import BRAND_CONFIG from "@/config/brand.config";

export interface BrandSplashLoaderProps {
  minDisplayTimeMs?: number;
}

export function BrandSplashLoader({ minDisplayTimeMs = 450 }: BrandSplashLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Smooth, rapid fadeout after page is interactive
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDisplayTimeMs);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, minDisplayTimeMs + 300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [minDisplayTimeMs]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${BRAND_CONFIG.app.name}`}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B131E] transition-all duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none scale-[1.02]" : "opacity-100"
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute w-72 h-72 bg-[#008668]/15 dark:bg-[#008668]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-48 h-48 bg-[#33CCCC]/10 dark:bg-[#33CCCC]/15 rounded-full blur-2xl pointer-events-none -translate-y-8" />

      {/* Brand Icon & Typography */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Pulsing Logo Container */}
        <div className="relative size-20 sm:size-24 rounded-3xl p-3 bg-white dark:bg-[#111C2D] border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center">
          <WateenShieldPulseEmblem size={56} />
          <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-[#33CCCC] ring-4 ring-white dark:ring-[#111C2D] animate-ping" />
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-1.5 font-heading">
            <span>Wateen</span>
            <span className="text-[#33CCCC]">
              Book
            </span>
            <span className="font-arabic text-xs font-bold px-1.5 py-0.5 rounded bg-[#008668]/15 text-[#008668] dark:text-[#33CCCC]">
              {BRAND_CONFIG.app.nameArabic}
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
            {BRAND_CONFIG.company.tagline}
          </p>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-40 h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2 relative">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#008668] via-[#33CCCC] to-[#FF9B33] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default BrandSplashLoader;
