import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: inject Bearer Token and Tenant Header
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("vitalbook_token") ||
        localStorage.getItem("carepulse_token") ||
        localStorage.getItem("user_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const clinicId =
        localStorage.getItem("vitalbook_clinic_id") ||
        localStorage.getItem("carepulse_clinic_id") ||
        process.env.NEXT_PUBLIC_DEFAULT_CLINIC_ID;
      if (clinicId) {
        config.headers["X-Clinic-ID"] = clinicId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: unwrap and handle 401s safely without redirect loops
let isRedirecting = false;

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const isAuthPage =
        pathname === "/" ||
        pathname.includes("/login") ||
        pathname.includes("/register");

      // Only redirect if explicitly on a protected page AND not already redirecting AND not demo mode
      const isDemo =
        localStorage.getItem("vitalbook_demo") === "true" ||
        localStorage.getItem("carepulse_demo") === "true";
      if (!isAuthPage && !isRedirecting && !isDemo) {
        const hasToken = !!(
          localStorage.getItem("vitalbook_token") ||
          localStorage.getItem("carepulse_token") ||
          localStorage.getItem("user_token")
        );
        if (!hasToken) {
          isRedirecting = true;
          setTimeout(() => {
            window.location.href = "/login";
            isRedirecting = false;
          }, 500);
        }
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;
