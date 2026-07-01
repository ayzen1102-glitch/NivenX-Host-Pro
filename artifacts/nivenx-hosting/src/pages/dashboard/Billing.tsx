import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, Download, Check, Clock, AlertCircle } from "lucide-react";

interface Invoice {
  id: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
  paidAt?: string;
  stripeInvoiceId?: string;
}

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    api.get<Invoice[]>("/billing/invoices").then(i => { setInvoices(i); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { url } = await api.post<{ url: string }>("/billing/portal", {
        returnUrl: window.location.href
      });
      window.open(url, "_blank");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPortalLoading(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "paid") return <Check className="w-4 h-4 text-green-400" />;
    if (status === "pending") return <Clock className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const statusClass = (status: string) => {
    if (status === "paid") return "text-green-400 bg-green-400/10 border-green-400/20";
    if (status === "pending") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  return (
    <DashboardLayout title="Billing">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Billing</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your payments and invoices</p>
          </div>
          <Button
            onClick={openPortal}
            disabled={portalLoading}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            <ExternalLink className="w-4 h-4 mr-1.5" />
            {portalLoading ? "Loading..." : "Manage Billing"}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
            <div className="text-gray-400 text-sm mb-2">Total Invoices</div>
            <div className="text-2xl font-black text-white">{invoices.length}</div>
          </div>
          <div className="p-5 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-600/10 to-teal-600/10">
            <div className="text-gray-400 text-sm mb-2">Total Paid</div>
            <div className="text-2xl font-black text-white">
              ${invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0).toFixed(2)}
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-600/10 to-orange-600/10">
            <div className="text-gray-400 text-sm mb-2">Pending</div>
            <div className="text-2xl font-black text-white">
              ${invoices.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="p-5 border-b border-white/10">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              Invoice History
            </h3>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No invoices found</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {invoices.map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    {statusIcon(invoice.status)}
                    <div>
                      <div className="text-white text-sm font-medium">{invoice.description || `Invoice #${invoice.id.slice(0, 8)}`}</div>
                      <div className="text-gray-500 text-xs">{new Date(invoice.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">${invoice.amount.toFixed(2)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                    {invoice.stripeInvoiceId && (
                      <button className="text-gray-500 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
