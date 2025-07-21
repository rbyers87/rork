import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://wkhzlhcjjuzjkmhqtbwd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraHpsaGNqanV6amttaHF0YndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDk4NDUsImV4cCI6MjA2Nzc4NTg0NX0.pJXidfQBrwxUgIX5Qz6xxHg_FM2aYWGcaK7YUCepy74';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
