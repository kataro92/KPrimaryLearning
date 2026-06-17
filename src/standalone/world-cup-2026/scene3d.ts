/**
 * World Cup 2026 — 2.5D Three.js pitch scene
 *
 * Level design (Game Level Designer guide):
 * - Topology: linear corridor — striker advances through 3 defender chokepoints to boss goal.
 * - Landmarks: stage posts, country banners, stadium stands, goal frame.
 * - Pacing: compression at defender duels, release on scroll transition after success.
 * - Boss: stage 4 goalkeeper + goal arena with net shake on score.
 */

import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { bezierPoint, easeInOutQuad, easeOutCubic, lerp, runSequence } from './animation';
import type { SceneSnapshot, ShotType } from './types';

export interface Scene3DCallbacks {
  onSequenceDone: () => void;
}

const STRIKER_BASE = { x: -6, y: 0.35, z: 0 };
const DEFENDER_BASE = { x: 4.8, y: 0.35, z: 0 };
const GK_BASE = { x: 4.2, y: 0.35, z: 0 };

function shotCurve(shot: ShotType): {
  peak: { x: number; y: number; z: number };
  end: { x: number; y: number; z: number };
} {
  if (shot === 'A') return { peak: { x: 0, y: 2.2, z: 0.5 }, end: { x: 6.2, y: 0.35, z: 0 } };
  if (shot === 'B') return { peak: { x: 0, y: 1.1, z: 0.3 }, end: { x: 6.2, y: 0.35, z: 0 } };
  return { peak: { x: 1, y: 0.25, z: 0.1 }, end: { x: 6.2, y: 0.22, z: 0 } };
}

function hexColor(hex: string): number {
  return Number.parseInt(hex.replace('#', ''), 16);
}

function buildPlayer(isGk: boolean, isStriker: boolean): THREE.Group {
  const g = new THREE.Group();
  const shirt = isGk ? 0xfacc15 : isStriker ? 0x3b82f6 : 0xef4444;
  const shorts = isStriker ? 0x1e3a8a : 0x7f1d1d;
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.55, 6, 10),
    new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.55 })
  );
  body.position.y = 0.55;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xfcd9b6, roughness: 0.7 })
  );
  head.position.y = 1.05;
  const legs = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.28, 0.22),
    new THREE.MeshStandardMaterial({ color: shorts, roughness: 0.6 })
  );
  legs.position.y = 0.18;
  g.add(body, head, legs);
  if (isGk) {
    const gloveL = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.22, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    gloveL.position.set(-0.35, 0.75, 0.1);
    const gloveR = gloveL.clone();
    gloveR.position.x = 0.35;
    g.add(gloveL, gloveR);
  }
  return g;
}

export class WorldCupScene3D {
  private mount: HTMLElement;
  private callbacks: Scene3DCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private raf = 0;
  private cancelSeq: (() => void) | null = null;
  private idleT = 0;
  private viewMode: 'menu' | 'play' = 'menu';

  private pitchGroup = new THREE.Group();
  private scrollGroup = new THREE.Group();
  private striker!: THREE.Group;
  private defender!: THREE.Group;
  private ball!: THREE.Mesh;
  private goalGroup = new THREE.Group();
  private hitFlash!: THREE.Mesh;
  private trail!: THREE.Mesh;
  private banners: THREE.Mesh[] = [];
  private stagePosts: THREE.Mesh[] = [];

  snapshot: SceneSnapshot = {
    phase: 'idle',
    stage: 1,
    isBoss: false,
    scrollOffset: 0,
    strikerX: 0.2,
    strikerY: 0.75,
    defenderX: 0.8,
    defenderY: 0.75,
    ball: { x: 0.26, y: 0.78, progress: 0 },
    hitFlash: 0,
    netShake: 0,
    celebrate: 0,
    disappointment: 0,
    shot: null,
    correct: null,
    trailIntensity: 0,
  };

  constructor(mount: HTMLElement, callbacks: Scene3DCallbacks) {
    this.mount = mount;
    this.callbacks = callbacks;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.className = 'wc-three-canvas';
    mount.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbae6fd);
    this.scene.fog = new THREE.Fog(0xbae6fd, 14, 32);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    this.camera.position.set(-3.5, 4.2, 9.5);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x4ade80, 0.95);
    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(-4, 8, 6);
    this.scene.add(hemi, dir);

    this.buildEnvironment();
    this.buildPitch();
    this.buildActors();
    this.buildLandmarks();

    window.addEventListener('resize', this.resize);
    this.resize();
    this.loop();
  }

  setView(mode: 'menu' | 'play'): void {
    this.viewMode = mode;
    if (mode === 'menu') {
      this.camera.position.set(-2, 5.5, 11);
      this.camera.lookAt(0, 0.5, 0);
      this.goalGroup.visible = true;
      this.scrollGroup.position.x = 0;
    } else {
      this.camera.position.set(-3.5, 4.2, 9.5);
      this.camera.lookAt(1.5, 0.4, 0);
      this.goalGroup.visible = this.snapshot.isBoss;
    }
  }

  setCountryColors(colors: [string, string, string]): void {
    this.banners.forEach((b, i) => {
      const mat = b.material as THREE.MeshStandardMaterial;
      mat.color.setHex(hexColor(colors[i] ?? colors[0]!));
    });
  }

  setStage(stage: 1 | 2 | 3 | 4): void {
    this.snapshot.stage = stage;
    this.snapshot.isBoss = stage === 4;
    this.swapDefender(stage === 4);
    this.resetPositions();
    this.updateStagePosts(stage);
    this.goalGroup.visible = stage === 4 || this.viewMode === 'menu';
  }

  private swapDefender(isGk: boolean): void {
    this.scrollGroup.remove(this.defender);
    disposeObject3D(this.defender);
    this.defender = buildPlayer(isGk, false);
    this.scrollGroup.add(this.defender);
  }

  forceResize(): void {
    this.resize();
  }

  resetPositions(): void {
    this.snapshot.scrollOffset = 0;
    this.snapshot.strikerX = 0.2;
    this.snapshot.strikerY = 0.75;
    this.snapshot.defenderX = 0.8;
    this.snapshot.defenderY = 0.75;
    this.snapshot.ball = { x: 0.26, y: 0.78, progress: 0 };
    this.snapshot.hitFlash = 0;
    this.snapshot.netShake = 0;
    this.snapshot.celebrate = 0;
    this.snapshot.disappointment = 0;
    this.snapshot.phase = 'idle';
    this.snapshot.shot = null;
    this.snapshot.correct = null;
    this.snapshot.trailIntensity = 0;
    this.scrollGroup.position.x = 0;
    this.applySnapshotToMeshes();
  }

  playShot(shot: ShotType, correct: boolean): void {
    if (this.snapshot.phase !== 'idle' && this.snapshot.phase !== 'selecting') return;
    this.cancelSeq?.();
    this.snapshot.shot = shot;
    this.snapshot.correct = correct;
    this.snapshot.trailIntensity = this.snapshot.isBoss && correct ? 1 : 0;
    this.snapshot.phase = 'kicking';

    this.cancelSeq = runSequence({
      durationMs: 250,
      onUpdate: (t) => {
        this.snapshot.strikerX = lerp(0.2, 0.23, easeOutCubic(t));
        this.applySnapshotToMeshes();
      },
      onComplete: () => this.flyBall(correct),
    });
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.cancelSeq?.();
    window.removeEventListener('resize', this.resize);
    disposeObject3D(this.scene);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private buildEnvironment(): void {
    const standMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    for (const z of [-4.5, 4.5]) {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(18, 2.2, 1.2), standMat);
      stand.position.set(1, 1.1, z);
      this.scene.add(stand);
      const upper = new THREE.Mesh(new THREE.BoxGeometry(18, 1.4, 0.8), standMat);
      upper.position.set(1, 2.6, z);
      this.scene.add(upper);
    }
    const skyPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 16),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc })
    );
    skyPlate.position.set(0, 6, -8);
    this.scene.add(skyPlate);
  }

  private buildPitch(): void {
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.92 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0;
    this.pitchGroup.add(grass);

    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x16a34a, transparent: true, opacity: 0.25 });
    for (let i = -4; i <= 4; i += 2) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 10), stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(i, 0.01, 0);
      this.pitchGroup.add(stripe);
    }

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const boundary = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.06), lineMat);
    boundary.rotation.x = -Math.PI / 2;
    boundary.position.set(0, 0.02, -4.8);
    this.pitchGroup.add(boundary);
    const boundary2 = boundary.clone();
    boundary2.position.z = 4.8;
    this.pitchGroup.add(boundary2);

    const mid = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 9.6), lineMat);
    mid.rotation.x = -Math.PI / 2;
    mid.position.set(0, 0.02, 0);
    this.pitchGroup.add(mid);

    this.scene.add(this.pitchGroup);
    this.scene.add(this.scrollGroup);
  }

  private buildActors(): void {
    this.striker = buildPlayer(false, true);
    this.defender = buildPlayer(false, false);
    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 })
    );
    this.trail = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0 })
    );
    this.hitFlash = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0 })
    );

    const postMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.2 });
    const netMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8), postMat);
    leftPost.position.set(0, 0.7, -0.85);
    const rightPost = leftPost.clone();
    rightPost.position.z = 0.85;
    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), postMat);
    crossbar.rotation.x = Math.PI / 2;
    crossbar.position.set(0, 1.35, 0);
    const net = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.2), netMat);
    net.position.set(-0.05, 0.75, 0);
    this.goalGroup.add(leftPost, rightPost, crossbar, net);
    this.goalGroup.position.set(7.2, 0, 0);
    this.goalGroup.visible = false;

    this.scrollGroup.add(this.striker, this.defender, this.ball, this.trail, this.hitFlash, this.goalGroup);
    this.resetPositions();
  }

  private buildLandmarks(): void {
    const bannerGeo = new THREE.PlaneGeometry(1.4, 0.9);
    for (let i = 0; i < 3; i++) {
      const banner = new THREE.Mesh(
        bannerGeo,
        new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: 0.8 })
      );
      banner.position.set(-2 + i * 2.5, 2.4, -3.8);
      banner.rotation.y = 0.15;
      this.banners.push(banner);
      this.scene.add(banner);
    }

    const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.6, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x4c1d95, emissiveIntensity: 0.15 });
    for (let i = 0; i < 4; i++) {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(-4 + i * 3.2, 0.8, 3.6);
      this.stagePosts.push(post);
      this.scene.add(post);
    }
    this.updateStagePosts(1);
  }

  private updateStagePosts(stage: number): void {
    this.stagePosts.forEach((post, i) => {
      const mat = post.material as THREE.MeshStandardMaterial;
      if (i + 1 < stage) {
        mat.color.setHex(0x10b981);
        mat.emissive.setHex(0x047857);
      } else if (i + 1 === stage) {
        mat.color.setHex(0x7c3aed);
        mat.emissive.setHex(0x4c1d95);
        post.scale.y = 1.2;
      } else {
        mat.color.setHex(0x94a3b8);
        mat.emissive.setHex(0x334155);
        post.scale.y = 1;
      }
    });
  }

  private normToWorld(nx: number, ny: number, nz = 0): THREE.Vector3 {
    return new THREE.Vector3(lerp(-7, 8, nx), lerp(0.05, 2.5, ny), nz);
  }

  private applySnapshotToMeshes(): void {
    const sx = lerp(STRIKER_BASE.x, STRIKER_BASE.x + 0.4, (this.snapshot.strikerX - 0.2) / 0.03);
    const sy = STRIKER_BASE.y + (this.snapshot.disappointment ? -0.08 : 0) + Math.sin(this.idleT * 3) * 0.04;
    this.striker.position.set(sx, sy, STRIKER_BASE.z);

    const defBase = this.snapshot.isBoss ? GK_BASE : DEFENDER_BASE;
    const dx = lerp(defBase.x, defBase.x + 0.8, (this.snapshot.defenderX - 0.8) / 0.2);
    const dy = lerp(defBase.y, defBase.y + 0.6, Math.abs(this.snapshot.defenderY - 0.75) / 0.08);
    this.defender.position.set(dx, dy, defBase.z);

    const ballPos = this.normToWorld(this.snapshot.ball.x, this.snapshot.ball.y, this.snapshot.ball.progress * 0.3);
    this.ball.position.copy(ballPos);

    this.scrollGroup.position.x = -this.snapshot.scrollOffset * 14;

    this.trail.visible = this.snapshot.trailIntensity > 0 && this.snapshot.phase === 'flying';
    if (this.trail.visible) {
      this.trail.position.copy(ballPos).add(new THREE.Vector3(-0.35, 0, 0));
      (this.trail.material as THREE.MeshBasicMaterial).opacity = 0.55;
    }

    this.hitFlash.visible = this.snapshot.hitFlash > 0;
    if (this.hitFlash.visible) {
      this.hitFlash.position.set(5.2, 0.5, 0);
      (this.hitFlash.material as THREE.MeshBasicMaterial).opacity = this.snapshot.hitFlash * 0.75;
    }

    this.goalGroup.rotation.z = this.snapshot.netShake * 0.08;
    if (this.snapshot.celebrate > 0) {
      this.striker.rotation.z = Math.sin(this.snapshot.celebrate * 12) * 0.08;
    } else {
      this.striker.rotation.z = 0;
    }

    if (this.viewMode === 'play') {
      this.camera.lookAt(lerp(0.5, 2.5, this.snapshot.stage / 4), 0.45, 0);
    }
  }

  private flyBall(correct: boolean): void {
    const shot = this.snapshot.shot!;
    const curve = shotCurve(shot);
    const start = { x: this.snapshot.ball.x, y: this.snapshot.ball.y };
    this.snapshot.phase = 'flying';

    this.cancelSeq = runSequence({
      durationMs: correct ? 700 : 650,
      onUpdate: (t) => {
        const p = easeInOutQuad(t);
        const pt2d = bezierPoint(p, start, { x: curve.peak.x * 0.08 + 0.5, y: curve.peak.y * 0.12 }, {
          x: 0.88,
          y: curve.end.y * 0.12 + 0.72,
        });
        this.snapshot.ball = { x: pt2d.x, y: pt2d.y, progress: p };
        if (!correct && t > 0.55) {
          this.snapshot.defenderY = lerp(0.75, 0.67, (t - 0.55) / 0.45);
        } else if (correct) {
          this.snapshot.defenderY = lerp(0.75, shot === 'C' ? 0.69 : 0.81, Math.min(1, t * 1.4));
        }
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        if (correct) {
          if (this.snapshot.isBoss) this.playGoal();
          else this.scrollNext();
        } else {
          this.playBlock();
        }
      },
    });
  }

  private playBlock(): void {
    this.snapshot.phase = 'blocking';
    this.snapshot.hitFlash = 1;
    const shot = this.snapshot.shot!;
    const blockX = 0.72;

    this.cancelSeq = runSequence({
      durationMs: 500,
      onUpdate: (t) => {
        const p = easeOutCubic(t);
        const curve = shotCurve(shot);
        const back = bezierPoint(
          1 - p,
          { x: blockX, y: curve.end.y * 0.12 + 0.72 },
          { x: curve.peak.x * 0.08 + 0.5, y: curve.peak.y * 0.12 },
          { x: 0.26, y: 0.78 }
        );
        this.snapshot.ball = { x: back.x, y: back.y, progress: 1 - p };
        this.snapshot.hitFlash = 1 - t;
        if (t > 0.5) this.snapshot.disappointment = (t - 0.5) * 2;
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.snapshot.disappointment = 0;
        this.resetPositions();
        this.callbacks.onSequenceDone();
      },
    });
  }

  private scrollNext(): void {
    this.snapshot.phase = 'scrolling';
    this.cancelSeq = runSequence({
      durationMs: 1200,
      onUpdate: (t) => {
        const p = easeInOutQuad(t);
        this.snapshot.scrollOffset = p * 0.35;
        this.snapshot.strikerX = lerp(0.22, 0.2, 1 - p * 0.3);
        this.snapshot.ball.x = lerp(0.9, 0.26, 1 - p);
        this.snapshot.ball.y = lerp(0.78, 0.78, 1 - p);
        this.snapshot.defenderX = lerp(0.8, 1, p);
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.resetPositions();
        this.callbacks.onSequenceDone();
      },
    });
  }

  private playGoal(): void {
    this.snapshot.phase = 'goal';
    this.snapshot.netShake = 1;
    this.snapshot.celebrate = 1;
    this.cancelSeq = runSequence({
      durationMs: 1400,
      onUpdate: (t) => {
        this.snapshot.netShake = Math.max(0, 1 - t * 1.2) * Math.sin(t * 24);
        this.snapshot.celebrate = t;
        this.snapshot.strikerY = lerp(0.75, 0.79, easeOutCubic(Math.min(1, t * 2)));
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.callbacks.onSequenceDone();
      },
    });
  }

  private resize = (): void => {
    const w = this.mount.clientWidth || window.innerWidth;
    const h = this.mount.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private loop = (): void => {
    this.idleT += 0.016;
    if (this.snapshot.phase === 'idle') {
      this.defender.position.x += Math.sin(this.idleT * 2.2) * 0.002;
      this.defender.rotation.y = Math.sin(this.idleT * 1.8) * 0.08;
    }
    if (this.viewMode === 'menu') {
      this.pitchGroup.rotation.y = Math.sin(this.idleT * 0.35) * 0.04;
    }
    this.applySnapshotToMeshes();
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
  };
}

/** @deprecated use WorldCupScene3D */
export { WorldCupScene3D as SoccerGameCanvas };
