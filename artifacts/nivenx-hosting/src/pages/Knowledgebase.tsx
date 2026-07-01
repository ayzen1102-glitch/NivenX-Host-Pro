import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { BookOpen, Search, ChevronRight, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  createdAt: string;
}

export default function Knowledgebase() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api.get<Article[]>("/kb").then(a => { setArticles(a); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(articles.map(a => a.category))];
  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">Knowledgebase</h1>
            <p className="text-gray-400 mb-6">Find answers to common questions and learn how to use NivenX.</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-gray-600 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(article => (
                <div key={article.id} className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.04] transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-purple-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" />{article.category}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">{article.title}</h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{article.content}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors mt-1 shrink-0" />
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-16 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  No articles found.
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
