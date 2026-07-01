import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Megaphone, Pin, Calendar } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Announcement[]>("/announcements").then(a => { setItems(a); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const pinned = items.filter(a => a.pinned);
  const rest = items.filter(a => !a.pinned);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-7 h-7 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">Announcements</h1>
            <p className="text-gray-400">Stay up to date with the latest news and updates from NivenX.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[...pinned, ...rest].map(ann => (
                <div
                  key={ann.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    ann.pinned
                      ? "border-purple-500/30 bg-purple-950/20"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {ann.pinned && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            <Pin className="w-3 h-3 mr-1" />Pinned
                          </Badge>
                        )}
                        <h2 className="text-white font-bold">{ann.title}</h2>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{ann.content}</p>
                      <div className="flex items-center gap-1.5 mt-3 text-gray-600 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ann.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  No announcements yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
