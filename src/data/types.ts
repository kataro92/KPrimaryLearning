export type AchievementLevel = 1 | 2 | 3;

export interface PlayerProfile {
  playerIdLocal: string;
  displayName: string;
  avatarId: string;
  createdAt: number;
}

export interface GameProgress {
  id?: string;
  profileId?: string;
  gameId: string;
  achievementLevelUnlocked: AchievementLevel;
  achievementNameUnlocked: string;
  bestScore: number;
  bestTimeMs: number;
}

export interface PlaySession {
  sessionId: string;
  profileId?: string;
  startedAt: number;
  endedAt: number;
  gameId: string;
  achievementLevelPlayed: AchievementLevel;
  score: number;
  correctCount: number;
  wrongCount: number;
  durationMs: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  largeText: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  musicEnabled: true,
  largeText: false,
};
