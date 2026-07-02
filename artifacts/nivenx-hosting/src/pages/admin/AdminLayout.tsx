import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Package, Ticket, Megaphone,
  BookOpen, Settings, ArrowLeft, Shield, ChevronRight,
  Handshake, Star, Gamepad2
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/plans", label: "Plans", icon: Package },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/kb", label: "Knowledgebase", icon: BookOpen },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#080810] text-white flex">
      {/* Sidebar */}
      <div className="w-60 border-r border-orange-500/20 bg-orange-950/5 fixed top-0 left-0 h-full flex flex-col">
        <div className="p-4 border-b border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Admin Panel</div>
              <div className="text-orange-400 text-xs">NivenX Hosting</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-orange-600/20 text-orange-300 border border-orange-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-orange-500/20">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-400 hover:text-white text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="px-3 py-2 mt-1">
            <div className="text-white text-xs font-medium truncate">{user?.name}</div>
            <div className="text-gray-500 text-xs truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="h-14 border-b border-orange-500/10 bg-black/20 backdrop-blur flex items-center px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-orange-400">Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{title}</span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
