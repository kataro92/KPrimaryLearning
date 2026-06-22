import * as THREE from 'three';

export const WC_TEXTURE_BASE = `${import.meta.env.BASE_URL}textures/world-cup-2026/`;

const loader = new THREE.TextureLoader();

function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

async function tryLoadTexture(urls: readonly string[]): Promise<THREE.Texture | null> {
  for (const url of urls) {
    try {
      return await loadTexture(url);
    } catch {
      /* try next */
    }
  }
  return null;
}

export interface OptionalWorldTextures {
  sky: THREE.Texture | null;
  grass: THREE.Texture | null;
}

export function configureSkyTexture(tex: THREE.Texture): void {
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  // Panorama crop: center band with sky + stadium roof (readable in side-view play).
  tex.offset.set(0.06, 0.12);
  tex.repeat.set(0.88, 0.78);
}

export async function loadOptionalWorldTextures(): Promise<OptionalWorldTextures> {
  const base = WC_TEXTURE_BASE;
  const [sky, grass] = await Promise.all([
    tryLoadTexture([`${base}sky-stadium.png`, `${base}sky-stadium.webp`]),
    tryLoadTexture([`${base}turf-reference.png`, `${base}turf-reference.webp`]),
  ]);

  if (sky) configureSkyTexture(sky);

  return { sky, grass };
}
