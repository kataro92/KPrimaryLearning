import { saveProgress, saveSession } from '@/data/indexeddb/db';
import type { PlaySession } from '@/data/types';
import type { AchievementLevel } from '@/data/types';
import { computeScore, gradeLabel, starCount } from '@/features/scoring/scoreEngine';
import {
  getOrInitProgress,
  tryUnlockNextAchievement,
} from '@/features/progress/userProgressStore';
import type { GameDefinition } from '@/games/catalog';
import type { PlayResult } from './types';

export interface FinishSessionInput {
  profileId: string;
  gameId: string;
  level: AchievementLevel;
  achievements: GameDefinition['achievements'];
  correct: number;
  wrong: number;
  total: number;
  maxStreak: number;
  avgTimePerQuestionSec: number;
  targetTimeSec: number;
  startedAt: number;
}

export async function finishGameSession(input: FinishSessionInput): Promise<PlayResult> {
  const durationMs = Date.now() - input.startedAt;
  const score = computeScore({
    correct: input.correct,
    total: input.total,
    avgTimePerQuestionSec: input.avgTimePerQuestionSec,
    targetTimeSec: input.targetTimeSec,
    maxStreak: input.maxStreak,
  });
  const stars = starCount(score);
  const grade = gradeLabel(score);

  const progress = await getOrInitProgress(input.profileId, input.gameId, input.achievements[1]);
  if (score > progress.bestScore) {
    progress.bestScore = score;
    progress.bestTimeMs = durationMs;
    await saveProgress(progress);
  }

  const unlock = await tryUnlockNextAchievement(
    input.profileId,
    input.gameId,
    input.level,
    score,
    input.achievements
  );

  const session: PlaySession = {
    sessionId: crypto.randomUUID(),
    profileId: input.profileId,
    startedAt: input.startedAt,
    endedAt: Date.now(),
    gameId: input.gameId,
    achievementLevelPlayed: input.level,
    score,
    correctCount: input.correct,
    wrongCount: input.wrong,
    durationMs,
  };
  await saveSession(session);

  return {
    score,
    stars,
    grade,
    correct: input.correct,
    total: input.total,
    durationMs,
    unlocked: unlock.unlocked,
    newAchievementName: unlock.unlocked
      ? input.achievements[unlock.newLevel!]
      : undefined,
  };
}
