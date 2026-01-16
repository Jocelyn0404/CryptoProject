
export type LevelId = 1 | 2 | 3 | 4 | 'win';

export interface LevelData {
  id: LevelId;
  title: string;
  description: string;
  concept: string;
  encryptedMessage?: string;
  correctAnswer: string;
  instruction: string;
  hints: string[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GameState {
  currentLevel: LevelId;
  isIntro: boolean;
  isHintLoading: boolean;
  history: Message[];
}
