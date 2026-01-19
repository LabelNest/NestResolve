import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/login";
      }
    });
  }, []);

  return <p>Email confirmed. You may now login after admin approval.</p>;
}
