import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api/auth.service";
import { AuthSession } from "@/types/api.types";
import { TokenManager } from "@/lib/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
    enabled: typeof window !== "undefined" && !!localStorage.getItem("carepulse_token"),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data: AuthSession) => {
      TokenManager.setSession(data.token, data.role);
      localStorage.setItem("carepulse_token", data.token);
      localStorage.setItem("carepulse_user", JSON.stringify(data.user));
      localStorage.setItem("carepulse_role", data.role);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: (data: AuthSession) => {
      TokenManager.setSession(data.token, data.role);
      localStorage.setItem("carepulse_token", data.token);
      localStorage.setItem("carepulse_user", JSON.stringify(data.user));
      localStorage.setItem("carepulse_role", data.role);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const adminLoginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.adminLogin(email, password),
    onSuccess: (data: AuthSession) => {
      TokenManager.setSession(data.token, data.role);
      localStorage.setItem("carepulse_token", data.token);
      localStorage.setItem("carepulse_user", JSON.stringify(data.user));
      localStorage.setItem("carepulse_role", data.role);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const doctorLoginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.doctorLogin(email, password),
    onSuccess: (data: AuthSession) => {
      TokenManager.setSession(data.token, data.role);
      localStorage.setItem("carepulse_token", data.token);
      localStorage.setItem("carepulse_user", JSON.stringify(data.user));
      localStorage.setItem("carepulse_role", data.role);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.clear();
      TokenManager.clearToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("carepulse_token");
        localStorage.removeItem("user_token");
        localStorage.removeItem("carepulse_user");
        localStorage.removeItem("carepulse_role");
        localStorage.removeItem("carepulse_demo");
        document.cookie = "carepulse_token=; path=/; max-age=0;";
        document.cookie = "carepulse_demo=; path=/; max-age=0;";
        document.cookie = "user_token=; path=/; max-age=0;";
        window.location.href = "/login";
      }
    },
  });

  const localUser =
    typeof window !== "undefined"
      ? (() => {
          try {
            const raw = localStorage.getItem("carepulse_user");
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        })()
      : null;

  const localRole =
    typeof window !== "undefined" ? localStorage.getItem("carepulse_role") : null;

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

