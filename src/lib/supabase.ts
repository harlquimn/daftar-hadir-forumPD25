import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we're using mock implementation
export const isMockSupabase =
  !supabaseUrl ||
  supabaseUrl.includes("placeholder") ||
  !supabaseAnonKey ||
  supabaseAnonKey === "placeholder-key";
