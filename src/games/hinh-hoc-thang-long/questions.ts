import { OBJECT_BANK, type ObjectItem, type ObjectShape } from './objectBank';

export type { ObjectShape };

export interface ShapeChoice {
  id: string;
  shape: ObjectShape;
  label: string;
}

export interface ShapeTask {
  id: string;
  objectId: string;
  label: string;
  shape: ObjectShape;
  choices: ShapeChoice[];
  correctChoiceId: string;
}

const CHOICE_DEFS: Array<{ shape: ObjectShape; label: string }> = [
  { shape: 'square', label: 'Hình vuông' },
  { shape: 'rect', label: 'Hình chữ nhật' },
  { shape: 'triangle', label: 'Hình tam giác' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoicesForShape(correctShape: ObjectShape): { choices: ShapeChoice[]; correctChoiceId: string } {
  const choices = shuffle(CHOICE_DEFS).map((c) => ({
    id: `choice-${c.shape}`,
    shape: c.shape,
    label: c.label,
  }));
  return { choices, correctChoiceId: `choice-${correctShape}` };
}

function toTask(item: ObjectItem, idx: number): ShapeTask {
  const { choices, correctChoiceId } = buildChoicesForShape(item.shape);
  return {
    id: `t${idx + 1}`,
    objectId: item.id,
    label: item.label,
    shape: item.shape,
    choices,
    correctChoiceId,
  };
}

export function taskCount(level: 1 | 2 | 3): number {
  if (level === 1) return 10;
  if (level === 2) return 12;
  return 14;
}

export function generateTasks(level: 1 | 2 | 3): ShapeTask[] {
  const count = taskCount(level);
  const pool = OBJECT_BANK.filter((o) => o.minLevel <= level);
  const picked = shuffle(pool).slice(0, count);
  return picked.map((item, idx) => toTask(item, idx));
}

export function timePerTaskMs(level: 1 | 2 | 3): number {
  if (level === 1) return 28000;
  if (level === 2) return 24000;
  return 22000;
}
