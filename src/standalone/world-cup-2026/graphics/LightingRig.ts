import * as THREE from 'three';
import { getTierProfile } from '@/core/rendering/qualityTier';

export interface LightingRigLights {
  ambient: THREE.AmbientLight;
  hemi: THREE.HemisphereLight;
  sun: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
  rim: THREE.DirectionalLight;
  key: THREE.PointLight;
  strikerLight: THREE.PointLight;
  defenderLight: THREE.PointLight;
}

export interface LightingRig {
  lights: LightingRigLights;
  root: THREE.Group;
}

export function configureRenderer(renderer: THREE.WebGLRenderer): void {
  // DPR + đổ bóng theo tầng phần cứng (xem qualityTier).
  const profile = getTierProfile();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.dprCap));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = profile.shadowsEnabled;
  if (profile.shadowsEnabled) renderer.shadowMap.type = profile.shadowMapType;
}

export function createLightingRig(): LightingRig {
  const root = new THREE.Group();
  const ambient = new THREE.AmbientLight(0xffffff, 0.38);
  const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x14532d, 0.48);
  const sun = new THREE.DirectionalLight(0xfff7ed, 1.05);
  sun.position.set(-4, 8, 6);
  sun.castShadow = true;
  const shadowSize = getTierProfile().shadowMapSize;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.02;

  const fill = new THREE.DirectionalLight(0x93c5fd, 0.28);
  fill.position.set(5, 2, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(0, 4, -5);
  const key = new THREE.PointLight(0xfffbeb, 0.42, 20, 1.8);
  key.position.set(-1.5, 1.2, 4);
  const strikerLight = new THREE.PointLight(0x93c5fd, 0.32, 7, 2);
  const defenderLight = new THREE.PointLight(0xfca5a5, 0.26, 7, 2);

  root.add(ambient, hemi, sun, fill, rim, key, strikerLight, defenderLight);
  return {
    root,
    lights: { ambient, hemi, sun, fill, rim, key, strikerLight, defenderLight },
  };
}

export function enableShadows(object: THREE.Object3D, cast: boolean, receive: boolean): void {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = cast;
    child.receiveShadow = receive;
  });
}

export function applyStadiumFlash(lights: LightingRigLights, intensity: number): void {
  lights.key.intensity = 0.42 + intensity * 0.85;
  lights.sun.intensity = 1.05 + intensity * 0.35;
}

export function applyWrongAnswerDim(lights: LightingRigLights, dim: number): void {
  const d = 1 - dim * 0.35;
  lights.ambient.intensity = 0.38 * d;
  lights.sun.intensity = 1.05 * d;
}
