import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Partner { id: number; name: string; logoUrl?: string | null; websiteUrl?: string | null }
interface Review { id: number; name: string; avatarUrl?: string | null; rating: number; comment: string; source: string }
interface Game { id: number; name: string; slug: string; imageUrl?: string | null; description?: string | null }
interface Plan { id: number; name: string; category: string; priceMonthly: number; priceYearly: number; features: string[]; imageUrl?: string | null; isActive: boolean; isFeatured: boolean }

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < n ? "text-green-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    api.get<Partner[]>("/public/partners").then(setPartners).catch(() => {});
    api.get<Review[]>("/public/reviews").then(setReviews).catch(() => {});
    api.get<Game[]>("/public/games").then(setGames).catch(() => {});
    api.get<{ plans: Plan[] }>("/plans").then(d => setPlans(d.plans.filter((p: Plan) => p.isActive))).catch(() => {});
  }, []);

  const categories = ["all", ...Array.from(new Set(plans.map(p => p.category)))];
  const filtered = activeCategory === "all" ? plans : plans.filter(p => p.category === activeCategory);
  const featured = filtered.filter(p => p.isFeatured).slice(0, 3);
  const displayPlans = featured.length >= 2 ? featured : filtered.slice(0, 3);

  const locations = [
    { city: "Singapore", region: "Asia Pacific", flag: "🇸🇬", ping: "8ms" },
    { city: "Frankfurt", region: "Europe", flag: "🇩🇪", ping: "5ms" },
    { city: "New York", region: "N. America", flag: "🇺🇸", ping: "6ms" },
    { city: "London", region: "Europe", flag: "🇬🇧", ping: "4ms" },
    { city: "Tokyo", region: "Asia Pacific", flag: "🇯🇵", ping: "7ms" },
    { city: "Sydney", region: "Oceania", flag: "🇦🇺", ping: "12ms" },
  ];

  return (
    <div className="min-h-screen bg-[#060612] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#060612] via-[#0a0820] to-[#060612]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-700/12 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[90px]" />
          <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:"linear-gradient(#7c3aed 1px,transparent 1px),linear-gradient(90deg,#7c3aed 1px,transparent 1px)",backgroundSize:"60px 60px"}} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur text-violet-300 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t("hero.badge")}
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
            <span className="block text-white">{t("hero.title1")}</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent py-2">
              {t("hero.titleHighlight")}
            </span>
            <span className="block text-white">{t("hero.title2")}</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/plans">
              <button className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-violet-900/50 hover:shadow-violet-700/60 hover:scale-105 active:scale-95">
                {t("hero.cta1")} <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur">
                {t("hero.cta2")}
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[["10K+", t("stats.servers")], ["99.99%", t("stats.uptime")], ["<60s", t("stats.deploy")], ["24/7", t("stats.support")]].map(([v, l]) => (
              <div key={l} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-colors">
                <div className="text-2xl font-black text-white">{v}</div>
                <div className="text-xs text-gray-500 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      {partners.length > 0 && (
        <section className="py-10 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-bold tracking-[0.3em] text-gray-600 uppercase mb-6">
              {t("partners.title")} <span className="text-violet-400">{t("partners.highlight")}</span>
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {partners.map(p => (
                <a key={p.id} href={p.websiteUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 rounded-xl transition-all duration-200 group">
                  {p.logoUrl && <img src={p.logoUrl} alt={p.name} className="w-7 h-7 rounded-md object-cover" />}
                  <span className="text-gray-400 group-hover:text-white font-medium transition-colors text-sm">{p.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              {t("features.title")}{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">{t("features.highlight")}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "⚡", key: "instant", grad: "from-yellow-500/10 to-orange-500/10", border: "hover:border-yellow-500/30" },
              { icon: "🛡️", key: "ddos", grad: "from-blue-500/10 to-cyan-500/10", border: "hover:border-blue-500/30" },
              { icon: "🌐", key: "global", grad: "from-violet-500/10 to-purple-500/10", border: "hover:border-violet-500/30" },
              { icon: "💾", key: "nvme", grad: "from-green-500/10 to-emerald-500/10", border: "hover:border-green-500/30" },
              { icon: "🔥", key: "ryzen", grad: "from-red-500/10 to-pink-500/10", border: "hover:border-red-500/30" },
              { icon: "⏱️", key: "uptime", grad: "from-indigo-500/10 to-blue-500/10", border: "hover:border-indigo-500/30" },
            ].map(f => (
              <div key={f.key} className={`group relative bg-white/[0.03] hover:bg-gradient-to-br ${f.grad} border border-white/10 ${f.border} rounded-2xl p-6 transition-all duration-300 overflow-hidden cursor-default`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{t(`features.${f.key}.title`)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(`features.${f.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#060612] via-[#09081a] to-[#060612]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
              {t("pricing.title")}{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">{t("pricing.highlight")}</span>
            </h2>
            <p className="text-gray-500 mb-8">{t("pricing.subtitle")}</p>
            <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-xl p-1 mb-6">
              {(["monthly", "yearly"] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${billing === b ? "bg-violet-600 text-white shadow-lg shadow-violet-900/50" : "text-gray-400 hover:text-white"}`}>
                  {t(`pricing.${b}`)}
                  {b === "yearly" && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{t("pricing.save")}</span>}
                </button>
              ))}
            </div>
            {categories.length > 2 && (
              <div className="flex justify-center gap-2 flex-wrap">
                {categories.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${activeCategory === c ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {displayPlans.map((plan, i) => {
              const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
              const pop = plan.isFeatured || (displayPlans.length === 3 && i === 1);
              return (
                <div key={plan.id} className={`relative rounded-2xl border flex flex-col transition-all duration-300 hover:scale-[1.02] overflow-hidden ${pop ? "border-violet-500/50 bg-gradient-to-b from-violet-900/20 to-purple-900/10 shadow-2xl shadow-violet-900/30" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"}`}>
                  {pop && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500" />
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    {pop && (
                      <div className="inline-block self-start px-3 py-1 bg-violet-600/20 border border-violet-500/30 rounded-full text-xs font-bold text-violet-300 mb-4">
                        ⭐ {t("pricing.popular")}
                      </div>
                    )}
                    {plan.imageUrl && (
                      <div className="w-full h-28 rounded-xl overflow-hidden mb-4 -mx-0">
                        <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-1">{plan.category}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-black text-white">${price}</span>
                      <span className="text-gray-500 text-sm">/{billing === "monthly" ? "mo" : "yr"}</span>
                    </div>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {(plan.features as string[]).slice(0, 6).map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2.5 text-sm text-gray-400">
                          <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register">
                      <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${pop ? "bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 shadow-lg shadow-violet-900/40" : "bg-white/10 hover:bg-white/20 border border-white/20"}`}>
                        {t("pricing.orderNow")}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          {displayPlans.length === 0 && (
            <p className="text-center text-gray-600 py-8">Loading plans...</p>
          )}
          <div className="text-center mt-10">
            <Link href="/plans">
              <span className="text-violet-400 hover:text-violet-300 font-medium transition-colors underline underline-offset-4 cursor-pointer">
                {t("pricing.viewAll")} →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── GAMES ── */}
      {games.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">{t("games.title")}</h2>
              <Link href="/plans">
                <span className="text-violet-400 hover:text-violet-300 text-sm font-semibold border border-violet-500/30 hover:border-violet-400/50 px-4 py-2 rounded-lg transition-all cursor-pointer">
                  {t("games.viewAll")} →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {games.map(game => (
                <Link href="/plans" key={game.id}>
                  <div className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:scale-105 cursor-pointer aspect-[4/3]">
                    {game.imageUrl ? (
                      <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-900/50 to-purple-900/50 flex items-center justify-center text-4xl">🎮</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-xs font-bold text-white leading-tight">{game.name}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── REVIEWS ── */}
      {reviews.length > 0 && (
        <section className="py-24 px-4 bg-[#080816]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">{t("reviews.title")}</h2>
              <p className="text-gray-500 mt-3">{t("reviews.subtitle")}</p>
            </div>
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-3">
                <Stars n={5} />
                <span className="text-white font-bold text-sm">5.0</span>
                <span className="text-gray-500 text-sm">· {t("reviews.ratedOn")} Trustpilot</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.slice(0, 6).map(r => (
                <div key={r.id} className="bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all hover:bg-white/[0.05]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                      {r.avatarUrl ? <img src={r.avatarUrl} alt={r.name} className="w-full h-full object-cover" /> : r.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{r.name}</div>
                      <Stars n={r.rating} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">"{r.comment}"</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    Verified · {r.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCATIONS ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{t("locations.title")}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t("locations.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map(loc => (
              <div key={loc.city} className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-violet-500/30 rounded-2xl p-4 text-center transition-all cursor-default">
                <div className="text-3xl mb-2">{loc.flag}</div>
                <div className="text-sm font-bold text-white">{loc.city}</div>
                <div className="text-xs text-gray-600 mb-2">{loc.region}</div>
                <div className="text-xs font-mono text-violet-400 mb-1">{loc.ping}</div>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-violet-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-blue-900/20" />
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"linear-gradient(#7c3aed 1px,transparent 1px),linear-gradient(90deg,#7c3aed 1px,transparent 1px)",backgroundSize:"40px 40px"}} />
            <div className="relative z-10 text-center py-20 px-8">
              <h2 className="text-4xl sm:text-5xl font-black mb-4">{t("cta.title")}</h2>
              <p className="text-gray-400 text-lg mb-10">{t("cta.subtitle")}</p>
              <Link href="/register">
                <button className="px-10 py-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl shadow-violet-900/50 hover:scale-105 active:scale-95">
                  {t("cta.button")} →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
