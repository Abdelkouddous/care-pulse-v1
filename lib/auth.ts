// lib/auth.ts
export class TokenManager {
  private static readonly TOKEN_KEY = "pulse_auth_token";
  private static readonly EXPIRY_KEY = "pulse_auth_expiry";

  // Set token with expiration (default 24 hours)
  static setToken(token: string, expiryHours: number = 24): void {
    try {
      // Store in localStorage if available (client-side)
      if (typeof window !== "undefined") {
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + expiryHours);

        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.EXPIRY_KEY, expiryTime.toISOString());

        // Also set in cookie for middleware access
        document.cookie = `${this.TOKEN_KEY}=${token}; path=/; max-age=${expiryHours * 3600}; SameSite=Lax`;
      }
    } catch (error) {
      console.error("Error setting token:", error);
    }
  }

  // Get token and check if it's still valid
  static getToken(): string | null {
    try {
      // Check localStorage first (client-side)
      if (typeof window !== "undefined") {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const expiry = localStorage.getItem(this.EXPIRY_KEY);

        if (token && expiry) {
          // Check if token is expired
          if (new Date(expiry) > new Date()) {
            return token;
          } else {
            // Token expired, clear it
            this.clearToken();
            return null;
          }
        }

        // If not in localStorage, try to get from cookie
        return this.getTokenFromCookie();
      }

      // Server-side, try to get from cookie in the request
      return null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  // Helper to get token from cookie
  private static getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === this.TOKEN_KEY) {
        return value;
      }
    }
    return null;
  }

  // Clear token from all storage
  static clearToken(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.EXPIRY_KEY);
        document.cookie = `${this.TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
      }
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  }
  //logout
  static logout(): void {
    this.clearToken();
    // Optionally, redirect to login page or perform other logout actions
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
}
