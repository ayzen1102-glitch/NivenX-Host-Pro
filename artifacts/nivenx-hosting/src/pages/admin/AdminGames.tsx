import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";

interface Game { id: number; name: string; slug: string; imageUrl?: string | null; description?: string | null; sortOrder: number; isActive: boolean }

export default function AdminGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "", description: "", sortOrder: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get<Game[]>("/admin/games").then(setGames).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editId) await api.patch(`/admin/games/${editId}`, form);
      else await api.post("/admin/games", form);
      setForm({ name: "", slug: "", imageUrl: "", description: "", sortOrder: 0 });
      setEditId(null);
      load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this game?")) return;
    await api.delete(`/admin/games/${id}`);
    load();
  };

  const toggle = async (g: Game) => {
    await api.patch(`/admin/games/${g.id}`, { isActive: !g.isActive });
    load();
  };

  const edit = (g: Game) => {
    setEditId(g.id);
    setForm({ name: g.name, slug: g.slug, imageUrl: g.imageUrl ?? "", description: g.description ?? "", sortOrder: g.sortOrder });
  };

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <AdminLayout title="Games">
      <div className="max-w-4xl space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">{editId ? "Edit Game" : "Add Game"}</h2>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Game Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editId ? f.slug : autoSlug(e.target.value) }))} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="Minecraft" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Slug *</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="minecraft" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Image URL</label>
              <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-orange-500/50" placeholder="Short description..." />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm">
                {saving ? "Saving..." : editId ? "Update Game" : "Add Game"}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm({ name: "", slug: "", imageUrl: "", description: "", sortOrder: 0 }); }}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm">Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Games ({games.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : games.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No games yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {games.map(g => (
                <div key={g.id} className={`relative rounded-xl overflow-hidden border transition-all ${g.isActive ? "border-white/10" : "border-white/5 opacity-50"}`}>
                  <div className="aspect-[16/9] bg-[#111] relative">
                    {g.imageUrl ? (
                      <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🎮</div>
                    )}
                    <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${g.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-500"}`}>
                      {g.isActive ? "Live" : "Hidden"}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-white font-semibold text-sm">{g.name}</div>
                    <div className="text-gray-600 text-xs font-mono">{g.slug}</div>
                    {g.description && <div className="text-gray-500 text-xs mt-1 truncate">{g.description}</div>}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => toggle(g)} className="flex-1 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                        {g.isActive ? "Hide" : "Show"}
                      </button>
                      <button onClick={() => edit(g)} className="flex-1 py-1.5 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors">Edit</button>
                      <button onClick={() => del(g.id)} className="flex-1 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">Del</button>
                    </div>
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
