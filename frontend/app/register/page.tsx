import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import RegisterForm from "@/components/forms/RegisterForm";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Patient Registration | VitalBook",
  description: "Register as a patient with CNAS integration and book appointments seamlessly.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft className="mr-1.5 size-3.5" /> Back to VitalBook Home
          </Link>
        </div>

        <PageHeader
          title="Patient Onboarding"
          subtitle="Complete the 3-step registration wizard to verify your identity, CNAS insurance, and medical record."
          badge={
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="size-3.5" /> CNAS Integrated
            </span>
          }
        />

        <Suspense
          fallback={
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading registration wizard...
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
