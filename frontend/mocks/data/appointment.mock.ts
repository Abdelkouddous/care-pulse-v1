import { Appointment } from "@/types/api.types";
import { MOCK_DOCTOR } from "./doctor.mock";
import { MOCK_PATIENT } from "./patient.mock";

/**
 * CANONICAL MOCK APPOINTMENT FIXTURE
 * Represents the baseline consultation linking the single mock patient and mock doctor.
 */
export const MOCK_APPOINTMENT: Appointment = {
  id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
  clinic_id: MOCK_DOCTOR.clinic_id,
  patient_id: MOCK_PATIENT.id,
  doctor_id: MOCK_DOCTOR.id,
  scheduled_at: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString();
  })(),
  status: "scheduled",
  consultation_fee_cents: MOCK_DOCTOR.consultation_fee_cents,
  reason: "Cardiovascular consultation & routine ECG follow-up",
  notes: "Patient reports slight dyspnea on exertion. Review blood pressure logs.",
  doctor: MOCK_DOCTOR,
  patient: MOCK_PATIENT,
};

export const MOCK_APPOINTMENTS_LIST: Appointment[] = [
  MOCK_APPOINTMENT,
  {
    id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34",
    clinic_id: MOCK_DOCTOR.clinic_id,
    patient_id: MOCK_PATIENT.id,
    doctor_id: MOCK_DOCTOR.id,
    scheduled_at: "2026-08-15T09:30:00Z",
    status: "completed",
    consultation_fee_cents: MOCK_DOCTOR.consultation_fee_cents,
    reason: "Initial cardiac assessment and blood pressure normalization",
    notes: "ECG normal. Sinus rhythm. Clinical follow-up consultation recommended in 6 months.",
    doctor: MOCK_DOCTOR,
    patient: MOCK_PATIENT,
  },
];
