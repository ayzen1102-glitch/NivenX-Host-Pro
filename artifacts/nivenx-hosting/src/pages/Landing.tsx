import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Zap, 
  Shield, 
  Globe, 
  HardDrive, 
  Cpu, 
  Clock, 
  Star, 
  ArrowRight, 
  Check, 
  Server, 
  Activity, 
  User, 
  MapPin, 
  ExternalLink,
  Terminal,
  Layers,
  ArrowUpRight
} from "lucide-react";

interface Partner { id: number; name: string; logoUrl?: string | null; websiteUrl?: string | null }
interface Review { id: number; name: string; avatarUrl?: string | null; rating: number; comment: string; source: string }
interface Game { id: number; name: string; slug: string; imageUrl?: string | null; description?: string | null }
interface Plan { id: number; name: string; category: string; priceMonthly: number; priceYearly: number; features: string[]; imageUrl?: string | null; isActive: boolean; isFeatured: boolean }

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < n ? "text-emerald-400 fill-emerald-400" : "text-slate-700"}`} 
        />
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
    { city: "Singapore", region: "Asia Pacific", ping: "8ms" },
    { city: "Frankfurt", region: "Europe", ping: "5ms" },
    { city: "New York", region: "N. America", ping: "6ms" },
    { city: "London", region: "Europe", ping: "4ms" },
    { city: "Tokyo", region: "Asia Pacific", ping: "7ms" },
    { city: "Sydney", region: "Oceania", ping: "12ms" },
  ];

  const featureConfigs: Record<string, { icon: React.ComponentType<any>; color: string; border: string }> = {
    instant: { icon: Zap, color: "from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/20", border: "hover:border-amber-500/40" },
    ddos: { icon: Shield, color: "from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/20", border: "hover:border-blue-500/40" },
    global: { icon: Globe, color: "from-violet-500/10 to-fuchsia-500/10 text-violet-400 border-violet-500/20", border: "hover:border-violet-500/40" },
    nvme: { icon: HardDrive, color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20", border: "hover:border-emerald-500/40" },
    ryzen: { icon: Cpu, color: "from-rose-500/10 to-red-500/10 text-rose-400 border-rose-500/20", border: "hover:border-rose-500/40" },
    uptime: { icon: Clock, color: "from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20", border: "hover:border-cyan-500/40" },
  };

  return (
    <div className="min-h-screen bg-[#030307] text-slate-100 font-sans selection:bg-violet-500/30 overflow-x-hidden antialiased">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_55%)]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] animate-pulse duration-[8000ms]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-950/30 backdrop-blur-md text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-8 shadow-inner animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t("hero.badge")}
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8 bg-clip-text text-white">
            <span className="block opacity-90">{t("hero.title1")}</span>
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent py-3">
              {t("hero.titleHighlight")}
            </span>
            <span className="block opacity-90">{t("hero.title2")}</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
            <Link href="/plans">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-xl shadow-indigo-950/50 hover:shadow-indigo-500/20 hover:-translate-y-0.5 w-full sm:w-auto overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative flex items-center justify-center gap-2">
                  {t("hero.cta1")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-4 bg-slate-900/40 hover:bg-slate-950/80 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl font-medium transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 w-full sm:w-auto">
                {t("hero.cta2")}
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-900 pt-12">
            {[["10K+", t("stats.servers")], ["99.99%", t("stats.uptime")], ["<60s", t("stats.deploy")], ["24/7", t("stats.support")]].map(([v, l]) => (
              <div key={l} className="relative group overflow-hidden rounded-2xl bg-slate-950/20 border border-slate-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/20">
                <div className="text-3xl font-extrabold tracking-tight text-white mb-1">{v}</div>
                <div className="text-xs font-medium text-slate-500 tracking-wide uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS SECTION ── */}
      {partners.length > 0 && (
        <section className="py-12 border-y border-slate-900 bg-slate-950/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-8">
              {t("partners.title")} <span className="text-indigo-400">{t("partners.highlight")}</span>
            </p>
            <div className="flex items-center justify-center gap-5 flex-wrap">
              {partners.map(p => (
                <a key={p.id} href={p.websiteUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900 hover:border-indigo-500/20 rounded-xl transition-all duration-300 group shadow-sm">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="w-5 h-5 rounded opacity-60 group-hover:opacity-100 transition-opacity object-cover" />
                  ) : (
                    <Layers className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  )}
                  <span className="text-slate-400 group-hover:text-slate-200 font-medium transition-colors text-sm">{p.name}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES SECTION ── */}
      <section className="py-28 px-4 relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
              {t("features.title")}{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{t("features.highlight")}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "instant", key: "instant" },
              { icon: "ddos", key: "ddos" },
              { icon: "global", key: "global" },
              { icon: "nvme", key: "nvme" },
              { icon: "ryzen", key: "ryzen" },
              { icon: "uptime", key: "uptime" },
            ].map(f => {
              const conf = featureConfigs[f.icon];
              const IconComp = conf.icon;
              return (
                <div key={f.key} className={`group relative bg-slate-950/20 border border-slate-900/80 ${conf.border} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between`}>
                  <div>
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${conf.color} border mb-6 shadow-inner`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors">{t(`features.${f.key}.title`)}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">{t(`features.${f.key}.desc`)}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section className="py-28 px-4 bg-gradient-to-b from-transparent via-slate-950/30 to-transparent border-y border-slate-900 relative">
        <div className="absolute top-1/4 right-0 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
              {t("pricing.title")}{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">{t("pricing.highlight")}</span>
            </h2>
            <p className="text-slate-400 max-w-md mx-auto font-light text-sm sm:text-base mb-10">{t("pricing.subtitle")}</p>
            
            <div className="inline-flex items-center bg-slate-950/80 border border-slate-900 rounded-xl p-1 mb-8 shadow-inner">
              {(["monthly", "yearly"] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-6 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${billing === b ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40" : "text-slate-400 hover:text-slate-200"}`}>
                  {t(`pricing.${b}`)}
                  {b === "yearly" && <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">{t("pricing.save")}</span>}
                </button>
              ))}
            </div>

            {categories.length > 2 && (
              <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto">
                {categories.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 capitalize ${activeCategory === c ? "bg-slate-800 text-white border border-slate-700 shadow" : "bg-slate-950/40 text-slate-400 hover:text-slate-200 border border-transparent"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {displayPlans.map((plan, i) => {
              const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
              const isPopular = plan.isFeatured || (displayPlans.length === 3 && i === 1);
              return (
                <div key={plan.id} className={`relative rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full ${isPopular ? "border border-indigo-500/40 bg-slate-950/60 shadow-2xl shadow-indigo-950/50" : "border border-slate-900 bg-slate-950/20 backdrop-blur-sm"}`}>
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    {isPopular && (
                      <div className="inline-flex self-start px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase text-indigo-300 mb-6">
                        {t("pricing.popular")}
                      </div>
                    )}
                    {plan.imageUrl && (
                      <div className="w-full h-32 rounded-xl overflow-hidden mb-6 border border-slate-900 shadow-inner">
                        <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                      </div>
                    )}
                    <div className="text-[10px] font-bold tracking-widest uppercase text-indigo-400 mb-1">{plan.category}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{plan.name}</h3>
                    <div className="flex items-baseline gap-1.5 mb-8">
                      <span className="text-4xl font-black text-white tracking-tight">${price}</span>
                      <span className="text-slate-500 text-xs font-medium">/{billing === "monthly" ? "mo" : "yr"}</span>
                    </div>
                    
                    <ul className="space-y-3.5 mb-8 flex-1 border-t border-slate-900/60 pt-6">
                      {(plan.features as string[]).slice(0, 6).map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-sm text-slate-400">
                          <div className="p-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 mt-0.5 flex-shrink-0">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/register">
                      <button className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${isPopular ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/10" : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"}`}>
                        {t("pricing.orderNow")}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {displayPlans.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
              <Terminal className="w-6 h-6 animate-pulse" />
              <p className="text-sm font-mono tracking-wide">Loading system deployment plans...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/plans">
              <span className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold tracking-wide text-sm transition-colors cursor-pointer group">
                {t("pricing.viewAll")} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── GAMES SECTION ── */}
      {games.length > 0 && (
        <section className="py-28 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{t("games.title")}</h2>
              </div>
              <Link href="/plans">
                <span className="text-slate-400 hover:text-white text-xs font-semibold tracking-wide uppercase border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-xl transition-all cursor-pointer bg-slate-950/20 backdrop-blur-sm">
                  {t("games.viewAll")}
                </span>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {games.map(game => (
                <Link href="/plans" key={game.id}>
                  <div className="group relative rounded-2xl overflow-hidden border border-slate-900 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer aspect-[3/4] bg-slate-950">
                    {game.imageUrl ? (
                      <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90" />
                    ) : (
                      <div className="w-full h-full bg-slate-900/40 flex items-center justify-center">
                        <Server className="w-8 h-8 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors leading-tight">{game.name}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── REVIEWS SECTION ── */}
      {reviews.length > 0 && (
        <section className="py-28 px-4 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent border-t border-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">{t("reviews.title")}</h2>
              <p className="text-slate-500 text-sm font-light">{t("reviews.subtitle")}</p>
            </div>

            <div className="flex justify-center mb-14">
              <div className="flex items-center gap-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl px-5 py-3 shadow-inner">
                <Stars n={5} />
                <span className="text-white font-bold text-sm border-l border-slate-800 pl-3">5.0</span>
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{t("reviews.ratedOn")} Trustpilot</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map(r => (
                <div key={r.id} className="bg-slate-950/10 border border-slate-900/80 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-950/30 flex flex-col justify-between backdrop-blur-sm">
                  <div>
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold border border-indigo-500/20 shadow-md overflow-hidden flex-shrink-0">
                        {r.avatarUrl ? (
                          <img src={r.avatarUrl} alt={r.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-white/80" />
                        )}
                      </div>
                      <div>
                        <div className="text-slate-200 font-semibold text-sm">{r.name}</div>
                        <div className="mt-0.5"><Stars n={r.rating} /></div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-light italic">"{r.comment}"</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-900/40 flex items-center gap-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    Verified · {r.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCATIONS SECTION ── */}
      <section className="py-28 px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">{t("locations.title")}</h2>
            <p className="text-slate-400 max-w-lg mx-auto font-light text-sm sm:text-base">{t("locations.subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map(loc => (
              <div key={loc.city} className="group bg-slate-950/20 hover:bg-slate-950/60 border border-slate-900/80 hover:border-indigo-500/20 rounded-2xl p-5 text-center transition-all duration-300 backdrop-blur-sm">
                <div className="inline-flex p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 mb-4 group-hover:border-indigo-500/20 transition-colors shadow-inner">
                  <MapPin className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{loc.city}</div>
                <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mb-3">{loc.region}</div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/5 border border-indigo-500/10 text-xs font-mono text-indigo-400 mb-3">
                  <Activity className="w-3 h-3 text-indigo-400/70" />
                  {loc.ping}
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider text-emerald-500 uppercase">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-15" />
          <div className="relative rounded-3xl overflow-hidden border border-slate-900 bg-slate-950/40 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
            
            <div className="relative z-10 text-center py-20 px-6 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">{t("cta.title")}</h2>
              <p className="text-slate-400 font-light text-base sm:text-lg mb-10">{t("cta.subtitle")}</p>
              <Link href="/register">
                <button className="group relative px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold tracking-wide transition-all duration-300 shadow-xl shadow-indigo-950/60 hover:shadow-indigo-500/20 hover:-translate-y-0.5 overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative flex items-center justify-center gap-2">
                    {t("cta.button")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
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
