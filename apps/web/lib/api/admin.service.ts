import apiClient from "./client";
import { ApiEnvelope, Appointment, DashboardStats, Doctor, PatientUser } from "@/types/api.types";

export interface AdminAppointmentFilters {
  status?: string;
  doctor_id?: string;
  date?: string;
  per_page?: number;
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get<ApiEnvelope<DashboardStats>>("/admin/dashboard");
    return res.data.data;
  },

  async getAppointments(filters: AdminAppointmentFilters = {}): Promise<{
    appointments: Appointment[];
    meta?: any;
  }> {
    const res = await apiClient.get<ApiEnvelope<Appointment[]>>("/admin/appointments", {
      params: filters,
    });
    return {
      appointments: res.data.data,
      meta: res.data.meta,
    };
  },

  async updateAppointmentStatus(id: string, status: string, reason?: string): Promise<boolean> {
    const res = await apiClient.put<ApiEnvelope<{ success: boolean }>>(
      `/admin/appointments/${id}/status`,
      { status, reason }
    );
    return res.data.data.success;
  },

  async triggerWhatsAppPing(id: string): Promise<boolean> {
    const res = await apiClient.post<ApiEnvelope<{ success: boolean }>>(
      `/admin/appointments/${id}/whatsapp-ping`
    );
    return res.data.data.success;
  },

  async getPatients(perPage = 15): Promise<{ patients: PatientUser[]; meta?: any }> {
    const res = await apiClient.get<ApiEnvelope<PatientUser[]>>("/admin/patients", {
      params: { per_page: perPage },
    });
    return {
      patients: res.data.data,
      meta: res.data.meta,
    };
  },

  async getDoctors(perPage = 15): Promise<{ doctors: Doctor[]; meta?: any }> {
    const res = await apiClient.get<ApiEnvelope<Doctor[]>>("/admin/doctors", {
      params: { per_page: perPage },
    });
    return {
      doctors: res.data.data,
      meta: res.data.meta,
    };
  },

  async createDoctor(data: any): Promise<Doctor> {
    const res = await apiClient.post<ApiEnvelope<Doctor>>("/admin/doctors", data);
    return res.data.data;
  },

  async updateDoctor(id: string, data: any): Promise<boolean> {
    const res = await apiClient.put<ApiEnvelope<{ success: boolean }>>(`/admin/doctors/${id}`, data);
    return res.data.data.success;
  },

  async deleteDoctor(id: string): Promise<boolean> {
    const res = await apiClient.delete<ApiEnvelope<{ success: boolean }>>(`/admin/doctors/${id}`);
    return res.data.data.success;
  },
};
