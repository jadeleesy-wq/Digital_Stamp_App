
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateWinnerAnnouncement = async (winners: string[]): Promise<string> => {
  if (!API_KEY) {
    return `Congratulations to our winners: ${winners.join(', ')}!`;
  }

  try {
    const prompt = `You are a fun and enthusiastic event host. Announce the following lucky draw winners for our corporate event. Make it sound exciting, celebratory, and brief. Keep it to one or two sentences. Winners: ${winners.join(', ')}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating winner announcement:", error);
    return `A huge round of applause for our lucky winners: ${winners.join(', ')}! Congratulations!`;
  }
};
