/**
 * Lưới màn hình 15 cột (A–O) × 13 dòng (1–13).
 * nx/ny chuẩn hoá: nx ∈ [0,1] trái→phải, ny ∈ [0,1] trên→dưới.
 */

export const GRID_COLS = 15;
export const GRID_ROWS = 13;

export interface GridRect {
  nxMin: number;
  nxMax: number;
  nyMin: number;
  nyMax: number;
}

export interface GridPoint {
  nx: number;
  ny: number;
}

function colIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
}

/** Vùng lưới inclusive (vd. B2:N6). */
export function gridRect(colStart: string, rowStart: number, colEnd: string, rowEnd: number): GridRect {
  const c0 = colIndex(colStart);
  const c1 = colIndex(colEnd);
  const r0 = Math.min(rowStart, rowEnd);
  const r1 = Math.max(rowStart, rowEnd);
  return {
    nxMin: (Math.min(c0, c1) - 1) / GRID_COLS,
    nxMax: Math.max(c0, c1) / GRID_COLS,
    nyMin: (r0 - 1) / GRID_ROWS,
    nyMax: r1 / GRID_ROWS,
  };
}

export function gridCenter(colStart: string, rowStart: number, colEnd: string, rowEnd: number): GridPoint {
  const r = gridRect(colStart, rowStart, colEnd, rowEnd);
  return { nx: (r.nxMin + r.nxMax) / 2, ny: (r.nyMin + r.nyMax) / 2 };
}

/** CSS grid line (1-based): cột/dòng cho grid-column / grid-row. */
export function gridCssLines(
  colStart: string,
  rowStart: number,
  colEnd: string,
  rowEnd: number
): { col: string; row: string } {
  const c0 = colIndex(colStart);
  const c1 = colIndex(colEnd);
  const r0 = Math.min(rowStart, rowEnd);
  const r1 = Math.max(rowStart, rowEnd);
  return {
    col: `${Math.min(c0, c1)} / ${Math.max(c0, c1) + 1}`,
    row: `${r0} / ${r1 + 1}`,
  };
}

/** Bố cục play theo spec người dùng. */
export const SCREEN_GRID = {
  /** Câu hỏi — lệch phải, gần hậu vệ / thủ môn (đuôi bong bóng chỉ xuống K10:L11). */
  question: gridRect('G', 2, 'N', 6),
  stands: gridRect('A', 1, 'O', 7),
  pitch: gridRect('A', 8, 'O', 13),
  answerA: gridRect('I', 8, 'J', 9),
  answerB: gridRect('H', 10, 'I', 11),
  answerC: gridRect('I', 12, 'J', 13),
  striker: gridRect('C', 10, 'D', 11),
  defender: gridRect('K', 10, 'L', 11),
  goal: gridRect('N', 10, 'O', 11),
  hud: gridRect('A', 1, 'O', 1),
  feedback: gridRect('B', 7, 'N', 7),
} as const;

export const STRIKER_ANCHOR = gridCenter('C', 10, 'D', 11);
export const DEFENDER_ANCHOR = gridCenter('K', 10, 'L', 11);
export const GK_ANCHOR = gridCenter('K', 10, 'L', 11);
export const GOAL_ANCHOR = gridCenter('N', 10, 'O', 11);
