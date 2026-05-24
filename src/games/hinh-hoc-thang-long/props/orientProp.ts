import * as THREE from 'three';
import type { ObjectShape } from '../objectBank';

type FaceCandidate = { rotX: number; rotY: number; w: number; h: number };

/** Xoay đồ vật để mặt đặc trưng (vuông / chữ nhật / tam giác) hướng về camera. */
export function orientPropForShape(group: THREE.Group, shape: ObjectShape): void {
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const sz = box.getSize(new THREE.Vector3());

  const faces: FaceCandidate[] = [
    { rotX: 0, rotY: 0, w: sz.x, h: sz.y },
    { rotX: -Math.PI / 2, rotY: 0, w: sz.x, h: sz.z },
    { rotX: 0, rotY: Math.PI / 2, w: sz.y, h: sz.z },
  ];

  const score = (c: FaceCandidate): number => {
    const min = Math.min(c.w, c.h);
    const max = Math.max(c.w, c.h);
    const ratio = max / Math.max(min, 0.001);
    const area = c.w * c.h;
    if (shape === 'square') {
      return Math.abs(c.w - c.h) - area * 0.002;
    }
    if (shape === 'rect') {
      return Math.abs(ratio - 1.65) - area * 0.0015;
    }
    return Math.abs(ratio - 1) * 0.6 + Math.abs(ratio - 1.65) * 0.4 - area * 0.001;
  };

  let best = faces[0]!;
  let bestScore = score(best);
  for (const c of faces) {
    const s = score(c);
    if (s < bestScore) {
      bestScore = s;
      best = c;
    }
  }

  group.rotation.x = best.rotX;
  if (shape === 'triangle') {
    group.rotation.x -= 0.22;
  }
}
