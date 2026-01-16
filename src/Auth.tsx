import { useState } from "react";
import { supabase } from "./supabaseClient";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    await supabase.from("tenants").insert({
      id: data.user?.id,
      email,
      name,
      status: "pending",
      role: "user",
    });

    alert("Signup successful. Wait for admin approval.");
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    const { data: tenant } = await supabase
      .from("tenants")
      .select("status")
      .eq("id", data.user.id)
      .single();

    if (tenant.status !== "approved") {
      await supabase.auth.signOut();
      alert("Account not approved yet.");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "100px auto" }}>
      <h2>Login / Signup</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button onClick={signIn}>Login</button>
      <button onClick={signUp}>Signup</button>
    </div>
  );
};

export default Auth;
