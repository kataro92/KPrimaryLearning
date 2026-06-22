import * as THREE from 'three';
import { makeGrassNormalMap, makeGrassTexture } from './ProceduralTextures';

let grassMat: THREE.MeshStandardMaterial | null = null;
let lineMat: THREE.MeshStandardMaterial | null = null;
let metalMat: THREE.MeshStandardMaterial | null = null;
let netMat: THREE.MeshStandardMaterial | null = null;

export function getGrassMaterial(grassMap?: THREE.Texture): THREE.MeshStandardMaterial {
  if (grassMap) {
    return new THREE.MeshStandardMaterial({
      map: grassMap,
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.02,
    });
  }
  if (grassMat) return grassMat;
  const mat = new THREE.MeshStandardMaterial({
    map: makeGrassTexture(),
    normalMap: makeGrassNormalMap(),
    normalScale: new THREE.Vector2(0.35, 0.35),
    color: 0xffffff,
    roughness: 0.88,
    metalness: 0.02,
  });
  if (!grassMap) grassMat = mat;
  return mat;
}

export function getLineMaterial(): THREE.MeshStandardMaterial {
  if (lineMat) return lineMat;
  lineMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.08,
    roughness: 0.55,
    metalness: 0,
    transparent: true,
    opacity: 0.92,
  });
  return lineMat;
}

export function getMetalMaterial(tone: number = 0xf8fafc): THREE.MeshStandardMaterial {
  if (!metalMat) {
    metalMat = new THREE.MeshStandardMaterial({
      color: tone,
      metalness: 0.55,
      roughness: 0.28,
    });
  }
  return metalMat;
}

export function getNetMaterial(): THREE.MeshStandardMaterial {
  if (netMat) return netMat;
  netMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.9,
    metalness: 0,
  });
  return netMat;
}

export function getSkinMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.48,
    metalness: 0.02,
  });
}
