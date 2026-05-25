import * as THREE from 'three';

/** Cờ Việt Nam — nền đỏ (#DA251D), sao vàng (#FFCD00), tỉ lệ 3:2. */
export const VN_RED = 0xda251d;
export const VN_GOLD = 0xffcd00;

export function createVietnamFlagTexture(): THREE.CanvasTexture {
  const w = 300;
  const h = 200;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.colorSpace = THREE.SRGBColorSpace;
    return fallback;
  }
  ctx.fillStyle = '#DA251D';
  ctx.fillRect(0, 0, w, h);
  drawStar2d(ctx, w * 0.5, h * 0.5, h * 0.32, '#FFCD00');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function drawStar2d(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, color: string): void {
  const innerR = outerR * 0.382;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

let sharedFlagTexture: THREE.CanvasTexture | null = null;

export function vietnamFlagMaterial(): THREE.MeshStandardMaterial {
  if (!sharedFlagTexture) sharedFlagTexture = createVietnamFlagTexture();
  return new THREE.MeshStandardMaterial({
    map: sharedFlagTexture,
    roughness: 0.62,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });
}

/** Sao vàng 3D (khiên, huy hiệu). */
export function buildGoldStarMesh(outerR: number, depth = 0.04): THREE.Mesh {
  const shape = new THREE.Shape();
  const innerR = outerR * 0.382;
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
  geo.center();
  const mat = new THREE.MeshStandardMaterial({
    color: VN_GOLD,
    emissive: VN_GOLD,
    emissiveIntensity: 0.35,
    roughness: 0.35,
    metalness: 0.55,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function buildFlagPlane(
  width: number,
  height: number,
  mat?: THREE.MeshStandardMaterial
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat ?? vietnamFlagMaterial());
  mesh.castShadow = true;
  return mesh;
}

/** Cột cờ nhỏ (tùy chọn rung trong scene). */
export function buildFlagBannerPole(): THREE.Group {
  const pole = new THREE.Group();
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
  const poleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.95, 10), poleMat);
  poleMesh.position.y = 0.48;
  poleMesh.castShadow = true;

  const flag = buildFlagPlane(0.42, 0.28);
  flag.position.set(0, 0.82, 0.02);
  flag.rotation.y = -0.35;

  pole.add(poleMesh, flag);
  return pole;
}
