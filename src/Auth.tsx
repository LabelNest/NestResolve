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

    // -------- SIGN UP --------
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

      // Insert into approval table (best-effort)
      await supabase.from("nr_demo").insert({
        id: data.user?.id,
        email,
        status: "pending",
      });

      alert("Signup successful. You can login after admin approval.");
      setMode("login");
      setLoading(false);
      return;
    }

    // -------- LOGIN --------
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{mode === "signup" ? "Sign Up" : "Login"}</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
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
