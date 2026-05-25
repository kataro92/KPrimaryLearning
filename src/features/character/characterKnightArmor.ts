import * as THREE from 'three';
import { buildFlagPlane, buildGoldStarMesh, VN_GOLD, VN_RED } from './characterKnightFlags';

export function part(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function std(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
    metalness: 0.05,
    ...opts,
  });
}

export function metal(color: number, emissive = 0x000000, emissiveIntensity = 0): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.82,
    emissive,
    emissiveIntensity,
  });
}

/** Khiên tròn: viền + mặt cờ VN + sao nổi. */
export function addRoundShield(
  group: THREE.Group,
  x: number,
  y: number,
  z: number,
  radius: number,
  rimMat: THREE.Material,
  depth = 0.07
): void {
  const rim = part(new THREE.CylinderGeometry(radius, radius, depth, 28), rimMat, x, y, z);
  rim.rotation.y = Math.PI / 2;
  const face = buildFlagPlane(radius * 1.65, radius * 1.1);
  face.position.set(x + depth * 0.55, y, z + 0.02);
  face.rotation.y = Math.PI / 2;
  const star = buildGoldStarMesh(radius * 0.22, 0.035);
  star.position.set(x + depth * 0.7, y, z + 0.05);
  star.rotation.y = Math.PI / 2;
  group.add(rim, face, star);
}

/** Khiên kite — giáp thép/danh dự. */
export function addKiteShield(
  group: THREE.Group,
  x: number,
  y: number,
  z: number,
  rimMat: THREE.Material,
  scale = 1
): void {
  const w = 0.52 * scale;
  const h = 0.68 * scale;
  const rim = part(new THREE.BoxGeometry(0.09, h, w), rimMat, x, y, z);
  rim.rotation.y = Math.PI / 2;
  const top = part(new THREE.CylinderGeometry(w * 0.48, w * 0.48, 0.09, 20), rimMat, x, y + h * 0.46, z);
  top.rotation.z = Math.PI / 2;
  top.rotation.y = Math.PI / 2;
  const face = buildFlagPlane(w * 0.88, h * 0.82);
  face.position.set(x + 0.05, y, z + 0.03);
  face.rotation.y = Math.PI / 2;
  const star = buildGoldStarMesh(0.1 * scale, 0.03);
  star.position.set(x + 0.07, y + h * 0.06, z + 0.05);
  star.rotation.y = Math.PI / 2;
  group.add(rim, top, face, star);
}

export function addPauldrons(
  group: THREE.Group,
  mat: THREE.Material,
  trimMat: THREE.Material,
  y: number,
  spread = 0.48
): void {
  for (const side of [-1, 1] as const) {
    const main = part(new THREE.SphereGeometry(0.2, 16, 14), mat, side * spread, y, 0);
    main.scale.set(1.2, 0.9, 1);
    const upper = part(new THREE.BoxGeometry(0.14, 0.12, 0.22), trimMat, side * (spread + 0.04), y + 0.14, -0.04);
    const lower = part(new THREE.BoxGeometry(0.16, 0.1, 0.18), mat, side * spread, y - 0.12, 0.02);
    group.add(main, upper, lower);
  }
}

export function addBracers(group: THREE.Group, mat: THREE.Material, trim: THREE.Material): void {
  for (const side of [-1, 1] as const) {
    const bracer = part(new THREE.CylinderGeometry(0.09, 0.1, 0.22, 12), mat, side * 0.44, 0.88, 0.06, 0, 0, side * 0.35);
    const knuckle = part(new THREE.BoxGeometry(0.12, 0.08, 0.1), trim, side * 0.5, 0.78, 0.1, 0, 0, side * 0.35);
    group.add(bracer, knuckle);
  }
}

export function addGreaves(group: THREE.Group, mat: THREE.Material, trim: THREE.Material): void {
  for (const side of [-1, 1] as const) {
    const shin = part(new THREE.BoxGeometry(0.14, 0.32, 0.16), mat, side * 0.16, 0.28, 0.06);
    const knee = part(new THREE.SphereGeometry(0.1, 12, 10), trim, side * 0.16, 0.46, 0.08);
    knee.scale.set(1.1, 0.75, 0.9);
    group.add(shin, knee);
  }
}

export function addFauldPlates(group: THREE.Group, mat: THREE.Material, count: number, y: number): void {
  for (let i = 0; i < count; i++) {
    const plate = part(
      new THREE.BoxGeometry(0.62 - i * 0.04, 0.09, 0.28),
      mat,
      0,
      y - i * 0.1,
      0.06 + i * 0.02
    );
    plate.rotation.x = 0.08 + i * 0.04;
    group.add(plate);
  }
}

export function addChestPlateLayers(
  group: THREE.Group,
  bodyMat: THREE.Material,
  trimMat: THREE.Material,
  accentMat: THREE.Material,
  y: number
): void {
  const chest = part(new THREE.BoxGeometry(0.74, 0.62, 0.4), bodyMat, 0, y, 0);
  const ridge = part(new THREE.BoxGeometry(0.12, 0.5, 0.42), trimMat, 0, y, 0.02);
  const collarL = part(new THREE.BoxGeometry(0.18, 0.14, 0.36), bodyMat, -0.28, y + 0.34, 0);
  const collarR = part(new THREE.BoxGeometry(0.18, 0.14, 0.36), bodyMat, 0.28, y + 0.34, 0);
  const beltPlate = part(new THREE.BoxGeometry(0.78, 0.1, 0.42), accentMat, 0, y - 0.32, 0);
  group.add(chest, ridge, collarL, collarR, beltPlate);
}

/** Huy hiệu cờ nhỏ trên ngực. */
export function addChestFlagBadge(group: THREE.Group, y: number, z: number, scale = 1): void {
  const badge = buildFlagPlane(0.22 * scale, 0.15 * scale);
  badge.position.set(0, y, z);
  const rim = part(
    new THREE.TorusGeometry(0.14 * scale, 0.018, 8, 24),
    metal(VN_GOLD, VN_GOLD, 0.2),
    0,
    y,
    z - 0.01
  );
  group.add(badge, rim);
}

/** Viền đỏ-vàng trên giáp (sọc men). */
export function addEnamelStripes(group: THREE.Group, y: number, bodyZ: number): void {
  const red = std(VN_RED, { roughness: 0.5, metalness: 0.15 });
  const gold = std(VN_GOLD, { emissive: VN_GOLD, emissiveIntensity: 0.15, roughness: 0.4 });
  for (const side of [-1, 1] as const) {
    group.add(part(new THREE.BoxGeometry(0.05, 0.45, 0.42), red, side * 0.36, y, bodyZ));
    group.add(part(new THREE.BoxGeometry(0.05, 0.45, 0.42), gold, side * 0.31, y, bodyZ + 0.01));
  }
}

export function buildDetailedSword(
  group: THREE.Group,
  bladeMat: THREE.Material,
  hiltMat: THREE.Material,
  gemMat: THREE.Material,
  x: number,
  y: number,
  z: number,
  rz: number
): void {
  const blade = part(new THREE.BoxGeometry(0.06, 0.88, 0.1), bladeMat, x, y, z, 0, 0, rz);
  const tip = part(new THREE.ConeGeometry(0.05, 0.14, 4), bladeMat, x, y + 0.48, z, 0, 0, rz);
  const guard = part(new THREE.BoxGeometry(0.22, 0.05, 0.12), hiltMat, x, y - 0.32, z, 0, 0, rz);
  const grip = part(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 10), hiltMat, x, y - 0.44, z, 0, 0, rz);
  const pommel = part(new THREE.SphereGeometry(0.06, 12, 10), gemMat, x, y - 0.56, z);
  group.add(blade, tip, guard, grip, pommel);
}

/** Áo choàng tím — viền vàng/đỏ (màu cờ). */
export function addHonorCape(group: THREE.Group): THREE.Mesh {
  const capeGeo = new THREE.PlaneGeometry(1.32, 1.52, 16, 14);
  const capeMat = std(0x7c3aed, { roughness: 0.55, side: THREE.DoubleSide });
  const cape = part(capeGeo, capeMat, 0, 1.14, -0.26);
  cape.name = 'knight-cape';
  cape.rotation.x = 0.14;

  const goldTrim = part(new THREE.PlaneGeometry(1.36, 0.14, 1, 1), std(VN_GOLD, { side: THREE.DoubleSide }), 0, 1.84, -0.2);
  goldTrim.rotation.x = 0.14;
  const redTrim = part(new THREE.PlaneGeometry(1.34, 0.06, 1, 1), std(VN_RED, { side: THREE.DoubleSide }), 0, 1.78, -0.19);
  redTrim.rotation.x = 0.14;

  group.add(goldTrim, redTrim);
  return cape;
}

export function addHelmetHonor(group: THREE.Group, steel: THREE.Material, plumeMat: THREE.Material): void {
  const bowl = part(new THREE.SphereGeometry(0.3, 20, 16), steel, 0, 1.78, -0.02);
  bowl.scale.set(1.05, 0.65, 1);
  const brim = part(new THREE.TorusGeometry(0.3, 0.04, 8, 24), steel, 0, 1.68, 0.04);
  brim.rotation.x = Math.PI / 2;
  const cheekL = part(new THREE.BoxGeometry(0.08, 0.18, 0.14), steel, -0.2, 1.62, 0.12);
  const cheekR = part(new THREE.BoxGeometry(0.08, 0.18, 0.14), steel, 0.2, 1.62, 0.12);
  const plume = part(new THREE.ConeGeometry(0.1, 0.36, 8), plumeMat, 0, 2.02, -0.02);
  const starPin = buildGoldStarMesh(0.06, 0.02);
  starPin.position.set(0, 1.88, 0.14);
  group.add(bowl, brim, cheekL, cheekR, plume, starPin);
}
