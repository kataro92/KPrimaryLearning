import * as THREE from 'three';
import type { SceneHost } from '@/core/rendering/sceneHost';
import type { FeedbackKind } from '@/features/speech/interactiveText';

interface Burst {
  group: THREE.Group;
  startedAt: number;
  durationMs: number;
  kind: Exclude<FeedbackKind, 'start'>;
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export class StageFeedback3DFx {
  private root = new THREE.Group();
  private bursts: Burst[] = [];
  private rafId = 0;
  private running = false;

  constructor(private sceneHost: SceneHost) {
    this.sceneHost.addToOverlay(this.root);
  }

  trigger(kind: Exclude<FeedbackKind, 'start'>, durationMs = 520): void {
    if (!this.root.parent) {
      this.sceneHost.addToOverlay(this.root);
    }
    const burst = this.makeBurst(kind, durationMs);
    this.root.add(burst.group);
    this.bursts.push(burst);
    if (!this.running) {
      this.running = true;
      this.rafId = requestAnimationFrame(this.loop);
    }
  }

  dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.running = false;
    while (this.root.children.length > 0) {
      const obj = this.root.children[0]!;
      this.root.remove(obj);
      this.disposeObject(obj);
    }
  }

  private loop = () => {
    const now = performance.now();
    this.bursts = this.bursts.filter((b) => {
      const t = Math.min(1, (now - b.startedAt) / b.durationMs);
      const alive = t < 1;
      this.updateBurst(b, t);
      if (!alive) {
        this.root.remove(b.group);
        this.disposeObject(b.group);
      }
      return alive;
    });

    if (this.bursts.length > 0) {
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      this.running = false;
    }
  };

  private makeBurst(kind: Exclude<FeedbackKind, 'start'>, durationMs: number): Burst {
    const group = new THREE.Group();
    group.position.set(randomRange(-0.55, 0.55), randomRange(-0.1, 0.45), 0.6);

    const color =
      kind === 'correct' ? 0x22c55e : kind === 'wrong' ? 0xef4444 : 0x38bdf8;
    const accent =
      kind === 'correct' ? 0xfacc15 : kind === 'wrong' ? 0xfb7185 : 0x93c5fd;

    for (let i = 0; i < 12; i++) {
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(randomRange(0.04, 0.085), 0),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? color : accent,
          transparent: true,
          opacity: 1,
        })
      );
      mesh.position.set(randomRange(-0.06, 0.06), randomRange(-0.06, 0.06), randomRange(-0.08, 0.08));
      mesh.userData.vel = new THREE.Vector3(randomRange(-0.02, 0.02), randomRange(0.01, 0.04), randomRange(-0.01, 0.01));
      group.add(mesh);
    }

    return {
      group,
      startedAt: performance.now(),
      durationMs,
      kind,
    };
  }

  private updateBurst(burst: Burst, t: number): void {
    const fade = 1 - t;
    burst.group.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      const vel = mesh.userData.vel as THREE.Vector3;
      mesh.position.add(vel);
      mesh.rotation.x += 0.08;
      mesh.rotation.y += 0.06;
      mesh.scale.setScalar(1 + t * 0.45);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade;
    });
    burst.group.position.y += burst.kind === 'wrong' ? -0.001 : 0.001;
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
        const mat = node.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
  }
}
