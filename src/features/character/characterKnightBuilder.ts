import * as THREE from 'three';
import {
  addBracers,
  addChestFlagBadge,
  addChestPlateLayers,
  addEnamelStripes,
  addFauldPlates,
  addGreaves,
  addHelmetHonor,
  addHonorCape,
  addKiteShield,
  addPauldrons,
  addRoundShield,
  buildDetailedSword,
  metal,
  part,
  std,
} from './characterKnightArmor';
import { buildFlagBannerPole, buildGoldStarMesh, VN_GOLD, VN_RED } from './characterKnightFlags';

export interface KnightBuildResult {
  knight: THREE.Group;
  tierGroups: THREE.Group[];
  cape: THREE.Mesh | null;
  capeBaseZ: Float32Array | null;
  swordGlow: THREE.Mesh | null;
  leftPupil: THREE.Mesh;
  rightPupil: THREE.Mesh;
  wings: THREE.Mesh[];
  flagBanner: THREE.Group | null;
  clouds: THREE.Group;
}

function buildFace(head: THREE.Group): { leftPupil: THREE.Mesh; rightPupil: THREE.Mesh } {
  const eyeWhite = std(0xffffff, { roughness: 0.4 });
  const pupilMat = std(0x1e293b, { roughness: 0.35 });
  const cheekMat = std(0xff8fab, { emissive: 0xff6b9d, emissiveIntensity: 0.25, roughness: 0.85 });
  const smileMat = std(0xc2410c, { roughness: 0.7 });

  const leftEye = part(new THREE.SphereGeometry(0.07, 12, 12), eyeWhite, -0.1, 0.04, 0.26);
  const rightEye = part(new THREE.SphereGeometry(0.07, 12, 12), eyeWhite, 0.1, 0.04, 0.26);
  leftEye.scale.set(1.15, 1, 0.65);
  rightEye.scale.set(1.15, 1, 0.65);

  const leftPupil = part(new THREE.SphereGeometry(0.038, 10, 10), pupilMat, -0.1, 0.02, 0.31);
  const rightPupil = part(new THREE.SphereGeometry(0.038, 10, 10), pupilMat, 0.1, 0.02, 0.31);

  const leftCheek = part(new THREE.SphereGeometry(0.055, 10, 10), cheekMat, -0.17, -0.1, 0.2);
  const rightCheek = part(new THREE.SphereGeometry(0.055, 10, 10), cheekMat, 0.17, -0.1, 0.2);
  leftCheek.scale.set(1.2, 0.7, 0.5);
  rightCheek.scale.set(1.2, 0.7, 0.5);

  const smile = part(new THREE.TorusGeometry(0.07, 0.018, 8, 16, Math.PI), smileMat, 0, -0.12, 0.24);
  smile.rotation.x = Math.PI * 0.15;

  const hair = part(new THREE.SphereGeometry(0.36, 20, 16), std(0x4a3728, { roughness: 0.88 }), 0, 0.12, -0.02);
  hair.scale.set(1.05, 0.72, 1.02);

  head.add(leftEye, rightEye, leftPupil, rightPupil, leftCheek, rightCheek, smile, hair);
  return { leftPupil, rightPupil };
}

function buildChibiCore(knight: THREE.Group): {
  leftPupil: THREE.Mesh;
  rightPupil: THREE.Mesh;
} {
  const skin = std(0xffd8b8);
  const boot = std(0x78350f, { roughness: 0.8 });
  const glove = std(0xfbbf24, { roughness: 0.65 });

  const head = new THREE.Group();
  head.name = 'knight-head';
  head.position.set(0, 1.52, 0.02);
  const skull = part(new THREE.SphereGeometry(0.34, 28, 24), skin);
  skull.scale.set(1.05, 0.95, 0.92);
  head.add(skull);
  const face = buildFace(head);

  const torso = part(new THREE.CapsuleGeometry(0.38, 0.42, 10, 20), std(0x60a5fa), 0, 0.92, 0);
  torso.scale.set(1, 1.05, 0.85);
  const belt = part(new THREE.CylinderGeometry(0.4, 0.42, 0.1, 20), std(0xf59e0b), 0, 0.68, 0);

  const leftLeg = part(new THREE.CapsuleGeometry(0.13, 0.28, 8, 12), std(0x2563eb), -0.16, 0.32, 0.04);
  const rightLeg = part(new THREE.CapsuleGeometry(0.13, 0.28, 8, 12), std(0x2563eb), 0.16, 0.32, 0.04);

  const leftBoot = part(new THREE.SphereGeometry(0.16, 14, 12), boot, -0.16, 0.08, 0.1);
  leftBoot.scale.set(1.1, 0.65, 1.25);
  const rightBoot = part(new THREE.SphereGeometry(0.16, 14, 12), boot, 0.16, 0.08, 0.1);
  rightBoot.scale.set(1.1, 0.65, 1.25);

  const leftArm = part(new THREE.CapsuleGeometry(0.09, 0.22, 6, 10), skin, -0.42, 1.02, 0.02, 0, 0, 0.35);
  const rightArm = part(new THREE.CapsuleGeometry(0.09, 0.22, 6, 10), skin, 0.42, 1.02, 0.02, 0, 0, -0.35);
  const leftHand = part(new THREE.SphereGeometry(0.1, 12, 12), glove, -0.52, 0.82, 0.08);
  const rightHand = part(new THREE.SphereGeometry(0.1, 12, 12), glove, 0.52, 0.82, 0.08);

  knight.add(head, torso, belt, leftLeg, rightLeg, leftBoot, rightBoot, leftArm, rightArm, leftHand, rightHand);
  return { leftPupil: face.leftPupil, rightPupil: face.rightPupil };
}

export function buildCharacterStage(scene: THREE.Scene): THREE.Group {
  const clouds = new THREE.Group();
  clouds.name = 'knight-clouds';

  const floor = part(
    new THREE.CircleGeometry(3.4, 48),
    std(0x4ade80, { roughness: 0.95 }),
    0,
    0,
    0,
    -Math.PI / 2
  );
  floor.receiveShadow = true;

  const pedestal = part(
    new THREE.CylinderGeometry(1.12, 1.28, 0.38, 32),
    std(0xfff7ed, { roughness: 0.35, metalness: 0.08 }),
    0,
    0.19
  );
  pedestal.receiveShadow = true;

  const ring = part(
    new THREE.TorusGeometry(1.18, 0.06, 12, 40),
    std(0xf472b6, { emissive: 0xec4899, emissiveIntensity: 0.2 }),
    0,
    0.38
  );
  ring.rotation.x = Math.PI / 2;

  const gemColors = [VN_RED, VN_GOLD, 0x4ade80, 0x38bdf8, 0xa78bfa, 0xfb923c, 0x2dd4bf, 0xf472b6];
  for (let i = 0; i < 8; i++) {
    const gem = part(
      new THREE.OctahedronGeometry(0.09, 0),
      std(gemColors[i], { emissive: gemColors[i], emissiveIntensity: 0.35, metalness: 0.45, roughness: 0.2 }),
      0,
      0.44
    );
    const a = (i / 8) * Math.PI * 2;
    gem.position.set(Math.cos(a) * 1.15, 0.44, Math.sin(a) * 1.15);
    scene.add(gem);
  }

  const cloudMat = std(0xffffff, { roughness: 0.92, transparent: true, opacity: 0.92 });
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Group();
    c.add(
      part(new THREE.SphereGeometry(0.35, 14, 12), cloudMat),
      part(new THREE.SphereGeometry(0.28, 12, 10), cloudMat, 0.32, 0.05),
      part(new THREE.SphereGeometry(0.24, 12, 10), cloudMat, -0.28, 0.02, 0.05)
    );
    c.position.set(-2.2 + i * 2.1, 3.2 + i * 0.15, -2.5 - i * 0.3);
    c.userData.phase = i * 1.7;
    clouds.add(c);
  }

  const sun = part(
    new THREE.SphereGeometry(0.55, 20, 18),
    std(0xfde047, { emissive: 0xfacc15, emissiveIntensity: 0.65, roughness: 0.4 }),
    2.8,
    4.2,
    -3.5
  );
  for (let i = 0; i < 8; i++) {
    const ray = part(
      new THREE.BoxGeometry(0.08, 0.35, 0.08),
      std(0xfef08a, { emissive: 0xfde047, emissiveIntensity: 0.4 }),
      2.8,
      4.2,
      -3.5
    );
    const a = (i / 8) * Math.PI * 2;
    ray.position.set(2.8 + Math.cos(a) * 0.72, 4.2 + Math.sin(a) * 0.72, -3.5);
    ray.rotation.z = a;
    scene.add(ray);
  }

  scene.add(floor, pedestal, ring, clouds, sun);
  return clouds;
}

function buildTier0(): THREE.Group {
  const g = new THREE.Group();
  const cloth = std(0x3b82f6);
  const trim = std(VN_GOLD, { emissive: VN_GOLD, emissiveIntensity: 0.12 });

  const tabard = part(new THREE.BoxGeometry(0.7, 0.58, 0.38), cloth, 0, 1.02, 0.02);
  const tabardSkirt = part(new THREE.BoxGeometry(0.74, 0.22, 0.4), cloth, 0, 0.78, 0.04);
  const collar = part(new THREE.TorusGeometry(0.22, 0.045, 8, 22), trim, 0, 1.36, 0.04);
  collar.rotation.x = Math.PI / 2;

  for (const side of [-1, 1] as const) {
    g.add(part(new THREE.BoxGeometry(0.16, 0.2, 0.2), std(0xa16207, { roughness: 0.8 }), side * 0.38, 1.18, -0.02));
    g.add(part(new THREE.BoxGeometry(0.1, 0.14, 0.16), trim, side * 0.4, 1.28, 0.02));
  }

  addChestFlagBadge(g, 1.08, 0.24, 1.15);

  const woodGuard = part(new THREE.BoxGeometry(0.14, 0.05, 0.14), std(0x92400e), 0.5, 0.72, 0.14, 0, 0, -0.35);
  const woodBlade = part(new THREE.BoxGeometry(0.06, 0.72, 0.1), std(0xa16207, { roughness: 0.9 }), 0.5, 1.02, 0.12, 0, 0, -0.35);
  const woodGrip = part(new THREE.CylinderGeometry(0.04, 0.045, 0.18, 8), std(0x78350f), 0.5, 0.58, 0.14, 0, 0, -0.35);
  g.add(tabard, tabardSkirt, collar, woodGuard, woodBlade, woodGrip);
  return g;
}

function buildTier1(): THREE.Group {
  const g = new THREE.Group();
  const leather = std(0xb45309, { roughness: 0.78 });
  const stitch = std(0x78350f, { roughness: 0.85 });
  const trim = std(VN_GOLD);

  addChestPlateLayers(g, leather, trim, stitch, 1.02);
  for (let i = 0; i < 4; i++) {
    g.add(part(new THREE.BoxGeometry(0.64, 0.02, 0.36), stitch, 0, 0.88 + i * 0.12, 0.22));
  }
  addPauldrons(g, leather, trim, 1.2, 0.46);
  addBracers(g, leather, trim);
  addGreaves(g, leather, trim);

  const cap = part(new THREE.SphereGeometry(0.28, 16, 14), std(0x92400e, { roughness: 0.75 }), 0, 1.74, -0.05);
  cap.scale.set(1.12, 0.58, 1.05);
  const capBrim = part(new THREE.TorusGeometry(0.28, 0.035, 8, 24), leather, 0, 1.66, 0.06);
  capBrim.rotation.x = Math.PI / 2;
  const chinStrap = part(new THREE.TorusGeometry(0.2, 0.02, 6, 20, Math.PI), stitch, 0, 1.58, 0.18);
  chinStrap.rotation.x = Math.PI / 2;

  addRoundShield(g, -0.56, 0.96, 0.12, 0.34, metal(0x92400e, 0x000000, 0), 0.08);
  g.add(cap, capBrim, chinStrap);
  return g;
}

function buildTier2(): THREE.Group {
  const g = new THREE.Group();
  const steel = metal(0xc7d2fe, 0x93c5fd, 0.12);
  const dark = metal(0x64748b, 0x000000, 0);
  const goldTrim = metal(VN_GOLD, VN_GOLD, 0.2);

  const breast = part(new THREE.BoxGeometry(0.78, 0.68, 0.44), steel, 0, 1.04, 0);
  const breastCore = part(new THREE.BoxGeometry(0.2, 0.52, 0.46), goldTrim, 0, 1.06, 0.02);
  addChestFlagBadge(g, 1.12, 0.26, 0.95);
  addPauldrons(g, steel, goldTrim, 1.24, 0.5);
  addFauldPlates(g, steel, 4, 0.72);
  addBracers(g, steel, goldTrim);
  addGreaves(g, steel, goldTrim);
  addEnamelStripes(g, 1.04, 0.2);

  const visor = part(new THREE.BoxGeometry(0.54, 0.11, 0.14), dark, 0, 1.6, 0.2);
  const visorSlit = part(new THREE.BoxGeometry(0.36, 0.03, 0.15), std(0x0f172a), 0, 1.6, 0.26);
  const helmTop = part(new THREE.SphereGeometry(0.28, 18, 14), steel, 0, 1.78, -0.03);
  helmTop.scale.set(1.05, 0.62, 1);

  addKiteShield(g, -0.58, 0.94, 0.14, dark, 1.05);
  buildDetailedSword(g, steel, dark, goldTrim, 0.54, 1.06, 0.14, -0.3);
  g.add(breast, breastCore, visor, visorSlit, helmTop);
  return g;
}

function buildTier3(): THREE.Group {
  const g = new THREE.Group();
  const steel = metal(0x94a3b8, 0xa78bfa, 0.18);
  const goldTrim = metal(VN_GOLD, VN_GOLD, 0.28);
  const redTrim = std(VN_RED, { roughness: 0.45, metalness: 0.2 });

  addChestPlateLayers(g, steel, goldTrim, redTrim, 1.02);
  addPauldrons(g, steel, goldTrim, 1.26, 0.52);
  addFauldPlates(g, steel, 5, 0.7);
  addBracers(g, steel, goldTrim);
  addGreaves(g, steel, goldTrim);
  addEnamelStripes(g, 1.02, 0.22);

  for (const side of [-1, 1] as const) {
    g.add(part(new THREE.BoxGeometry(0.08, 0.42, 0.12), goldTrim, side * 0.34, 1.0, 0.2));
  }

  const cape = addHonorCape(g);
  g.add(cape);
  addHelmetHonor(g, steel, std(VN_RED, { emissive: VN_RED, emissiveIntensity: 0.15 }));
  addKiteShield(g, -0.6, 0.92, 0.16, metal(0x7c3aed, 0xc4b5fd, 0.2), 1.12);
  buildDetailedSword(g, steel, goldTrim, redTrim, 0.56, 1.04, 0.14, -0.28);

  const banner = buildFlagBannerPole();
  banner.position.set(0.32, 0.35, -0.42);
  banner.rotation.y = 0.25;
  banner.name = 'knight-flag-banner';
  g.add(banner);

  return g;
}

function buildTier4(): THREE.Group {
  const g = new THREE.Group();
  const gold = metal(0xffd54f, 0xfbbf24, 0.35);
  const redEnamel = std(VN_RED, { roughness: 0.4, metalness: 0.25, emissive: VN_RED, emissiveIntensity: 0.08 });
  const goldTrim = metal(VN_GOLD, VN_GOLD, 0.45);
  const wings: THREE.Mesh[] = [];

  addChestPlateLayers(g, gold, goldTrim, redEnamel, 1.02);
  addPauldrons(g, gold, redEnamel, 1.28, 0.54);
  addFauldPlates(g, gold, 5, 0.68);
  addBracers(g, gold, redEnamel);
  addGreaves(g, gold, goldTrim);
  addEnamelStripes(g, 1.02, 0.24);

  for (const side of [-1, 1] as const) {
    const wingBase = part(new THREE.BoxGeometry(0.12, 0.38, 0.28), gold, side * 0.42, 1.18, -0.08);
    const wing = part(new THREE.SphereGeometry(0.34, 16, 12), gold, side * 0.64, 1.3, -0.14);
    wing.scale.set(0.52, 1.15, 0.32);
    wing.rotation.z = side * 0.45;
    wing.name = `knight-wing-${side}`;
    const wingFeather1 = part(new THREE.BoxGeometry(0.06, 0.32, 0.22), redEnamel, side * 0.7, 1.22, -0.1);
    wingFeather1.rotation.z = side * 0.55;
    const wingFeather2 = part(new THREE.BoxGeometry(0.05, 0.26, 0.18), goldTrim, side * 0.58, 1.38, -0.16);
    wingFeather2.rotation.z = side * 0.35;
    wings.push(wing);
    g.add(wingBase, wing, wingFeather1, wingFeather2);
  }

  const crownBase = part(new THREE.CylinderGeometry(0.28, 0.32, 0.14, 22), goldTrim, 0, 1.84, 0);
  for (let i = 0; i < 5; i++) {
    const spike = part(new THREE.ConeGeometry(0.055, 0.18, 6), goldTrim, 0, 2.02, 0);
    const a = (i / 5) * Math.PI * 2;
    spike.position.set(Math.cos(a) * 0.22, 2.02, Math.sin(a) * 0.22);
    g.add(spike);
  }
  const crownStar = buildGoldStarMesh(0.1, 0.04);
  crownStar.position.set(0, 2.08, 0.12);

  buildDetailedSword(g, gold, goldTrim, redEnamel, 0.56, 1.06, 0.14, -0.28);
  const swordGlow = part(
    new THREE.SphereGeometry(0.17, 16, 16),
    std(0xfffde7, { emissive: VN_GOLD, emissiveIntensity: 1.35, transparent: true, opacity: 0.88 }),
    0.64,
    1.64,
    0.18
  );
  swordGlow.name = 'sword-glow';

  addRoundShield(g, -0.6, 0.92, 0.16, 0.42, goldTrim, 0.1);

  const banner = buildFlagBannerPole();
  banner.position.set(-0.34, 0.35, -0.4);
  banner.rotation.y = -0.3;
  banner.name = 'knight-flag-banner';
  g.add(banner, crownBase, crownStar, swordGlow);

  (g.userData as { wings: THREE.Mesh[] }).wings = wings;
  return g;
}

export function buildKnightModel(): KnightBuildResult {
  const knight = new THREE.Group();
  const tierGroups: THREE.Group[] = [];
  const wings: THREE.Mesh[] = [];

  const { leftPupil, rightPupil } = buildChibiCore(knight);

  tierGroups[0] = buildTier0();
  tierGroups[1] = buildTier1();
  tierGroups[1].visible = false;
  tierGroups[2] = buildTier2();
  tierGroups[2].visible = false;
  tierGroups[3] = buildTier3();
  tierGroups[3].visible = false;
  tierGroups[4] = buildTier4();
  tierGroups[4].visible = false;

  const w4 = (tierGroups[4].userData as { wings?: THREE.Mesh[] }).wings;
  if (w4) wings.push(...w4);

  for (const g of tierGroups) knight.add(g);

  const capeMesh = knight.getObjectByName('knight-cape') as THREE.Mesh | undefined;
  let capeBaseZ: Float32Array | null = null;
  if (capeMesh) {
    const capePos = capeMesh.geometry.attributes.position as THREE.BufferAttribute;
    capeBaseZ = capePos.array.slice() as Float32Array;
  }

  const flagBanner = (knight.getObjectByName('knight-flag-banner') as THREE.Group) ?? null;

  return {
    knight,
    tierGroups,
    cape: capeMesh ?? null,
    capeBaseZ,
    swordGlow: (knight.getObjectByName('sword-glow') as THREE.Mesh) ?? null,
    leftPupil,
    rightPupil,
    wings,
    flagBanner,
    clouds: new THREE.Group(),
  };
}
