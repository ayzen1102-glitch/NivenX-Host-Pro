import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Check } from "lucide-react";

interface SiteSettings {
  id: string;
  siteName?: string;
  tagline?: string;
  primaryColor?: string;
  accentColor?: string;
  maintenanceMode?: boolean;
  discordUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get<SiteSettings>("/admin/settings").then(s => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const update = (key: string, value: string | boolean) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMsg("");
    try {
      const updated = await api.patch<SiteSettings>("/admin/settings", settings);
      setSettings(updated);
      setMsg("Settings saved successfully!");
    } catch (err: any) { setMsg(err.message); }
    finally { setSaving(false); }
  };

  const fields = [
    { key: "siteName", label: "Site Name" },
    { key: "tagline", label: "Tagline" },
    { key: "primaryColor", label: "Primary Color (hex)" },
    { key: "accentColor", label: "Accent Color (hex)" },
    { key: "discordUrl", label: "Discord URL" },
    { key: "twitterUrl", label: "Twitter URL" },
    { key: "youtubeUrl", label: "YouTube URL" },
    { key: "instagramUrl", label: "Instagram URL" },
    { key: "tiktokUrl", label: "TikTok URL" },
  ];

  return (
    <AdminLayout title="Site Settings">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configure your NivenX Hosting platform</p>
        </div>
        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}</div>
        ) : !settings ? (
          <div className="text-gray-500 text-sm">Failed to load settings.</div>
        ) : (
          <form onSubmit={save} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            {msg && (
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                msg.includes("success") ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                {msg.includes("success") && <Check className="w-4 h-4" />}{msg}
              </div>
            )}
            {fields.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-gray-400 text-xs">{label}</Label>
                <Input
                  value={(settings as any)[key] ?? ""}
                  onChange={e => update(key, e.target.value)}
                  className="mt-1 bg-white/5 border-white/15 text-white text-sm focus:border-purple-500"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="maintenance"
                checked={!!settings.maintenanceMode}
                onChange={e => update("maintenanceMode", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="maintenance" className="text-gray-300 text-sm">Maintenance Mode</Label>
              {settings.maintenanceMode && (
                <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">Active — site shows maintenance page</span>
              )}
            </div>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Settings className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
