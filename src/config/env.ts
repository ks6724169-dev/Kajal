export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export const validateEnv = () => {
  if (!env.supabaseUrl) {
    console.warn('VITE_SUPABASE_URL is not set.');
  }
  if (!env.supabaseAnonKey) {
    console.warn('VITE_SUPABASE_ANON_KEY is not set.');
  }
};
