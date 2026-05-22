import * as THREE from 'three';
import type { SceneHost } from '@/core/rendering/sceneHost';

const BIN_POSITIONS: Record<'dong-vat' | 'thuc-vat' | 'hien-tuong', THREE.Vector3> = {
  'dong-vat': new THREE.Vector3(-1.8, -0.55, 0.2),
  'thuc-vat': new THREE.Vector3(0, -0.9, -0.05),
  'hien-tuong': new THREE.Vector3(1.8, -0.55, 0.2),
};

function colorFromSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return new THREE.Color(`hsl(${hue}, 72%, 58%)`).getHex();
}

export class CuuLongSelectionFx3D {
  private readonly root = new THREE.Group();
  private readonly binTargets = new Map<string, THREE.Group>();
  private readonly cargo: THREE.Group;
  private readonly cargoMesh: THREE.Mesh;
  private readonly startPos = new THREE.Vector3(-3, 0.25, 0.9);
  private rafTime = 0;
  private anim:
    | {
        binId: string;
        to: THREE.Vector3;
        startedAt: number;
        durationMs: number;
        ok: boolean;
        resolve: () => void;
      }
    | undefined;

  constructor(private host: SceneHost) {
    host.setParallaxSway(false);
    this.cargo = new THREE.Group();
    this.cargoMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.52, 0.52),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.14, 0.56),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    belt.position.y = 0.1;
    this.cargo.add(this.cargoMesh, belt);
    this.cargo.position.copy(this.startPos);

    this.root.add(this.cargo);
    this.buildBins();
    host.addToOverlay(this.root);
  }

  private buildBins(): void {
    (Object.keys(BIN_POSITIONS) as Array<keyof typeof BIN_POSITIONS>).forEach((id) => {
      const g = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.7, 0.35, 18),
        new THREE.MeshBasicMaterial({
          color: id === 'dong-vat' ? 0x0ea5e9 : id === 'thuc-vat' ? 0x22c55e : 0x8b5cf6,
          transparent: true,
          opacity: 0.85,
        })
      );
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.62, 0.07, 12, 22),
        new THREE.MeshBasicMaterial({ color: 0xf8fafc })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.25;
      g.add(base, ring);
      g.position.copy(BIN_POSITIONS[id]);
      this.binTargets.set(id, g);
      this.root.add(g);
    });
  }

  setCurrentItem(seed: string): void {
    (this.cargoMesh.material as THREE.MeshBasicMaterial).color.setHex(colorFromSeed(seed));
    this.cargo.position.copy(this.startPos);
    this.cargo.rotation.set(0, 0, 0);
  }

  async playDrop(binId: string, ok: boolean): Promise<void> {
    const target = this.binTargets.get(binId);
    if (!target) return;
    await new Promise<void>((resolve) => {
      this.anim = {
        binId,
        to: target.position.clone().add(new THREE.Vector3(0, 0.35, 0)),
        startedAt: performance.now(),
        durationMs: 520,
        ok,
        resolve,
      };
    });
  }

  tick(timeNow = performance.now()): void {
    this.rafTime = timeNow;
    const t = this.rafTime * 0.0016;
    this.root.rotation.y = Math.sin(t) * 0.08;

    if (!this.anim) {
      this.cargo.position.y = this.startPos.y + Math.sin(t * 1.6) * 0.06;
      this.cargo.rotation.y += 0.012;
      return;
    }

    const p = Math.min(1, (timeNow - this.anim.startedAt) / this.anim.durationMs);
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    this.cargo.position.lerpVectors(this.startPos, this.anim.to, eased);
    this.cargo.position.y += Math.sin(Math.PI * eased) * 0.55;
    this.cargo.rotation.y += 0.22;
    this.cargo.rotation.x = Math.sin(Math.PI * eased) * 0.28;

    const target = this.binTargets.get(this.anim.binId);
    if (target) {
      const scalePulse = 1 + Math.sin(eased * Math.PI) * 0.2;
      target.scale.setScalar(scalePulse);
      if (target.children[0] instanceof THREE.Mesh) {
        const mat = target.children[0].material as THREE.MeshBasicMaterial;
        mat.color.setHex(this.anim.ok ? 0x22c55e : 0xef4444);
      }
    }

    if (p >= 1) {
      this.cargo.position.copy(this.startPos);
      this.cargo.rotation.set(0, 0, 0);
      this.binTargets.forEach((g, id) => {
        g.scale.setScalar(1);
        const mesh = g.children[0] as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.color.setHex(id === 'dong-vat' ? 0x0ea5e9 : id === 'thuc-vat' ? 0x22c55e : 0x8b5cf6);
      });
      const done = this.anim.resolve;
      this.anim = undefined;
      done();
    }
  }

  dispose(): void {
    this.host.setParallaxSway(true);
    this.host.clearOverlay();
  }
}
