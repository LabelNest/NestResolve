import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("signup");

  // ---------------- SIGN UP ----------------
  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    // 1. Supabase signup (email confirmation enabled)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 2. Insert approval request
    if (data.user) {
      const { error: dbError } = await supabase.from("nr_demo").insert({
        id: data.user.id,
        email: email,
        status: "pending",
      });

      if (dbError) {
        console.error(dbError);
        setError("Signup succeeded but approval entry failed");
      } else {
        alert("Registration submitted! Please check your email to confirm.");
      }
    }

    setLoading(false);
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    // 1. Check admin approval
    const { data: approval, error: approvalError } = await supabase
      .from("nr_demo")
      .select("status")
      .eq("email", email)
      .single();

    if (approvalError || !approval) {
      setError("Account not approved yet.");
      setLoading(false);
      return;
    }

    if (approval.status !== "approved") {
      setError("Account pending admin approval.");
      setLoading(false);
      return;
    }

    // 2. Login
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
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h2>{mode === "signup" ? "Sign Up" : "Login"}</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button
        onClick={mode === "signup" ? handleSignup : handleLogin}
        disabled={loading}
        style={{ width: "100%" }}
      >
        {loading
          ? "Please wait..."
          : mode === "signup"
          ? "Sign Up"
          : "Login"}
      </button>

      <p
        style={{ cursor: "pointer", color: "blue", marginTop: 15 }}
        onClick={() =>
          setMode(mode === "signup" ? "login" : "signup")
        }
      >
        {mode === "signup"
          ? "Already registered? Login"
          : "New user? Sign up"}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
