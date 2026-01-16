// src/supabaseClient/testSupabase.ts
import { supabase } from './supabaseClient';

async function testSupabaseConnection() {
  const { data, error } = await supabase.from('users').select('*'); // Example table: 'users'
  
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Supabase Data:', data);
  }
}

testSupabaseConnection();
