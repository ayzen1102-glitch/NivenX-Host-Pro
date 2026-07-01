import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Pin, Calendar } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export default function DashboardAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Announcement[]>("/announcements").then(a => { setItems(a); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Announcements">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-xl font-bold text-white">Announcements</h1>
          <p className="text-gray-500 text-sm mt-0.5">Latest news and updates from NivenX</p>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {[...items.filter(a => a.pinned), ...items.filter(a => !a.pinned)].map(ann => (
              <div key={ann.id} className={`p-5 rounded-2xl border transition-all ${ann.pinned ? "border-purple-500/30 bg-purple-950/20" : "border-white/10 bg-white/[0.02]"}`}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {ann.pinned && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      <Pin className="w-3 h-3 mr-1" />Pinned
                    </Badge>
                  )}
                  <h3 className="text-white font-semibold">{ann.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{ann.content}</p>
                <div className="flex items-center gap-1.5 mt-3 text-gray-600 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(ann.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                No announcements.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
