// components/main-nav.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";

interface MainNavProps {
  items?: NavItem[];
  userId?: string;
}

export function MainNav({ items, userId }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 md:gap-10">
      {items?.map((item, index) => {
        // Skip rendering if the item is disabled
        if (item.disabled) {
          return null;
        }

        // If the item has an onClick handler, render a button instead of a link
        if (item.onClick) {
          return (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center text-lg font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </button>
          );
        }

        // For regular navigation items with href
        if (item.href) {
          // Replace any dynamic segments in the href with the actual userId
          const href = item.href.includes("$userId")
            ? item.href.replace("$userId", userId || "")
            : item.href;

          return (
            <Link
              key={index}
              href={href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-primary",
                pathname === href && "text-primary"
              )}
            >
              {item.title}
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
}
