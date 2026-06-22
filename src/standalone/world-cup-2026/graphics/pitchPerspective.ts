/**
 * Phối cảnh sân nhìn từ khán đài: rộng ở gần (dưới), hẹp ở xa (trên).
 */

import * as THREE from 'three';
import { PITCH_NY_BOTTOM, PITCH_NY_TOP } from './sceneConstants';
import { SCREEN_GRID } from './screenGridLayout';

/** Hệ số nhân bề ngang sân so với lưới phẳng (1 = hình chữ nhật). */
export const PITCH_PERSPECTIVE = {
  widthFar: 0.62,
  widthNear: 1.06,
} as const;

/** Kích thước sân cỏ (+30% so với lưới gốc). */
export const PITCH_WORLD_SCALE = 1.3;

const PITCH_NX_CENTER = (SCREEN_GRID.pitch.nxMin + SCREEN_GRID.pitch.nxMax) / 2;

export function pitchWidthScaleAtNy(ny: number): number {
  if (ny <= PITCH_NY_TOP) return PITCH_PERSPECTIVE.widthFar;
  if (ny >= PITCH_NY_BOTTOM) return PITCH_PERSPECTIVE.widthNear;
  const t = (ny - PITCH_NY_TOP) / (PITCH_NY_BOTTOM - PITCH_NY_TOP);
  return THREE.MathUtils.lerp(PITCH_PERSPECTIVE.widthFar, PITCH_PERSPECTIVE.widthNear, t);
}

/** Thu phóng tọa độ X trong vùng sân theo độ sâu ny. */
export function applyPitchPerspectiveX(ny: number, rectX: number, viewHalfW: number): number {
  const scale = pitchWidthScaleAtNy(ny) * PITCH_WORLD_SCALE;
  const centerX = (PITCH_NX_CENTER - 0.5) * viewHalfW * 2;
  return centerX + (rectX - centerX) * scale;
}

export function pitchGrassHeightFromGrid(baseHeight: number): number {
  return baseHeight * 1.04 * PITCH_WORLD_SCALE;
}

export function pitchRectWidthFromGrid(baseWidth: number): number {
  return baseWidth * 1.05 * PITCH_WORLD_SCALE;
}

/** Mặt sân hình thang: rộng ở cạnh gần (nearY), hẹp ở cạnh xa (farY). */
export function buildTrapezoidPitchGeometry(
  widthFar: number,
  widthNear: number,
  height: number
): THREE.BufferGeometry {
  const hf = widthFar * 0.5;
  const hn = widthNear * 0.5;
  const hh = height * 0.5;

  const positions = new Float32Array([
    -hf, hh, 0,
    hf, hh, 0,
    hn, -hh, 0,
    -hn, -hh, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);
  const indices = [0, 1, 2, 0, 2, 3];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
