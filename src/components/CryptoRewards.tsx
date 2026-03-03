import React, { useState } from "react";
import { Coins, TrendingUp, Gift, ArrowRightLeft, Wallet, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

export const CryptoRewards: React.FC = () => {
  const [balance, setBalance] = useState(125.50);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncWallet = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Coins className="w-6 h-6 text-amber-500" />
          GminaCoin (GMC)
        </h2>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" /> Verified
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/20 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet className="w-24 h-24 rotate-12" />
        </div>
        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Twój Portfel Mieszkańca</p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-black text-white tracking-tighter">{balance.toFixed(2)}</span>
          <span className="text-xl font-bold text-amber-500">GMC</span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2">≈ {(balance * 0.45).toFixed(2)} PLN (Wartość w usługach)</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={syncWallet}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all"
        >
          {isSyncing ? "Synchronizacja..." : "Synchronizuj"}
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-900/20">
          Odbierz Nagrodę
        </button>
      </div>

      {/* Market Stats */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-3 h-3" /> Statystyki Ekosystemu
        </p>
        <div className="space-y-2">
          {[
            { label: "W obiegu", value: "1.2M GMC", change: "+2.4%" },
            { label: "Aktywni posiadacze", value: "4,250", change: "+12%" },
            { label: "Partnerzy lokalni", value: "48", change: "Nowy!" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-800/50">
              <span className="text-[10px] text-zinc-400">{stat.label}</span>
              <div className="text-right">
                <p className="text-[10px] font-bold text-white">{stat.value}</p>
                <p className="text-[8px] text-emerald-500">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Preview */}
      <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
        <div className="flex items-center gap-3 mb-3">
          <Gift className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dostępne za GMC</h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">Bilet na basen miejski</span>
            <span className="font-bold text-amber-500">50 GMC</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">Zniżka 10% na wywóz gabarytów</span>
            <span className="font-bold text-amber-500">120 GMC</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">Kawa w kawiarni "Rynek"</span>
            <span className="font-bold text-amber-500">30 GMC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
