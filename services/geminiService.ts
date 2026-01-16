
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
Your goal is to help with cryptography challenges by answering questions and providing hints when needed.
RULES:
1. Answer general questions about cryptography concepts directly and helpfully.
2. For specific challenge hints, guide them step-by-step without giving the direct answer.
3. Be supportive, slightly mysterious, and encouraging.
4. Use simple analogies for complex concepts (like locked boxes or secret handshakes).
5. Keep responses concise but informative.
6. Use a hacker/cyber-punk aesthetic in your tone.
7. If asked for a hint on a challenge, provide subtle guidance.
`;

export class GeminiService {
  private ai: any;
  private apiKey: string;
  private initialized: boolean = false;

  constructor() {
    // Use GEMINI_API_KEY from environment, fallback to API_KEY, or use hardcoded key
    this.apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || 'AIzaSyA0ukdH3aphiqv_mioHqWDxuHjm-nfC8H4';
    
    if (!this.apiKey) {
      console.warn("Warning: No Gemini API key provided. AI hints will not work.");
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
    // First try the real API
    try {
      return await this.getHintFromAPI(levelContext, userMessage, history);
    } catch (error) {
      console.warn("API failed, using fallback hints:", error);
      return this.getFallbackHint(levelContext, userMessage);
    }
  }

  private async getHintFromAPI(levelContext: string, userMessage: string, history: Message[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("API key not configured");
    }

    // Lazy initialization
    await this.initializeAI();

    if (!this.initialized || !this.ai) {
      throw new Error("AI service is not available");
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
        throw new Error("Empty response from API");
      }

      return responseText.trim();
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  private getFallbackHint(levelContext: string, userMessage: string): string {
    // Provide helpful fallback hints based on common questions and level context
    const lowerMessage = userMessage.toLowerCase();
    const lowerContext = levelContext.toLowerCase();

    // General cryptography questions
    if (lowerMessage.includes('what is') && lowerMessage.includes('encryption')) {
      return "Encryption is the process of converting plaintext (readable text) into ciphertext (unreadable text) using an algorithm and a key. Think of it like locking a message in a box!";
    }

    if (lowerMessage.includes('what is') && lowerMessage.includes('decryption')) {
      return "Decryption is the reverse of encryption - converting ciphertext back to plaintext using the correct key. It's like unlocking the box to read the message inside.";
    }

    // Caesar cipher hints
    if (lowerContext.includes('caesar') || lowerContext.includes('shift')) {
      if (lowerMessage.includes('shift') || lowerMessage.includes('move')) {
        return "In a Caesar cipher, each letter is shifted by a fixed number of positions. For example, with a shift of 3, A becomes D, B becomes E, etc.";
      }
      if (lowerMessage.includes('decrypt') || lowerMessage.includes('reverse')) {
        return "To decrypt a Caesar cipher, shift the letters back by the same amount. If encrypted with +3, decrypt with -3.";
      }
    }

    // Key exchange hints
    if (lowerContext.includes('key exchange') || lowerContext.includes('diffie')) {
      if (lowerMessage.includes('how') || lowerMessage.includes('work')) {
        return "Diffie-Hellman allows two parties to agree on a secret key over a public channel. They exchange public values and compute the shared secret using their private keys.";
      }
    }

    // MITM hints
    if (lowerContext.includes('man') && lowerContext.includes('middle')) {
      if (lowerMessage.includes('prevent') || lowerMessage.includes('stop')) {
        return "Use HTTPS, certificate pinning, VPNs, and two-factor authentication to prevent MITM attacks. Always verify certificates!";
      }
    }

    // Default helpful responses
    if (lowerMessage.includes('hint') || lowerMessage.includes('help')) {
      return "I'm here to help! Try thinking about the basic principles of the concept. What do you know about encryption/decryption? Look for patterns in the challenge.";
    }

    if (lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
      return "Don't worry, cryptography can be tricky! Break it down step by step. What does the instruction ask you to do? What tools or concepts might help?";
    }

    // Generic fallback
    return "That's an interesting question! In cryptography, we often deal with transforming information to protect it. Consider what the core concept of this level is trying to teach you.";
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
