import React, { useState, useEffect } from "react";
import { Share2, QrCode, Send, Users, Facebook, Twitter, MessageCircle, Copy, Check, Gift } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "../lib/utils";

export const GrowthCenter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState("");
  const [status, setStatus] = useState<{ telegramActive: boolean; botTokenSet: boolean } | null>(null);

  const referralLink = "https://t.me/GminaAssistantBot?start=ref123";

  useEffect(() => {
    setAppUrl(window.location.origin);
    fetch("/api/status")
      .then(res => res.json())
      .then(setStatus)
      .catch(console.error);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const text = encodeURIComponent("Sprawdź nowego asystenta naszej Gminy! Pomaga w sprawach urzędowych i ma świetne gry.");
    const url = encodeURIComponent(appUrl);
    
    let shareUrl = "";
    if (platform === "facebook") shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === "twitter") shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (platform === "whatsapp") shareUrl = `https://wa.me/?text=${text}%20${url}`;
    
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-6 h-6 text-emerald-500" />
          Rozprzestrzenianie i Zasięg
        </h2>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
          <Users className="w-3 h-3" /> Viral Mode
        </div>
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center text-center space-y-4 p-6 bg-black/40 rounded-2xl border border-zinc-800/50">
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <QRCodeSVG value={appUrl} size={140} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Kod QR Gminy</h3>
          <p className="text-xs text-zinc-500 mt-1">Wydrukuj i powieś na tablicy ogłoszeń w urzędzie.</p>
        </div>
      </div>

      {/* Social Share */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <Gift className="w-3 h-3" /> System Poleceń
          </p>
          <span className="text-[10px] font-bold text-amber-500">+50 GMC / osobę</span>
        </div>
        
        <div className="bg-black/40 border border-zinc-800 p-4 rounded-xl space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Zaproś sąsiadów do korzystania z bota i odbierajcie wspólnie nagrody. Każde skuteczne polecenie to bonus dla Was obojga!
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-[10px] text-zinc-300 font-mono truncate flex items-center">
              {referralLink}
            </div>
            <button 
              onClick={copyLink}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                  U{i}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-emerald-500/20 flex items-center justify-center text-[8px] font-bold text-emerald-500">
                +12
              </div>
            </div>
            <p className="text-[10px] text-zinc-500">15 osób dołączyło z Twojego polecenia</p>
          </div>
        </div>
      </div>

      {/* Social Share */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Udostępnij w mediach społecznościowych</p>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => shareOnSocial("facebook")}
            className="flex flex-col items-center gap-2 p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
          >
            <Facebook className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-400">Facebook</span>
          </button>
          <button 
            onClick={() => shareOnSocial("twitter")}
            className="flex flex-col items-center gap-2 p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
          >
            <Twitter className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-400">Twitter (X)</span>
          </button>
          <button 
            onClick={() => shareOnSocial("whatsapp")}
            className="flex flex-col items-center gap-2 p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
          >
            <MessageCircle className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-zinc-400">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Copy Link */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Link do asystenta</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-black/40 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-500 font-mono truncate flex items-center">
            {appUrl}
          </div>
          <button 
            onClick={copyLink}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Broadcast Suggestion */}
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Send className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Masowy Komunikat</h4>
        </div>
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          Wysyłaj powiadomienia o ważnych wydarzeniach do wszystkich mieszkańców korzystających z bota na Telegramie.
        </p>
        <button className="mt-3 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg transition-all">
          Zaplanuj Broadcast
        </button>
      </div>
    </div>
  );
};
