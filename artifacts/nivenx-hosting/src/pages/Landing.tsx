import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import {
  Zap, Shield, Globe, Server, ChevronRight, Star,
  Clock, HardDrive, Cpu, Network, ArrowRight, Check,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  category: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  isPopular: boolean;
}

const features = [
  { icon: Zap, title: "Instant Deploy", desc: "Your server is live in under 60 seconds with automatic configuration." },
  { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade DDoS mitigation protecting your server 24/7." },
  { icon: Globe, title: "Global Network", desc: "Nodes across 3 continents for ultra-low latency worldwide." },
  { icon: HardDrive, title: "NVMe Storage", desc: "10x faster than traditional SSDs with pure NVMe storage arrays." },
  { icon: Cpu, title: "Ryzen CPUs", desc: "Latest AMD Ryzen processors deliver maximum single-thread performance." },
  { icon: Clock, title: "99.99% Uptime", desc: "Industry-leading uptime backed by redundant infrastructure." },
];

const stats = [
  { value: "2,500+", label: "Active Servers" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<1s", label: "Deploy Time" },
  { value: "24/7", label: "Expert Support" },
];

export default function Landing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeCategory, setActiveCategory] = useState("game");

  useEffect(() => {
    api.get<Plan[]>("/plans").then(setPlans).catch(() => {});
  }, []);

  const categories = [...new Set(plans.map(p => p.category))];
  const filteredPlans = plans.filter(p => p.category === activeCategory).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            Next-Gen Hosting Infrastructure
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
            <span className="text-white">Premium</span>{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Game & VPS
            </span>
            <br />
            <span className="text-white">Hosting</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Powered by NVMe SSDs and AMD Ryzen CPUs. Deploy in seconds with enterprise DDoS protection and 99.99% uptime guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plans">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 text-base px-8 py-6 h-auto shadow-lg shadow-purple-900/50">
                <Zap className="w-5 h-5 mr-2" />
                View Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-base px-8 py-6 h-auto">
                Create Account
              </Button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Why choose <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">NivenX</span>?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need for a reliable, performant hosting experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all">
                  <f.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans preview */}
      {plans.length > 0 && (
        <section className="py-20 px-4 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Simple, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Transparent</span> Pricing
              </h2>
              <p className="text-gray-400 mb-8">No hidden fees. Pay monthly or save with yearly billing.</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                      activeCategory === cat
                        ? "bg-purple-600 text-white border-purple-600"
                        : "border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} Hosting
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPlans.map(plan => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                    plan.isPopular
                      ? "border-purple-500/50 bg-gradient-to-b from-purple-950/30 to-transparent shadow-xl shadow-purple-900/20"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-white">${plan.priceMonthly}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400"><Cpu className="w-3.5 h-3.5 text-purple-400" />{plan.cpu}</div>
                    <div className="flex items-center gap-2 text-gray-400"><HardDrive className="w-3.5 h-3.5 text-purple-400" />{plan.storage}</div>
                    <div className="flex items-center gap-2 text-gray-400"><Server className="w-3.5 h-3.5 text-purple-400" />{plan.ram}</div>
                    <div className="flex items-center gap-2 text-gray-400"><Network className="w-3.5 h-3.5 text-purple-400" />{plan.bandwidth}</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {(plan.features as unknown as string[]).slice(0, 4).map((f: string) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-purple-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button
                      className={`w-full ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg shadow-purple-900/40"
                          : "bg-white/5 hover:bg-white/10 border border-white/20"
                      } text-white`}
                    >
                      Get Started <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/plans">
                <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                  View all plans <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 rounded-3xl blur-xl" />
          <div className="relative p-10 rounded-3xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-transparent">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">Ready to get started?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of gamers and businesses who trust NivenX for their hosting needs. Start in minutes.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 text-base px-10 py-6 h-auto shadow-lg shadow-purple-900/50">
                Start Hosting Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
