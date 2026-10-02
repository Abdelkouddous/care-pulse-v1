/**
 * CENTRALIZED MOCK DATA REPOSITORY
 * Adheres strictly to the architectural constraint:
 * Exactly 1 mock doctor, 1 mock patient, 1 mock admin, and their canonical consultation.
 */

export * from "./doctor.mock";
export * from "./patient.mock";
export * from "./appointment.mock";
export * from "./admin.mock";

import { MOCK_DOCTOR, MOCK_DOCTOR_LIST, MOCK_DOCTOR_DISPLAY, MOCK_DOCTOR_LEGACY, MOCK_DOCTORS_LEGACY } from "./doctor.mock";
import { MOCK_PATIENT, MOCK_PATIENTS_LIST } from "./patient.mock";
import { MOCK_APPOINTMENT, MOCK_APPOINTMENTS_LIST } from "./appointment.mock";
import { MOCK_ADMIN, DEMO_ADMIN_ID } from "./admin.mock";

export const mockRepository = {
  doctor: MOCK_DOCTOR,
  doctors: MOCK_DOCTOR_LIST,
  doctorDisplay: MOCK_DOCTOR_DISPLAY,
  doctorLegacy: MOCK_DOCTOR_LEGACY,
  doctorsLegacy: MOCK_DOCTORS_LEGACY,
  patient: MOCK_PATIENT,
  patients: MOCK_PATIENTS_LIST,
  appointment: MOCK_APPOINTMENT,
  appointments: MOCK_APPOINTMENTS_LIST,
  admin: MOCK_ADMIN,
  adminId: DEMO_ADMIN_ID,
};

export default mockRepository;
