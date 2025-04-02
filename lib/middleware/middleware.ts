// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/api/");

  // Check if the path is a dashboard path
  const isDashboardPath = path.includes("/dashboard/");

  // Get the token from cookies
  const token = request.cookies.get("authToken")?.value;

  // If the path is a dashboard path and there's no token, redirect to login
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the path is a public path and there's a token, redirect to dashboard
  if (isPublicPath && token) {
    try {
      const tokenData = JSON.parse(token);
      const { userId, expiresAt } = tokenData;

      // Check if token is expired
      if (new Date().getTime() > expiresAt) {
        // Token is expired, clear it and allow access to public path
        const response = NextResponse.next();
        response.cookies.delete("authToken");
        return response;
      }

      // Token is valid, redirect to dashboard
      return NextResponse.redirect(
        new URL(`/dashboard/patients/${userId}/new-appointment`, request.url)
      );
    } catch (error) {
      // If there's an error parsing the token, clear it and continue
      const response = NextResponse.next();
      response.cookies.delete("authToken");
      return response;
    }
  }

  // For all other cases, continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|fonts|images|favicon.ico|sitemap.xml).*)",
  ],
};
