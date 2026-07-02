import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";

interface Partner { id: number; name: string; logoUrl?: string | null; websiteUrl?: string | null; sortOrder: number; isActive: boolean }

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", logoUrl: "", websiteUrl: "", sortOrder: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get<Partner[]>("/admin/partners").then(setPartners).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editId) {
        await api.patch(`/admin/partners/${editId}`, form);
      } else {
        await api.post("/admin/partners", form);
      }
      setForm({ name: "", logoUrl: "", websiteUrl: "", sortOrder: 0 });
      setEditId(null);
      load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this partner?")) return;
    await api.delete(`/admin/partners/${id}`);
    load();
  };

  const toggle = async (p: Partner) => {
    await api.patch(`/admin/partners/${p.id}`, { isActive: !p.isActive });
    load();
  };

  const edit = (p: Partner) => {
    setEditId(p.id);
    setForm({ name: p.name, logoUrl: p.logoUrl ?? "", websiteUrl: p.websiteUrl ?? "", sortOrder: p.sortOrder });
  };

  return (
    <AdminLayout title="Partners">
      <div className="max-w-4xl space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">{editId ? "Edit Partner" : "Add Partner"}</h2>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="Partner name" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Website URL</label>
              <input value={form.websiteUrl} onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Logo URL</label>
              <input value={form.logoUrl} onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm">
                {saving ? "Saving..." : editId ? "Update Partner" : "Add Partner"}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ name: "", logoUrl: "", websiteUrl: "", sortOrder: 0 }); }}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Partners ({partners.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : partners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No partners yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {partners.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02]">
                  {p.logoUrl && <img src={p.logoUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">{p.name}</div>
                    {p.websiteUrl && <div className="text-gray-500 text-xs truncate">{p.websiteUrl}</div>}
                  </div>
                  <div className="text-gray-600 text-xs">#{p.sortOrder}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-500"}`}>
                    {p.isActive ? "Active" : "Hidden"}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(p)} className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                      {p.isActive ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => edit(p)} className="px-3 py-1.5 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => del(p.id)} className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">Del</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
