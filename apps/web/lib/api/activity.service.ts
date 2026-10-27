/**
 * Infrastructure Service: Doctor Activity API Client
 * 
 * Single Responsibility: Network transport & payload envelope unwrapping
 * for the Doctor Activity Timeline feed.
 */

import apiClient from "./client";
import { ApiEnvelope } from "@/types/api.types";
import { ClinicalActivityItem } from "@/types/activity.types";

export const activityService = {
  /**
   * Fetches the consolidated chronological activity feed for the authenticated doctor.
   * 
   * @param limit Max number of events to retrieve (default: 50)
   * @returns Array of sorted ClinicalActivityItems
   */
  async getDoctorActivities(limit = 50): Promise<ClinicalActivityItem[]> {
    try {
      const response = await apiClient.get<ApiEnvelope<ClinicalActivityItem[]>>(
        "/doctor-portal/activities",
        {
          params: { limit },
        }
      );
      return response.data.data ?? [];
    } catch (error) {
      // In demo mode or if API is unreachable, provide realistic clinical mock data
      const isDemo =
        typeof window !== "undefined" &&
        (localStorage.getItem("vitalbook_demo") === "true" ||
          localStorage.getItem("vitalbook_demo_mode") === "true");

      if (isDemo || process.env.NODE_ENV === "development") {
        return getFallbackActivityFeed();
      }
      throw error;
    }
  },
};

/**
 * High-fidelity fallback fixtures for preview & offline resilience.
 */
function getFallbackActivityFeed(): ClinicalActivityItem[] {
  const now = new Date();
  const minsAgo = (mins: number) => new Date(now.getTime() - mins * 60 * 1000).toISOString();

  return [
    {
      id: "demo-evt-1",
      appointment_id: "01944810-746b-7352-87da-08575a74ef20",
      event_type: "appointment_booked",
      category: "booking",
      severity: "info",
      title: "New Patient Consultation Booked",
      description: "Sarah Jenkins reserved a 30-minute cardiology consultation slot.",
      timestamp: minsAgo(4),
      patient: {
        id: "01944810-746a-733a-b8bc-2144703a4ec5",
        name: "Sarah Jenkins",
        phone: "+213 555 123 456",
        avatar_url: null,
      },
      metadata: {
        status: "pending",
        reason: "Persistent palpitations during moderate exertion",
        fee: "3,500.00 DZD",
      },
    },
    {
      id: "demo-evt-2",
      appointment_id: "01944810-746b-7352-87da-08575a74ef20",
      event_type: "whatsapp_dispatched",
      category: "communication",
      severity: "info",
      title: "WhatsApp Dispatch Notice",
      description: "Interactive booking confirmation message sent to +213 555 123 456.",
      timestamp: minsAgo(3),
      patient: {
        id: "01944810-746a-733a-b8bc-2144703a4ec5",
        name: "Sarah Jenkins",
        phone: "+213 555 123 456",
        avatar_url: null,
      },
      metadata: {
        whatsapp_status: "sent",
        phone: "+213 555 123 456",
      },
    },
    {
      id: "demo-evt-3",
      appointment_id: "01944810-746b-7352-87da-08575a74ef20",
      event_type: "whatsapp_confirmed",
      category: "communication",
      severity: "success",
      title: "Patient Confirmed via WhatsApp",
      description: "Sarah Jenkins replied '1' to confirm clinic attendance.",
      timestamp: minsAgo(2),
      patient: {
        id: "01944810-746a-733a-b8bc-2144703a4ec5",
        name: "Sarah Jenkins",
        phone: "+213 555 123 456",
        avatar_url: null,
      },
      metadata: {
        status: "confirmed",
      },
    },
    {
      id: "demo-evt-4",
      appointment_id: "01944810-746b-7352-87da-08575a74ef21",
      event_type: "in_consultation",
      category: "triage",
      severity: "info",
      title: "Consultation In Progress",
      description: "Dr. Amine Mansouri initiated active clinical examination for Karim Belhadj.",
      timestamp: minsAgo(25),
      patient: {
        id: "01944810-746a-733a-b8bc-2144703a4ec6",
        name: "Karim Belhadj",
        phone: "+213 550 987 654",
        avatar_url: null,
      },
      metadata: {
        status: "in_consultation",
        reason: "Follow-up electrocardiogram review",
      },
    },
    {
      id: "demo-evt-5",
      appointment_id: "01944810-746b-7352-87da-08575a74ef22",
      event_type: "completed",
      category: "clinical",
      severity: "success",
      title: "Consultation Completed",
      description: "Clinical examination finalized and digital prescription generated for Amina Kaci.",
      timestamp: minsAgo(75),
      patient: {
        id: "01944810-746a-733a-b8bc-2144703a4ec7",
        name: "Amina Kaci",
        phone: "+213 551 234 567",
        avatar_url: null,
      },
      metadata: {
        status: "completed",
        fee: "3,500.00 DZD",
      },
    },
  ];
}
