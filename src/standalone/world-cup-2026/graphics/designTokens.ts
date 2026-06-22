/**
 * World Cup 2026 — Design tokens (see docs/design/WORLD_CUP_2026_GAME_UI_STYLE_GUIDE.md).
 */

export const WC_COLORS = {
  pitchGreen: '#22C55E',
  deepPitch: '#15803D',
  energyYellow: '#FACC15',
  energyOrange: '#FB923C',
  worldBlue: '#0EA5E9',
  accentPurple: '#A855F7',
  goalRed: '#EF4444',
  cleanWhite: '#FFFFFF',
  inkNavy: '#1E293B',
  panelFill: 'rgba(255,255,255,0.94)',
  panelShadow: 'rgba(15,23,42,0.22)',
  skyDeep: '#0C4A6E',
} as const;

export const WC_ANSWER_RIM = [WC_COLORS.worldBlue, WC_COLORS.accentPurple, WC_COLORS.pitchGreen] as const;

export const WC_FONTS = {
  heading: 'Nunito, sans-serif',
  body: '"DM Sans", sans-serif',
} as const;

export const WC_MOTION = {
  popOvershoot: 1.08,
  popSettle: 1.0,
  popSpeed: 14,
  fadeAlpha: 0.12,
  disabledAlpha: 0.5,
} as const;
