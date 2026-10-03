import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function handleAuthMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Retrieve auth credentials from cookies for Edge SSR verification (Dual-Read)
  const token =
    request.cookies.get("vitalbook_token")?.value ||
    request.cookies.get("carepulse_token")?.value ||
    request.cookies.get("user_token")?.value;
  const role =
    request.cookies.get("vitalbook_role")?.value ||
    request.cookies.get("carepulse_role")?.value ||
    request.cookies.get("user_role")?.value;
  const demo =
    request.cookies.get("vitalbook_demo")?.value ||
    request.cookies.get("carepulse_demo")?.value;
  const expiry = request.cookies.get("token_expiry")?.value;

  const isExpired = !!expiry && !isNaN(parseInt(expiry, 10)) && Date.now() > parseInt(expiry, 10);

  // Helper to purge all auth cookies on response
  const purgeAuthCookies = (res: NextResponse) => {
    res.cookies.delete("vitalbook_token");
    res.cookies.delete("carepulse_token");
    res.cookies.delete("user_token");
    res.cookies.delete("vitalbook_role");
    res.cookies.delete("carepulse_role");
    res.cookies.delete("vitalbook_demo");
    res.cookies.delete("carepulse_demo");
    res.cookies.delete("token_expiry");
  };

  // 1. Strict Edge Isolation & RBAC Gatekeeper for Admin Partition
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    // Admin login page handler: allow credentials entry, redirect if already authenticated as admin
    if (pathname === "/admin/login") {
      if (token && role?.toUpperCase() === "ADMIN" && !isExpired) {
        const redirectResponse = NextResponse.redirect(new URL("/admin/dashboard", request.url), 307);
        redirectResponse.headers.set("Cache-Control", "no-store, max-age=0");
        return redirectResponse;
      }
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }

    // Direct /admin or any protected /admin/:path* subroute
    const isAuthorizedAdmin = !!token && role?.toUpperCase() === "ADMIN" && !isExpired;

    if (!isAuthorizedAdmin) {
      // Immediate 307 redirection for unauthenticated or non-admin attempts
      const redirectResponse = NextResponse.redirect(new URL("/unauthorized", request.url), 307);
      redirectResponse.headers.set("Cache-Control", "no-store, max-age=0");

      if (isExpired) {
        purgeAuthCookies(redirectResponse);
      }

      return redirectResponse;
    }

    // Authenticated admin accessing /admin root -> normalize to /admin/dashboard
    if (pathname === "/admin") {
      const redirectResponse = NextResponse.redirect(new URL("/admin/dashboard", request.url), 307);
      redirectResponse.headers.set("Cache-Control", "no-store, max-age=0");
      return redirectResponse;
    }

    // Authenticated admin accessing /admin/:path*
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }

  // 2. Normalized Short Routes Redirection for Patient Workspaces
  if (pathname === "/patient") {
    return NextResponse.redirect(new URL("/patient/dashboard", request.url));
  }

  // If anyone accesses obsolete /dashboard route, route them to their specialized portal
  if (pathname.startsWith("/dashboard")) {
    if (role?.toUpperCase() === "DOCTOR") {
      return NextResponse.redirect(new URL("/doctors/dashboard", request.url));
    }
    if (role?.toUpperCase() === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/patient/dashboard", request.url));
  }

  const isShortRoute =
    pathname === "/profile" ||
    pathname === "/settings" ||
    pathname === "/edit-profile" ||
    pathname === "/my-appointments" ||
    pathname === "/new-appointment";

  if (isShortRoute) {
    if (pathname === "/profile") {
      return NextResponse.redirect(new URL("/patient/dashboard/profile", request.url));
    }
    if (pathname === "/settings" || pathname === "/edit-profile") {
      return NextResponse.redirect(new URL("/patient/dashboard/settings", request.url));
    }
    if (pathname === "/my-appointments") {
      return NextResponse.redirect(new URL("/patient/dashboard/appointments", request.url));
    }
    if (pathname === "/new-appointment") {
      return NextResponse.redirect(new URL("/patient/dashboard/book", request.url));
    }
  }

  // 3. Protected Patient Dashboard Routes
  const isProtectedRoute = pathname.startsWith("/patient/dashboard") || pathname.startsWith("/doctors/dashboard") || isShortRoute;

  if (isProtectedRoute) {
    if (!token && !demo) {
      return NextResponse.next();
    }

    if (isExpired) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      purgeAuthCookies(response);
      return response;
    }
  }

  return NextResponse.next();
}
