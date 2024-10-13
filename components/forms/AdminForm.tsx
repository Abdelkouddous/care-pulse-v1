"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAdmin } from "@/lib/actions/admin.actions";
import { AdminFormValidation } from "@/lib/validation";
import { Form } from "@/components/ui/form";
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
      adminId: "", // This should match the form's expected input
    },
  });

  async function onSubmit({ adminId }: z.infer<typeof AdminFormValidation>) {
    setIsLoading(true);

    try {
      // Fetch the admin details from the database
      const fetchedAdmin = await getAdmin(adminId);
      console.log("Admin ID submitted", adminId);
      console.log("fetchedAdmin ID being fetched:", fetchedAdmin);

      // Check if fetchedAdmin exists and matches the provided adminId
      if (fetchedAdmin?.$id === adminId) {
        // Redirect to admin dashboard
        router.push(`
          ../admin/${adminId}/page`);
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

  return (
    <Form {...form}>
      <section className="mb-12 space-y-2 m-12">
        <p className="text-dark-600 text-center ">Input your admin ID</p>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-12">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="adminId" // Ensure this matches the form state
          label="Admin ID"
          placeholder="example: 66fef3z40dd29b9ab761"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <SubmitButton isLoading={isLoading}>Login</SubmitButton>
      </form>
    </Form>
  );
}
