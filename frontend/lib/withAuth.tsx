// lib/withAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { TokenManager } from "@/lib/auth";
import { User } from "lucide-react";

// Loading component to show while checking authentication
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="size-16 animate-spin rounded-full border-y-2 border-emerald-500"></div>
  </div>
);

// HOC to protect routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  { user }: { user: User }
): React.FC<P> {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const checkAuth = () => {
        const userId = TokenManager.getToken();

        if (!userId) {
          toast({
            title: "Session Expired",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        setIsAuthenticated(true);
      };

      // Check authentication status every minute
      checkAuth();
      const interval = setInterval(checkAuth, 60000);

      return () => clearInterval(interval);
    }, [router]);

    // Show loading while checking authentication
    if (isAuthenticated === null) {
      return <LoadingScreen />;
    }

    // If authenticated, render the component
    return isAuthenticated ? <Component {...props} /> : null;
  };
}
