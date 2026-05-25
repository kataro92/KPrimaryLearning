/** Hình phẳng trong chương Hình học Toán lớp 4 (KNTT / CTST). */
export type ObjectShape =
  | 'square'
  | 'rect'
  | 'triangle'
  | 'parallelogram'
  | 'rhombus'
  | 'trapezoid'
  | 'circle';

export const SHAPE_LABELS: Record<ObjectShape, string> = {
  square: 'Hình vuông',
  rect: 'Hình chữ nhật',
  triangle: 'Hình tam giác',
  parallelogram: 'Hình bình hành',
  rhombus: 'Hình thoi',
  trapezoid: 'Hình thang',
  circle: 'Hình tròn',
};

/** Bậc 1: 3 hình nền; bậc 2 thêm bình hành; bậc 3 đủ 7 hình lớp 4. */
export const CHOICE_POOL_BY_LEVEL: Record<1 | 2 | 3, ObjectShape[]> = {
  1: ['square', 'rect', 'triangle'],
  2: ['square', 'rect', 'triangle', 'parallelogram'],
  3: ['square', 'rect', 'triangle', 'parallelogram', 'rhombus', 'trapezoid', 'circle'],
};

export function choiceCountForLevel(level: 1 | 2 | 3): number {
  return CHOICE_POOL_BY_LEVEL[level].length;
}

export function shapesIntroForLevel(level: 1 | 2 | 3): string {
  if (level === 1) return 'hình vuông, hình chữ nhật hay hình tam giác';
  if (level === 2) return 'hình vuông, chữ nhật, tam giác hay bình hành';
  return 'một trong bảy dạng hình: vuông, chữ nhật, tam giác, bình hành, thoi, thang hoặc tròn';
}
