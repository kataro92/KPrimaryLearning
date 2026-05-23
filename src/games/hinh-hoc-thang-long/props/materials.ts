import * as THREE from 'three';

/** Nâng độ sáng + phát quang nhẹ để đồ vật không chìm vào nền tối. */
function previewSurface(color: number): {
  color: number;
  emissive: number;
  emissiveIntensity: number;
} {
  const base = new THREE.Color(color);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  hsl.l = Math.max(hsl.l, 0.42);
  hsl.s = Math.min(hsl.s * 0.92 + 0.06, 1);
  const lit = new THREE.Color().setHSL(hsl.h, hsl.s, Math.min(hsl.l + 0.08, 0.88));
  const emissive = lit.clone().lerp(new THREE.Color(0xffffff), 0.35);
  const emissiveIntensity = 0.18 + (1 - hsl.l) * 0.22;
  return {
    color: lit.getHex(),
    emissive: emissive.getHex(),
    emissiveIntensity: Math.min(emissiveIntensity, 0.42),
  };
}

export class MatBag {
  private readonly cache = new Map<string, THREE.MeshStandardMaterial>();

  std(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
    const glow = previewSurface(color);
    const key = `${glow.color}-${glow.emissive}-${glow.emissiveIntensity}-${JSON.stringify(opts)}`;
    let mat = this.cache.get(key);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        color: glow.color,
        emissive: glow.emissive,
        emissiveIntensity: glow.emissiveIntensity,
        roughness: 0.52,
        metalness: 0.1,
        ...opts,
      });
      if (opts.emissive !== undefined) mat.emissive.set(opts.emissive);
      if (opts.emissiveIntensity !== undefined) mat.emissiveIntensity = opts.emissiveIntensity;
      if (opts.color !== undefined) mat.color.set(opts.color);
      this.cache.set(key, mat);
    }
    return mat;
  }

  dispose(): void {
    this.cache.forEach((m) => m.dispose());
    this.cache.clear();
  }
}

export const C = {
  brick: 0xc48a5a,
  wood: 0x8b5a34,
  woodLight: 0xb8895a,
  tile: 0xb45309,
  gold: 0xfde047,
  glass: 0x93c5fd,
  cream: 0xfff7ed,
  green: 0x6ee7a0,
  red: 0xf87171,
  blue: 0x60a5fa,
  yellow: 0xfef08a,
  pink: 0xf9a8d4,
  brown: 0x92400e,
  slate: 0x64748b,
  white: 0xf8fafc,
  black: 0x334155,
  orange: 0xfb923c,
  purple: 0xc084fc,
} as const;
