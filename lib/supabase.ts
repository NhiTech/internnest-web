import { createClient } from '@supabase/supabase-js';

// Public (client-safe) Supabase config. Env vars override these defaults.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zezqiuhudfbpivylmprv.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_gZkEZdf_T2b_zTb-1-jt1Q_sJVv9hs2";

export const isSupabaseConfigured =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.trim() !== '' &&
  supabaseUrl !== 'your-project-url-here' &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.trim() !== '' &&
  supabaseAnonKey !== 'your-anon-key-here';

export const supabase =
  isSupabaseConfigured && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
