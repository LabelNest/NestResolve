// src/components/AuthForm.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Mode = 'sign_in' | 'sign_up';

export const AuthForm = () => {
  const [mode, setMode] = useState<Mode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      if (mode === 'sign_up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMsg('✅ Check your inbox for the verification email!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMsg('✅ Logged in! Redirecting…');
      }
    } catch (err: any) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        {mode === 'sign_in' ? 'Sign In' : 'Create Account'}
      </h2>

      {msg && <p className="mb-2 text-center">{msg}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="w-full mb-5 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? '⏳ …' : mode === 'sign_in' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center">
        {mode === 'sign_in' ? (
          <>
            No account?{' '}
            <button
              onClick={() => setMode('sign_up')}
              className="text-indigo-600 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('sign_in')}
              className="text-indigo-600 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
};
