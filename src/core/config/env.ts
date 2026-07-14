type PublicEnv = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  apiBaseUrl: string;
  appUrl?: string;
  authRedirectUrl?: string;
  isSupabaseConfigured: boolean;
};

const readEnv = (key: string): string | undefined => {
  const value = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
};

export const env: PublicEnv = {
  supabaseUrl: readEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: readEnv('VITE_SUPABASE_ANON_KEY'),
  apiBaseUrl: readEnv('VITE_API_BASE_URL') ?? '/api',
  appUrl: readEnv('VITE_APP_URL'),
  authRedirectUrl: readEnv('VITE_AUTH_REDIRECT_URL'),
  isSupabaseConfigured: Boolean(readEnv('VITE_SUPABASE_URL') && readEnv('VITE_SUPABASE_ANON_KEY'))
};
