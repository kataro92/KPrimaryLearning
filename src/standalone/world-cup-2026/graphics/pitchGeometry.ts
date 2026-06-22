/**
 * Sân bóng chuẩn FIFA trên mặt phẳng Oxy (đơn vị mét).
 * Gốc O(0,0) tại chấm giữa sân; Ox dọc chiều dài; Oy dọc đường giữa.
 * Ánh xạ sang tọa độ chuẩn hoá game (side-view 2.5D): Ox → nx ngang, Oy → ny dọc.
 */

import * as THREE from 'three';
import { getLineMaterial } from './MaterialLibrary';
import { PITCH_NY_BOTTOM, PITCH_NY_TOP, SCREEN_GRID } from './sceneConstants';

/** Z offset vạch trong group markings (relative to markings layer). */
const PITCH_MARKINGS_LOCAL_Z = 0.012;

/** Nửa chiều dài / rộng sân (m). */
export const PITCH = {
  HALF_LENGTH: 52.5,
  HALF_WIDTH: 34,
  CENTER_R: 9.15,
  PENALTY_DEPTH: 16.5,
  PENALTY_HALF_WIDTH: 20.16,
  GOAL_AREA_DEPTH: 5.5,
  GOAL_AREA_HALF_WIDTH: 9.16,
  PENALTY_SPOT_X: 41.5,
  PENALTY_LINE_X: 36,
  GOAL_AREA_LINE_X: 47,
  CORNER_R: 1,
  GOAL_POST_Y: 3.66,
  LINE_WIDTH_M: 0.12,
} as const;

const NX_MIN = SCREEN_GRID.pitch.nxMin;
const NX_MAX = SCREEN_GRID.pitch.nxMax;
const NY_TOP = PITCH_NY_TOP;
const NY_BOTTOM = PITCH_NY_BOTTOM;

export type NormToWorld = (nx: number, ny: number) => THREE.Vector3;

/** FIFA (m) → chuẩn hoá game [0,1]. */
export function fifaToNorm(fifaX: number, fifaY: number): { nx: number; ny: number } {
  const nx = NX_MIN + ((fifaX + PITCH.HALF_LENGTH) / (PITCH.HALF_LENGTH * 2)) * (NX_MAX - NX_MIN);
  const ny = NY_TOP + ((PITCH.HALF_WIDTH - fifaY) / (PITCH.HALF_WIDTH * 2)) * (NY_BOTTOM - NY_TOP);
  return { nx, ny };
}

export function fifaToWorld(fifaX: number, fifaY: number, normToWorld: NormToWorld): THREE.Vector3 {
  const { nx, ny } = fifaToNorm(fifaX, fifaY);
  return normToWorld(nx, ny);
}

function lineWidthWorld(normToWorld: NormToWorld): number {
  const a = fifaToWorld(0, 0, normToWorld);
  const b = fifaToWorld(0, PITCH.LINE_WIDTH_M, normToWorld);
  return Math.max(0.018, a.distanceTo(b));
}

function addSegment(
  group: THREE.Group,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  width: number,
  mat: THREE.MeshStandardMaterial,
  z = PITCH_MARKINGS_LOCAL_Z
): void {
  const len = p1.distanceTo(p2);
  if (len < 1e-6) return;
  const mid = p1.clone().add(p2).multiplyScalar(0.5);
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(len, width), mat.clone());
  mesh.position.set(mid.x, mid.y, z);
  mesh.rotation.z = angle;
  group.add(mesh);
}

function addFifaSegment(
  group: THREE.Group,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  normToWorld: NormToWorld,
  mat: THREE.MeshStandardMaterial,
  width: number
): void {
  addSegment(group, fifaToWorld(x1, y1, normToWorld), fifaToWorld(x2, y2, normToWorld), width, mat);
}

function addFifaRect(
  group: THREE.Group,
  xNear: number,
  xFar: number,
  yTop: number,
  yBottom: number,
  normToWorld: NormToWorld,
  mat: THREE.MeshStandardMaterial,
  width: number
): void {
  addFifaSegment(group, xNear, yTop, xFar, yTop, normToWorld, mat, width);
  addFifaSegment(group, xNear, yBottom, xFar, yBottom, normToWorld, mat, width);
  addFifaSegment(group, xNear, yTop, xNear, yBottom, normToWorld, mat, width);
  addFifaSegment(group, xFar, yTop, xFar, yBottom, normToWorld, mat, width);
}

function addFullCircle(
  group: THREE.Group,
  cx: number,
  cy: number,
  r: number,
  normToWorld: NormToWorld,
  mat: THREE.MeshStandardMaterial,
  width: number
): void {
  const segments = 64;
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;
    addFifaSegment(
      group,
      cx + r * Math.cos(a1),
      cy + r * Math.sin(a1),
      cx + r * Math.cos(a2),
      cy + r * Math.sin(a2),
      normToWorld,
      mat,
      width * 0.85
    );
  }
}

function addPenaltyArc(
  group: THREE.Group,
  side: 'left' | 'right',
  normToWorld: NormToWorld,
  mat: THREE.MeshStandardMaterial,
  width: number
): void {
  const cx = side === 'right' ? PITCH.PENALTY_SPOT_X : -PITCH.PENALTY_SPOT_X;
  const cutoff = side === 'right' ? PITCH.PENALTY_LINE_X : -PITCH.PENALTY_LINE_X;
  const r = PITCH.CENTER_R;
  const dx = cutoff - cx;
  const dy = Math.sqrt(Math.max(0, r * r - dx * dx));
  const aTop = Math.atan2(dy, dx);
  const aBot = Math.atan2(-dy, dx);
  const steps = 40;

  if (side === 'right') {
    const span = Math.PI - aTop + (Math.PI + aBot);
    for (let i = 0; i < steps; i++) {
      const t1 = i / steps;
      const t2 = (i + 1) / steps;
      const ang1 = aTop + span * t1;
      const ang2 = aTop + span * t2;
      const x1 = cx + r * Math.cos(ang1);
      const x2 = cx + r * Math.cos(ang2);
      if (x1 > cutoff + 0.01 || x2 > cutoff + 0.01) continue;
      addFifaSegment(group, x1, r * Math.sin(ang1), x2, r * Math.sin(ang2), normToWorld, mat, width * 0.85);
    }
    return;
  }

  const span = aTop - aBot;
  for (let i = 0; i < steps; i++) {
    const t1 = i / steps;
    const t2 = (i + 1) / steps;
    const ang1 = aBot + span * t1;
    const ang2 = aBot + span * t2;
    const x1 = cx + r * Math.cos(ang1);
    const x2 = cx + r * Math.cos(ang2);
    if (x1 < cutoff - 0.01 || x2 < cutoff - 0.01) continue;
    addFifaSegment(group, x1, r * Math.sin(ang1), x2, r * Math.sin(ang2), normToWorld, mat, width * 0.85);
  }
}

function addCornerArc(
  group: THREE.Group,
  cx: number,
  cy: number,
  angleFrom: number,
  angleTo: number,
  normToWorld: NormToWorld,
  mat: THREE.MeshStandardMaterial,
  width: number
): void {
  const segments = 12;
  for (let i = 0; i < segments; i++) {
    const t1 = i / segments;
    const t2 = (i + 1) / segments;
    const a1 = angleFrom + (angleTo - angleFrom) * t1;
    const a2 = angleFrom + (angleTo - angleFrom) * t2;
    addFifaSegment(
      group,
      cx + PITCH.CORNER_R * Math.cos(a1),
      cy + PITCH.CORNER_R * Math.sin(a1),
      cx + PITCH.CORNER_R * Math.cos(a2),
      cy + PITCH.CORNER_R * Math.sin(a2),
      normToWorld,
      mat,
      width * 0.9
    );
  }
}

/** Vẽ toàn bộ vạch sân theo mô tả tọa độ Oxy. */
export function buildRegulationPitchMarkings(group: THREE.Group, normToWorld: NormToWorld): void {
  const mat = getLineMaterial();
  const lw = lineWidthWorld(normToWorld);
  const L = PITCH.HALF_LENGTH;
  const W = PITCH.HALF_WIDTH;

  // 1. Khung viền ABCD
  addFifaRect(group, -L, L, W, -W, normToWorld, mat, lw);

  // 2. Đường giữa sân (Oy)
  addFifaSegment(group, 0, W, 0, -W, normToWorld, mat, lw);

  // 3. Vòng tròn giữa sân x² + y² = 9.15²
  addFullCircle(group, 0, 0, PITCH.CENTER_R, normToWorld, mat, lw);

  // Chấm giữa sân O(0,0)
  const spot = new THREE.Mesh(
    new THREE.CircleGeometry(lw * 0.55, 16),
    mat.clone()
  );
  const center = fifaToWorld(0, 0, normToWorld);
  spot.position.set(center.x, center.y, PITCH_MARKINGS_LOCAL_Z + 0.002);
  group.add(spot);

  // 4–5. Vòng cấm lớn & cầu môn (phải + trái)
  for (const sign of [1, -1] as const) {
    const xGoal = sign * L;
    const xPen = sign * PITCH.PENALTY_LINE_X;
    const xGoalArea = sign * PITCH.GOAL_AREA_LINE_X;
    const xNear = Math.min(xGoal, xPen);
    const xFar = Math.max(xGoal, xPen);
    addFifaRect(group, xNear, xFar, PITCH.PENALTY_HALF_WIDTH, -PITCH.PENALTY_HALF_WIDTH, normToWorld, mat, lw);

    const xNearG = Math.min(xGoal, xGoalArea);
    const xFarG = Math.max(xGoal, xGoalArea);
    addFifaRect(group, xNearG, xFarG, PITCH.GOAL_AREA_HALF_WIDTH, -PITCH.GOAL_AREA_HALF_WIDTH, normToWorld, mat, lw);

    // Chấm phạt đền
    const penSpot = new THREE.Mesh(
      new THREE.CircleGeometry(lw * 0.5, 14),
      mat.clone()
    );
    const pp = fifaToWorld(sign * PITCH.PENALTY_SPOT_X, 0, normToWorld);
    penSpot.position.set(pp.x, pp.y, PITCH_MARKINGS_LOCAL_Z + 0.002);
    group.add(penSpot);
  }

  // 6. Vòng cung phạt đền (x < 36 / x > -36)
  addPenaltyArc(group, 'right', normToWorld, mat, lw);
  addPenaltyArc(group, 'left', normToWorld, mat, lw);

  // 7. Bốn cung phạt góc R = 1
  addCornerArc(group, L, W, Math.PI, Math.PI * 1.5, normToWorld, mat, lw);
  addCornerArc(group, L, -W, Math.PI * 0.5, Math.PI, normToWorld, mat, lw);
  addCornerArc(group, -L, W, Math.PI * 1.5, Math.PI * 2, normToWorld, mat, lw);
  addCornerArc(group, -L, -W, 0, Math.PI * 0.5, normToWorld, mat, lw);

  // Cột khung thành G1, G2 trên biên ngang
  for (const sign of [-1, 1] as const) {
    for (const gy of [PITCH.GOAL_POST_Y, -PITCH.GOAL_POST_Y]) {
      const post = new THREE.Mesh(new THREE.CircleGeometry(lw * 0.45, 10), mat.clone());
      const p = fifaToWorld(sign * L, gy, normToWorld);
      post.position.set(p.x, p.y, PITCH_MARKINGS_LOCAL_Z + 0.002);
      group.add(post);
    }
  }
}

/** @deprecated use buildRegulationPitchMarkings */
export const buildPitchMarkings = buildRegulationPitchMarkings;
