//import './testSupabase';

//importing auth part
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IssueProvider } from "@/context/IssueContext";
import Index from "./pages/Index";
import CreateIssue from "./pages/CreateIssue";
import IssueDetail from "./pages/IssueDetail";
import MyIssues from "./pages/MyIssues";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => {
  // ---------- Supabase Auth ----------
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen to login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!session) return <Auth />; // show Auth page if not logged in

  // ---------- Existing App JSX ----------
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
