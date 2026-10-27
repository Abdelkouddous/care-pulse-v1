import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService, BookAppointmentDto } from "@/lib/api/appointment.service";
import { patientService } from "@/lib/api/patient.service";
import { useAuth } from "@/hooks/useAuth";
import { getEcho } from "@/lib/echo";
import { toast } from "@/hooks/use-toast";

export function useAppointments() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const myAppointmentsQuery = useQuery({
    queryKey: ["appointments", "me"],
    queryFn: () => patientService.getMyAppointments(),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const clinicHistoryQuery = useQuery({
    queryKey: ["appointments", "history", "clinic"],
    queryFn: () => appointmentService.getClinicHistory(),
    enabled: false, // On-demand only to eliminate background noise
    retry: false,
  });

  // Real-time bidirectional status updates on the patient's private channel
  useEffect(() => {
    const echo = getEcho();
    const userId = user?.id;
    if (!echo || !userId) return;

    try {
      const channel = echo.private(`patient.${userId}`);

      channel.listen(".AppointmentStatusUpdated", (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["doctor-slots"] });

        const status = event?.status || "updated";
        const statusMap: Record<string, string> = {
          confirmed: "confirmed",
          cancelled: "cancelled",
          completed: "completed",
          in_consultation: "in consultation",
          scheduled: "scheduled",
        };
        const readableStatus = statusMap[status] ?? status;

        toast({
          title: "Appointment Status Updated",
          description: `Your appointment is now ${readableStatus}.`,
        });
      });

      return () => {
        channel.stopListening(".AppointmentStatusUpdated");
        echo.leave(`patient.${userId}`);
      };
    } catch {
      // Graceful degradation when WebSocket is not reachable
    }
  }, [user?.id, queryClient]);

  const bookMutation = useMutation({
    mutationFn: (dto: BookAppointmentDto) => appointmentService.book(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-slots"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      appointmentService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    appointments: myAppointmentsQuery.data ?? [],
    isLoading: myAppointmentsQuery.isLoading,
    clinicHistory: clinicHistoryQuery.data,
    bookAppointment: bookMutation,
    cancelAppointment: cancelMutation,
  };
}
