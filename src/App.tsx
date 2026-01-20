// src/App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IssueProvider } from '@/context/IssueContext';

import Index from './pages/Index';
import CreateIssue from './pages/CreateIssue';
import IssueDetail from './pages/IssueDetail';
import MyIssues from './pages/MyIssues';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';

import { AuthProvider } from '@/context/AuthProvider';
import { useApproval } from '@/hooks/useApproval';

const queryClient = new QueryClient();

function App() {
  // --------------------------------------------------------------
  // 1️⃣  Auth + Approval state (via our custom hooks)
  // --------------------------------------------------------------
  const { user, loading: authLoading } = useAuth(); // <-- from AuthProvider
  const { approved, loading: approvalLoading } = useApproval();

  // Global “loading” is true while we don’t know either auth or approval
  const loading = authLoading || approvalLoading;

  // --------------------------------------------------------------
  // 2️⃣  UI for the three possible states
  // --------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

  // Not logged in → show the sign‑in / sign‑up page
  if (!user) {
    return <Auth />;
  }

  // Logged‑in but not approved yet → a friendly waiting screen
  if (approved === false) {
    return (
      <div style={{ padding: 40 }}>
        <h2>⏳ Account Pending Approval</h2>
        <p>
          Your account is waiting for an administrator to approve it.
          <br />
          You’ll be able to use the app as soon as it’s approved.
        </p>
      </div>
    );
  }

  // --------------------------------------------------------------
  // 3️⃣  Fully‑authorized app – everything else you already had
  // --------------------------------------------------------------
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
}

// --------------------------------------------------------------
// 4️⃣  Wrap the whole app in the AuthProvider (only once, at root)
// --------------------------------------------------------------
const WrappedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default WrappedApp;
