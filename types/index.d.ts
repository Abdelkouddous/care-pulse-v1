/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female";
// declare type Status = "pending ⏳" | "scheduled ✅" | "cancelled ❌";
declare type Status = "pending" | "scheduled" | "cancelled";
declare interface CreateUserParams {
  name: string;
  // email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  // occupation: string;
  // emergencyContactName: string;
  // emergencyContactNumber: string;
  primaryPhysician: string;
  // insuranceProvider: string;
  // insurancePolicyNumber: string;
  // allergies: string | undefined;
  // currentMedication: string | undefined;
  // familyMedicalHistory: string | undefined;
  // pastMedicalHistory: string | undefined;
  // identificationType: string | undefined;
  // identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

//Admin=================================
declare interface CreateAdminParams {
  adminName: string;
  // email: string;
  // adminphone: string;
}
declare interface Admin extends CreateAdminParams {
  $adminId: string;
}

declare interface RegisterAdminParams extends CreateAdminParams {
  adminId: string;
}
//Appointments=========================================================
declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
  // appointmentId: string;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  appointment: Appointment;
  type: string;
};
