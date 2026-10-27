import apiClient from "./client";
import {
  Clinic,
  TargetCity,
  NearbyClinicsQuery,
  ClinicFilterQuery,
} from "@/types/clinic";
import { TARGET_CITIES } from "@/constants/cities";

export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    total?: number;
    current_page?: number;
    per_page?: number;
    last_page?: number;
  };
}

/**
 * Fallback clinics matching the backend PostGIS database seeder
 * for offline demonstration and resilience.
 */
export const FALLBACK_CLINICS: Clinic[] = [
  {
    id: "58b759e3-41f6-47d2-aa1d-35e004849e52",
    name: "Wateen Medical Center - Alger Centre",
    email: "contact@wateensoft.com",
    address: "12 Rue Didouche Mourad, Alger",
    phone: "+213 21 00 11 22",
    city: "Algiers",
    wilaya_code: 16,
    commune: "Alger Centre",
    latitude: 36.7538,
    longitude: 3.0588,
    is_active: true,
    doctors_count: 3,
    distance_km: 0.0,
    doctors: [
      {
        id: "doc-1",
        name: "Dr. Aymen Hamel",
        specialty: "General Medicine",
        phone: "+213 549 88 24 56",
        consultation_fee_cents: 250000,
      },
    ],
  },
  {
    id: "77c191a2-8e3b-4c4f-9521-b3b3e61c1001",
    name: "Clinique Médico-Chirurgicale Hydra",
    email: "hydra@vitalbook.com",
    address: "24 Boulevard Sidi Yahia, Hydra, Alger",
    phone: "+213 21 60 77 88",
    city: "Algiers",
    wilaya_code: 16,
    commune: "Hydra",
    latitude: 36.7441,
    longitude: 3.0420,
    is_active: true,
    doctors_count: 4,
    distance_km: 2.1,
    doctors: [
      {
        id: "doc-2",
        name: "Dr. Samy Benali",
        specialty: "Cardiology",
        phone: "+213 550 12 34 56",
        consultation_fee_cents: 350000,
      },
    ],
  },
  {
    id: "88d292b3-9f4c-5d5a-8632-c4c4f72d2002",
    name: "Wateen Polyclinique Tébessa Centre",
    email: "tebessa.centre@wateensoft.com",
    address: "Avenue de la Paix, Tébessa Centre",
    phone: "+213 37 49 12 34",
    city: "Tébessa",
    wilaya_code: 12,
    commune: "Tébessa",
    latitude: 35.4042,
    longitude: 8.1242,
    is_active: true,
    doctors_count: 2,
    distance_km: 0.0,
    doctors: [
      {
        id: "doc-3",
        name: "Dr. Meriem Khelif",
        specialty: "Pediatrics",
        phone: "+213 661 22 33 44",
        consultation_fee_cents: 200000,
      },
    ],
  },
  {
    id: "99e393c4-0a5d-6e6b-9743-d5d5a83e3003",
    name: "Centre Médical El Mountazah Tébessa",
    email: "mountazah.tebessa@vitalbook.com",
    address: "Boulevard Houari Boumediene, El Mountazah, Tébessa",
    phone: "+213 37 48 55 66",
    city: "Tébessa",
    wilaya_code: 12,
    commune: "Tébessa",
    latitude: 35.418,
    longitude: 8.115,
    is_active: true,
    doctors_count: 3,
    distance_km: 1.8,
    doctors: [
      {
        id: "doc-4",
        name: "Dr. Walid Bouzid",
        specialty: "Dermatology",
        phone: "+213 662 99 88 77",
        consultation_fee_cents: 300000,
      },
    ],
  },
];

/**
 * Service encapsulating all Clinic Geolocation and PostGIS endpoint communications.
 * Respects Single Responsibility Principle (SRP) by decoupling HTTP transport from UI logic.
 */
export const clinicService = {
  /**
   * Retrieve active target launch cities (Algiers and Tébessa).
   * Backend endpoint: GET /api/v1/clinics/cities
   */
  async getTargetCities(): Promise<TargetCity[]> {
    try {
      const response = await apiClient.get<ApiEnvelope<TargetCity[]>>("/clinics/cities");
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      }
      return TARGET_CITIES;
    } catch (err) {
      console.warn("Falling back to local TARGET_CITIES configuration:", err);
      return TARGET_CITIES;
    }
  },

  /**
   * Search clinics within spatial proximity using backend PostGIS ST_DWithin / ST_DistanceSphere.
   * Backend endpoint: GET /api/v1/clinics/nearby
   */
  async getNearbyClinics(query: NearbyClinicsQuery = {}): Promise<Clinic[]> {
    try {
      const response = await apiClient.get<ApiEnvelope<Clinic[]>>("/clinics/nearby", {
        params: query,
      });
      return response.data?.data ?? [];
    } catch (err) {
      console.warn("Falling back to local seed clinics for proximity query:", err);
      // Filter fallback clinics by city / wilaya
      return FALLBACK_CLINICS.filter((c) => {
        if (query.wilaya_code && c.wilaya_code !== Number(query.wilaya_code)) {
          return false;
        }
        if (query.city && c.city.toLowerCase() !== query.city.toLowerCase()) {
          return false;
        }
        return true;
      });
    }
  },

  /**
   * List clinics with optional city or wilaya filtering.
   * Backend endpoint: GET /api/v1/clinics
   */
  async getClinics(filters: ClinicFilterQuery = {}): Promise<Clinic[]> {
    try {
      const response = await apiClient.get<ApiEnvelope<Clinic[]>>("/clinics", {
        params: filters,
      });
      return response.data?.data ?? [];
    } catch (err) {
      console.warn("Falling back to local seed clinics for clinic listing:", err);
      return FALLBACK_CLINICS.filter((c) => {
        if (filters.wilaya_code && c.wilaya_code !== Number(filters.wilaya_code)) {
          return false;
        }
        if (filters.city && c.city.toLowerCase() !== filters.city.toLowerCase()) {
          return false;
        }
        return true;
      });
    }
  },

  /**
   * Fetch a single clinic by UUID.
   * Backend endpoint: GET /api/v1/clinics/:id
   */
  async getClinicById(id: string): Promise<Clinic | null> {
    try {
      const response = await apiClient.get<ApiEnvelope<Clinic>>(`/clinics/${id}`);
      return response.data?.data ?? null;
    } catch (err) {
      console.warn(`Falling back for clinic ${id}:`, err);
      return FALLBACK_CLINICS.find((c) => c.id === id) || null;
    }
  },
};

export default clinicService;
