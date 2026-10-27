export type TargetCitySlug = "algiers" | "tebessa";

export interface TargetCity {
  slug: TargetCitySlug;
  name: string;
  arabic_name: string;
  wilaya_code: 16 | 12;
  latitude: number;
  longitude: number;
  default_radius_km: number;
  clinics_count?: number;
}

export interface ClinicDoctor {
  id: string;
  name: string;
  specialty?: string;
  phone?: string;
  avatar_url?: string;
  consultation_fee_cents?: number;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  timezone?: string;
  logo_url?: string;
  is_active: boolean;
  city: string;
  wilaya_code: number;
  commune?: string;
  latitude: number;
  longitude: number;
  distance_meters?: number | null;
  distance_km?: number | null;
  doctors_count?: number;
  doctors?: ClinicDoctor[];
  created_at?: string;
  updated_at?: string;
}

export interface NearbyClinicsQuery {
  latitude?: number;
  longitude?: number;
  city?: TargetCitySlug | string;
  wilaya_code?: number;
  radius_km?: number;
  per_page?: number;
  search?: string;
}

export interface ClinicFilterQuery {
  city?: string;
  wilaya_code?: number;
  search?: string;
  per_page?: number;
}
