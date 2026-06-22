import * as THREE from 'three';
import { getFabricTexture, makeBallPanelTexture } from './ProceduralTextures';

export interface KitPalette {
  shirt: number;
  shirtHi: number;
  shorts: number;
  socks: number;
  skin: number;
  hair: number;
  boot: number;
  glove?: number;
}

const SKIN = 0xfcd9b6;
const HAIR = 0x1f2937;
const BOOT = 0x111827;
const SOCK = 0xf8fafc;

function hex(hex: string): number {
  return Number.parseInt(hex.replace('#', ''), 16);
}

export function strikerPalette(flag: [string, string, string]): KitPalette {
  const [a, b, c] = flag;
  const shirt = hex(a);
  return {
    shirt,
    shirtHi: hex(lightenHex(a)),
    shorts: hex(c),
    socks: b === '#ffffff' || b === '#ffdf00' ? hex(b) : SOCK,
    skin: SKIN,
    hair: HAIR,
    boot: BOOT,
  };
}

export function defenderPalette(flag: [string, string, string]): KitPalette {
  const [a, , c] = flag;
  return {
    shirt: hex(c),
    shirtHi: hex(lightenHex(c)),
    shorts: hex(darkenHex(a, 0.38)),
    socks: SOCK,
    skin: SKIN,
    hair: HAIR,
    boot: BOOT,
  };
}

export function gkPalette(): KitPalette {
  return {
    shirt: 0xfacc15,
    shirtHi: 0xfde047,
    shorts: 0x854d0e,
    socks: SOCK,
    skin: SKIN,
    hair: HAIR,
    boot: BOOT,
    glove: 0xf59e0b,
  };
}

function lightenHex(h: string, amount = 0.22): string {
  const n = hex(h);
  const r = Math.min(255, ((n >> 16) & 255) + 255 * amount);
  const g = Math.min(255, ((n >> 8) & 255) + 255 * amount);
  const b = Math.min(255, (n & 255) + 255 * amount);
  return `#${((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).padStart(6, '0')}`;
}

function darkenHex(h: string, amount = 0.35): string {
  const n = hex(h);
  const r = Math.max(0, ((n >> 16) & 255) * (1 - amount));
  const g = Math.max(0, ((n >> 8) & 255) * (1 - amount));
  const b = Math.max(0, (n & 255) * (1 - amount));
  return `#${((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).padStart(6, '0')}`;
}

function pickBodyColor(t: number, palette: KitPalette, isGk: boolean): THREE.Color {
  const c = new THREE.Color();
  if (t > 0.9) c.setHex(palette.hair);
  else if (t > 0.78) c.setHex(palette.skin);
  else if (t > 0.52) c.setHex(palette.shirt);
  else if (t > 0.38) c.setHex(palette.shorts);
  else if (t > 0.14) c.setHex(palette.socks);
  else c.setHex(palette.boot);

  if (isGk && palette.glove && t > 0.48 && t < 0.72) {
    c.setHex(palette.glove);
  }
  return c;
}

function applyVertexPaint(mesh: THREE.Mesh, palette: KitPalette, isGk: boolean): void {
  const geo = mesh.geometry.clone();
  mesh.geometry = geo;
  const pos = geo.getAttribute('position');
  if (!pos) return;

  geo.computeBoundingBox();
  const minY = geo.boundingBox!.min.y;
  const maxY = geo.boundingBox!.max.y;
  const range = maxY - minY || 1;

  const colors = new Float32Array(pos.count * 3);
  const hi = new THREE.Color().setHex(palette.shirtHi);

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = (y - minY) / range;
    const base = pickBodyColor(t, palette, isGk);
    if (t > 0.52 && t < 0.78) {
      base.lerp(hi, 0.12);
    }
    colors[i * 3] = base.r;
    colors[i * 3 + 1] = base.g;
    colors[i * 3 + 2] = base.b;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  mesh.material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.42,
    metalness: 0.04,
    map: getFabricTexture(),
  });
}

export function paintPlayerGlb(root: THREE.Object3D, palette: KitPalette, isGk: boolean): void {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) applyVertexPaint(child, palette, isGk);
  });
}

export function paintBallGlb(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.material = new THREE.MeshStandardMaterial({
      map: makeBallPanelTexture(),
      roughness: 0.34,
      metalness: 0.05,
    });
  });
}

export function paintGoalGlb(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.material = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.38,
      metalness: 0.28,
      side: THREE.DoubleSide,
    });
  });
}

/**
 * Side-view pitch: goal mouth in XY (width X, height Y), shallow depth along Z.
 * Tripo exports vary — rotate so the tallest opening plane faces the camera.
 */
export function orientGoalModel(model: THREE.Object3D): void {
  model.rotation.set(0, 0, 0);
  model.updateMatrixWorld(true);

  const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
  const longest =
    size.x >= size.y && size.x >= size.z ? 'x' : size.y >= size.z ? 'y' : 'z';

  if (longest === 'x') {
    model.rotation.y = Math.PI / 2;
  } else if (longest === 'y') {
    model.rotation.z = -Math.PI / 2;
  }
  model.updateMatrixWorld(true);
}

/** Scale goal GLB to match procedural goal rect; local origin at bottom-center. */
export function fitGoalToRect(model: THREE.Object3D, targetWidth: number, targetHeight: number): void {
  model.scale.set(1, 1, 1);
  model.position.set(0, 0, 0);
  orientGoalModel(model);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const scale = Math.min(
    targetHeight / Math.max(size.y, 0.001),
    targetWidth / Math.max(size.x, 0.001)
  );
  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);

  const fitted = new THREE.Box3().setFromObject(model);
  const center = fitted.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= fitted.min.y;
}

/** Side-view pitch: striker faces +X, opponents face -X. */
export function orientPlayerModel(model: THREE.Object3D, role: 'striker' | 'defender' | 'gk'): void {
  model.rotation.set(0, 0, 0);
  if (role === 'striker') {
    model.rotation.y = Math.PI * 2;
  } else if (role === 'gk') {
    model.rotation.y = Math.PI;
  } else {
    model.rotation.y = -Math.PI;
  }
}

/** GLB ball max bbox axis (≈ diameter). Procedural ball radius is 0.09 → diameter 0.18. */
export const BALL_TARGET_HEIGHT = 0.16;
