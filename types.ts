
export type LevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'win';

export type CategoryId = 'encryption-decryption' | 'caesar-cipher' | 'man-in-the-middle';

export interface LevelData {
  id: LevelId;
  title: string;
  description: string;
  concept: string;
  knowledge: string;
  encryptedMessage?: string;
  correctAnswer: string;
  instruction: string;
  hints: string[];
  feedback: string;
}

export interface CategoryData {
  id: CategoryId;
  name: string;
  description: string;
  levels: Record<string, LevelData>;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
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
  completedLevels: Record<string, boolean>; // 'category-level' => true
}
