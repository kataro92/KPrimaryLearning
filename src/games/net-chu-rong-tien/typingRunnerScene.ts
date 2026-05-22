import * as THREE from 'three';
import type { SceneHost } from '@/core/rendering/sceneHost';
import {
  buildMarioRunner,
  makeBrickTile,
  makeCastle,
  makeLetterBlock,
  makePipe,
} from './marioWorld';

/** Cảnh 2.5D kiểu Mario Teaches Typing — đường gạch, khối chữ, Mario chạy */
export class TypingRunnerScene {
  private readonly root = new THREE.Group();
  private readonly worldGroup = new THREE.Group();
  private readonly pathGroup = new THREE.Group();
  private readonly letterGroup = new THREE.Group();
  private readonly runner: THREE.Group;
  private bobPhase = 0;
  private baseRunnerY = -0.95;
  private typedLen = 0;

  constructor(private host: SceneHost) {
    this.runner = buildMarioRunner();
    this.buildWorld();
    this.root.add(this.worldGroup);
    this.root.add(this.pathGroup);
    this.root.add(this.letterGroup);
    this.root.add(this.runner);
    host.clearOverlay();
    host.addToOverlay(this.root);
    host.setParallaxSway(false);
  }

  private buildWorld(): void {
    for (let i = 0; i < 14; i++) {
      this.pathGroup.add(makeBrickTile(-2.6 + i * 0.5, -1.18, 1.55 - i * 0.38));
    }
    this.worldGroup.add(makeCastle(2.4, -0.55, -2.2));
    this.worldGroup.add(makePipe(-3.1, -1.05, 0.2));
    this.worldGroup.add(makePipe(3.2, -1.1, -1.4));
  }

  /** Cập nhật khối chữ nổi trên đường (giống MTT) */
  setWord(chars: string[], typedIndex: number): void {
    this.typedLen = typedIndex;
    while (this.letterGroup.children.length > 0) {
      this.letterGroup.remove(this.letterGroup.children[0]);
    }
    const n = chars.length;
    const startX = -((n - 1) * 0.48) / 2;
    chars.forEach((ch, i) => {
      const state =
        i < typedIndex ? 'done' : i === typedIndex ? 'current' : 'pending';
      const block = makeLetterBlock(ch, state);
      block.position.set(startX + i * 0.48, 0.15, 0.85);
      this.letterGroup.add(block);
    });
  }

  setProgress(progress: number): void {
    const t = Math.min(1, Math.max(0, progress));
    this.runner.position.set(-2.5 + t * 4.6, this.baseRunnerY, 1.55 - t * 3.9);
    this.pathGroup.position.z = t * 0.45;
    this.pathGroup.position.x = -t * 0.2;
    this.worldGroup.position.z = t * 0.12;
    this.letterGroup.position.z = -t * 0.08;
  }

  tick(): void {
    this.bobPhase += 0.16;
    const hop = Math.abs(Math.sin(this.bobPhase)) * 0.09;
    this.runner.position.y = this.baseRunnerY + hop;
    const current = this.letterGroup.children[this.typedLen] as THREE.Group | undefined;
    if (current) {
      const pulse = 1 + Math.sin(this.bobPhase * 2) * 0.06;
      current.scale.setScalar(pulse);
    }
  }

  dispose(): void {
    this.host.setParallaxSway(true);
    this.host.clearOverlay();
  }
}
