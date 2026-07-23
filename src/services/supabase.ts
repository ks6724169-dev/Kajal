import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const getValidSupabaseUrl = (url: string | undefined): string => {
  if (!url || url === 'your-project-url') {
    return 'https://placeholder.supabase.co';
  }
  
  // Handle markdown links mistakenly pasted as env vars (e.g. "[https://...](https://...)")
  let cleanUrl = url;
  const markdownMatch = url.match(/\]\((https?:\/\/[^)]+)\)/);
  if (markdownMatch) {
    cleanUrl = markdownMatch[1];
  }

  try {
    const parsed = new URL(cleanUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return cleanUrl;
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
