import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { playSfx } from '@/features/audio/sfxService';

interface AssemblePart {
  group: THREE.Group;
  assembled: boolean;
  startAt: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
}

interface Firework {
  points: THREE.Points;
  velocity: Float32Array;
  startAt: number;
  lifeMs: number;
}

interface KneeMechanism {
  armor: THREE.Mesh;
  pistonL: THREE.Mesh;
  pistonR: THREE.Mesh;
  baseY: number;
}

const FIREWORK_COLORS = [0xff335c, 0xffcc00, 0x22ee88, 0x55bbff, 0xff88ee];

/**
 * Robot Gundam hard-surface theo spec:
 * - tỷ lệ 9 đầu, chân dài, chất liệu PBR rõ nhóm
 * - ghép từng cụm khi trả lời đúng
 * - hoàn thành: nền sáng, pháo hoa, robot phát sáng
 */
export class GundamRobotScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly root = new THREE.Group();
  private readonly platform = new THREE.Group();
  private readonly stars = new THREE.Group();
  private readonly nebula = new THREE.Group();
  private readonly fx = new THREE.Group();
  private readonly parts: AssemblePart[] = [];
  private readonly kneeMechs: KneeMechanism[] = [];
  private readonly glowMats: THREE.MeshStandardMaterial[] = [];
  private readonly fireworks: Firework[] = [];
  private readonly clock = new THREE.Clock();
  private readonly scratchTex: THREE.CanvasTexture;

  private readonly matWhite: THREE.MeshStandardMaterial;
  private readonly matBlue: THREE.MeshStandardMaterial;
  private readonly matRed: THREE.MeshStandardMaterial;
  private readonly matGold: THREE.MeshStandardMaterial;
  private readonly matGunmetal: THREE.MeshStandardMaterial;
  private readonly matChrome: THREE.MeshStandardMaterial;
  private readonly matEye: THREE.MeshStandardMaterial;
  private readonly matCameraRed: THREE.MeshPhysicalMaterial;
  private readonly matPanel: THREE.MeshStandardMaterial;
  private readonly outlineMat: THREE.MeshBasicMaterial;

  private glowSphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null = null;
  private robotAura: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial> | null = null;
  private glowLight: THREE.PointLight | null = null;
  private rightArmPivot: THREE.Group | null = null;
  private leftArmPivot: THREE.Group | null = null;
  private beamBlade: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial> | null = null;
  private beamBladeCore: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial> | null = null;
  private beamGlow: THREE.PointLight | null = null;
  private fireworkCooldown = 0;
  private celebration = false;
  private celebrationFade = 0;
  private poseProgress = 0;
  private shakeUntil = 0;
  private rafId = 0;
  private disposed = false;
  private correctCount = 0;
  private readonly maxParts: number;
  private readonly bgDark = new THREE.Color(0x030712);
  private readonly bgBright = new THREE.Color(0x312e81);

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.maxParts = Math.min(12, Math.max(6, totalQuestions));

    this.scratchTex = this.makeScratchTexture();

    this.matWhite = new THREE.MeshStandardMaterial({ color: 0xf2f0eb, roughness: 0.4, metalness: 0.05 });
    this.matBlue = new THREE.MeshStandardMaterial({ color: 0x1f4db9, roughness: 0.2, metalness: 0.2 });
    this.matRed = new THREE.MeshStandardMaterial({ color: 0xd63b34, roughness: 0.3, metalness: 0.22 });
    this.matGold = new THREE.MeshStandardMaterial({ color: 0xd5a42a, roughness: 0.25, metalness: 0.8 });
    this.matGunmetal = new THREE.MeshStandardMaterial({
      color: 0x353a44,
      roughness: 0.15,
      metalness: 0.9,
      roughnessMap: this.scratchTex,
    });
    this.matChrome = new THREE.MeshStandardMaterial({ color: 0xcfd6de, roughness: 0.08, metalness: 1 });
    this.matEye = new THREE.MeshStandardMaterial({
      color: 0x58ff9c,
      emissive: 0x24ff73,
      emissiveIntensity: 2.6,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.matCameraRed = new THREE.MeshPhysicalMaterial({
      color: 0xaa1010,
      roughness: 0.08,
      metalness: 0.25,
      transmission: 0.45,
      transparent: true,
      opacity: 0.9,
    });
    this.matPanel = new THREE.MeshStandardMaterial({ color: 0x171a22, roughness: 0.45, metalness: 0.42 });
    this.outlineMat = new THREE.MeshBasicMaterial({ color: 0x03050c, side: THREE.BackSide });

    this.scene = new THREE.Scene();
    this.scene.background = this.bgDark.clone();
    this.scene.fog = new THREE.FogExp2(this.bgDark.getHex(), 0.038);

    this.camera = new THREE.PerspectiveCamera(44, 1, 0.1, 120);
    this.camera.position.set(0, 2.25, 7.5);
    this.camera.lookAt(0, 2.6, 0);

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

    this.addLights();
    this.buildUniverse();
    this.buildPlatform();
    this.buildRobotBySpec();
    this.buildCelebrationFx();
    this.scene.add(this.stars, this.nebula, this.platform, this.root, this.fx);

    this.resize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  onCorrectAnswer(): void {
    this.correctCount++;
    const idx = this.correctCount - 1;
    if (idx < this.parts.length) {
      const p = this.parts[idx]!;
      p.assembled = true;
      p.startAt = performance.now();
      this.spawnMiniBurst(p.to);
      // SFX lắp ráp: từng mảnh "click-pop", mỗi 3 mảnh có fanfare nhẹ.
      playSfx('pop');
      if (this.correctCount % 3 === 0) playSfx('star');
    }
    if (this.correctCount >= this.parts.length && !this.celebration) {
      this.celebration = true;
      this.fireworkCooldown = 0;
      this.spawnMiniBurst(new THREE.Vector3(0, 2.7, 0));
      playSfx('unlock');
      playSfx('celebrate');
    }
  }

  onWrongAnswer(): void {
    this.shakeUntil = performance.now() + 300;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.mount.innerHTML = '';
    this.renderer.dispose();
    this.scratchTex.dispose();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  private makeScratchTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#777';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 800; i++) {
      const y = Math.random() * c.height;
      const x = Math.random() * c.width;
      const len = 10 + Math.random() * 24;
      const alpha = 0.08 + Math.random() * 0.15;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + len * 0.12);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  private addLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.52);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xb9d5ff, 0.48);
    const key = new THREE.DirectionalLight(0xfff4dd, 1.35);
    key.position.set(5, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    const rim = new THREE.DirectionalLight(0x7aa9ff, 0.82);
    rim.position.set(-6, 4, -5);
    const fill = new THREE.PointLight(0x7c3aed, 0.55, 22);
    fill.position.set(0, 4.5, 4);
    this.scene.add(ambient, hemi, key, rim, fill);
  }

  private buildUniverse(): void {
    const starCount = 5000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 45;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.65 + 1.5;
      pos[i * 3 + 2] = r * Math.cos(ph);
      const c = 0.8 + Math.random() * 0.2;
      col[i * 3] = c;
      col[i * 3 + 1] = c * (0.93 + Math.random() * 0.08);
      col[i * 3 + 2] = 1;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.stars.add(
      new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.95 }))
    );

    for (let i = 0; i < 3; i++) {
      const n = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 14),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? 0x312e81 : i === 1 ? 0x0f4c81 : 0x9d174d,
          transparent: true,
          opacity: 0.13,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      n.position.set((i - 1) * 6, 2.4 + i * 0.3, -11 - i * 2);
      n.rotation.y = (i - 1) * 0.35;
      this.nebula.add(n);
    }
  }

  private buildPlatform(): void {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 3.1, 0.38, 8),
      new THREE.MeshStandardMaterial({ color: 0x28313d, roughness: 0.25, metalness: 0.88 })
    );
    base.position.y = 0.16;
    base.receiveShadow = true;
    this.platform.add(base);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.65, 0.08, 10, 56),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.8 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.35;
    this.platform.add(ring);
  }

  private addPart(order: number, to: THREE.Vector3, fromOffset: THREE.Vector3, group: THREE.Group): void {
    if (order >= this.maxParts) return;
    this.decorateHardSurface(group);
    group.visible = false;
    group.position.copy(to);
    group.scale.setScalar(0.001);
    this.root.add(group);
    this.parts.push({ group, assembled: false, startAt: 0, from: to.clone().add(fromOffset), to: to.clone() });
  }

  private buildRobotBySpec(): void {
    // tỉ lệ 9 đầu: đầu ~0.62, cao tổng ~5.58, chân khoảng 3.6 (2/3)
    const hipY = 2.08;

    this.addPart(0, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -2.5, 0), this.buildHipSkirt(hipY));
    this.addPart(1, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2.8, -2.2, 0), this.buildLeg(-0.58, hipY));
    this.addPart(2, new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.8, -2.2, 0), this.buildLeg(0.58, hipY));
    this.addPart(3, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, -1), this.buildTorsoCore(hipY));
    this.addPart(4, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3.5, 1.5), this.buildChestDetail(hipY));
    this.addPart(5, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-3.2, 2.2, 0), this.buildShoulderUpperArm(-1));
    this.addPart(6, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3.2, 2.2, 0), this.buildShoulderUpperArm(1));
    this.addPart(7, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2.2, 1.2, 1), this.buildForearmHand(-1));
    this.addPart(8, new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.2, 1.2, 1), this.buildForearmHand(1));
    this.addPart(9, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 4.3, 0), this.buildHeadUnit());
    this.addPart(10, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 4.6, 0), this.buildVFinAndCameras());
    this.addPart(11, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, -3.5), this.buildBackpack());
  }

  private buildHipSkirt(hipY: number): THREE.Group {
    const g = new THREE.Group();
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.42, 0.72), this.matGunmetal);
    pelvis.position.set(0, hipY, 0);
    g.add(pelvis);
    this.addPanelLine(pelvis, new THREE.Vector3(0, 0.05, 0.37), new THREE.Vector3(0.9, 0.02, 0.02));

    for (const side of [-1, 1] as const) {
      const frontSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.42, 0.14), this.matWhite);
      frontSkirt.position.set(side * 0.26, hipY - 0.36, 0.36);
      g.add(frontSkirt);
      const yellowBlock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.08), this.matGold);
      yellowBlock.position.set(side * 0.26, hipY - 0.30, 0.44);
      g.add(yellowBlock);

      const sideSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.6), this.matWhite);
      sideSkirt.position.set(side * 0.82, hipY - 0.24, 0);
      g.add(sideSkirt);

      const saberHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.34, 12), this.matWhite);
      saberHilt.rotation.z = Math.PI / 2;
      saberHilt.position.set(side * 0.82, hipY - 0.14, side * 0.14);
      g.add(saberHilt);
      const saberCap = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), this.matGold);
      saberCap.position.set(side * 0.97, hipY - 0.14, side * 0.14);
      g.add(saberCap);
    }
    return g;
  }

  private buildLeg(x: number, hipY: number): THREE.Group {
    const g = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.18, 0.52), this.matWhite);
    thigh.position.set(x, hipY - 0.72, 0);
    thigh.castShadow = true;
    g.add(thigh);
    this.addPanelLine(thigh, new THREE.Vector3(0, 0, 0.27), new THREE.Vector3(0.02, 0.9, 0.01));

    const knee = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 4), this.matWhite);
    knee.rotation.x = Math.PI / 2;
    knee.position.set(x, hipY - 1.42, 0.29);
    g.add(knee);

    const pistonL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 10), this.matChrome);
    const pistonR = pistonL.clone();
    pistonL.position.set(x - 0.1, hipY - 1.37, -0.02);
    pistonR.position.set(x + 0.1, hipY - 1.37, -0.02);
    g.add(pistonL, pistonR);
    this.kneeMechs.push({ armor: knee, pistonL, pistonR, baseY: knee.position.y });

    const calf = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.18, 0.62), this.matWhite);
    calf.position.set(x, hipY - 2.16, -0.02);
    g.add(calf);

    for (const z of [-0.16, 0.16] as const) {
      const thrusterOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.28, 16), this.matGunmetal);
      thrusterOuter.rotation.x = Math.PI / 2;
      thrusterOuter.position.set(x, hipY - 2.0, -0.42 + z);
      g.add(thrusterOuter);
      const heat = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.16, 14), this.matRed);
      heat.rotation.x = Math.PI / 2;
      heat.position.copy(thrusterOuter.position);
      heat.position.z -= 0.02;
      g.add(heat);
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 10), this.matChrome);
      nozzle.rotation.x = -Math.PI / 2;
      nozzle.position.set(x, hipY - 2.0, -0.48 + z);
      g.add(nozzle);
    }

    const toe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.82), this.matRed);
    toe.position.set(x, hipY - 2.85, 0.18);
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.35), this.matRed);
    heel.position.set(x, hipY - 2.85, -0.32);
    g.add(toe, heel);

    // greebles: rivets
    for (const sx of [-1, 1] as const) {
      const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 10), this.matGunmetal);
      rivet.rotation.x = Math.PI / 2;
      rivet.position.set(x + sx * 0.19, hipY - 0.42, 0.27);
      g.add(rivet);
    }

    return g;
  }

  private buildTorsoCore(hipY: number): THREE.Group {
    const g = new THREE.Group();
    const lower = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.55, 0.76), this.matBlue);
    lower.position.set(0, hipY + 0.44, 0);
    g.add(lower);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.33, 20), this.matGunmetal);
    neck.position.set(0, hipY + 1.45, 0.02);
    g.add(neck);
    for (let i = 0; i < 4; i++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 8, 24), this.matChrome);
      rib.rotation.x = Math.PI / 2;
      rib.position.set(0, hipY + 1.33 + i * 0.07, 0.02);
      g.add(rib);
    }
    for (const side of [-1, 1] as const) {
      const cable = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 20), this.matChrome);
      cable.rotation.y = Math.PI / 2;
      cable.position.set(side * 0.25, hipY + 1.36, 0.2);
      g.add(cable);
    }
    return g;
  }

  private buildChestDetail(hipY: number): THREE.Group {
    const g = new THREE.Group();
    const chestL = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.72, 0.75), this.matBlue);
    chestL.position.set(-0.34, hipY + 1.05, 0.02);
    chestL.rotation.z = 0.12;
    const chestR = chestL.clone();
    chestR.position.x = 0.34;
    chestR.rotation.z = -0.12;
    g.add(chestL, chestR);

    for (const side of [-1, 1] as const) {
      const duct = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.2), this.matGold);
      duct.position.set(side * 0.5, hipY + 0.95, 0.35);
      g.add(duct);
      for (let i = 0; i < 3; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.03), this.matGunmetal);
        louver.position.set(side * 0.5, hipY + 0.9 + i * 0.05, 0.39 - i * 0.015);
        louver.rotation.x = -0.52;
        g.add(louver);
      }
    }

    const cockpit = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.25, 5), this.matRed);
    cockpit.rotation.y = Math.PI / 5;
    cockpit.position.set(0, hipY + 0.58, 0.34);
    g.add(cockpit);

    const panelLine = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.345, 0.005, 5), this.matPanel);
    panelLine.rotation.y = cockpit.rotation.y;
    panelLine.position.copy(cockpit.position);
    panelLine.position.z += 0.13;
    g.add(panelLine);
    return g;
  }

  private buildShoulderUpperArm(side: -1 | 1): THREE.Group {
    const g = new THREE.Group();
    const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.4, 0.7), this.matWhite);
    shoulder.position.set(side * 1.12, 3.18, 0);
    shoulder.scale.z = 1.05;
    g.add(shoulder);
    this.addHoneycomb(shoulder.position.clone().add(new THREE.Vector3(0, 0.18, 0)));

    // rãnh chữ L lộ khung
    const lCut = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.08), this.matGunmetal);
    lCut.position.set(side * 1.33, 3.08, -0.27);
    g.add(lCut);

    const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.72, 0.36), this.matWhite);
    upperArm.position.set(side * 1.12, 2.62, 0);
    g.add(upperArm);

    const elbowHub = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.22, 14), this.matGunmetal);
    elbowHub.rotation.z = Math.PI / 2;
    elbowHub.position.set(side * 1.12, 2.2, 0);
    g.add(elbowHub);
    for (let i = 0; i < 8; i++) {
      const gear = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.06), this.matChrome);
      const ang = (i / 8) * Math.PI * 2;
      gear.position.set(side * (1.12 + Math.cos(ang) * 0.12), 2.2 + Math.sin(ang) * 0.12, 0);
      g.add(gear);
    }
    if (side === -1) this.leftArmPivot = g;
    return g;
  }

  private buildForearmHand(side: -1 | 1): THREE.Group {
    const g = new THREE.Group();
    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.82, 0.44), this.matWhite);
    forearm.position.set(side * 1.12, 1.7, 0.02);
    forearm.scale.x = 1 + Math.abs(side) * 0.02;
    g.add(forearm);

    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), this.matBlue);
    ridge.position.set(side * 1.23, 1.7, 0.21);
    g.add(ridge);

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.34), this.matWhite);
    palm.position.set(side * 1.12, 1.23, 0.1);
    g.add(palm);
    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.05), this.matGunmetal);
      finger.position.set(side * (1.03 + i * 0.055), 1.11, 0.2);
      g.add(finger);
    }
    const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.13, 0.06), this.matGunmetal);
    thumb.position.set(side * 1.24, 1.16, 0.02);
    g.add(thumb);
    if (side === 1) {
      this.rightArmPivot = g;
      const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.36, 12), this.matWhite);
      hilt.rotation.x = Math.PI / 2;
      hilt.position.set(1.2, 1.1, 0.34);
      g.add(hilt);
      this.beamBlade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.018, 1.7, 14),
        new THREE.MeshStandardMaterial({
          color: 0x67e8f9,
          emissive: 0x22d3ee,
          emissiveIntensity: 1.9,
          roughness: 0.08,
          metalness: 0.02,
          transparent: true,
          opacity: 0.92,
        })
      );
      this.beamBlade.position.set(1.2, 1.95, 0.34);
      this.beamBlade.visible = false;
      g.add(this.beamBlade);
      this.beamBladeCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.004, 1.78, 10),
        new THREE.MeshBasicMaterial({
          color: 0xe0faff,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        })
      );
      this.beamBladeCore.position.copy(this.beamBlade.position);
      this.beamBladeCore.visible = false;
      g.add(this.beamBladeCore);
      this.beamGlow = new THREE.PointLight(0x67e8f9, 0, 5);
      this.beamGlow.position.copy(this.beamBlade.position);
      g.add(this.beamGlow);
    }
    return g;
  }

  private buildHeadUnit(): THREE.Group {
    const g = new THREE.Group();
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.62, 0.72), this.matWhite);
    helmet.position.set(0, 4.62, 0.02);
    g.add(helmet);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.62, 0.72), this.matPanel);
    seam.position.set(0, 4.62, 0.02);
    g.add(seam);

    const faceplate = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.35), this.matWhite);
    faceplate.position.set(0, 4.48, 0.27);
    g.add(faceplate);

    const eyes = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.08), this.matEye);
    eyes.position.set(0, 4.59, 0.44);
    g.add(eyes);

    const maskVent1 = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.03), this.matPanel);
    maskVent1.position.set(0, 4.43, 0.44);
    const maskVent2 = maskVent1.clone();
    maskVent2.position.y = 4.38;
    g.add(maskVent1, maskVent2);

    for (const side of [-1, 1] as const) {
      const vulcanHole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 12), this.matGunmetal);
      vulcanHole.rotation.z = Math.PI / 2;
      vulcanHole.position.set(side * 0.38, 4.6, 0.02);
      g.add(vulcanHole);
    }
    return g;
  }

  private buildVFinAndCameras(): THREE.Group {
    const g = new THREE.Group();
    const cam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.14), this.matCameraRed);
    cam.position.set(0, 4.9, 0.33);
    g.add(cam);

    const vBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 6), this.matRed);
    vBase.rotation.y = Math.PI / 6;
    vBase.position.set(0, 4.84, 0.33);
    g.add(vBase);

    // góc mở ~120 độ
    for (const side of [-1, 1] as const) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.52, 0.28), this.matGold);
      fin.position.set(side * 0.24, 4.95, 0.32);
      fin.rotation.z = side * 1.05;
      fin.rotation.y = side * 0.12;
      g.add(fin);
    }
    return g;
  }

  private buildBackpack(): THREE.Group {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.84, 0.4), this.matGunmetal);
    core.position.set(0, 3.1, -0.48);
    g.add(core);
    for (const side of [-1, 1] as const) {
      const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.42, 14), this.matGunmetal);
      thruster.rotation.x = Math.PI / 2;
      thruster.position.set(side * 0.34, 2.88, -0.72);
      g.add(thruster);
      const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.18, 12), this.matRed);
      inner.rotation.x = Math.PI / 2;
      inner.position.set(side * 0.34, 2.88, -0.76);
      g.add(inner);
    }

    for (let i = 0; i < 8; i++) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 6), this.matChrome);
      bolt.position.set((i % 2 ? -1 : 1) * 0.16, 2.7 + Math.floor(i / 2) * 0.12, -0.28);
      bolt.rotation.z = Math.PI / 2;
      g.add(bolt);
    }
    return g;
  }

  private addPanelLine(parent: THREE.Mesh, localPos: THREE.Vector3, size: THREE.Vector3): void {
    const line = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), this.matPanel);
    line.position.copy(localPos);
    parent.add(line);
  }

  private addHoneycomb(pos: THREE.Vector3): void {
    for (let y = -1; y <= 1; y++) {
      for (let x = -2; x <= 2; x++) {
        if ((x + y) % 2 !== 0) continue;
        const cell = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 6), this.matGunmetal);
        cell.rotation.x = Math.PI / 2;
        cell.position.set(pos.x + x * 0.055, pos.y, pos.z + y * 0.045);
        this.root.add(cell);
      }
    }
  }

  private decorateHardSurface(group: THREE.Group): void {
    const meshes: THREE.Mesh[] = [];
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh && !obj.userData.outlineDone) {
        meshes.push(obj);
      }
    });

    for (const obj of meshes) {
      obj.userData.outlineDone = true;
      if (obj.material instanceof THREE.MeshStandardMaterial) {
        if (!obj.material.userData.glowStored) {
          obj.material.userData.glowStored = true;
          obj.material.userData.baseEmissive = obj.material.emissive.getHex();
          obj.material.userData.baseIntensity = obj.material.emissiveIntensity;
          this.glowMats.push(obj.material);
        }
        obj.material.flatShading = true;
        obj.material.needsUpdate = true;
      }
      const shell = new THREE.Mesh(obj.geometry, this.outlineMat);
      shell.userData.isOutline = true;
      shell.scale.setScalar(1.035);
      shell.renderOrder = -1;
      obj.add(shell);
    }
  }

  private buildCelebrationFx(): void {
    this.glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(10, 36, 28),
      new THREE.MeshBasicMaterial({
        color: 0xfff1aa,
        transparent: true,
        opacity: 0,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.glowSphere.position.set(0, 2.5, 0);
    this.fx.add(this.glowSphere);

    this.robotAura = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 2.5, 48),
      new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    this.robotAura.rotation.x = -Math.PI / 2;
    this.robotAura.position.y = 0.38;
    this.fx.add(this.robotAura);

    this.glowLight = new THREE.PointLight(0x91f7ff, 0, 18);
    this.glowLight.position.set(0, 2.8, 1.4);
    this.root.add(this.glowLight);
  }

  private spawnMiniBurst(at: THREE.Vector3): void {
    const p = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.08, 1),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.85 })
    );
    p.position.copy(at);
    p.userData.birth = performance.now();
    this.fx.add(p);
    setTimeout(() => {
      if (this.disposed) return;
      this.fx.remove(p);
      p.geometry.dispose();
      (p.material as THREE.Material).dispose();
    }, 420);
  }

  private spawnFirework(): void {
    const cnt = 70;
    const ox = (Math.random() - 0.5) * 7;
    const oy = 2.3 + Math.random() * 3.2;
    const oz = -1 + (Math.random() - 0.5) * 4;
    const p = new Float32Array(cnt * 3);
    const v = new Float32Array(cnt * 3);
    const c = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt; i++) {
      p[i * 3] = ox;
      p[i * 3 + 1] = oy;
      p[i * 3 + 2] = oz;
      const dir = new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 1.1 + 0.2, (Math.random() - 0.5) * 2).normalize();
      const speed = 0.05 + Math.random() * 0.08;
      v[i * 3] = dir.x * speed;
      v[i * 3 + 1] = dir.y * speed;
      v[i * 3 + 2] = dir.z * speed;
      const col = new THREE.Color(FIREWORK_COLORS[i % FIREWORK_COLORS.length]!);
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    const m = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(g, m);
    this.fx.add(points);
    this.fireworks.push({ points, velocity: v, startAt: performance.now(), lifeMs: 1400 });
  }

  private updateFireworks(now: number): void {
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i]!;
      const t = (now - fw.startAt) / fw.lifeMs;
      if (t >= 1) {
        this.fx.remove(fw.points);
        fw.points.geometry.dispose();
        (fw.points.material as THREE.Material).dispose();
        this.fireworks.splice(i, 1);
        continue;
      }
      const pos = fw.points.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let j = 0; j < arr.length; j += 3) {
        arr[j] += fw.velocity[j]!;
        arr[j + 1] += fw.velocity[j + 1]! - 0.0019;
        arr[j + 2] += fw.velocity[j + 2]!;
        fw.velocity[j + 1]! -= 0.0001;
      }
      pos.needsUpdate = true;
      const mat = fw.points.material as THREE.PointsMaterial;
      mat.opacity = 1 - t * t;
      mat.size = 0.2 * (1 + t * 0.5);
    }
  }

  private updateAssembly(now: number): void {
    for (const part of this.parts) {
      if (!part.assembled) continue;
      const t = Math.min(1, (now - part.startAt) / 760);
      const e = 1 - Math.pow(1 - t, 3);
      part.group.visible = true;
      part.group.position.lerpVectors(part.from, part.to, e);
      part.group.scale.setScalar(0.001 + 0.999 * e);
      part.group.rotation.y = (1 - e) * (part.from.x > 0 ? -0.8 : 0.8);
    }
  }

  private updateMechanics(t: number): void {
    for (const knee of this.kneeMechs) {
      const slide = (0.5 + Math.sin(t * 2.8) * 0.5) * 0.06;
      knee.armor.position.y = knee.baseY - slide;
      knee.pistonL.scale.y = 1 + slide * 2.4;
      knee.pistonR.scale.y = 1 + slide * 2.4;
    }
  }

  private updateCinematicPose(t: number): void {
    this.poseProgress = Math.min(1, this.poseProgress + 0.016);
    const p = this.poseProgress;
    if (this.rightArmPivot) {
      this.rightArmPivot.rotation.z = -0.18 - p * 0.9;
      this.rightArmPivot.rotation.x = -0.2 + p * 0.75;
      this.rightArmPivot.rotation.y = p * 0.18;
    }
    if (this.leftArmPivot) {
      this.leftArmPivot.rotation.z = 0.06 + p * 0.22;
      this.leftArmPivot.rotation.x = -0.04 + p * 0.15;
    }
    if (this.beamBlade && this.beamBladeCore && this.beamGlow) {
      const show = p > 0.14;
      this.beamBlade.visible = show;
      this.beamBladeCore.visible = show;
      if (show) {
        const draw = Math.min(1, (p - 0.14) / 0.5);
        const pulse = 0.65 + Math.sin(t * 20) * 0.35;
        this.beamBlade.scale.y = 0.02 + draw * 1.02;
        this.beamBlade.material.opacity = 0.7 + pulse * 0.28;
        this.beamBladeCore.scale.y = 0.02 + draw * 1.08;
        this.beamBladeCore.material.opacity = 0.72 + pulse * 0.25;
        this.beamGlow.intensity = 0.3 + draw * (1.4 + pulse * 0.9);
      } else {
        this.beamGlow.intensity = 0;
      }
    }
  }

  private onResize = (): void => this.resize();

  private resize(): void {
    const w = Math.max(220, this.mount.clientWidth);
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

    this.stars.rotation.y = t * 0.016;
    this.nebula.rotation.y = t * 0.006;
    this.platform.rotation.y = Math.sin(t * 0.45) * 0.04;
    this.updateAssembly(now);
    this.updateMechanics(t);

    if (now < this.shakeUntil) this.root.rotation.z = Math.sin(t * 30) * 0.04;
    else this.root.rotation.z *= 0.86;

    this.root.position.y = Math.sin(t * 1.2) * 0.04;

    if (this.celebration) {
      this.celebrationFade = Math.min(1, this.celebrationFade + 0.012);
      const pulse = 0.5 + Math.sin(t * 5.3) * 0.5;
      const bg = this.bgDark.clone().lerp(this.bgBright, this.celebrationFade * (0.7 + pulse * 0.3));
      this.scene.background = bg;
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(bg);
        this.scene.fog.density = 0.022;
      }
      if (this.glowSphere) {
        this.glowSphere.material.opacity = this.celebrationFade * (0.16 + pulse * 0.2);
        this.glowSphere.scale.setScalar(1 + pulse * 0.05);
      }
      if (this.robotAura) {
        this.robotAura.material.opacity = this.celebrationFade * (0.5 + pulse * 0.45);
        this.robotAura.rotation.z = t * 0.9;
        this.robotAura.scale.setScalar(1 + pulse * 0.1);
      }
      if (this.glowLight) this.glowLight.intensity = this.celebrationFade * (2.1 + pulse * 1.6);
      this.root.rotation.y = t * 0.52;
      this.root.rotation.x = -0.05 + this.poseProgress * 0.03;
      this.root.scale.setScalar(1.03 + Math.sin(t * 3.1) * 0.03);
      this.updateCinematicPose(t);

      for (const mat of this.glowMats) {
        const base = (mat.userData.baseIntensity as number) ?? mat.emissiveIntensity;
        mat.emissive.setHex(0x3be4b0);
        mat.emissiveIntensity = base + this.celebrationFade * (0.45 + pulse * 0.7);
      }
      this.renderer.toneMappingExposure = 1.2 + this.celebrationFade * 0.42;
      this.bloomPass.strength = 0.74;

      if (now >= this.fireworkCooldown) {
        this.spawnFirework();
        this.fireworkCooldown = now + 260 + Math.random() * 260;
      }
      this.updateFireworks(now);
    } else {
      this.renderer.toneMappingExposure = 1.15;
      this.bloomPass.strength = 0.42;
      this.scene.background = this.bgDark.clone();
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(this.bgDark);
        this.scene.fog.density = 0.038;
      }
      this.root.rotation.y = Math.sin(t * 0.35) * 0.12;
      this.root.rotation.x = 0;
      this.root.scale.setScalar(1);
      this.poseProgress = 0;
      if (this.rightArmPivot) {
        this.rightArmPivot.rotation.set(0, 0, 0);
      }
      if (this.leftArmPivot) {
        this.leftArmPivot.rotation.set(0, 0, 0);
      }
      if (this.glowSphere) this.glowSphere.material.opacity = 0;
      if (this.robotAura) this.robotAura.material.opacity = 0;
      if (this.glowLight) this.glowLight.intensity = 0;
      if (this.beamBlade) this.beamBlade.visible = false;
      if (this.beamBladeCore) this.beamBladeCore.visible = false;
      if (this.beamGlow) this.beamGlow.intensity = 0;
      for (const mat of this.glowMats) {
        const baseEm = (mat.userData.baseEmissive as number) ?? mat.emissive.getHex();
        const baseI = (mat.userData.baseIntensity as number) ?? mat.emissiveIntensity;
        mat.emissive.setHex(baseEm);
        mat.emissiveIntensity = baseI;
      }
    }

    this.camera.position.x = Math.sin(t * 0.25) * 0.28;
    this.camera.position.y = 2.22 + Math.sin(t * 0.4) * 0.08;
    this.camera.lookAt(0, 2.6, 0);

    this.composer.render();
    this.rafId = requestAnimationFrame(this.loop);
  };
}

