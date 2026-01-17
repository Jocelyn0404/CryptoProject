

import React, { useState, useRef, useEffect } from 'react';
import { getGeminiService } from '../services/geminiService';
import { Message } from '../types';

interface CipherAssistantProps {
  levelContext: string;
  history: Message[];
  onMessageSent: (msg: Message) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  isLevelComplete?: boolean;
}

const CipherAssistant: React.FC<CipherAssistantProps> = ({ 
  levelContext, 
  history, 
  onMessageSent,
  isLoading,
  setIsLoading,
  isLevelComplete = false
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const userInput = input.trim();
    onMessageSent(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const service = getGeminiService();
      const hint = await service.getHint(levelContext, userInput, history, isLevelComplete);
      const assistantMsg: Message = { role: 'assistant', content: hint };
      onMessageSent(assistantMsg);
    } catch (error) {
      console.error("Error getting hint:", error);
      const errorMsg: Message = { 
        role: 'assistant', 
        content: "I encountered an error processing your request. Please try again." 
      };
      onMessageSent(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-100">Cipher AI</h3>
          <p className="text-[10px] text-cyan-500/70 font-mono tracking-tighter uppercase">Security Protocol v4.2</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="text-center py-8 opacity-40 italic text-sm">
            "Ask me for a hint if you're stuck, recruit."
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-cyan-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-cyan-100 rounded-tl-none border border-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none border border-slate-700">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="Need a hint? Type here..."
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500 hover:text-cyan-400 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CipherAssistant;
