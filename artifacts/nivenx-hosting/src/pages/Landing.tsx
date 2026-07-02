import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { 
  Zap, Shield, Globe, HardDrive, Cpu, Clock, Star, ArrowRight, 
  Check, Server, Activity, User, MapPin, Layers, ArrowUpRight, 
  Info, Calendar, MessageSquare, Terminal, ChevronDown, Sparkles,
  Gamepad2, Cloud, Network, Bot, ShieldAlert, Radio, Landmark, LifeBuoy
} from "lucide-react";

interface Partner { id: number; name: string; logoUrl?: string | null; websiteUrl?: string | null }
interface Review { id: number; name: string; avatarUrl?: string | null; rating: number; comment: string; source: string }
interface Game { id: number; name: string; slug: string; imageUrl?: string | null; description?: string | null }
interface Plan { id: number; name: string; category: string; priceMonthly: number; priceYearly: number; features: string[]; imageUrl?: string | null; isActive: boolean; isFeatured: boolean }

export default function Landing() {
  const { t } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"game" | "vps" | "vds" | "web" | "bot" | "v2ray">("game");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    api.get<Partner[]>("/public/partners").then(setPartners).catch(() => {});
    api.get<Review[]>("/public/reviews").then(setReviews).catch(() => {});
    api.get<Game[]>("/public/games").then(setGames).catch(() => {});
    api.get<{ plans: Plan[] }>("/plans").then(d => setPlans(d.plans.filter((p: Plan) => p.isActive))).catch(() => {});
  }, []);

  // Built-in Static All-Game Fallbacks to populate as requested
  const showcaseGames = games.length > 0 ? games : [
    { id: 1, name: "Minecraft Enterprise", slug: "minecraft", imageUrl: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "GTA V / FiveM Nodes", slug: "fivem", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "Rust Dedicated", slug: "rust", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60" },
    { id: 4, name: "CS2 Matchmaking Nodes", slug: "cs2", imageUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500&auto=format&fit=crop&q=60" },
    { id: 5, name: "Palworld Survival", slug: "palworld", imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60" },
    { id: 6, name: "ARK: Survival Ascended", slug: "ark", imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&auto=format&fit=crop&q=60" }
  ];

  const targetCategoryPlans = plans.filter(p => p.category.toLowerCase() === activeTab);

  return (
    <div className="min-h-screen bg-[#030308] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden antialiased">
      <Navbar />

      {/* ── OVH-STYLE MASSIVE HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-4 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/5 rounded-full blur-[160px]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-blue-500/30 bg-blue-950/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Industrial Grade Core Infrastructure
            </div>
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Next-Gen Bare Metal <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent filter drop-shadow-sm">
                Cloud Ecosystem
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mb-10 font-normal leading-relaxed">
              Experience absolute performance architecture. High-frequency AMD Ryzen Processors, unconditional anti-DDoS shields, and unmetered global low-latency pipeline switching.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="#categories" className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-950 flex items-center gap-2 text-xs uppercase tracking-wider">
                Explore Categories <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/register">
                <button className="px-6 py-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded-xl transition-all text-xs uppercase tracking-wider">
                  Deploy Framework
                </button>
              </Link>
            </div>
          </div>

          {/* OVH Inspired Big Live Server Metric Panel */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-900 p-6 rounded-3xl backdrop-blur-xl relative">
            <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
              <Activity className="w-3 h-3 animate-pulse" /> Live Stats
            </div>
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" /> nivenx-core-backbone
            </h3>
            
            <div className="space-y-4">
              {[
                { name: "Global Edge Clusters", status: "142 Active Nodes", val: "99.998% Uptime" },
                { name: "DDoS Mitigation Pipeline", status: "Layer 3/4/7 Guarded", val: "0ms Scrubbing Latency" },
                { name: "Total NVMe Array Throughput", status: "Gen4 RAID10 Active", val: "7,500 MB/s Read" }
              ].map((stat, i) => (
                <div key={i} className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-white">{stat.name}</div>
                    <div className="text-[10px] text-slate-500 font-light mt-0.5">{stat.status}</div>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-blue-400">{stat.val}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>API Gateway: v2.4.1</span>
              <span className="text-emerald-500 font-bold">● Operations Normal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFINITE ANIMATED PARTNERS LINE ── */}
      <section className="py-8 bg-slate-950/60 border-b border-slate-900 overflow-hidden relative w-full">
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: max-content;
            animation: scroll 25s linear infinite;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 mb-3">
          <p className="text-[10px] font-bold tracking-[0.25em] text-slate-600 uppercase text-center">TRUSTED BY GLOBAL CARRIERS & NETWORKS</p>
        </div>
        <div className="relative flex items-center overflow-hidden w-full before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-[#030308] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:after:from-[#030308] after:after:to-transparent">
          <div className="animate-infinite-scroll gap-6 flex items-center">
            {/* Repeated arrays to ensure flawless infinite loop styling */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-6 py-2 bg-slate-900/30 border border-slate-900 rounded-xl text-slate-400 text-xs font-semibold tracking-wide">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Carrier_Node_{item}x</span>
                <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-1 rounded">100G</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE CATEGORIES & PLANS SECTION ── */}
      <section id="categories" className="py-24 px-4 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Comprehensive Infrastructure Portfolio</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto font-light">Deploy high-performance systems instantly across tailored container systems.</p>
            
            {/* Monthly/Yearly Toggle Switched based on Screenshot_20260702_134903_2.jpg */}
            <div className="inline-flex items-center gap-3 mt-8 bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5">
              <span className={`text-xs font-bold ${billing === "monthly" ? "text-white" : "text-slate-500"}`}>Monthly billing</span>
              <button onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")} className="w-9 h-5 bg-blue-600 rounded-full relative p-0.5 transition-colors">
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${billing === "yearly" ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${billing === "yearly" ? "text-white" : "text-slate-500"}`}>
                Yearly plan <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 rounded">Save 30%</span>
              </span>
            </div>

            {/* Category Navigation System */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-12 max-w-5xl mx-auto">
              {[
                { id: "game", name: "Game Server", icon: Gamepad2 },
                { id: "vps", name: "VPS Hosting", icon: Cloud },
                { id: "vds", name: "VDS Hosting", icon: Server },
                { id: "web", name: "Web Hosting", icon: Globe },
                { id: "bot", name: "Bot Hosting", icon: Bot },
                { id: "v2ray", name: "V2Ray VPN", icon: Radio }
              ].map(tab => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 group ${isSelected ? "bg-blue-600/10 border-blue-500 text-white shadow-xl shadow-blue-950/20" : "bg-slate-950/50 border-slate-900 text-slate-400 hover:text-slate-200"}`}>
                    <IconComp className={`w-5 h-5 ${isSelected ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                    <span className="text-xs font-bold tracking-wide capitalize">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Grid Layout matching structural aesthetic from Screenshot_20260702_134903_2.jpg */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {targetCategoryPlans.length > 0 ? targetCategoryPlans.map((plan, i) => {
              const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
              return (
                <div key={plan.id} className="rounded-3xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between transition-all hover:bg-slate-950/80">
                  <div className="p-6 bg-slate-950/60 rounded-t-3xl border-b border-slate-900">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-bold text-white capitalize">{plan.name}</h3>
                      {plan.isFeatured && <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400 font-bold uppercase">Popular</span>}
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-black text-white">${price}</span>
                      <span className="text-slate-500 text-xs">/month</span>
                    </div>
                    <Link href="/register">
                      <button className="w-full mt-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
                        Deploy Architecture
                      </button>
                    </Link>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <ul className="space-y-3 mb-6">
                      {(plan.features as string[]).slice(0, 6).map((f, fi) => (
                        <li key={fi} className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-2.5">
                            <Check className="w-3.5 h-3.5 text-blue-500" />
                            <span>{f}</span>
                          </div>
                          <Info className="w-3 h-3 text-slate-800" />
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-2 bg-slate-900/30 text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors border border-slate-900">More Features</button>
                  </div>
                </div>
              );
            }) : (
              // Luxury Fallback Plan Cards if DB hasn't populated target categories
              [
                { title: "Starter Node", price: "4.50", specs: ["1 vCPU Core (Ryzen)", "4 GB DDR5 RAM", "30 GB NVMe Gen4", "1 Gbps Port Unmetered", "Basic Shield Layer"] },
                { title: "Advanced Node", price: "9.50", specs: ["2 vCPU Cores (Ryzen)", "8 GB DDR5 RAM", "60 GB NVMe Gen4", "1 Gbps Port Unmetered", "Advanced DDoS Shield"] },
                { title: "Enterprise Core", price: "19.50", specs: ["4 vCPU Cores (Ryzen)", "16 GB DDR5 RAM", "120 GB NVMe Gen4", "10 Gbps Burst Layer", "Full Edge Security"] },
                { title: "Ultimate Array", price: "39.50", specs: ["8 vCPU Cores (Ryzen)", "32 GB DDR5 RAM", "240 GB NVMe Gen4", "10 Gbps Dedicated Line", "Full Custom Routing"] },
              ].map((fallbackPlan, idx) => (
                <div key={idx} className="rounded-3xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between transition-all hover:border-slate-800">
                  <div className="p-6 bg-slate-950/60 rounded-t-3xl border-b border-slate-900">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{fallbackPlan.title}</h3>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-medium">ACTIVE</span>
                    </div>
                    <p className="text-slate-500 text-xs mb-4 font-light">Optimized parameters for current selection.</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">${fallbackPlan.price}</span>
                      <span className="text-slate-500 text-xs">/month</span>
                    </div>
                    <Link href="/register">
                      <button className="w-full mt-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-950/40">
                        Deploy Infrastructure →
                      </button>
                    </Link>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <ul className="space-y-3.5 mb-6">
                      {fallbackPlan.specs.map((spec, fi) => (
                        <li key={fi} className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-2.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="font-light">{spec}</span>
                          </div>
                          <Info className="w-3 h-3 text-slate-800 flex-shrink-0" />
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-2 bg-slate-900/30 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-slate-900">Full Parameters</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── ALL EXPANDED GAMES SHOWCASE SECTION ── */}
      <section className="py-24 px-4 border-t border-slate-900 bg-[#04040a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-left max-w-xl">
            <span className="text-[10px] font-bold tracking-[0.25em] text-blue-400 uppercase">Gaming Nodes</span>
            <h2 className="text-3xl font-black text-white mt-1">Supported Game Server Deployments</h2>
            <p className="text-slate-500 text-xs mt-1 font-light">Instant configurations for top tier titles with integrated mods, plugins, and custom runtime parameters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {showcaseGames.map(game => (
              <div key={game.id} className="group relative rounded-2xl overflow-hidden border border-slate-900 hover:border-slate-800 transition-all duration-300 aspect-[4/5] bg-slate-950 flex flex-col justify-end">
                {game.imageUrl && (
                  <img src={game.imageUrl} alt={game.name} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                <div className="p-4 relative z-20">
                  <div className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-blue-400 mb-2">
                    <Gamepad2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-200 tracking-wide truncate">{game.name}</h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">nivenx-template-{game.slug}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS SECTION ── */}
      {reviews.length > 0 && (
        <section className="py-24 px-4 border-t border-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white">Validated Client Appraisals</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map(r => (
                <div key={r.id} className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-800"}`} />
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">"{r.comment}"</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
                    <User className="w-3 h-3" /> {r.name} · {r.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DENSE ENTERPRISE FOOTER SECTION (OVH STYLE) ── */}
      <footer className="bg-slate-950/80 border-t border-slate-900 pt-20 pb-8 px-4 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 border-b border-slate-900 pb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="https://www.image2url.com/r2/default/images/1782962523208-e3fe34b6-77ca-43f9-8588-6e54ed1441f8.png" 
                alt="NivenX Logo" 
                className="h-7 object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 max-w-xs font-light leading-relaxed">
              Industrial grade bare metal instances and network provisioning layers designed for mission-critical digital execution layers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5 text-blue-500" /> Compute</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-light">
              <li><span className="hover:text-white cursor-pointer transition-colors">Bare Metal Servers</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">High Frequency VPS</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Dedicated VDS Array</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Managed Kubernetes</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Gamepad2 className="w-3.5 h-3.5 text-blue-500" /> Game Solutions</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-light">
              <li><span className="hover:text-white cursor-pointer transition-colors">Minecraft Dedicated</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">FiveM Frameworks</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Rust Survival Core</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">SteamCMD Node Engine</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Security</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-light">
              <li><span className="hover:text-white cursor-pointer transition-colors">Anti-DDoS Scrubbing</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Edge Firewalls</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">V2Ray Encryptions</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">IP Transit Filters</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5"><LifeBuoy className="w-3.5 h-3.5 text-blue-500" /> Resources</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-light">
              <li><span className="hover:text-white cursor-pointer transition-colors">Documentation</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Network API Access</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">SLA Commitments</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">System Status Desk</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-mono">
          <div>© 2026 NivenX Infrastructure Group. All architectural rights reserved.</div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Framework</span>
            <span className="hover:text-slate-400 cursor-pointer">Corporate Security Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
    }
