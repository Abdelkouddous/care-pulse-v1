export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    message?: string;
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
    [key: string]: any;
  };
  errors?: Array<{
    status?: string;
    title?: string;
    detail: string;
  }>;
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  doctors_count?: number;
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export interface Doctor {
  id: string;
  clinic_id: string;
  specialty_id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  consultation_fee_cents: number;
  license_number: string;
  is_active: boolean;
  specialty?: Specialty;
  availabilities?: DoctorAvailability[];
}

export interface PatientUser {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  allergies?: string;
  current_medications?: string;
}

export type AppointmentStatus = 'pending' | 'scheduled' | 'cancelled' | 'completed' | 'no_show';

export type WhatsAppStatus = 'not_sent' | 'pending' | 'sent' | 'delivered' | 'confirmed' | 'cancelled' | 'failed';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  clinic_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  whatsapp_status?: WhatsAppStatus;
  whatsapp_message_id?: string;
  whatsapp_last_sent_at?: string;
  whatsapp_confirmed_at?: string;
  reason: string;
  notes?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  consultation_fee_cents: number;
  patient?: PatientUser;
  doctor?: Doctor;
  clinic?: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  created_at?: string;
}

export interface DashboardStats {
  total: number;
  scheduled: number;
  pending: number;
  cancelled: number;
  completed: number;
}

export interface AuthSession {
  token: string;
  user: PatientUser | Doctor | { id: string; name: string; email: string; role: string };
  role: 'patient' | 'doctor' | 'admin' | 'super_admin' | 'clinic_admin';
}
