import type { SpellingChallenge } from './challengeTypes';
import { LEVEL1_BANK } from './banks/level1Bank';
import { LEVEL2_BANK } from './banks/level2Bank';
import { LEVEL3_BANK } from './banks/level3Bank';
import { LEVEL1_SUPPLEMENT } from './banks/level1Supplement';
import { LEVEL2_SUPPLEMENT } from './banks/level2Supplement';
import { LEVEL3_SUPPLEMENT } from './banks/level3Supplement';

export type { SpellingChallenge } from './challengeTypes';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LEVEL1 = [...LEVEL1_BANK, ...LEVEL1_SUPPLEMENT];
const LEVEL2 = [...LEVEL2_BANK, ...LEVEL2_SUPPLEMENT];
const LEVEL3 = [...LEVEL3_BANK, ...LEVEL3_SUPPLEMENT];

export function generateChallenges(count: number, level: 1 | 2 | 3): SpellingChallenge[] {
  const bank = level === 1 ? LEVEL1 : level === 2 ? LEVEL2 : LEVEL3;
  const picked: SpellingChallenge[] = [];
  const pool = shuffle([...bank]);
  for (let i = 0; i < count; i++) {
    picked.push(pool[i % pool.length]);
  }
  return picked;
}

export function tilesForChallenge(c: SpellingChallenge): string[] {
  return shuffle([c.answer, ...c.distractors.filter((d) => d !== c.answer).slice(0, 3)]);
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 32000;
  return 30000;
}

/** Thời gian gõ một từ — dài hơn khi từ nhiều chữ */
export function timeForChallengeMs(level: 1 | 2 | 3, answer: string): number {
  const base = timePerQuestionMs(level);
  const extra = Math.max(0, answer.length - 3) * 1400;
  return base + extra;
}

export function questionCount(level: 1 | 2 | 3): number {
  if (level === 1) return 8;
  if (level === 2) return 10;
  return 10;
}
