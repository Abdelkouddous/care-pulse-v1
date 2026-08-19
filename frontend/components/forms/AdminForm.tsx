"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { getAdmin } from "@/lib/actions/admin.actions";
import { AdminFormValidation } from "@/lib/validation";

import { SubmitButton } from "../ui/SubmitButton";

import { CustomFormField } from "./CustomFormField";

export enum FormFieldType {
  INPUT = "input",
}
export function AdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof AdminFormValidation>>({
    resolver: zodResolver(AdminFormValidation),
    defaultValues: {
      adminId: "",
    },
  });

  async function onSubmit({ adminId }: z.infer<typeof AdminFormValidation>) {
    setIsLoading(true);

    try {
      const fetchedAdmin = await getAdmin(adminId);
      if (fetchedAdmin?.$id === adminId) {
        router.push(`../admin/${adminId}/page`);
      } else {
        alert(
          "You are not an admin. Please contact the tech team for an admin account."
        );
      }
    } catch (err) {
      console.log("Error during admin login:", err);
      alert("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Prevent form submission on Enter key
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const DEMO_ADMIN_ID = "admin_pulse_demo_01";

  const handleDemoFill = () => {
    form.setValue("adminId", DEMO_ADMIN_ID);
  };

  const handleDemoSubmit = async () => {
    form.setValue("adminId", DEMO_ADMIN_ID);
    await onSubmit({ adminId: DEMO_ADMIN_ID });
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center space-y-2 mb-6">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            Admin Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Admin Authentication
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Manage your healthcare platform with Pulse Admin Dashboard
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-2 sm:p-4"
            >
              <CardContent className="space-y-6 pt-6 px-4 sm:px-6 pb-6">
                {/* Demo Mode / Mock Credentials Card */}
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-left shadow-sm">
                  <div className="flex items-center justify-between pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <span>🧪</span> Test & Demo Credentials
                    </span>
                    <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      Instant Access
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Test without creating an account:
                  </p>
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-900/80 p-2.5 font-mono text-xs text-emerald-300 border border-emerald-800/40">
                    <span className="truncate"><strong>ID:</strong> {DEMO_ADMIN_ID}</span>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleDemoFill}
                        className="rounded bg-gray-800 px-2 py-1 text-[11px] font-medium text-gray-200 hover:bg-gray-700 transition"
                      >
                        Fill
                      </button>
                      <button
                        type="button"
                        onClick={handleDemoSubmit}
                        disabled={isLoading}
                        className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 transition"
                      >
                        1-Click Login
                      </button>
                    </div>
                  </div>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="adminId"
                  label="Admin ID"
                  placeholder="example: admin_pulse_demo_01"
                  iconSrc="/assets/icons/user.svg"
                  iconAlt="admin"
                  onKeyDown={handleKeyDown}
                />

                <SubmitButton
                  isLoading={isLoading}
                  className="w-full bg-emerald-600 py-3 text-lg transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Authenticate
                </SubmitButton>

                <div className="mt-4 border-t border-gray-200 pt-4 text-center dark:border-gray-700 space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {"Don't have an admin ID? "}
                    <Link
                      href="/contact"
                      className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Contact us
                    </Link>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Not an admin?{" "}
                    <Link
                      href="/"
                      className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Go back to home
                    </Link>
                  </p>
                </div>
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
}
