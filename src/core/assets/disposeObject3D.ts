import * as THREE from 'three';

/** Dispose mesh geometries/materials (and textures on standard materials). */
export function disposeObject3D(obj: THREE.Object3D): void {
  obj.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    node.geometry.dispose();
    const mat = node.material;
    const mats = Array.isArray(mat) ? mat : [mat];
    for (const m of mats) {
      m.dispose();
      for (const key of Object.keys(m) as (keyof THREE.Material)[]) {
        const val = m[key];
        if (val instanceof THREE.Texture) val.dispose();
      }
    }
  });
}
