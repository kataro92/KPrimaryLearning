import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { fitModelToHeight, tryLoadGltfScene } from '@/core/assets/fitGltfModel';
import type { ObjectShape } from '../objectBank';
import { orientPropForShape } from './orientProp';

const BASE = import.meta.env.BASE_URL;
const PROP_TARGET_HEIGHT = 1.55;

const templateCache = new Map<string, THREE.Group>();

function propUrls(builderId: string): string[] {
  return [
    `${BASE}models/hinh-hoc-thang-long/props/${builderId}.glb`,
    `${BASE}models/hinh-hoc-thang-long/props/${builderId}/scene.gltf`,
  ];
}

/** Tải GLTF theo builder (nếu có trong public/models) — null nếu thiếu file. */
export async function loadPropGltfTemplate(builderId: string): Promise<THREE.Group | null> {
  if (templateCache.has(builderId)) return templateCache.get(builderId)!;

  const root = await tryLoadGltfScene(propUrls(builderId));
  if (!root) return null;

  fitModelToHeight(root, PROP_TARGET_HEIGHT, 0.08);
  templateCache.set(builderId, root);
  return root;
}

export function clonePropGltf(template: THREE.Group, shape: ObjectShape): THREE.Group {
  const clone = template.clone(true);
  orientPropForShape(clone, shape);
  return clone;
}

export function disposePropGltfTemplate(builderId: string): void {
  const t = templateCache.get(builderId);
  if (!t) return;
  disposeObject3D(t);
  templateCache.delete(builderId);
}

export function clearPropGltfCache(): void {
  for (const id of [...templateCache.keys()]) disposePropGltfTemplate(id);
}
