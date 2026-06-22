import type { PlayerRole } from './AssetLoader';

/** Per-role tuning for Tripo / imported GLB players. */
export interface GlbPlayerRoleConfig {
  /** Target bounding-box height in world units (matches procedural rig ~0.95). */
  height: number;
  yOffset: number;
}

export const GLB_PLAYER_CONFIG: Record<PlayerRole, GlbPlayerRoleConfig> = {
  striker: { height: 0.95, yOffset: 0 },
  defender: { height: 0.95, yOffset: 0 },
  gk: { height: 1.05, yOffset: 0 },
};

/**
 * Tripo export order (5 clips): idle, jump, run, slash, walk → NlaTrack … NlaTrack.004.
 * Same order for striker.glb and defender.glb (Studio tick order).
 * Legacy 4-clip export: idle, run, slash, walk (no jump).
 */
export const TRIPO_NLA_PLAYER_5_INDEX = {
  idle: 0,
  jump: 1,
  run: 2,
  slash: 3,
  walk: 4,
} as const;

/** @deprecated Use TRIPO_NLA_PLAYER_5_INDEX */
export const TRIPO_NLA_STRIKER_INDEX = TRIPO_NLA_PLAYER_5_INDEX;

/** @deprecated Use TRIPO_NLA_PLAYER_5_INDEX */
export const TRIPO_NLA_DEFENDER_INDEX = TRIPO_NLA_PLAYER_5_INDEX;

/** 4-clip export without jump (older striker.glb). */
export const TRIPO_NLA_STRIKER_INDEX_LEGACY = {
  idle: 0,
  run: 1,
  slash: 2,
  walk: 3,
} as const;

/** Tripo GK export order: idle, jump_down, look_around, run, walk → NlaTrack … NlaTrack.004. */
export const TRIPO_NLA_GK_INDEX = {
  idle: 0,
  jumpDown: 1,
  lookAround: 2,
  run: 3,
  walk: 4,
} as const;
