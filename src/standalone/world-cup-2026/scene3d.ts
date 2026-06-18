/**
 * World Cup 2026 — 2.5D Three.js pitch (side-view, matches Thiet_Ke_Game_Soccer_Quiz.md)
 */

import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import {
  bezierPoint,
  easeInOutCubic,
  easeInOutQuad,
  easeOutCubic,
  lerp,
  runSequence,
} from './animation';
import type { SceneSnapshot, ShotType } from './types';
import {
  animatePlayerRig,
  attachPlayerRig,
  buildPlayerRig,
  getPlayerRig,
  kitFromFlag,
  opponentKitFromFlag,
  recolorPlayerKit,
} from './playerRig';

export interface Scene3DCallbacks {
  onSequenceDone: () => void;
}

export interface SetStageOptions {
  hardReset?: boolean;
}

const STRIKER_BASE = { x: 0.2, y: 0.75 };
const BALL_BASE = { x: 0.26, y: 0.78 };
const DEFENDER_BASE = { x: 0.8, y: 0.75 };
const GK_BASE = { x: 0.72, y: 0.72 };
const HORIZON_Y = 0.65;
const DRIBBLE_OFFSET = BALL_BASE.x - STRIKER_BASE.x;

function shotCurve(shot: ShotType): {
  peak: { x: number; y: number };
  end: { x: number; y: number };
} {
  if (shot === 'A') return { peak: { x: 0.5, y: 0.4 }, end: { x: 0.88, y: 0.78 } };
  if (shot === 'B') return { peak: { x: 0.5, y: 0.55 }, end: { x: 0.88, y: 0.78 } };
  return { peak: { x: 0.55, y: 0.76 }, end: { x: 0.88, y: 0.78 } };
}

function makeBlobShadow(radius = 0.18): THREE.Mesh {
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 16),
    new THREE.MeshBasicMaterial({ color: 0x052e16, transparent: true, opacity: 0.38 })
  );
  shadow.position.z = 0.02;
  shadow.scale.y = 0.45;
  return shadow;
}

export class WorldCupScene3D {
  private mount: HTMLElement;
  private callbacks: Scene3DCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private raf = 0;
  private cancelSeq: (() => void) | null = null;
  private idleT = 0;
  private runCycle = 0;
  private kickAnimT = 0;
  private gkDiveT = 0;
  private active = true;
  private viewHalfH = 4;
  private viewHalfW = 7;

  private bgGroup = new THREE.Group();
  private scrollGroup = new THREE.Group();
  private striker!: THREE.Group;
  private defender!: THREE.Group;
  private ball!: THREE.Mesh;
  private goalGroup = new THREE.Group();
  private hitFlash!: THREE.Mesh;
  private kickFlash!: THREE.Mesh;
  private kickFlashT = 0;
  private trail!: THREE.Mesh;
  private flagStrip!: THREE.Mesh;
  private strikerShadow!: THREE.Mesh;
  private defenderShadow!: THREE.Mesh;
  private ballShadow!: THREE.Mesh;
  private pitchPlane!: THREE.Mesh;
  private cameraPanX = 0;
  private targetCameraPanX = 0;
  private countryFlagColors: [string, string, string] = ['#2563eb', '#ffffff', '#1e3a8a'];
  private strikerLight = new THREE.PointLight(0x93c5fd, 0.38, 7, 2);
  private defenderLight = new THREE.PointLight(0xfca5a5, 0.3, 7, 2);

  snapshot: SceneSnapshot = {
    phase: 'idle',
    stage: 1,
    isBoss: false,
    scrollOffset: 0,
    strikerX: STRIKER_BASE.x,
    strikerY: STRIKER_BASE.y,
    defenderX: DEFENDER_BASE.x,
    defenderY: DEFENDER_BASE.y,
    ball: { x: BALL_BASE.x, y: BALL_BASE.y, progress: 0 },
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

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.domElement.className = 'wc-three-canvas';
    mount.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xbae6fd, 12, 28);
    this.camera = new THREE.OrthographicCamera(-7, 7, 4, -4, 0.1, 50);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.42);
    const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x15803d, 0.55);
    const sun = new THREE.DirectionalLight(0xfff7ed, 0.92);
    sun.position.set(-3, 6, 8);
    const fill = new THREE.DirectionalLight(0xbfdbfe, 0.32);
    fill.position.set(4, 2, 5);
    const rim = new THREE.DirectionalLight(0xffffff, 0.42);
    rim.position.set(0, 3, -6);
    const key = new THREE.PointLight(0xfffbeb, 0.55, 18, 1.6);
    key.position.set(-1.5, 1.2, 4);
    this.scene.add(ambient, hemi, sun, fill, rim, key, this.strikerLight, this.defenderLight);

    this.buildBackground();
    this.buildPitchLines();
    this.buildActors();

    window.addEventListener('resize', this.resize);
    this.resize();
    this.loop();
  }

  setView(mode: 'menu' | 'play'): void {
    this.active = mode === 'play';
    if (mode === 'play') this.forceResize();
  }

  setCountryColors(colors: [string, string, string]): void {
    this.countryFlagColors = colors;
    const tex = this.makeFlagTexture(colors);
    (this.flagStrip.material as THREE.MeshBasicMaterial).map = tex;
    (this.flagStrip.material as THREE.MeshBasicMaterial).needsUpdate = true;
    this.applyPlayerKits();
  }

  private applyPlayerKits(): void {
    const strikerRig = getPlayerRig(this.striker);
    if (strikerRig) recolorPlayerKit(strikerRig, kitFromFlag(this.countryFlagColors));
    const defenderRig = getPlayerRig(this.defender);
    if (defenderRig && !defenderRig.isGk) {
      recolorPlayerKit(defenderRig, opponentKitFromFlag(this.countryFlagColors));
    }
  }

  setStage(stage: 1 | 2 | 3 | 4, options: SetStageOptions = {}): void {
    const wasBoss = this.snapshot.isBoss;
    this.snapshot.stage = stage;
    this.snapshot.isBoss = stage === 4;
    if (stage === 4 !== wasBoss) this.swapDefender(stage === 4);
    this.goalGroup.visible = stage === 4;
    if (options.hardReset) this.resetPositions();
  }

  forceResize(): void {
    this.resize();
  }

  resetPositions(): void {
    const defBase = this.snapshot.isBoss ? GK_BASE : DEFENDER_BASE;
    this.snapshot.scrollOffset = 0;
    this.snapshot.strikerX = STRIKER_BASE.x;
    this.snapshot.strikerY = STRIKER_BASE.y;
    this.snapshot.defenderX = defBase.x;
    this.snapshot.defenderY = defBase.y;
    this.snapshot.ball = { x: BALL_BASE.x, y: BALL_BASE.y, progress: 0 };
    this.snapshot.hitFlash = 0;
    this.snapshot.netShake = 0;
    this.snapshot.celebrate = 0;
    this.snapshot.disappointment = 0;
    this.snapshot.phase = 'idle';
    this.snapshot.shot = null;
    this.snapshot.correct = null;
    this.snapshot.trailIntensity = 0;
    this.runCycle = 0;
    this.kickAnimT = 0;
    this.gkDiveT = 0;
    this.scrollGroup.position.x = 0;
    this.cameraPanX = 0;
    this.targetCameraPanX = 0;
    this.camera.position.x = 0;
    this.camera.lookAt(0, 0, 0);
    this.ball.rotation.set(0, 0, 0);
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
      durationMs: 320,
      onUpdate: (t) => {
        const p = easeOutCubic(t);
        this.kickAnimT = p;
        this.snapshot.strikerX = lerp(STRIKER_BASE.x, STRIKER_BASE.x + 0.04, p);
        this.snapshot.strikerY = STRIKER_BASE.y - Math.sin(p * Math.PI) * 0.015;
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.kickAnimT = 1;
        this.flyBall(correct);
      },
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

  private spawnPlayer(isGk: boolean, isStriker: boolean): THREE.Group {
    const wrapper = new THREE.Group();
    attachPlayerRig(wrapper, buildPlayerRig(isGk, isStriker));
    return wrapper;
  }

  private swapDefender(isGk: boolean): void {
    this.scrollGroup.remove(this.defender);
    disposeObject3D(this.defender);
    this.defender = this.spawnPlayer(isGk, false);
    this.scrollGroup.add(this.defender);
    this.applyPlayerKits();
  }

  private setBallAtStriker(offsetX = DRIBBLE_OFFSET, offsetY = BALL_BASE.y - STRIKER_BASE.y): void {
    this.snapshot.ball = {
      x: this.snapshot.strikerX + offsetX,
      y: this.snapshot.strikerY + offsetY,
      progress: 0,
    };
  }

  private makeFlagTexture(colors: [string, string, string]): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const sw = canvas.width / 3;
    colors.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(i * sw, 0, sw, canvas.height);
    });
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private makeGrassTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const stripeW = canvas.width / 12;
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#16a34a' : '#22c55e';
      ctx.fillRect(i * stripeW, 0, stripeW, canvas.height);
    }
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `rgba(74, 222, 128, ${0.08 + Math.random() * 0.12})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 6 + Math.random() * 8);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1.2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private buildBackground(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const h = canvas.height;
    const horizon = Math.floor(h * HORIZON_Y);
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, '#7dd3fc');
    sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, horizon);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, horizon - 48, canvas.width, 36);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, horizon - 12, canvas.width, 12);

    ctx.fillStyle = '#166534';
    ctx.fillRect(0, horizon, canvas.width, h - horizon);
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#15803d' : '#22c55e';
      ctx.fillRect((canvas.width / 14) * i, horizon + 6, canvas.width / 14, h - horizon - 6);
    }
    ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.fillRect(0, horizon + 6, canvas.width, 22);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    this.bgGroup.add(bg);

    const grassTex = this.makeGrassTexture();
    const pitchY = this.normToWorld(0.5, HORIZON_Y + 0.16).y;
    this.pitchPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 4.2),
      new THREE.MeshStandardMaterial({
        map: grassTex,
        color: 0xffffff,
        roughness: 0.94,
        metalness: 0,
      })
    );
    this.pitchPlane.position.set(0, pitchY, 0.03);
    this.bgGroup.add(this.pitchPlane);

    this.flagStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 0.18),
      new THREE.MeshBasicMaterial({ map: this.makeFlagTexture(['#22c55e', '#ffffff', '#3b82f6']) })
    );
    this.flagStrip.position.y = this.normToWorld(0.5, 0.04).y;
    this.flagStrip.position.z = 0.2;
    this.scene.add(this.flagStrip);
    this.scrollGroup.add(this.bgGroup);
    this.scene.add(this.scrollGroup);
  }

  private buildPitchLines(): void {
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    const topLeft = this.normToWorld(0.05, HORIZON_Y + 0.03);
    const bottomRight = this.normToWorld(0.95, 0.96);
    const w = bottomRight.x - topLeft.x;
    const h = topLeft.y - bottomRight.y;
    const boundary = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.04), lineMat);
    boundary.position.set((topLeft.x + bottomRight.x) / 2, topLeft.y, 0.05);
    const boundaryB = boundary.clone();
    boundaryB.position.y = bottomRight.y;
    const mid = new THREE.Mesh(new THREE.PlaneGeometry(0.04, h), lineMat);
    mid.position.set(0, (topLeft.y + bottomRight.y) / 2, 0.05);
    this.scrollGroup.add(boundary, boundaryB, mid);
  }

  private buildGoal(): void {
    const topLeft = this.normToWorld(0.82, HORIZON_Y + 0.04);
    const bottomRight = this.normToWorld(0.98, 0.93);
    const w = bottomRight.x - topLeft.x;
    const h = topLeft.y - bottomRight.y;
    const cx = (topLeft.x + bottomRight.x) / 2;
    const cy = (topLeft.y + bottomRight.y) / 2;
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.2, roughness: 0.35 });
    const postR = 0.045;
    const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(postR, postR, h, 8), postMat);
    leftPost.position.set(topLeft.x, cy, 0.1);
    const rightPost = leftPost.clone();
    rightPost.position.x = bottomRight.x;
    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(postR * 0.85, postR * 0.85, w, 8), postMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(cx, topLeft.y, 0.1);

    const netPoints: number[] = [];
    const netCols = 8;
    const netRows = 6;
    for (let i = 0; i <= netCols; i++) {
      const t = i / netCols;
      const x = topLeft.x + w * t;
      netPoints.push(x, topLeft.y, 0.06, x, bottomRight.y, 0.06);
    }
    for (let j = 0; j <= netRows; j++) {
      const t = j / netRows;
      const y = topLeft.y - h * t;
      netPoints.push(topLeft.x, y, 0.06, bottomRight.x, y, 0.06);
    }
    const netGeo = new THREE.BufferGeometry();
    netGeo.setAttribute('position', new THREE.Float32BufferAttribute(netPoints, 3));
    const net = new THREE.LineSegments(
      netGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 })
    );

    this.goalGroup.add(leftPost, rightPost, crossbar, net);
    this.goalGroup.visible = false;
    this.scrollGroup.add(this.goalGroup);
  }

  private buildActors(): void {
    this.striker = this.spawnPlayer(false, true);
    this.defender = this.spawnPlayer(false, false);
    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.28, metalness: 0.04 })
    );
    const pentMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0 });
    for (let i = 0; i < 5; i++) {
      const pent = new THREE.Mesh(new THREE.CircleGeometry(0.028, 5), pentMat);
      const a = (i / 5) * Math.PI * 2;
      pent.position.set(Math.cos(a) * 0.055, Math.sin(a) * 0.055, 0.088);
      this.ball.add(pent);
    }

    this.strikerShadow = makeBlobShadow();
    this.defenderShadow = makeBlobShadow();
    this.ballShadow = makeBlobShadow();
    this.ballShadow.scale.set(0.65, 0.65, 1);

    this.trail = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0 })
    );
    this.hitFlash = new THREE.Mesh(
      new THREE.CircleGeometry(0.22, 16),
      new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0 })
    );
    this.hitFlash.position.z = 0.15;
    this.kickFlash = new THREE.Mesh(
      new THREE.CircleGeometry(0.1, 12),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0 })
    );
    this.kickFlash.position.z = 0.17;

    this.buildGoal();
    this.scrollGroup.add(
      this.strikerShadow,
      this.defenderShadow,
      this.ballShadow,
      this.striker,
      this.defender,
      this.ball,
      this.trail,
      this.hitFlash,
      this.kickFlash
    );
    this.applyPlayerKits();
    this.resetPositions();
  }

  private normToWorld(nx: number, ny: number): THREE.Vector3 {
    const x = (nx - 0.5) * this.viewHalfW * 2;
    const y = (0.5 - ny) * this.viewHalfH * 2;
    return new THREE.Vector3(x, y, 0);
  }

  private applySnapshotToMeshes(): void {
    const running =
      this.snapshot.phase === 'scrolling' ||
      this.snapshot.phase === 'returning' ||
      this.snapshot.phase === 'flying';
    const idleBounce =
      this.snapshot.phase === 'idle' ? Math.sin(this.idleT * 3) * 0.008 : 0;
    const runBob = running ? Math.sin(this.runCycle) * 0.012 : 0;
    const strikerNy = this.snapshot.strikerY + (this.snapshot.disappointment ? 0.02 : 0) + idleBounce + runBob;
    const strikerPos = this.normToWorld(this.snapshot.strikerX, strikerNy);
    this.striker.position.set(strikerPos.x, strikerPos.y, 0.12);

    const defPos = this.normToWorld(this.snapshot.defenderX, this.snapshot.defenderY);
    this.defender.position.set(defPos.x, defPos.y, 0.12);

    const ballPos = this.normToWorld(this.snapshot.ball.x, this.snapshot.ball.y);
    const ballLift = this.snapshot.ball.progress * 0.08;
    this.ball.position.set(ballPos.x, ballPos.y, 0.14 + ballLift);

    this.strikerShadow.position.set(strikerPos.x, strikerPos.y - 0.02, 0.02);
    this.defenderShadow.position.set(defPos.x, defPos.y - 0.02, 0.02);
    this.strikerLight.position.set(strikerPos.x - 0.3, strikerPos.y + 0.5, 0.35);
    this.defenderLight.position.set(defPos.x + 0.3, defPos.y + 0.45, 0.35);
    const shadowScale = Math.max(0.45, 1 - ballLift * 4);
    this.ballShadow.position.set(ballPos.x, ballPos.y - 0.02, 0.015);
    this.ballShadow.scale.set(shadowScale * 0.65, shadowScale * 0.35, 1);
    (this.ballShadow.material as THREE.MeshBasicMaterial).opacity = 0.22 + shadowScale * 0.2;

    if (this.snapshot.phase === 'flying' || this.snapshot.phase === 'scrolling') {
      this.ball.rotation.z += 0.14;
      this.ball.rotation.x += 0.08;
    }

    this.scrollGroup.position.x = -this.snapshot.scrollOffset * this.viewHalfW * 2;
    this.targetCameraPanX =
      this.snapshot.scrollOffset * 0.22 + (this.snapshot.strikerX - STRIKER_BASE.x) * 0.35;

    this.trail.visible = this.snapshot.trailIntensity > 0 && this.snapshot.phase === 'flying';
    if (this.trail.visible) {
      const trailPos = this.normToWorld(this.snapshot.ball.x - 0.03, this.snapshot.ball.y);
      this.trail.position.set(trailPos.x, trailPos.y, 0.1);
      (this.trail.material as THREE.MeshBasicMaterial).opacity = 0.55;
    }

    this.hitFlash.visible = this.snapshot.hitFlash > 0;
    if (this.hitFlash.visible) {
      const flashPos = this.normToWorld(0.72, 0.74);
      this.hitFlash.position.set(flashPos.x, flashPos.y, 0.16);
      (this.hitFlash.material as THREE.MeshBasicMaterial).opacity = this.snapshot.hitFlash * 0.75;
    }

    this.kickFlash.visible = this.kickFlashT > 0;
    if (this.kickFlash.visible) {
      this.kickFlash.position.set(ballPos.x, ballPos.y, 0.18);
      (this.kickFlash.material as THREE.MeshBasicMaterial).opacity = this.kickFlashT * 0.9;
      const s = 1 + (1 - this.kickFlashT) * 1.2;
      this.kickFlash.scale.set(s, s, 1);
    }

    this.goalGroup.rotation.z = this.snapshot.netShake * 0.06;

    const strikerRig = getPlayerRig(this.striker);
    const defenderRig = getPlayerRig(this.defender);
    if (strikerRig) {
      animatePlayerRig(strikerRig, this.snapshot.phase, this.idleT, this.runCycle, {
        kickT: this.snapshot.phase === 'kicking' ? this.kickAnimT : undefined,
        disappointed: this.snapshot.disappointment > 0,
        ballHoldY:
          this.snapshot.phase === 'idle' || this.snapshot.phase === 'selecting'
            ? this.snapshot.ball.y - this.snapshot.strikerY
            : undefined,
      });
    }
    if (defenderRig) {
      animatePlayerRig(defenderRig, this.snapshot.phase, this.idleT, this.runCycle, {
        diveT: this.gkDiveT > 0 ? this.gkDiveT : undefined,
        diveDir: this.snapshot.shot === 'C' ? 1 : -1,
        blocking: this.snapshot.phase === 'blocking',
      });
    }

    if (this.snapshot.celebrate > 0 && strikerRig) {
      animatePlayerRig(strikerRig, 'goal', this.snapshot.celebrate, this.runCycle);
      this.striker.position.y -= this.snapshot.celebrate * 0.06;
      strikerRig.kit.torso.emissiveIntensity = 0.16 + Math.sin(this.snapshot.celebrate * 14) * 0.1;
    } else if (strikerRig) {
      strikerRig.kit.torso.emissiveIntensity = 0.16;
    }
  }

  private flyBall(correct: boolean): void {
    const shot = this.snapshot.shot!;
    const curve = shotCurve(shot);
    const start = { x: this.snapshot.ball.x, y: this.snapshot.ball.y };
    this.snapshot.phase = 'flying';
    this.kickFlashT = 1;
    const defBaseY = this.snapshot.isBoss ? GK_BASE.y : DEFENDER_BASE.y;

    this.cancelSeq = runSequence({
      durationMs: correct ? 780 : 680,
      onUpdate: (t) => {
        const p = easeInOutQuad(t);
        const pt = bezierPoint(p, start, curve.peak, curve.end);
        this.snapshot.ball = { x: pt.x, y: pt.y, progress: p };
        if (!correct && t > 0.55) {
          this.snapshot.defenderY = lerp(defBaseY, defBaseY - 0.08, (t - 0.55) / 0.45);
        } else if (correct) {
          this.snapshot.defenderY = lerp(
            defBaseY,
            defBaseY + (shot === 'C' ? -0.06 : 0.06),
            Math.min(1, t * 1.4)
          );
          if (this.snapshot.isBoss && t > 0.35) {
            this.snapshot.defenderY = lerp(defBaseY, defBaseY - 0.14, Math.min(1, (t - 0.35) / 0.45));
            this.gkDiveT = Math.min(1, (t - 0.35) / 0.5);
          } else {
            this.gkDiveT = 0;
          }
        }
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        if (correct) {
          if (this.snapshot.isBoss) this.playGoal();
          else this.advanceAfterBeat();
        } else {
          this.playBlock();
        }
      },
    });
  }

  /** Correct answer: beat defender → chase ball → dribble forward → smooth settle for next duel */
  private advanceAfterBeat(): void {
    const shot = this.snapshot.shot!;
    const beatBallX = shot === 'C' ? 0.72 : 0.78;
    const beatBallY = shot === 'C' ? 0.78 : 0.76;
    const startStrikerX = this.snapshot.strikerX;
    const startDefenderX = this.snapshot.defenderX;

    this.snapshot.phase = 'returning';

    this.cancelSeq = runSequence({
      durationMs: 520,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.snapshot.ball = {
          x: lerp(curveEndX(shot), beatBallX, p),
          y: lerp(curveEndY(shot), beatBallY, p),
          progress: 0,
        };
        this.snapshot.defenderX = lerp(startDefenderX, 0.42, p);
        this.snapshot.defenderY = lerp(DEFENDER_BASE.y, DEFENDER_BASE.y + 0.04, p);
        this.snapshot.strikerX = lerp(startStrikerX, beatBallX - DRIBBLE_OFFSET - 0.06, p * 0.55);
        this.applySnapshotToMeshes();
      },
      onComplete: () => this.chaseAndCollect(beatBallX, beatBallY),
    });
  }

  private chaseAndCollect(beatBallX: number, beatBallY: number): void {
    this.snapshot.phase = 'scrolling';
    this.runCycle = 0;

    this.cancelSeq = runSequence({
      durationMs: 680,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.runCycle += 0.28;
        const targetStrikerX = lerp(beatBallX - DRIBBLE_OFFSET - 0.06, beatBallX - DRIBBLE_OFFSET, p);
        this.snapshot.strikerX = targetStrikerX;
        this.snapshot.strikerY = lerp(STRIKER_BASE.y, STRIKER_BASE.y - 0.01, p);
        this.snapshot.ball = {
          x: lerp(beatBallX, targetStrikerX + DRIBBLE_OFFSET, p),
          y: lerp(beatBallY, STRIKER_BASE.y + (BALL_BASE.y - STRIKER_BASE.y), p),
          progress: 0,
        };
        this.snapshot.defenderX = lerp(0.42, -0.08, p);
        this.applySnapshotToMeshes();
      },
      onComplete: () => this.dribbleToNextDefender(),
    });
  }

  private dribbleToNextDefender(): void {
    const startStrikerX = this.snapshot.strikerX;
    const startScroll = this.snapshot.scrollOffset;

    this.swapDefender(false);
    this.snapshot.defenderX = 1.08;
    this.snapshot.defenderY = DEFENDER_BASE.y;
    this.gkDiveT = 0;

    this.cancelSeq = runSequence({
      durationMs: 1500,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.runCycle += 0.22;
        this.snapshot.scrollOffset = lerp(startScroll, 0.38, p);
        this.snapshot.strikerX = lerp(startStrikerX, STRIKER_BASE.x, p);
        this.snapshot.strikerY = STRIKER_BASE.y;
        this.setBallAtStriker();
        this.snapshot.ball.y = STRIKER_BASE.y + (BALL_BASE.y - STRIKER_BASE.y) + Math.sin(this.runCycle * 2) * 0.004;
        this.snapshot.defenderX = lerp(1.08, DEFENDER_BASE.x, Math.max(0, (p - 0.25) / 0.75));
        this.applySnapshotToMeshes();
      },
      onComplete: () => this.softSettleToIdle(),
    });
  }

  private softSettleToIdle(): void {
    const from = {
      scroll: this.snapshot.scrollOffset,
      strikerX: this.snapshot.strikerX,
      strikerY: this.snapshot.strikerY,
      ballX: this.snapshot.ball.x,
      ballY: this.snapshot.ball.y,
      defenderX: this.snapshot.defenderX,
      defenderY: this.snapshot.defenderY,
    };

    this.cancelSeq = runSequence({
      durationMs: 480,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.snapshot.scrollOffset = lerp(from.scroll, 0, p);
        this.snapshot.strikerX = lerp(from.strikerX, STRIKER_BASE.x, p);
        this.snapshot.strikerY = lerp(from.strikerY, STRIKER_BASE.y, p);
        this.snapshot.ball = {
          x: lerp(from.ballX, BALL_BASE.x, p),
          y: lerp(from.ballY, BALL_BASE.y, p),
          progress: 0,
        };
        const defBase = this.snapshot.isBoss ? GK_BASE : DEFENDER_BASE;
        this.snapshot.defenderX = lerp(from.defenderX, defBase.x, p);
        this.snapshot.defenderY = lerp(from.defenderY, defBase.y, p);
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.runCycle = 0;
        this.gkDiveT = 0;
        this.callbacks.onSequenceDone();
      },
    });
  }

  private playBlock(): void {
    this.snapshot.phase = 'blocking';
    this.snapshot.hitFlash = 1;
    const shot = this.snapshot.shot!;
    const blockX = 0.72;
    const isBoss = this.snapshot.isBoss;

    this.cancelSeq = runSequence({
      durationMs: isBoss ? 760 : 560,
      onUpdate: (t) => {
        const p = easeOutCubic(t);
        const curve = shotCurve(shot);
        if (isBoss && t > 0.42) {
          const hold = (t - 0.42) / 0.58;
          this.snapshot.ball = {
            x: lerp(blockX, GK_BASE.x - 0.03, hold),
            y: lerp(curve.end.y, GK_BASE.y + 0.05, hold),
            progress: 0,
          };
          this.gkDiveT = hold * 0.85;
        } else {
          const back = bezierPoint(1 - p, { x: blockX, y: curve.end.y }, curve.peak, {
            x: BALL_BASE.x,
            y: BALL_BASE.y,
          });
          this.snapshot.ball = { x: back.x, y: back.y, progress: 1 - p };
          if (t > 0.45) {
            this.snapshot.strikerY = lerp(STRIKER_BASE.y, STRIKER_BASE.y + 0.025, (t - 0.45) / 0.55);
          }
        }
        this.snapshot.hitFlash = 1 - t;
        if (t > 0.5) this.snapshot.disappointment = (t - 0.5) * 2;
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.snapshot.disappointment = 0;
        this.gkDiveT = 0;
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
        this.snapshot.strikerY = lerp(STRIKER_BASE.y, STRIKER_BASE.y + 0.04, easeOutCubic(Math.min(1, t * 2)));
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.callbacks.onSequenceDone();
      },
    });
  }

  private resize = (): void => {
    const w = Math.max(this.mount.clientWidth, 1);
    const h = Math.max(this.mount.clientHeight, 1);
    this.viewHalfH = 4;
    this.viewHalfW = this.viewHalfH * (w / h);
    this.camera.left = -this.viewHalfW;
    this.camera.right = this.viewHalfW;
    this.camera.top = this.viewHalfH;
    this.camera.bottom = -this.viewHalfH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.bgGroup.children[0]?.scale.set(this.viewHalfW * 2.05, this.viewHalfH * 2.05, 1);
    this.flagStrip.scale.x = this.viewHalfW / 7;
  };

  private loop = (): void => {
    this.idleT += 0.016;
    if (this.kickFlashT > 0) this.kickFlashT = Math.max(0, this.kickFlashT - 0.06);
    this.cameraPanX = lerp(this.cameraPanX, this.targetCameraPanX, 0.1);
    this.camera.position.x = this.cameraPanX;
    this.camera.lookAt(this.cameraPanX, 0, 0);
    if (this.snapshot.phase === 'idle') {
      const defBase = this.snapshot.isBoss ? GK_BASE : DEFENDER_BASE;
      this.snapshot.defenderX = defBase.x + Math.sin(this.idleT * 2.2) * 0.012;
      this.snapshot.defenderY = defBase.y + Math.abs(Math.sin(this.idleT * 2.8)) * 0.012;
    }
    if (this.active && this.mount.clientHeight > 0) {
      this.applySnapshotToMeshes();
      this.renderer.render(this.scene, this.camera);
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}

function curveEndX(shot: ShotType): number {
  return shotCurve(shot).end.x;
}

function curveEndY(shot: ShotType): number {
  return shotCurve(shot).end.y;
}

/** @deprecated use WorldCupScene3D */
export { WorldCupScene3D as SoccerGameCanvas };
