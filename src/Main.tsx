import { supabase } from './supabaseClient';

export default function Main() {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Welcome to the Main Page</h1>
      <p>This page is protected. Only logged-in users can see this.</p>
      <button onClick={logout} style={{ padding: '8px 16px', marginTop: 20 }}>Logout</button>
    </div>
  );
}
