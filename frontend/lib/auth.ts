export class TokenManager {
  private static readonly PRIMARY_TOKEN_KEY = "carepulse_token";
  private static readonly LEGACY_TOKEN_KEY = "user_token";
  private static readonly ROLE_KEY = "carepulse_role";
  private static readonly EXPIRY_KEY = "token_expiry";
  private static readonly EXPIRY_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  static setToken(token: string): void {
    const expiryTime = Date.now() + this.EXPIRY_DURATION;

    // Persist to localStorage across both keys for total backwards & forward compatibility
    localStorage.setItem(this.PRIMARY_TOKEN_KEY, token);
    localStorage.setItem(this.LEGACY_TOKEN_KEY, token);
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());

    // Also set cookies so Next.js middleware can read them
    try {
      document.cookie = `${this.PRIMARY_TOKEN_KEY}=${token}; path=/; max-age=${this.EXPIRY_DURATION / 1000}; samesite=lax`;
      document.cookie = `${this.LEGACY_TOKEN_KEY}=${token}; path=/; max-age=${this.EXPIRY_DURATION / 1000}; samesite=lax`;
      document.cookie = `${this.EXPIRY_KEY}=${expiryTime}; path=/; max-age=${this.EXPIRY_DURATION / 1000}; samesite=lax`;
    } catch (err) {
      console.warn("TokenManager: unable to set cookies", err);
    }
  }

  static setRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
    try {
      document.cookie = `${this.ROLE_KEY}=${role}; path=/; max-age=${this.EXPIRY_DURATION / 1000}; samesite=lax`;
    } catch (err) {
      console.warn("TokenManager: unable to set role cookie", err);
    }
  }

  static setSession(token: string, role?: string): void {
    this.setToken(token);
    if (role) {
      this.setRole(role);
    }
  }

  static getToken(): string | null {
    const token =
      localStorage.getItem(this.PRIMARY_TOKEN_KEY) ||
      localStorage.getItem(this.LEGACY_TOKEN_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);

    if (!token) {
      return null;
    }

    // Check if token has expired
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      this.clearToken();
      return null;
    }

    return token;
  }

  static clearToken(): void {
    // Clear all session tokens and flags from localStorage
    localStorage.removeItem(this.PRIMARY_TOKEN_KEY);
    localStorage.removeItem(this.LEGACY_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem("carepulse_user");
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem("carepulse_demo");

    // Clear all cookies
    try {
      document.cookie = `${this.PRIMARY_TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
      document.cookie = `${this.LEGACY_TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
      document.cookie = `${this.ROLE_KEY}=; path=/; max-age=0; samesite=lax`;
      document.cookie = `${this.EXPIRY_KEY}=; path=/; max-age=0; samesite=lax`;
      document.cookie = `carepulse_demo=; path=/; max-age=0; samesite=lax`;
    } catch (err) {
      console.warn("TokenManager: unable to clear cookies", err);
    }
  }

  static refreshToken(): void {
    const token = localStorage.getItem(this.PRIMARY_TOKEN_KEY);
    if (token) {
      this.setToken(token); // This will reset the expiry time and cookies
    }
  }

  static logout(): void {
    this.clearToken();
    // Redirect to the sign-in page
    window.location.href = "/login";
  }
}
