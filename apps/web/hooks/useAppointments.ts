import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService, BookAppointmentDto } from "@/lib/api/appointment.service";
import { patientService } from "@/lib/api/patient.service";

export function useAppointments() {
  const queryClient = useQueryClient();

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
