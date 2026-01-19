import { useState } from "react";
import { supabase } from "./supabaseClient"; // make sure this points to your Supabase client

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // optional if you’re only checking approval
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Check approval status in nr_demo table
      const { data: approval, error: approvalError } = await supabase
        .from("nr_demo")
        .select("status")
        .eq("email", email)
        .maybeSingle();

      console.log("Approval:", approval);
      console.log("Approval error:", approvalError);

      if (approvalError || !approval) {
        setError("Account not approved yet.");
        return;
      }

      if (approval.status.toLowerCase() !== "approved") {
        setError("Account not approved yet.");
        return;
      }

      // 2️⃣ Optional: continue login flow here
      console.log("User approved. Login successful!");
      alert("Login successful!");

    } catch (err) {
      console.error("Login error:", err);
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      <input
        type="password"
        placeholder="Password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: "0.5rem 1rem", width: "100%" }}
      >
        {loading ? "Checking..." : "Login"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
