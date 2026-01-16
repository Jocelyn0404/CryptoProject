
export type LevelId = number | 'win';

export interface LevelData {
  id: LevelId;
  title: string;
  description: string;
  concept: string;
  encryptedMessage?: string;
  correctAnswer: string;
  instruction: string;
  hints: string[];
  knowledge?: string;
  feedback?: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type CategoryId = 'encryption-decryption' | 'caesar-cipher' | 'man-in-the-middle';

export interface CategoryData {
  id: CategoryId;
  name: string;
  description: string;
  levels: Record<number, LevelData>;
}

export interface GameState {
  currentCategory: CategoryId | null;
  currentLevel: LevelId | null;
  isIntro: boolean;
  isHintLoading: boolean;
  history: Message[];
  showKnowledge: boolean;
  stars: number;
  unlockedLevels: Record<CategoryId, number>;
  completedLevels: Record<string, boolean>;
}
