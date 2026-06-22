/**
 * Sân cỏ + vạch kẻ — hai layer hình thang tách biệt (cùng kích thước sân).
 * Cỏ dùng MeshBasicMaterial để texture luôn hiển thị rõ, không phụ thuộc lighting.
 */

import * as THREE from 'three';
import { buildRegulationPitchMarkings } from './pitchGeometry';
import {
  buildTrapezoidPitchGeometry,
  pitchGrassHeightFromGrid,
  pitchRectWidthFromGrid,
  PITCH_PERSPECTIVE,
} from './pitchPerspective';
import { makeGrassTexture } from './ProceduralTextures';
import { PITCH_NY_BOTTOM, PITCH_NY_CENTER, PITCH_NY_TOP } from './sceneConstants';
import { SCREEN_GRID } from './screenGridLayout';

export const PITCH_LAYER_Z = {
  contactShadow: 0.035,
  grass: 0.05,
  markings: 0.1,
} as const;

/** Z offset vạch trong group markings (trên mặt cỏ). */
export const PITCH_MARKINGS_LOCAL_Z = 0.012;

export interface PitchTrapezoidSpec {
  widthFar: number;
  widthNear: number;
  height: number;
  centerY: number;
}

export interface PitchLayerStack {
  root: THREE.Group;
  grassLayer: THREE.Mesh;
  markingsLayer: THREE.Group;
  contactShadow: THREE.Mesh;
}

export function computePitchTrapezoidSpec(
  normToWorld: (nx: number, ny: number) => THREE.Vector3
): PitchTrapezoidSpec {
  const pitchTopY = normToWorld(0.5, PITCH_NY_TOP).y;
  const pitchBottomY = normToWorld(0.5, PITCH_NY_BOTTOM).y;
  const height = pitchGrassHeightFromGrid(Math.abs(pitchTopY - pitchBottomY));
  const centerY = (pitchTopY + pitchBottomY) / 2;
  const pitchWorldW =
    normToWorld(SCREEN_GRID.pitch.nxMax, PITCH_NY_CENTER).x -
    normToWorld(SCREEN_GRID.pitch.nxMin, PITCH_NY_CENTER).x;
  const rectW = pitchRectWidthFromGrid(pitchWorldW);

  return {
    widthFar: rectW * PITCH_PERSPECTIVE.widthFar,
    widthNear: rectW * PITCH_PERSPECTIVE.widthNear,
    height,
    centerY,
  };
}

function configurePitchGrassMap(tex: THREE.Texture, maxAnisotropy: number): void {
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(1, 1);
  tex.offset.set(0, 0);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
}

export function createPitchGrassMaterial(
  grassTex: THREE.Texture | null | undefined,
  maxAnisotropy = 1
): THREE.MeshBasicMaterial {
  if (grassTex) {
    configurePitchGrassMap(grassTex, maxAnisotropy);
    return new THREE.MeshBasicMaterial({
      map: grassTex,
      toneMapped: true,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
  }

  const procedural = makeGrassTexture();
  procedural.wrapS = THREE.ClampToEdgeWrapping;
  procedural.wrapT = THREE.ClampToEdgeWrapping;
  procedural.repeat.set(1, 1);
  return new THREE.MeshBasicMaterial({
    map: procedural,
    toneMapped: true,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
  });
}

export function buildPitchGrassLayer(
  spec: PitchTrapezoidSpec,
  grassTex?: THREE.Texture | null,
  maxAnisotropy = 1
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    buildTrapezoidPitchGeometry(spec.widthFar, spec.widthNear, spec.height),
    createPitchGrassMaterial(grassTex, maxAnisotropy)
  );
  mesh.name = 'wc-pitch-grass-layer';
  mesh.position.set(0, spec.centerY, PITCH_LAYER_Z.grass);
  mesh.renderOrder = 2;
  return mesh;
}

export function buildPitchMarkingsLayer(
  normToWorld: (nx: number, ny: number) => THREE.Vector3
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'wc-pitch-markings-layer';
  group.position.z = PITCH_LAYER_Z.markings;
  buildRegulationPitchMarkings(group, normToWorld);
  group.renderOrder = 3;
  return group;
}

export function buildPitchContactShadow(spec: PitchTrapezoidSpec): THREE.Mesh {
  const mesh = new THREE.Mesh(
    buildTrapezoidPitchGeometry(spec.widthFar * 0.98, spec.widthNear * 0.98, spec.height * 0.98),
    new THREE.MeshBasicMaterial({
      color: 0x052e16,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    })
  );
  mesh.name = 'wc-pitch-contact-shadow';
  mesh.position.set(0, spec.centerY, PITCH_LAYER_Z.contactShadow);
  mesh.renderOrder = 1;
  return mesh;
}

export function buildPitchLayerStack(
  normToWorld: (nx: number, ny: number) => THREE.Vector3,
  grassTex?: THREE.Texture | null,
  maxAnisotropy = 1
): PitchLayerStack {
  const spec = computePitchTrapezoidSpec(normToWorld);
  const root = new THREE.Group();
  root.name = 'wc-pitch-stack';

  const contactShadow = buildPitchContactShadow(spec);
  const grassLayer = buildPitchGrassLayer(spec, grassTex, maxAnisotropy);
  const markingsLayer = buildPitchMarkingsLayer(normToWorld);

  root.add(contactShadow, grassLayer, markingsLayer);

  return { root, grassLayer, markingsLayer, contactShadow };
}
