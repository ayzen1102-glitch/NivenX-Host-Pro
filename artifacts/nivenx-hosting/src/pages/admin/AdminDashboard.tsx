import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { Users, Server, CreditCard, Ticket, TrendingUp, DollarSign } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalServices: number;
  totalRevenue: number;
  openTickets: number;
  totalInvoices: number;
  activeServices: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AdminStats>("/admin/stats").then(s => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "from-purple-600/20 to-blue-600/20", border: "border-purple-500/20" },
    { label: "Active Services", value: stats?.activeServices ?? 0, icon: Server, color: "from-blue-600/20 to-cyan-600/20", border: "border-blue-500/20" },
    { label: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign, color: "from-green-600/20 to-teal-600/20", border: "border-green-500/20" },
    { label: "Open Tickets", value: stats?.openTickets ?? 0, icon: Ticket, color: "from-orange-600/20 to-red-600/20", border: "border-orange-500/20" },
    { label: "Total Invoices", value: stats?.totalInvoices ?? 0, icon: CreditCard, color: "from-yellow-600/20 to-orange-600/20", border: "border-yellow-500/20" },
    { label: "Total Services", value: stats?.totalServices ?? 0, icon: TrendingUp, color: "from-pink-600/20 to-purple-600/20", border: "border-pink-500/20" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Platform overview and statistics</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(card => (
              <div key={card.label} className={`p-5 rounded-2xl border ${card.border} bg-gradient-to-br ${card.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">{card.label}</span>
                  <card.icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-3xl font-black text-white">{card.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
