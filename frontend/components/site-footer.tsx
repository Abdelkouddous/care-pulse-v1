"use client";

import Link from "next/link";
import {
  Linkedin,
  Mail,
  Clock,
  Phone,
  MapPin,
  Heart,
  Activity,
  ArrowUpRight,
  Shield,
  Globe,
} from "lucide-react";

export const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-[#060d18] text-slate-300 overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      {/* Top divider accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="relative z-10 container mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Brand */}
          <div className="flex flex-col space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <Activity className="size-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">CarePulse</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">
                  Medical Center
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Enterprise-grade healthcare appointment platform connecting patients
              with trusted physicians. Built for Algerian clinics with CNAS integration.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Globe, href: "https://vitalsoft.com", label: "Website" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:contact@carepulse.aymenhamel.com", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">Platform</h3>
            <div className="flex flex-col space-y-2.5">
              {[
                { label: "Patient Portal", href: "/login" },
                { label: "Book Appointment", href: "/appointments/new" },
                { label: "Physician Workspace", href: "/doctors/login" },
                { label: "Health Profile", href: "/dashboard/patients/me/profile" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">Resources</h3>
            <div className="flex flex-col space-y-2.5">
              {[
                { label: "API Documentation" },
                { label: "System Architecture" },
                { label: "Security & HIPAA" },
                { label: "Integration Guide" },
                { label: "Release Notes" },
              ].map((link) => (
                <span
                  key={link.label}
                  className="text-sm text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors duration-200"
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">Contact</h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">
                  12 Rue Didouche Mourad, Algiers, Algeria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">+213 21 00 11 22</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">contact@carepulse.aymenhamel.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-400">Sun–Thu · 08:00–17:00</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <Shield className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-300">CNAS Integrated · Sanctum Auth</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-slate-500">
              © {currentYear}{" "}
              <span className="font-medium text-slate-300">CarePulse Medical Center</span>
              . Engineered by{" "}
              <a
                href="https://vitalsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-400 hover:text-[#33CCCC] transition-colors"
              >
                Vital Soft
              </a>
              . All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Cookie Policy</span>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">HIPAA Compliance</span>
            </div>
          </div>
          <div className="mt-4 text-center text-[11px] text-slate-600">
            Made with <Heart className="inline size-3 text-red-500/80" /> for better healthcare access.
            This platform is for informational purposes only and not a substitute for professional medical advice.
          </div>
        </div>
      </div>
    </footer>
  );
};
