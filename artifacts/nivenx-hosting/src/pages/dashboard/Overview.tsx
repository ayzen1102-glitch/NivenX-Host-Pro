import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Server, CreditCard, Ticket, TrendingUp, ArrowRight, Activity, Clock, Check, AlertCircle } from "lucide-react";

interface Stats {
  services: number;
  activeServices: number;
  openTickets: number;
  totalInvoices: number;
  pendingInvoices: number;
}

interface Service {
  id: string;
  name: string;
  type: string;
  status: string;
  ipAddress?: string;
}

interface Invoice {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  active: "text-green-400 bg-green-400/10 border-green-400/20",
  suspended: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  pending: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    api.get<Stats>("/dashboard/stats").then(setStats).catch(() => {});
    api.get<Service[]>("/services").then(s => setServices(s.slice(0, 3))).catch(() => {});
    api.get<Invoice[]>("/billing/invoices").then(i => setInvoices(i.slice(0, 5))).catch(() => {});
  }, []);

  const statCards = [
    { label: "Active Services", value: stats?.activeServices ?? 0, icon: Server, color: "from-purple-600/20 to-blue-600/20", border: "border-purple-500/20" },
    { label: "Open Tickets", value: stats?.openTickets ?? 0, icon: Ticket, color: "from-orange-600/20 to-red-600/20", border: "border-orange-500/20" },
    { label: "Total Invoices", value: stats?.totalInvoices ?? 0, icon: CreditCard, color: "from-green-600/20 to-teal-600/20", border: "border-green-500/20" },
    { label: "Pending Payments", value: stats?.pendingInvoices ?? 0, icon: TrendingUp, color: "from-blue-600/20 to-cyan-600/20", border: "border-blue-500/20" },
  ];

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => (
            <div key={card.label} className={`p-5 rounded-2xl border ${card.border} bg-gradient-to-br ${card.color}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">{card.label}</span>
                <card.icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-3xl font-black text-white">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Services */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Active Services
              </h3>
              <Link href="/dashboard/services">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white text-xs">
                  View all <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            {services.length === 0 ? (
              <div className="text-center py-8">
                <Server className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No services yet</p>
                <Link href="/plans">
                  <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700 text-white border-0 text-xs">
                    Browse Plans
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div>
                      <div className="text-white text-sm font-medium">{service.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{service.type} · {service.ipAddress || "No IP assigned"}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor[service.status] || "text-gray-400"}`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-400" />
                Recent Invoices
              </h3>
              <Link href="/dashboard/billing">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white text-xs">
                  View all <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      {invoice.status === "paid" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : invoice.status === "pending" ? (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <div>
                        <div className="text-white text-sm font-medium">${invoice.amount.toFixed(2)}</div>
                        <div className="text-gray-500 text-xs">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      invoice.status === "paid" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                      invoice.status === "pending" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                      "text-red-400 bg-red-400/10 border-red-400/20"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
