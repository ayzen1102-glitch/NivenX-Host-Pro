import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";

interface Review { id: number; name: string; avatarUrl?: string | null; rating: number; comment: string; source: string; sortOrder: number; isActive: boolean }

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", avatarUrl: "", rating: 5, comment: "", source: "trustpilot", sortOrder: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get<Review[]>("/admin/reviews").then(setReviews).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editId) await api.patch(`/admin/reviews/${editId}`, form);
      else await api.post("/admin/reviews", form);
      setForm({ name: "", avatarUrl: "", rating: 5, comment: "", source: "trustpilot", sortOrder: 0 });
      setEditId(null);
      load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    await api.delete(`/admin/reviews/${id}`);
    load();
  };

  const toggle = async (r: Review) => {
    await api.patch(`/admin/reviews/${r.id}`, { isActive: !r.isActive });
    load();
  };

  const edit = (r: Review) => {
    setEditId(r.id);
    setForm({ name: r.name, avatarUrl: r.avatarUrl ?? "", rating: r.rating, comment: r.comment, source: r.source, sortOrder: r.sortOrder });
  };

  return (
    <AdminLayout title="Reviews">
      <div className="max-w-4xl space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">{editId ? "Edit Review" : "Add Review"}</h2>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Rating (1–5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Source</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full px-3 py-2.5 bg-[#0d0d1e] border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50">
                <option value="trustpilot">Trustpilot</option>
                <option value="google">Google</option>
                <option value="discord">Discord</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Avatar URL</label>
              <input value={form.avatarUrl} onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Comment *</label>
              <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} required rows={3}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50 resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm">
                {saving ? "Saving..." : editId ? "Update" : "Add Review"}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ name: "", avatarUrl: "", rating: 5, comment: "", source: "trustpilot", sortOrder: 0 }); }}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm">Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Reviews ({reviews.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No reviews yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {reviews.map(r => (
                <div key={r.id} className="flex items-start gap-4 p-4 hover:bg-white/[0.02]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                    {r.avatarUrl ? <img src={r.avatarUrl} alt={r.name} className="w-full h-full object-cover" /> : r.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">{r.name}</span>
                      <span className="text-yellow-400 text-xs">{"★".repeat(r.rating)}</span>
                      <span className="text-gray-600 text-xs">{r.source}</span>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2">"{r.comment}"</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${r.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-500"}`}>
                    {r.isActive ? "Visible" : "Hidden"}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggle(r)} className="px-2.5 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                      {r.isActive ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => edit(r)} className="px-2.5 py-1.5 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => del(r.id)} className="px-2.5 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">Del</button>
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
