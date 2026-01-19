import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // insert into users table
      await supabase.from("users").insert({
        id: data.user?.id,
        email,
        status: "pending",
      });

      alert("Signup successful. Await admin approval.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{mode === "signup" ? "Sign Up" : "Login"}</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br />

      <button onClick={handleAuth} disabled={loading}>
        {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Login"}
      </button>

      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
      >
        {mode === "signup"
          ? "Already have an account? Login"
          : "New user? Sign up"}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
