//import './testSupabase';

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { supabase } from "./supabaseClient";
import Auth from "./Auth";

import Index from "./pages/Index";
import CreateIssue from "./pages/CreateIssue";
import IssueDetail from "./pages/IssueDetail";
import MyIssues from "./pages/MyIssues";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { IssueProvider } from "./context/IssueContext";

const queryClient = new QueryClient();

const App = () => {
  // ---------- Supabase Auth ----------
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSessionAndApproval = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      setSession(session);

      if (!session) {
        setLoading(false);
        return;
      }

      // 🔐 Approval check from nr_demo table
      const { data: tenant, error } = await supabase
        .from("nr_demo")
        .select("status")
        .eq("email", session.user.email)
        .single();

      if (error || !tenant) {
        console.error("Approval check failed:", error);
        setApproved(false);
      } else {
        setApproved(tenant.status === "approved");
      }

      setLoading(false);
    };

    checkSessionAndApproval();

    // Listen to login / logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setApproved(null);
        setLoading(true);
        checkSessionAndApproval();
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ---------- Guards ----------
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  if (approved === false) {
    return (
      <div style={{ padding: 40 }}>
        <h2>⏳ Account Pending Approval</h2>
        <p>Your account is waiting for admin approval.</p>
      </div>
    );
  }

  // ---------- Main App ----------
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <IssueProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateIssue />} />
              <Route path="/issue/:id" element={<IssueDetail />} />
              <Route path="/my-issues" element={<MyIssues />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </IssueProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
