import * as THREE from 'three';
import { fitHumanoidModel, fitModelToHeight, tryLoadGltfScene } from '@/core/assets/fitGltfModel';
import { loadGltfModel } from '@/core/assets/loadGltfModel';
import { clone as cloneSkinnedScene } from 'three/addons/utils/SkeletonUtils.js';
import { enableShadows } from './LightingRig';
import { getMetalMaterial, getNetMaterial } from './MaterialLibrary';
import { makeBallPanelTexture } from './ProceduralTextures';
import {
  BALL_TARGET_HEIGHT,
  defenderPalette,
  gkPalette,
  orientPlayerModel,
  paintBallGlb,
  fitGoalToRect,
  paintGoalGlb,
  paintPlayerGlb,
  strikerPalette,
  type KitPalette,
} from './glbMaterialPaint';
import { bindGlbPlayerAnimations } from './glbPlayerAnim';
import { GLB_PLAYER_CONFIG } from './glbPlayerConfig';
import { GOAL_HEIGHT_SCALE, GOAL_VERTICAL_LIFT, WC_MODEL_BASE } from './sceneConstants';

const BALL_URLS = [`${WC_MODEL_BASE}ball.glb`] as const;
const GOAL_URLS = [`${WC_MODEL_BASE}goal-frame.glb`] as const;

export function buildProceduralBall(): THREE.Group {
  const root = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(0.09, 1);
  const mat = new THREE.MeshStandardMaterial({
    map: makeBallPanelTexture(),
    roughness: 0.32,
    metalness: 0.06,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  root.add(mesh);
  return root;
}

export async function loadBallWithFallback(): Promise<THREE.Group> {
  const loaded = await tryLoadGltfScene(BALL_URLS);
  if (loaded) {
    fitModelToHeight(loaded, BALL_TARGET_HEIGHT);
    paintBallGlb(loaded);
    enableShadows(loaded, true, false);
    const wrap = new THREE.Group();
    wrap.add(loaded);
    wrap.userData.isGlbBall = true;
    return wrap;
  }
  return buildProceduralBall();
}

export interface GoalBuildResult {
  group: THREE.Group;
  netMeshes: THREE.Mesh[];
}

export function buildProceduralGoal(
  topLeft: THREE.Vector3,
  bottomRight: THREE.Vector3
): GoalBuildResult {
  const group = new THREE.Group();
  const w = bottomRight.x - topLeft.x;
  const baseY = bottomRight.y + GOAL_VERTICAL_LIFT;
  const h = (topLeft.y - bottomRight.y) * GOAL_HEIGHT_SCALE;
  const topY = baseY + h;
  const cx = (topLeft.x + bottomRight.x) / 2;
  const cy = (topY + baseY) / 2;
  const postMat = getMetalMaterial();
  const postR = 0.045;
  const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(postR, postR, h, 12), postMat.clone());
  leftPost.position.set(topLeft.x, cy, 0.12);
  leftPost.castShadow = true;
  const rightPost = leftPost.clone();
  rightPost.position.x = bottomRight.x;
  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(postR * 0.9, postR * 0.9, w, 12), postMat.clone());
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(cx, topY, 0.12);
  crossbar.castShadow = true;

  const backMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const backboard = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.95, h * 0.95), backMat);
  backboard.position.set(cx, cy, 0.04);

  const netMat = getNetMaterial();
  const netMeshes: THREE.Mesh[] = [];
  const netCols = 10;
  const netRows = 8;
  for (let i = 0; i <= netCols; i++) {
    const t = i / netCols;
    const x = topLeft.x + w * t;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.015, h), netMat.clone());
    plane.position.set(x, cy, 0.07);
    netMeshes.push(plane);
  }
  for (let j = 0; j <= netRows; j++) {
    const t = j / netRows;
    const y = topY - h * t;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.012), netMat.clone());
    plane.position.set(cx, y, 0.07);
    netMeshes.push(plane);
  }

  group.add(leftPost, rightPost, crossbar, backboard, ...netMeshes);
  return { group, netMeshes };
}

export async function loadGoalWithFallback(
  topLeft: THREE.Vector3,
  bottomRight: THREE.Vector3
): Promise<GoalBuildResult> {
  const loaded = await tryLoadGltfScene(GOAL_URLS);
  if (loaded) {
    const w = bottomRight.x - topLeft.x;
    const h = (topLeft.y - bottomRight.y) * GOAL_HEIGHT_SCALE;
    fitGoalToRect(loaded, w, h);
    paintGoalGlb(loaded);
    loaded.position.set(
      (topLeft.x + bottomRight.x) / 2,
      bottomRight.y + GOAL_VERTICAL_LIFT,
      0.12
    );
    enableShadows(loaded, true, false);
    return { group: loaded, netMeshes: [] };
  }
  return buildProceduralGoal(topLeft, bottomRight);
}

export type PlayerRole = 'striker' | 'defender' | 'gk';

export function repaintPlayerGlb(
  wrapper: THREE.Group,
  role: PlayerRole,
  flag: [string, string, string]
): void {
  if (!wrapper.userData.isGlbPlayer) return;
  const model = wrapper.children[0];
  if (!model) return;
  if (!playerGlbNeedsVertexPaint(model)) return;
  const palette =
    role === 'striker' ? strikerPalette(flag) : role === 'gk' ? gkPalette() : defenderPalette(flag);
  paintPlayerGlb(model, palette, role === 'gk');
}

function playerGlbNeedsVertexPaint(root: THREE.Object3D): boolean {
  let paint = false;
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    const hasMap = mats.some((m) => m instanceof THREE.MeshStandardMaterial && m.map);
    if (!hasMap) paint = true;
  });
  return paint;
}

function cloneGltfAnimations(clips: readonly THREE.AnimationClip[]): THREE.AnimationClip[] {
  return clips.map((clip) => clip.clone());
}

export async function loadPlayerModelWithFallback(
  role: PlayerRole,
  flag: [string, string, string],
  procedural: () => THREE.Group
): Promise<THREE.Group> {
  const url = `${WC_MODEL_BASE}${role}.glb`;
  try {
    const gltf = await loadGltfModel(url);
    const loaded = cloneSkinnedScene(gltf.scene) as THREE.Group;
    loaded.updateMatrixWorld(true);
    const clips = cloneGltfAnimations(gltf.animations);
    const cfg = GLB_PLAYER_CONFIG[role];
    fitHumanoidModel(loaded, cfg.height, cfg.yOffset);
    orientPlayerModel(loaded, role);
    loaded.updateMatrixWorld(true);
    loaded.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh) {
        child.skeleton.update();
        child.updateMatrixWorld(true);
      }
    });
    if (playerGlbNeedsVertexPaint(loaded)) {
      const palette =
        role === 'striker' ? strikerPalette(flag) : role === 'gk' ? gkPalette() : defenderPalette(flag);
      paintPlayerGlb(loaded, palette, role === 'gk');
    }
    enableShadows(loaded, true, false);
    const wrap = new THREE.Group();
    wrap.userData.isGlbPlayer = true;
    wrap.userData.playerRole = role;
    wrap.add(loaded);
    bindGlbPlayerAnimations(wrap, loaded, clips);
    return wrap;
  } catch {
    return procedural();
  }
}

export { strikerPalette, defenderPalette, gkPalette, type KitPalette };
