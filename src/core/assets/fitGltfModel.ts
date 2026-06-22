import * as THREE from 'three';
import { loadGltfModel } from './loadGltfModel';

/** Clone a loaded glTF scene so cached loads can be scaled/painted independently. */
export function cloneGltfScene(source: THREE.Object3D): THREE.Group {
  return source.clone(true) as THREE.Group;
}

/** Try loading glTF/GLB URLs in order; returns a fresh scene clone or null. */
export async function tryLoadGltfScene(urls: readonly string[]): Promise<THREE.Group | null> {
  for (const url of urls) {
    try {
      const gltf = await loadGltfModel(url);
      return cloneGltfScene(gltf.scene);
    } catch {
      // try next candidate
    }
  }
  return null;
}

/** Uniform-scale and center a model so its bounding box fits the target height (max axis). */
export function fitModelToHeight(model: THREE.Object3D, targetHeight: number, yOffset = 0): void {
  model.scale.set(1, 1, 1);
  model.position.set(0, 0, 0);
  model.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const scale = targetHeight / maxDim;
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));
  model.position.y += yOffset;
}

/** Scale by Y height, center X/Z, place feet on local y = 0. */
export function fitHumanoidModel(model: THREE.Object3D, targetHeight: number, yOffset = 0): void {
  model.scale.set(1, 1, 1);
  model.position.set(0, 0, 0);
  model.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const scale = targetHeight / Math.max(size.y, 0.001);
  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);

  const fitted = new THREE.Box3().setFromObject(model);
  const center = fitted.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= fitted.min.y;
  model.position.y += yOffset;
}
