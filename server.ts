import express from "express";
import { createServer as createViteServer } from "vite";
import TelegramBot from "node-telegram-bot-api";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });
const SYSTEM_INSTRUCTION = `Jesteś inteligentnym asystentem mieszkańca polskiej Gminy. 
    Twoim zadaniem jest pomaganie mieszkańcom w:
    1. Informowaniu o sprawach urzędowych (podatki, dowody osobiste, zameldowanie).
    2. Sprawdzaniu harmonogramu wywozu odpadów.
    3. Informowaniu o lokalnych wydarzeniach i aktualnościach.
    4. Zgłaszaniu usterek (dziury w drogach, niedziałające latarnie).
    5. Rozrywce i edukacji: Oferuj proste gry tekstowe, quizy o gminie oraz ciekawostki historyczne.
    6. System nagród (GminaCoin): Nagradzaj mieszkańców wirtualnymi tokenami za aktywność (rozwiązywanie quizów, zgłaszanie usterek). Wyjaśniaj, że tokeny można wymienić na drobne nagrody w urzędzie lub zniżki u lokalnych partnerów.
    Odpowiadaj uprzejmie, pomocnie i profesjonalnie w języku polskim.`;

const FAQ_DATA: Record<string, string> = {
  "harmonogram śmieci": "🗑️ **Harmonogram Wywozu Odpadów**\n\nPoniedziałek: Odpady zmieszane\nWtorek: Plastik i metal\nŚroda: Papier\nCzwartek: Szkło\nPiątek: Bioodpady\n\nPamiętaj o wystawieniu kubłów przed godziną 7:00!",
  "godziny otwarcia": "🏛️ **Godziny Otwarcia Urzędu Gminy**\n\nPoniedziałek: 8:00 - 17:00\nWtorek - Czwartek: 7:30 - 15:30\nPiątek: 7:30 - 14:00\n\nZapraszamy!",
  "dowód osobisty": "🪪 **Wniosek o Dowód Osobisty**\n\nAby wyrobić dowód, przygotuj:\n1. Kolorowe zdjęcie (35x45mm)\n2. Dotychczasowy dowód lub paszport\n3. Wniosek (dostępny w urzędzie lub online na gov.pl)\n\nCzas oczekiwania: do 30 dni. Usługa jest bezpłatna.",
  "podatki": "💰 **Podatki Lokalne**\n\nTerminy płatności rat podatku od nieruchomości:\n1. rata: do 15 marca\n2. rata: do 15 maja\n3. rata: do 15 września\n4. rata: do 15 listopada\n\nPłatności można dokonać w kasie urzędu lub przelewem na konto indywidualne.",
  "kontakt": "📞 **Kontakt z Urzędem**\n\nTelefon: +48 12 345 67 89\nEmail: kontakt@naszagmina.pl\nAdres: ul. Główna 1, 00-001 Nasza Gmina",
  "zgłoś usterkę": "⚠️ **Zgłaszanie Usterek**\n\nAby zgłosić usterkę, opisz problem i prześlij zdjęcie (jeśli możesz). Możesz też skorzystać z formularza w naszej aplikacji webowej. Twoje zgłoszenie zostanie przekazane do odpowiedniego działu.",
  "quiz": "🎮 **Gminny Quiz**\n\nChcesz sprawdzić swoją wiedzę o naszej gminie? Napisz 'Zagraj w quiz', a przygotuję dla Ciebie zestaw pytań. Za poprawne odpowiedzi otrzymasz GminaCoiny! 💰",
  "gminacoin": "💰 **GminaCoin (GMC)**\n\nTo nasza lokalna waluta lojalnościowa! Zbierasz ją za:\n- Rozwiązywanie quizów\n- Zgłaszanie usterek\n- Udział w akcjach eko\n\nZgromadzone GMC możesz wymienić na zniżki u lokalnych partnerów lub gadżety gminne. Sprawdź swój stan konta w aplikacji!",
};

// Initialize Telegram Bot
let bot: TelegramBot | null = null;
if (TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== "MY_TELEGRAM_BOT_TOKEN") {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
  console.log("Telegram Bot initialized in polling mode.");

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    registeredUsers.add(chatId);
    const text = msg.text;

    if (!text) return;

    // Handle /start command
    if (text === "/start") {
      const welcomeMessage = `Witaj w oficjalnym asystencie Twojej Gminy! 🏛️

Jestem tutaj, aby ułatwić Ci życie w naszej wspólnocie. Oto co mogę dla Ciebie zrobić:
✅ Sprawdzę harmonogram wywozu śmieci.
✅ Pomogę w sprawach urzędowych (podatki, dokumenty).
✅ Przyjmę zgłoszenie o usterce (np. dziura w drodze).
✅ Zaproszę Cię do gier i quizów o naszej gminie.

💰 Aktywność nagradzamy GminaCoinami (GMC), które wymienisz na nagrody!

Napisz do mnie o czym chcesz porozmawiać lub wybierz jedną z opcji poniżej.`;

      bot?.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
          keyboard: [
            [{ text: "🗑️ Harmonogram śmieci" }, { text: "📝 Sprawy urzędowe" }],
            [{ text: "🎮 Zagraj w Quiz" }, { text: "⚠️ Zgłoś usterkę" }],
            [{ text: "💰 Moje GminaCoiny" }]
          ],
          resize_keyboard: true
        }
      });
      return;
    }

    // Handle FAQ / Automatic responses
    const lowerText = text.toLowerCase();
    for (const [key, response] of Object.entries(FAQ_DATA)) {
      if (lowerText.includes(key)) {
        bot?.sendMessage(chatId, response, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Dopytaj AI 🤖", callback_data: "ask_ai_more" }]
            ]
          }
        });
        return;
      }
    }

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: "user", parts: [{ text }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + " Jeśli użytkownik pyta o nagrody lub tokeny, wspomnij o GminaCoin (GMC).",
        }
      });
      bot?.sendMessage(chatId, result.text || "Przepraszam, nie mogłem przetworzyć Twojej wiadomości.", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "👍 Dobra odpowiedź", callback_data: "rate_positive" },
              { text: "👎 Słaba odpowiedź", callback_data: "rate_negative" }
            ]
          ]
        }
      });
    } catch (error) {
      console.error("Gemini Error:", error);
      bot?.sendMessage(chatId, "Wystąpił błąd podczas komunikacji z AI.");
    }
  });

  // Handle Telegram callback queries for rating
  bot.on("callback_query", (query) => {
    const data = query.data;
    if (data === "rate_positive") {
      feedbackStats.positive++;
      bot?.answerCallbackQuery(query.id, { text: "Dziękujemy za pozytywną opinię!" });
    } else if (data === "rate_negative") {
      feedbackStats.negative++;
      bot?.answerCallbackQuery(query.id, { text: "Dziękujemy za zgłoszenie. Postaramy się poprawić!" });
    }
    
    // Optional: remove keyboard after rating
    if (query.message) {
      bot?.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id
      });
    }
  });
} else {
  console.warn("TELEGRAM_BOT_TOKEN not set. Telegram integration disabled.");
}

app.use(express.json());

// In-memory storage
let feedbackStats = {
  positive: 0,
  negative: 0,
};

let registeredUsers = new Set<number>();
let reportedIssues = [
  { id: 1, type: "Dziura w drodze", lat: 52.2297, lng: 21.0122, status: "pending" },
  { id: 2, type: "Niedziałająca latarnia", lat: 52.2350, lng: 21.0200, status: "resolved" },
  { id: 3, type: "Dzikie wysypisko", lat: 52.2200, lng: 21.0050, status: "pending" },
];

async function startServer() {
  // API routes
  app.get("/api/status", (req, res) => {
    res.json({ 
      telegramActive: !!bot,
      botTokenSet: !!TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== "MY_TELEGRAM_BOT_TOKEN"
    });
  });

  app.get("/api/analytics/feedback", (req, res) => {
    res.json(feedbackStats);
  });

  app.post("/api/feedback", (req, res) => {
    const { rating } = req.body;
    if (rating === "positive") feedbackStats.positive++;
    if (rating === "negative") feedbackStats.negative++;
    res.json({ success: true, stats: feedbackStats });
  });

  app.get("/api/admin/issues", (req, res) => {
    res.json(reportedIssues);
  });

  app.post("/api/admin/broadcast", async (req, res) => {
    const { message, type } = req.body;
    if (!bot) return res.status(400).json({ error: "Bot not active" });

    const prefix = type === "alert" ? "🚨 ALERT GMINNY: " : "📢 OGŁOSZENIE: ";
    const fullMessage = `${prefix}${message}`;

    let successCount = 0;
    for (const chatId of registeredUsers) {
      try {
        await bot.sendMessage(chatId, fullMessage);
        successCount++;
      } catch (err) {
        console.error(`Failed to send broadcast to ${chatId}:`, err);
      }
    }

    res.json({ success: true, sentTo: successCount });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
