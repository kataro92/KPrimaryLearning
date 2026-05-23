import * as THREE from 'three';

export type SkinId =
  | 'wood'
  | 'brick'
  | 'roof'
  | 'metal'
  | 'fabric'
  | 'concrete'
  | 'cardboard'
  | 'plastic'
  | 'ceramic'
  | 'leather'
  | 'bamboo'
  | 'bread'
  | 'paper'
  | 'food'
  | 'grass'
  | 'rubber'
  | 'slate';

interface SkinMaps {
  map: THREE.Texture;
  roughnessMap?: THREE.Texture;
}

function baseUrl(file: string): string {
  return `${import.meta.env.BASE_URL}textures/props/${file}`;
}

function repeatTex(tex: THREE.Texture, u = 1, v = 1): THREE.Texture {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(u, v);
  t.needsUpdate = true;
  return t;
}

function canvasTex(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, size = 512): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  draw(ctx, size, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function drawBrick(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#7a4f36';
  ctx.fillRect(0, 0, w, h);
  const bw = 64;
  const bh = 28;
  for (let row = 0; row < Math.ceil(h / bh); row++) {
    const off = row % 2 === 0 ? 0 : bw / 2;
    for (let col = -1; col < Math.ceil(w / bw) + 1; col++) {
      const x = col * bw + off;
      const y = row * bh;
      const shade = 28 + Math.random() * 14;
      ctx.fillStyle = `hsl(22, 38%, ${shade}%)`;
      ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeRect(x + 2, y + 2, bw - 4, bh - 4);
    }
  }
}

function drawFabric(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 6) {
    for (let x = 0; x < w; x += 6) {
      const n = 0.85 + Math.random() * 0.15;
      ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.04})`;
      ctx.fillRect(x, y, 3, 3);
      ctx.fillStyle = `rgba(0,0,0,${0.02 * n})`;
      ctx.fillRect(x + 3, y + 3, 3, 3);
    }
  }
}

function drawPlastic(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#dbeafe');
  g.addColorStop(1, '#93c5fd');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 1200; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
}

function drawCeramic(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#e7e5e4';
  ctx.fillRect(0, 0, w, h);
  const ts = 48;
  for (let y = 0; y < h / ts; y++) {
    for (let x = 0; x < w / ts; x++) {
      ctx.strokeStyle = 'rgba(120,113,108,0.35)';
      ctx.strokeRect(x * ts + 1, y * ts + 1, ts - 2, ts - 2);
      ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.06})`;
      ctx.fillRect(x * ts + 4, y * ts + 4, ts - 8, ts - 8);
    }
  }
}

function drawCardboard(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#c4a574';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(90,60,30,${Math.random() * 0.06})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 1);
  }
  ctx.strokeStyle = 'rgba(60,40,20,0.25)';
  ctx.beginPath();
  ctx.moveTo(w * 0.5, 0);
  ctx.lineTo(w * 0.5, h);
  ctx.stroke();
}

function drawPaper(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#fafaf9';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.025})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
}

function drawBread(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 5000; i++) {
    const r = 180 + Math.random() * 40;
    ctx.fillStyle = `rgba(${r},${100 + Math.random() * 40},20,${0.05 + Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

function drawFood(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3500; i++) {
    ctx.fillStyle = `rgba(180,120,40,${Math.random() * 0.07})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 1);
  }
}

function drawBamboo(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#84cc16';
  ctx.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 28) {
    ctx.strokeStyle = 'rgba(22,101,52,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    for (let y = 20; y < h; y += 45) {
      ctx.fillStyle = 'rgba(22,101,52,0.35)';
      ctx.fillRect(x - 4, y, 8, 3);
    }
  }
}

function drawGrass(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 8000; i++) {
    ctx.strokeStyle = `rgba(134,239,172,${0.15 + Math.random() * 0.25})`;
    ctx.beginPath();
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 4 - Math.random() * 6);
    ctx.stroke();
  }
}

function drawRubber(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#374151';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

function drawLeather(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 2);
  }
}

function drawSlate(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 1);
  }
}

/** Nâng độ sáng + phát quang nhẹ (giữ đồ vật nổi trên nền tối). */
function previewTint(color: THREE.Color): THREE.Color {
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  hsl.l = Math.max(hsl.l, 0.38);
  hsl.s = Math.min(hsl.s * 0.92 + 0.04, 1);
  return new THREE.Color().setHSL(hsl.h, hsl.s, Math.min(hsl.l + 0.06, 0.9));
}

class PropTextureLibrary {
  private readonly loader = new THREE.TextureLoader();
  private readonly skins = new Map<SkinId, SkinMaps>();
  private loadPromise: Promise<void> | null = null;
  private ready = false;

  isReady(): boolean {
    return this.ready;
  }

  loadAll(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = this.loadInternal();
    return this.loadPromise;
  }

  private async loadInternal(): Promise<void> {
    const filePairs: Array<[SkinId, string, string?]> = [
      ['wood', 'wood.jpg', 'wood_rough.jpg'],
      ['metal', 'metal.jpg', 'metal_rough.jpg'],
      ['concrete', 'concrete.jpg', 'concrete_rough.jpg'],
      ['roof', 'roof.jpg', 'roof_rough.jpg'],
    ];

    await Promise.all(
      filePairs.map(async ([id, diff, rough]) => {
        const [map, roughnessMap] = await Promise.all([
          this.loadImage(baseUrl(diff)),
          rough ? this.loadImage(baseUrl(rough)) : Promise.resolve(undefined),
        ]);
        this.skins.set(id, { map, roughnessMap });
      })
    );

    this.skins.set('brick', { map: canvasTex(drawBrick) });
    this.skins.set('fabric', { map: canvasTex(drawFabric) });
    this.skins.set('plastic', { map: canvasTex(drawPlastic) });
    this.skins.set('ceramic', { map: canvasTex(drawCeramic) });
    this.skins.set('cardboard', { map: canvasTex(drawCardboard) });
    this.skins.set('paper', { map: canvasTex(drawPaper) });
    this.skins.set('bread', { map: canvasTex(drawBread) });
    this.skins.set('food', { map: canvasTex(drawFood) });
    this.skins.set('bamboo', { map: canvasTex(drawBamboo) });
    this.skins.set('grass', { map: canvasTex(drawGrass) });
    this.skins.set('rubber', { map: canvasTex(drawRubber) });
    this.skins.set('leather', { map: canvasTex(drawLeather) });
    this.skins.set('slate', { map: canvasTex(drawSlate) });

    this.ready = true;
  }

  private loadImage(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (tex) => {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }

  createSkinnedMaterial(
    skinId: SkinId,
    source: THREE.MeshStandardMaterial,
    mesh: THREE.Mesh
  ): THREE.MeshStandardMaterial {
    const skin = this.skins.get(skinId) ?? this.skins.get('wood')!;
    const span = this.meshSpan(mesh);
    const rep = Math.max(0.35, Math.min(span * 1.4, 3.2));

    const hsl = { h: 0, s: 0, l: 0 };
    source.color.getHSL(hsl);
    const color =
      hsl.s > 0.42 ? new THREE.Color().setHSL(hsl.h, hsl.s, Math.max(hsl.l, 0.42)) : previewTint(source.color);

    const mat = new THREE.MeshStandardMaterial({
      color,
      map: repeatTex(skin.map, rep, rep),
      roughnessMap: skin.roughnessMap ? repeatTex(skin.roughnessMap, rep, rep) : undefined,
      roughness: skin.roughnessMap ? 1 : source.roughness ?? 0.55,
      metalness: source.metalness ?? 0.08,
      emissive: previewTint(source.emissive),
      emissiveIntensity: Math.min(source.emissiveIntensity * 0.65, 0.28),
    });
    return mat;
  }

  createGlassMaterial(_source: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xc7e8ff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.08,
      metalness: 0.05,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.12,
      envMapIntensity: 1.2,
    });
  }

  createMetalMaterial(source: THREE.MeshStandardMaterial, mesh: THREE.Mesh): THREE.MeshStandardMaterial {
    return this.createSkinnedMaterial('metal', source, mesh);
  }

  createAccentMaterial(source: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: previewTint(source.color),
      roughness: 0.35,
      metalness: source.metalness > 0.4 ? 0.72 : 0.18,
      emissive: previewTint(source.emissive),
      emissiveIntensity: Math.min(source.emissiveIntensity * 0.8, 0.35),
    });
  }

  private meshSpan(mesh: THREE.Mesh): number {
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    return Math.max(size.x, size.y, size.z, 0.12);
  }

  dispose(): void {
    this.skins.forEach(({ map, roughnessMap }) => {
      map.dispose();
      roughnessMap?.dispose();
    });
    this.skins.clear();
    this.ready = false;
    this.loadPromise = null;
  }
}

export const propTextureLibrary = new PropTextureLibrary();

export function preloadPropTextures(): Promise<void> {
  return propTextureLibrary.loadAll();
}
