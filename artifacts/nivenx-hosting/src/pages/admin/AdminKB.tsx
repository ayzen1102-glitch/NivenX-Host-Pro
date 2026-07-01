import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  createdAt: string;
}

const emptyForm = { title: "", content: "", category: "", slug: "" };

export default function AdminKB() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchArticles = () => {
    api.get<Article[]>("/kb").then(a => { setArticles(a); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchArticles(); }, []);

  const startEdit = (a: Article) => { setEditing(a.id); setCreating(false); setForm({ title: a.title, content: a.content, category: a.category, slug: a.slug }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await api.patch(`/admin/kb/${editing}`, form);
      else await api.post("/admin/kb", form);
      setEditing(null); setCreating(false); setForm(emptyForm); fetchArticles();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try { await api.delete(`/admin/kb/${id}`); fetchArticles(); } catch (err: any) { alert(err.message); }
  };

  const Form = () => (
    <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-950/10 space-y-3">
      {[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "slug", label: "Slug (URL)" },
      ].map(({ key, label }) => (
        <div key={key}>
          <Label className="text-gray-400 text-xs">{label}</Label>
          <Input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="mt-1 bg-white/5 border-white/15 text-white text-sm focus:border-blue-500" />
        </div>
      ))}
      <div>
        <Label className="text-gray-400 text-xs">Content</Label>
        <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5}
          className="w-full mt-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={saving} onClick={save} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
          <Check className="w-4 h-4 mr-1" />{saving ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setEditing(null); setCreating(false); }} className="text-gray-400">
          <X className="w-4 h-4 mr-1" />Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Knowledgebase">
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Knowledgebase</h1>
            <p className="text-gray-500 text-sm">{articles.length} articles</p>
          </div>
          {!creating && (
            <Button size="sm" onClick={() => { setCreating(true); setEditing(null); setForm(emptyForm); }} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
              <Plus className="w-4 h-4 mr-1" />New Article
            </Button>
          )}
        </div>
        {creating && <Form />}
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {articles.map(a => (
              <div key={a.id}>
                {editing === a.id ? <Form /> : (
                  <div className="flex items-start justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all gap-3">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-white font-medium text-sm">{a.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-blue-400 text-xs">{a.category}</span>
                          <span className="text-gray-600 text-xs">·/{a.slug}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(a)} className="text-gray-400 hover:text-white h-8 w-8 p-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => del(a.id)} className="text-gray-400 hover:text-red-400 h-8 w-8 p-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {articles.length === 0 && !creating && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />No articles yet
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
