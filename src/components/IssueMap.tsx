import React, { useEffect, useState } from "react";
import { MapPin, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../lib/utils";

interface Issue {
  id: number;
  type: string;
  lat: number;
  lng: number;
  status: "pending" | "resolved";
}

export const IssueMap: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    fetch("/api/admin/issues")
      .then(res => res.json())
      .then(setIssues)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-red-500" />
          Mapa Zgłoszeń
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Oczekujące</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Rozwiązane</span>
          </div>
        </div>
      </div>

      {/* Stylized Map Representation */}
      <div className="relative aspect-video bg-black/40 rounded-xl border border-zinc-800 overflow-hidden group">
        {/* Grid lines for map feel */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* Mock Map Contours */}
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 400 200">
          <path d="M50,50 Q100,20 150,60 T250,40 T350,80" fill="none" stroke="white" strokeWidth="2" />
          <path d="M30,150 Q80,120 130,160 T230,140 T330,180" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Issue Pins */}
        {issues.map((issue) => {
          // Map lat/lng to percentage (mock mapping for visual)
          const x = ((issue.lng - 21.00) * 1000) % 100;
          const y = ((issue.lat - 52.22) * 1000) % 100;

          return (
            <div 
              key={issue.id}
              className="absolute transition-all duration-500 hover:scale-125 cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className={cn(
                "relative flex items-center justify-center w-6 h-6 rounded-full shadow-lg animate-bounce",
                issue.status === "pending" ? "bg-amber-500 shadow-amber-500/20" : "bg-emerald-500 shadow-emerald-500/20"
              )}>
                {issue.status === "pending" ? <AlertCircle className="w-3 h-3 text-black" /> : <CheckCircle2 className="w-3 h-3 text-black" />}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-zinc-800 border border-zinc-700 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <p className="text-[10px] font-bold text-white">{issue.type}</p>
                  <p className="text-[8px] text-zinc-500 uppercase">{issue.status === 'pending' ? 'W toku' : 'Zakończone'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Info className="w-3 h-3" /> Ostatnie Zgłoszenia
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {issues.map((issue) => (
            <div key={issue.id} className="p-3 bg-zinc-800/30 border border-zinc-800 rounded-xl flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full shrink-0",
                issue.status === "pending" ? "bg-amber-500" : "bg-emerald-500"
              )} />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-200 truncate">{issue.type}</p>
                <p className="text-[8px] text-zinc-500 uppercase">ID: #{issue.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
