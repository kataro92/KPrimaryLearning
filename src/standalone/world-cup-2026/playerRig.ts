/**
 * Articulated cartoon football player for World Cup side-view scene.
 */

import * as THREE from 'three';

export interface PlayerRig {
  root: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  forearmL: THREE.Group;
  forearmR: THREE.Group;
  shinL: THREE.Group;
  shinR: THREE.Group;
  isStriker: boolean;
  isGk: boolean;
  kit: {
    torso: THREE.MeshStandardMaterial;
    shorts: THREE.MeshStandardMaterial;
    arms: THREE.MeshStandardMaterial[];
    socks: THREE.MeshStandardMaterial[];
  };
  numberMesh: THREE.Mesh;
  handL: THREE.Group;
  handR: THREE.Group;
}

function hexToNum(hex: string): number {
  return Number.parseInt(hex.replace('#', ''), 16);
}

function lighten(hex: string, amount = 0.22): number {
  const n = hexToNum(hex);
  const r = Math.min(255, ((n >> 16) & 255) + 255 * amount);
  const g = Math.min(255, ((n >> 8) & 255) + 255 * amount);
  const b = Math.min(255, (n & 255) + 255 * amount);
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
}

export function makeJerseyNumberTexture(digits: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 108px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(15,23,42,0.35)';
  ctx.shadowBlur = 6;
  ctx.fillText(digits, canvas.width / 2, canvas.height / 2 + 4);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function recolorPlayerKit(
  rig: PlayerRig,
  colors: { shirt: string; shirtHi: string; shorts: string; socks: string }
): void {
  const shirt = hexToNum(colors.shirt);
  const shirtHi = hexToNum(colors.shirtHi);
  const shorts = hexToNum(colors.shorts);
  const socks = hexToNum(colors.socks);
  rig.kit.torso.color.setHex(shirt);
  rig.kit.torso.emissive.setHex(shirtHi);
  rig.kit.torso.emissiveIntensity = 0.16;
  rig.kit.shorts.color.setHex(shorts);
  for (const mat of rig.kit.arms) {
    mat.color.setHex(shirt);
    mat.emissive.setHex(shirtHi);
    mat.emissiveIntensity = 0.1;
  }
  for (const mat of rig.kit.socks) {
    mat.color.setHex(socks);
  }
}

function darkenHex(hex: string, amount = 0.35): string {
  const n = hexToNum(hex);
  const r = Math.max(0, ((n >> 16) & 255) * (1 - amount));
  const g = Math.max(0, ((n >> 8) & 255) * (1 - amount));
  const b = Math.max(0, (n & 255) * (1 - amount));
  return `#${((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).padStart(6, '0')}`;
}

let fabricTexCache: THREE.CanvasTexture | null = null;

export function getFabricTexture(): THREE.CanvasTexture {
  if (fabricTexCache) return fabricTexCache;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#909090';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.strokeStyle = `rgba(255,255,255,${y % 8 === 0 ? 0.1 : 0.05})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let x = 0; x < canvas.width; x += 4) {
    ctx.strokeStyle = `rgba(0,0,0,${x % 8 === 0 ? 0.07 : 0.035})`;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  fabricTexCache = new THREE.CanvasTexture(canvas);
  fabricTexCache.wrapS = THREE.RepeatWrapping;
  fabricTexCache.wrapT = THREE.RepeatWrapping;
  fabricTexCache.repeat.set(2.5, 2.5);
  fabricTexCache.colorSpace = THREE.SRGBColorSpace;
  return fabricTexCache;
}

export function opponentKitFromFlag(flag: [string, string, string]): {
  shirt: string;
  shirtHi: string;
  shorts: string;
  socks: string;
} {
  const [a, , c] = flag;
  return {
    shirt: c,
    shirtHi: `#${lighten(c).toString(16).padStart(6, '0')}`,
    shorts: darkenHex(a, 0.38),
    socks: '#f8fafc',
  };
}

export function kitFromFlag(flag: [string, string, string]): {
  shirt: string;
  shirtHi: string;
  shorts: string;
  socks: string;
} {
  const [a, b, c] = flag;
  return {
    shirt: a,
    shirtHi: `#${lighten(a).toString(16).padStart(6, '0')}`,
    shorts: c,
    socks: b === '#ffffff' || b === '#ffdf00' ? b : '#f8fafc',
  };
}

function smoothMat(
  color: number,
  opts: { roughness?: number; metalness?: number; emissive?: number; emissiveIntensity?: number } = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.34,
    metalness: opts.metalness ?? 0.06,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });
}

function buildBoot(side: 1 | -1): THREE.Group {
  const g = new THREE.Group();
  const boot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.2), smoothMat(0x111827, { roughness: 0.28 }));
  boot.position.set(0, 0.045, side * 0.02);
  const toe = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.055, 0.08),
    smoothMat(0xf8fafc, { roughness: 0.28, emissive: 0xffffff, emissiveIntensity: 0.06 })
  );
  toe.position.set(0, 0.025, side * 0.11);
  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.028, 0.22), smoothMat(0x030712, { roughness: 0.5 }));
  sole.position.set(0, -0.012, side * 0.02);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 6, 10), smoothMat(0x1f2937, { roughness: 0.4 }));
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.09, side * 0.01);
  for (let i = 0; i < 3; i++) {
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.004, 0.04), smoothMat(0xe2e8f0, { roughness: 0.55 }));
    lace.position.set(0, 0.07 - i * 0.018, side * 0.06);
    g.add(lace);
  }
  g.add(boot, toe, sole, collar);
  for (let row = 0; row < 2; row++) {
    for (let col = -1; col <= 1; col++) {
      const stud = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.014, 6),
        smoothMat(0x94a3b8, { roughness: 0.25, metalness: 0.35 })
      );
      stud.position.set(col * 0.034, -0.018, side * (0.03 + row * 0.06));
      g.add(stud);
    }
  }
  return g;
}

function buildHand(side: 1 | -1, glove = false): THREE.Group {
  const g = new THREE.Group();
  const skin = glove ? 0xfbbf24 : 0xfcd9b6;
  const skinHi = glove ? 0xf59e0b : 0xf5cba7;
  const palm = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.09, 0.045),
    smoothMat(skin, { roughness: glove ? 0.38 : 0.52 })
  );
  if (glove) {
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(0.078, 0.075, 0.05),
      smoothMat(0xf59e0b, { roughness: 0.35, emissive: 0xfbbf24, emissiveIntensity: 0.08 })
    );
    pad.position.set(0, 0.012, -side * 0.018);
    g.add(pad);
    const wrist = new THREE.Mesh(
      new THREE.TorusGeometry(0.038, 0.012, 6, 12),
      smoothMat(0x111827, { roughness: 0.45 })
    );
    wrist.rotation.x = Math.PI / 2;
    wrist.position.set(0, 0.05, 0);
    g.add(wrist);
  }
  const thumb = new THREE.Mesh(
    new THREE.BoxGeometry(0.022, glove ? 0.058 : 0.05, 0.024),
    smoothMat(skinHi, { roughness: 0.5 })
  );
  thumb.position.set(side * 0.04, -0.01, side * 0.02);
  thumb.rotation.z = side * 0.45;
  for (let i = 0; i < 4; i++) {
    const finger = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, glove ? 0.068 : 0.058, 0.024),
      smoothMat(skinHi, { roughness: 0.48 })
    );
    finger.position.set((i - 1.5) * 0.021, -0.052, side * 0.018);
    finger.userData.isFinger = true;
    if (glove) finger.rotation.x = -0.12;
    g.add(finger);
  }
  g.userData.isGlove = glove;
  g.add(palm, thumb);
  return g;
}

function addCartoonOutline(mesh: THREE.Mesh, color = 0x0f172a, scale = 1.055): void {
  const outline = mesh.clone();
  outline.material = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
  outline.scale.multiplyScalar(scale);
  mesh.add(outline);
}

function resetFingerCurls(handL: THREE.Group, handR: THREE.Group, isGk: boolean): void {
  for (const hand of [handL, handR]) {
    const glove = Boolean(hand.userData.isGlove);
    hand.children.forEach((child) => {
      if (!child.userData.isFinger) return;
      child.rotation.set(glove ? -0.12 : 0, 0, 0);
    });
  }
  if (isGk) return;
}

function curlFingers(hand: THREE.Group, amount: number, side: 1 | -1): void {
  hand.children.forEach((child) => {
    if (!child.userData.isFinger) return;
    child.rotation.x = -amount;
    child.rotation.z = side * amount * 0.35;
  });
}

function buildLimb(
  length: number,
  radius: number,
  color: number,
  matOpts?: { roughness?: number; metalness?: number; emissive?: number; emissiveIntensity?: number }
): THREE.Mesh {
  return new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 10), smoothMat(color, matOpts));
}

function addJerseyDetails(root: THREE.Group, shirtHi: number, isStriker: boolean): void {
  const stripe = new THREE.Mesh(
    new THREE.PlaneGeometry(0.26, 0.05),
    smoothMat(0xffffff, { roughness: 0.42 })
  );
  stripe.position.set(0, 0.5, 0.145);
  const crest = new THREE.Mesh(
    new THREE.CircleGeometry(0.035, 10),
    smoothMat(shirtHi, { emissive: shirtHi, emissiveIntensity: 0.15, roughness: 0.35 })
  );
  crest.position.set(-0.06, 0.54, 0.146);
  const sleeveBandL = new THREE.Mesh(
    new THREE.TorusGeometry(0.048, 0.01, 6, 12),
    smoothMat(0xffffff, { roughness: 0.45 })
  );
  sleeveBandL.position.set(-0.18, 0.48, 0);
  sleeveBandL.rotation.y = Math.PI / 2;
  const sleeveBandR = sleeveBandL.clone();
  sleeveBandR.position.x = 0.18;
  root.add(stripe, crest, sleeveBandL, sleeveBandR);
  if (isStriker) {
    const armband = new THREE.Mesh(
      new THREE.TorusGeometry(0.042, 0.012, 6, 12),
      smoothMat(0xfacc15, { emissive: 0xfacc15, emissiveIntensity: 0.2, roughness: 0.38 })
    );
    armband.position.set(-0.18, 0.44, 0.02);
    armband.rotation.y = Math.PI / 2;
    root.add(armband);
  }
}

export function buildPlayerRig(isGk: boolean, isStriker: boolean): PlayerRig {
  const root = new THREE.Group();
  const shirt = isGk ? 0xfacc15 : isStriker ? 0x2563eb : 0xdc2626;
  const shirtHi = isGk ? 0xfde047 : isStriker ? 0x3b82f6 : 0xef4444;
  const shorts = isStriker ? 0x1e3a8a : isGk ? 0x854d0e : 0x991b1b;
  const sockColor = 0xf8fafc;
  const torsoMat = smoothMat(shirt, { emissive: shirtHi, emissiveIntensity: 0.12, roughness: 0.32 });
  torsoMat.map = getFabricTexture();
  const shortsMat = smoothMat(shorts, { roughness: 0.44 });
  shortsMat.map = getFabricTexture();
  const armMats: THREE.MeshStandardMaterial[] = [];
  const sockMats: THREE.MeshStandardMaterial[] = [];

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.15, 0.34, 10, 14),
    torsoMat
  );
  torso.position.y = 0.42;
  addCartoonOutline(torso);

  const shoulderL = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 10, 10),
    smoothMat(shirt, { emissive: shirtHi, emissiveIntensity: 0.08, roughness: 0.36 })
  );
  shoulderL.position.set(-0.16, 0.56, 0.02);
  const shoulderR = shoulderL.clone();
  shoulderR.position.x = 0.16;

  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.018, 8, 18),
    smoothMat(0xffffff, { roughness: 0.42 })
  );
  collar.position.y = 0.58;
  collar.rotation.x = Math.PI / 2;

  const numberMat = new THREE.MeshStandardMaterial({
    map: makeJerseyNumberTexture(isStriker ? '10' : isGk ? '1' : '4'),
    transparent: true,
    roughness: 0.38,
    metalness: 0.02,
    emissive: 0xffffff,
    emissiveIntensity: 0.04,
  });
  const number = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.11), numberMat);
  number.position.set(0, 0.46, 0.145);

  const shortsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.19), shortsMat);
  shortsMesh.position.y = 0.24;
  const waistband = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.014, 6, 16),
    smoothMat(0xffffff, { roughness: 0.4 })
  );
  waistband.rotation.x = Math.PI / 2;
  waistband.position.y = 0.31;
  const shortsStripeL = new THREE.Mesh(
    new THREE.PlaneGeometry(0.03, 0.1),
    smoothMat(0xffffff, { roughness: 0.45 })
  );
  shortsStripeL.position.set(-0.1, 0.24, 0.096);
  const shortsStripeR = shortsStripeL.clone();
  shortsStripeR.position.x = 0.1;

  const head = new THREE.Group();
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), smoothMat(0xfcd9b6, { roughness: 0.58 }));
  skull.position.y = 0.74;
  addCartoonOutline(skull, 0x1f2937, 1.08);
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.115, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
    smoothMat(isStriker ? 0x1f2937 : isGk ? 0x0f172a : 0x451a03, { roughness: 0.68 })
  );
  hair.position.set(0, 0.825, -0.02);
  if (isStriker) {
    for (let i = -1; i <= 1; i++) {
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.035, 0.08, 6),
        smoothMat(0x1f2937, { roughness: 0.65 })
      );
      spike.position.set(i * 0.05, 0.9, -0.03);
      spike.rotation.x = -0.35;
      head.add(spike);
    }
  }
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), smoothMat(0x0f172a, { roughness: 0.15 }));
  eyeL.position.set(-0.04, 0.752, 0.115);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.04;
  const eyeShineL = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 6), smoothMat(0xffffff, { roughness: 0.1 }));
  eyeShineL.position.set(-0.035, 0.758, 0.122);
  const eyeShineR = eyeShineL.clone();
  eyeShineR.position.x = 0.045;
  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.012, 0.02), smoothMat(0x1f2937, { roughness: 0.7 }));
  brow.position.set(0, 0.775, 0.11);
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI * 0.65),
    smoothMat(0xbe123c, { roughness: 0.55 })
  );
  smile.position.set(0, 0.715, 0.112);
  smile.rotation.z = Math.PI * 1.08;
  const cheekL = new THREE.Mesh(
    new THREE.SphereGeometry(0.024, 8, 8),
    smoothMat(0xfca5a5, { roughness: 0.75, emissive: 0xfca5a5, emissiveIntensity: 0.14 })
  );
  cheekL.position.set(-0.055, 0.705, 0.1);
  const cheekR = cheekL.clone();
  cheekR.position.x = 0.055;
  head.add(skull, hair, eyeL, eyeR, eyeShineL, eyeShineR, brow, smile, cheekL, cheekR);

  const armL = new THREE.Group();
  armL.position.set(-0.18, 0.52, 0);
  const upperArmL = buildLimb(0.14, 0.045, shirt, { emissive: shirtHi, emissiveIntensity: 0.07 });
  armMats.push(upperArmL.material as THREE.MeshStandardMaterial);
  (upperArmL.material as THREE.MeshStandardMaterial).map = getFabricTexture();
  upperArmL.position.y = -0.08;
  const forearmL = new THREE.Group();
  forearmL.position.y = -0.16;
  const lowerArmL = buildLimb(0.12, 0.038, shirt);
  armMats.push(lowerArmL.material as THREE.MeshStandardMaterial);
  (lowerArmL.material as THREE.MeshStandardMaterial).map = getFabricTexture();
  lowerArmL.position.y = -0.06;
  const handL = buildHand(-1, isGk);
  handL.position.set(0, -0.12, 0.02);
  forearmL.add(lowerArmL, handL);
  armL.add(upperArmL, forearmL);

  const armR = new THREE.Group();
  armR.position.set(0.18, 0.52, 0);
  const upperArmR = buildLimb(0.14, 0.045, shirt, { emissive: shirtHi, emissiveIntensity: 0.07 });
  armMats.push(upperArmR.material as THREE.MeshStandardMaterial);
  (upperArmR.material as THREE.MeshStandardMaterial).map = getFabricTexture();
  upperArmR.position.y = -0.08;
  const forearmR = new THREE.Group();
  forearmR.position.y = -0.16;
  const lowerArmR = buildLimb(0.12, 0.038, shirt);
  armMats.push(lowerArmR.material as THREE.MeshStandardMaterial);
  (lowerArmR.material as THREE.MeshStandardMaterial).map = getFabricTexture();
  lowerArmR.position.y = -0.06;
  const handR = buildHand(1, isGk);
  handR.position.set(0, -0.12, 0.02);
  forearmR.add(lowerArmR, handR);
  armR.add(upperArmR, forearmR);

  const legL = new THREE.Group();
  legL.position.set(-0.08, 0.2, 0);
  const upperLegL = buildLimb(0.13, 0.05, shorts);
  upperLegL.position.y = -0.07;
  const shinL = new THREE.Group();
  shinL.position.y = -0.14;
  const sockCuffL = new THREE.Mesh(
    new THREE.TorusGeometry(0.044, 0.012, 6, 12),
    smoothMat(shirtHi, { roughness: 0.4 })
  );
  sockCuffL.rotation.x = Math.PI / 2;
  sockCuffL.position.y = 0.02;
  const lowerLegL = buildLimb(0.12, 0.042, sockColor);
  sockMats.push(lowerLegL.material as THREE.MeshStandardMaterial);
  lowerLegL.position.y = -0.06;
  const bootL = buildBoot(-1);
  bootL.position.y = -0.12;
  shinL.add(sockCuffL, lowerLegL, bootL);
  legL.add(upperLegL, shinL);

  if (isGk) {
    const padL = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.16, 0.14),
      smoothMat(0x422006, { roughness: 0.52 })
    );
    padL.position.set(-0.08, 0.14, 0.01);
    const padR = padL.clone();
    padR.position.x = 0.08;
    root.add(padL, padR);
  }

  const legR = new THREE.Group();
  legR.position.set(0.08, 0.2, 0);
  const upperLegR = buildLimb(0.13, 0.05, shorts);
  upperLegR.position.y = -0.07;
  const shinR = new THREE.Group();
  shinR.position.y = -0.14;
  const sockCuffR = sockCuffL.clone();
  const lowerLegR = buildLimb(0.12, 0.042, sockColor);
  sockMats.push(lowerLegR.material as THREE.MeshStandardMaterial);
  lowerLegR.position.y = -0.06;
  const bootR = buildBoot(1);
  bootR.position.y = -0.12;
  shinR.add(sockCuffR, lowerLegR, bootR);
  legR.add(upperLegR, shinR);

  root.add(torso, shoulderL, shoulderR, collar, number, shortsMesh, waistband, shortsStripeL, shortsStripeR, head, armL, armR, legL, legR);
  addJerseyDetails(root, shirtHi, isStriker && !isGk);
  if (isStriker) {
    const patch = new THREE.Mesh(
      new THREE.PlaneGeometry(0.07, 0.035),
      smoothMat(0xffffff, { roughness: 0.35, emissive: 0xffffff, emissiveIntensity: 0.05 })
    );
    patch.position.set(0.08, 0.52, 0.146);
    root.add(patch);
  }
  root.rotation.y = isStriker ? Math.PI / 2 : -Math.PI / 2;
  root.scale.setScalar(isGk ? 1.22 : 1.05);

  return {
    root,
    armL,
    armR,
    legL,
    legR,
    forearmL,
    forearmR,
    shinL,
    shinR,
    isStriker,
    isGk,
    kit: { torso: torsoMat, shorts: shortsMat, arms: armMats, socks: sockMats },
    numberMesh: number,
    handL,
    handR,
  };
}

export function animatePlayerRig(
  rig: PlayerRig,
  phase: string,
  t: number,
  runCycle: number,
  opts: {
    kickT?: number;
    disappointed?: boolean;
    diveT?: number;
    diveDir?: number;
    blocking?: boolean;
    ballHoldY?: number;
  } = {}
): void {
  rig.root.position.y = Math.sin(t * 3) * 0.004;
  rig.root.rotation.z = 0;
  rig.root.rotation.x = 0;
  resetFingerCurls(rig.handL, rig.handR, rig.isGk);

  const isReady = phase === 'idle' || phase === 'selecting';

  if (isReady) {
    if (rig.isStriker) {
      const hold = Math.sin(t * 2.8) * 0.03;
      const ballTilt = THREE.MathUtils.clamp((opts.ballHoldY ?? 0) * 5, -0.15, 0.15);
      rig.root.rotation.x = -0.05;
      rig.root.rotation.z = -0.025;
      rig.armL.rotation.set(0.1, 0, 0.48 + Math.sin(t * 2.5) * 0.03);
      rig.armR.rotation.set(0.06, 0, -0.62);
      rig.forearmL.rotation.set(0.28 + hold + ballTilt, 0, 0.42 + hold * 0.5);
      rig.forearmR.rotation.set(0.22 + hold + ballTilt * 0.85, 0, 0.58 + hold * 0.35);
      rig.legL.rotation.x = 0.2;
      rig.legR.rotation.x = -0.04;
      rig.shinL.rotation.x = 0.18;
      rig.shinR.rotation.x = 0.06;
      curlFingers(rig.handL, 0.22 + Math.abs(ballTilt) * 0.4, -1);
      curlFingers(rig.handR, 0.28 + Math.abs(ballTilt) * 0.5, 1);
    } else if (rig.isGk) {
      rig.armL.rotation.set(0, 0, 0.35 + Math.sin(t * 2) * 0.05);
      rig.armR.rotation.set(0, 0, -0.35 - Math.sin(t * 2) * 0.05);
      rig.forearmL.rotation.z = 0.2;
      rig.forearmR.rotation.z = -0.2;
      rig.legL.rotation.x = Math.sin(t * 2.5) * 0.04;
      rig.legR.rotation.x = -Math.sin(t * 2.5) * 0.04;
    } else {
      rig.armL.rotation.set(0, 0, 0.55 + Math.sin(t * 2.2) * 0.04);
      rig.armR.rotation.set(0, 0, -0.55 - Math.sin(t * 2.2) * 0.04);
      rig.forearmL.rotation.z = 0.35;
      rig.forearmR.rotation.z = -0.35;
      rig.legL.rotation.x = -0.08 + Math.sin(t * 3) * 0.03;
      rig.legR.rotation.x = 0.08 - Math.sin(t * 3) * 0.03;
      rig.shinL.rotation.x = 0.15;
      rig.shinR.rotation.x = 0.15;
    }
    return;
  }

  if (phase === 'kicking') {
    const k = opts.kickT ?? 0;
    const swing = Math.sin(k * Math.PI);
    rig.armL.rotation.z = 0.35 - swing * 0.25;
    rig.armR.rotation.z = -0.4 + swing * 0.9;
    rig.forearmR.rotation.z = 0.35 + swing * 0.4;
    rig.legR.rotation.x = -swing * 0.85;
    rig.shinR.rotation.x = swing * 0.55;
    rig.legL.rotation.x = swing * 0.12;
    rig.root.rotation.z = -swing * 0.08;
    return;
  }

  if (phase === 'returning' && !rig.isStriker) {
    rig.root.rotation.z = 0.55;
    rig.armL.rotation.z = 0.4;
    rig.legL.rotation.x = 0.25;
    return;
  }

  if (phase === 'blocking') {
    if (rig.isGk && opts.diveT !== undefined) {
      const d = opts.diveT;
      rig.root.rotation.z = (opts.diveDir ?? -1) * d * 0.65;
      rig.root.position.y = -d * 0.04;
      rig.armL.rotation.z = 0.8 * d;
      rig.armR.rotation.z = -0.9 * d;
      rig.legL.rotation.x = 0.35 * d;
      rig.legR.rotation.x = -0.25 * d;
      return;
    }
    if (!rig.isStriker && opts.blocking) {
      rig.armL.rotation.z = 1.05;
      rig.armR.rotation.z = -1.05;
      rig.forearmL.rotation.z = 0.25;
      rig.forearmR.rotation.z = -0.25;
      rig.legL.rotation.x = 0.18;
      rig.legR.rotation.x = -0.12;
      return;
    }
    if (rig.isStriker && opts.disappointed) {
      rig.armL.rotation.z = 0.55;
      rig.armR.rotation.z = -0.35;
      rig.root.rotation.z = 0.06;
      rig.root.rotation.x = 0.05;
      return;
    }
  }

  if (phase === 'scrolling' || phase === 'returning' || phase === 'flying') {
    const s = Math.sin(runCycle);
    rig.armL.rotation.x = s * 0.45;
    rig.armR.rotation.x = -s * 0.45;
    rig.legL.rotation.x = -s * 0.55;
    rig.legR.rotation.x = s * 0.55;
    rig.shinL.rotation.x = Math.max(0, s) * 0.35;
    rig.shinR.rotation.x = Math.max(0, -s) * 0.35;
    rig.armL.rotation.z = 0.25;
    rig.armR.rotation.z = -0.25;
    return;
  }

  if (phase === 'goal') {
    rig.armL.rotation.z = 1.1 + Math.sin(t * 12) * 0.2;
    rig.armR.rotation.z = -1.1 - Math.sin(t * 12) * 0.2;
    rig.legL.rotation.x = -0.15;
    rig.legR.rotation.x = -0.15;
    return;
  }

  if (rig.isGk && opts.diveT !== undefined) {
    const d = opts.diveT;
    rig.root.rotation.z = (opts.diveDir ?? -1) * d * 0.65;
    rig.root.position.y = -d * 0.04;
    rig.armL.rotation.z = 0.8 * d;
    rig.armR.rotation.z = -0.9 * d;
    rig.legL.rotation.x = 0.35 * d;
    rig.legR.rotation.x = -0.25 * d;
  }
}

export function getPlayerRig(group: THREE.Group): PlayerRig | null {
  return (group.userData.rig as PlayerRig | undefined) ?? null;
}

export function attachPlayerRig(group: THREE.Group, rig: PlayerRig): void {
  group.userData.rig = rig;
  group.add(rig.root);
}
