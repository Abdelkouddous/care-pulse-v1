import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api/auth.service";
import { AuthSession } from "@/types/api.types";
import { TokenManager } from "@/lib/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
    enabled: typeof window !== "undefined" && !!TokenManager.getToken(),
    retry: false,
  });

  const persistSession = (data: AuthSession) => {
    TokenManager.setSession(data.token, data.role, data.user);
    if (typeof window !== "undefined") {
      localStorage.setItem("vitalbook_token", data.token);
      localStorage.setItem("carepulse_token", data.token);
      const userStr = JSON.stringify(data.user);
      localStorage.setItem("vitalbook_user", userStr);
      localStorage.setItem("carepulse_user", userStr);
      localStorage.setItem("vitalbook_role", data.role);
      localStorage.setItem("carepulse_role", data.role);
    }
  };

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data: AuthSession) => {
      persistSession(data);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: (data: AuthSession) => {
      persistSession(data);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const adminLoginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.adminLogin(email, password),
    onSuccess: (data: AuthSession) => {
      persistSession(data);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const doctorLoginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.doctorLogin(email, password),
    onSuccess: (data: AuthSession) => {
      persistSession(data);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.clear();
      TokenManager.clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });

  const localUser =
    typeof window !== "undefined"
      ? (() => {
          try {
            return (
              TokenManager.getUser() ||
              JSON.parse(
                localStorage.getItem("vitalbook_user") ||
                localStorage.getItem("carepulse_user") ||
                "null"
              )
            );
          } catch {
            return null;
          }
        })()
      : null;

  const localRole =
    typeof window !== "undefined" ? TokenManager.getRole() : null;

  return {
    user: userQuery.data?.user || localUser,
    role: userQuery.data?.role || localRole || "patient",
    isLoading: userQuery.isLoading,
    login: loginMutation,
    register: registerMutation,
    adminLogin: adminLoginMutation,
    doctorLogin: doctorLoginMutation,
    logout: logoutMutation,
  };
}

