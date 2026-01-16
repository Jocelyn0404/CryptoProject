
import React, { useState } from 'react';
import { CATEGORIES } from './constants';
import { GameState, Message, LevelId, CategoryId } from './types';
import Terminal from './components/Terminal';

// Lazy load CipherAssistant to prevent blocking app initialization
const CipherAssistant = React.lazy(() => 
  import('./components/CipherAssistant').catch(err => {
    console.error('Failed to load CipherAssistant:', err);
    // Return a dummy component that doesn't break rendering
    return {
      default: () => (
        <div className="w-80 h-full bg-slate-900 border-l border-slate-800 flex items-center justify-center p-4 text-slate-500 text-sm">
          AI Assistant temporarily unavailable
        </div>
      )
    };
  })
);

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    currentCategory: null,
    currentLevel: null,
    isIntro: true,
    isHintLoading: false,
    history: [],
    showKnowledge: true,
    stars: 0,
    unlockedLevels: {
      'encryption-decryption': 1,
      'caesar-cipher': 1,
      'man-in-the-middle': 1
    },
    completedLevels: {}
  });

  const levelData = state.currentCategory && state.currentLevel ? CATEGORIES[state.currentCategory].levels[state.currentLevel] : null;

  const handleNextLevel = () => {
    if (!state.currentCategory || !state.currentLevel) return;
    
    const category = state.currentCategory;
    const currentLevel = state.currentLevel as number;
    const maxLevel = 10;
    
    // Mark current level as completed
    const levelKey = `${category}-${currentLevel}`;
    setState(prev => ({
      ...prev,
      completedLevels: { ...prev.completedLevels, [levelKey]: true },
      stars: 3
    }));
    
    // Unlock next level if not already unlocked
    if (currentLevel < maxLevel && state.unlockedLevels[category] <= currentLevel) {
      setState(prev => ({
        ...prev,
        unlockedLevels: { ...prev.unlockedLevels, [category]: currentLevel + 1 }
      }));
    }
  };

  const handleBack = () => {
    if (state.currentLevel) {
      // Back to level selection
      setState(prev => ({ ...prev, currentLevel: null, showKnowledge: true }));
    } else if (state.currentCategory) {
      // Back to category selection
      setState(prev => ({ ...prev, currentCategory: null }));
    } else {
      // Back to intro
      setState(prev => ({ ...prev, isIntro: true }));
    }
  };

  const selectCategory = (categoryId: CategoryId) => {
    setState(prev => ({ ...prev, currentCategory: categoryId }));
  };

  const selectLevel = (levelId: LevelId) => {
    setState(prev => ({ 
      ...prev, 
      currentLevel: levelId, 
      showKnowledge: true,
      stars: 0,
      history: [] // Reset chat history for new level
    }));
  };

  const handleMessage = (msg: Message) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, msg]
    }));
  };

  const startLevel = () => {
    setState(prev => ({ ...prev, showKnowledge: false }));
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
              <p className="text-sm text-slate-300">Choose from 3 cryptography categories, each with 10 challenging levels.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-green-500/20 flex-shrink-0 flex items-center justify-center text-green-400 font-bold text-xs">2</div>
              <p className="text-sm text-slate-300">Complete levels progressively - you can't skip ahead!</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-green-500/20 flex-shrink-0 flex items-center justify-center text-green-400 font-bold text-xs">3</div>
              <p className="text-sm text-slate-300">Talk to Cipher for help and get feedback on concepts after each level.</p>
            </div>
          </div>
          <button 
            onClick={() => setState(prev => ({ ...prev, isIntro: false }))}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 uppercase tracking-widest text-sm"
          >
            Choose Your Path
          </button>
        </div>
      </div>
    );
  }

  // Category Selection Screen
  if (!state.currentCategory) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl w-full relative z-10">
          <button 
            onClick={handleBack}
            className="mb-6 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Back to Intro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <h1 className="text-4xl font-bold text-center text-white mb-8">Choose Your Cryptography Path</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(CATEGORIES).map((category) => (
              <div 
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className="bg-slate-900 border border-cyan-500/20 p-6 rounded-xl hover:border-cyan-500/40 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{category.description}</p>
                <div className="text-cyan-400 text-sm font-mono">
                  Progress: Level {state.unlockedLevels[category.id] - 1}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Level Selection Screen
  if (!state.currentLevel) {
    const category = CATEGORIES[state.currentCategory];
    const maxUnlocked = state.unlockedLevels[state.currentCategory];
    
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl w-full relative z-10">
          <button 
            onClick={handleBack}
            className="mb-6 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Back to Categories"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <h1 className="text-4xl font-bold text-center text-white mb-4">{category.name}</h1>
          <p className="text-slate-400 text-center mb-8">{category.description}</p>
          
          <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
            {Array.from({ length: 10 }, (_, i) => {
              const levelNum = i + 1;
              const isUnlocked = levelNum <= maxUnlocked;
              const isCompleted = state.completedLevels[`${state.currentCategory}-${levelNum}`];
              
              return (
                <button
                  key={levelNum}
                  onClick={() => isUnlocked && selectLevel(levelNum as LevelId)}
                  disabled={!isUnlocked}
                  className={`aspect-square rounded-lg border-2 transition-all text-center flex flex-col items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500/20 border-green-500 text-green-400' 
                      : isUnlocked 
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <div className="text-2xl font-bold">{levelNum}</div>
                  {isCompleted && (
                    <div className="text-xs mt-1">✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Level Play Screen
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Main Game Area */}
      <div className="flex-1 bg-slate-950 relative flex flex-col items-center justify-center p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-900">
           <div 
             className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
             style={{ width: `${((state.currentLevel as number) / 10) * 100}%` }}
           ></div>
        </div>
        
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Back to Levels"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] mb-3">
            {CATEGORIES[state.currentCategory!].name} - Level {state.currentLevel}
          </span>
          <h2 className="text-3xl font-bold text-white">{levelData?.title}</h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">{levelData?.description}</p>
        </div>

        {levelData && state.showKnowledge && (
          <div className="max-w-2xl w-full bg-slate-900 border border-cyan-500/20 p-6 rounded-xl mb-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Knowledge Check</h3>
            <p className="text-slate-300 leading-relaxed mb-6">{levelData.knowledge}</p>
            <button 
              onClick={startLevel}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all"
            >
              Start Challenge
            </button>
          </div>
        )}

        {levelData && !state.showKnowledge && (
          <Terminal 
            title={`Terminal_L${state.currentLevel}`}
            instruction={levelData.instruction}
            encryptedMessage={levelData.encryptedMessage}
            correctAnswer={levelData.correctAnswer}
            onCorrect={handleNextLevel}
          />
        )}

        {/* Completion Feedback */}
        {state.stars > 0 && levelData && (
          <div className="mt-8 max-w-2xl w-full bg-slate-900 border border-green-500/20 p-6 rounded-xl">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-green-400 mb-2">Level Completed!</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed">{levelData.feedback}</p>
            </div>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => {
                  const nextLevel = (state.currentLevel as number) + 1;
                  if (nextLevel <= 10) {
                    selectLevel(nextLevel as LevelId);
                  } else {
                    // Last level, go back to levels
                    setState(prev => ({ ...prev, currentLevel: null, stars: 0 }));
                  }
                }}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg transition-colors"
              >
                {(state.currentLevel as number) < 10 ? 'Continue to Next Level' : 'Back to Levels'}
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, currentLevel: null, stars: 0 }))}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
              >
                Go Back to Levels
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex gap-4 opacity-50">
          {Array.from({ length: 10 }).map((_, i) => (
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
      <React.Suspense fallback={<div className="w-80 h-full bg-slate-900 border-l border-slate-800 flex items-center justify-center text-slate-500">Loading...</div>}>
        <CipherAssistant 
          levelContext={levelData?.description || ''}
          history={state.history}
          onMessageSent={handleMessage}
          isLoading={state.isHintLoading}
          setIsLoading={(val) => setState(prev => ({ ...prev, isHintLoading: val }))}
        />
      </React.Suspense>
    </div>
  );
};

export default App;
