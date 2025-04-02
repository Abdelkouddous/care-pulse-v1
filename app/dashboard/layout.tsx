// import { ThemeProvider } from "@/components/theme-provider";
// import React from "react";
// import { ThemeToggle } from "../theme-toggle";

// import { Metadata } from "next";
// import { siteConfig } from "@/config/site";
// import { Plus_Jakarta_Sans } from "next/font/google";
// import { cn } from "@/lib/utils";
// import { DashboardNav } from "./components/Dashboardnav";
// import profileConfig from "@/config/profile";

// const fontSans = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-sans",
// });
// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon-16x16.png",
//     apple: "/apple-touch-icon.png",
//   },
// };
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         className={cn(
//           "min-h-screen bg-background font-sans antialiased ",
//           fontSans.variable
//         )}
//       >
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//           <DashboardNav items={profileConfig.mainNav}></DashboardNav>
//           {/* Layout UI */}
//           <main>{children}</main>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
//
// // app/dashboard/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import profileConfig from "@/config/profile";
import { toast } from "@/hooks/use-toast";
import { TokenManager } from "@/lib/auth";

import { DashboardNav } from "./components/Dashboardnav";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userId = TokenManager.getToken();
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Add event listener for history changes (back/forward buttons)
    window.addEventListener("popstate", checkAuth);

    return () => {
      window.removeEventListener("popstate", checkAuth);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="size-16 animate-spin rounded-full border-y-2 border-emerald-500"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardNav items={profileConfig.mainNav}></DashboardNav>
      {/* Layout UI */}
      <main>{children}</main>
    </ThemeProvider>
  ) : null;
}
