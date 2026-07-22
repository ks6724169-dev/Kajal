import { Role } from '../types';
import { TokenManager } from './TokenManager';
import { authStore } from '../store/authStore';
import { supabase } from './supabase';
import { resolveUserTenantAndRole } from '../core/auth/supabaseAuthResolver';
import { AuditLogger } from './AuditLogger';

export interface AuthResponse {
  success: boolean;
  user?: { id: string; name: string; role: Role; email: string; tenantId?: string; schoolCode?: string; campus?: string };
  mfaRequired?: boolean;
  mfaType?: 'otp_email' | 'otp_sms' | 'totp' | null;
  mfaTicket?: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export class AuthService {
  // Real Supabase Auth Login with Database Tenant & Authoritative Role Resolution
  static async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
    tenantContext?: { tenantId: string; schoolCode: string; campus?: string },
    additionalMetadata?: { capsLockActive?: boolean; deviceTrust?: boolean }
  ): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanSchoolId = (tenantContext?.schoolCode || tenantContext?.tenantId || '').trim().toUpperCase();

    try {
      // 1. Official Supabase Auth Mechanism
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (authError || !authData?.user) {
        const errorMsg = authError?.message?.includes('Invalid login credentials')
          ? 'Invalid email, password, or School ID. Please verify your credentials.'
          : (authError?.message || 'Authentication failed. Please verify your credentials.');

        AuditLogger.logEvent('LOGIN_FAILURE', { email: cleanEmail, details: errorMsg });

        return {
          success: false,
          error: errorMsg
        };
      }

      // 2. Verify authenticated user identity
      const { data: { user: verifiedUser }, error: verifyError } = await supabase.auth.getUser();
      if (verifyError || !verifiedUser) {
        await supabase.auth.signOut();
        AuditLogger.logEvent('LOGIN_FAILURE', { email: cleanEmail, details: 'Identity verification failed' });
        return {
          success: false,
          error: 'Failed to verify authenticated identity.'
        };
      }

      // 3. Check Authenticator Assurance Level (AAL) for MFA
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const currentLevel = aalData?.currentLevel || 'aal1';
      const nextLevel = aalData?.nextLevel || 'aal1';

      // 4. Database Tenant & Authoritative Role Resolution
      const resolved = await resolveUserTenantAndRole(verifiedUser.id, cleanEmail, cleanSchoolId);

      if (!resolved.success || !resolved.data) {
        await supabase.auth.signOut();
        AuditLogger.logEvent('LOGIN_FAILURE', { email: cleanEmail, details: resolved.error || 'Tenant resolution failure' });
        return {
          success: false,
          error: resolved.error || 'Authentication failed: school tenant or role resolution error.'
        };
      }

      const resolvedData = resolved.data;

      // Save token in tokenManager
      const accessToken = authData.session?.access_token || '';
      const refreshToken = authData.session?.refresh_token || '';
      TokenManager.saveTokens(accessToken, refreshToken, rememberMe);

      const userObj = {
        id: resolvedData.id,
        name: resolvedData.name,
        role: resolvedData.role, // Authoritative role resolved from DB
        email: cleanEmail,
        tenantId: resolvedData.tenantId,
        schoolCode: resolvedData.schoolId,
        campus: resolvedData.campus || tenantContext?.campus || 'Main Campus'
      };

      // If user has MFA enrolled on Supabase (nextLevel === 'aal2') but current session is aal1, challenge is required!
      if (nextLevel === 'aal2' && currentLevel === 'aal1') {
        AuditLogger.logEvent('MFA_REQUIRED', { userId: userObj.id, email: cleanEmail, details: `AAL2 Required (Current: ${currentLevel}, Next: ${nextLevel})` });
        return {
          success: true,
          mfaRequired: true,
          mfaType: 'totp',
          mfaTicket: accessToken,
          user: userObj,
          accessToken,
          refreshToken
        };
      }

      authStore.login(userObj, rememberMe);
      AuditLogger.logEvent('LOGIN_SUCCESS', { userId: userObj.id, email: cleanEmail, details: `Role: ${userObj.role}, AAL: ${currentLevel}` });

      return {
        success: true,
        user: userObj,
        accessToken,
        refreshToken
      };
    } catch (err: any) {
      AuditLogger.logEvent('LOGIN_FAILURE', { email: cleanEmail, details: err?.message || 'Unexpected exception' });
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

  // Password reset request using official Supabase Auth mechanism
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const redirectUrl = `${window.location.origin}/auth/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl
      });

      if (error) {
        return { success: false, message: error.message };
      }

      AuditLogger.logEvent('PASSWORD_RESET_REQUESTED', { email: cleanEmail });

      return {
        success: true,
        message: 'A secure recovery link has been dispatched to your registered email address via Supabase Auth.'
      };
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || 'Failed to request password reset.'
      };
    }
  }

  // Set new password for current active or recovery session in Supabase Auth
  static async confirmPasswordReset(_ticket: string, newPassword: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error('Password reset confirm error:', error.message);
        return false;
      }
      if (data?.user) {
        AuditLogger.logEvent('PASSWORD_CHANGED', { userId: data.user.id, email: data.user.email, details: 'Password reset completed' });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // Authenticated password update
  static async changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        AuditLogger.logEvent('PASSWORD_CHANGED', { userId: data.user.id, email: data.user.email, details: 'User changed password in workspace' });
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update password.' };
    }
  }

  // Confirm Profile Setup / Registration Completion
  static async completeProfileSetup(data: {
    userId: string;
    phoneNumber: string;
    operatingLanguage: 'en' | 'hi';
    avatarUrl?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('identities')
        .update({
          phone: data.phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.userId);
      return !error;
    } catch (e) {
      return true;
    }
  }
}

