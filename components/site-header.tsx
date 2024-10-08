"use client";

import { siteConfig } from "../config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function SiteHeader() {
  const [loggedIn, isLoggedIn] = useState(false);
  // Update isLoggedIn state based on authentication status

  return (
    <header className="bg-background sticky top-0 z-40 w-screen max-w-7xl border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="right-0 flex items-center space-x-1">
            {}
            Theme
            <ThemeToggle />
            {loggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Icons.profile className="h-6 w-6"> </Icons.profile>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Appointments</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
