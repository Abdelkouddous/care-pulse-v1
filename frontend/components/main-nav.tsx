"use client";

import { Moon, Sun } from "lucide-react";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { DemoTourModal } from "@/components/DemoTourModal";
import { DICTIONARY_EN } from "@/constants/locales/en";

interface MainNavProps {
  items?: NavItem[];
  userId?: string;
}

export function MainNav({ items, userId }: MainNavProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("patient");
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("vitalbook_token") ||
        localStorage.getItem("carepulse_token") ||
        localStorage.getItem("user_token");
      const role =
        localStorage.getItem("vitalbook_role") ||
        localStorage.getItem("carepulse_role") ||
        "patient";
      setIsAuthenticated(!!token);
      setUserRole(role);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 2000);
      setLastScrollY(window.scrollY);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const baseNavItems = items || [
    { title: DICTIONARY_EN.nav.home, href: "/" },
    { title: DICTIONARY_EN.nav.about, href: "/#about" },
    { title: DICTIONARY_EN.nav.doctors, href: "/#doctors" },
  ];

  const dashboardHref =
    userRole === "doctor"
      ? "/doctors/dashboard"
      : userRole === "admin"
      ? "/admin/dashboard"
      : "/patient/dashboard";

  const mainNavItems = isAuthenticated
    ? [...baseNavItems, { title: "Dashboard", href: dashboardHref }]
    : baseNavItems;

  return (
    <nav
      ref={dropdownRef}
      className={`sticky top-0 z-50 w-full ${
        isScrolling ? "opacity-100" : "opacity-95"
      } border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900/90`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="transition-opacity hover:opacity-80 flex items-center gap-2.5">
            <Image
              src="/favicon.svg"
              alt="VitalBook"
              width={38}
              height={38}
              priority
            />
            <span className="font-sans text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Vital<span className="font-light text-emerald-600 dark:text-emerald-400">Book</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center space-x-6 md:flex">
            {mainNavItems.map((item, index) => {
              const href = item.href?.includes("$userId")
                ? item.href.replace("$userId", userId || "")
                : item.href || "#";

              return (
                <Link
                  key={index}
                  href={href}
                  className={cn(
                    "text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors",
                    pathname === href &&
                      "text-emerald-600 dark:text-emerald-400 font-semibold",
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* MVP Demo Sandbox Button */}
            <div className="hidden sm:block">
              <DemoTourModal />
            </div>

            {/* Real Sign In / Patient Dashboard Button */}
            {isAuthenticated ? (
              <Link href={dashboardHref} className="hidden sm:block">
                <Button
                  roleVariant="patient"
                  size="sm"
                  className="rounded-xl text-xs font-bold px-3.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  {userRole === "doctor"
                    ? "Doctor Portal"
                    : userRole === "admin"
                    ? "Admin Portal"
                    : "Patient Dashboard"}
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    roleVariant="ghost"
                    size="sm"
                    className="rounded-xl text-xs font-semibold px-3 text-slate-700 dark:text-slate-300 hover:text-emerald-500 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    roleVariant="patient"
                    size="sm"
                    className="rounded-xl text-xs font-bold px-3.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeToggle className="size-9 rounded-xl border border-slate-200 dark:border-slate-800" />

            {/* Mobile Navigation Toggle */}
            <Button
              roleVariant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle menu"
            >
              <FiAlignJustify className="size-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1 pt-3">
              {mainNavItems.map((item, index) => {
                const href = item.href?.includes("$userId")
                  ? item.href.replace("$userId", userId || "")
                  : item.href || "#";

                return (
                  <Link
                    key={index}
                    href={href}
                    className={cn(
                      "block rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                      pathname === href &&
                        "bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400 font-bold"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                );
              })}
              <div className="pt-2 space-y-2">
                <div className="w-full">
                  <DemoTourModal className="w-full justify-center" />
                </div>
                {isAuthenticated ? (
                  <Link
                    href={dashboardHref}
                    className="block rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {userRole === "doctor"
                      ? "Doctor Portal"
                      : userRole === "admin"
                      ? "Admin Portal"
                      : "Patient Dashboard"}
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="block rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-center text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {DICTIONARY_EN.nav.signIn}
                    </Link>
                    <Link
                      href="/register"
                      className="block rounded-xl bg-emerald-600 px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-emerald-700 shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
