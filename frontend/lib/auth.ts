export class TokenManager {
  private static readonly TOKEN_KEY = "user_token";
  private static readonly EXPIRY_KEY = "token_expiry";
  private static readonly EXPIRY_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  static setToken(token: string): void {
    const expiryTime = Date.now() + this.EXPIRY_DURATION;

    // Persist to localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());

    // Also set cookies so Next.js middleware can read them
    try {
      // Set token cookie
      document.cookie = `${this.TOKEN_KEY}=${token}; path=/; max-age=${this.EXPIRY_DURATION / 1000}; samesite=lax`;
      // Set expiry cookie
      document.cookie = `${this.EXPIRY_KEY}=${expiryTime}; path=/; max-age=${this.EXPIRY_DURATION / 1000}; samesite=lax`;
    } catch (err) {
      // In non-browser environments, cookies won't be set; that's fine
      console.warn("TokenManager: unable to set cookies", err);
    }
  }

  static getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);

    if (!token || !expiry) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > parseInt(expiry)) {
      this.clearToken();
      return null;
    }

    return token;
  }

  static clearToken(): void {
    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);

    // Clear cookies
    try {
      document.cookie = `${this.TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
      document.cookie = `${this.EXPIRY_KEY}=; path=/; max-age=0; samesite=lax`;
    } catch (err) {
      console.warn("TokenManager: unable to clear cookies", err);
    }
  }

  static refreshToken(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.setToken(token); // This will reset the expiry time and cookies
    }
  }

  static logout(): void {
    this.clearToken();
    // Redirect to the sign-in page
    window.location.href = "/signin";
  }
}
