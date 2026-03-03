import React from "react";
import { Trophy, Target, Users, Flame, ArrowRight, Star } from "lucide-react";
import { cn } from "../lib/utils";

export const EngagementHub: React.FC = () => {
  const leaderboard = [
    { name: "Anna K.", points: 1250, rank: 1, avatar: "AK" },
    { name: "Marek W.", points: 980, rank: 2, avatar: "MW" },
    { name: "Jan S.", points: 850, rank: 3, avatar: "JS" },
  ];

  const challenges = [
    {
      title: "Eko-Weekend",
      desc: "Zgłoś 3 dzikie wysypiska lub usterki w ten weekend.",
      reward: "+200 GMC",
      progress: 65,
      timeLeft: "2 dni",
    },
    {
      title: "Historyczny Quiz",
      desc: "Rozwiąż quiz o zabytkach z wynikiem 100%.",
      reward: "+50 GMC",
      progress: 100,
      timeLeft: "Zakończone",
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Centrum Społeczności
        </h2>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
          <Flame className="w-3 h-3 animate-pulse" /> Trending
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3 h-3" /> Top Mieszkańcy
          </p>
          <button className="text-[10px] text-emerald-500 hover:underline flex items-center gap-1">
            Pełny ranking <ArrowRight className="w-2 h-2" />
          </button>
        </div>
        <div className="space-y-2">
          {leaderboard.map((user, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-800/50 group hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                  user.rank === 1 ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400"
                )}>
                  {user.rank === 1 ? <Star className="w-4 h-4 fill-black" /> : user.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-zinc-500">{user.points} GMC</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-zinc-700 group-hover:text-amber-500/50 transition-colors">#0{user.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-3 h-3" /> Aktywne Wyzwania
        </p>
        <div className="space-y-3">
          {challenges.map((challenge, i) => (
            <div key={i} className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{challenge.title}</h3>
                <span className="text-[10px] font-bold text-emerald-500">{challenge.reward}</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">{challenge.desc}</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-600">Postęp: {challenge.progress}%</span>
                  <span className="text-amber-500">{challenge.timeLeft}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
        <p className="text-[10px] text-zinc-500 italic">
          Rywalizacja buduje lepszą gminę! Dołącz do wyzwań i zdobywaj unikalne odznaki.
        </p>
      </div>
    </div>
  );
};
