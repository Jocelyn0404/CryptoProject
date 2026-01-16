
import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  instruction: string;
  encryptedMessage?: string;
  onCorrect: () => void;
  correctAnswer: string;
  title: string;
}

const Terminal: React.FC<TerminalProps> = ({ instruction, encryptedMessage, onCorrect, correctAnswer, title }) => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setInput('');
    setFeedback(null);
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setFeedback("ACCESS GRANTED. DECRYPTING...");
      setTimeout(() => {
        onCorrect();
      }, 1500);
    } else {
      setFeedback("ACCESS DENIED. TRY AGAIN.");
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="bg-black border border-green-500/30 p-6 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.1)] font-mono w-full max-w-2xl relative overflow-hidden">
      <div className="scanline"></div>
      <div className="flex items-center gap-2 mb-4 border-b border-green-500/20 pb-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-xs text-green-500/60 ml-2 uppercase tracking-widest">{title}</span>
      </div>

      <div className="space-y-4">
        <div className="text-green-400">
          <p className="mb-2 opacity-80">System Instruction:</p>
          <p className="text-lg font-bold">{instruction}</p>
        </div>

        {encryptedMessage && (
          <div className="bg-green-500/5 p-4 border border-green-500/10 rounded">
            <p className="text-xs text-green-500/50 mb-1 uppercase">Encrypted Content</p>
            <p className="text-2xl text-green-300 tracking-[0.2em] break-all">{encryptedMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 relative">
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-bold">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-green-400 w-full text-lg placeholder:text-green-900"
              placeholder="Enter decryption key or message..."
              autoComplete="off"
            />
          </div>
          <div className="h-1 bg-green-500/20 mt-1">
            <div className="h-full bg-green-500 animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </form>

        {feedback && (
          <div className={`mt-4 text-center font-bold ${feedback.includes('GRANTED') ? 'text-green-400' : 'text-red-400'} animate-bounce`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
