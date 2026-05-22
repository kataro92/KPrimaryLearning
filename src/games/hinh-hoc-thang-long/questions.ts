export interface BuildTask {
  id: string;
  shape: 'square' | 'rect' | 'triangle';
  label: string;
  targetSlot: string;
  slots: { id: string; label: string; shape: string }[];
}

const BASE_SLOTS = [
  { id: 'slot-sq', label: 'Ô vuông', shape: 'square' },
  { id: 'slot-rect', label: 'Ô chữ nhật', shape: 'rect' },
  { id: 'slot-tri', label: 'Ô tam giác', shape: 'triangle' },
];

const TASK_BANK: Array<{ shape: BuildTask['shape']; label: string; targetSlot: string; minLevel: 1 | 2 | 3 }> = [
  { shape: 'square', label: 'Gạch vuông', targetSlot: 'slot-sq', minLevel: 1 },
  { shape: 'rect', label: 'Gạch dài', targetSlot: 'slot-rect', minLevel: 1 },
  { shape: 'triangle', label: 'Mái tam giác', targetSlot: 'slot-tri', minLevel: 1 },
  { shape: 'square', label: 'Cửa sổ vuông', targetSlot: 'slot-sq', minLevel: 1 },
  { shape: 'rect', label: 'Cổng chữ nhật', targetSlot: 'slot-rect', minLevel: 1 },
  { shape: 'triangle', label: 'Lá cờ tam giác', targetSlot: 'slot-tri', minLevel: 1 },
  { shape: 'square', label: 'Viên gạch lát sân', targetSlot: 'slot-sq', minLevel: 2 },
  { shape: 'rect', label: 'Thanh dầm chữ nhật', targetSlot: 'slot-rect', minLevel: 2 },
  { shape: 'triangle', label: 'Mái ngói tam giác', targetSlot: 'slot-tri', minLevel: 2 },
  { shape: 'square', label: 'Khung tranh vuông', targetSlot: 'slot-sq', minLevel: 2 },
  { shape: 'rect', label: 'Tấm biển chữ nhật', targetSlot: 'slot-rect', minLevel: 2 },
  { shape: 'triangle', label: 'Nêm góc tam giác', targetSlot: 'slot-tri', minLevel: 2 },
  { shape: 'square', label: 'Ô bàn cờ', targetSlot: 'slot-sq', minLevel: 3 },
  { shape: 'rect', label: 'Mặt bàn chữ nhật', targetSlot: 'slot-rect', minLevel: 3 },
  { shape: 'triangle', label: 'Khung mái tam giác', targetSlot: 'slot-tri', minLevel: 3 },
  { shape: 'square', label: 'Gạch hoa vuông', targetSlot: 'slot-sq', minLevel: 3 },
  { shape: 'rect', label: 'Viên gạch ống', targetSlot: 'slot-rect', minLevel: 3 },
  { shape: 'triangle', label: 'Cánh buồm tam giác', targetSlot: 'slot-tri', minLevel: 3 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateTasks(level: 1 | 2 | 3): BuildTask[] {
  const count = level === 2 ? 6 : 8;
  const pool = TASK_BANK.filter((t) => t.minLevel <= level);
  return shuffle(pool)
    .slice(0, count)
    .map((t, idx) => ({
      id: `t${idx + 1}`,
      shape: t.shape,
      label: t.label,
      targetSlot: t.targetSlot,
      slots: BASE_SLOTS,
    }));
}

export function timePerTaskMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 25000;
  return 22000;
}
