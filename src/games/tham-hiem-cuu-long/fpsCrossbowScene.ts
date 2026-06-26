import * as THREE from 'three';
import { FrameLoop } from '@/core/rendering/frameLoop';
import { createGameRenderer } from '@/core/rendering/createGameRenderer';
import { getTierProfile } from '@/core/rendering/qualityTier';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { playSfx } from '@/features/audio/sfxService';
import { createCrosshair3d, createCrossbow3d, createHitFlashRig, FpsHud3d, type Crosshair3d } from './fpsHud3d';

export interface FpsOption {
  id: string;
  label: string;
  code: 'A' | 'B' | 'C';
  colorHex: number;
}

interface Target {
  option: FpsOption;
  group: THREE.Group;
  core: THREE.Mesh;
  frame: THREE.Mesh;
  choicePlane: THREE.Mesh;
  baseY: number;
  spawnAt: number;
  phase: number;
  hovered: boolean;
  resolved: boolean;
}

interface Burst {
  group: THREE.Group;
  parts: Array<{ mesh: THREE.Mesh; vel: THREE.Vector3 }>;
  startedAt: number;
  durationMs: number;
}

interface Projectile {
  mesh: THREE.Group;
  startedAt: number;
  durationMs: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  control: THREE.Vector3;
  impactColor?: number;
}

const MAX_RENDER_WIDTH = 1280;
const MAX_RENDER_HEIGHT = 720;

function makePixelTexture(a: string, b: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const odd = (x + y) % 2 === 0;
      ctx.fillStyle = odd ? a : b;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

function wrapCanvasLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length > 0 ? lines : [text];
}

const CHOICE_FACE_W = 1.58;
const CHOICE_FACE_H = 1.48;

/** Nhãn lựa chọn trực tiếp trên mặt bia mục tiêu (không dùng A/B/C). */
function makeChoiceFaceTexture(label: string, accentHex: number): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.round(canvas.width * (CHOICE_FACE_H / CHOICE_FACE_W));
  const ctx = canvas.getContext('2d')!;
  const r = (accentHex >> 16) & 255;
  const g = (accentHex >> 8) & 255;
  const b = accentHex & 255;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.beginPath();
  ctx.roundRect(28, 28, canvas.width - 56, canvas.height - 56, 32);
  ctx.fill();
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.95)`;
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 168px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lines = wrapCanvasLines(ctx, label, canvas.width - 80);
  const lineH = 176;
  const startY = canvas.height / 2 - ((lines.length - 1) * lineH) / 2;
  lines.forEach((ln, i) => ctx.fillText(ln, canvas.width / 2, startY + i * lineH));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function makeSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#7dd3fc');
  grad.addColorStop(0.45, '#bae6fd');
  grad.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class FpsCrossbowScene {
  private renderer: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private bloomPass!: UnrealBloomPass;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private frame: FrameLoop | null = null;
  private disposed = false;
  private yaw = 0;
  private pitch = 0;
  private world = new THREE.Group();
  private targets: Target[] = [];
  private raycaster = new THREE.Raycaster();
  private highlightUntil = 0;
  private highlightColor = 0xffffff;
  private readonly skyTexture: THREE.CanvasTexture;
  private trail: THREE.Line;
  private trailUntil = 0;
  private trailFrom = new THREE.Vector3();
  private trailTo = new THREE.Vector3();
  private projectiles: Projectile[] = [];
  private bursts: Burst[] = [];
  private birds: THREE.Group[] = [];
  private clouds: THREE.Mesh[] = [];
  private riverMesh: THREE.Mesh | null = null;
  private riverTex: THREE.CanvasTexture | null = null;
  private isPointerLocked = false;
  private isPointerInside = false;
  private readonly hud: FpsHud3d;
  private readonly hitFlash: ReturnType<typeof createHitFlashRig>;
  private readonly crosshair: Crosshair3d;
  private readonly crossbow: ReturnType<typeof createCrossbow3d>;

  constructor(private mount: HTMLElement) {
    const w = mount.clientWidth || 640;
    const h = mount.clientHeight || 360;
    mount.tabIndex = -1;
    mount.setAttribute('role', 'application');
    mount.setAttribute('aria-label', 'Khung ngắm — di chuột để ngắm, bấm Space hoặc click để chọn đáp án');
    const canvas = document.createElement('canvas');
    canvas.className = 'fps-canvas';
    mount.appendChild(canvas);

    // DPR, antialias, shadow map đều theo tầng phần cứng (xem createGameRenderer/qualityTier).
    this.renderer = createGameRenderer({ canvas, shadows: true }).renderer;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.setCappedRenderSize(w, h);
    this.scene = new THREE.Scene();
    this.skyTexture = makeSkyTexture();
    this.scene.background = this.skyTexture;
    this.scene.fog = new THREE.Fog(0xc8e6ff, 11, 30);
    this.camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 100);
    this.camera.position.set(0, 1.15, 3.8);

    const ambient = new THREE.AmbientLight(0xfff7ed, 0.55);
    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x4ade80, 0.48);
    const sun = new THREE.DirectionalLight(0xfff4e0, 1.05);
    sun.position.set(5, 9, 4);
    sun.castShadow = true;
    const shadowSize = getTierProfile().shadowMapSize;
    sun.shadow.mapSize.set(shadowSize, shadowSize);
    sun.shadow.bias = -0.0004;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    const fill = new THREE.DirectionalLight(0xbfdbfe, 0.35);
    fill.position.set(-4, 3, 2);
    this.scene.add(ambient, hemi, sun, fill, this.world);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.45, 0.88);
    if (getTierProfile().bloomEnabled) this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.buildMinecraftBackdrop();
    this.scene.add(this.camera);
    this.hud = new FpsHud3d();
    this.hud.attachToWorld(this.world);
    this.crosshair = createCrosshair3d();
    this.camera.add(this.crosshair.group);
    this.crossbow = createCrossbow3d();
    this.camera.add(this.crossbow.group);
    this.hitFlash = createHitFlashRig();
    this.camera.add(this.hitFlash.group);
    this.trail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
      new THREE.LineBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0 })
    );
    this.scene.add(this.trail);

    mount.addEventListener('pointermove', this.onPointerMove);
    mount.addEventListener('pointerenter', this.onPointerEnter);
    mount.addEventListener('pointerleave', this.onPointerLeave);
    mount.addEventListener('click', this.onRequestPointerLock);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    window.addEventListener('resize', this.onResize);
    this.frame = new FrameLoop(this.loop, 60);
    this.frame.start();
  }

  /** Đưa focus vào khung chơi để điều khiển ngay (chuột + phím). */
  focusControl(): void {
    if (this.disposed) return;
    this.mount.focus({ preventScroll: true });
    const rect = this.mount.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.isPointerInside = true;
      this.updateAimFromPointer({
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      } as PointerEvent);
    }
  }

  setHudQuestion(itemLabel: string): void {
    this.hud.setQuestion(itemLabel);
  }

  setHudFeedback(text: string, kind: 'ok' | 'bad' | 'neutral' = 'neutral'): void {
    this.hud.setFeedback(text, kind);
  }

  setHudTimer(ratio: number): void {
    this.hud.setTimer(ratio);
  }

  setHudProgress(done: number, current: number, total: number): void {
    this.hud.setProgress(done, current, total);
  }

  flashHit(ok: boolean): void {
    this.hitFlash.flash(ok);
  }

  setOptions(options: FpsOption[]): void {
    this.clearTargets();
    const xPositions = [-2.9, 0, 2.9];
    options.forEach((opt, idx) => {
      const group = new THREE.Group();
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.95, 1.95, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x5c3d1e, roughness: 0.82, metalness: 0.04 })
      );
      frame.castShadow = true;
      frame.receiveShadow = true;
      const core = new THREE.Mesh(
        new THREE.BoxGeometry(1.62, 1.62, 0.34),
        new THREE.MeshStandardMaterial({
          color: opt.colorHex,
          roughness: 0.55,
          metalness: 0.08,
          emissive: opt.colorHex,
          emissiveIntensity: 0.12,
        })
      );
      core.position.z = 0.14;
      core.castShadow = true;
      const choiceTex = makeChoiceFaceTexture(opt.label, opt.colorHex);
      const choicePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(CHOICE_FACE_W, CHOICE_FACE_H),
        new THREE.MeshBasicMaterial({ map: choiceTex, transparent: true, toneMapped: false })
      );
      choicePlane.position.set(0, 0.08, 0.36);
      group.add(frame, core, choicePlane);
      const baseY = 2.0;
      group.position.set(xPositions[idx] ?? 0, baseY, -8.2);
      group.scale.setScalar(0.01);
      this.world.add(group);
      this.targets.push({
        option: opt,
        group,
        core,
        frame,
        choicePlane,
        baseY,
        spawnAt: performance.now() + idx * 80,
        phase: idx * 1.7,
        hovered: false,
        resolved: false,
      });
    });
  }

  shoot(): string | null {
    if (this.disposed) return null;
    this.playShotSound();
    this.crossbow.recoil();
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.trailFrom = this.camera.position.clone().add(dir.clone().multiplyScalar(0.35));
    this.trailTo = this.camera.position.clone().add(dir.clone().multiplyScalar(14));
    this.trailUntil = performance.now() + 120;
    const hits = this.raycaster.intersectObjects(this.targets.map((t) => t.core), false);
    if (hits.length === 0) {
      this.spawnProjectile(this.trailFrom, this.trailTo, 0xcbd5e1);
      this.flash(0xf8fafc);
      return null;
    }
    const hit = hits[0]!;
    this.spawnProjectile(this.trailFrom, hit.point.clone());
    const mesh = hit.object;
    const target = this.targets.find((t) => t.core === mesh);
    if (!target) return null;
    return target.option.id;
  }

  markAnswer(answerId: string, ok: boolean): void {
    const target = this.targets.find((t) => t.option.id === answerId);
    if (!target) return;
    target.resolved = true;
    const coreMat = target.core.material as THREE.MeshStandardMaterial;
    coreMat.color.setHex(ok ? 0x22c55e : 0xef4444);
    coreMat.emissive.setHex(ok ? 0x166534 : 0x7f1d1d);
    coreMat.emissiveIntensity = ok ? 0.35 : 0.28;
    (target.frame.material as THREE.MeshStandardMaterial).color.setHex(ok ? 0x166534 : 0x7f1d1d);
    this.flash(ok ? 0x22c55e : 0xef4444);
    // Punch-scale + chùm mảnh vỡ tại vị trí mục tiêu.
    target.group.scale.setScalar(1.22);
    const impact = target.group.position.clone();
    impact.z += 0.4;
    this.spawnBurst(impact, ok ? 0x4ade80 : 0xf87171, ok ? 18 : 14);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.frame?.dispose();
    this.mount.removeEventListener('pointermove', this.onPointerMove);
    this.mount.removeEventListener('pointerenter', this.onPointerEnter);
    this.mount.removeEventListener('pointerleave', this.onPointerLeave);
    this.mount.removeEventListener('click', this.onRequestPointerLock);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    window.removeEventListener('resize', this.onResize);
    if (document.pointerLockElement === this.mount) {
      document.exitPointerLock();
    }
    this.clearTargets();
    this.hud.dispose();
    this.crossbow.dispose();
    this.bursts.forEach((b) => {
      b.parts.forEach((p) => {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
      b.group.removeFromParent();
    });
    this.bursts = [];
    this.birds.forEach((b) => {
      b.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const mat = node.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      b.removeFromParent();
    });
    this.birds = [];
    this.riverTex?.dispose();
    this.hitFlash.group.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
        const mat = node.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
    this.projectiles.forEach((p) => {
      p.mesh.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const mat = node.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      p.mesh.removeFromParent();
    });
    this.projectiles = [];
    this.trail.geometry.dispose();
    (this.trail.material as THREE.Material).dispose();
    this.skyTexture.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    this.camera.removeFromParent();
    this.mount.querySelector('.fps-canvas')?.remove();
  }

  private buildMinecraftBackdrop(): void {
    const grassTex = makePixelTexture('#22c55e', '#16a34a');
    const leavesTex = makePixelTexture('#15803d', '#166534');
    const riverTex = makePixelTexture('#38bdf8', '#0ea5e9');
    const mountainTex = makePixelTexture('#94a3b8', '#64748b');
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.8, 24),
      new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.92, metalness: 0 })
    );
    ground.position.set(0, -0.4, -6);
    ground.receiveShadow = true;
    this.world.add(ground);

    // Dải sông Cửu Long chảy giữa thung lũng — texture cuộn để nước trôi
    riverTex.repeat.set(2, 8);
    this.riverTex = riverTex;
    const river = new THREE.Mesh(
      new THREE.BoxGeometry(5.4, 0.16, 20),
      new THREE.MeshLambertMaterial({ map: riverTex, transparent: true, opacity: 0.95 })
    );
    river.position.set(0, -0.03, -8.5);
    this.riverMesh = river;
    this.world.add(river);

    // Hai bờ sông nhô cao để thấy rõ lòng sông
    const riverBankL = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.32, 20),
      new THREE.MeshLambertMaterial({ map: grassTex })
    );
    riverBankL.position.set(-3.4, 0.05, -8.5);
    const riverBankR = riverBankL.clone();
    riverBankR.position.x = 3.4;
    this.world.add(riverBankL, riverBankR);

    // Viền bọt sáng dọc hai mép sông
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.6 });
    const foamL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 20), foamMat);
    foamL.position.set(-2.6, 0.06, -8.5);
    const foamR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 20), foamMat);
    foamR.position.set(2.6, 0.06, -8.5);
    this.world.add(foamL, foamR);

    // Cây voxel dọc hai bờ — thân gỗ + tán lá nhiều khối
    const barkTex = makePixelTexture('#7c4a1e', '#5c3514');
    const trunkGeo = new THREE.BoxGeometry(0.42, 1.4, 0.42);
    const canopyGeo = new THREE.BoxGeometry(1.5, 1.0, 1.5);
    const trunkMat = new THREE.MeshLambertMaterial({ map: barkTex });
    const canopyMat = new THREE.MeshLambertMaterial({ map: leavesTex });
    const treeSpots = [
      [-4.6, -7], [-5.4, -11], [-4.8, -15], [4.6, -7], [5.4, -11], [4.8, -15], [-6.4, -13], [6.4, -9],
    ];
    treeSpots.forEach(([x, z], i) => {
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x!, 0.6, z!);
      trunk.castShadow = true;
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(x!, 1.5 + (i % 2) * 0.2, z!);
      canopy.castShadow = true;
      const canopyTop = new THREE.Mesh(canopyGeo, canopyMat);
      canopyTop.scale.setScalar(0.62);
      canopyTop.position.set(x!, 2.2 + (i % 2) * 0.2, z!);
      this.world.add(trunk, canopy, canopyTop);
    });

    // Mặt trời voxel phía xa
    const sun = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xfff3c4, toneMapped: false })
    );
    sun.position.set(-7, 7.5, -18);
    this.world.add(sun);

    // Vài cánh chim bay vòng phía xa cho cảnh sống động
    for (let i = 0; i < 3; i++) {
      const bird = new THREE.Group();
      const wingGeo = new THREE.BoxGeometry(0.5, 0.06, 0.18);
      const wingMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
      const wingL = new THREE.Mesh(wingGeo, wingMat);
      wingL.position.x = -0.28;
      const wingR = new THREE.Mesh(wingGeo, wingMat);
      wingR.position.x = 0.28;
      bird.add(wingL, wingR);
      bird.position.set(-9 + i * 3, 5, -14 - i);
      this.world.add(bird);
      this.birds.push(bird);
    }

    // Dãy núi voxel phía xa
    for (let i = 0; i < 6; i++) {
      const mountain = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.8 + (i % 3) * 0.9, 1.4),
        new THREE.MeshLambertMaterial({ map: mountainTex })
      );
      mountain.position.set(-7 + i * 2.8, 1.0 + (i % 3) * 0.45, -15.5 - (i % 2) * 1.4);
      this.world.add(mountain);
    }

    // Mây voxel trôi chậm
    for (let i = 0; i < 7; i++) {
      const cloud = new THREE.Mesh(
        new THREE.BoxGeometry(1.6 + (i % 2) * 0.6, 0.7, 0.8),
        new THREE.MeshLambertMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.88 })
      );
      cloud.position.set(-8 + i * 2.6, 4.6 + (i % 3) * 0.35, -10 - (i % 2) * 4);
      this.world.add(cloud);
      this.clouds.push(cloud);
    }
  }

  private onPointerEnter = (e: PointerEvent) => {
    this.isPointerInside = true;
    if (!this.isPointerLocked) this.updateAimFromPointer(e);
  };

  private onPointerLeave = () => {
    this.isPointerInside = false;
  };

  private onPointerMove = (e: PointerEvent) => {
    const sensitivity = 0.0022;
    if (this.isPointerLocked) {
      this.yaw -= e.movementX * sensitivity;
      this.pitch -= e.movementY * sensitivity;
    } else if (this.isPointerInside) {
      this.updateAimFromPointer(e);
      return;
    } else {
      return;
    }
    this.pitch = Math.max(-0.58, Math.min(0.42, this.pitch));
  };

  /** Ngắm theo vị trí chuột trên khung — không cần bấm để khóa con trỏ. */
  private updateAimFromPointer(e: PointerEvent): void {
    const rect = this.mount.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    this.yaw = -nx * 0.92;
    this.pitch = -ny * 0.48;
    this.pitch = Math.max(-0.58, Math.min(0.42, this.pitch));
  };

  private onRequestPointerLock = () => {
    if (document.pointerLockElement !== this.mount) {
      this.mount.requestPointerLock();
    }
  };

  private onPointerLockChange = () => {
    this.isPointerLocked = document.pointerLockElement === this.mount;
  };

  private onResize = () => {
    if (this.disposed) return;
    const w = this.mount.clientWidth || 640;
    const h = this.mount.clientHeight || 360;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.setCappedRenderSize(w, h);
  };

  private flash(color: number): void {
    this.highlightColor = color;
    this.highlightUntil = performance.now() + 180;
  }

  private loop = () => {
    if (this.disposed) return;
    const now = performance.now();
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.updateTargets(now);
    if (now < this.trailUntil) {
      this.trail.geometry.setFromPoints([this.trailFrom, this.trailTo]);
      const m = this.trail.material as THREE.LineBasicMaterial;
      m.opacity = (this.trailUntil - now) / 120;
    } else {
      (this.trail.material as THREE.LineBasicMaterial).opacity = 0;
    }
    if (now < this.highlightUntil) {
      this.scene.fog = new THREE.Fog(this.highlightColor, 7, 23);
      this.bloomPass.strength = 0.55;
    } else {
      this.scene.fog = new THREE.Fog(0xc8e6ff, 11, 30);
      this.bloomPass.strength = 0.28;
    }
    this.clouds.forEach((c, i) => {
      c.position.x += 0.002 + i * 0.00008;
      if (c.position.x > 10) c.position.x = -10;
    });
    if (this.riverMesh) {
      this.riverMesh.position.y = -0.03 + Math.sin(now * 0.0018) * 0.02;
      this.riverMesh.rotation.z = Math.sin(now * 0.0009) * 0.01;
    }
    if (this.riverTex) {
      this.riverTex.offset.y = (this.riverTex.offset.y - 0.0016) % 1;
    }
    this.updateBirds(now);
    this.updateProjectiles(now);
    this.updateBursts(now);
    this.crossbow.idleTick(now);
    this.hitFlash.tick(now);
    this.hud.tick(now);
    this.hud.updateFacing(this.camera);
    this.composer.render();
  };

  /** Hoạt ảnh mục tiêu: hiện ra, lơ lửng, sáng lên khi được ngắm trúng. */
  private updateTargets(now: number): void {
    let aimedAny = false;
    if (this.targets.length > 0) {
      this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
      const hits = this.raycaster.intersectObjects(this.targets.map((t) => t.core), false);
      const hitMesh = hits[0]?.object;
      this.targets.forEach((t) => {
        t.hovered = !t.resolved && t.core === hitMesh;
        if (t.hovered) aimedAny = true;
      });
    }
    this.crosshair.setLocked(aimedAny);

    this.targets.forEach((t) => {
      const grow = Math.min(1, Math.max(0, (now - t.spawnAt) / 260));
      const ease = 1 - Math.pow(1 - grow, 3);
      // Nhịp đập sau khi trả lời rồi giãn dần về 1.
      const base = t.resolved ? t.group.scale.x : ease;
      const settle = t.resolved ? base + (1 - base) * 0.12 : base;
      const hoverBoost = t.hovered ? 1 + Math.sin(now * 0.012) * 0.05 : 1;
      t.group.scale.setScalar(settle * hoverBoost);
      if (!t.resolved) {
        t.group.position.y = t.baseY + Math.sin(now * 0.0018 + t.phase) * 0.12 * ease;
        t.group.rotation.y = Math.sin(now * 0.0012 + t.phase) * 0.06;
      }
      const coreMat = t.core.material as THREE.MeshStandardMaterial;
      if (!t.resolved) {
        coreMat.emissiveIntensity = t.hovered ? 0.45 : 0.12;
      }
    });
  }

  private spawnBurst(at: THREE.Vector3, colorHex: number, count: number): void {
    const group = new THREE.Group();
    group.position.copy(at);
    const parts: Burst['parts'] = [];
    const geo = new THREE.BoxGeometry(0.09, 0.09, 0.09);
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, toneMapped: false });
      const mesh = new THREE.Mesh(geo, mat);
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 1.4 + 0.2,
        (Math.random() - 0.5) * 2
      ).normalize();
      const speed = 0.04 + Math.random() * 0.06;
      parts.push({ mesh, vel: dir.multiplyScalar(speed) });
      group.add(mesh);
    }
    this.scene.add(group);
    this.bursts.push({ group, parts, startedAt: performance.now(), durationMs: 620 });
  }

  private updateBursts(now: number): void {
    this.bursts = this.bursts.filter((b) => {
      const t = (now - b.startedAt) / b.durationMs;
      if (t >= 1) {
        b.parts.forEach((p) => {
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.Material).dispose();
        });
        b.group.removeFromParent();
        return false;
      }
      b.parts.forEach((p) => {
        p.vel.y -= 0.0016; // trọng lực nhẹ
        p.mesh.position.add(p.vel);
        p.mesh.rotation.x += 0.2;
        p.mesh.rotation.y += 0.16;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - t;
        p.mesh.scale.setScalar(1 - t * 0.6);
      });
      return true;
    });
  }

  private updateBirds(now: number): void {
    this.birds.forEach((b, i) => {
      const speed = 0.4 + i * 0.12;
      const x = ((now * 0.0006 * speed + i * 2.1) % 6) * 3 - 9;
      b.position.x = x;
      b.position.y = 5 + Math.sin(now * 0.002 + i) * 0.4;
      b.children.forEach((wing, wi) => {
        wing.rotation.z = (wi === 0 ? 1 : -1) * Math.sin(now * 0.02 + i) * 0.5;
      });
    });
  }

  private clearTargets(): void {
    this.targets.forEach((t) => {
      [t.core, t.frame, t.choicePlane].forEach((m) => {
        m.geometry.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((mm) => mm.dispose());
        else {
          const basic = mat as THREE.MeshBasicMaterial;
          if (basic.map) basic.map.dispose();
          mat.dispose();
        }
      });
      t.group.removeFromParent();
    });
    this.targets = [];
  }

  private setCappedRenderSize(width: number, height: number): void {
    const scale = Math.min(1, MAX_RENDER_WIDTH / width, MAX_RENDER_HEIGHT / height);
    const rw = Math.max(2, Math.floor(width * scale));
    const rh = Math.max(2, Math.floor(height * scale));
    this.renderer.setSize(rw, rh, false);
    this.composer?.setSize(rw, rh);
  }

  private spawnProjectile(from: THREE.Vector3, to: THREE.Vector3, impactColor?: number): void {
    // Mũi tên nỏ: thân trụ + đầu nhọn + cánh đuôi, hướng theo chiều bay (group.lookAt).
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.34, 6),
      new THREE.MeshBasicMaterial({ color: 0xcbd5e1, toneMapped: false })
    );
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = 0.02;
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.026, 0.08, 6),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8, toneMapped: false })
    );
    tip.rotation.x = -Math.PI / 2;
    tip.position.z = 0.22;
    const fletch = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.005, 0.07),
      new THREE.MeshBasicMaterial({ color: 0xf87171, toneMapped: false })
    );
    fletch.position.z = -0.14;
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.4, toneMapped: false })
    );
    g.add(glow, shaft, tip, fletch);
    g.position.copy(from);
    this.scene.add(g);
    const mid = from.clone().lerp(to, 0.5);
    const arcHeight = Math.max(0.55, from.distanceTo(to) * 0.12);
    const control = mid.add(new THREE.Vector3(0, arcHeight, 0));
    this.projectiles.push({
      mesh: g,
      startedAt: performance.now(),
      durationMs: 420,
      from: from.clone(),
      to: to.clone(),
      control,
      impactColor,
    });
  }

  private updateProjectiles(now: number): void {
    this.projectiles = this.projectiles.filter((p) => {
      const t = Math.min(1, (now - p.startedAt) / p.durationMs);
      const inv = 1 - t;
      const x = inv * inv * p.from.x + 2 * inv * t * p.control.x + t * t * p.to.x;
      const y = inv * inv * p.from.y + 2 * inv * t * p.control.y + t * t * p.to.y;
      const z = inv * inv * p.from.z + 2 * inv * t * p.control.z + t * t * p.to.z;
      p.mesh.position.set(x, y, z);
      p.mesh.lookAt(p.to);
      if (t >= 1) {
        if (p.impactColor !== undefined) {
          this.spawnBurst(p.to.clone(), p.impactColor, 9);
        }
        p.mesh.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.geometry.dispose();
            const mat = node.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
        p.mesh.removeFromParent();
        return false;
      }
      return true;
    });
  }

  private playShotSound(): void {
    playSfx('shoot');
  }
}
