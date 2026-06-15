import { FRACTION_BANK, FRACTION_BY_LEVEL } from './fractionBank';
import { FRACTION_BANK_EXTRA } from './fractionBankExtra';
import { FRACTION_VISUAL_BANK } from './fractionVisualBank';
import type { FractionMcqChallenge } from './challengeTypes';

export type { FractionMcqChallenge };

const ALL_FRACTION_BANK: FractionMcqChallenge[] = [
  ...FRACTION_BANK,
  ...FRACTION_BANK_EXTRA,
  ...FRACTION_VISUAL_BANK,
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function withShuffledChoices(item: FractionMcqChallenge): FractionMcqChallenge {
  const tagged = item.choices.map((text, originalIndex) => ({ text, originalIndex }));
  const mixed = shuffle(tagged);
  const correctIndex = mixed.findIndex((c) => c.originalIndex === item.correctIndex);
  return {
    ...item,
    choices: mixed.map((c) => c.text),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

export function generateQuestions(level: 1 | 2 | 3): FractionMcqChallenge[] {
  const allowed = new Set(FRACTION_BY_LEVEL[level]);
  const pool = ALL_FRACTION_BANK.filter((q) => allowed.has(q.sgkRef));
  const count = questionCount(level);
  const seen = new Set<string>();
  const picked: FractionMcqChallenge[] = [];

  if (level === 1) {
    const visualPool = FRACTION_VISUAL_BANK.filter((q) => allowed.has(q.sgkRef));
    for (const q of shuffle(visualPool)) {
      if (seen.has(q.prompt)) continue;
      seen.add(q.prompt);
      picked.push(q);
      if (picked.length >= Math.min(4, count)) break;
    }
  }

  for (const q of shuffle(pool)) {
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    picked.push(q);
    if (picked.length >= count) break;
  }
  return picked.map(withShuffledChoices);
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 35000;
  if (level === 2) return 32000;
  return 30000;
}

export function questionCount(level: 1 | 2 | 3): number {
  if (level === 1) return 8;
  if (level === 2) return 12;
  return 12;
}
