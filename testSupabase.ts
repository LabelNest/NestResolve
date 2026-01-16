import { supabase } from './supabaseClient'

async function testSupabase() {
  const { data, error } = await supabase.auth.getSession()

  console.log('Supabase connected')
  console.log('Session data:', data)
  console.log('Error:', error)
}

testSupabase()
