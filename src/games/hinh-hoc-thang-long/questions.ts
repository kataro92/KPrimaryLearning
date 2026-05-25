import { OBJECT_BANK, type ObjectItem } from './objectBank';
import { resolveIllustrationBuilderId } from './illustrationResolver';
import {
  CHOICE_POOL_BY_LEVEL,
  SHAPE_LABELS,
  type ObjectShape,
} from './shapeCatalog';

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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoicesForShape(correctShape: ObjectShape, level: 1 | 2 | 3): {
  choices: ShapeChoice[];
  correctChoiceId: string;
} {
  const pool = CHOICE_POOL_BY_LEVEL[level];
  const distractors = shuffle(pool.filter((s) => s !== correctShape)).slice(0, pool.length - 1);
  const picked = shuffle([correctShape, ...distractors]);
  const choices = picked.map((shape) => ({
    id: `choice-${shape}`,
    shape,
    label: SHAPE_LABELS[shape],
  }));
  return { choices, correctChoiceId: `choice-${correctShape}` };
}

function toTask(item: ObjectItem, idx: number, level: 1 | 2 | 3): ShapeTask {
  const { choices, correctChoiceId } = buildChoicesForShape(item.shape, level);
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

/** Mỗi vòng chơi: không hai câu dùng chung một tranh (builder). */
function pickItemsWithUniqueArt(pool: ObjectItem[], count: number): ObjectItem[] {
  const shuffled = shuffle(pool);
  const picked: ObjectItem[] = [];
  const usedArt = new Set<string>();

  for (const item of shuffled) {
    const art = resolveIllustrationBuilderId(item.id, item.label, item.shape);
    if (usedArt.has(art)) continue;
    usedArt.add(art);
    picked.push(item);
    if (picked.length >= count) break;
  }

  if (picked.length < count) {
    for (const item of shuffled) {
      if (picked.some((p) => p.id === item.id)) continue;
      picked.push(item);
      if (picked.length >= count) break;
    }
  }

  return picked;
}

export function generateTasks(level: 1 | 2 | 3): ShapeTask[] {
  const count = taskCount(level);
  const pool = OBJECT_BANK.filter((o) => o.minLevel <= level);
  const picked = pickItemsWithUniqueArt(pool, count);
  return picked.map((item, idx) => toTask(item, idx, level));
}

export function timePerTaskMs(level: 1 | 2 | 3): number {
  if (level === 1) return 28000;
  if (level === 2) return 26000;
  return 24000;
}
