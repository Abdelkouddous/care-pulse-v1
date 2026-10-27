"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Clock,
  Phone,
  MapPin,
  Heart,
  ArrowUpRight,
  Shield,
  Globe,
  Send,
  CheckCircle2,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LANDING_STATS } from "@/constants/landing-stats";
import { useLanguage } from "@/context/LanguageContext";

export const SiteFooter = () => {
  const currentYear = new Date().getFullYear();
  const { t, locale } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-[#060d18] text-slate-300 overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 left-1/4 size-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-80 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      {/* Top divider accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="relative z-10 container mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 pt-16 pb-8">
        {/* Main 4-Column Directory Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Pilot Mission */}
          <div className="flex flex-col space-y-4 lg:col-span-1">
            <BrandLogo
              size={36}
              subtitle={locale === "ar" ? "شبكة الصحة بالجزائر" : "Santé Numérique Algérie"}
              textClassName="text-white text-lg font-bold"
            />
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={`mailto:${LANDING_STATS.contactEmail}`}
                aria-label="Email support"
                className="flex size-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="https://wa.me/213549882456"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex size-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200"
              >
                <Globe className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col space-y-3.5">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">
              {locale === "ar" ? "التنقل" : "Navigation"}
            </h3>
            <div className="flex flex-col space-y-2 text-xs sm:text-sm">
              <Link
                href="/#how-it-works"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {t.nav.howItWorks}
              </Link>
              <Link
                href="/#doctors"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {t.nav.doctors}
              </Link>
              <Link
                href="/#clinics"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {t.nav.clinics}
              </Link>
              <Link
                href="/#pricing"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {t.nav.pricing}
              </Link>
              <Link
                href="/doctors/login"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {t.nav.doctorPortal}
              </Link>
            </div>
          </div>

          {/* Column 3: Trust & Legal Notices */}
          <div className="flex flex-col space-y-3.5">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">
              {locale === "ar" ? "البيانات والقانون" : "Informations & Loi"}
            </h3>
            <div className="flex flex-col space-y-2 text-xs sm:text-sm">
              <span className="text-emerald-400 font-semibold">
                {t.footer.pilotNotice}
              </span>
              <span className="text-slate-400">
                {t.footer.dataProtection}
              </span>
              <span className="text-slate-400">
                {t.footer.privacyPolicy}
              </span>
              <span className="text-slate-400">
                {t.footer.termsOfService}
              </span>
              <span className="text-slate-400">
                {t.footer.legalNotice}
              </span>
            </div>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="flex flex-col space-y-3.5">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">
              {locale === "ar" ? "التواصل" : "Contact"}
            </h3>
            <div className="flex flex-col space-y-2.5 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 text-emerald-400 shrink-0" />
                <span>Alger Centre (16) &amp; Tébessa (12), Algérie</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-emerald-400 shrink-0" />
                <span>+213 549 88 24 56</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${LANDING_STATS.contactEmail}`}
                  className="hover:text-emerald-400 truncate max-w-[200px]"
                >
                  {LANDING_STATS.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-emerald-400 shrink-0" />
                <span>Dim–Jeu · 08:30–17:00</span>
              </div>
            </div>

            {/* Algerian Data Protection Badge */}
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <Shield className="size-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-semibold text-emerald-300">
                Conforme Loi 18-07 • Données Sécurisées
              </span>
            </div>
          </div>
        </div>

        {/* Compact Newsletter Row (Moved from standalone big band into footer) */}
        <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-sans text-sm font-bold text-white">
              {locale === "ar"
                ? "اشترك في النشرة الطبية الدورية"
                : "Restez informé sur l'actualité médicale et les disponibilités"}
            </h4>
            <p className="text-xs text-slate-400">
              {locale === "ar"
                ? "نصائح صحية وتنبيهات الأطباء الجدد مباشرة على بريدكم الإلكتروني."
                : "Informations de prévention et nouveaux praticiens vérifiés dans votre wilaya."}
            </p>
          </div>

          {isSubscribed ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
              <CheckCircle2 className="size-4" />
              <span>
                {locale === "ar" ? "شكراً لاشتراككم!" : "Merci ! Vous êtes bien inscrit(e)."}
              </span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="votre.email@domaine.dz"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="h-10 text-xs rounded-xl bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 w-full sm:w-64"
              />
              <Button
                type="submit"
                roleVariant="patient"
                size="sm"
                className="h-10 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
              >
                <Send className="size-3.5 me-1.5" />
                <span>{locale === "ar" ? "اشتراك" : "S'inscrire"}</span>
              </Button>
            </form>
          )}
        </div>

        {/* Bottom Disclaimer Bar */}
        <div className="mt-8 border-t border-white/10 pt-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              © {currentYear}{" "}
              <span className="font-semibold text-slate-300">Wateen Book</span>
              {" "}(وتين بوك) — by{" "}
              <span className="font-semibold text-slate-300">WateenSoft</span>
              . Plateforme de santé certifiée pour l&apos;Algérie.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-emerald-400 cursor-pointer">Confidentialité</span>
              <span className="hover:text-emerald-400 cursor-pointer">Conditions</span>
              <span className="hover:text-emerald-400 cursor-pointer">Cookies</span>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 leading-relaxed border-t border-white/5 pt-3">
            {t.footer.medicalDisclaimer}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
