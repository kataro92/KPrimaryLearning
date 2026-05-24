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
    const type = randInt(0, 3);
    if (type === 0) {
      const a = randInt(10, 99);
      const b = randInt(10, 99);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    if (type === 1) {
      const a = randInt(30, 150);
      const b = randInt(10, 29);
      return { text: `${a} - ${b}`, answer: a - b };
    }
    if (type === 2) {
      const half = randInt(5, 30);
      return { text: `1/2 của ${half * 2}`, answer: half };
    }
    const side = randInt(3, 15);
    return { text: `Chu vi hình vuông cạnh ${side}cm`, answer: side * 4 };
  }
  if (level === 2) {
    const op = randInt(0, 4);
    if (op === 0) {
      const a = randInt(2, 12);
      const b = randInt(2, 9);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    if (op === 1) {
      const b = randInt(2, 9);
      const ans = randInt(2, 9);
      const a = b * ans;
      return { text: `${a} : ${b}`, answer: ans };
    }
    if (op === 2) {
      const length = randInt(6, 20);
      const width = randInt(4, 12);
      return { text: `Chu vi HCN dài ${length}, rộng ${width}`, answer: (length + width) * 2 };
    }
    if (op === 3) {
      const bags = randInt(3, 9);
      const each = randInt(5, 15);
      return { text: `${bags} túi, mỗi túi ${each} viên bi`, answer: bags * each };
    }
    const total = randInt(40, 120);
    const give = randInt(8, 25);
    return { text: `${total} - ${give}`, answer: total - give };
  }
  const type = randInt(0, 5);
  if (type === 0) {
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    const c = randInt(1, 9);
    return { text: `${a} × ${b} + ${c}`, answer: a * b + c };
  }
  if (type === 1) {
    const a = randInt(3, 9);
    const b = randInt(2, 8);
    const c = randInt(1, 5);
    return { text: `${a} × (${b} + ${c})`, answer: a * (b + c) };
  }
  if (type === 2) {
    const each = randInt(5, 15);
    const ans = randInt(4, 12);
    const total = each * ans;
    return { text: `${total} : ${each}`, answer: ans };
  }
  if (type === 3) {
    const n = randInt(5, 20);
    return { text: `1/4 của ${n * 4}`, answer: n };
  }
  if (type === 4) {
    const d = randInt(8, 20);
    const r = randInt(5, 12);
    return { text: `Diện tích HCN ${d}×${r}`, answer: d * r };
  }
  const p = randInt(200, 900);
  const q = randInt(10, 99);
  return { text: `${p} + ${q}`, answer: p + q };
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 10000;
  return 8000;
}

export function questionCount(level: 1 | 2 | 3): number {
  if (level === 1) return 10;
  if (level === 2) return 12;
  return 15;
}
