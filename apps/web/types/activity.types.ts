/**
 * Domain-Driven Design (DDD) - Activity Aggregate & Value Objects
 * 
 * Bounded Context: Doctor Clinical Workspace
 * Defines the contract for clinical audit timeline items, telemetry events,
 * and filtering criteria.
 */

export type ActivityCategory = "booking" | "communication" | "triage" | "clinical";

export type ActivitySeverity = "info" | "success" | "warning" | "alert";

export type ActivityEventType =
  | "appointment_booked"
  | "whatsapp_dispatched"
  | "whatsapp_delivery_failed"
  | "whatsapp_confirmed"
  | "in_consultation"
  | "completed"
  | "cancelled"
  | "triage_status_updated";

export interface ActivityPatientSnapshot {
  id?: string;
  name: string;
  phone: string;
  avatar_url?: string | null;
}

export interface ActivityMetadata {
  status?: string;
  reason?: string;
  fee?: string;
  scheduled_at?: string;
  whatsapp_status?: string;
  phone?: string;
  [key: string]: any;
}

/**
 * Immutable Clinical Activity Event Item (Aggregate Entity)
 */
export interface ClinicalActivityItem {
  id: string;
  appointment_id: string;
  event_type: ActivityEventType | string;
  category: ActivityCategory;
  severity: ActivitySeverity;
  title: string;
  description: string;
  timestamp: string; // ISO 8601
  patient: ActivityPatientSnapshot;
  metadata?: ActivityMetadata;
}

export type ActivityFilterCategory = "all" | ActivityCategory;

export interface ActivityFeedFilterState {
  category: ActivityFilterCategory;
  searchQuery: string;
  severity?: ActivitySeverity | "all";
}

export interface ActivityMetricsSummary {
  totalEvents: number;
  newBookings: number;
  confirmedDeliveries: number;
  triageTransitions: number;
}
