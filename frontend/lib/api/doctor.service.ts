import apiClient from "./client";
import { ApiEnvelope, Doctor } from "@/types/api.types";
import { MOCK_DOCTOR, MOCK_APPOINTMENTS_LIST } from "@/mocks/data";

export interface DoctorFilters {
  specialty_id?: string;
  search?: string;
  per_page?: number;
}

export const doctorService = {
  async getDoctors(filters: DoctorFilters = {}): Promise<{ doctors: Doctor[]; meta?: any }> {
    try {
      const res = await apiClient.get<ApiEnvelope<Doctor[]>>("/doctors", {
        params: filters,
      });
      return {
        doctors: res.data.data,
        meta: res.data.meta,
      };
    } catch {
      // Offline / Demo fallback: return single canonical mock doctor
      return {
        doctors: [MOCK_DOCTOR],
        meta: { total: 1 },
      };
    }
  },

  async getDoctorById(id: string): Promise<Doctor> {
    try {
      const res = await apiClient.get<ApiEnvelope<Doctor>>(`/doctors/${id}`);
      return res.data.data;
    } catch {
      return MOCK_DOCTOR;
    }
  },

  async getDoctorSlots(id: string, date: string): Promise<string[]> {
    try {
      const res = await apiClient.get<ApiEnvelope<{ slots: string[] }>>(`/doctors/${id}/slots`, {
        params: { date },
      });
      return res.data.data.slots;
    } catch {
      return [
        "09:00:00",
        "09:30:00",
        "10:00:00",
        "10:30:00",
        "11:00:00",
        "14:00:00",
        "14:30:00",
        "15:00:00",
        "15:30:00",
        "16:00:00",
      ];
    }
  },

  async getDoctorAppointments(): Promise<any[]> {
    try {
      const res = await apiClient.get<ApiEnvelope<any[]>>("/doctor-portal/appointments");
      return res.data.data;
    } catch {
      return MOCK_APPOINTMENTS_LIST;
    }
  },

  async updateDoctorAppointmentStatus(id: string, status: string, reason?: string): Promise<boolean> {
    try {
      const res = await apiClient.put<ApiEnvelope<{ success: boolean }>>(
        `/doctor-portal/appointments/${id}/status`,
        { status, reason }
      );
      return res.data.data.success;
    } catch {
      return true;
    }
  },
};
