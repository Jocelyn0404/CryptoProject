
import React, { useState, useEffect } from 'react';
import { LEVELS } from './constants';
import { GameState, Message, LevelId } from './types';
import Terminal from './components/Terminal';
import CipherAssistant from './components/CipherAssistant';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    currentLevel: 1,
    isIntro: true,
    isHintLoading: false,
    history: []
  });

  const levelData = state.currentLevel === 'win' ? null : LEVELS[state.currentLevel];

  const handleNextLevel = () => {
    setState(prev => {
      const next: LevelId = prev.currentLevel === 4 ? 'win' : ((prev.currentLevel as number) + 1) as LevelId;
      return {
        ...prev,
        currentLevel: next,
        history: [{ role: 'assistant', content: `Well done! Moving to Room ${next}. Concept: ${next === 'win' ? 'Freedom' : LEVELS[next].concept}` }]
      };
    });
  };

  const handleMessage = (msg: Message) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, msg]
    }));
  };

  if (state.isIntro) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="max-w-2xl w-full bg-slate-900 border border-cyan-500/20 p-10 rounded-2xl shadow-2xl relative z-10 backdrop-blur-md">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center text-white mb-4 tracking-tight">Escape the <span className="text-cyan-400">Hacker Room</span></h1>
          <p className="text-slate-400 text-center mb-8 leading-relaxed">
            You've been trapped in a high-security digital vault by a rogue hacker. 
            To escape, you must master the ancient and modern arts of <span className="text-cyan-300 font-mono">Cryptography</span>. 
            Your only ally is <span className="text-cyan-300 font-mono">Cipher</span>, an AI assistant who knows the way out.
          </p>
          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-green-500/20 flex-shrink-0 flex items-center justify-center text-green-400 font-bold text-xs">1</div>
              <p className="text-sm text-slate-300">Solve 4 cryptography puzzles to unlock the final door.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-green-500/20 flex-shrink-0 flex items-center justify-center text-green-400 font-bold text-xs">2</div>
              <p className="text-sm text-slate-300">Decrypt messages, handle key exchanges, and detect attacks.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-green-500/20 flex-shrink-0 flex items-center justify-center text-green-400 font-bold text-xs">3</div>
              <p className="text-sm text-slate-300">Talk to Cipher in the sidebar if you need guidance (no spoilers!).</p>
            </div>
          </div>
          <button 
            onClick={() => setState(prev => ({ ...prev, isIntro: false }))}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 uppercase tracking-widest text-sm"
          >
            Initiate Escape Protocol
          </button>
        </div>
      </div>
    );
  }

  if (state.currentLevel === 'win') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500 mb-8 animate-bounce">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">SYSTEM ESCAPED</h1>
        <p className="text-slate-400 text-xl max-w-lg mb-10">
          You've successfully outsmarted the hacker! You are now a certified Cryptography Initiate. 
          The digital doors are open.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Main Game Area */}
      <div className="flex-1 bg-slate-950 relative flex flex-col items-center justify-center p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-900">
           <div 
             className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
             style={{ width: `${((state.currentLevel as number) / 4) * 100}%` }}
           ></div>
        </div>
        
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] mb-3">
            Room 0{state.currentLevel} - {levelData?.concept}
          </span>
          <h2 className="text-3xl font-bold text-white">{levelData?.title}</h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">{levelData?.description}</p>
        </div>

        {levelData && (
          <Terminal 
            title={`Terminal_0${state.currentLevel}`}
            instruction={levelData.instruction}
            encryptedMessage={levelData.encryptedMessage}
            correctAnswer={levelData.correctAnswer}
            onCorrect={handleNextLevel}
          />
        )}

        <div className="mt-12 flex gap-4 opacity-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full ${
                (state.currentLevel as number) > i ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Side AI Assistant */}
      <CipherAssistant 
        levelContext={levelData?.description || ''}
        history={state.history}
        onMessageSent={handleMessage}
        isLoading={state.isHintLoading}
        setIsLoading={(val) => setState(prev => ({ ...prev, isHintLoading: val }))}
      />
    </div>
  );
};

export default App;
