import { Role } from '../types';

export interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  exp: number;
}

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'galaxy_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'galaxy_refresh_token';
  private static readonly REMEMBER_ME_KEY = 'galaxy_remember_me';

  static getAccessToken(): string | null {
    const rememberMe = this.isRememberMe();
    return rememberMe
      ? localStorage.getItem(this.ACCESS_TOKEN_KEY)
      : sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    const rememberMe = this.isRememberMe();
    return rememberMe
      ? localStorage.getItem(this.REFRESH_TOKEN_KEY)
      : sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static saveTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
    this.setRememberMe(rememberMe);
    if (rememberMe) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    } else {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      // Clean up localStorage to prevent leakage
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isRememberMe(): boolean {
    return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
  }

  static setRememberMe(enabled: boolean): void {
    localStorage.setItem(this.REMEMBER_ME_KEY, String(enabled));
  }

  static decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as DecodedToken;
    } catch (e) {
      console.error('Failed to decode JWT token:', e);
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    // Return true if expired or within 10 seconds buffer
    return decoded.exp < currentTime + 10;
  }

  static rotateToken(newToken: string): void {
    const rememberMe = this.isRememberMe();
    if (rememberMe) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, newToken);
    } else {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, newToken);
    }
  }
}
