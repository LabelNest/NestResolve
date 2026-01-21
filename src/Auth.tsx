import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // ---------- SIGN UP ----------
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user) {
        setError(error?.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Insert approval record
      const { error: insertError } = await supabase.from("nr_demo").insert({
        id: data.user.id,
        email,
        status: "pending",
      });

      if (insertError) {
        setError("Signup created, but approval record failed");
      } else {
        alert("Registration submitted! Wait for admin approval.");
      }

      setLoading(false);
      return;
    }

    // ---------- LOGIN ----------
    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError || !data.session) {
      setError("Invalid login credentials");
      setLoading(false);
      return;
    }

    // Check approval
    const { data: approval } = await supabase
      .from("nr_demo")
      .select("status")
      .eq("id", data.session.user.id)
      .maybeSingle();

    if (!approval || approval.status !== "approved") {
      await supabase.auth.signOut();
      setError("Account not approved yet");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2563eb, #1e40af)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          width: 360,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {mode === "signup" ? "Create Account" : "Login"}
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={buttonStyle}
        >
          {loading
            ? "Please wait..."
            : mode === "signup"
            ? "Sign Up"
            : "Login"}
        </button>

        <p
          style={{ textAlign: "center", marginTop: 12, cursor: "pointer" }}
          onClick={() =>
            setMode(mode === "signup" ? "login" : "signup")
          }
        >
          {mode === "signup"
            ? "Already approved? Login"
            : "New user? Sign up"}
        </p>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "bold",
};
