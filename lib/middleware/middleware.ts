// lib/middleware/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { TokenManager } from "@/lib/auth";

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the path is a dashboard route that needs protection
  const isDashboardRoute = pathname.startsWith("/dashboard/patients/");

  // Allow access to login and register routes
  const isLoginRoute = pathname.includes("/login");
  const isRegisterRoute = pathname.includes("/register");

  // If it's a dashboard route but not login or register, check for authentication
  if (isDashboardRoute && !isLoginRoute && !isRegisterRoute) {
    // Get the userId from the URL
    // The URL pattern is /dashboard/patients/[userId]/...
    const urlParts = pathname.split("/");
    const urlUserId = urlParts[3]; // Index 3 should be the userId

    // Get the token from cookies or localStorage
    const token = TokenManager.getToken();

    // If no token exists or the token doesn't match the URL userId, redirect to login
    if (!token || token !== urlUserId) {
      // Create the login URL with the userId
      const loginUrl = new URL(
        `/dashboard/patients/${urlUserId}/login`,
        request.url
      );

      // Add a redirect parameter to return after login
      loginUrl.searchParams.set("redirect", pathname);

      // Redirect to the login page
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  // Match all dashboard patient routes except login and register
  matcher: ["/dashboard/patients/:userId/:path*"],
};
