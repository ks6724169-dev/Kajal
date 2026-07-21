import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const getValidSupabaseUrl = (url: string | undefined): string => {
  if (!url || url === 'your-project-url') {
    return 'https://placeholder.supabase.co';
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch (e) {
    // Return safe placeholder on invalid URL formats
  }
  return 'https://placeholder.supabase.co';
};

const getValidSupabaseKey = (key: string | undefined): string => {
  if (!key || key === 'your-anon-key') {
    return 'placeholder-key';
  }
  return key;
};

export const supabase = createClient(
  getValidSupabaseUrl(env.supabaseUrl),
  getValidSupabaseKey(env.supabaseAnonKey)
);
