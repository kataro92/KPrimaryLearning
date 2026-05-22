import * as db from '@/data/indexeddb/db';
import type { AchievementLevel, GameProgress, PlayerProfile } from '@/data/types';

export async function ensurePlayer(displayName: string, avatarId = 'default'): Promise<PlayerProfile> {
  const normalized = displayName.trim();
  const profiles = await db.getProfiles();
  const existing = profiles.find(
    (p) => p.displayName.toLowerCase() === normalized.toLowerCase()
  );
  if (existing) {
    db.setActiveProfileId(existing.playerIdLocal);
    return existing;
  }
  const profile: PlayerProfile = {
    playerIdLocal: crypto.randomUUID(),
    displayName: normalized,
    avatarId,
    createdAt: Date.now(),
  };
  await db.saveProfile(profile);
  db.setActiveProfileId(profile.playerIdLocal);
  return profile;
}

export async function getOrInitProgress(
  profileId: string,
  gameId: string,
  defaultAchievementName: string
): Promise<GameProgress> {
  const existing = await db.getProgress(profileId, gameId);
  if (existing) return existing;
  const initial: GameProgress = {
    profileId,
    gameId,
    achievementLevelUnlocked: 1,
    achievementNameUnlocked: defaultAchievementName,
    bestScore: 0,
    bestTimeMs: 0,
  };
  await db.saveProgress(initial);
  return initial;
}

export function canPlayAchievement(
  progress: GameProgress,
  level: AchievementLevel
): boolean {
  return level <= progress.achievementLevelUnlocked;
}

/** Hoàn thành danh hiệu: điểm >= 7 */
export function isAchievementCompleted(score: number): boolean {
  return score >= 7;
}

export async function tryUnlockNextAchievement(
  profileId: string,
  gameId: string,
  playedLevel: AchievementLevel,
  score: number,
  nextNames: Record<AchievementLevel, string>
): Promise<{ unlocked: boolean; newLevel?: AchievementLevel }> {
  if (!isAchievementCompleted(score)) return { unlocked: false };
  const progress = await db.getProgress(profileId, gameId);
  if (!progress) return { unlocked: false };

  const nextLevel = (playedLevel + 1) as AchievementLevel;
  if (nextLevel > 3 || progress.achievementLevelUnlocked >= nextLevel) {
    return { unlocked: false };
  }

  progress.achievementLevelUnlocked = nextLevel;
  progress.achievementNameUnlocked = nextNames[nextLevel];
  await db.saveProgress(progress);
  return { unlocked: true, newLevel: nextLevel };
}
