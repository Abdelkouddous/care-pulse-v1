import { useQuery } from "@tanstack/react-query";
import { specialtyService } from "@/lib/api/specialty.service";

export function useSpecialties() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: () => specialtyService.getSpecialties(),
  });
}
