import { env } from '../config/env';
import { getSupabaseClientConfig, SupabaseSession } from '../supabase';
import { Role } from '../../types';
import { AuthenticatedUser, ROLE_PERMISSIONS } from './rbac';
import { buildTenantFromAuthMetadata, normalizeSchoolCode } from './tenant';

export type AuthSession = SupabaseSession & {
  provider: 'supabase';
  user: SupabaseSession['user'] & AuthenticatedUser & {
    emailVerified: boolean;
    schoolCode: string;
    tenant: ReturnType<typeof buildTenantFromAuthMetadata>;
  };
};

export type LoginCredentials = {
  schoolCode: string;
  email: string;
  password: string;
  role: Role;
  rememberMe: boolean;
};

export type AuthResult = {
  session: AuthSession;
  tenantId: string;
  role: Role;
};

const AUTH_STORAGE_KEY = 'galaxy.auth.session.v1';

const authUrl = (path: string) => {
  const config = getSupabaseClientConfig();
  if (!config) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  return `${config.url.replace(/\/$/, '')}/auth/v1${path}`;
};

const authHeaders = (accessToken?: string) => {
  const config = getSupabaseClientConfig();
  if (!config) throw new Error('Supabase is not configured.');
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${accessToken ?? config.anonKey}`,
    'Content-Type': 'application/json'
  };
};

const normalizeSupabaseSession = (payload: any, credentials: Pick<LoginCredentials, 'schoolCode' | 'role'>): AuthSession => {
  const schoolCode = normalizeSchoolCode(credentials.schoolCode);
  const email = payload.user?.email ?? '';
  const userMetadata = payload.user?.user_metadata as Record<string, unknown> | undefined;
  const tenant = buildTenantFromAuthMetadata(userMetadata, schoolCode);
  const metadataRole = payload.user?.user_metadata?.role as Role | undefined;
  const role = metadataRole ?? credentials.role;
  const emailVerified = Boolean(payload.user?.email_confirmed_at ?? payload.user?.confirmed_at);

  return {
    provider: 'supabase',
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_at: payload.expires_at,
    user: {
      id: payload.user?.id ?? email,
      email,
      app_metadata: payload.user?.app_metadata,
      user_metadata: payload.user?.user_metadata,
      displayName: String(userMetadata?.display_name ?? email.split('@')[0] ?? role),
      tenantId: tenant.id,
      role,
      permissions: ROLE_PERMISSIONS[role],
      emailVerified,
      schoolCode,
      tenant
    }
  };
};

const persistSession = (session: AuthSession | null, remember = true) => {
  if (typeof window === 'undefined') return;
  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const authService = {
  loadSession: (): AuthSession | null => {
    if (typeof window === 'undefined') return null;
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY) ?? window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) return null;

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      persistSession(null);
      return null;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResult> => {
    if (!env.isSupabaseConfigured) {
      throw new Error('Supabase authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const response = await fetch(authUrl('/token?grant_type=password'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error_description ?? payload.msg ?? payload.error ?? 'Unable to sign in.');

    const session = normalizeSupabaseSession(payload, credentials);
    persistSession(session, credentials.rememberMe);
    return { session, tenantId: session.user.tenantId, role: session.user.role };
  },

  logout: async (session: AuthSession | null) => {
    if (env.isSupabaseConfigured && session?.access_token && session.provider === 'supabase') {
      await fetch(authUrl('/logout'), { method: 'POST', headers: authHeaders(session.access_token) }).catch(() => undefined);
    }
    persistSession(null);
  },

  forgotPassword: async (email: string) => {
    if (!env.isSupabaseConfigured) throw new Error('Supabase authentication is not configured.');
    const response = await fetch(authUrl('/recover'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, redirect_to: env.authRedirectUrl ?? (env.appUrl ? `${env.appUrl}/reset-password` : `${window.location.origin}/reset-password`) })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error_description ?? payload.msg ?? 'Unable to send reset password email.');
    }
  },

  resetPassword: async (accessToken: string, password: string) => {
    if (!env.isSupabaseConfigured) throw new Error('Supabase authentication is not configured.');
    const response = await fetch(authUrl('/user'), {
      method: 'PUT',
      headers: authHeaders(accessToken),
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error_description ?? payload.msg ?? 'Unable to reset password.');
    }
  },

  resendVerification: async (email: string) => {
    if (!env.isSupabaseConfigured) throw new Error('Supabase authentication is not configured.');
    const response = await fetch(authUrl('/resend'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ type: 'signup', email })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error_description ?? payload.msg ?? 'Unable to send verification email.');
    }
  },

  refreshSession: async (session: AuthSession | null): Promise<AuthSession | null> => {
    if (!session?.refresh_token) return session;
    if (!env.isSupabaseConfigured) return null;

    const response = await fetch(authUrl('/token?grant_type=refresh_token'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ refresh_token: session.refresh_token })
    });
    const payload = await response.json();
    if (!response.ok) {
      persistSession(null);
      return null;
    }

    const refreshed = normalizeSupabaseSession(payload, { schoolCode: session.user.schoolCode, role: session.user.role });
    persistSession(refreshed, true);
    return refreshed;
  },

  persistSession
};
