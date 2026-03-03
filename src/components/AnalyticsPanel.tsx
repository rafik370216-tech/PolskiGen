import React, { useState, useEffect } from "react";
import { BarChart3, Users, MessageSquare, AlertCircle, TrendingUp, MapPin, ThumbsUp, ThumbsDown } from "lucide-react";

export const AnalyticsPanel: React.FC = () => {
  const [feedback, setFeedback] = useState({ positive: 0, negative: 0 });

  useEffect(() => {
    fetch("/api/analytics/feedback")
      .then(res => res.json())
      .then(setFeedback)
      .catch(console.error);
  }, []);

  const stats = [
    { label: "Aktywni Mieszkańcy", value: "1,284", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Zapytania AI", value: "8,432", change: "+25%", icon: MessageSquare, color: "text-emerald-500" },
    { label: "Zgłoszone Usterki", value: "142", change: "-5%", icon: AlertCircle, color: "text-amber-500" },
    { label: "Wydane GminaCoiny", value: "45.2k", change: "+18%", icon: TrendingUp, color: "text-purple-500" },
  ];

  const topIssues = [
    { issue: "Wywóz odpadów gabarytowych", count: 450, trend: "up" },
    { issue: "Remont ul. Polnej", count: 320, trend: "down" },
    { issue: "Wniosek o dowód osobisty", count: 280, trend: "stable" },
    { issue: "Oświetlenie w parku", count: 150, trend: "up" },
  ];

  const totalFeedback = feedback.positive + feedback.negative;
  const positiveRate = totalFeedback > 0 ? Math.round((feedback.positive / totalFeedback) * 100) : 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-500" />
          Panel Analityczny Urzędu
        </h2>
        <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700">
          LIVE DATA
        </span>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-black/40 border border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] font-bold text-emerald-500">{stat.change}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Issues */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3 h-3" /> Najczęstsze Tematy Rozmów
          </h3>
          <div className="space-y-2">
            {topIssues.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
                <span className="text-xs text-zinc-300">{item.issue}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">{item.count}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    item.trend === 'up' ? 'bg-red-500 animate-pulse' : 
                    item.trend === 'down' ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Stats */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-3 h-3" /> Satysfakcja z AI
          </h3>
          <div className="bg-black/40 border border-zinc-800 p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white">{positiveRate}%</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Pozytywnych opinii</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <ThumbsUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-white">{feedback.positive}</p>
                </div>
                <div className="text-center">
                  <ThumbsDown className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-white">{feedback.negative}</p>
                </div>
              </div>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${positiveRate}%` }}
              />
              <div 
                className="h-full bg-red-500 transition-all duration-1000" 
                style={{ width: `${100 - positiveRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
        <p className="text-[10px] text-zinc-500 text-center italic">
          Dane są anonimizowane i służą do optymalizacji pracy urzędu oraz planowania inwestycji.
        </p>
      </div>
    </div>
  );
};
