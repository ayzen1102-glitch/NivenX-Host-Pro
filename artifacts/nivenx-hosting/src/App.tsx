import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Plans from "@/pages/Plans";
import Announcements from "@/pages/Announcements";
import Knowledgebase from "@/pages/Knowledgebase";

import Overview from "@/pages/dashboard/Overview";
import Services from "@/pages/dashboard/Services";
import Billing from "@/pages/dashboard/Billing";
import Tickets from "@/pages/dashboard/Tickets";
import DashboardAnnouncements from "@/pages/dashboard/DashboardAnnouncements";
import Settings from "@/pages/dashboard/Settings";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminPlans from "@/pages/admin/AdminPlans";
import AdminTickets from "@/pages/admin/AdminTickets";
import AdminAnnouncements from "@/pages/admin/AdminAnnouncements";
import AdminKB from "@/pages/admin/AdminKB";
import AdminSettings from "@/pages/admin/AdminSettings";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Redirect to="/login" />;
  if (!isAdmin) return <Redirect to="/dashboard" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/plans" component={Plans} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/knowledgebase" component={Knowledgebase} />

      {/* Dashboard */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Overview} />}
      </Route>
      <Route path="/dashboard/services">
        {() => <ProtectedRoute component={Services} />}
      </Route>
      <Route path="/dashboard/billing">
        {() => <ProtectedRoute component={Billing} />}
      </Route>
      <Route path="/dashboard/tickets">
        {() => <ProtectedRoute component={Tickets} />}
      </Route>
      <Route path="/dashboard/announcements">
        {() => <ProtectedRoute component={DashboardAnnouncements} />}
      </Route>
      <Route path="/dashboard/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>

      {/* Admin */}
      <Route path="/admin">
        {() => <AdminRoute component={AdminDashboard} />}
      </Route>
      <Route path="/admin/users">
        {() => <AdminRoute component={AdminUsers} />}
      </Route>
      <Route path="/admin/plans">
        {() => <AdminRoute component={AdminPlans} />}
      </Route>
      <Route path="/admin/tickets">
        {() => <AdminRoute component={AdminTickets} />}
      </Route>
      <Route path="/admin/announcements">
        {() => <AdminRoute component={AdminAnnouncements} />}
      </Route>
      <Route path="/admin/kb">
        {() => <AdminRoute component={AdminKB} />}
      </Route>
      <Route path="/admin/settings">
        {() => <AdminRoute component={AdminSettings} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
