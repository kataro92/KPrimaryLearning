import * as THREE from 'three';
import { gameSpriteDataUrl } from '@/assets/gameSprites';

const textureCache = new Map<string, THREE.Texture>();

export function loadGameSpriteTexture(gameId: string): THREE.Texture {
  const cached = textureCache.get(gameId);
  if (cached) return cached;

  const loader = new THREE.TextureLoader();
  const tex = loader.load(gameSpriteDataUrl(gameId));
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(gameId, tex);
  return tex;
}

/** Mascot 2D phía sau HUD trên canvas Three.js */
export function createSpritePlane(gameId: string): THREE.Mesh {
  const tex = loadGameSpriteTexture(gameId);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.2), mat);
  mesh.position.set(0, 0.2, -0.5);
  mesh.renderOrder = -1;
  return mesh;
}
