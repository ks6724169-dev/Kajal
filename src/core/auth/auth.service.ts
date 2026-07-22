import { LoginCredentials, AuthResult, AuthUser } from './auth.types';
import { AUTH_MESSAGES } from './auth.constants';
import { AuthenticationError } from './auth.errors';
import { authStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import { resolveUserTenantAndRole } from './supabaseAuthResolver';
import { TokenManager } from '../../services/TokenManager';
import { Role } from '../../types';
import { AuditLogger } from '../../services/AuditLogger';

export class CentralAuthService {
  /**
   * Validate credentials client-side before submission
   */
  public static validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.schoolId || !credentials.schoolId.trim()) {
      throw new AuthenticationError(AUTH_MESSAGES.ERR_SCHOOL_ID_REQUIRED, 'REQUIRED_FIELD', 'schoolId');
    }

    if (!credentials.email || !credentials.email.trim()) {
      throw new AuthenticationError(AUTH_MESSAGES.ERR_EMAIL_REQUIRED, 'REQUIRED_FIELD', 'email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email.trim())) {
      throw new AuthenticationError(AUTH_MESSAGES.ERR_EMAIL_INVALID, 'INVALID_FORMAT', 'email');
    }

    if (!credentials.password) {
      throw new AuthenticationError(AUTH_MESSAGES.ERR_PASSWORD_REQUIRED, 'REQUIRED_FIELD', 'password');
    }
  }

  /**
   * Real Supabase Authentication & Server-Authoritative Database Role Resolution
   * User role is resolved dynamically from database verification (identities/users/schools), NOT user selection or metadata.
   */
  public static async login(credentials: LoginCredentials): Promise<AuthResult> {
    // 1. Client-side validation
    this.validateCredentials(credentials);

    const cleanEmail = credentials.email.trim().toLowerCase();
    const cleanSchoolId = credentials.schoolId.trim().toUpperCase();

    try {
      // 2. Official Supabase Auth Mechanism
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: credentials.password
      });

      if (authError || !authData?.user) {
        // Return clear error without exposing sensitive internal details
        const errorMsg = authError?.message?.includes('Invalid login credentials')
          ? 'Invalid email, password, or School ID. Please verify your credentials.'
          : (authError?.message || AUTH_MESSAGES.ERR_AUTH_FAILED);

        return {
          success: false,
          error: errorMsg
        };
      }

      // 3. Verify authenticated identity securely via getUser()
      const { data: { user: verifiedUser }, error: verifyError } = await supabase.auth.getUser();
      if (verifyError || !verifiedUser) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Failed to verify authenticated user identity.'
        };
      }

      // 4. Resolve Database Tenant & Authoritative Role
      const resolved = await resolveUserTenantAndRole(verifiedUser.id, cleanEmail, cleanSchoolId);

      if (!resolved.success || !resolved.data) {
        // Sign out if profile, school, or active status verification failed
        await supabase.auth.signOut();
        return {
          success: false,
          error: resolved.error || 'Authentication failed: unable to verify school tenant record.'
        };
      }

      const resolvedData = resolved.data;

      // 5. Construct authenticated user object
      const user: AuthUser = {
        id: resolvedData.id,
        name: resolvedData.name,
        email: resolvedData.email,
        role: resolvedData.role, // Database-authoritative role
        schoolId: resolvedData.schoolId,
        tenantId: resolvedData.tenantId,
        campus: resolvedData.campus
      };

      // Check Authenticator Assurance Level (AAL)
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const currentLevel = aalData?.currentLevel || 'aal1';
      const nextLevel = aalData?.nextLevel || 'aal1';

      if (nextLevel === 'aal2' && currentLevel === 'aal1') {
        AuditLogger.logEvent('MFA_REQUIRED', { userId: user.id, email: cleanEmail, details: `AAL2 Required (Current: ${currentLevel}, Next: ${nextLevel})` });
        return {
          success: true,
          user,
          mfaRequired: true
        };
      }

      // 6. Synchronize AuthStore & TokenManager
      authStore.login(user, !!credentials.rememberMe);

      if (authData.session?.access_token) {
        TokenManager.saveTokens(
          authData.session.access_token,
          authData.session.refresh_token || '',
          !!credentials.rememberMe
        );
      }

      return {
        success: true,
        user,
        session: {
          user,
          accessToken: authData.session?.access_token || '',
          expiresAt: (authData.session?.expires_at || Math.floor(Date.now() / 1000) + 86400) * 1000
        }
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || AUTH_MESSAGES.ERR_AUTH_FAILED
      };
    }
  }

  /**
   * Real Supabase Auth Logout (Global Revocation)
   */
  public static async logout(): Promise<void> {
    try {
      AuditLogger.logEvent('LOGOUT');
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.error('Error signing out from Supabase Auth:', e);
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // Fallback
      }
    } finally {
      TokenManager.clearTokens();
      authStore.logout();
    }
  }
}
