import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { chatWithAI } from "../services/gemini";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your CampaignCraft assistant. How can I help you with your marketing campaign today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(userMessage, []);
      setMessages((prev) => [...prev, { role: "assistant", content: response || "Sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-500 transition-all z-40",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageSquare className="text-white w-6 h-6" />
      </button>

      <div
        className={cn(
          "fixed bottom-6 right-6 w-96 max-h-[600px] h-[80vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 transition-all origin-bottom-right",
          !isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="p-4 border-bottom border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-white">Marketing Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", msg.role === "user" ? "bg-zinc-800" : "bg-emerald-600/20")}>
                {msg.role === "user" ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-emerald-500" />}
              </div>
              <div className={cn("max-w-[80%] p-3 rounded-2xl text-sm", msg.role === "user" ? "bg-zinc-800 text-white rounded-tr-none" : "bg-zinc-800/50 text-zinc-200 rounded-tl-none")}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              </div>
              <div className="bg-zinc-800/50 p-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
