// Only import testSupabase in development
if (import.meta.env.DEV) {
  import('./supabaseClient/testSupabase');
}


import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
