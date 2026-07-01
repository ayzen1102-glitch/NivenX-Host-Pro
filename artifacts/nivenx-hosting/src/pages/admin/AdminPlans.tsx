import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  category: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  isPopular: boolean;
  isActive: boolean;
}

const emptyPlan = { name: "", category: "game", description: "", priceMonthly: "", priceYearly: "", ram: "", cpu: "", storage: "", bandwidth: "", isPopular: false };

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyPlan);
  const [saving, setSaving] = useState(false);

  const fetchPlans = () => {
    api.get<Plan[]>("/plans?all=true").then(p => { setPlans(p); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchPlans(); }, []);

  const startEdit = (plan: Plan) => {
    setEditing(plan.id);
    setForm({ name: plan.name, category: plan.category, description: plan.description, priceMonthly: String(plan.priceMonthly), priceYearly: String(plan.priceYearly), ram: plan.ram, cpu: plan.cpu, storage: plan.storage, bandwidth: plan.bandwidth, isPopular: plan.isPopular } as any);
  };

  const savePlan = async () => {
    setSaving(true);
    try {
      const data = { ...form, priceMonthly: parseFloat(form.priceMonthly as string), priceYearly: parseFloat(form.priceYearly as string) };
      if (editing) {
        await api.patch(`/admin/plans/${editing}`, data);
      } else {
        await api.post("/admin/plans", data);
      }
      setEditing(null); setCreating(false); setForm(emptyPlan); fetchPlans();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    try { await api.delete(`/admin/plans/${id}`); fetchPlans(); } catch (err: any) { alert(err.message); }
  };

  const PlanForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-white/10 rounded-2xl bg-white/[0.02]">
      {[
        { key: "name", label: "Plan Name" }, { key: "category", label: "Category" },
        { key: "description", label: "Description" }, { key: "ram", label: "RAM" },
        { key: "cpu", label: "CPU" }, { key: "storage", label: "Storage" },
        { key: "bandwidth", label: "Bandwidth" }, { key: "priceMonthly", label: "Monthly Price" },
        { key: "priceYearly", label: "Yearly Price" },
      ].map(({ key, label }) => (
        <div key={key}>
          <Label className="text-gray-400 text-xs">{label}</Label>
          <Input
            value={(form as any)[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            className="mt-1 bg-white/5 border-white/15 text-white text-sm focus:border-purple-500"
          />
        </div>
      ))}
      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" id="popular" checked={form.isPopular as boolean} onChange={e => setForm(f => ({ ...f, isPopular: e.target.checked }))} className="rounded" />
        <Label htmlFor="popular" className="text-gray-400 text-sm">Mark as Popular</Label>
      </div>
      <div className="col-span-2 flex gap-2 mt-2">
        <Button size="sm" disabled={saving} onClick={savePlan} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <Check className="w-4 h-4 mr-1" />{saving ? "Saving..." : "Save Plan"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setEditing(null); setCreating(false); }} className="text-gray-400">
          <X className="w-4 h-4 mr-1" />Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Plans">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Plans</h1>
            <p className="text-gray-500 text-sm">{plans.length} hosting plans</p>
          </div>
          {!creating && (
            <Button size="sm" onClick={() => { setCreating(true); setEditing(null); setForm(emptyPlan); }} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Plus className="w-4 h-4 mr-1" />Add Plan
            </Button>
          )}
        </div>

        {creating && <PlanForm />}

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {plans.map(plan => (
              <div key={plan.id}>
                {editing === plan.id ? (
                  <PlanForm />
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{plan.name}</span>
                          {plan.isPopular && <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">Popular</span>}
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{plan.category}</span>
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">{plan.ram} · {plan.cpu} · {plan.storage} · ${plan.priceMonthly}/mo</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(plan)} className="text-gray-400 hover:text-white h-8 w-8 p-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deletePlan(plan.id)} className="text-gray-400 hover:text-red-400 h-8 w-8 p-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
