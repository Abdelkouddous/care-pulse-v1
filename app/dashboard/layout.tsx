import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import { ThemeToggle } from "../theme-toggle";

import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { DashboardNav } from "./components/Dashboardnav";
import profileConfig from "@/config/profile";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased ",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DashboardNav items={profileConfig.mainNav}></DashboardNav>
          {/* Layout UI */}
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
