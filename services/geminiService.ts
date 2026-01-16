
import { Message } from "../types";

// Dynamically import GoogleGenAI to prevent blocking if package is missing
let GoogleGenAI: any = null;
let importPromise: Promise<any> | null = null;

const loadGoogleGenAI = async () => {
  if (GoogleGenAI) return GoogleGenAI;
  if (!importPromise) {
    importPromise = import("@google/genai")
      .then((module) => {
        GoogleGenAI = module.GoogleGenAI || module.default?.GoogleGenAI || module.default;
        return GoogleGenAI;
      })
      .catch((error) => {
        console.warn("Could not load @google/genai package:", error);
        return null;
      });
  }
  return importPromise;
};

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
  private apiKey: string;
  private initialized: boolean = false;

  constructor() {
    // Use VITE_GEMINI_API_KEY from environment (for Vite client-side apps)
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'your_api_key_here';

    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      console.warn("Warning: No valid Gemini API key provided. AI hints will not work. Get your key from https://aistudio.google.com/app/apikey");
    }
  }

  private async initializeAI() {
    if (this.initialized || !this.apiKey) {
      return;
    }

    try {
      const GenAIClass = await loadGoogleGenAI();
      if (GenAIClass) {
        this.ai = new GenAIClass({ apiKey: this.apiKey });
        this.initialized = true;
      } else {
        console.error("GoogleGenAI is not available. Check @google/genai package installation.");
      }
    } catch (error) {
      console.error("Failed to initialize Gemini API:", error);
    }
  }

  async getHint(levelContext: string, userMessage: string, history: Message[]): Promise<string> {
    if (!this.apiKey) {
      return "API key not configured. Please set GEMINI_API_KEY in your environment.";
    }

    // Lazy initialization
    await this.initializeAI();

    if (!this.initialized || !this.ai) {
      return "AI service is not available. Check your API key and connection.";
    }

    try {
      // Build conversation history with proper format
      const chatHistory = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Prepare the full conversation with context
      const contents = [
        ...chatHistory,
        { 
          role: 'user' as const, 
          parts: [{ text: `CONTEXT: ${levelContext}\n\nUSER QUESTION: ${userMessage}` }] 
        }
      ];

      // Generate content using the correct API structure
      // Try multiple model names in order of preference (most stable first)
      const modelNames = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
      let response: any = null;
      let lastError: any = null;

      for (const modelName of modelNames) {
        try {
          response = await this.ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });
          // If successful, break out of the loop
          break;
        } catch (error: any) {
          lastError = error;
          // If it's a 404 (model not found), try the next model
          if (error?.error?.code === 404 || error?.status === 404) {
            console.warn(`Model ${modelName} not found, trying next...`);
            continue;
          }
          // For other errors, throw immediately
          throw error;
        }
      }

      // If all models failed with 404, throw the last error
      if (!response && lastError) {
        throw lastError;
      }

      // Extract text from response - handle different response structures
      let responseText = '';
      if (response?.text) {
        responseText = response.text;
      } else if (response?.response?.text) {
        responseText = response.response.text;
      } else if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = response.candidates[0].content.parts[0].text;
      } else if (typeof response === 'string') {
        responseText = response;
      }

      if (!responseText || responseText.trim() === '') {
        console.warn("Empty response from Gemini API:", response);
        return "I'm having trouble connecting to the network... try again, recruit.";
      }

      return responseText.trim();
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      // Provide more helpful error messages
      if (error?.message?.includes('API key') || error?.message?.includes('authentication')) {
        return "Authentication failed. The hacker has blocked my access key! Get a new API key from https://aistudio.google.com/app/apikey and add it to your .env file as VITE_GEMINI_API_KEY.";
      } else if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
        return "Too many requests! The hacker is rate-limiting my connection. Wait a moment and try again.";
      } else if (error?.message) {
        return `Connection error: ${error.message}. The hacker might be interfering!`;
      }
      
      return "The hacker is blocking my signals! I can't provide a hint right now.";
    }
  }
}

// Lazy singleton - only create when first accessed
let _geminiServiceInstance: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!_geminiServiceInstance) {
    try {
      _geminiServiceInstance = new GeminiService();
    } catch (error) {
      console.error("Failed to create GeminiService:", error);
      // Return a dummy service that always returns an error message
      _geminiServiceInstance = {
        getHint: async () => "AI service is temporarily unavailable. Please try again later."
      } as any;
    }
  }
  return _geminiServiceInstance;
};

// Export both singleton accessor and direct instance for backward compatibility
export const geminiService = getGeminiService();
