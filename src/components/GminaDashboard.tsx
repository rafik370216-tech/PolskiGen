import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, MessageSquare, Info, AlertTriangle, Calendar, Gamepad2, Send, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { chatWithAI } from "../services/gemini";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import { cn } from "../lib/utils";

export const GminaDashboard: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<{ telegramActive: boolean; botTokenSet: boolean } | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<"positive" | "negative" | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(setStatus)
      .catch(console.error);
  }, []);

  const handleFeedback = async (rating: "positive" | "negative") => {
    if (feedbackGiven) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      setFeedbackGiven(rating);
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };

  const handleAsk = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);
    setFeedbackGiven(null);
    try {
      const result = await chatWithAI(finalPrompt, []);
      setResponse(result || "Nie udało się uzyskać odpowiedzi.");
      
      // Celebrate if it's a game or a successful action
      if (finalPrompt.toLowerCase().includes("quiz") || finalPrompt.toLowerCase().includes("zagraj")) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#f59e0b"]
        });
      }
    } catch (error) {
      console.error("Gemini error:", error);
      alert("Wystąpił błąd podczas komunikacji z AI.");
    } finally {
      setIsLoading(false);
      if (!customPrompt) setPrompt("");
    }
  };

  const quickActions = [
    { label: "Zagraj w Quiz", icon: Gamepad2, prompt: "Zagrajmy w Quiz o Gminie! Zadaj mi pierwsze pytanie." },
    { label: "Sprawdź Śmieci", icon: Calendar, prompt: "Kiedy jest najbliższy wywóz śmieci na ul. Polnej?" },
    { label: "Zgłoś Usterkę", icon: AlertTriangle, prompt: "Chcę zgłosić niedziałającą latarnię na ul. Kwiatowej." },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      {/* Status Banner */}
      {status && !status.botTokenSet && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4 text-amber-500 text-left">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Integracja z Telegramem jest wyłączona.</p>
            <p className="opacity-80">Ustaw <code>TELEGRAM_BOT_TOKEN</code> w panelu Secrets, aby aktywować bota.</p>
          </div>
        </div>
      )}

      {status && status.telegramActive && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4 text-emerald-500 text-left">
          <Sparkles className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Bot na Telegramie jest aktywny!</p>
            <p className="opacity-80">Mieszkańcy mogą teraz pisać bezpośrednio do Twojego bota.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Chat Interface */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Zadaj pytanie asystentowi
            </h2>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-6">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(undefined, action.prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg border border-zinc-700 transition-all flex items-center gap-2"
                >
                  <action.icon className="w-3 h-3 text-emerald-500" />
                  {action.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleAsk} className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Np. Kiedy jest wywóz śmieci na ul. Polnej? Jak wyrobić dowód osobisty?"
                  className="w-full h-32 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="absolute bottom-4 right-4 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-all shadow-lg"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          {response && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Odpowiedź asystenta:</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback("positive")}
                    disabled={!!feedbackGiven}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      feedbackGiven === "positive" ? "bg-emerald-500/20 text-emerald-500" : "hover:bg-zinc-800 text-zinc-500"
                    )}
                  >
                    {feedbackGiven === "positive" ? <Check className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleFeedback("negative")}
                    disabled={!!feedbackGiven}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      feedbackGiven === "negative" ? "bg-red-500/20 text-red-500" : "hover:bg-zinc-800 text-zinc-500"
                    )}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="markdown-body prose prose-invert max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-500" />
              Możliwości asystenta
            </h2>
            <ul className="space-y-4">
              {[
                { icon: Calendar, label: "Harmonogram wywozu śmieci", desc: "AI pomoże sprawdzić terminy odbioru odpadów." },
                { icon: Info, label: "Sprawy urzędowe", desc: "Informacje o podatkach, dowodach i zameldowaniu." },
                { icon: AlertTriangle, label: "Zgłaszanie usterek", desc: "Szybka ścieżka do poinformowania o problemach w gminie." },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{item.label}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Integracja z Telegramem</h2>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
              Twój asystent może działać bezpośrednio na Telegramie. Mieszkańcy mogą pisać do bota, a on odpowie im w Twoim imieniu.
            </p>
            <div className="bg-black/40 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Jak to działa?</p>
              <ol className="text-xs text-zinc-400 space-y-1 list-decimal ml-4">
                <li>Stwórz bota u @BotFather na Telegramie.</li>
                <li>Pobierz API Token.</li>
                <li>Dodaj go jako <code>TELEGRAM_BOT_TOKEN</code> w Secrets.</li>
                <li>Zrestartuj serwer.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
