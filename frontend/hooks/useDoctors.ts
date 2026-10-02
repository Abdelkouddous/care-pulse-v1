import { useQuery } from "@tanstack/react-query";
import { doctorService, DoctorFilters } from "@/lib/api/doctor.service";

export function useDoctorsList(filters: DoctorFilters = {}) {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: () => doctorService.getDoctors(filters),
  });
}

export function useDoctorDetail(id: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorService.getDoctorById(id),
    enabled: Boolean(id),
  });
}

export function useDoctorSlots(id: string, date: string) {
  return useQuery({
    queryKey: ["doctor-slots", id, date],
    queryFn: () => doctorService.getDoctorSlots(id, date),
    enabled: Boolean(id) && Boolean(date),
  });
}
