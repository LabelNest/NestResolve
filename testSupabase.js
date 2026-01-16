import { supabase } from './supabaseClient'

async function test() {
  const { data, error } = await supabase.auth.getSession()
  console.log("Supabase connected", data, error)
}

test()
