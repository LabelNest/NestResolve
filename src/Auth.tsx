import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Signup successful! Please login.');
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto', textAlign: 'center' }}>
      <h2>Login / Signup</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', margin: '8px 0' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', margin: '8px 0' }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={signIn} style={{ padding: '8px 16px' }}>Login</button>
        <button onClick={signUp} style={{ padding: '8px 16px', marginLeft: 10 }}>Signup</button>
      </div>
    </div>
  );
}
