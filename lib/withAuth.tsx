// lib/withAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { TokenManager } from "@/lib/auth";

// Loading component to show while checking authentication
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="size-16 animate-spin rounded-full border-y-2 border-emerald-500"></div>
  </div>
);

// HOC to protect routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      // Check if user is authenticated
      const userId = TokenManager.getToken();

      if (!userId) {
        // User is not authenticated, redirect to login
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    // Show loading while checking authentication
    if (isAuthenticated === null) {
      return <LoadingScreen />;
    }

    // If authenticated, render the component
    return isAuthenticated ? <Component {...props} /> : null;
  };
}
