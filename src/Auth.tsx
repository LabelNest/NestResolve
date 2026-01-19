import { useState } from "react";
import { supabase } from "./supabaseClient"; // make sure this is your Supabase client

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Async login function
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Supabase auth sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2️⃣ Check approval status from your table
      const { data: approval, error: approvalError } = await supabase
        .from("nr_demo")
        .select("status")
        .eq("email", email)
        .maybeSingle();

      if (approvalError) throw approvalError;

      if (!approval || approval.status.toLowerCase() !== "approved") {
        setError("Account not approved yet.");
        return;
      }

      // ✅ Success: user is logged in and approved
      console.log("Login successful!", authData);
      alert("Login successful!");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
