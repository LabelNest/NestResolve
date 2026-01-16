import { supabase } from './supabaseClient';

async function test() {
  const { data, error } = await supabase.from('users').select('*');
  console.log(data, error);
}

test();
