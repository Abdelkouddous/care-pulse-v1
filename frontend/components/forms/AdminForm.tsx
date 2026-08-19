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
    <section className="mt-16 md:mt-16">
      <div className="py-3">
        <Card className="my-4 overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:my-2">
          <h1 className="px-6 pb-4 pt-8 text-center font-serif text-5xl font-bold tracking-tight text-gray-800 fade-in dark:text-white">
            Admin Portal
          </h1>

          <p className="mx-auto mb-8 max-w-2xl px-4 text-center text-lg text-gray-600 dark:text-gray-300">
            Manage your healthcare platform with Pulse Admin Dashboard
          </p>

          <div className="mx-auto my-2 flex max-w-6xl justify-between px-4 fade-in md:px-8">
            <Card className="mx-auto w-full overflow-hidden border-0 shadow-lg dark:bg-gray-800 md:max-w-md">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-1 md:p-2"
                >
                  <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-4 pt-6">
                    <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
                      Admin Authentication
                    </h2>
                    <p className="text-center text-base text-gray-600 dark:text-gray-300 md:text-lg">
                      Enter your admin ID to continue
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6 px-6 pb-8">
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

                    <div className="mt-4 border-t border-gray-200 pt-4 text-center dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300">
                        {"Don't have an admin ID? "}
                        <Link
                          href="/contact"
                          className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          Contact us
                        </Link>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
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
        </Card>
      </div>
    </section>
  );
}
