"use client";
import { User, Settings, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { FiAlignJustify } from "react-icons/fi";

import { Icons } from "@/components/icons";
import { profileConfig } from "@/config/profile";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";

import { ThemeToggle } from "../../../components/theme-toggle";
import { Button } from "../../../components/ui/button";

interface DashboardNavProps {
  items?: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
        setProfileOpen(false);
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
              {profileConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {items?.map((item, index) => (
              <Link
                key={index}
                href={item.href || "#"}
                className={cn(
                  "text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative ml-4">
              <Button
                variant="ghost"
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <UserCircle className="size-6 text-gray-600 dark:text-gray-300" />
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <User className="mr-3 size-5" />
                      View Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <Settings className="mr-3 size-5" />
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => {
                        /* Add delete logic */
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                      <LogOut className="mr-3 size-5" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <FiAlignJustify className="size-6 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="space-y-1 pt-4">
              {items?.map((item, index) => (
                <Link
                  key={index}
                  href={item.href || "#"}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
