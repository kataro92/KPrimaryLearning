import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface MechaPart {
  group: THREE.Group;
  assembled: boolean;
  assembleStart: number;
  fromPos: THREE.Vector3;
  targetPos: THREE.Vector3;
}

interface FireworkBurst {
  points: THREE.Points;
  velocities: Float32Array;
  startAt: number;
  lifeMs: number;
}

const FIREWORK_COLORS = [0xff3366, 0xffdd00, 0x44ff88, 0x66ccff, 0xff88ff, 0xff9933];

/** Robot mecha 3D — ghép từng mảnh khi trả lời đúng (phong cách Gundam / Siêu nhân Gao). */
export class MechaRobotScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly robotRoot = new THREE.Group();
  private readonly platformGroup = new THREE.Group();
  private readonly starsGroup = new THREE.Group();
  private readonly nebulaGroup = new THREE.Group();
  private readonly burstGroup = new THREE.Group();
  private readonly celebrationGroup = new THREE.Group();
  private readonly fireworksGroup = new THREE.Group();
  private readonly fireworks: FireworkBurst[] = [];
  private readonly parts: MechaPart[] = [];
  private readonly maxParts: number;
  private readonly clock = new THREE.Clock();
  private readonly glowMaterials: THREE.MeshStandardMaterial[] = [];
  private rafId = 0;
  private disposed = false;
  private correctCount = 0;
  private shakeUntil = 0;
  private celebrationActive = false;
  private celebrationPhase = 0;
  private nextFireworkAt = 0;
  private readonly bgDark = new THREE.Color(0x030712);
  private readonly bgBright = new THREE.Color(0x312e81);
  private glowDome: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null = null;
  private sparkleField: THREE.Points | null = null;
  private robotAura: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> | null = null;
  private robotGlowLight: THREE.PointLight | null = null;
  private celebrateLightA: THREE.PointLight | null = null;
  private celebrateLightB: THREE.PointLight | null = null;
  private readonly cameraBase = new THREE.Vector3(0, 2.1, 7.2);
  private readonly lookAt = new THREE.Vector3(0, 1.55, 0);

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.maxParts = Math.min(12, Math.max(5, totalQuestions));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030712);
    this.scene.fog = new THREE.FogExp2(0x030712, 0.038);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    this.camera.position.copy(this.cameraBase);
    this.camera.lookAt(this.lookAt);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = 'mecha-robot-canvas';
    this.mount.appendChild(this.renderer.domElement);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.5, 0.84);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.buildUniverse();
    this.addLights();
    this.buildPlatform();
    this.buildRobotParts();
    this.collectGlowMaterials();
    this.buildCelebrationAssets();
    this.celebrationGroup.add(this.fireworksGroup);
    this.scene.add(
      this.starsGroup,
      this.nebulaGroup,
      this.platformGroup,
      this.robotRoot,
      this.burstGroup,
      this.celebrationGroup
    );

    this.resize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  onCorrectAnswer(): void {
    this.correctCount++;
    const idx = this.correctCount - 1;
    if (idx >= this.parts.length) return;
    const part = this.parts[idx]!;
    if (!part.assembled) {
      part.assembled = true;
      part.assembleStart = performance.now();
      this.spawnAttachBurst(part.targetPos);
    }
    if (this.correctCount >= this.parts.length && !this.celebrationActive) {
      this.triggerCelebration();
    }
  }

  onWrongAnswer(): void {
    this.shakeUntil = performance.now() + 320;
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

  private addLights(): void {
    const ambient = new THREE.AmbientLight(0x8eb8ff, 0.45);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xb9d5ff, 0.48);
    const key = new THREE.DirectionalLight(0xfff1dd, 1.35);
    key.position.set(5, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 28;
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -2;

    const rim = new THREE.DirectionalLight(0x60a5fa, 0.85);
    rim.position.set(-6, 4, -5);
    const fill = new THREE.PointLight(0x818cf8, 0.9, 18);
    fill.position.set(0, 3, 4);
    const accent = new THREE.PointLight(0xf87171, 0.55, 12);
    accent.position.set(2.5, 2.8, 2);
    this.scene.add(ambient, hemi, key, rim, fill, accent);
  }

  private buildUniverse(): void {
    const starGeo = new THREE.BufferGeometry();
    const count = 4200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 42;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55 + 1.5;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const tint = Math.random();
      colors[i * 3] = 0.75 + tint * 0.25;
      colors[i * 3 + 1] = 0.82 + tint * 0.15;
      colors[i * 3 + 2] = 1;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false })
    );
    this.starsGroup.add(stars);

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(2.8, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.35,
        roughness: 0.85,
        metalness: 0.1,
      })
    );
    planet.position.set(-9, 0.5, -14);
    this.starsGroup.add(planet);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.12, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.35 })
    );
    ring.rotation.x = 1.1;
    ring.position.copy(planet.position);
    this.starsGroup.add(ring);

    for (let i = 0; i < 3; i++) {
      const nebula = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 14),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? 0x4c1d95 : i === 1 ? 0x1e40af : 0xbe185d,
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      nebula.position.set((i - 1) * 6, 2 + i * 0.5, -10 - i * 2);
      nebula.rotation.y = (i - 1) * 0.4;
      this.nebulaGroup.add(nebula);
    }
  }

  private buildPlatform(): void {
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.7, 0.35, 6),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.28 })
    );
    pad.position.y = 0.12;
    pad.receiveShadow = true;
    this.platformGroup.add(pad);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.08, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.65,
        metalness: 0.9,
        roughness: 0.2,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.32;
    this.platformGroup.add(ring);

    const glow = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.9, 48),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.34;
    this.platformGroup.add(glow);
    this.platformGroup.position.y = 0;
  }

  private matArmor(color: number, metal = 0.72): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: metal,
      roughness: 0.32,
    });
  }

  private matGlow(color: number, intensity = 0.85): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: intensity,
      metalness: 0.4,
      roughness: 0.35,
    });
  }

  private addPart(
    meshes: THREE.Object3D[],
    targetPos: THREE.Vector3,
    fromOffset: THREE.Vector3,
    order: number
  ): void {
    if (order >= this.maxParts) return;
    const group = new THREE.Group();
    for (const m of meshes) group.add(m);
    group.position.copy(targetPos);
    group.scale.setScalar(0.001);
    group.visible = false;
    this.robotRoot.add(group);
    this.parts.push({
      group,
      assembled: false,
      assembleStart: 0,
      fromPos: targetPos.clone().add(fromOffset),
      targetPos: targetPos.clone(),
    });
  }

  private buildRobotParts(): void {
    const white = this.matArmor(0xe2e8f0);
    const blue = this.matArmor(0x1d4ed8);
    const navy = this.matArmor(0x1e3a8a);
    const red = this.matArmor(0xdc2626);
    const gold = this.matArmor(0xfacc15, 0.55);
    const dark = this.matArmor(0x334155, 0.65);
    const visor = this.matGlow(0x22d3ee, 1.1);

    const y0 = 0.35;

    // 0 — chân trái
    if (this.maxParts > 0) {
      const legL = new THREE.Group();
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.48), blue);
      thigh.position.set(0, 0.55, 0);
      thigh.castShadow = true;
      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, 0.4), navy);
      shin.position.set(0, 0.15, 0.05);
      shin.castShadow = true;
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.62), dark);
      foot.position.set(0, -0.18, 0.12);
      foot.castShadow = true;
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), gold);
      knee.position.set(0, 0.38, 0);
      legL.add(thigh, shin, foot, knee);
      this.addPart([legL], new THREE.Vector3(-0.52, y0, 0), new THREE.Vector3(-2.5, -1.5, 0), 0);
    }

    // 1 — chân phải
    if (this.maxParts > 1) {
      const legR = legLClone(blue, navy, dark, gold);
      this.addPart([legR], new THREE.Vector3(0.52, y0, 0), new THREE.Vector3(2.5, -1.5, 0), 1);
    }

    // 2 — hông / khung giữa
    if (this.maxParts > 2) {
      const waist = new THREE.Group();
      const block = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.38, 0.62), navy);
      block.position.y = 0.95;
      block.castShadow = true;
      const skirtL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.5), blue);
      skirtL.position.set(-0.55, 0.78, 0);
      const skirtR = skirtL.clone();
      skirtR.position.x = 0.55;
      waist.add(block, skirtL, skirtR);
      this.addPart([waist], new THREE.Vector3(0, y0, 0), new THREE.Vector3(0, -2, 0), 2);
    }

    // 3 — thân
    if (this.maxParts > 3) {
      const torso = new THREE.Group();
      const core = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.95, 0.72), white);
      core.position.y = 1.55;
      core.castShadow = true;
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.15), dark);
      vent.position.set(0, 1.45, 0.38);
      torso.add(core, vent);
      this.addPart([torso], new THREE.Vector3(0, y0, 0), new THREE.Vector3(0, 3, -1), 3);
    }

    // 4 — ngực + cửa sổ cockpit
    if (this.maxParts > 4) {
      const chest = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.62, 0.78), blue);
      plate.position.y = 2.05;
      plate.castShadow = true;
      const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.2), visor);
      cockpit.position.set(0, 2.12, 0.42);
      const redCore = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), red);
      redCore.position.set(0, 1.95, 0.44);
      chest.add(plate, cockpit, redCore);
      this.addPart([chest], new THREE.Vector3(0, y0, 0), new THREE.Vector3(0, 2.5, 1.5), 4);
    }

    // 5 — V-fin (Gundam)
    if (this.maxParts > 5) {
      const vfin = new THREE.Group();
      for (const side of [-1, 1]) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.42), gold);
        fin.position.set(side * 0.18, 2.45, 0.35);
        fin.rotation.z = side * 0.55;
        fin.castShadow = true;
        vfin.add(fin);
      }
      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.35), red);
      crest.position.set(0, 2.52, 0.38);
      vfin.add(crest);
      this.addPart([vfin], new THREE.Vector3(0, y0, 0), new THREE.Vector3(0, 3.5, 0), 5);
    }

    // 6 — vai trái + ống pháo
    if (this.maxParts > 6) {
      const shoulderL = new THREE.Group();
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), white);
      pauldron.scale.set(1.1, 0.85, 0.9);
      pauldron.position.set(-0.95, 2.15, 0);
      pauldron.castShadow = true;
      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.55, 10), dark);
      cannon.rotation.z = Math.PI / 2;
      cannon.position.set(-1.35, 2.2, 0.15);
      shoulderL.add(pauldron, cannon);
      this.addPart([shoulderL], new THREE.Vector3(0, y0, 0), new THREE.Vector3(-3, 2, 0), 6);
    }

    // 7 — vai phải
    if (this.maxParts > 7) {
      const shoulderR = new THREE.Group();
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), white);
      pauldron.scale.set(1.1, 0.85, 0.9);
      pauldron.position.set(0.95, 2.15, 0);
      pauldron.castShadow = true;
      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.55, 10), dark);
      cannon.rotation.z = Math.PI / 2;
      cannon.position.set(1.35, 2.2, 0.15);
      shoulderR.add(pauldron, cannon);
      this.addPart([shoulderR], new THREE.Vector3(0, y0, 0), new THREE.Vector3(3, 2, 0), 7);
    }

    // 8 — cánh tay trái
    if (this.maxParts > 8) {
      const armL = new THREE.Group();
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.62, 0.36), blue);
      upper.position.set(-1.05, 1.55, 0);
      upper.castShadow = true;
      const fore = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.55, 0.32), navy);
      fore.position.set(-1.05, 0.95, 0.08);
      const fist = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 0.38), white);
      fist.position.set(-1.05, 0.62, 0.12);
      armL.add(upper, fore, fist);
      this.addPart([armL], new THREE.Vector3(0, y0, 0), new THREE.Vector3(-2.5, 1, 1), 8);
    }

    // 9 — cánh tay phải (cầm kiếm năng lượng)
    if (this.maxParts > 9) {
      const armR = new THREE.Group();
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.62, 0.36), blue);
      upper.position.set(1.05, 1.55, 0);
      const fore = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.55, 0.32), navy);
      fore.position.set(1.05, 0.95, 0.08);
      const fist = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 0.38), white);
      fist.position.set(1.05, 0.62, 0.12);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 0.14), this.matGlow(0x38bdf8, 1.2));
      blade.position.set(1.05, 1.05, 0.45);
      blade.rotation.x = -0.35;
      armR.add(upper, fore, fist, blade);
      this.addPart([armR], new THREE.Vector3(0, y0, 0), new THREE.Vector3(2.5, 1, 1), 9);
    }

    // 10 — đầu (mặt nạ Gao)
    if (this.maxParts > 10) {
      const head = new THREE.Group();
      const helm = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.58, 0.58), white);
      helm.position.y = 2.78;
      helm.castShadow = true;
      const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.16, 0.12), visor);
      visorMesh.position.set(0, 2.76, 0.32);
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 4), gold);
      hornL.position.set(-0.22, 3.05, 0.05);
      hornL.rotation.z = 0.4;
      const hornR = hornL.clone();
      hornR.position.x = 0.22;
      hornR.rotation.z = -0.4;
      const forehead = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.22), gold);
      forehead.position.set(0, 2.92, 0.34);
      head.add(helm, visorMesh, hornL, hornR, forehead);
      this.addPart([head], new THREE.Vector3(0, y0, 0), new THREE.Vector3(0, 4, 0), 10);
    }

    // 11 — cánh / booster sau (Gundam)
    if (this.maxParts > 11) {
      const wings = new THREE.Group();
      for (const side of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 1.1), blue);
        wing.position.set(side * 0.95, 2.1, -0.55);
        wing.rotation.y = side * 0.35;
        wing.castShadow = true;
        const booster = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.45, 10), this.matGlow(0xf97316, 0.9));
        booster.rotation.x = Math.PI / 2;
        booster.position.set(side * 0.75, 2.05, -1.05);
        wings.add(wing, booster);
      }
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.9, 0.4), navy);
      spine.position.set(0, 2.05, -0.45);
      wings.add(spine);
      this.addPart([wings], new THREE.Vector3(0, y0, 0), new THREE.Vector3(0, 2.5, -3), 11);
    }

    this.robotRoot.position.y = 0;
  }

  private collectGlowMaterials(): void {
    this.robotRoot.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
        const mat = obj.material;
        if (!mat.userData.glowStored) {
          mat.userData.glowStored = true;
          mat.userData.baseEmissive = mat.emissive.getHex();
          mat.userData.baseIntensity = mat.emissiveIntensity;
        }
        this.glowMaterials.push(mat);
      }
    });
  }

  private buildCelebrationAssets(): void {
    this.glowDome = new THREE.Mesh(
      new THREE.SphereGeometry(9, 40, 32),
      new THREE.MeshBasicMaterial({
        color: 0xfde68a,
        transparent: true,
        opacity: 0,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.glowDome.position.set(0, 2, 0);
    this.celebrationGroup.add(this.glowDome);

    const sparkleGeo = new THREE.BufferGeometry();
    const n = 900;
    const pos = new Float32Array(n * 3);
    const phases = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const r = 3 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = 1.2 + r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi);
      phases[i] = Math.random() * Math.PI * 2;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sparkleGeo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    this.sparkleField = new THREE.Points(
      sparkleGeo,
      new THREE.PointsMaterial({
        size: 0.14,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.celebrationGroup.add(this.sparkleField);

    this.robotAura = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 2.2, 48),
      new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    this.robotAura.rotation.x = -Math.PI / 2;
    this.robotAura.position.y = 0.36;
    this.celebrationGroup.add(this.robotAura);

    this.robotGlowLight = new THREE.PointLight(0x7dd3fc, 0, 14);
    this.robotGlowLight.position.set(0, 2.2, 1.2);
    this.robotRoot.add(this.robotGlowLight);

    this.celebrateLightA = new THREE.PointLight(0xfff1a8, 0, 22);
    this.celebrateLightA.position.set(4, 6, 5);
    this.celebrateLightB = new THREE.PointLight(0xf472b6, 0, 20);
    this.celebrateLightB.position.set(-5, 4, 3);
    this.scene.add(this.celebrateLightA, this.celebrateLightB);
  }

  private triggerCelebration(): void {
    this.celebrationActive = true;
    this.celebrationPhase = 0;
    this.nextFireworkAt = performance.now() + 200;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (!this.disposed && this.celebrationActive) this.spawnFireworkBurst();
      }, i * 180);
    }
    this.spawnAttachBurst(new THREE.Vector3(0, 2.2, 0));
  }

  private spawnFireworkBurst(): void {
    const ox = (Math.random() - 0.5) * 7;
    const oy = 2.2 + Math.random() * 3.5;
    const oz = -1.5 + (Math.random() - 0.5) * 5;
    const count = 64;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = ox;
      positions[i * 3 + 1] = oy;
      positions[i * 3 + 2] = oz;
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 0.85 + 0.15,
        (Math.random() - 0.5) * 2
      ).normalize();
      const speed = 0.05 + Math.random() * 0.09;
      velocities[i * 3] = dir.x * speed;
      velocities[i * 3 + 1] = dir.y * speed;
      velocities[i * 3 + 2] = dir.z * speed;
      const c = new THREE.Color(FIREWORK_COLORS[i % FIREWORK_COLORS.length]!);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    this.fireworksGroup.add(points);
    this.fireworks.push({ points, velocities, startAt: performance.now(), lifeMs: 1500 });
  }

  private updateFireworks(now: number): void {
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i]!;
      const age = now - fw.startAt;
      const t = age / fw.lifeMs;
      if (t >= 1) {
        this.fireworksGroup.remove(fw.points);
        fw.points.geometry.dispose();
        (fw.points.material as THREE.Material).dispose();
        this.fireworks.splice(i, 1);
        continue;
      }
      const pos = fw.points.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let j = 0; j < arr.length; j += 3) {
        arr[j]! += fw.velocities[j]!;
        arr[j + 1]! += fw.velocities[j + 1]! - 0.0018;
        arr[j + 2]! += fw.velocities[j + 2]!;
        fw.velocities[j + 1]! -= 0.00012;
      }
      pos.needsUpdate = true;
      (fw.points.material as THREE.PointsMaterial).opacity = 1 - t * t;
      (fw.points.material as THREE.PointsMaterial).size = 0.22 * (1 + t * 0.35);
    }
  }

  private updateCelebration(t: number, now: number): void {
    this.celebrationPhase = Math.min(1, this.celebrationPhase + 0.012);
    const pulse = 0.5 + Math.sin(t * 5.5) * 0.5;
    const pulse2 = 0.5 + Math.sin(t * 8.2 + 1) * 0.5;

    const bg = this.bgDark.clone().lerp(this.bgBright, this.celebrationPhase * (0.65 + pulse * 0.35));
    this.scene.background = bg;
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.copy(bg);
      this.scene.fog.density = 0.038 - this.celebrationPhase * 0.022;
    }

    if (this.glowDome) {
      this.glowDome.material.opacity = this.celebrationPhase * (0.18 + pulse * 0.14);
      this.glowDome.scale.setScalar(1 + pulse * 0.06);
      this.glowDome.material.color.setHSL(0.12 + pulse * 0.08, 0.85, 0.62);
    }

    if (this.sparkleField) {
      const mat = this.sparkleField.material as THREE.PointsMaterial;
      mat.opacity = this.celebrationPhase * (0.55 + pulse * 0.45);
      this.sparkleField.rotation.y = t * 0.4;
      mat.size = 0.12 + pulse2 * 0.1;
    }

    if (this.robotAura) {
      this.robotAura.material.opacity = this.celebrationPhase * (0.45 + pulse * 0.55);
      this.robotAura.rotation.z = t * 0.8;
      this.robotAura.scale.setScalar(1 + pulse * 0.12);
    }

    const glow = this.celebrationPhase * (1.2 + pulse * 0.8);
    if (this.robotGlowLight) this.robotGlowLight.intensity = glow * 2.2;
    if (this.celebrateLightA) this.celebrateLightA.intensity = glow * 1.8;
    if (this.celebrateLightB) this.celebrateLightB.intensity = glow * 1.4;

    for (const mat of this.glowMaterials) {
      const base = (mat.userData.baseEmissive as number) ?? 0;
      const baseI = (mat.userData.baseIntensity as number) ?? 0;
      const accent = mat.emissiveIntensity > 0.5 ? 1.4 : 0.55;
      mat.emissive.setHex(base || 0x3b82f6);
      mat.emissiveIntensity = baseI + this.celebrationPhase * accent * (0.7 + pulse * 0.6);
    }

    this.nebulaGroup.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 + this.celebrationPhase * 0.28 + pulse * 0.12;
      mat.color.setHSL(0.55 + i * 0.12 + pulse * 0.1, 0.9, 0.55);
    });

    if (now >= this.nextFireworkAt) {
      this.spawnFireworkBurst();
      this.nextFireworkAt = now + 320 + Math.random() * 280;
    }
    this.updateFireworks(now);

    this.renderer.toneMappingExposure = 1.15 + this.celebrationPhase * 0.45 + pulse * 0.15;
  }

  private spawnAttachBurst(at: THREE.Vector3): void {
    const count = 18;
    const geo = new THREE.IcosahedronGeometry(0.06, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 1,
    });
    const group = new THREE.Group();
    group.position.copy(at);
    const started = performance.now();
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, mat.clone());
      m.userData.vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.12,
        Math.random() * 0.1 + 0.04,
        (Math.random() - 0.5) * 0.12
      );
      m.userData.birth = started;
      group.add(m);
    }
    this.burstGroup.add(group);
    setTimeout(() => {
      if (this.disposed) return;
      this.burstGroup.remove(group);
      group.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
    }, 700);
  }

  private updateBursts(now: number): void {
    this.burstGroup.children.forEach((g) => {
      g.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const vel = mesh.userData.vel as THREE.Vector3;
        const birth = mesh.userData.birth as number;
        const age = (now - birth) / 700;
        mesh.position.add(vel);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 1 - age;
        mesh.scale.setScalar(1 + age * 0.5);
      });
    });
  }

  private updateParts(now: number): void {
    const dur = 720;
    for (const part of this.parts) {
      if (!part.assembled) continue;
      const t = Math.min(1, (now - part.assembleStart) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      part.group.visible = true;
      part.group.position.lerpVectors(part.fromPos, part.targetPos, ease);
      const scale = 0.001 + ease * 0.999;
      part.group.scale.setScalar(scale);
      part.group.rotation.y = (1 - ease) * (part.fromPos.x > 0 ? -0.8 : 0.8);
    }
  }

  private onResize = (): void => {
    this.resize();
  };

  private resize(): void {
    const w = Math.max(200, this.mount.clientWidth);
    const h = Math.max(180, this.mount.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
  }

  private loop = (): void => {
    if (this.disposed) return;
    const now = performance.now();
    const t = this.clock.getElapsedTime();

    this.starsGroup.rotation.y = t * 0.018;
    this.nebulaGroup.rotation.y = t * 0.006;
    this.platformGroup.rotation.y = Math.sin(t * 0.5) * 0.04;

    this.updateParts(now);
    this.updateBursts(now);

    if (now < this.shakeUntil) {
      this.robotRoot.rotation.z = Math.sin(t * 28) * 0.045;
    } else {
      this.robotRoot.rotation.z *= 0.88;
    }

    const idleY = Math.sin(t * 1.2) * 0.04;
    this.robotRoot.position.y = idleY;

    if (this.celebrationActive) {
      this.updateCelebration(t, now);
      this.bloomPass.strength = 0.72;
      this.robotRoot.rotation.y = t * 0.55;
      const s = 1.04 + Math.sin(t * 3.2) * 0.035;
      this.robotRoot.scale.setScalar(s);
      this.platformGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissiveIntensity = 0.5 + Math.sin(t * 6) * 0.35;
        }
      });
    } else {
      this.renderer.toneMappingExposure = 1.15;
      this.bloomPass.strength = 0.42;
      this.scene.background = this.bgDark.clone();
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(this.bgDark);
        this.scene.fog.density = 0.038;
      }
      this.robotRoot.rotation.y = Math.sin(t * 0.35) * 0.12;
      this.robotRoot.scale.setScalar(1);
      if (this.robotGlowLight) this.robotGlowLight.intensity = 0;
      if (this.celebrateLightA) this.celebrateLightA.intensity = 0;
      if (this.celebrateLightB) this.celebrateLightB.intensity = 0;
      if (this.glowDome) this.glowDome.material.opacity = 0;
      if (this.sparkleField) (this.sparkleField.material as THREE.PointsMaterial).opacity = 0;
      if (this.robotAura) this.robotAura.material.opacity = 0;
      for (const mat of this.glowMaterials) {
        const base = (mat.userData.baseEmissive as number) ?? 0;
        const baseI = (mat.userData.baseIntensity as number) ?? 0;
        mat.emissive.setHex(base);
        mat.emissiveIntensity = baseI;
      }
    }

    this.camera.position.x = this.cameraBase.x + Math.sin(t * 0.25) * 0.25;
    this.camera.position.y = this.cameraBase.y + Math.sin(t * 0.4) * 0.08;
    this.camera.lookAt(this.lookAt);

    this.composer.render();
    this.rafId = requestAnimationFrame(this.loop);
  };
}

function legLClone(
  blue: THREE.MeshStandardMaterial,
  navy: THREE.MeshStandardMaterial,
  dark: THREE.MeshStandardMaterial,
  gold: THREE.MeshStandardMaterial
): THREE.Group {
  const legR = new THREE.Group();
  const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.48), blue);
  thigh.position.set(0, 0.55, 0);
  thigh.castShadow = true;
  const shin = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, 0.4), navy);
  shin.position.set(0, 0.15, 0.05);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.62), dark);
  foot.position.set(0, -0.18, 0.12);
  const knee = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), gold);
  knee.position.set(0, 0.38, 0);
  legR.add(thigh, shin, foot, knee);
  return legR;
}
