import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { playSfx } from '@/features/audio/sfxService';
import { fitModelToHeight, tryLoadGltfScene } from '@/core/assets/fitGltfModel';

const BASE = import.meta.env.BASE_URL;
const TREX_MODEL_URLS = [
  `${BASE}models/tinh-nham-trang-ti/trex.glb`,
  `${BASE}models/tinh-nham-trang-ti/scene.gltf`,
] as const;

interface CannonBall {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  start: THREE.Vector3;
  control: THREE.Vector3;
  end: THREE.Vector3;
  startAt: number;
  durationMs: number;
}

/** T-Rex 3D: đúng thì bắn pháo, trúng thì lắc; đủ điểm thì ngất. */
export class TrexBattleScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly clock = new THREE.Clock();
  private readonly trex = new THREE.Group();
  private readonly proceduralLayer = new THREE.Group();
  private readonly cannon = new THREE.Group();
  private readonly stars = new THREE.Group();
  private readonly balls: CannonBall[] = [];
  private readonly hitBursts: THREE.Mesh[] = [];
  private readonly bodyMat = new THREE.MeshStandardMaterial({ color: 0xb72626, roughness: 0.68, metalness: 0.06 });
  private readonly bodyDarkMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.74, metalness: 0.04 });
  private readonly bellyMat = new THREE.MeshStandardMaterial({ color: 0xfca5a5, roughness: 0.8, metalness: 0.02 });
  private readonly eyeMat = new THREE.MeshStandardMaterial({
    color: 0xffd32a,
    emissive: 0xffd32a,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.1,
  });
  private readonly toothMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.08 });
  private readonly spikeMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.64, metalness: 0.05 });
  private readonly outlineMat = new THREE.MeshBasicMaterial({ color: 0x1a1020, side: THREE.BackSide });

  private head: THREE.Group | null = null;
  private jaw: THREE.Group | null = null;
  private tail: THREE.Group | null = null;
  private dizzyStars: THREE.Group | null = null;
  private koSprite: THREE.Sprite | null = null;
  private hitShake = 0;
  private fainted = false;
  private celebrationGlow = 0;
  private slowMoUntil = 0;
  private zoomUntil = 0;
  private simTime = 0;
  private rafId = 0;
  private disposed = false;
  private landedHits = 0;
  private nextFireworkAt = 0;
  private readonly bgNight = new THREE.Color(0x06091b);
  private readonly bgFinal = new THREE.Color(0x261b4f);

  constructor(mount: HTMLElement, totalHits: number) {
    this.mount = mount;
    const _maxHits = Math.max(1, totalHits);
    void _maxHits;

    this.scene = new THREE.Scene();
    this.scene.background = this.bgNight.clone();
    this.scene.fog = new THREE.FogExp2(this.bgNight.getHex(), 0.04);

    this.camera = new THREE.PerspectiveCamera(44, 1, 0.1, 80);
    this.camera.position.set(0, 3.2, 9);
    this.camera.lookAt(0, 1.5, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.domElement.className = 'trang-ti-trex-canvas';
    this.mount.appendChild(this.renderer.domElement);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.36, 0.45, 0.85);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.buildWorld();
    this.buildTrex();
    this.buildCannon();

    this.scene.add(this.stars, this.cannon, this.trex);
    this.resize();
    window.addEventListener('resize', this.onResize);
    void this.loadGltfTrex();
    this.loop();
  }

  private async loadGltfTrex(): Promise<void> {
    const model = await tryLoadGltfScene(TREX_MODEL_URLS);
    if (this.disposed || !model) return;
    model.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = false;
      }
    });
    fitModelToHeight(model, 2.75);
    model.rotation.y = -Math.PI / 2;
    model.position.set(0.15, 0, 0);
    this.proceduralLayer.visible = false;
    this.trex.add(model);
    this.head = model;
    this.jaw = model;
    this.tail = model;
  }

  onCorrectAnswer(): void {
    if (this.fainted) return;
    this.spawnCannonBall();
    playSfx('shoot');
  }

  onWrongAnswer(): void {
    // Sai thì T-Rex gầm nhẹ (nhún đầu), không bị trúng đòn.
    this.hitShake = Math.max(this.hitShake, 0.35);
  }

  onCompleted(): void {
    this.fainted = true;
    this.celebrationGlow = 1;
    this.nextFireworkAt = performance.now();
    this.slowMoUntil = performance.now() + 1200;
    this.zoomUntil = performance.now() + 1500;
    this.hitShake = Math.max(this.hitShake, 1.1);
    playSfx('unlock');
    playSfx('celebrate');
    if (this.dizzyStars) this.dizzyStars.visible = true;
    if (this.koSprite) {
      this.koSprite.visible = true;
      this.koSprite.scale.set(0.01, 0.01, 1);
      this.koSprite.material.opacity = 0;
    }
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.mount.innerHTML = '';
    this.renderer.dispose();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
  }

  private buildWorld(): void {
    this.scene.add(new THREE.AmbientLight(0xb9d3ff, 0.52));
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xb9d5ff, 0.52));
    const key = new THREE.DirectionalLight(0xfff4dc, 1.15);
    key.position.set(5, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x6ea8ff, 0.75);
    rim.position.set(-5, 3.5, -4);
    this.scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 10),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.95, metalness: 0.02 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const starGeo = new THREE.BufferGeometry();
    const count = 1500;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 20;
      const t = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(t) * r;
      p[i * 3 + 1] = 2 + Math.random() * 8;
      p[i * 3 + 2] = Math.sin(t) * r - 6;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    this.stars.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xc7d2fe, size: 0.07, transparent: true, opacity: 0.9, depthWrite: false })
      )
    );
  }

  private buildTrex(): void {
    this.trex.add(this.proceduralLayer);
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.1), this.bodyMat);
    body.position.set(0, 1.5, 0);
    body.castShadow = true;
    this.addOutline(body, 0.03);
    this.proceduralLayer.add(body);
    this.addScalesOn(body, 34, 0.035, 0.06, 0xb91c1c);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.7, 0.9), this.bellyMat);
    belly.position.set(0.1, 1.1, 0.05);
    this.addOutline(belly, 0.02);
    this.proceduralLayer.add(belly);

    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.8, 0.85), this.bodyMat);
    neck.position.set(0.95, 2.0, 0);
    neck.rotation.z = -0.16;
    this.addOutline(neck, 0.028);
    this.proceduralLayer.add(neck);

    this.head = new THREE.Group();
    const skull = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.7, 0.75), this.bodyMat);
    skull.position.set(1.65, 2.45, 0);
    skull.castShadow = true;
    this.addOutline(skull, 0.03);
    this.head.add(skull);
    this.addScalesOn(skull, 14, 0.028, 0.04, 0xef4444);
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), this.eyeMat);
    eyeL.position.set(1.96, 2.55, 0.24);
    const eyeR = eyeL.clone();
    eyeR.position.z = -0.24;
    this.head.add(eyeL, eyeR);
    this.proceduralLayer.add(this.head);

    this.jaw = new THREE.Group();
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.3, 0.7), this.bodyDarkMat);
    jaw.position.set(1.72, 2.18, 0);
    this.addOutline(jaw, 0.025);
    this.jaw.add(jaw);
    for (let i = 0; i < 6; i++) {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 8), this.toothMat);
      tooth.rotation.x = Math.PI;
      tooth.position.set(1.3 + i * 0.12, 2.05, -0.24 + (i % 2) * 0.48);
      this.jaw.add(tooth);
    }
    this.proceduralLayer.add(this.jaw);

    for (const side of [-1, 1] as const) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.0, 0.45), this.bodyDarkMat);
      leg.position.set(side * 0.55, 0.68, 0.18);
      leg.castShadow = true;
      this.addOutline(leg, 0.024);
      this.proceduralLayer.add(leg);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.2, 0.7), this.bodyDarkMat);
      foot.position.set(side * 0.55, 0.16, 0.38);
      this.addOutline(foot, 0.022);
      this.proceduralLayer.add(foot);
      for (let i = 0; i < 3; i++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 8), this.toothMat);
        claw.rotation.x = Math.PI / 2;
        claw.position.set(side * (0.42 + i * 0.12), 0.08, 0.72);
        this.proceduralLayer.add(claw);
      }
    }

    for (const side of [-1, 1] as const) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 0.2), this.bodyDarkMat);
      arm.position.set(1.05, 1.58, side * 0.38);
      arm.rotation.z = side * 0.4;
      this.addOutline(arm, 0.022);
      this.proceduralLayer.add(arm);
      for (let i = 0; i < 2; i++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.08, 8), this.toothMat);
        claw.rotation.x = Math.PI / 2;
        claw.position.set(1.03, 1.3, side * (0.31 + i * 0.12));
        this.proceduralLayer.add(claw);
      }
    }

    this.tail = new THREE.Group();
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.32, 2.6, 10), this.bodyMat);
    tail.rotation.z = Math.PI / 2;
    tail.position.set(-1.8, 1.5, 0);
    this.addOutline(tail, 0.026);
    this.tail.add(tail);
    this.proceduralLayer.add(this.tail);
    this.addBackSpikes();
    this.addBodyStripes();

    this.dizzyStars = new THREE.Group();
    this.dizzyStars.visible = false;
    for (let i = 0; i < 6; i++) {
      const star = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.08, 0),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xfacc15 : 0xf9a8d4 })
      );
      star.position.set(Math.cos((i / 6) * Math.PI * 2) * 0.5, 2.95, Math.sin((i / 6) * Math.PI * 2) * 0.32);
      this.dizzyStars.add(star);
    }
    this.trex.add(this.dizzyStars);

    this.koSprite = this.createKoSprite();
    this.koSprite.visible = false;
    this.koSprite.position.set(1.2, 3.35, 0.15);
    this.scene.add(this.koSprite);

    this.trex.position.set(1.25, 0, -0.35);
  }

  private addOutline(mesh: THREE.Mesh, thickness = 0.024): void {
    const shell = new THREE.Mesh(mesh.geometry, this.outlineMat);
    shell.scale.setScalar(1 + thickness);
    shell.renderOrder = -1;
    mesh.add(shell);
  }

  private addBackSpikes(): void {
    const spikeXs = [-1.5, -1.1, -0.7, -0.25, 0.2, 0.65, 1.05];
    spikeXs.forEach((x, i) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08 + i * 0.002, 0.22 + i * 0.02, 6), this.spikeMat);
      spike.position.set(x, 2.15 + i * 0.02, 0);
      spike.rotation.z = Math.PI;
      this.proceduralLayer.add(spike);
    });
    for (let i = 0; i < 4; i++) {
      const tSpike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 6), this.spikeMat);
      tSpike.position.set(-2.1 - i * 0.38, 1.82 - i * 0.1, 0);
      tSpike.rotation.z = Math.PI;
      this.proceduralLayer.add(tSpike);
    }
  }

  private addBodyStripes(): void {
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x5f1414, roughness: 0.74, metalness: 0.02 });
    for (let i = 0; i < 7; i++) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.05), stripeMat);
      stripe.position.set(-0.7 + i * 0.27, 1.62, 0.56);
      stripe.rotation.z = 0.25;
      this.proceduralLayer.add(stripe);
      const stripe2 = stripe.clone();
      stripe2.position.z = -0.56;
      stripe2.rotation.z = -0.25;
      this.proceduralLayer.add(stripe2);
    }
  }

  private addScalesOn(
    target: THREE.Mesh,
    count: number,
    minR: number,
    maxR: number,
    color: number
  ): void {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.03 });
    for (let i = 0; i < count; i++) {
      const scale = new THREE.Mesh(new THREE.SphereGeometry(minR + Math.random() * (maxR - minR), 8, 8), mat);
      scale.position.set(
        (Math.random() - 0.5) * 0.95,
        (Math.random() - 0.5) * 0.95,
        0.48 + Math.random() * 0.08
      );
      target.add(scale);
    }
  }

  private createKoSprite(): THREE.Sprite {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.55, '#ef4444');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.font = '900 180px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText('KO!', c.width / 2, c.height / 2 + 6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 18;
    ctx.strokeText('KO!', c.width / 2, c.height / 2 + 6);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0 });
    return new THREE.Sprite(mat);
  }

  private buildCannon(): void {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.42, 0.26, 14),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.45, metalness: 0.62 })
    );
    base.position.set(-3.2, 0.15, 0.45);
    this.cannon.add(base);

    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.32, metalness: 0.76 })
    );
    tube.rotation.z = -0.45;
    tube.position.set(-2.65, 0.72, 0.45);
    this.cannon.add(tube);
  }

  private spawnCannonBall(): void {
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x93c5fd, emissive: 0x3b82f6, emissiveIntensity: 0.4, roughness: 0.4, metalness: 0.3 })
    );
    const start = new THREE.Vector3(-2.15, 1.15, 0.45);
    const end = new THREE.Vector3(1.55, 2.15, 0.05);
    const control = new THREE.Vector3(-0.2, 3.2, 0.12);
    ball.position.copy(start);
    this.scene.add(ball);
    this.balls.push({
      mesh: ball,
      start,
      control,
      end,
      startAt: performance.now(),
      durationMs: 560,
    });
  }

  private spawnHitBurst(at: THREE.Vector3): void {
    for (let i = 0; i < 10; i++) {
      const p = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.05, 0),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xfacc15 : 0xf87171, transparent: true, opacity: 0.9 })
      );
      p.position.copy(at);
      p.userData.vel = new THREE.Vector3((Math.random() - 0.5) * 0.14, Math.random() * 0.13, (Math.random() - 0.5) * 0.14);
      p.userData.birth = performance.now();
      this.hitBursts.push(p);
      this.scene.add(p);
    }
  }

  private updateBalls(now: number): void {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i]!;
      const t = Math.min(1, (now - b.startAt) / b.durationMs);
      const u = 1 - t;
      const x = u * u * b.start.x + 2 * u * t * b.control.x + t * t * b.end.x;
      const y = u * u * b.start.y + 2 * u * t * b.control.y + t * t * b.end.y;
      const z = u * u * b.start.z + 2 * u * t * b.control.z + t * t * b.end.z;
      b.mesh.position.set(x, y, z);
      b.mesh.rotation.x += 0.18;
      b.mesh.rotation.y += 0.22;
      if (t >= 1) {
        this.scene.remove(b.mesh);
        b.mesh.geometry.dispose();
        b.mesh.material.dispose();
        this.balls.splice(i, 1);
        this.hitShake = Math.max(this.hitShake, 1);
        this.landedHits++;
        this.spawnHitBurst(b.end);
        playSfx('pop');
      }
    }
  }

  private updateBursts(now: number): void {
    for (let i = this.hitBursts.length - 1; i >= 0; i--) {
      const p = this.hitBursts[i]!;
      const age = (now - (p.userData.birth as number)) / 520;
      if (age >= 1) {
        this.scene.remove(p);
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
        this.hitBursts.splice(i, 1);
        continue;
      }
      const v = p.userData.vel as THREE.Vector3;
      p.position.add(v);
      v.y -= 0.003;
      (p.material as THREE.MeshBasicMaterial).opacity = 1 - age;
      p.scale.setScalar(1 + age * 0.7);
    }
  }

  private resize(): void {
    const w = Math.max(220, this.mount.clientWidth);
    const h = Math.max(180, this.mount.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
  }

  private onResize = (): void => {
    this.resize();
  };

  private loop = (): void => {
    if (this.disposed) return;
    const now = performance.now();
    const dt = this.clock.getDelta();
    const speedScale = now < this.slowMoUntil ? 0.34 : 1;
    this.simTime += dt * speedScale;
    const t = this.simTime;

    this.updateBalls(now);
    this.updateBursts(now);

    const idle = Math.sin(t * 1.8) * 0.04;
    const shake = this.hitShake > 0 ? Math.sin(t * 28) * 0.14 * this.hitShake : 0;
    this.hitShake = Math.max(0, this.hitShake - 0.03);

    if (!this.fainted) {
      this.trex.position.y = idle;
      this.trex.rotation.z = shake;
      this.trex.rotation.y = Math.sin(t * 0.7) * 0.09;
      if (this.head) this.head.rotation.z = Math.sin(t * 2.8) * 0.07;
      if (this.jaw) this.jaw.rotation.x = 0.08 + Math.sin(t * 3.5) * 0.06;
      if (this.tail) this.tail.rotation.y = Math.sin(t * 3) * 0.2;
    } else {
      this.trex.rotation.z += (-1.25 - this.trex.rotation.z) * 0.05;
      this.trex.position.y += (-0.45 - this.trex.position.y) * 0.05;
      this.trex.rotation.y *= 0.9;
      if (this.jaw) this.jaw.rotation.x = 0.42;
      if (this.dizzyStars) {
        this.dizzyStars.rotation.y += 0.08;
        this.dizzyStars.position.y = 0.18 + Math.sin(t * 6.2) * 0.08;
      }
      this.celebrationGlow = Math.max(0, this.celebrationGlow - 0.002);
      if (this.koSprite) {
        const born = 1 - Math.max(0, (this.zoomUntil - now) / 1500);
        const pop = Math.min(1, born * 1.4);
        this.koSprite.material.opacity = Math.min(1, pop * 1.1);
        const s = 1.25 + Math.sin(t * 10) * 0.08;
        this.koSprite.scale.set(1.7 * pop * s, 0.9 * pop * s, 1);
        this.koSprite.position.y = 3.35 + Math.sin(t * 8) * 0.07;
      }
    }

    if (this.celebrationGlow > 0) {
      const pulse = 0.5 + Math.sin(t * 7) * 0.5;
      const bg = this.bgNight.clone().lerp(this.bgFinal, 0.45 + pulse * 0.4);
      this.scene.background = bg;
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(bg);
        this.scene.fog.density = 0.028;
      }
      this.renderer.toneMappingExposure = 1.18 + pulse * 0.22;
      this.bloomPass.strength = 0.62;
      if (now >= this.nextFireworkAt) {
        const dummy = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), new THREE.MeshBasicMaterial());
        dummy.position.set((Math.random() - 0.5) * 8, 3 + Math.random() * 2.5, -2 + (Math.random() - 0.5) * 3);
        this.scene.add(dummy);
        this.scene.remove(dummy);
        dummy.geometry.dispose();
        dummy.material.dispose();
        playSfx('celebrate');
        this.nextFireworkAt = now + 550;
      }
    } else {
      this.scene.background = this.bgNight.clone();
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(this.bgNight);
        this.scene.fog.density = 0.04;
      }
      this.renderer.toneMappingExposure = 1.1;
      this.bloomPass.strength = 0.36;
    }

    this.cannon.rotation.y = Math.sin(t * 1.6) * 0.03;
    this.stars.rotation.y = t * 0.015;
    const zoomBlend = now < this.zoomUntil ? 1 - (this.zoomUntil - now) / 1500 : 0;
    const camZ = 9 - zoomBlend * 1.6;
    this.camera.position.x = Math.sin(t * 0.28) * 0.35 + zoomBlend * 0.32;
    this.camera.position.y = 3.2 + Math.sin(t * 0.42) * 0.08 - zoomBlend * 0.22;
    this.camera.position.z = camZ;
    this.camera.lookAt(0.9, 1.55, 0);

    this.composer.render();
    this.rafId = requestAnimationFrame(this.loop);
  };
}

