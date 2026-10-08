import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService, AdminAppointmentFilters } from "@/lib/api/admin.service";

export function useAdminDashboard(filters: AdminAppointmentFilters = {}) {
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminService.getDashboardStats(),
  });

  const appointmentsQuery = useQuery({
    queryKey: ["admin", "appointments", filters],
    queryFn: () => adminService.getAppointments(filters),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      adminService.updateAppointmentStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const triggerWhatsAppPingMutation = useMutation({
    mutationFn: (id: string) => adminService.triggerWhatsAppPing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
  });

  const doctorsQuery = useQuery({
    queryKey: ["admin", "doctors"],
    queryFn: () => adminService.getDoctors(),
  });

  const patientsQuery = useQuery({
    queryKey: ["admin", "patients"],
    queryFn: () => adminService.getPatients(),
  });

  const createDoctorMutation = useMutation({
    mutationFn: (data: any) => adminService.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  return {
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    appointments: appointmentsQuery.data?.appointments ?? [],
    meta: appointmentsQuery.data?.meta,
    isAppointmentsLoading: appointmentsQuery.isLoading,
    doctors: doctorsQuery.data?.doctors ?? [],
    isDoctorsLoading: doctorsQuery.isLoading,
    patients: patientsQuery.data?.patients ?? [],
    isPatientsLoading: patientsQuery.isLoading,
    updateStatus: updateStatusMutation,
    triggerWhatsAppPing: triggerWhatsAppPingMutation,
    createDoctor: createDoctorMutation,
    refetch: () => {
      statsQuery.refetch();
      appointmentsQuery.refetch();
      doctorsQuery.refetch();
      patientsQuery.refetch();
    },
  };
}
