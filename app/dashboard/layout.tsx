"use client";

import React, { useState } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import profileConfig from "@/config/profile";

import { DashboardNav } from "./components/Dashboardnav";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardNav items={profileConfig.mainNav}></DashboardNav>
      {/* Layout UI */}
      <main>{children}</main>
    </ThemeProvider>
  );
}

// Modify /app/dashboard/layout.tsx

// "use client";

// import { useRouter, usePathname } from "next/navigation";
// import React, { useEffect, useState } from "react";

// import { ThemeProvider } from "@/components/theme-provider";
// import profileConfig from "@/config/profile";
// import { toast } from "@/hooks/use-toast";
// import { TokenManager } from "@/lib/auth";

// import { DashboardNav } from "./components/Dashboardnav";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Check if current path is login or register
//   const isAuthPage =
//     pathname.includes("/login") || pathname.includes("/register");

//   useEffect(() => {
//     const checkAuth = () => {
//       const userId = TokenManager.getToken();
//       // Only check authentication for non-auth pages
//       if (!userId || !isAuthPage) {
//         toast({
//           title: "Authentication Required",
//           description: "Please log in to access this page.",
//           variant: "destructive",
//         });
//         console.error("UNAUTHENTICATED");
//         router.push("/");
//       } else {
//         setIsAuthenticated(true);
//       }
//       setIsLoading(false);
//     };

//     checkAuth();

//     // Add event listener for history changes (back/forward buttons)
//     window.addEventListener("popstate", checkAuth);

//     return () => {
//       window.removeEventListener("popstate", checkAuth);
//     };
//   }, [router, isAuthPage, pathname]);

//   if (isLoading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <div className="size-16 animate-spin rounded-full border-y-2 border-emerald-500"></div>
//       </div>
//     );
//   }

//   // Always render children for auth pages, otherwise check authentication
//   return isAuthenticated || isAuthPage ? (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//       <DashboardNav items={profileConfig.mainNav}></DashboardNav>
//       {/* Layout UI */}
//       <main>{children}</main>
//     </ThemeProvider>
//   ) : null;
// }
