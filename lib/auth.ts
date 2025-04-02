// lib/auth.ts
import { Client, Account } from "appwrite";
import Cookies from "js-cookie";

import { toast } from "@/hooks/use-toast";

// Export the TokenManager
export const TokenManager = {
  // Set token with expiration
  setToken: (userId: string) => {
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    const tokenData = {
      userId,
      expiresAt: expirationTime,
    };

    // Store in cookie (accessible by both client and middleware)
    Cookies.set("authToken", JSON.stringify(tokenData), {
      expires: new Date(expirationTime),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Also store in localStorage as a backup
    localStorage.setItem("authToken", JSON.stringify(tokenData));

    // Set a timeout to automatically logout when token expires
    const timeUntilExpiration = expirationTime - new Date().getTime();
    setTimeout(() => {
      TokenManager.removeToken();
      window.location.href = "/login";
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
      });
    }, timeUntilExpiration);
  },

  // Get token and check if it's valid
  getToken: () => {
    // Try to get from cookie first
    const cookieToken = Cookies.get("authToken");
    const tokenData = cookieToken || localStorage.getItem("authToken");

    if (!tokenData) return null;

    try {
      const { userId, expiresAt } = JSON.parse(tokenData);
      const currentTime = new Date().getTime();

      if (currentTime > expiresAt) {
        // Token has expired
        TokenManager.removeToken();
        return null;
      }

      return userId;
    } catch (error) {
      console.error("Error parsing token:", error);
      TokenManager.removeToken();
      return null;
    }
  },

  // Remove token (logout)
  removeToken: () => {
    Cookies.remove("authToken", { path: "/" });
    localStorage.removeItem("authToken");
  },
};

// Export the logout function
export const logout = async () => {
  try {
    // Create Appwrite client
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

    const account = new Account(client);

    // Delete Appwrite session
    const sessions = await account.listSessions();
    if (sessions?.sessions?.length) {
      for (const session of sessions.sessions) {
        await account.deleteSession(session.$id);
      }
    }

    // Remove token
    TokenManager.removeToken();

    // Show success toast
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    // Redirect to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during logout:", error);
    toast({
      title: "Logout Failed",
      description: "There was an issue logging you out. Please try again.",
      variant: "destructive",
    });
  }
};
