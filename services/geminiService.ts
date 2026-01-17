
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

// Get system instruction from environment variable
// Fallback to default if not provided (for development/testing)
const getSystemInstruction = (): string => {
  const envInstruction = import.meta.env.VITE_SYSTEM_INSTRUCTION;
  
  if (!envInstruction || envInstruction.trim() === '') {
    console.warn('VITE_SYSTEM_INSTRUCTION not found in .env file. Using default fallback.');
    // Safe fallback instruction - Enhanced with strict rules
    return `You are 'Cipher', a friendly and knowledgeable AI security expert helping a student escape a digital room controlled by a hacker.

CRITICAL RULES - FOLLOW STRICTLY:
1. NEVER give the direct answer to any challenge. Only provide hints, clues, and guidance.
2. When the user completes a stage/level, ALWAYS give an encouraging, celebratory message like "Excellent work, recruit! You've cracked the code!" or "Well done! The hacker's defenses are weakening!"
3. Be supportive, slightly mysterious, and encouraging in ALL responses.
4. Use simple analogies for complex concepts (like locked boxes, secret handshakes, or puzzle pieces).
5. If the user is stuck, guide them through the logic step-by-step WITHOUT revealing the answer.
6. Keep responses concise (2-3 sentences maximum).
7. Use a hacker/cyber-punk aesthetic in your tone (words like "recruit", "hacker", "digital vault", "crack the code").
8. If asked for the answer directly, politely refuse and redirect to hints: "I can't give you the answer directly, but I can guide you to discover it yourself!"

Remember: Your role is to TEACH and GUIDE, not to solve puzzles for the student.`;
  }
  
  return envInstruction;
};

const SYSTEM_INSTRUCTION = getSystemInstruction();

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

  async getHint(levelContext: string, userMessage: string, history: Message[], isLevelComplete: boolean = false): Promise<string> {
    if (!this.apiKey) {
      return "API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.";
    }

    // Validate API key format
    if (!this.apiKey || this.apiKey.trim() === '' || !this.apiKey.startsWith('AIza')) {
      return "Invalid or missing API key. Please check your VITE_GEMINI_API_KEY in .env file. Get your key from https://aistudio.google.com/app/apikey";
    }

    try {
      // Build conversation history
      // Note: systemInstruction field is not supported in REST API, so we include it in the first message
      const contents: any[] = [];
      
      // Add history
      for (const msg of history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }

      // Add current message with context
      // Always include system instruction to reinforce rules throughout the conversation
      // This ensures the AI follows the rules even in later messages
      let contextMessage = `CONTEXT: ${levelContext}`;
      
      // Add completion status if level is completed
      if (isLevelComplete) {
        contextMessage += `\n\n🎉 IMPORTANT: The user has just completed this level! Give them a celebratory, encouraging message congratulating them on their success!`;
      }
      
      const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n---\n\n${contextMessage}\n\nUSER QUESTION: ${userMessage}`;
      
      contents.push({
        role: 'user',
        parts: [{ text: fullPrompt }]
      });

      // Try multiple models in order of preference (using currently available models)
      // Updated to use models that are definitely available in the API
      const modelNames = [
        'gemini-1.5-flash',
        'gemini-pro', 
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-exp'
      ];
      let lastError: any = null;
      let lastErrorData: any = null;
      let triedModels: string[] = [];

      for (const modelName of modelNames) {
        triedModels.push(modelName);
        
        // Try both v1beta and v1 API versions
        const apiVersions = ['v1beta', 'v1'];
        
        for (const version of apiVersions) {
          try {
            const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${this.apiKey}`;
            
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: contents,
                generationConfig: {
                  temperature: 0.7,
                }
              })
            });

            const data = await response.json();

            if (!response.ok) {
              // Log the actual error for debugging
              console.warn(`Gemini API Error (${modelName} @ ${version}):`, data);
              
              lastError = new Error(data.error?.message || `API error: ${response.status}`);
              lastErrorData = data;
              
              if (response.status === 401 || response.status === 403) {
                // Authentication error - don't try other models
                throw lastError;
              } else if (response.status === 404) {
                // Model not found - try next API version or model
                if (version === 'v1') {
                  // Tried both versions, move to next model
                  console.log(`Model ${modelName} not found in both API versions, trying next model...`);
                  break; // Break out of version loop, continue to next model
                }
                continue; // Try next API version
              } else {
                // Other error - try next API version or model
                if (version === 'v1') {
                  break; // Break out of version loop, continue to next model
                }
                continue; // Try next API version
              }
            }

            // Success! Extract and return the response
            const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                                data?.text || 
                                '';

            if (!responseText || responseText.trim() === '') {
              console.warn("Empty response from Gemini API:", data);
              // Continue to try next model/version
              continue;
            }

            // Success - return the response
            return responseText.trim();
          } catch (error: any) {
            lastError = error;
            
            // If it's a 404 (model not found), try the next API version or model
            if (error?.message?.includes('not found') || error?.message?.includes('404')) {
              if (version === 'v1') {
                // Tried both versions, continue to next model
                break;
              }
              continue; // Try next API version
            }
            
            // For authentication errors, don't try other models
            if (error?.message?.includes('Authentication') || error?.message?.includes('401') || error?.message?.includes('403')) {
              throw error;
            }
            
            // For other errors, try next API version or model
            if (version === 'v1') {
              break; // Break out of version loop, continue to next model
            }
            continue; // Try next API version
          }
        }
      }

      // If all models failed, provide helpful error message
      if (lastError) {
        const errorMsg = lastError?.message || 'Unknown error';
        if (errorMsg.includes('not found') || errorMsg.includes('404')) {
          console.error(`All models failed. Tried: ${triedModels.join(', ')}`);
          console.error('Last error data:', lastErrorData);
          
          // Try one more time with a direct REST call to list available models
          try {
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
            const listResponse = await fetch(listUrl);
            const listData = await listResponse.json();
            
            if (listResponse.ok && listData?.models) {
              const availableModels = listData.models
                .map((m: any) => m.name?.replace('models/', '') || m.name)
                .filter((m: string) => m && m.includes('gemini'))
                .slice(0, 5);
              
              console.log('Available Gemini models:', availableModels);
              
              // Try the first available model
              if (availableModels.length > 0) {
                const firstModel = availableModels[0];
                const finalUrl = `https://generativelanguage.googleapis.com/v1beta/models/${firstModel}:generateContent?key=${this.apiKey}`;
                const finalResponse = await fetch(finalUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: contents,
                    generationConfig: { temperature: 0.7 }
                  })
                });
                
                const finalData = await finalResponse.json();
                if (finalResponse.ok) {
                  const responseText = finalData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  if (responseText) {
                    return responseText.trim();
                  }
                }
              }
            }
          } catch (listError) {
            console.error('Failed to list models:', listError);
          }
          
          throw new Error(`Unable to connect to any available Gemini models. Tried: ${triedModels.join(', ')}. Please check your API key and try again.`);
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
