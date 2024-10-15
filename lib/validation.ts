import { z } from "zod";

export const AdminFormValidation = z.object({
  adminId: z.string().min(20, "ID must be at exactly 20 characters"),
  // email: z.string().email("Invalid email address"),
});
export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  // email: z.string().email("Invalid email address"),
  phone: z.string().refine(
    (
      phone ///
    ) => /^\+213[567]\d{8}$/.test(phone),
    // /^\+\d{9,15}$/.test(phone),
    {
      message: `Phone number must start with 5, 6, or 7 (DZ only)`,
    }
  ),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  // email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+213[567]\d{8}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["Male", "Female"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  // occupation: z
  //   .string()
  //   .min(2, "Occupation must be at least 2 characters")
  //   .max(500, "Occupation must be at most 500 characters")
  //   .optional(),
  // emergencyContactName: z
  //   .string()
  //   .min(2, "Contact name must be at least 2 characters")
  //   .max(50, "Contact name must be at most 50 characters")
  //   .optional(),
  // emergencyContactNumber: z
  //   .string()
  //   .refine(
  //     (emergencyContactNumber) =>
  //       /^\+213[567]\d{8}$/.test(emergencyContactNumber),
  //     "Invalid phone number"
  //   )
  //   .optional(),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  // insuranceProvider: z
  //   .string()
  //   .min(2, "Insurance name must be at least 2 characters")
  //   .max(50, "Insurance name must be at most 50 characters"),
  // insurancePolicyNumber: z
  //   .string()
  //   .min(2, "Policy number must be at least 2 characters")
  //   .max(50, "Policy number must be at most 50 characters"),
  // allergies: z.string().optional(),
  // currentMedication: z.string().optional(),
  // familyMedicalHistory: z.string().optional(),
  // pastMedicalHistory: z.string().optional(),
  // identificationType: z.string().optional(),
  // identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
