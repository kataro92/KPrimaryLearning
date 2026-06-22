import type { QuizQuestion } from './types';

/** Fisher–Yates shuffle (in-place copy). */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

/** Xáo thứ tự đáp án, giữ đúng một đáp án đúng. */
export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  const order = shuffleArray([0, 1, 2] as const);
  const options = order.map((i) => question.options[i]) as [string, string, string];
  const correctIndex = order.indexOf(question.correctIndex) as 0 | 1 | 2;
  return { ...question, options, correctIndex };
}

export function pickRandomItem<T>(items: readonly T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
}
