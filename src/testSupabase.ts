import { supabase } from './supabaseClient';

async function checkSupabaseConnection() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
  }
}

checkSupabaseConnection();
