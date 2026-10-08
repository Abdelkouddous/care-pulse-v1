import apiClient from "./client";
import { ApiEnvelope, Appointment } from "@/types/api.types";

export interface BookAppointmentDto {
  doctor_id: string;
  scheduled_at: string;
  reason: string;
  notes?: string;
  clinic_id?: string;
}

export const appointmentService = {
  async book(dto: BookAppointmentDto): Promise<Appointment> {
    try {
      const res = await apiClient.post<ApiEnvelope<Appointment>>("/appointments", dto);
      return res.data.data;
    } catch (err: any) {
      if (
        typeof window !== "undefined" &&
        (localStorage.getItem("vitalbook_demo") === "true" ||
          localStorage.getItem("vitalbook_demo") === "true" ||
          localStorage.getItem("vitalbook_token")?.startsWith("patient_otp_token_") ||
          localStorage.getItem("vitalbook_token")?.startsWith("mock_bearer_token_"))
      ) {
        return {
          id: "demo-appt-" + Date.now(),
          patient_id: "demo-patient-sarah",
          doctor_id: dto.doctor_id,
          clinic_id:
            dto.clinic_id ||
            process.env.NEXT_PUBLIC_DEFAULT_CLINIC_ID ||
            "58b759e3-41f6-47d2-aa1d-35e004849e52",
          scheduled_at: dto.scheduled_at,
          status: "pending",
          reason: dto.reason,
          notes: dto.notes,
          consultation_fee_cents: 400000,
          created_at: new Date().toISOString(),
        } as Appointment;
      }
      throw err;
    }
  },

  async getById(id: string): Promise<Appointment> {
    const res = await apiClient.get<ApiEnvelope<Appointment>>(`/appointments/${id}`);
    return res.data.data;
  },

  async cancel(id: string, reason: string): Promise<boolean> {
    const res = await apiClient.put<ApiEnvelope<{ success: boolean }>>(
      `/appointments/${id}/cancel`,
      { reason }
    );
    return res.data.data.success;
  },

  async getClinicHistory(): Promise<{ appointments: Appointment[]; hasVisitedBefore: boolean }> {
    const res = await apiClient.get<ApiEnvelope<Appointment[]>>("/appointments/history/clinic");
    return {
      appointments: res.data.data,
      hasVisitedBefore: Boolean(res.data.meta?.has_visited_before),
    };
  },
};
