// src/context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextProps = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(supabase.auth.session());
  const [user, setUser] = useState<User | null>(supabase.auth.user());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore session from local storage (auto‑handled by supabase-js)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
