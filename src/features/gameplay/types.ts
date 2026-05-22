export interface PlayResult {
  score: number;
  stars: number;
  grade: string;
  correct: number;
  total: number;
  durationMs: number;
  unlocked: boolean;
  newAchievementName?: string;
}
