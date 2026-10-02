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
    const res = await apiClient.post<ApiEnvelope<Appointment>>("/appointments", dto);
    return res.data.data;
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
