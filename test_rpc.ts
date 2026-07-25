import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.rpc('get_owner_dashboard_stats', { p_campus_name: 'All Campuses' });
  console.log('Error:', error);
  console.log('Data:', data);
}
run();
