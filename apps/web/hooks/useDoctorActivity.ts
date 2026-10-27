/**
 * Application Hook: useDoctorActivity
 * 
 * Single Responsibility: Manages state, real-time invalidation subscriptions,
 * and filtering for the Doctor Activity Feed timeline.
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/lib/api/activity.service";
import {
  ClinicalActivityItem,
  ActivityFilterCategory,
  ActivityMetricsSummary,
} from "@/types/activity.types";
import { useAuth } from "@/hooks/useAuth";
import { getEcho } from "@/lib/echo";

// Canonical Dr. Amine Mansouri fallback ID aligned with database seeders
const DEFAULT_DOCTOR_ID = "01a155f0-6ee6-737f-9f0c-5971894a6849";

export function useDoctorActivity() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const doctorId = user?.id || DEFAULT_DOCTOR_ID;

  // Local Filter States
  const [selectedCategory, setSelectedCategory] = useState<ActivityFilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // 1. Fetch Activity Feed via React Query
  const {
    data: rawActivities = [],
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["doctor", "activity-feed", doctorId],
    queryFn: () => activityService.getDoctorActivities(100),
    staleTime: 15 * 1000, // 15 seconds fresh window
    refetchOnWindowFocus: true,
  });

  // 2. Real-Time Reverb WebSocket Invalidation
  useEffect(() => {
    const echo = getEcho();
    if (!echo || !doctorId) return;

    try {
      const channel = echo.private(`doctor.${doctorId}`);

      channel.subscribed(() => {
        setIsLiveConnected(true);
      });

      channel.error(() => {
        setIsLiveConnected(false);
      });

      // Listen for appointment booking broadcasts
      channel.listen(".AppointmentCreated", () => {
        queryClient.invalidateQueries({
          queryKey: ["doctor", "activity-feed", doctorId],
        });
      });

      // Listen for triage/status update broadcasts
      channel.listen(".AppointmentStatusUpdated", () => {
        queryClient.invalidateQueries({
          queryKey: ["doctor", "activity-feed", doctorId],
        });
      });

      return () => {
        channel.stopListening(".AppointmentCreated");
        channel.stopListening(".AppointmentStatusUpdated");
        echo.leave(`doctor.${doctorId}`);
        setIsLiveConnected(false);
      };
    } catch {
      setIsLiveConnected(false);
    }
  }, [doctorId, queryClient]);

  // 3. Derived Filtered Feed (Clean SRP Pipeline)
  const filteredActivities = useMemo(() => {
    return rawActivities.filter((item: ClinicalActivityItem) => {
      // Category filter match
      const categoryMatch =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!categoryMatch) return false;

      // Free-text query match (Patient Name, Phone, Title, Description, Reason)
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const patientName = item.patient?.name?.toLowerCase() || "";
      const patientPhone = item.patient?.phone?.toLowerCase() || "";
      const title = item.title?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      const reason = item.metadata?.reason?.toLowerCase() || "";

      return (
        patientName.includes(q) ||
        patientPhone.includes(q) ||
        title.includes(q) ||
        desc.includes(q) ||
        reason.includes(q)
      );
    });
  }, [rawActivities, selectedCategory, searchQuery]);

  // 4. Clinical Metrics KPI Aggregation
  const metrics = useMemo<ActivityMetricsSummary>(() => {
    return {
      totalEvents: rawActivities.length,
      newBookings: rawActivities.filter((a) => a.category === "booking").length,
      confirmedDeliveries: rawActivities.filter(
        (a) => a.event_type === "whatsapp_confirmed"
      ).length,
      triageTransitions: rawActivities.filter(
        (a) => a.category === "triage" || a.category === "clinical"
      ).length,
    };
  }, [rawActivities]);

  return {
    activities: filteredActivities,
    rawCount: rawActivities.length,
    isLoading,
    isRefetching,
    isLiveConnected,
    metrics,
    error,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    refetch,
  };
}
