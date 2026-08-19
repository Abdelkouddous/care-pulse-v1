import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function handleAuthMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Short routes that require dynamic userId mapping
  const isShortRoute =
    pathname === "/profile" ||
    pathname === "/settings" ||
    pathname === "/edit-profile" ||
    pathname === "/my-appointments" ||
    pathname === "/new-appointment";

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || isShortRoute;

  // Get token from cookies
  const token = request.cookies.get("user_token")?.value;
  const expiry = request.cookies.get("token_expiry")?.value;

  if (isProtectedRoute) {
    // If no token exists, redirect to login
    if (!token || !expiry) {
      const redirectUrl = new URL("/signin", request.url);
      if (!isShortRoute) {
        redirectUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }

    // Check token expiration
    const expiryTime = parseInt(expiry);
    if (Date.now() > expiryTime) {
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("user_token");
      response.cookies.delete("token_expiry");
      return response;
    }

    // Handle short routes redirection
    if (isShortRoute) {
      if (pathname === "/profile") {
        return NextResponse.redirect(new URL(`/dashboard/patients/${token}/profile`, request.url));
      }
      if (pathname === "/settings" || pathname === "/edit-profile") {
        return NextResponse.redirect(new URL(`/dashboard/patients/${token}/edit-profile`, request.url));
      }
      if (pathname === "/my-appointments") {
        return NextResponse.redirect(new URL(`/dashboard/patients/${token}/my-appointments`, request.url));
      }
      if (pathname === "/new-appointment") {
        return NextResponse.redirect(new URL(`/dashboard/patients/${token}/new-appointment`, request.url));
      }
    }

    // For dashboard routes, verify userId in path matches token
    if (pathname.startsWith("/dashboard/patients/")) {
      const urlParts = pathname.split("/");
      const urlUserId = urlParts[3]; // Index 3 should be the userId

      if (urlUserId && urlUserId !== token) {
        // UserId in URL doesn't match token, redirect to correct dashboard
        return NextResponse.redirect(
          new URL(`/dashboard/patients/${token}/new-appointment`, request.url)
        );
      }
    }
  }

  return NextResponse.next();
}
