"use client";

// components/main-nav.tsx
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { FiAlignJustify } from "react-icons/fi";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface MainNavProps {
  items?: NavItem[];
  userId?: string;
}

export function MainNav({ items, userId }: MainNavProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  let scrollTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 2000);
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
      clearTimeout(scrollTimeout);
    };
  }, []);

  const mainNavItems = items || [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Our Doctors", href: "/doctors" },
  ];

  return (
    <nav
      ref={dropdownRef}
      className={`sticky top-0 z-50 w-full ${
        isScrolling ? "opacity-100" : "opacity-95"
      } border-b border-gray-200 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900/95`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Icons.logo className="size-8 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Pulse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {mainNavItems.map((item, index) => {
              // Replace any dynamic segments in the href with the actual userId
              const href = item.href?.includes("$userId")
                ? item.href.replace("$userId", userId || "")
                : item.href || "#";

              return (
                <Link
                  key={index}
                  href={href}
                  className={cn(
                    "text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors",
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

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(
                  theme === "medical-dark" ? "medical-light" : "medical-dark"
                )
              }
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "medical-dark" ? (
                <Sun className="size-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="size-5 text-gray-600 dark:text-gray-300" />
              )}
            </Button>

            {/* Sign In Button */}
            <Link href="/signin">
              <Button
                variant="outline"
                className="hidden border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/30 md:inline-flex"
              >
                Sign In
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
              aria-label="Toggle menu"
            >
              <FiAlignJustify className="size-6 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="space-y-1 pt-4">
              {mainNavItems.map((item, index) => {
                const href = item.href?.includes("$userId")
                  ? item.href.replace("$userId", userId || "")
                  : item.href || "#";

                return (
                  <Link
                    key={index}
                    href={href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                      pathname === href &&
                        "bg-gray-100 text-emerald-600 dark:bg-gray-700 dark:text-emerald-400"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                );
              })}
              <Link
                href="/signin"
                className="mt-2 block rounded-md bg-emerald-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
