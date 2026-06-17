export type Difficulty = 'easy' | 'medium' | 'hard';
export type ShotType = 'A' | 'B' | 'C';
export type ScreenId = 'menu' | 'country-select' | 'play' | 'discovery' | 'defeat' | 'victory';

export interface QuizQuestion {
  id: string;
  difficulty: Difficulty;
  prompt: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
}

export interface CountryProfile {
  id: string;
  name: string;
  flagColors: [string, string, string];
  culture: string;
  footballHistory: string;
  signatureFood: string;
  figure: string;
  questions: QuizQuestion[];
}

export interface LevelState {
  countryId: string;
  stage: 1 | 2 | 3 | 4;
  lives: number;
  correctStreak: number;
  currentQuestion: QuizQuestion | null;
  usedQuestionIds: Set<string>;
  score: number;
  startedAt: number;
}

export interface ShotResult {
  correct: boolean;
  shot: ShotType;
}

export type GamePhase =
  | 'idle'
  | 'selecting'
  | 'kicking'
  | 'flying'
  | 'blocking'
  | 'returning'
  | 'scrolling'
  | 'goal'
  | 'defeat';

export interface BallState {
  x: number;
  y: number;
  progress: number;
}

export interface SceneSnapshot {
  phase: GamePhase;
  stage: 1 | 2 | 3 | 4;
  isBoss: boolean;
  scrollOffset: number;
  strikerX: number;
  strikerY: number;
  defenderX: number;
  defenderY: number;
  ball: BallState;
  hitFlash: number;
  netShake: number;
  celebrate: number;
  disappointment: number;
  shot: ShotType | null;
  correct: boolean | null;
}
