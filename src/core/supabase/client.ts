import { env } from '../config/env';

export type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
  };
};

export type SupabaseClientAdapter = {
  url: string;
  anonKey: string;
  isConfigured: true;
  headers: Record<string, string>;
};

export const getSupabaseClientConfig = (): SupabaseClientAdapter | null => {
  if (!env.isSupabaseConfigured || !env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return {
    url: env.supabaseUrl,
    anonKey: env.supabaseAnonKey,
    isConfigured: true,
    headers: {
      apikey: env.supabaseAnonKey,
      Authorization: `Bearer ${env.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'x-application-name': 'galaxy-enterprise-school-erp'
    }
  };
};

export const isSupabaseReady = () => env.isSupabaseConfigured;
