import * as THREE from 'three';
import { DEFENDER_BASE, GOAL_RECT } from './sceneConstants';

export interface VfxHandles {
  root: THREE.Group;
  hitFlash: THREE.Mesh;
  kickFlash: THREE.Mesh;
  trail: THREE.Mesh;
  kickBurst: THREE.Points;
  confetti: THREE.InstancedMesh;
  blockRing: THREE.Mesh;
}

const CONFETTI_COUNT = 48;

export function createVfxSystem(): VfxHandles {
  const root = new THREE.Group();

  const trail = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0 })
  );

  const hitFlash = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 16),
    new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0 })
  );
  hitFlash.position.z = 0.15;

  const kickFlash = new THREE.Mesh(
    new THREE.CircleGeometry(0.1, 12),
    new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0 })
  );
  kickFlash.position.z = 0.17;

  const blockRing = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.28, 20),
    new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  blockRing.position.z = 0.16;

  const burstGeo = new THREE.BufferGeometry();
  const burstCount = 24;
  const burstPos = new Float32Array(burstCount * 3);
  burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
  const kickBurst = new THREE.Points(
    burstGeo,
    new THREE.PointsMaterial({ color: 0x86efac, size: 0.04, transparent: true, opacity: 0 })
  );

  const confGeo = new THREE.PlaneGeometry(0.06, 0.04);
  const confMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide });
  const confetti = new THREE.InstancedMesh(confGeo, confMat, CONFETTI_COUNT);
  const colors = [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e, 0xa855f7];
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const dummy = new THREE.Object3D();
    dummy.position.set(0, -10, 0);
    dummy.updateMatrix();
    confetti.setMatrixAt(i, dummy.matrix);
    confetti.setColorAt(i, new THREE.Color(colors[i % colors.length]!));
  }
  confetti.instanceMatrix.needsUpdate = true;
  if (confetti.instanceColor) confetti.instanceColor.needsUpdate = true;

  root.add(trail, hitFlash, kickFlash, blockRing, kickBurst, confetti);
  return { root, hitFlash, kickFlash, trail, kickBurst, confetti, blockRing };
}

export function makeBlobShadow(radius = 0.18): THREE.Mesh {
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 16),
    new THREE.MeshBasicMaterial({ color: 0x052e16, transparent: true, opacity: 0.38 })
  );
  shadow.position.z = 0.02;
  shadow.scale.y = 0.45;
  return shadow;
}

export interface VfxUpdateState {
  kickFlashT: number;
  hitFlash: number;
  trailIntensity: number;
  phase: string;
  ballX: number;
  ballY: number;
  blockRingT: number;
  confettiT: number;
  celebrate: number;
}

export function updateVfx(
  vfx: VfxHandles,
  state: VfxUpdateState,
  normToWorld: (nx: number, ny: number) => THREE.Vector3
): void {
  const ballPos = normToWorld(state.ballX, state.ballY);

  vfx.trail.visible = state.trailIntensity > 0 && state.phase === 'flying';
  if (vfx.trail.visible) {
    const trailPos = normToWorld(state.ballX - 0.03, state.ballY);
    vfx.trail.position.set(trailPos.x, trailPos.y, 0.1);
    (vfx.trail.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(Date.now() * 0.02) * 0.15;
  }

  vfx.hitFlash.visible = state.hitFlash > 0;
  if (vfx.hitFlash.visible) {
    const flashPos = normToWorld(DEFENDER_BASE.x - 0.02, DEFENDER_BASE.y);
    vfx.hitFlash.position.set(flashPos.x, flashPos.y, 0.16);
    (vfx.hitFlash.material as THREE.MeshBasicMaterial).opacity = state.hitFlash * 0.75;
  }

  vfx.kickFlash.visible = state.kickFlashT > 0;
  if (vfx.kickFlash.visible) {
    vfx.kickFlash.position.set(ballPos.x, ballPos.y, 0.18);
    (vfx.kickFlash.material as THREE.MeshBasicMaterial).opacity = state.kickFlashT * 0.9;
    const s = 1 + (1 - state.kickFlashT) * 1.2;
    vfx.kickFlash.scale.set(s, s, 1);
  }

  vfx.blockRing.visible = state.blockRingT > 0;
  if (vfx.blockRing.visible) {
    const p = normToWorld(DEFENDER_BASE.x - 0.02, DEFENDER_BASE.y);
    vfx.blockRing.position.set(p.x, p.y, 0.16);
    const mat = vfx.blockRing.material as THREE.MeshBasicMaterial;
    mat.opacity = state.blockRingT * 0.65;
    const sc = 1 + (1 - state.blockRingT) * 1.8;
    vfx.blockRing.scale.set(sc, sc, 1);
  }

  const burstMat = vfx.kickBurst.material as THREE.PointsMaterial;
  if (state.kickFlashT > 0.5) {
    burstMat.opacity = (state.kickFlashT - 0.5) * 1.4;
    const attr = vfx.kickBurst.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      const a = (i / attr.count) * Math.PI * 2;
      const r = (1 - state.kickFlashT) * 0.35;
      attr.setXYZ(i, ballPos.x + Math.cos(a) * r, ballPos.y + Math.sin(a) * r * 0.5, 0.15);
    }
    attr.needsUpdate = true;
    vfx.kickBurst.position.set(0, 0, 0);
  } else {
    burstMat.opacity = 0;
  }

  const confMat = vfx.confetti.material as THREE.MeshBasicMaterial;
  confMat.opacity = state.confettiT > 0 ? Math.min(1, state.confettiT * 2) : 0;
  if (state.confettiT > 0) {
    const dummy = new THREE.Object3D();
    const goalPos = normToWorld(
      (GOAL_RECT.nxMin + GOAL_RECT.nxMax) * 0.5,
      (GOAL_RECT.nyMin + GOAL_RECT.nyMax) * 0.5
    );
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const t = state.confettiT;
      const spread = t * 2.5;
      dummy.position.set(
        goalPos.x + (Math.sin(i * 1.7) * spread * 0.35),
        goalPos.y + t * 1.2 + (i % 7) * 0.04 - Math.sin(t * 4 + i) * 0.15,
        0.2 + (i % 5) * 0.02
      );
      dummy.rotation.z = t * 3 + i;
      dummy.updateMatrix();
      vfx.confetti.setMatrixAt(i, dummy.matrix);
    }
    vfx.confetti.instanceMatrix.needsUpdate = true;
  }
}

export function triggerConfetti(state: { confettiT: number }): void {
  state.confettiT = 1;
}

export function tickConfetti(state: { confettiT: number }, dt = 0.016): void {
  if (state.confettiT > 0) state.confettiT = Math.max(0, state.confettiT - dt * 0.45);
}

export function triggerBlockRing(state: { blockRingT: number }): void {
  state.blockRingT = 1;
}

export function tickBlockRing(state: { blockRingT: number }, dt = 0.016): void {
  if (state.blockRingT > 0) state.blockRingT = Math.max(0, state.blockRingT - dt * 2.2);
}

export function shakeCameraOffset(intensity: number): { x: number; y: number } {
  return {
    x: (Math.random() - 0.5) * intensity * 0.08,
    y: (Math.random() - 0.5) * intensity * 0.05,
  };
}

export function animateGoalNet(netMeshes: THREE.Mesh[], shake: number, t: number): void {
  for (let i = 0; i < netMeshes.length; i++) {
    const mesh = netMeshes[i]!;
    mesh.position.z = 0.07 + Math.sin(t * 24 + i * 0.4) * shake * 0.015;
    mesh.rotation.z = Math.sin(t * 18 + i * 0.2) * shake * 0.04;
  }
}
