import React from "react";
import { CreditCard, Zap, Shield, Check, Crown } from "lucide-react";
import { cn } from "../lib/utils";

export const SubscriptionManager: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "499 PLN",
      period: "/miesiąc",
      features: ["Do 1,000 mieszkańców", "Podstawowe AI", "Telegram Bot", "Wsparcie email"],
      current: false,
      color: "zinc",
    },
    {
      name: "Pro",
      price: "1,299 PLN",
      period: "/miesiąc",
      features: ["Nielimitowani mieszkańcy", "Zaawansowana Analityka", "System GminaCoin", "Priorytetowe wsparcie 24/7"],
      current: true,
      color: "emerald",
    },
    {
      name: "Enterprise",
      price: "Indywidualnie",
      period: "",
      features: ["Dedykowany model AI", "Pełna integracja z e-Urząd", "Szkolenia dla pracowników", "SLA 99.9%"],
      current: false,
      color: "purple",
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-500" />
          Zarządzanie Subskrypcją Gminy
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Crown className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase">Plan Pro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={cn(
              "relative p-6 rounded-2xl border transition-all",
              plan.current 
                ? "bg-emerald-500/5 border-emerald-500/50 ring-1 ring-emerald-500/50" 
                : "bg-black/40 border-zinc-800"
            )}
          >
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                Twój Plan
              </div>
            )}
            <h3 className="text-sm font-bold text-white mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-xl font-black text-white">{plan.price}</span>
              <span className="text-[10px] text-zinc-500">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-2 text-[10px] text-zinc-400">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className={cn(
                "w-full py-2.5 rounded-xl text-[10px] font-bold transition-all",
                plan.current 
                  ? "bg-zinc-800 text-zinc-400 cursor-default" 
                  : "bg-white text-black hover:bg-zinc-200"
              )}
            >
              {plan.current ? "Aktywny" : "Wybierz Plan"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-zinc-500" />
          <div>
            <p className="text-xs font-bold text-white">Bezpieczne Płatności</p>
            <p className="text-[10px] text-zinc-500">Twoje dane są chronione szyfrowaniem AES-256.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 bg-zinc-700 rounded" />
          <div className="w-8 h-5 bg-zinc-700 rounded" />
          <div className="w-8 h-5 bg-zinc-700 rounded" />
        </div>
      </div>
    </div>
  );
};
