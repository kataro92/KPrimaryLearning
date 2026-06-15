import { NUMBER_BANK, NUMBER_BY_LEVEL } from './numberBank';
import { NUMBER_BANK_EXTRA } from './numberBankExtra';
import type { NumberMcqChallenge } from './challengeTypes';

export type { NumberMcqChallenge };

const ALL_NUMBER_BANK: NumberMcqChallenge[] = [...NUMBER_BANK, ...NUMBER_BANK_EXTRA];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function withShuffledChoices(item: NumberMcqChallenge): NumberMcqChallenge {
  const tagged = item.choices.map((text, originalIndex) => ({ text, originalIndex }));
  const mixed = shuffle(tagged);
  const correctIndex = mixed.findIndex((c) => c.originalIndex === item.correctIndex);
  return {
    ...item,
    choices: mixed.map((c) => c.text),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

export function generateQuestions(level: 1 | 2 | 3): NumberMcqChallenge[] {
  const allowed = new Set(NUMBER_BY_LEVEL[level]);
  const pool = ALL_NUMBER_BANK.filter((q) => allowed.has(q.sgkRef));
  const count = questionCount(level);
  const seen = new Set<string>();
  const picked: NumberMcqChallenge[] = [];
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
  if (level === 2) return 30000;
  return 28000;
}

export function questionCount(level: 1 | 2 | 3): number {
  if (level === 1) return 8;
  if (level === 2) return 12;
  return 12;
}
