import { STATS_BANK, STATS_BY_LEVEL } from './statsBank';
import { STATS_BANK_EXTRA } from './statsBankExtra';
import type { StatsMcqChallenge, StatsRound } from './challengeTypes';
import { generateCoinFlipRounds } from './coinFlipRound';

export type { StatsMcqChallenge, StatsRound };

const ALL_STATS_BANK: StatsMcqChallenge[] = [...STATS_BANK, ...STATS_BANK_EXTRA];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function withShuffledChoices(item: StatsMcqChallenge): StatsMcqChallenge {
  const tagged = item.choices.map((text, originalIndex) => ({ text, originalIndex }));
  const mixed = shuffle(tagged);
  const correctIndex = mixed.findIndex((c) => c.originalIndex === item.correctIndex);
  return {
    ...item,
    kind: 'mcq',
    choices: mixed.map((c) => c.text),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

const COIN_FLIP_PER_LEVEL: Record<2 | 3, number> = { 2: 4, 3: 4 };

export function generateQuestions(level: 1 | 2 | 3): StatsRound[] {
  const allowed = new Set(STATS_BY_LEVEL[level]);
  const pool = ALL_STATS_BANK.filter((q) => allowed.has(q.sgkRef));
  const count = questionCount(level);
  const coinSlots = level >= 2 ? COIN_FLIP_PER_LEVEL[level as 2 | 3] : 0;
  const mcqTarget = count - coinSlots;

  const seen = new Set<string>();
  const mcqs: StatsMcqChallenge[] = [];
  for (const q of shuffle(pool)) {
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    mcqs.push(withShuffledChoices({ ...q, kind: 'mcq' }));
    if (mcqs.length >= mcqTarget) break;
  }

  if (level === 1) {
    return mcqs;
  }

  const coins = generateCoinFlipRounds(level as 2 | 3, coinSlots);
  return shuffle([...mcqs, ...coins]);
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 38000;
  if (level === 2) return 34000;
  return 32000;
}

export function questionCount(level: 1 | 2 | 3): number {
  if (level === 1) return 8;
  if (level === 2) return 12;
  return 12;
}
