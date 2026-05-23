import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cache = new Map<string, Promise<GLTF>>();

/** Load a glTF/GLB from `public/` (Vite root-relative URL). Results are cached per URL. */
export function loadGltfModel(url: string): Promise<GLTF> {
  let pending = cache.get(url);
  if (!pending) {
    pending = loader.loadAsync(url);
    pending.catch(() => {
      cache.delete(url);
    });
    cache.set(url, pending);
  }
  return pending;
}

export function clearGltfModelCache(url?: string): void {
  if (url) cache.delete(url);
  else cache.clear();
}
