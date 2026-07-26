export const env = {
  supabaseUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || process.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || process.env.VITE_SUPABASE_ANON_KEY || '',
};

export const validateEnv = () => {
  if (!env.supabaseUrl) {
    console.warn('VITE_SUPABASE_URL is not set.');
  }
  if (!env.supabaseAnonKey) {
    console.warn('VITE_SUPABASE_ANON_KEY is not set.');
  }
};
