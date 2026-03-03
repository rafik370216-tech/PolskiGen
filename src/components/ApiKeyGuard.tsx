import React, { useState, useEffect } from "react";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  const checkKey = async () => {
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error("Error checking API key:", e);
      setHasKey(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    await window.aistudio.openSelectKey();
    // Assume success as per guidelines to avoid race conditions
    setHasKey(true);
  };

  if (hasKey === null) return null;

  if (!hasKey) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            To generate high-quality visuals with Nano Banana Pro, you need to select a paid Google Cloud project API key.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleOpenKey}
              className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
            >
              Select API Key
            </button>
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Learn about billing <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
