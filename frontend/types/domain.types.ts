// types for Patient and Appointment

export interface Patient {
  $id?: string;
  userId: string;
  name: string;
  // email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment {
  $id?: string;
  patient: Patient | string;
  schedule: Date | string;
  status: Status;
  primaryPhysician: string;
  reason: string | undefined;
  note: string | null | undefined;
  userId: string;
  // appointmentId: string;
  cancellationReason: string | null;
}
