import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, Plus, Pencil, Trash2, X, Check, Pin } from "lucide-react";

interface Ann {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

const emptyForm = { title: "", content: "", pinned: false };

export default function AdminAnnouncements() {
  const [anns, setAnns] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAnns = () => {
    api.get<Ann[]>("/announcements").then(a => { setAnns(a); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchAnns(); }, []);

  const startEdit = (a: Ann) => { setEditing(a.id); setCreating(false); setForm({ title: a.title, content: a.content, pinned: a.pinned }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await api.patch(`/admin/announcements/${editing}`, form);
      else await api.post("/admin/announcements", form);
      setEditing(null); setCreating(false); setForm(emptyForm); fetchAnns();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try { await api.delete(`/admin/announcements/${id}`); fetchAnns(); } catch (err: any) { alert(err.message); }
  };

  const Form = () => (
    <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-3">
      <div>
        <Label className="text-gray-400 text-xs">Title</Label>
        <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1 bg-white/5 border-white/15 text-white text-sm focus:border-purple-500" />
      </div>
      <div>
        <Label className="text-gray-400 text-xs">Content</Label>
        <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3}
          className="w-full mt-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="pinned" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} />
        <Label htmlFor="pinned" className="text-gray-400 text-sm">Pin announcement</Label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={saving} onClick={save} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <Check className="w-4 h-4 mr-1" />{saving ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setEditing(null); setCreating(false); }} className="text-gray-400">
          <X className="w-4 h-4 mr-1" />Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Announcements">
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Announcements</h1>
            <p className="text-gray-500 text-sm">{anns.length} announcements</p>
          </div>
          {!creating && (
            <Button size="sm" onClick={() => { setCreating(true); setEditing(null); setForm(emptyForm); }} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Plus className="w-4 h-4 mr-1" />New
            </Button>
          )}
        </div>
        {creating && <Form />}
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {anns.map(ann => (
              <div key={ann.id}>
                {editing === ann.id ? <Form /> : (
                  <div className={`p-4 rounded-2xl border ${ann.pinned ? "border-purple-500/30 bg-purple-950/10" : "border-white/10 bg-white/[0.02]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {ann.pinned && <Pin className="w-3.5 h-3.5 text-purple-400" />}
                          <span className="text-white font-medium text-sm">{ann.title}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{ann.content}</p>
                        <div className="text-gray-600 text-xs mt-1.5">{new Date(ann.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(ann)} className="text-gray-400 hover:text-white h-8 w-8 p-0">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => del(ann.id)} className="text-gray-400 hover:text-red-400 h-8 w-8 p-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {anns.length === 0 && !creating && (
              <div className="text-center py-12 text-gray-500">
                <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />No announcements yet
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
