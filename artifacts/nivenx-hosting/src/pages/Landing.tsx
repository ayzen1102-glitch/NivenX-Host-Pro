import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Zap, Shield, Globe, HardDrive, Cpu, Clock, Star, ArrowRight, 
  Check, Server, Activity, User, MapPin, Layers, ArrowUpRight, 
  Info, Calendar, MessageSquare, Terminal, ChevronDown, Sparkles
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Custom Interactive Specs State for Pricing Calculator
  const [vCpuRange, setVCpuRange] = useState(4);

  useEffect(() => {
    api.get<Partner[]>("/public/partners").then(setPartners).catch(() => {});
    api.get<Review[]>("/public/reviews").then(setReviews).catch(() => {});
    api.get<Game[]>("/public/games").then(setGames).catch(() => {});
    api.get<{ plans: Plan[] }>("/plans").then(d => setPlans(d.plans.filter((p: Plan) => p.isActive))).catch(() => {});
  }, []);

  const categories = ["all", ...Array.from(new Set(plans.map(p => p.category)))];
  const filtered = activeCategory === "all" ? plans : plans.filter(p => p.category === activeCategory);

  const locations = [
    { city: "Singapore", region: "Asia Pacific", ping: "8ms", status: "Optimal" },
    { city: "Frankfurt", region: "Europe", ping: "5ms", status: "Optimal" },
    { city: "New York", region: "N. America", ping: "6ms", status: "Optimal" },
    { city: "London", region: "Europe", ping: "4ms", status: "Optimal" },
    { city: "Tokyo", region: "Asia Pacific", ping: "7ms", status: "Optimal" },
    { city: "Sydney", region: "Oceania", ping: "12ms", status: "Optimal" },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden antialiased">
      <Navbar />

      {/* ── HERO SECTION WITH LUXURY NEON GLOWS ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse duration-[8s]" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/5 rounded-full blur-[120px] animate-pulse duration-[6s]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Animated Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-8 animate-fade-in backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin duration-[4s]" />
            <span>Next-Gen Hosting Infrastructure</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8 text-white">
            Premium
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              Game & VPS
            </span>
            Hosting
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
            Powered by Enterprise NVMe SSDs and AMD Ryzen™ Core processors. Deploy global node infrastructure instantly with absolute DDoS shielding.
          </p>

          {/* Interactive Core CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/plans">
              <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 w-full sm:w-auto transform hover:-translate-y-0.5">
                View Premium Plans <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl font-semibold transition-all duration-300 backdrop-blur w-full sm:w-auto transform hover:-translate-y-0.5">
                Create Account
              </button>
            </Link>
          </div>

          {/* Real-time Promo Banner */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-indigo-950 text-xs mb-24 text-slate-400 font-medium shadow-2xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>⚡ Grab Our Hosting Deal: Starting at <span className="text-white font-bold">$2.59/mo</span></span>
            <Link href="/plans">
              <span className="text-indigo-400 hover:text-indigo-300 ml-1 cursor-pointer font-bold transition-colors underline decoration-indigo-500/40">Grab Deal Now</span>
            </Link>
          </div>

          {/* Luxury Animated Stats Panels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto border-t border-slate-900/60 pt-12">
            {[
              { val: "10K+", lab: "Active Servers", desc: "Deployed Worldwide" },
              { val: "99.99%", lab: "Uptime SLA", desc: "Guaranteed Performance" },
              { val: "<60s", lab: "Deploy Time", desc: "Instant Automated Setup" },
              { val: "24/7", lab: "Expert Support", desc: "Live Tech Response" }
            ].map((s) => (
              <div key={s.lab} className="group bg-slate-950/40 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-5 text-left transition-all duration-300 hover:bg-slate-950/80 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">{s.val}</div>
                <div className="text-xs font-bold text-slate-300 mt-1">{s.lab}</div>
                <div className="text-[10px] text-slate-600 mt-0.5 font-light">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW INTERACTIVE PRICING CALCULATOR SECTION ── */}
      <section className="py-20 px-4 bg-slate-950/30 border-y border-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">Interactive Node Engine</span>
            <h2 className="text-3xl font-black text-white mt-1">Estimate Your Custom Cloud Server</h2>
          </div>
          
          <div className="bg-slate-950/70 border border-slate-900 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required vCPU Cores & Performance</label>
                <span className="text-sm font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">{vCpuRange} vCPU Cores</span>
              </div>
              <input 
                type="range" min="1" max="32" value={vCpuRange} 
                onChange={(e) => setVCpuRange(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-600">Memory Allocation</div>
                <div className="text-base font-bold text-white mt-0.5">{vCpuRange * 4} GB DDR5 RAM</div>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-600">NVMe Storage</div>
                <div className="text-base font-bold text-white mt-0.5">{vCpuRange * 25} GB NVMe Gen4</div>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-slate-600">Estimated Price</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">${(vCpuRange * 4.5).toFixed(2)}/mo</div>
              </div>
            </div>

            <Link href="/register">
              <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                Deploy This Custom Instance <Terminal className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PREMIUM PRICING GRID ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Web Hosting Plans That Fit Your Budget
            </h2>
            <p className="text-slate-500 font-light text-sm max-w-xl mx-auto">Choose an elite node configuration curated for gaming performance and scalable hosting needs.</p>
            
            {/* Custom Billing Toggle Switch */}
            <div className="inline-flex items-center gap-3 mt-8 bg-slate-950/80 border border-slate-900 rounded-2xl px-4 py-2.5">
              <span className={`text-xs font-bold ${billing === "monthly" ? "text-white" : "text-slate-500"}`}>Monthly</span>
              <button 
                onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
                className="w-10 h-5 bg-indigo-600 rounded-full relative p-0.5 transition-colors focus:outline-none"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${billing === "yearly" ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${billing === "yearly" ? "text-white" : "text-slate-500"}`}>
                Yearly <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold uppercase">Save 30%</span>
              </span>
            </div>

            {categories.length > 2 && (
              <div className="flex justify-center gap-2 flex-wrap mt-8">
                {categories.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize border ${activeCategory === c ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950" : "bg-slate-950/60 text-slate-400 border-slate-900 hover:text-slate-200"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filtered.slice(0, 4).map((plan, i) => {
              const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
              const isPopular = plan.isFeatured || i === 1;
              
              return (
                <div key={plan.id} className={`rounded-3xl border flex flex-col transition-all duration-300 bg-slate-950/40 hover:bg-slate-950/90 group ${isPopular ? "border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative" : "border-slate-900"}`}>
                  
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
                      POPULAR CHOICE
                    </div>
                  )}

                  <div className={`p-6 rounded-t-3xl border-b ${isPopular ? "bg-gradient-to-b from-indigo-950/20 to-transparent border-indigo-900/30" : "bg-slate-950/70 border-slate-900"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white capitalize tracking-wide">{plan.name}</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 uppercase tracking-wider">
                        {plan.category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mb-6 font-light">Everything you need to configure your premium node.</p>
                    
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-black text-white tracking-tight">${price}</span>
                      <span className="text-slate-500 text-xs">/mo</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-light mb-6">Renews at same standard pricing structure</p>

                    <Link href="/register">
                      <button className={`w-full py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${isPopular ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg" : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"}`}>
                        Get Started Immediately
                      </button>
                    </Link>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <ul className="space-y-3.5 mb-6">
                      {(plan.features as string[]).slice(0, 8).map((f, fi) => (
                        <li key={fi} className="flex items-center justify-between gap-2 text-xs text-slate-400">
                          <div className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="font-light group-hover:text-slate-300 transition-colors">{f}</span>
                          </div>
                          <Info className="w-3.5 h-3.5 text-slate-800 hover:text-slate-600 cursor-pointer flex-shrink-0" />
                        </li>
                      ))}
                    </ul>

                    <button className="w-full py-2.5 bg-slate-900/30 hover:bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-900/80 rounded-xl text-[10px] font-bold tracking-widest transition-all uppercase">
                      Expand Full Spec Sheet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE & NETWORK PERFORMANCE SECTION ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-400 uppercase">Global Node Grid</span>
            <h2 className="text-3xl font-black text-white mt-1">Strategic Low-Latency Edge Locations</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map(loc => (
              <div key={loc.city} className="bg-slate-950/30 border border-slate-900/80 p-5 text-center rounded-2xl hover:border-slate-800 transition-all group">
                <div className="inline-flex p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 mb-3 group-hover:bg-indigo-950/20 group-hover:border-indigo-900/40 transition-colors">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-xs font-bold text-white">{loc.city}</div>
                <div className="text-[10px] text-slate-600 mb-3">{loc.region}</div>
                <div className="text-[10px] font-mono font-bold text-indigo-400 px-2 py-0.5 bg-indigo-500/5 rounded-md inline-block border border-indigo-500/10 mb-3">{loc.ping}</div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-500">{loc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM INTERACTIVE FAQ & BRAND BANNER (MATCHED LOGIC) ── */}
      <section className="py-24 px-4 border-t border-slate-900 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-400 uppercase">Knowledge Base</span>
            <h2 className="text-3xl font-black text-white mt-1">Frequently Answered Queries</h2>
          </div>
          
          <div className="space-y-3 mb-24">
            {[
              { q: "Can I transfer my existing domain to your hosting service?", a: "Yes, you can initiate a seamless infrastructure migration directly from your NivenX dashboard with zero core downtime guaranteed." },
              { q: "Do you offer email hosting with domain hosting?", a: "Absolutely. All enterprise architecture includes automated secure IMAP/POP3 email mailboxes built into the framework." },
              { q: "Is technical support available if I need help?", a: "Yes, our dedicated engineering team operates 24/7/365 via ticket queues, secure portal communications, and server console assistance." },
              { q: "How secure is my domain with your service?", a: "We utilize advanced registrar lock configurations combined with cloud DDoS scrubbing layers to ensure persistent hardware availability." }
            ].map((faq, qi) => (
              <div key={qi} className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === qi ? null : qi)}
                  className="w-full p-5 flex items-center justify-between text-left text-slate-300 hover:text-white transition-colors focus:outline-none"
                >
                  <span className="text-xs sm:text-sm font-bold">{qi + 1}. {faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${openFaq === qi ? "rotate-180 text-indigo-400" : ""}`} />
                </button>
                {openFaq === qi && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed font-light border-t border-slate-900/40 pt-3 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            <p className="text-center text-xs text-slate-600 pt-4">
              Didn't find your precise answer? Please feel free to <span className="text-indigo-400 hover:underline cursor-pointer font-medium">Contact our Engineering Desk ↗</span>
            </p>
          </div>

          {/* Luxury High-Quality Action Banner Card */}
          <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none" />
            <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-5 text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">Need Custom Infrastructure Layouts?</h3>
            <p className="text-slate-400 font-light text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-8">
              Switch to premium node delivery today. Fully automated container isolation, massive pipeline execution speeds, and elite hardware deployment.
            </p>
            <Link href="/register">
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-950 flex items-center gap-2 mx-auto transform hover:-translate-y-0.5">
                <MessageSquare className="w-3.5 h-3.5" /> Book Consultation Call
              </button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
    }
