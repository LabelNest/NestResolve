// src/supabaseClient/SupabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const SUPABASE_URL = 'https://evugaodpzepyjonlrptn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWdhb2RwemVweWpvbmxycHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDQwMjYsImV4cCI6MjA4MTAyMDAyNn0.n-ipz8mUvOyTfDOMMc5pjSNmNEKmVg2R5OhTsHU_rYI';

// Create a Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
