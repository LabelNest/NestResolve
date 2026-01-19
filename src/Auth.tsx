import { useState } from "react";
import { supabase } from "./supabaseClient"; // Make sure this points to your Supabase client

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // optional if you’re only checking approval
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Check approval status
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

      // Optional: check if status is exactly "approved"
      if (approval.status.toLowerCase() !== "approved") {
        setError("Account not approved yet.");
        return;
      }

      // 2️⃣ If approved, continue login flow
      // Example: you can redirect or show success
      console.log("User approved. Continue login...");
      alert("Login successful!");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong.");
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
        style={{ display: "block", width: "100%", marginBot
