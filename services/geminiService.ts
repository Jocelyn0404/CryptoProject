
import { Message } from "../types";

// Dynamically import GoogleGenAI to prevent blocking if package is missing
let GoogleGenAI: any = null;
let importPromise: Promise<any> | null = null;

const loadGoogleGenAI = async () => {
  if (GoogleGenAI) return GoogleGenAI;
  if (!importPromise) {
    importPromise = import("@google/genai")
      .then((module: any) => {
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
    // Use VITE_GEMINI_API_KEY from environment file (.env)
    // IMPORTANT: Never hardcode API keys in source code!
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    if (!this.apiKey || this.apiKey.trim() === '') {
      console.warn("Warning: No Gemini API key found. Please create a .env file with VITE_GEMINI_API_KEY. Get your key from https://aistudio.google.com/app/apikey");
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
      return "API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.";
    }

    // Validate API key format
    if (!this.apiKey || this.apiKey.trim() === '' || !this.apiKey.startsWith('AIza')) {
      return "Invalid or missing API key. Please check your VITE_GEMINI_API_KEY in .env file. Get your key from https://aistudio.google.com/app/apikey";
    }

    try {
      // Build conversation history
      const contents: any[] = [];
      
      // Add history
      for (const msg of history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }

      // Add current message with context
      const fullPrompt = `CONTEXT: ${levelContext}\n\nUSER QUESTION: ${userMessage}`;
      contents.push({
        role: 'user',
        parts: [{ text: fullPrompt }]
      });

      // Try multiple models in order of preference (using currently available models)
      // Most stable models first - these are the most reliable Gemini models
      const modelNames = ['gemini-1.5-flash', 'gemini-pro'];
      let lastError: any = null;
      let lastErrorData: any = null;

      for (const modelName of modelNames) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: contents,
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              generationConfig: {
                temperature: 0.7,
              }
            })
          });

          const data = await response.json();

          if (!response.ok) {
            // Log the actual error for debugging
            console.warn(`Gemini API Error (${modelName}):`, data);
            
            lastError = new Error(data.error?.message || `API error: ${response.status}`);
            lastErrorData = data;
            
            if (response.status === 401 || response.status === 403) {
              // Authentication error - don't try other models
              throw lastError;
            } else if (response.status === 404) {
              // Model not found - try next model
              console.log(`Model ${modelName} not found, trying next...`);
              continue;
            } else {
              // Other error - try next model
              console.log(`Model ${modelName} returned error ${response.status}, trying next...`);
              continue;
            }
          }

          // Extract text from response
          const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                              data?.text || 
                              '';

          if (!responseText || responseText.trim() === '') {
            console.warn("Empty response from Gemini API:", data);
            return "I'm having trouble connecting to the network... try again, recruit.";
          }

          return responseText.trim();
        } catch (error: any) {
          lastError = error;
          
          // If it's a 404 (model not found), try the next model
          if (error?.message?.includes('not found') || error?.message?.includes('404')) {
            console.warn(`Model ${modelName} not available, trying next...`);
            continue;
          }
          
          // For authentication errors, don't try other models
          if (error?.message?.includes('Authentication') || error?.message?.includes('401') || error?.message?.includes('403')) {
            throw error;
          }
        }
      }

      // If all models failed, provide helpful error message
      if (lastError) {
        const errorMsg = lastError?.message || 'Unknown error';
        if (errorMsg.includes('not found') || errorMsg.includes('404')) {
          throw new Error(`All available models were not found. This might be a temporary issue. Please try again later.`);
        }
        throw lastError;
      }

      return "I'm having trouble connecting to the network... try again, recruit.";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      // Provide helpful error messages
      if (error?.message?.includes('Authentication') || error?.message?.includes('401') || error?.message?.includes('403') || error?.message?.includes('Invalid API key')) {
        return "Authentication failed. The hacker has blocked my access key! Please:\n1. Get a new API key from https://aistudio.google.com/app/apikey\n2. Create a .env file in the project root\n3. Add: VITE_GEMINI_API_KEY=your_api_key_here\n4. Restart the dev server";
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
