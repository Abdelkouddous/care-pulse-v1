"use client";

import { Moon, Sun, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { FiAlignJustify } from "react-icons/fi";
import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/theme-toggle";
import { DemoTourModal } from "@/components/DemoTourModal";
import { BilingualLanguageToggle } from "@/components/landing/BilingualLanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

interface MainNavProps {
  items?: NavItem[];
  userId?: string;
}

export function MainNav({ items, userId }: MainNavProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("patient");
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("vitalbook_token") ||
        localStorage.getItem("user_token");
      const role = localStorage.getItem("vitalbook_role") || "patient";
      setIsAuthenticated(!!token);
      setUserRole(role);
    }
  }, [pathname]);

  // Scroll-spy to dynamically track active landing section
  useEffect(() => {
    const sectionIds = ["how-it-works", "doctors", "clinics", "pricing", "contact"];

    const handleScrollSpy = () => {
      // If user is at top of page, no section is active
      if (window.scrollY < 240) {
        setActiveSection("");
        return;
      }

      const scrollPosition = window.scrollY + 140; // offset for sticky header
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ordered strictly as: How it works -> Doctors -> Clinics -> Pricing -> Contact
  const baseNavItems = [
    { title: t.nav.howItWorks, href: "/#how-it-works", id: "how-it-works" },
    { title: t.nav.doctors, href: "/#doctors", id: "doctors" },
    { title: t.nav.clinics, href: "/#clinics", id: "clinics" },
    { title: t.nav.pricing, href: "/#pricing", id: "pricing" },
    { title: t.nav.contact, href: "/#contact", id: "contact" },
  ];

  const dashboardHref =
    userRole === "doctor"
      ? "/doctors/dashboard"
      : userRole === "admin"
      ? "/admin/dashboard"
      : "/patient/dashboard";

  const mainNavItems = isAuthenticated
    ? [...baseNavItems, { title: t.nav.patientDashboard, href: dashboardHref, id: "dashboard" }]
    : baseNavItems;

  return (
    <nav
      ref={dropdownRef}
      className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-slate-800/90 dark:bg-slate-900/95 shadow-xs"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex h-16 items-center justify-between gap-x-4">
          {/* Left Cluster: Brand Logo + Desktop Nav Links (Zero collision, no wrapping) */}
          <div className="flex items-center gap-x-6 xl:gap-x-8 shrink-0 min-w-0">
            <BrandLogo size={36} className="shrink-0" />

            {/* Desktop Navigation Links with Scroll-Spy Active Indicators */}
            <div className="hidden lg:flex items-center gap-x-4 xl:gap-x-6 text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0">
              {mainNavItems.map((item, index) => {
                const isActive = activeSection === item.id;

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "relative py-1 transition-colors whitespace-nowrap hover:text-emerald-600 dark:hover:text-emerald-400",
                      isActive
                        ? "font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-300"
                    )}
                  >
                    {item.title}
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Bar (RTL-Safe gap) */}
          <div className="flex items-center gap-x-2 sm:gap-x-2.5 shrink-0">
            {/* Direct Phone Helpline Number (Visible on wide screens) */}
            <a
              href="tel:+213549882456"
              className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap"
              title="Ligne Téléphonique Directe"
            >
              <Phone className="size-3.5" />
              <span>+213 549 88 24 56</span>
            </a>

            {/* MVP Demo Sandbox Button (Gated behind NEXT_PUBLIC_DEMO_MODE) */}
            {showDemoMode && (
              <div className="hidden xl:block shrink-0">
                <DemoTourModal />
              </div>
            )}

            {/* Language Switcher (FR / عربي / EN) */}
            <BilingualLanguageToggle className="hidden sm:inline-flex shrink-0" />

            {/* Theme Toggle */}
            <ThemeToggle className="size-9 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0" />

            {/* Auth CTA Actions */}
            {isAuthenticated ? (
              <Link href={dashboardHref} className="hidden sm:block shrink-0">
                <Button
                  roleVariant="patient"
                  size="sm"
                  className="rounded-xl text-xs font-bold px-3.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer whitespace-nowrap"
                >
                  {userRole === "doctor"
                    ? t.nav.doctorPortal
                    : userRole === "admin"
                    ? "Admin Portal"
                    : t.nav.patientDashboard}
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-x-2 shrink-0">
                <Link href="/login">
                  <Button
                    roleVariant="ghost"
                    size="sm"
                    className="rounded-xl text-xs font-semibold px-3 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer whitespace-nowrap"
                  >
                    {t.nav.signIn}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    roleVariant="patient"
                    size="sm"
                    className="rounded-xl text-xs font-bold px-3.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer whitespace-nowrap"
                  >
                    {t.nav.register}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile / Tablet Navigation Drawer Toggle (Triggered below lg: 1024px) */}
            <Button
              roleVariant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden shrink-0"
              aria-label="Toggle menu"
            >
              <FiAlignJustify className="size-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>
        </div>

        {/* Mobile / Tablet Flyout Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 lg:hidden border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1 pt-3">
              {mainNavItems.map((item, index) => {
                const isActive = activeSection === item.id;

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 font-bold"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                );
              })}
              <div className="pt-2 space-y-2">
                {showDemoMode && (
                  <div className="w-full">
                    <DemoTourModal className="w-full justify-center" />
                  </div>
                )}
                {isAuthenticated ? (
                  <Link
                    href={dashboardHref}
                    className="block rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {userRole === "doctor"
                      ? t.nav.doctorPortal
                      : userRole === "admin"
                      ? "Admin Portal"
                      : t.nav.patientDashboard}
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="block rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-center text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.nav.signIn}
                    </Link>
                    <Link
                      href="/register"
                      className="block rounded-xl bg-emerald-600 px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-emerald-700 shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.nav.register}
                    </Link>
                  </div>
                )}
                {/* Mobile Direct Helpline & Language Switcher */}
                <div className="pt-2 flex flex-col items-center gap-2">
                  <a
                    href="tel:+213549882456"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
                  >
                    <Phone className="size-4" />
                    <span>Ligne Directe : +213 549 88 24 56</span>
                  </a>
                  <BilingualLanguageToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default MainNav;
