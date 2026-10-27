"use client";

import React from "react";

/**
 * TrustedBySection
 * 
 * Displays institutional partners and accredited private clinics.
 * Gated strictly behind NEXT_PUBLIC_SHOW_TRUSTED_BY environment flag
 * until formal legal authorizations are provided.
 */
export function TrustedBySection() {
  const showTrustedBy = process.env.NEXT_PUBLIC_SHOW_TRUSTED_BY === "true";

  if (!showTrustedBy) {
    return null;
  }

  return (
    <section className="w-full py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Partner Healthcare Centers
        </p>
      </div>
    </section>
  );
}

export default TrustedBySection;
