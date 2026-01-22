const signup = async () => {
  setLoading(true);

  // Create auth user WITHOUT password
  const { data, error } = await supabase.auth.signUp({
    email,
    password: crypto.randomUUID(), // dummy password
  });

  if (error || !data.user) {
    alert(error?.message || "Signup failed");
    setLoading(false);
    return;
  }

  // Insert into approval table
  await supabase.from("nr_demo").insert({
    id: data.user.id,
    email,
    status: "pending",
  });

  alert("Registration submitted. Wait for admin approval.");
  setLoading(false);
};
