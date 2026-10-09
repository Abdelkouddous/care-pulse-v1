import apiClient from "./client";
import { ApiEnvelope, Specialty } from "@/types/api.types";

export const specialtyService = {
  async getSpecialties(): Promise<Specialty[]> {
    const res = await apiClient.get<ApiEnvelope<Specialty[]>>("/specialties");
    return res.data.data;
  },
};
