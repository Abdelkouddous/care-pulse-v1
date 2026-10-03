import apiClient from "./client";
import { ApiEnvelope, Appointment, PatientUser } from "@/types/api.types";
import { MOCK_PATIENT, MOCK_APPOINTMENTS_LIST } from "@/mocks/data";

export const patientService = {
  async getProfile(): Promise<PatientUser> {
    try {
      const res = await apiClient.get<ApiEnvelope<PatientUser>>("/patients/me");
      return res.data.data;
    } catch (err) {
      if (typeof window !== "undefined" && (localStorage.getItem("vitalbook_demo") === "true" || localStorage.getItem("carepulse_demo") === "true")) {
        return MOCK_PATIENT;
      }
      throw err;
    }
  },

  async updateProfile(data: Partial<PatientUser>): Promise<PatientUser> {
    const res = await apiClient.put<ApiEnvelope<PatientUser>>("/patients/me", data);
    return res.data.data;
  },

  async getMyAppointments(): Promise<Appointment[]> {
    try {
      const res = await apiClient.get<ApiEnvelope<Appointment[]>>("/patients/me/appointments");
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    } catch (err) {
      if (typeof window !== "undefined" && (localStorage.getItem("vitalbook_demo") === "true" || localStorage.getItem("carepulse_demo") === "true")) {
        return MOCK_APPOINTMENTS_LIST;
      }
      return [];
    }
  },
};
