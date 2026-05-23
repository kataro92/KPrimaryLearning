import * as THREE from 'three';
import { loadGltfModel } from './loadGltfModel';

/** Try loading glTF/GLB URLs in order; returns the scene root or null. */
export async function tryLoadGltfScene(urls: readonly string[]): Promise<THREE.Group | null> {
  for (const url of urls) {
    try {
      const gltf = await loadGltfModel(url);
      return gltf.scene;
    } catch {
      // try next candidate
    }
  }
  return null;
}

/** Uniform-scale and center a model so its bounding box fits the target height. */
export function fitModelToHeight(model: THREE.Object3D, targetHeight: number, yOffset = 0): void {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const scale = targetHeight / maxDim;
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));
  model.position.y += yOffset;
}
