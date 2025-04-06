// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { TokenManager } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"; // Import the LogOut icon from lucide-react

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  className = "",
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Call the logout function from TokenManager
    TokenManager.clearToken();

    // Show success toast
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    // Redirect to home page
    router.push("/");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
