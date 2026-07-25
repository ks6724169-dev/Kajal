import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'placeholder');
console.log(process.env.VITE_SUPABASE_URL);
