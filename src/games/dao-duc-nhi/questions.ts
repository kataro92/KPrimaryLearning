import { ETHICS_BANK, ETHICS_BY_LEVEL } from './ethicsBank';
import type { EthicsChallenge } from './challengeTypes';

export type { EthicsChallenge };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Xáo thứ tự bia đá — ngân hàng luôn ghi đáp án đúng ở vị trí 0. */
function withShuffledChoices(item: EthicsChallenge): EthicsChallenge {
  const tagged = item.choices.map((text, originalIndex) => ({ text, originalIndex }));
  const mixed = shuffle(tagged);
  const correctIndex = mixed.findIndex((c) => c.originalIndex === item.correctIndex);
  return {
    ...item,
    choices: mixed.map((c) => c.text),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

export function generateQuestions(level: 1 | 2 | 3): EthicsChallenge[] {
  const allowed = new Set(ETHICS_BY_LEVEL[level]);
  const pool = ETHICS_BANK.filter((q) => allowed.has(q.sgkRef));
  const count = level === 1 ? 8 : level === 2 ? 10 : 10;
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map(withShuffledChoices);
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 35000;
  if (level === 2) return 32000;
  return 30000;
}
