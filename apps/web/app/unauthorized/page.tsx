import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "403 - Unauthorized Access | VitalBook",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-16">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Shield Icon Badge */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 shadow-xl backdrop-blur-sm">
          <ShieldAlert className="size-10" />
        </div>

        {/* Security Alert Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-bold uppercase tracking-wider">
            <Lock className="size-3" />
            <span>403 Forbidden</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Access Restricted
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            This operational partition requires verified administrative credentials. Unauthenticated entry vectors and direct navigational attempts are strictly prevented by Edge security policies.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="default"
              className="w-full gap-2 rounded-xl text-xs font-bold border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="size-4" />
              <span>Return to Homepage</span>
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              roleVariant="patient"
              size="default"
              className="w-full rounded-xl text-xs font-bold shadow-md"
            >
              <span>User Sign In</span>
            </Button>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          Security Incident Logged • RBAC Gatekeeper Protocol
        </p>
      </div>
    </div>
  );
}
