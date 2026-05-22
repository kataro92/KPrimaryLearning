import * as THREE from 'three';

/** Bảng màu gần Mario Teaches Typing (SNES / MS-DOS) */
export const MARIO = {
  sky: 0x5c94fc,
  cloud: 0xf8f8f8,
  hillDark: 0x00a800,
  hillLight: 0x40c040,
  ground: 0x40a040,
  brick: 0xc84c0c,
  brickDark: 0x9a3a08,
  block: 0xf8b800,
  blockDark: 0xc88800,
  blockDone: 0x40c040,
  pipe: 0x00c800,
  pipeDark: 0x008000,
  castle: 0xc84c0c,
  hat: 0xe52521,
  skin: 0xffc89a,
  overall: 0x214ad4,
  shoe: 0x6b3a16,
  white: 0xffffff,
} as const;

export function makeCloud(x: number, y: number, z: number, scale = 1): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: MARIO.cloud });
  const parts: [number, number, number][] = [
    [0, 0, 0],
    [-0.35 * scale, 0.05 * scale, 0],
    [0.35 * scale, 0.05 * scale, 0],
    [-0.15 * scale, 0.2 * scale, 0],
    [0.2 * scale, 0.18 * scale, 0],
  ];
  for (const [px, py, pz] of parts) {
    const puff = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 0.35 * scale, 0.25 * scale), mat);
    puff.position.set(px, py, pz);
    g.add(puff);
  }
  g.position.set(x, y, z);
  return g;
}

export function makeHill(x: number, y: number, z: number, w: number, h: number): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.quadraticCurveTo(0, h, w / 2, 0);
  shape.lineTo(-w / 2, 0);
  const geom = new THREE.ShapeGeometry(shape);
  const mesh = new THREE.Mesh(
    geom,
    new THREE.MeshBasicMaterial({ color: MARIO.hillLight, side: THREE.DoubleSide })
  );
  mesh.position.set(x, y, z);
  mesh.rotation.y = 0.15;
  return mesh;
}

export function makeBrickTile(x: number, y: number, z: number): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.18, 0.55),
    new THREE.MeshBasicMaterial({ color: MARIO.brick })
  );
  g.add(body);
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(0.74, 0.03, 0.57),
    new THREE.MeshBasicMaterial({ color: MARIO.brickDark })
  );
  line.position.y = 0.04;
  g.add(line);
  g.position.set(x, y, z);
  g.rotation.x = -0.55;
  return g;
}

export function makeLetterBlock(letter: string, state: 'pending' | 'current' | 'done'): THREE.Group {
  const g = new THREE.Group();
  const color =
    state === 'done' ? MARIO.blockDone : state === 'current' ? MARIO.block : MARIO.blockDark;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.28),
    new THREE.MeshBasicMaterial({ color })
  );
  g.add(box);
  const border = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.46, 0.26),
    new THREE.MeshBasicMaterial({ color: 0x1a1a1a, wireframe: true })
  );
  g.add(border);

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = state === 'done' ? '#fff' : '#1a1a1a';
  ctx.font = 'bold 44px Nunito, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = letter === ' ' ? '␣' : letter;
  ctx.fillText(label, 32, 34);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.36, 0.36),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  face.position.z = 0.15;
  g.add(face);

  if (state === 'current') {
    const shine = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.3),
      new THREE.MeshBasicMaterial({ color: MARIO.white, transparent: true, opacity: 0.7 })
    );
    shine.position.set(-0.12, 0.12, 0.16);
    g.add(shine);
  }
  return g;
}

export function buildMarioRunner(): THREE.Group {
  const g = new THREE.Group();
  const hat = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.14, 0.36),
    new THREE.MeshBasicMaterial({ color: MARIO.hat })
  );
  hat.position.y = 0.88;
  g.add(hat);
  const capBrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.06, 0.38),
    new THREE.MeshBasicMaterial({ color: MARIO.hat })
  );
  capBrim.position.set(0.06, 0.8, 0.02);
  g.add(capBrim);
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.32, 0.3),
    new THREE.MeshBasicMaterial({ color: MARIO.skin })
  );
  head.position.y = 0.62;
  g.add(head);
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.4, 0.32),
    new THREE.MeshBasicMaterial({ color: MARIO.overall })
  );
  body.position.y = 0.28;
  g.add(body);
  const strap = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.38, 0.34),
    new THREE.MeshBasicMaterial({ color: MARIO.hat })
  );
  strap.position.set(0, 0.28, 0.01);
  g.add(strap);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.18, 0.22),
    new THREE.MeshBasicMaterial({ color: MARIO.overall })
  );
  legL.position.set(-0.1, 0.02, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);
  const shoeL = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.1, 0.28),
    new THREE.MeshBasicMaterial({ color: MARIO.shoe })
  );
  shoeL.position.set(-0.1, -0.08, 0.04);
  g.add(shoeL);
  const shoeR = shoeL.clone();
  shoeR.position.x = 0.1;
  g.add(shoeR);
  g.scale.setScalar(1.05);
  return g;
}

export function makeCastle(x: number, y: number, z: number): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: MARIO.castle });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 0.5), mat);
  base.position.y = 0.45;
  g.add(base);
  const towerL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.1, 0.45), mat);
  towerL.position.set(-0.45, 0.75, 0);
  g.add(towerL);
  const towerR = towerL.clone();
  towerR.position.x = 0.45;
  g.add(towerR);
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.38, 0.52),
    new THREE.MeshBasicMaterial({ color: 0x1a1a1a })
  );
  door.position.set(0, 0.22, 0.02);
  g.add(door);
  const flag = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.22, 0.06),
    new THREE.MeshBasicMaterial({ color: MARIO.hat })
  );
  flag.position.set(0.35, 1.35, 0);
  g.add(flag);
  g.position.set(x, y, z);
  return g;
}

export function makePipe(x: number, y: number, z: number): THREE.Group {
  const g = new THREE.Group();
  const stem = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.7, 0.45),
    new THREE.MeshBasicMaterial({ color: MARIO.pipe })
  );
  stem.position.y = 0.1;
  g.add(stem);
  const rim = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.18, 0.55),
    new THREE.MeshBasicMaterial({ color: MARIO.pipeDark })
  );
  rim.position.y = 0.48;
  g.add(rim);
  g.position.set(x, y, z);
  return g;
}

export function makeGroundStrip(): THREE.Mesh {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 2.2),
    new THREE.MeshBasicMaterial({ color: MARIO.ground })
  );
  ground.position.set(0, -1.75, 0);
  ground.rotation.x = -0.35;
  return ground;
}

/** Nền trời xanh, đồi, mây — parallax phía sau Mario */
export function buildMarioTypingBackdrop(): THREE.Object3D[] {
  return [
    makeGroundStrip(),
    makeHill(-2.8, -1.35, -1.5, 2.2, 0.75),
    makeHill(1.2, -1.4, -2, 1.6, 0.55),
    makeHill(3.4, -1.38, -0.8, 1.4, 0.45),
    makeCloud(-2.5, 1.4, -2, 1.1),
    makeCloud(0.5, 1.55, -2.5, 0.9),
    makeCloud(2.8, 1.35, -1.8, 1),
  ];
}
