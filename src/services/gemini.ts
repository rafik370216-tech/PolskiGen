import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export interface CampaignData {
  subjectLines: string[];
  bodyCopy: string;
  imagePrompts: string[];
}

export const generateCampaign = async (prompt: string): Promise<CampaignData> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a complete email marketing campaign based on this prompt: "${prompt}". 
    Return a JSON object with:
    - subjectLines: an array of 3 catchy subject lines.
    - bodyCopy: the main email body in Markdown format.
    - imagePrompts: an array of 2 descriptive prompts for generating visuals that complement the email.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subjectLines: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          bodyCopy: { type: Type.STRING },
          imagePrompts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["subjectLines", "bodyCopy", "imagePrompts"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const generateCampaignImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K"): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const chatWithAI = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: `Jesteś inteligentnym asystentem mieszkańca polskiej Gminy. 
      Twoim zadaniem jest pomaganie mieszkańcom w:
      1. Informowaniu o sprawach urzędowych (podatki, dowody osobiste, zameldowanie).
      2. Sprawdzaniu harmonogramu wywozu odpadów.
      3. Informowaniu o lokalnych wydarzeniach i aktualnościach.
      4. Zgłaszaniu usterek (dziury w drogach, niedziałające latarnie).
      5. Rozrywce i edukacji: Oferuj proste gry tekstowe, quizy o gminie oraz ciekawostki historyczne.
      6. System nagród (GminaCoin): Nagradzaj mieszkańców wirtualnymi tokenami za aktywność (rozwiązywanie quizów, zgłaszanie usterek). Wyjaśniaj, że tokeny można wymienić na drobne nagrody w urzędzie lub zniżki u lokalnych partnerów.
      Odpowiadaj uprzejmie, pomocnie i profesjonalnie w języku polskim.`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
