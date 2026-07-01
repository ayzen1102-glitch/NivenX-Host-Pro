import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Check, ChevronRight, Cpu, HardDrive, Server, Network, Zap } from "lucide-react";

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

const categoryLabels: Record<string, string> = {
  game: "Game Servers",
  vps: "VPS Hosting",
  minecraft: "Minecraft",
  web: "Web Hosting",
};

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("game");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    api.get<Plan[]>("/plans").then(p => { setPlans(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = [...new Set(plans.map(p => p.category))];
  const filtered = plans.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
              <Zap className="w-3 h-3 mr-1" /> Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Choose your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">plan</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">No contracts. Cancel anytime. Save up to 17% with annual billing.</p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className={`text-sm ${billing === "monthly" ? "text-white" : "text-gray-500"}`}>Monthly</span>
              <button
                onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
                className={`relative w-12 h-6 rounded-full transition-colors ${billing === "yearly" ? "bg-purple-600" : "bg-white/20"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${billing === "yearly" ? "left-7" : "left-1"}`} />
              </button>
              <span className={`text-sm ${billing === "yearly" ? "text-white" : "text-gray-500"}`}>
                Yearly <span className="text-green-400 text-xs ml-1">Save 17%</span>
              </span>
            </div>

            {/* Category tabs */}
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
                  {categoryLabels[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(plan => {
                const price = billing === "monthly" ? plan.priceMonthly : (plan.priceYearly / 12);
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border p-6 flex flex-col ${
                      plan.isPopular
                        ? "border-purple-500/50 bg-gradient-to-b from-purple-950/40 to-transparent shadow-xl shadow-purple-900/20"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    } transition-all duration-300`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                    <p className="text-gray-500 text-xs mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-black text-white">${price.toFixed(2)}</span>
                      <span className="text-gray-500 text-sm">/mo</span>
                      {billing === "yearly" && (
                        <div className="text-green-400 text-xs mt-1">Billed ${plan.priceYearly}/year</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-400"><Cpu className="w-3 h-3 text-purple-400" />{plan.cpu}</div>
                      <div className="flex items-center gap-1.5 text-gray-400"><HardDrive className="w-3 h-3 text-purple-400" />{plan.storage}</div>
                      <div className="flex items-center gap-1.5 text-gray-400"><Server className="w-3 h-3 text-purple-400" />{plan.ram}</div>
                      <div className="flex items-center gap-1.5 text-gray-400"><Network className="w-3 h-3 text-purple-400" />{plan.bandwidth}</div>
                    </div>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {(plan.features as unknown as string[]).map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register">
                      <Button
                        className={`w-full text-sm ${
                          plan.isPopular
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg shadow-purple-900/40"
                            : "bg-white/5 hover:bg-white/10 border border-white/20"
                        } text-white`}
                      >
                        Order Now <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
