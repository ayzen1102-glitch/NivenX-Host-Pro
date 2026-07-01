import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Server, Plus, Power, Globe, HardDrive } from "lucide-react";

interface Service {
  id: string;
  name: string;
  type: string;
  status: string;
  ipAddress?: string;
  hostname?: string;
  createdAt: string;
  plan?: { name: string; ram: string; storage: string; cpu: string };
}

const statusBadge: Record<string, string> = {
  active: "text-green-400 bg-green-400/10 border-green-400/20",
  suspended: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  pending: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Service[]>("/services").then(s => { setServices(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">My Services</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your hosting services</p>
          </div>
          <Link href="/plans">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
              <Plus className="w-4 h-4 mr-1.5" />
              Order Service
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/[0.02]">
            <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No services yet</h3>
            <p className="text-gray-500 text-sm mb-5">Get started by ordering your first hosting plan.</p>
            <Link href="/plans">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                Browse Plans
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map(service => (
              <div key={service.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Server className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{service.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusBadge[service.status] || "text-gray-400"}`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Power className="w-3 h-3" />
                          {service.type}
                        </span>
                        {service.ipAddress && (
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {service.ipAddress}
                          </span>
                        )}
                        {service.plan && (
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {service.plan.name} · {service.plan.ram} RAM
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-xs">Since {new Date(service.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
