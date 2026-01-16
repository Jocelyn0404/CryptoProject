
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are 'Cipher', a friendly and knowledgeable AI security expert helping a student escape a digital room controlled by a hacker.
Your goal is to provide adaptive hints for cryptography challenges.
RULES:
1. NEVER give the direct answer to the challenge.
2. Be supportive, slightly mysterious, and encouraging.
3. Use simple analogies for complex concepts (like locked boxes or secret handshakes).
4. If the user is stuck, guide them through the logic step-by-step.
5. Keep responses concise (under 3 sentences).
6. Use a hacker/cyber-punk aesthetic in your tone.
`;

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getHint(levelContext: string, userMessage: string, history: Message[]): Promise<string> {
    try {
      const chat = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }]
      }));

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `CONTEXT: ${levelContext}\nUSER: ${userMessage}` }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return response.text || "I'm having trouble connecting to the network... try again, recruit.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "The hacker is blocking my signals! I can't provide a hint right now.";
    }
  }
}

export const geminiService = new GeminiService();
