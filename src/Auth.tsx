import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check approval status
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

      alert("Login successful!");

    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert("Sign up successful! Please check your email to confirm.");
      setMode("login");
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      alert("Password reset email sent!");
      setMode("login");
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Forgot Password"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      {(mode === "login" || mode === "signup") && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
      )}

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {mode === "login" && (
        <>
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p style={{ textAlign: "center" }}>
            <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setMode("signup")}>Sign Up</span> |{" "}
            <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setMode("forgot")}>Forgot Password?</span>
          </p>
        </>
      )}

      {mode === "signup" && (
        <>
          <button onClick={handleSignUp} disabled={loading} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <p style={{ textAlign: "center" }}>
            <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setMode("login")}>Back to Login</span>
          </p>
        </>
      )}

      {mode === "forgot" && (
        <>
          <button onClick={handleForgotPassword} disabled={loading} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}>
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
          <p style={{ textAlign: "center" }}>
            <span style={{ cursor: "pointer", color: "blue" }} onClick={() => setMode("login")}>Back to Login</span>
          </p>
        </>
      )}
    </div>
  );
}
