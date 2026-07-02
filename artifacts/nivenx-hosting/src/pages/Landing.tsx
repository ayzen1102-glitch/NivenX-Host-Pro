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
  Layers,
  ArrowUpRight,
  Info,
  Calendar,
  MessageSquare
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
          className={`w-3.5 h-3.5 ${i < n ? "text-amber-400 fill-amber-400" : "text-slate-800"}`} 
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

  const featureConfigs: Record<string, { icon: React.ComponentType<any>; gradient: string; border: string }> = {
    instant: { icon: Zap, gradient: "from-amber-500/10 to-orange-500/5 text-amber-400", border: "hover:border-amber-500/30" },
    ddos: { icon: Shield, gradient: "from-blue-500/10 to-indigo-500/5 text-blue-400", border: "hover:border-blue-500/30" },
    global: { icon: Globe, gradient: "from-violet-500/10 to-fuchsia-500/5 text-violet-400", border: "hover:border-violet-500/30" },
    nvme: { icon: HardDrive, gradient: "from-emerald-500/10 to-teal-500/5 text-emerald-400", border: "hover:border-emerald-500/30" },
    ryzen: { icon: Cpu, gradient: "from-rose-500/10 to-red-500/5 text-rose-400", border: "hover:border-rose-500/30" },
    uptime: { icon: Clock, gradient: "from-cyan-500/10 to-blue-500/5 text-cyan-400", border: "hover:border-cyan-500/30" },
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden antialiased">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.07),transparent_55%)]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/40 backdrop-blur text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("hero.badge")}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white">
            <span>{t("hero.title1")}</span>
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent py-2">
              {t("hero.titleHighlight")}
            </span>
            <span>{t("hero.title2")}</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/plans">
              <button className="group px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 w-full sm:w-auto">
                {t("hero.cta1")} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-3.5 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-semibold transition-all duration-200 backdrop-blur w-full sm:w-auto">
                {t("hero.cta2")}
              </button>
            </Link>
          </div>

          {/* Micro Banner / Promo Link Style from Screenshot_20260702_134933.jpg */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-900 text-xs mb-20 text-slate-400 font-light">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Grab Our Hosting Deal: Starting at $2.59/mo</span>
            <Link href="/plans">
              <span className="text-indigo-400 hover:underline ml-1 cursor-pointer font-medium">Grab Deal Now</span>
            </Link>
          </div>

          {/* Stats Blocks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-900 pt-10">
            {[["10K+", t("stats.servers")], ["99.99%", t("stats.uptime")], ["<60s", t("stats.deploy")], ["24/7", t("stats.support")]].map(([v, l]) => (
              <div key={l} className="bg-slate-950/20 border border-slate-900/60 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-extrabold text-white">{v}</div>
                <div className="text-[11px] text-slate-500 font-medium uppercase mt-0.5 tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS SECTION ── */}
      {partners.length > 0 && (
        <section className="py-10 border-y border-slate-900 bg-slate-950/10">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-[10px] font-bold tracking-[0.25em] text-slate-600 uppercase mb-6">
              {t("partners.title")} <span className="text-indigo-400">{t("partners.highlight")}</span>
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {partners.map(p => (
                <a key={p.id} href={p.websiteUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-xl transition-all group">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="w-5 h-5 rounded opacity-50 group-hover:opacity-100 transition-opacity object-cover" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                  )}
                  <span className="text-slate-400 group-hover:text-slate-200 font-medium transition-colors text-xs">{p.name}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING SECTION (MATCHED WITH SCREENSHOTS) ── */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Web Hosting Plans That Fit Your Budget
            </h2>
            <p className="text-slate-500 font-light text-sm max-w-xl mx-auto">{t("pricing.subtitle")}</p>
            
            {/* Toggle Switch Inspired by Screenshot_20260702_134903.jpg */}
            <div className="inline-flex items-center gap-3 mt-8 bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5">
              <span className={`text-xs font-semibold ${billing === "monthly" ? "text-white" : "text-slate-500"}`}>Monthly</span>
              <button 
                onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
                className="w-9 h-5 bg-indigo-600 rounded-full relative p-0.5 transition-colors focus:outline-none"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${billing === "yearly" ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${billing === "yearly" ? "text-white" : "text-slate-500"}`}>
                Yearly <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-medium capitalize">{t("pricing.save")}</span>
              </span>
            </div>

            {categories.length > 2 && (
              <div className="flex justify-center gap-2 flex-wrap mt-6">
                {categories.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className={`px-4 py-1 rounded-full text-xs font-medium transition-all capitalize ${activeCategory === c ? "bg-slate-800 text-white border border-slate-700" : "bg-slate-950/40 text-slate-500 hover:text-slate-300"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Grid Layout matching Screenshot_20260702_134903.jpg */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {displayPlans.map((plan, i) => {
              const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
              const isPopular = plan.isFeatured || (displayPlans.length === 3 && i === 1);
              
              return (
                <div key={plan.id} className={`rounded-3xl border flex flex-col transition-all duration-300 bg-slate-950/40 hover:bg-slate-950/80 ${isPopular ? "border-indigo-500/40 shadow-xl shadow-indigo-950/20" : "border-slate-900"}`}>
                  
                  {/* Top Header Card Block */}
                  <div className={`p-6 rounded-t-3xl border-b ${isPopular ? "bg-gradient-to-b from-indigo-950/30 to-transparent border-indigo-900/30" : "bg-slate-950/60 border-slate-900"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white capitalize">{plan.name}</h3>
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                        {plan.category}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 text-xs mb-5 font-light">Everything you need for your website</p>
                    
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-black text-white">${price}</span>
                      <span className="text-slate-500 text-xs">/month</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-light mb-6">Will charge equivalent amount on renewal</p>

                    <Link href="/register">
                      <button className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${isPopular ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/50" : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"}`}>
                        Get Started →
                      </button>
                    </Link>
                  </div>

                  {/* Features List Block */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <ul className="space-y-3.5 mb-6">
                      {(plan.features as string[]).slice(0, 8).map((f, fi) => (
                        <li key={fi} className="flex items-center justify-between gap-2 text-xs text-slate-400">
                          <div className="flex items-center gap-2.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="font-light">{f}</span>
                          </div>
                          <Info className="w-3 h-3 text-slate-700 hover:text-slate-500 cursor-pointer flex-shrink-0" />
                        </li>
                      ))}
                    </ul>

                    <button className="w-full py-2 bg-slate-900/20 hover:bg-slate-900/50 text-slate-500 hover:text-slate-300 border border-slate-900/60 rounded-xl text-[11px] font-semibold tracking-wide transition-colors uppercase">
                      More Features
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {displayPlans.length === 0 && (
            <p className="text-center text-slate-600 py-8 font-mono text-xs">Loading target plans...</p>
          )}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
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
                <div key={f.key} className={`group relative bg-slate-950/20 hover:bg-gradient-to-br ${conf.gradient} border border-slate-900 ${conf.border} rounded-2xl p-6 transition-all duration-300`}>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 inline-flex mb-4 shadow-inner">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-200 mb-2">{t(`features.${f.key}.title`)}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{t(`features.${f.key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GAMES SECTION ── */}
      {games.length > 0 && (
        <section className="py-20 px-4 border-t border-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t("games.title")}</h2>
              <Link href="/plans">
                <span className="text-slate-400 hover:text-white text-xs font-semibold tracking-wide border border-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                  {t("games.viewAll")} →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {games.map(game => (
                <Link href="/plans" key={game.id}>
                  <div className="group relative rounded-2xl overflow-hidden border border-slate-900 hover:border-indigo-500/20 transition-all duration-300 cursor-pointer aspect-[4/3] bg-slate-950">
                    {game.imageUrl ? (
                      <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-slate-900/40 flex items-center justify-center text-2xl">🎮</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-xs font-bold text-slate-200 leading-tight truncate">{game.name}</div>
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
        <section className="py-24 px-4 bg-[#04040a] border-t border-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black tracking-tight text-white">{t("reviews.title")}</h2>
              <p className="text-slate-500 text-xs font-light mt-2">{t("reviews.subtitle")}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.slice(0, 6).map(r => (
                <div key={r.id} className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-bold text-xs overflow-hidden flex-shrink-0">
                        {r.avatarUrl ? <img src={r.avatarUrl} alt={r.name} className="w-full h-full object-cover" /> : r.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-slate-300 font-semibold text-xs">{r.name}</div>
                        <Stars n={r.rating} />
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">"{r.comment}"</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center gap-1.5 text-[10px] font-medium text-slate-600 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Verified · {r.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCATIONS SECTION ── */}
      <section className="py-24 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight text-white mb-3">{t("locations.title")}</h2>
            <p className="text-slate-500 font-light text-xs max-w-sm mx-auto">{t("locations.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map(loc => (
              <div key={loc.city} className="bg-slate-950/20 border border-slate-900 p-4 text-center rounded-2xl">
                <div className="inline-flex p-2 rounded-xl bg-slate-900 border border-slate-800 mb-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-xs font-bold text-slate-200">{loc.city}</div>
                <div className="text-[10px] text-slate-600 mb-2">{loc.region}</div>
                <div className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 bg-indigo-500/5 rounded-md inline-block border border-indigo-500/10 mb-2">{loc.ping}</div>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-500">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ & BOTTOM CTA BLOCK (MATCHED WITH SCREENSHOT_20260702_134926.JPG) ── */}
      <section className="py-20 px-4 bg-slate-950/40 border-t border-slate-900 relative">
        <div className="max-w-3xl mx-auto">
          
          {/* FAQ Accordion Headers from Screenshot_20260702_134926.jpg */}
          <div className="space-y-3 mb-24">
            {[
              "Can I transfer my existing domain to your hosting service?",
              "Do you offer email hosting with domain hosting?",
              "Is technical support available if I need help?",
              "How secure is my domain with your service?"
            ].map((q, qi) => (
              <div key={qi} className="bg-slate-950/60 border border-slate-900/80 rounded-xl p-4 flex items-center justify-between text-slate-300 hover:text-white transition-colors cursor-pointer group">
                <span className="text-xs sm:text-sm font-medium">{qi + 2}. {q}</span>
                <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-slate-300 text-xs">
                  ∨
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-slate-500 pt-4">
              Didn't find your answer? please feel free to <span className="text-indigo-400 hover:underline cursor-pointer">Contact us ↗</span>
            </p>
          </div>

          {/* Need Hosting Footer Banner block from Screenshot_20260702_134926.jpg */}
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex p-3 rounded-full bg-slate-900 border border-slate-800 mb-5">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Need Hosting Plan for your Business?</h2>
            <p className="text-slate-500 font-light text-xs leading-relaxed mb-8">
              Switch to a better host today! Migrate your website effortlessly with our expert support. Get started now!
            </p>
            <Link href="/register">
              <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-indigo-950/50 flex items-center gap-2 mx-auto">
                <MessageSquare className="w-3.5 h-3.5" /> Book A Call
              </button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
  }
