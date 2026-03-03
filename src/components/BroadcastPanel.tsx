import React, { useState } from "react";
import { Megaphone, Send, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export const BroadcastPanel: React.FC = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "alert">("info");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; sentTo: number } | null>(null);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setMessage("");
    } catch (error) {
      console.error("Broadcast error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-amber-500" />
          System Powiadomień Masowych
        </h2>
        <div className="flex bg-black/40 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setType("info")}
            className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
              type === "info" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Informacja
          </button>
          <button
            onClick={() => setType("alert")}
            className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
              type === "alert" ? "bg-red-500 text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Alert
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={type === "alert" ? "Wpisz treść pilnego ostrzeżenia..." : "Wpisz treść ogłoszenia dla mieszkańców..."}
            className="w-full h-32 bg-black/40 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none"
          />
          <div className="absolute bottom-3 right-3 text-[10px] text-zinc-600 font-mono">
            {message.length} znaków
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={isSending || !message.trim()}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg",
            type === "alert" 
              ? "bg-red-600 hover:bg-red-500 shadow-red-900/20" 
              : "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20",
            (isSending || !message.trim()) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" /> Wyślij do wszystkich mieszkańców
            </>
          )}
        </button>

        {result && (
          <div className={cn(
            "p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
            result.success ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border border-red-500/20 text-red-500"
          )}>
            {result.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="text-xs font-bold">
              {result.success ? `Pomyślnie wysłano do ${result.sentTo} użytkowników Telegrama.` : "Wystąpił błąd podczas wysyłania."}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-800/30 rounded-xl">
        <p className="text-[10px] text-zinc-500 leading-relaxed italic">
          Uwaga: Powiadomienia są wysyłane natychmiastowo do wszystkich zarejestrowanych użytkowników bota. Używaj alertów tylko w sytuacjach kryzysowych.
        </p>
      </div>
    </div>
  );
};
