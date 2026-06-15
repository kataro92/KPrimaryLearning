import { getAllProgress, getAllSessions } from '@/data/indexeddb/db';
import { GAMES } from '@/games/catalog';
import type { PlayerLevelInput } from './playerLevel';

export async function aggregatePlayerLevelInput(profileId: string): Promise<PlayerLevelInput> {
  const [sessions, progressList] = await Promise.all([
    getAllSessions(profileId),
    getAllProgress(profileId),
  ]);
  const totalSessions = sessions.length;
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correctCount, 0);
  const totalWrong = sessions.reduce((sum, s) => sum + s.wrongCount, 0);
  const totalQuestions = totalCorrect + totalWrong;
  const avgScore =
    totalSessions > 0
      ? Math.round((sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions) * 10) / 10
      : 0;
  const unlockedTier3 = progressList.filter((p) => p.achievementLevelUnlocked >= 3).length;

  return {
    totalSessions,
    avgScore,
    unlockedTier3,
    totalQuestions,
  };
}

export function countUnlockedTier3(progressList: { achievementLevelUnlocked: number }[]): number {
  return progressList.filter((p) => p.achievementLevelUnlocked >= 3).length;
}

export function summarizeSessions(sessions: { correctCount: number; wrongCount: number; score: number }[]): {
  totalSessions: number;
  avgScore: number;
  totalQuestions: number;
} {
  const totalSessions = sessions.length;
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correctCount, 0);
  const totalWrong = sessions.reduce((sum, s) => sum + s.wrongCount, 0);
  const totalQuestions = totalCorrect + totalWrong;
  const avgScore =
    totalSessions > 0
      ? Math.round((sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions) * 10) / 10
      : 0;
  return { totalSessions, avgScore, totalQuestions };
}

/** Tiện cho test / tài liệu — tổng số game dùng trong công thức mốc. */
export const PLAYER_LEVEL_GAME_COUNT = GAMES.length;
