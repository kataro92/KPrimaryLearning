import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { playSfx } from '@/features/audio/sfxService';
import { createCrosshair3d, createHitFlashRig, FpsHud3d } from './fpsHud3d';

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
  labelPlane: THREE.Mesh;
  codePlane: THREE.Mesh;
}

interface Projectile {
  mesh: THREE.Group;
  startedAt: number;
  durationMs: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  control: THREE.Vector3;
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

function makeTextTexture(text: string, bg = '#f8fafc', fg = '#0f172a'): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fg;
  ctx.font = '900 124px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeCodeTexture(code: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 180px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(code, canvas.width / 2, canvas.height / 2 + 6);
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
  private rafId = 0;
  private disposed = false;
  private yaw = 0;
  private pitch = 0;
  private world = new THREE.Group();
  private targets: Target[] = [];
  private raycaster = new THREE.Raycaster();
  private highlightUntil = 0;
  private highlightColor = 0xffffff;
  private bowGroup = new THREE.Group();
  private recoilUntil = 0;
  private trail: THREE.Line;
  private trailUntil = 0;
  private trailFrom = new THREE.Vector3();
  private trailTo = new THREE.Vector3();
  private projectiles: Projectile[] = [];
  private clouds: THREE.Mesh[] = [];
  private riverMesh: THREE.Mesh | null = null;
  private isPointerLocked = false;
  private isPointerInside = false;
  private readonly hud: FpsHud3d;
  private readonly hitFlash: ReturnType<typeof createHitFlashRig>;

  constructor(private mount: HTMLElement) {
    const w = mount.clientWidth || 640;
    const h = mount.clientHeight || 360;
    mount.tabIndex = -1;
    mount.setAttribute('role', 'application');
    mount.setAttribute('aria-label', 'Khung ngắm nỏ — di chuột để ngắm, bấm Space hoặc click để bắn');
    const canvas = document.createElement('canvas');
    canvas.className = 'fps-canvas';
    mount.appendChild(canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.setCappedRenderSize(w, h);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 100);
    this.camera.position.set(0, 1.15, 3.8);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xb9d5ff, 0.42);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(4, 6, 3);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.bias = -0.0005;
    this.scene.add(ambient, hemi, dir, this.world);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.45, 0.88);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.buildMinecraftBackdrop();
    this.buildCrossbow();
    this.hud = new FpsHud3d();
    this.hud.attachTo(this.camera);
    this.camera.add(createCrosshair3d());
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
    this.loop();
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
        new THREE.MeshLambertMaterial({ color: 0x78350f })
      );
      const core = new THREE.Mesh(
        new THREE.BoxGeometry(1.62, 1.62, 0.34),
        new THREE.MeshLambertMaterial({ color: opt.colorHex })
      );
      core.position.z = 0.14;
      const labelTex = makeTextTexture(opt.label, '#0f172a', '#f8fafc');
      const labelPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3.35, 0.86),
        new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
      );
      labelPlane.position.set(0, 1.9, 0.1);
      const codeTex = makeCodeTexture(opt.code);
      const codePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.95),
        new THREE.MeshBasicMaterial({ map: codeTex, transparent: true })
      );
      codePlane.position.set(0, 0.14, 0.34);
      group.add(frame, core, labelPlane, codePlane);
      group.position.set(xPositions[idx] ?? 0, 2.0, -8.2);
      this.world.add(group);
      this.targets.push({ option: opt, group, core, frame, labelPlane, codePlane });
    });
  }

  shoot(): string | null {
    this.recoilUntil = performance.now() + 110;
    this.playShotSound();
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const dir = new THREE.Vector3();
    const right = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    right.crossVectors(dir, this.camera.up).normalize();
    this.trailFrom = this.camera.position
      .clone()
      .add(dir.clone().multiplyScalar(0.8))
      .add(right.clone().multiplyScalar(0.18))
      .add(new THREE.Vector3(0, -0.08, 0));
    this.trailTo = this.camera.position.clone().add(dir.clone().multiplyScalar(14));
    this.trailUntil = performance.now() + 120;
    const hits = this.raycaster.intersectObjects(this.targets.map((t) => t.core), false);
    if (hits.length === 0) {
      this.spawnProjectile(this.trailFrom, this.trailTo);
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
    (target.core.material as THREE.MeshLambertMaterial).color.setHex(ok ? 0x22c55e : 0xef4444);
    (target.frame.material as THREE.MeshLambertMaterial).color.setHex(ok ? 0x166534 : 0x7f1d1d);
    this.flash(ok ? 0x22c55e : 0xef4444);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
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
    this.renderer.dispose();
    this.mount.querySelector('.fps-canvas')?.remove();
  }

  private buildMinecraftBackdrop(): void {
    const grassTex = makePixelTexture('#22c55e', '#16a34a');
    const leavesTex = makePixelTexture('#15803d', '#166534');
    const riverTex = makePixelTexture('#38bdf8', '#0ea5e9');
    const mountainTex = makePixelTexture('#94a3b8', '#64748b');
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.8, 24),
      new THREE.MeshLambertMaterial({ map: grassTex })
    );
    ground.position.set(0, -0.4, -6);
    this.world.add(ground);

    // Dải sông chạy giữa thung lũng
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

    for (let i = 0; i < 20; i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        new THREE.MeshLambertMaterial({ map: leavesTex })
      );
      block.position.set(-8 + (i % 10) * 1.8, 0.2, -12 - Math.floor(i / 10) * 3.2);
      this.world.add(block);
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

  private buildCrossbow(): void {
    const woodTex = makePixelTexture('#92400e', '#78350f');
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.16, 0.78),
      new THREE.MeshLambertMaterial({ map: woodTex })
    );
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.08, 0.12),
      new THREE.MeshLambertMaterial({ map: woodTex })
    );
    arm.position.z = -0.25;
    this.bowGroup.add(body, arm);
    this.bowGroup.position.set(0.52, -0.34, -0.72);
    this.camera.add(this.bowGroup);
    this.scene.add(this.camera);
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
    const pulse = Math.sin(now * 0.004) * 0.03;
    this.targets.forEach((t, idx) => {
      t.core.position.z = 0.14 + pulse * (idx % 2 === 0 ? 1 : -1);
      t.frame.rotation.y = Math.sin(now * 0.001 + idx) * 0.08;
      t.codePlane.rotation.y = t.frame.rotation.y * 0.3;
    });
    const recoil = now < this.recoilUntil ? (this.recoilUntil - now) / 110 : 0;
    this.bowGroup.position.z = -0.72 + recoil * 0.12;
    this.bowGroup.rotation.x = -recoil * 0.2;
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
      // Sương nền nhẹ để có chiều sâu xa gần
      this.scene.fog = new THREE.Fog(0xdbeafe, 10, 28);
      this.bloomPass.strength = 0.3;
    }
    this.clouds.forEach((c, i) => {
      c.position.x += 0.002 + i * 0.00008;
      if (c.position.x > 10) c.position.x = -10;
    });
    if (this.riverMesh) {
      this.riverMesh.position.y = -0.03 + Math.sin(now * 0.0018) * 0.02;
      this.riverMesh.rotation.z = Math.sin(now * 0.0009) * 0.01;
    }
    this.updateProjectiles(now);
    this.hitFlash.tick(now);
    this.composer.render();
    this.rafId = requestAnimationFrame(this.loop);
  };

  private clearTargets(): void {
    this.targets.forEach((t) => {
      [t.core, t.frame, t.labelPlane, t.codePlane].forEach((m) => {
        m.geometry.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((mm) => mm.dispose());
        else mat.dispose();
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

  private spawnProjectile(from: THREE.Vector3, to: THREE.Vector3): void {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.42, 6),
      new THREE.MeshLambertMaterial({ color: 0x78350f })
    );
    body.rotation.z = Math.PI / 2;
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.028, 0.12, 6),
      new THREE.MeshLambertMaterial({ color: 0xe2e8f0 })
    );
    tip.rotation.z = -Math.PI / 2;
    tip.position.x = 0.24;
    const fletch = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.08, 0.02),
      new THREE.MeshLambertMaterial({ color: 0xef4444 })
    );
    fletch.position.x = -0.2;
    const g = new THREE.Group();
    g.add(body, tip, fletch);
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
