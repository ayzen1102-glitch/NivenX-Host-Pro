import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Server, CreditCard, Ticket, Bell,
  Settings, Shield, LogOut, Menu, X, ChevronRight, Server as ServerIcon
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "My Services", icon: Server },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/tickets", label: "Support", icon: Ticket },
  { href: "/dashboard/announcements", label: "Announcements", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin Panel", icon: Shield, adminOnly: true },
];

interface Props {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const [location] = useLocation();

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <ServerIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">NivenX <span className="text-purple-400">Hosting</span></span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {visibleItems.map(item => {
          const active = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {item.adminOnly && (
                <span className="ml-auto text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded-full">Admin</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{user?.name}</div>
            <div className="text-gray-500 text-xs truncate">{user?.email}</div>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 text-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#080810] text-white flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-60 border-r border-white/10 bg-black/40 fixed top-0 left-0 h-full flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-[#0c0c18] border-r border-white/10 flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-white/10 bg-black/20 backdrop-blur flex items-center px-4 gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            {title !== "Overview" && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white">{title}</span>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
