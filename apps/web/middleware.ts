import type { NextRequest } from "next/server";
import { handleAuthMiddleware } from "@/lib/middleware/authMiddleware";

export function middleware(request: NextRequest) {
  return handleAuthMiddleware(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile",
    "/settings",
    "/edit-profile",
    "/my-appointments",
    "/new-appointment",
  ],
};
