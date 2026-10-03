export class TokenManager {
  private static readonly PRIMARY_TOKEN_KEY = "vitalbook_token";
  private static readonly FALLBACK_TOKEN_KEY = "carepulse_token";
  private static readonly LEGACY_TOKEN_KEY = "user_token";

  private static readonly PRIMARY_ROLE_KEY = "vitalbook_role";
  private static readonly FALLBACK_ROLE_KEY = "carepulse_role";

  private static readonly PRIMARY_USER_KEY = "vitalbook_user";
  private static readonly FALLBACK_USER_KEY = "carepulse_user";

  private static readonly PRIMARY_DEMO_KEY = "vitalbook_demo";
  private static readonly FALLBACK_DEMO_KEY = "carepulse_demo";

  private static readonly PRIMARY_CLINIC_KEY = "vitalbook_clinic_id";
  private static readonly FALLBACK_CLINIC_KEY = "carepulse_clinic_id";

  private static readonly EXPIRY_KEY = "token_expiry";
  private static readonly EXPIRY_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  static setToken(token: string): void {
    const expiryTime = Date.now() + this.EXPIRY_DURATION;

    if (typeof window !== "undefined") {
      // Persist to localStorage across all keys for total dual-compatibility
      localStorage.setItem(this.PRIMARY_TOKEN_KEY, token);
      localStorage.setItem(this.FALLBACK_TOKEN_KEY, token);
      localStorage.setItem(this.LEGACY_TOKEN_KEY, token);
      localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());

      // Set cookies for Next.js middleware
      try {
        const maxAge = this.EXPIRY_DURATION / 1000;
        document.cookie = `${this.PRIMARY_TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; samesite=lax`;
        document.cookie = `${this.FALLBACK_TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; samesite=lax`;
        document.cookie = `${this.LEGACY_TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; samesite=lax`;
        document.cookie = `${this.EXPIRY_KEY}=${expiryTime}; path=/; max-age=${maxAge}; samesite=lax`;
      } catch (err) {
        console.warn("TokenManager: unable to set cookies", err);
      }
    }
  }

  static setRole(role: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.PRIMARY_ROLE_KEY, role);
      localStorage.setItem(this.FALLBACK_ROLE_KEY, role);
      try {
        const maxAge = this.EXPIRY_DURATION / 1000;
        document.cookie = `${this.PRIMARY_ROLE_KEY}=${role}; path=/; max-age=${maxAge}; samesite=lax`;
        document.cookie = `${this.FALLBACK_ROLE_KEY}=${role}; path=/; max-age=${maxAge}; samesite=lax`;
      } catch (err) {
        console.warn("TokenManager: unable to set role cookie", err);
      }
    }
  }

  static setUser(user: any): void {
    if (typeof window !== "undefined" && user) {
      const serialized = typeof user === "string" ? user : JSON.stringify(user);
      localStorage.setItem(this.PRIMARY_USER_KEY, serialized);
      localStorage.setItem(this.FALLBACK_USER_KEY, serialized);
    }
  }

  static setDemo(isDemo: boolean): void {
    if (typeof window !== "undefined") {
      if (isDemo) {
        localStorage.setItem(this.PRIMARY_DEMO_KEY, "true");
        localStorage.setItem(this.FALLBACK_DEMO_KEY, "true");
        try {
          document.cookie = `${this.PRIMARY_DEMO_KEY}=true; path=/; max-age=86400; samesite=lax`;
          document.cookie = `${this.FALLBACK_DEMO_KEY}=true; path=/; max-age=86400; samesite=lax`;
        } catch {}
      } else {
        localStorage.removeItem(this.PRIMARY_DEMO_KEY);
        localStorage.removeItem(this.FALLBACK_DEMO_KEY);
        try {
          document.cookie = `${this.PRIMARY_DEMO_KEY}=; path=/; max-age=0; samesite=lax`;
          document.cookie = `${this.FALLBACK_DEMO_KEY}=; path=/; max-age=0; samesite=lax`;
        } catch {}
      }
    }
  }

  static setClinicId(clinicId: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.PRIMARY_CLINIC_KEY, clinicId);
      localStorage.setItem(this.FALLBACK_CLINIC_KEY, clinicId);
    }
  }

  static setSession(token: string, role?: string, user?: any, isDemo: boolean = false): void {
    this.setToken(token);
    if (role) {
      this.setRole(role);
    }
    if (user) {
      this.setUser(user);
    }
    this.setDemo(isDemo);
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null;

    const token =
      localStorage.getItem(this.PRIMARY_TOKEN_KEY) ||
      localStorage.getItem(this.FALLBACK_TOKEN_KEY) ||
      localStorage.getItem(this.LEGACY_TOKEN_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);

    if (!token) {
      return null;
    }

    if (expiry && Date.now() > parseInt(expiry, 10)) {
      this.clearToken();
      return null;
    }

    return token;
  }

  static getRole(): string {
    if (typeof window === "undefined") return "patient";
    return (
      localStorage.getItem(this.PRIMARY_ROLE_KEY) ||
      localStorage.getItem(this.FALLBACK_ROLE_KEY) ||
      "patient"
    );
  }

  static getUser(): any | null {
    if (typeof window === "undefined") return null;
    try {
      const raw =
        localStorage.getItem(this.PRIMARY_USER_KEY) ||
        localStorage.getItem(this.FALLBACK_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static isDemo(): boolean {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem(this.PRIMARY_DEMO_KEY) === "true" ||
      localStorage.getItem(this.FALLBACK_DEMO_KEY) === "true"
    );
  }

  static getClinicId(): string | null {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem(this.PRIMARY_CLINIC_KEY) ||
      localStorage.getItem(this.FALLBACK_CLINIC_KEY)
    );
  }

  static clearToken(): void {
    if (typeof window !== "undefined") {
      // Clear localStorage
      localStorage.removeItem(this.PRIMARY_TOKEN_KEY);
      localStorage.removeItem(this.FALLBACK_TOKEN_KEY);
      localStorage.removeItem(this.LEGACY_TOKEN_KEY);
      localStorage.removeItem(this.EXPIRY_KEY);
      localStorage.removeItem(this.PRIMARY_USER_KEY);
      localStorage.removeItem(this.FALLBACK_USER_KEY);
      localStorage.removeItem(this.PRIMARY_ROLE_KEY);
      localStorage.removeItem(this.FALLBACK_ROLE_KEY);
      localStorage.removeItem(this.PRIMARY_DEMO_KEY);
      localStorage.removeItem(this.FALLBACK_DEMO_KEY);
      localStorage.removeItem(this.PRIMARY_CLINIC_KEY);
      localStorage.removeItem(this.FALLBACK_CLINIC_KEY);

      // Clear cookies
      try {
        const expired = "; path=/; max-age=0; samesite=lax";
        document.cookie = `${this.PRIMARY_TOKEN_KEY}=` + expired;
        document.cookie = `${this.FALLBACK_TOKEN_KEY}=` + expired;
        document.cookie = `${this.LEGACY_TOKEN_KEY}=` + expired;
        document.cookie = `${this.PRIMARY_ROLE_KEY}=` + expired;
        document.cookie = `${this.FALLBACK_ROLE_KEY}=` + expired;
        document.cookie = `${this.EXPIRY_KEY}=` + expired;
        document.cookie = `${this.PRIMARY_DEMO_KEY}=` + expired;
        document.cookie = `${this.FALLBACK_DEMO_KEY}=` + expired;
      } catch (err) {
        console.warn("TokenManager: unable to clear cookies", err);
      }
    }
  }

  static refreshToken(): void {
    const token = this.getToken();
    if (token) {
      this.setToken(token);
    }
  }

  static logout(): void {
    this.clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
