import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { AuthGuard } from "../components/auth/AuthGuard";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { Timer, Layers, Settings, FileText, Users, ClipboardList } from "lucide-react";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected App Routes */}
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/focus" 
            element={<PlaceholderPage title="Focus Timer" description="Your productivity engine is almost ready." icon={Timer} />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="/profile" 
            element={<Profile />} 
          />
          <Route 
            path="/modules" 
            element={<PlaceholderPage title="Modules" description="Manage and enable additional BLOC modules." icon={Layers} />} 
          />
          <Route 
            path="/log" 
            element={<PlaceholderPage title="Ship Log" description="A record of everything you've built." icon={FileText} />} 
          />
          <Route 
            path="/clients" 
            element={<PlaceholderPage title="Clients" description="Manage your client relationships and portals." icon={Users} />} 
          />
          <Route 
            path="/proposals" 
            element={<PlaceholderPage title="Proposals" description="Build and send professional project proposals." icon={ClipboardList} />} 
          />
          <Route 
            path="/settings" 
            element={<PlaceholderPage title="Settings" description="Customize your BLOC experience and sector preferences." icon={Settings} />} 
          />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
