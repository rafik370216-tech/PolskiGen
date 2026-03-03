import { useState } from "react";
import { GminaDashboard } from "./components/GminaDashboard";
import { GameCenter } from "./components/GameCenter";
import { GrowthCenter } from "./components/GrowthCenter";
import { CryptoRewards } from "./components/CryptoRewards";
import { EngagementHub } from "./components/EngagementHub";
import { AnalyticsPanel } from "./components/AnalyticsPanel";
import { PartnerPanel } from "./components/PartnerPanel";
import { SubscriptionManager } from "./components/SubscriptionManager";
import { BroadcastPanel } from "./components/BroadcastPanel";
import { IssueMap } from "./components/IssueMap";
import { ChatBot } from "./components/ChatBot";
import { Sparkles, Zap, Building2, LayoutDashboard, Settings, BarChart3, Store, CreditCard } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [activeTab, setActiveTab] = useState<"resident" | "admin">("resident");

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Gmina<span className="text-emerald-500">Assistant</span> AI</span>
          </div>

          <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button 
              onClick={() => setActiveTab("resident")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                activeTab === "resident" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutDashboard className="w-3 h-3" /> Mieszkaniec
            </button>
            <button 
              onClick={() => setActiveTab("admin")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2",
                activeTab === "admin" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Settings className="w-3 h-3" /> Zarządzanie
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="px-4 py-2 bg-zinc-100 text-black text-sm font-bold rounded-lg hover:bg-white transition-all">Wyloguj</button>
          </div>
        </div>
      </header>

      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {activeTab === "resident" ? (
            <div className="space-y-24">
              {/* Hero Section */}
              <section className="text-center space-y-8 py-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Inteligentny Asystent Mieszkańca
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mx-auto leading-[1.1]">
                  Twoja Gmina w zasięgu <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">jednej wiadomości.</span>
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                  Szybka pomoc w sprawach urzędowych, harmonogram wywozu śmieci i lokalne aktualności. 
                  Dostępny tutaj oraz na Twoim Telegramie.
                </p>
                
                <div className="pt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                    <GminaDashboard />
                    <EngagementHub />
                  </div>
                  <div className="space-y-12">
                    <CryptoRewards />
                    <GrowthCenter />
                    <GameCenter />
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <BroadcastPanel />
                  <IssueMap />
                  <AnalyticsPanel />
                  <SubscriptionManager />
                </div>
                <div className="space-y-8">
                  <PartnerPanel />
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 text-left">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Szybkie Akcje Admina</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Eksportuj Raport PDF
                      </button>
                      <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                        <Store className="w-4 h-4" /> Weryfikuj Partnerów
                      </button>
                      <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" /> Historia Płatności
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-lg tracking-tight">Gmina Assistant AI</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 Inteligentny Urząd. Wszystkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-6 text-zinc-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Prywatność</a>
            <a href="#" className="hover:text-white transition-colors">Regulamin</a>
            <a href="#" className="hover:text-white transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}
