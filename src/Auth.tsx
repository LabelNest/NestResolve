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

    // ---------------- SIGN UP ----------------
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

      // ✅ INSERT INTO APPROVAL TABLE (nr_demo)
      const { error: insertError } = await supabase.from("nr_demo").insert({
        id: data.user!.id,
        email,
        status: "pending",
      });

      if (insertError) {
        setError("Signup succeeded but approval entry failed");
        setLoading(false);
        return;
      }

      alert("Signup successful. Waiting for admin approval.");
      setLoading(false);
      return;
    }

    // ---------------- LOGIN ----------------
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // ✅ CHECK APPROVAL STATUS
    const { data: tenant, error: tenantError } = await supabase
      .from("nr_demo")
      .select("status")
      .eq("id", data.user.id)
      .single();

    if (tenantError || tenant.status !== "approved") {
      await supabase.auth.signOut();
      setError("Your account is not approved yet");
      setLoading(false);
      return;
    }

    // ✅ SUCCESS: App.tsx will now render protected routes
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
