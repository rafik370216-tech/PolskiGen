import React, { useState } from "react";
import { Gamepad2, Trophy, Play, CheckCircle2, Plus } from "lucide-react";
import { cn } from "../lib/utils";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  installed: boolean;
}

export const GameCenter: React.FC = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: "quiz",
      title: "Quiz o Gminie",
      description: "Sprawdź swoją wiedzę o historii i geografii naszej gminy.",
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      installed: true,
    },
    {
      id: "eco",
      title: "Eko-Wyzwanie",
      description: "Gra edukacyjna o segregacji odpadów i ekologii.",
      icon: <Gamepad2 className="w-5 h-5 text-emerald-500" />,
      installed: false,
    },
    {
      id: "history",
      title: "Detektyw Historii",
      description: "Rozwiązuj zagadki dotyczące zabytków w Twojej okolicy.",
      icon: <Play className="w-5 h-5 text-blue-500" />,
      installed: false,
    },
  ]);

  const toggleInstall = (id: string) => {
    setGames(games.map(g => g.id === id ? { ...g, installed: !g.installed } : g));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-emerald-500" />
          Centrum Gier i Edukacji
        </h2>
        <span className="text-xs font-medium bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20">
          {games.filter(g => g.installed).length} Aktywne moduły
        </span>
      </div>

      <div className="space-y-4">
        {games.map((game) => (
          <div 
            key={game.id}
            className={cn(
              "p-4 rounded-xl border transition-all flex items-center justify-between gap-4",
              game.installed 
                ? "bg-emerald-500/5 border-emerald-500/20" 
                : "bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                {game.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{game.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{game.description}</p>
              </div>
            </div>

            <button
              onClick={() => toggleInstall(game.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0",
                game.installed
                  ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
              )}
            >
              {game.installed ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Aktywny
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  Zainstaluj
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-black/40 rounded-xl border border-zinc-800/50">
        <p className="text-xs text-zinc-500 text-center italic">
          Zainstalowane gry są dostępne dla mieszkańców bezpośrednio w czacie oraz na Telegramie.
        </p>
      </div>
    </div>
  );
};
