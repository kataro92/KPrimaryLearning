import { HISTORY_PASSAGES, HISTORY_STATEMENT_COUNT } from './historyBank';

export type { HistoryPassage as HistoryRound } from './historyBank';
export { HISTORY_STATEMENT_COUNT };

export interface HistoryStatement {
  text: string;
  isTrue: boolean;
  passage: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildStatementPool(): HistoryStatement[] {
  return HISTORY_PASSAGES.flatMap((round) =>
    round.statements.map((s) => ({
      text: s.text,
      isTrue: s.isTrue,
      passage: round.passage,
    }))
  );
}

const STATEMENT_POOL = buildStatementPool();

export function generateQuestions(level: 1 | 2 | 3): {
  statements: HistoryStatement[];
} {
  const count = level === 1 ? 6 : level === 2 ? 8 : 10;
  const shuffled = shuffle(STATEMENT_POOL);
  const seen = new Set<string>();
  const picked: HistoryStatement[] = [];

  for (const item of shuffled) {
    if (seen.has(item.text)) continue;
    seen.add(item.text);
    picked.push(item);
    if (picked.length >= count) break;
  }

  return { statements: picked };
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 30000;
  return 28000;
}
