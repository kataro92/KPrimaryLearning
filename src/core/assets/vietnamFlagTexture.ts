import * as THREE from 'three';

let cached: THREE.CanvasTexture | null = null;

/** Cờ Việt Nam — đỏ #DA251D, sao vàng #FFCD00, tỉ lệ 3:2. */
export function getVietnamFlagTexture(): THREE.CanvasTexture {
  if (cached) return cached;
  const w = 300;
  const h = 200;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#DA251D';
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.5;
    const cy = h * 0.5;
    const outerR = h * 0.32;
    const innerR = outerR * 0.382;
    ctx.fillStyle = '#FFCD00';
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
  cached = new THREE.CanvasTexture(canvas);
  cached.colorSpace = THREE.SRGBColorSpace;
  return cached;
}

export function vietnamFlagMaterial(
  opts: Partial<THREE.MeshStandardMaterialParameters> = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: getVietnamFlagTexture(),
    roughness: 0.62,
    metalness: 0.04,
    side: THREE.DoubleSide,
    ...opts,
  });
}
