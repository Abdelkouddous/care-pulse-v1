"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { getAdmin } from "@/lib/actions/admin.actions";
import { DoctorFormValidation } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "../ui/SubmitButton";
import { CustomFormField } from "./CustomFormField";
import { getDoctors } from "@/lib/actions/doctors.actions";

export enum FormFieldType {
  INPUT = "input",
}

export function DoctorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof DoctorFormValidation>>({
    resolver: zodResolver(DoctorFormValidation),
    defaultValues: {
      doctorId: "", // This should match the form's expected input
    },
  });

  async function onSubmit({ doctorId }: z.infer<typeof DoctorFormValidation>) {
    setIsLoading(true);

    try {
      // Fetch the admin details from the database
      const fetchedAdmin = await getDoctors();
      console.log("DoctorID submitted", doctorId);
      console.log("Doctor ID being fetched:", fetchedAdmin);
      // Check if fetchedAdmin exists and matches the provided doctorId
      if (fetchedAdmin?.$id === doctorId) {
        // Redirect to doctor dashboard
        router.push(`
          ../doctor/${doctorId}/page`);
      } else {
        alert(
          "You are not a doctor. Please contact the tech team for a doctor account."
        );
      }
    } catch (err) {
      console.log("Error during doctor login:", err);
      alert("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <section className="mb-6 space-y-2 m-12">
          <p className="text-dark-600 text-center ">Input your doctor ID</p>
        </section>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-12">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="doctorId" // Ensure this matches the form state
            label="Doctor ID"
            placeholder="example: 66fef3z40dd29b9ab761"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          <SubmitButton isLoading={isLoading}>Login</SubmitButton>
        </form>
      </Form>
      <div>
        <p className="text-center">
          Don't have an ID? <br></br>
          <span className="hover:font-bold hover:scale-105 hover:cursor-pointer">
            {" "}
            Contact us
          </span>
        </p>
      </div>
    </div>
  );
}
