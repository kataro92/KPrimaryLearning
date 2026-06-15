import type { CoinFace, CoinFlipAsk, CoinFlipChallenge } from './challengeTypes';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Sinh lượt tung xu tương tác cho cấp 2–3 */
export function generateCoinFlipRounds(level: 2 | 3, count: number): CoinFlipChallenge[] {
  const asks: CoinFlipAsk[] = ['count-s', 'count-n', 'which-more'];
  const flipRange = level === 2 ? [6, 8] : [8, 10];
  const rounds: CoinFlipChallenge[] = [];
  for (let i = 0; i < count; i++) {
    const flipCount = randInt(flipRange[0], flipRange[1]);
    const ask = asks[i % asks.length];
    rounds.push({
      kind: 'coin-flip',
      flipCount,
      ask,
      sgkRef: 'toan-tk-dem-su-kien',
      instruction: `Tung đồng xu ${flipCount} lần — bấm «Tung xu!» rồi đếm mặt S (Sao) và N (Ngửa).`,
    });
  }
  return shuffle(rounds);
}

export function rollOutcomes(flipCount: number): CoinFace[] {
  const out: CoinFace[] = [];
  for (let i = 0; i < flipCount; i++) {
    out.push(Math.random() < 0.5 ? 'S' : 'N');
  }
  return out;
}

export function buildCoinFlipAnswer(
  outcomes: CoinFace[],
  ask: CoinFlipAsk
): { prompt: string; choices: string[]; correctIndex: number } {
  const countS = outcomes.filter((f) => f === 'S').length;
  const countN = outcomes.length - countS;

  if (ask === 'count-s') {
    const answer = countS;
    const pool = new Set<number>([answer]);
    while (pool.size < 4) {
      const w = answer + randInt(-2, 2);
      if (w >= 0 && w <= outcomes.length && w !== answer) pool.add(w);
    }
    const nums = shuffle([answer, ...Array.from(pool).filter((n) => n !== answer).slice(0, 3)]);
    const choices = nums.map(String);
    return {
      prompt: `Bạn đã tung ${outcomes.length} lần. Mặt S (Sao) xuất hiện mấy lần?`,
      choices,
      correctIndex: choices.indexOf(String(answer)),
    };
  }

  if (ask === 'count-n') {
    const answer = countN;
    const pool = new Set<number>([answer]);
    while (pool.size < 4) {
      const w = answer + randInt(-2, 2);
      if (w >= 0 && w <= outcomes.length && w !== answer) pool.add(w);
    }
    const nums = shuffle([answer, ...Array.from(pool).filter((n) => n !== answer).slice(0, 3)]);
    const choices = nums.map(String);
    return {
      prompt: `Bạn đã tung ${outcomes.length} lần. Mặt N (Ngửa) xuất hiện mấy lần?`,
      choices,
      correctIndex: choices.indexOf(String(answer)),
    };
  }

  const choices = ['Mặt S (Sao)', 'Mặt N (Ngửa)', 'Bằng nhau'];
  let correctIndex = 2;
  if (countS > countN) correctIndex = 0;
  else if (countN > countS) correctIndex = 1;
  return {
    prompt: `Sau ${outcomes.length} lần tung: S = ${countS}, N = ${countN}. Mặt nào xuất hiện nhiều hơn?`,
    choices,
    correctIndex,
  };
}

export function coinFlipTimeMs(level: 2 | 3, flipCount: number): number {
  const base = level === 2 ? 34000 : 32000;
  return base + flipCount * 2500;
}
