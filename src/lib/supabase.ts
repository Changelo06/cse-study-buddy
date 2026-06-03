import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[CSE Ready] Supabase credentials not found. Running in mock-data mode. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to connect to Supabase.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Returns true if the Supabase client is configured and available.
 * When false, the app should fall back to mock data.
 */
export const isSupabaseConfigured = (): boolean => supabase !== null;
