// components/LogoutButton.tsx
"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TokenManager } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the token from storage
      TokenManager.clearToken();

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleLogout}
      roleVariant="ghost"
      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
    >
      <LogOut className="mr-3 size-5" />
      Logout
    </Button>
  );
}
