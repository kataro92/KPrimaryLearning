/** Shared normalized layout — lưới A–O × 1–13 (screenGridLayout). */

import { SCREEN_GRID, STRIKER_ANCHOR, DEFENDER_ANCHOR, GK_ANCHOR } from './screenGridLayout';

/** Đường ranh khán đài / sân (đáy hàng 7). */
export const HORIZON_Y = SCREEN_GRID.pitch.nyMin;

/** Vùng sân cỏ A8:O13 trong không gian chuẩn hoá. */
export const PITCH_NY_TOP = SCREEN_GRID.pitch.nyMin;
export const PITCH_NY_BOTTOM = SCREEN_GRID.pitch.nyMax;
export const PITCH_NY_CENTER = (PITCH_NY_TOP + PITCH_NY_BOTTOM) / 2;

export const STANDS_NY_CENTER = (SCREEN_GRID.stands.nyMin + SCREEN_GRID.stands.nyMax) / 2;

export const STRIKER_BASE = { x: STRIKER_ANCHOR.nx, y: STRIKER_ANCHOR.ny };
export const BALL_BASE = {
  x: STRIKER_BASE.x + 0.035,
  y: STRIKER_BASE.y + 0.022,
};
export const DEFENDER_BASE = { x: DEFENDER_ANCHOR.nx, y: DEFENDER_ANCHOR.ny };
export const GK_BASE = { x: GK_ANCHOR.nx - 0.025, y: GK_ANCHOR.ny - 0.015 };

export const GOAL_RECT = SCREEN_GRID.goal;

/** Nâng khung thành 3D (world Y) — bóng ghi bàn vào giữa lưới, không dính xà ngang. */
export const GOAL_VERTICAL_LIFT = 0.22;

/** Chiều cao khung thành so với ô lưới N10:O11 (1 = đúng ô). */
export const GOAL_HEIGHT_SCALE = 1.12;

export const DRIBBLE_OFFSET = BALL_BASE.x - STRIKER_BASE.x;

export const PARALLAX = {
  bgFar: 0.15,
  bgMid: 0.35,
  playfield: 1,
  fgProps: 1.08,
} as const;

export const WC_MODEL_BASE = `${import.meta.env.BASE_URL}models/world-cup-2026/`;

export { SCREEN_GRID } from './screenGridLayout';
