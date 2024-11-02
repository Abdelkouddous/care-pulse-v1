"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { NavItem } from "@/types/nav";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { ThemeToggle } from "../../../components/theme-toggle";
import { FiAlignJustify } from "react-icons/fi";
import { Button } from "../../../components/ui/button";
import { User } from "lucide-react";
import { profileConfig } from "@/config/profile";

interface DashboardNavProps {
  items?: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  //variables and states ....

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to the dropdown element
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  let scrollTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      // Show navbar if scrolling paused for 2 seconds
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);

      // Check if scrolled to the top of the page
      if (window.scrollY === 0) {
        setIsScrolling(true);
      }

      setLastScrollY(window.scrollY);
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Close the dropdown if clicked outside
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside); // Listen for outside clicks

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleMouseEnter = () => setIsScrolling(true); // HIDES THE NAVBAR WHEN WE CLICK OUTSIDE THE DIV ITSELF

  return (
    <div
      className={`${
        isScrolling ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-in-out flex justify-evenly flex-1 px-4  gap-10 md:gap-6 items-center p-1 shadow-md dark:shadow-gray-900 dark:text-slate-50 dark:bg-slate-900 text-slate-900 bg-slate-50`}
      onMouseEnter={handleMouseEnter} // Show navbar on hover
    >
      <Link
        href="/"
        className="flex items-center space-x-2 hover:scale-105 hover:opacity-85"
      >
        <Icons.logo className="h-6 w-6" />
        <span className="inline-block font-bold">{profileConfig.name}</span>
      </Link>
      {items?.length ? (
        <div className="flex flex-1 justify-end">
          {/* Horizontal navigation, hidden on screens under 767px */}
          <nav className="hidden md:flex md:flex-row md:justify-center md:gap-6 ">
            {items.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium text-muted-foreground hover:scale-110 hover:opacity-85 dark:shadow-gray-900 dark:text-slate-50 dark:bg-slate-900 text-slate-900 bg-slate-50",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    <Button variant="ghost"> {item.title} </Button>
                  </Link>
                )
            )}
            <Button
              variant="ghost"
              className={cn(
                "flex flex-row justify-center m-auto items-center text-sm font-medium text-muted-foreground hover:scale-105 p-3 my-1 dark:text-slate-50 text-slate-900"
              )}
            >
              <ThemeToggle />
            </Button>
          </nav>

          {/* Dropdown for smaller screens, visible only on screens <767px */}
          <div
            ref={dropdownRef}
            className="md:hidden right-10 relative z-50 "
            // dark:text-slate-50 dark:bg-slate-900 text-slate-900 bg-slate-50
          >
            <Button
              onClick={toggleDropdown}
              variant="ghost"
              className="flex items-center text-sm font-medium text-muted-foreground dark:text-slate-50 text-slate-900"
            >
              <User className="h-6 w-6 hover:scale-105 "></User>
            </Button>

            {/* Conditionally render dropdown if `isDropdownOpen` is true */}
            {isDropdownOpen && (
              <div className="absolute m-auto items-center left-1/2 transform -translate-x-1/2 dark:text-slate-50 hover:bg-dark text-slate-900 dark:bg-slate-900 bg-slate-50 shadow-md rounded-md mt-2 space-y-1 p-1">
                {items?.map(
                  (item, index) =>
                    item.href && (
                      <Link
                        key={index}
                        href={item.href}
                        className={cn(
                          "flex flex-row justify-center items-center text-sm font-medium text-muted-foreground hover:scale-105 p-3 my-1 dark:text-slate-50 text-slate-900",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        {" "}
                        <Button variant="ghost"> {item.title} </Button>
                      </Link>
                    )
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-row justify-center m-auto items-center text-sm font-medium text-muted-foreground hover:scale-105 p-3 my-1 dark:text-slate-50 text-slate-900"
                  )}
                >
                  <ThemeToggle />
                </Button>
              </div>
            )}
          </div>

          {/* <MessageSquareDashedIcon className="relative top-2 right-2 h-6 w-6 text-gray-500 dark:text-gray-200" /> */}
        </div>
      ) : null}
    </div>
  );
}
