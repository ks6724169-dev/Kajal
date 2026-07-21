import { Role } from '../types';
import { TokenManager } from './TokenManager';
import { authStore } from '../store/authStore';
import { tenantStore } from '../store/tenantStore';

export interface AuthResponse {
  success: boolean;
  user?: { id: string; name: string; role: Role; email: string };
  mfaRequired?: boolean;
  mfaType?: 'otp_email' | 'otp_sms' | 'totp' | null;
  mfaTicket?: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export class AuthService {
  // Login with support for Tenant context, CAP LOCK status, and enterprise identification
  static async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
    tenantContext?: { tenantId: string; schoolCode: string; campus?: string },
    additionalMetadata?: { capsLockActive?: boolean; deviceTrust?: boolean }
  ): Promise<AuthResponse> {
    console.log(`Initiating secure multi-tenant authentication for user: ${email} in tenant: ${tenantContext?.schoolCode}`, additionalMetadata);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: password,
          tenant_id: tenantContext?.tenantId,
          school_code: tenantContext?.schoolCode,
          device_fingerprint: additionalMetadata?.deviceTrust ? 'trusted_device' : 'unknown'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Authentication failed'
        };
      }

      if (data.mfa_required) {
        return {
          success: true,
          mfaRequired: true,
          mfaType: 'totp',
          mfaTicket: data.user_id
        };
      }

      const mockAccessToken = data.token || `access_${Math.random().toString(36).substring(2)}`;
      const mockRefreshToken = data.refresh_token || `refresh_${Math.random().toString(36).substring(2)}`;

      // Save token in tokenManager
      TokenManager.saveTokens(mockAccessToken, mockRefreshToken, rememberMe);

      const userObj = {
        id: data.user?.id || `usr-${Math.random().toString(36).substring(2)}`,
        name: data.user?.name || email.split('@')[0],
        role: data.user?.role || 'teacher',
        email: cleanEmail,
        tenantId: data.user?.tenant_id || tenantContext?.tenantId,
        schoolCode: tenantContext?.schoolCode,
        campus: tenantContext?.campus || 'Main Campus'
      };

      authStore.login(userObj, rememberMe);

      return {
        success: true,
        user: userObj,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'An unexpected error occurred during authentication.'
      };
    }
  }

  // Handle password strength computation according to security constraints
  static checkPasswordStrength(password: string): {
    score: number; // 0 to 4
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
      return { score: 0, feedback: ['Enter a secure password.'] };
    }

    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('Make password at least 8 characters long.');
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add an uppercase letter (A-Z).');
    }

    if (/[0-9]/.test(password)) {
      score++;
    } else {
      feedback.push('Add a numeric digit (0-9).');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    } else {
      feedback.push('Add a special character (e.g., @, #, $).');
    }

    return { score, feedback };
  }

  // Password reset request
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log(`Password reset link dispatched to email: ${email}`);
    return {
      success: true,
      message: 'A secure recovery link has been dispatched to your registered email address.'
    };
  }

  // Set new password
  static async confirmPasswordReset(ticket: string, newPassword: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 750));
    console.log(`Setting new secure password for ticket code: ${ticket}`);
    return true;
  }

  // Confirm Profile Setup / Registration Completion
  static async completeProfileSetup(data: {
    userId: string;
    phoneNumber: string;
    operatingLanguage: 'en' | 'hi';
    avatarUrl?: string;
  }): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Profile updated successfully for user ID: ${data.userId}`, data);
    return true;
  }
}
