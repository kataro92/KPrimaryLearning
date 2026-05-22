import { finishGameSession } from './finishSession';
import type { PlayResult } from './types';
import type { GameDefinition } from '@/games/catalog';
import type { AchievementLevel } from '@/data/types';

export interface SessionTrackerConfig {
  profileId: string;
  gameId: string;
  level: AchievementLevel;
  achievements: GameDefinition['achievements'];
  total: number;
  targetTimeSec: number;
  startedAt: number;
}

export function createSessionTracker(config: SessionTrackerConfig) {
  let correct = 0;
  let wrong = 0;
  let maxStreak = 0;
  let streak = 0;
  let totalResponseMs = 0;

  return {
    recordRound(wasCorrect: boolean, responseMs: number) {
      totalResponseMs += responseMs;
      if (wasCorrect) {
        correct++;
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        wrong++;
        streak = 0;
      }
    },
    async finish(): Promise<PlayResult> {
      const avgSec =
        config.total > 0 ? totalResponseMs / config.total / 1000 : 99;
      return finishGameSession({
        profileId: config.profileId,
        gameId: config.gameId,
        level: config.level,
        achievements: config.achievements,
        correct,
        wrong,
        total: config.total,
        maxStreak,
        avgTimePerQuestionSec: avgSec,
        targetTimeSec: config.targetTimeSec,
        startedAt: config.startedAt,
      });
    },
  };
}
