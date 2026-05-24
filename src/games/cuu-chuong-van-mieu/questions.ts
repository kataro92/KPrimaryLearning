import { MATH_BANK, type MathQuestion } from './mathBank';
import { MATH_BANK_EXTRA } from './mathBankExtra';

export type { MathQuestion };

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuestions(count: number, level: 1 | 2 | 3): MathQuestion[] {
  const qs: MathQuestion[] = [];
  const seen = new Set<string>();
  for (const q of shuffle([...MATH_BANK, ...MATH_BANK_EXTRA])) {
    if (seen.has(q.text)) continue;
    seen.add(q.text);
    qs.push(q);
    if (qs.length >= count) return qs;
  }
  let attempts = 0;
  while (qs.length < count && attempts < count * 24) {
    const q = generateOne(level);
    attempts++;
    if (seen.has(q.text)) continue;
    seen.add(q.text);
    qs.push(q);
  }
  while (qs.length < count) {
    qs.push(generateOne(level));
  }
  return qs;
}

function generateOne(level: 1 | 2 | 3): MathQuestion {
  if (level === 1) {
    const type = randInt(0, 2);
    if (type === 0) {
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    if (type === 1) {
      const b = randInt(2, 9);
      const ans = randInt(2, 9);
      return { text: `${b * ans} : ${b}`, answer: ans };
    }
    const box = randInt(2, 7);
    const each = randInt(2, 9);
    return { text: `${box} hộp, mỗi hộp ${each} bút`, answer: box * each };
  }
  if (level === 2) {
    const type = randInt(0, 3);
    if (type === 0) {
      const a = randInt(2, 12);
      const b = randInt(2, 9);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    if (type === 1) {
      const b = randInt(2, 9);
      const ans = randInt(2, 12);
      const a = b * ans;
      return { text: `${a} : ${b}`, answer: ans };
    }
    if (type === 2) {
      const a = randInt(3, 12);
      const b = randInt(2, 9);
      const c = randInt(1, 9);
      return { text: `${a} × ${b} + ${c}`, answer: a * b + c };
    }
    const packs = randInt(3, 12);
    const each = randInt(3, 9);
    const sold = randInt(2, packs - 1);
    return { text: `Có ${packs} gói, mỗi gói ${each} viên. Bán ${sold} gói còn bao nhiêu viên?`, answer: (packs - sold) * each };
  }
  const type = randInt(0, 4);
  const tables = [6, 7, 8, 9, 11, 12];
  const a = tables[randInt(0, tables.length - 1)];
  const b = randInt(2, 12);
  if (type === 0) return { text: `${a} × ${b}`, answer: a * b };
  if (type === 1) {
    const prod = a * b;
    return { text: `${prod} : ${a}`, answer: b };
  }
  if (type === 2) {
    const c = randInt(2, 9);
    return { text: `${a} × ${b} - ${c}`, answer: a * b - c };
  }
  if (type === 3) {
    const d = randInt(2, 9);
    const total = a * b + d;
    return { text: `${a} × ${b} + ${d}`, answer: total };
  }
  const teams = randInt(4, 9);
  const each = randInt(6, 12);
  return { text: `${teams} đội, mỗi đội ${each} bạn`, answer: teams * each };
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 12000;
  return 10000;
}

export function questionCount(level: 1 | 2 | 3): number {
  return level === 1 ? 12 : 15;
}
