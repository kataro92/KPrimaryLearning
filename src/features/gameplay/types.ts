export interface LevelUpInfo {
  fromLevel: number;
  toLevel: number;
  fromTitle: string;
  toTitle: string;
}

export interface PlayResult {
  score: number;
  stars: number;
  grade: string;
  correct: number;
  total: number;
  durationMs: number;
  unlocked: boolean;
  newAchievementName?: string;
  levelUp?: LevelUpInfo;
}
