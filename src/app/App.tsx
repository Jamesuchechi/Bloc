import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { AuthGuard } from "../components/auth/AuthGuard";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import FocusPage from "../pages/FocusPage";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ShipLogPage from "../pages/ShipLogPage";
import PublicSummaryPage from "../pages/PublicSummaryPage";
import ClientsPage from "../pages/ClientsPage";
import ClientDetail from "../pages/ClientDetail";
import PublicPortalPage from "../pages/PublicPortalPage";
import ProposalsPage from "../pages/ProposalsPage";
import ProposalBuilder from "../pages/ProposalBuilder";
import PublicProposalPage from "../pages/PublicProposalPage";
import IntegrationsPage from "../pages/IntegrationsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import NotificationsPage from "../pages/NotificationsPage";
import SettingsPage from "../pages/SettingsPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { Timer, Layers, Settings, FileText, Users, ClipboardList } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

import { AuthInitializer } from "../components/auth/AuthInitializer";
import { useSupabaseRealtime } from "../hooks/useSupabaseRealtime";

export default function App() {
  useSupabaseRealtime();
  
  return (
    <>
      <AuthInitializer />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a',
          },
        }} 
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/summary" element={<PublicSummaryPage />} />
        <Route path="/portal/:token" element={<PublicPortalPage />} />
        <Route path="/proposal/:token" element={<PublicProposalPage />} />
        
        {/* Protected App Routes */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/log" element={<ShipLogPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/proposals/:id" element={<ProposalBuilder />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
