import { useState } from "react";
import { supabase } from "./supabaseClient";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ---------------- SIGN UP ----------------
  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    // 1. Create Supabase auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // 2. Insert into tenants table
    const { error: insertError } = await supabase.from("nr_demo").insert({
      id: data.user?.id, // same UUID as auth.users
      email: email,
      status: "pending",
      role: "user",
    });

    if (insertError) {
      setMessage("Signup created but DB insert failed");
      setLoading(false);
      return;
    }

    setMessage("Signup successful. Wait for admin approval.");
    setLoading(false);
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    // 1. Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // 2. Check approval status
    const { data: tenant, error: tenantError } = await supabase
      .from("nr_demo")
      .select("status")
      .eq("id", data.user.id)
      .single();

    if (tenantError || !tenant) {
      setMessage("Tenant record not found");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (tenant.status !== "approved") {
      setMessage("Your account is pending admin approval");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      <input
        type="email"
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
        onClick={isSignup ? handleSignup : handleLogin}
        disabled={loading}
        style={{ width: "100%" }}
      >
        {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
      </button>

      <p style={{ marginTop: 10, color: "red" }}>{message}</p>

      <p style={{ marginTop: 10 }}>
        {isSignup ? "Already have an account?" : "New user?"}{" "}
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
