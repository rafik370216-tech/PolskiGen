import React, { useState } from "react";
import { Store, Plus, Tag, Eye, Settings, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

export const PartnerPanel: React.FC = () => {
  const [rewards, setRewards] = useState([
    { id: 1, name: "Kawa 1+1", partner: "Kawiarnia Rynek", cost: 30, status: "Aktywne", views: 1240 },
    { id: 2, name: "Zniżka -20% na pizzę", partner: "Pizzeria Bella", cost: 50, status: "Aktywne", views: 850 },
  ]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Store className="w-6 h-6 text-emerald-500" />
          Panel Partnera Lokalnego
        </h2>
        <button className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Twoje Aktywne Oferty</p>
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-black/40 border border-zinc-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{reward.name}</h3>
                <p className="text-[10px] text-zinc-500">{reward.partner}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                {reward.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Tag className="w-3 h-3" /> {reward.cost} GMC
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Eye className="w-3 h-3" /> {reward.views}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-400 transition-colors">
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border border-zinc-700 flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Zostań Partnerem Premium</p>
          <p className="text-[10px] text-zinc-500">Zwiększ zasięg swoich ofert o 300% dzięki wyróżnieniu w czacie AI.</p>
        </div>
      </div>
    </div>
  );
};
