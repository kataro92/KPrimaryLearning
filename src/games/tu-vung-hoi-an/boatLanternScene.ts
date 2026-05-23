import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { playSfx } from '@/features/audio/sfxService';
import { fitModelToHeight, tryLoadGltfScene } from '@/core/assets/fitGltfModel';

const BASE = import.meta.env.BASE_URL;
const BOAT_MODEL_URLS = [
  `${BASE}models/tu-vung-hoi-an/boat/fishing-boat.glb`,
  `${BASE}models/tu-vung-hoi-an/boat/scene.gltf`,
] as const;
const LANTERN_MODEL_URLS = [
  `${BASE}models/tu-vung-hoi-an/lantern/paper-lantern.glb`,
  `${BASE}models/tu-vung-hoi-an/lantern/scene.gltf`,
] as const;

interface HangingLantern {
  group: THREE.Group;
  target: THREE.Vector3;
  startAt: number;
  reflection: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
}

interface Firework {
  points: THREE.Points;
  velocity: Float32Array;
  startAt: number;
  lifeMs: number;
}

const FIREWORK_COLORS = [0xffcc66, 0xff6b6b, 0x67e8f9, 0xc4b5fd, 0xf9a8d4];
const BOAT_SCALE = 12;
const BOAT_GLTF_HEIGHT = 1.35 * BOAT_SCALE;
const LANTERN_DROP_OFFSET = 1.4 * BOAT_SCALE;
/** Camera / fog tuned for large boat — far Z + high fog density was washing the scene to black. */
const CAM_BASE = new THREE.Vector3(0, 14, 34);
const CAM_LOOK = new THREE.Vector3(0, 5.5, -1);
const BOAT_BASE_Y = 0.3;
const BOAT_BASE_Z = -2.4;

/** Cảnh 3D Hội An: thuyền đêm trên sông, treo đèn lồng khi trả lời đúng. */
export class HoiAnBoatScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly clock = new THREE.Clock();
  private readonly boatGroup = new THREE.Group();
  private readonly proceduralBoat = new THREE.Group();
  private readonly water = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 90, 64, 48),
    new THREE.MeshStandardMaterial({
      color: 0x0c3e66,
      emissive: 0x0b1f36,
      emissiveIntensity: 0.35,
      roughness: 0.38,
      metalness: 0.28,
      transparent: true,
      opacity: 0.97,
      side: THREE.DoubleSide,
    })
  );
  private readonly fireworks: Firework[] = [];
  private readonly lanterns: HangingLantern[] = [];
  private readonly slots: THREE.Vector3[] = [];
  private readonly lanternLights: THREE.PointLight[] = [];
  private readonly mistPlanes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
  private readonly shorelineLights: THREE.Mesh[] = [];
  private readonly reflectionGroup = new THREE.Group();
  private readonly worldTmp = new THREE.Vector3();

  private rafId = 0;
  private disposed = false;
  private correctCount = 0;
  private celebrating = false;
  private celebrationFade = 0;
  private nextFireworkAt = 0;
  private shakeUntil = 0;
  private readonly totalPairs: number;
  private readonly moonLight = new THREE.PointLight(0xfef3c7, 1.35, 120);
  private readonly ambient = new THREE.AmbientLight(0xc8dcff, 0.72);
  private readonly moon = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xfbf7d0 })
  );
  private readonly bgDark = new THREE.Color(0x050a1d);
  private readonly bgFestive = new THREE.Color(0x2b1c55);
  private lanternTemplate: THREE.Group | null = null;

  constructor(mount: HTMLElement, totalPairs: number) {
    this.mount = mount;
    this.totalPairs = Math.max(1, totalPairs);
    this.scene = new THREE.Scene();
    this.scene.background = this.bgDark.clone();
    this.scene.fog = new THREE.FogExp2(this.bgDark.getHex(), 0.011);

    this.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 220);
    this.camera.position.copy(CAM_BASE);
    this.camera.lookAt(CAM_LOOK);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.renderer.domElement.className = 'hoi-an-boat-canvas';
    this.mount.appendChild(this.renderer.domElement);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.5, 0.85);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.buildEnvironment();
    this.buildBoat();
    this.boatGroup.add(this.proceduralBoat);
    this.buildLanternSlots();
    this.scene.add(this.water, this.reflectionGroup, this.boatGroup);

    this.resize();
    window.addEventListener('resize', this.onResize);
    void this.loadBoatModel();
    void this.loadLanternTemplate();
    this.loop();
  }

  private async loadBoatModel(): Promise<void> {
    const model = await tryLoadGltfScene(BOAT_MODEL_URLS);
    if (this.disposed || !model) return;
    model.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        for (const mat of mats) {
          if (!(mat instanceof THREE.MeshStandardMaterial)) continue;
          mat.color.multiplyScalar(1.35);
          mat.roughness = Math.min(0.92, mat.roughness * 1.05);
        }
      }
    });
    fitModelToHeight(model, BOAT_GLTF_HEIGHT);
    model.rotation.y = Math.PI / 2;
    model.position.set(0, -0.2, 0);
    this.proceduralBoat.visible = false;
    this.boatGroup.add(model);
  }

  private async loadLanternTemplate(): Promise<void> {
    const scene = await tryLoadGltfScene(LANTERN_MODEL_URLS);
    if (this.disposed || !scene) return;
    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = false;
      }
    });
    fitModelToHeight(scene, 0.52 * (BOAT_SCALE / 4));
    this.lanternTemplate = scene;
  }

  onCorrectPair(): void {
    if (this.correctCount >= this.totalPairs) return;
    this.correctCount++;
    this.attachLantern(this.correctCount - 1);
    playSfx('pop');
    if (this.correctCount % 2 === 0) playSfx('star');
    if (this.correctCount >= this.totalPairs) {
      this.celebrating = true;
      this.nextFireworkAt = performance.now();
      playSfx('unlock');
      playSfx('celebrate');
    }
  }

  onWrongPair(): void {
    this.shakeUntil = performance.now() + 280;
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
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  private buildEnvironment(): void {
    this.scene.add(this.ambient);
    this.scene.add(new THREE.HemisphereLight(0xfff4e8, 0x1e3a5f, 0.62));

    const key = new THREE.DirectionalLight(0xfff4d6, 1.65);
    key.position.set(18, 28, 22);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 165;
    key.shadow.camera.left = -48;
    key.shadow.camera.right = 48;
    key.shadow.camera.top = 48;
    key.shadow.camera.bottom = -48;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xaec8ff, 0.55);
    fill.position.set(-12, 10, 28);
    this.scene.add(fill);

    const boatRim = new THREE.PointLight(0xffe8b8, 0.9, 55);
    boatRim.position.set(0, 12, 8);
    this.scene.add(boatRim);

    this.moon.position.set(-22, 22, -28);
    this.moon.scale.setScalar(2.4);
    this.scene.add(this.moon);
    this.moonLight.position.set(-18, 18, -16);
    this.scene.add(this.moonLight);

    const shore = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 18),
      new THREE.MeshStandardMaterial({ color: 0x1a2840, roughness: 0.95, metalness: 0.02 })
    );
    shore.position.set(0, 1.5, -38);
    this.scene.add(shore);

    for (let i = 0; i < 24; i++) {
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 10, 10),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xffe08a : 0xfb7185 })
      );
      light.position.set(-42 + i * 3.6, 4.2 + Math.sin(i) * 0.6, -36);
      this.shorelineLights.push(light);
      this.scene.add(light);
    }

    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = -0.2;

    const stars = new THREE.BufferGeometry();
    const count = 2200;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 70;
      const t = Math.random() * Math.PI * 2;
      const y = 8 + Math.random() * 28;
      p[i * 3] = Math.cos(t) * r;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = Math.sin(t) * r - 28;
    }
    stars.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const points = new THREE.Points(
      stars,
      new THREE.PointsMaterial({ color: 0xdbeafe, size: 0.06, transparent: true, opacity: 0.92, depthWrite: false })
    );
    this.scene.add(points);

    // Sương mỏng trên sông vào ban đêm
    for (let i = 0; i < 4; i++) {
      const mist = new THREE.Mesh(
        new THREE.PlaneGeometry(28 + i * 6, 6 + i * 0.8),
        new THREE.MeshBasicMaterial({
          color: 0xbcd8ff,
          transparent: true,
          opacity: 0.05 + i * 0.012,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      mist.position.set((i - 1.5) * 8, 0.12 + i * 0.2, -10 - i * 2.4);
      mist.rotation.x = -Math.PI / 2;
      this.mistPlanes.push(mist);
      this.scene.add(mist);
    }
  }

  private buildBoat(): void {
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x6f3d20, roughness: 0.68, metalness: 0.08 });
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x4a2512, roughness: 0.72, metalness: 0.05 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd5b78d, roughness: 0.9, metalness: 0 });

    const hull = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.88, 1.75), hullMat);
    hull.position.y = 0.44;
    hull.castShadow = true;
    hull.receiveShadow = true;
    this.proceduralBoat.add(hull);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.3, 4), hullMat);
    nose.rotation.z = Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    nose.position.set(3.45, 0.5, 0);
    this.proceduralBoat.add(nose);

    const tail = nose.clone();
    tail.rotation.z = -Math.PI / 2;
    tail.position.x = -3.45;
    this.proceduralBoat.add(tail);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(5.25, 0.16, 1.4), darkWood);
    deck.position.y = 0.95;
    this.proceduralBoat.add(deck);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.8, 12), darkWood);
    mast.position.set(0.35, 2.28, 0);
    mast.castShadow = true;
    this.proceduralBoat.add(mast);

    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.9, 10), darkWood);
    boom.rotation.z = -0.16;
    boom.position.set(0.05, 2.95, 0);
    this.proceduralBoat.add(boom);

    const cloth = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.7, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x822424, roughness: 0.85, metalness: 0.04, side: THREE.DoubleSide })
    );
    cloth.position.set(0.08, 2.35, 0);
    cloth.rotation.y = 0.12;
    this.proceduralBoat.add(cloth);

    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 5.2, 8), ropeMat);
    rope.rotation.z = Math.PI / 2;
    rope.position.set(0, 1.72, 0.66);
    this.proceduralBoat.add(rope);

    // Hai mái chèo gỗ
    for (const side of [-1, 1] as const) {
      const oarGroup = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 10), darkWood);
      shaft.rotation.z = side * 0.42;
      shaft.position.set(side * 2.25, 0.95, 0.18);
      const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.5, 0.05), hullMat);
      paddle.position.set(side * 2.65, 0.46, 0.18);
      paddle.rotation.z = side * 0.42;
      oarGroup.add(shaft, paddle);
      this.proceduralBoat.add(oarGroup);
    }

    // Cọc neo + dây neo
    for (const side of [-1, 1] as const) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.52, 10), darkWood);
      post.position.set(side * 2.7, 1.2, 0.62);
      this.proceduralBoat.add(post);
      const knot = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 20), ropeMat);
      knot.rotation.x = Math.PI / 2;
      knot.position.set(side * 2.7, 1.25, 0.62);
      this.proceduralBoat.add(knot);
    }

    // Hoa văn gỗ thân thuyền
    for (let i = 0; i < 10; i++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.03, 0.02), darkWood);
      plank.position.set(-2.45 + i * 0.54, 0.6 + (i % 2) * 0.06, 0.88);
      this.proceduralBoat.add(plank);
    }

    this.proceduralBoat.scale.setScalar(BOAT_SCALE);
    this.boatGroup.position.set(0, BOAT_BASE_Y, BOAT_BASE_Z);
  }

  private buildLanternSlots(): void {
    const max = 12;
    for (let i = 0; i < max; i++) {
      const x = (-2.45 + i * 0.46) * BOAT_SCALE;
      const y = (1.62 + Math.sin(i * 0.45) * 0.08) * BOAT_SCALE;
      this.slots.push(new THREE.Vector3(x, y, 0.66 * BOAT_SCALE));
    }
  }

  private makeLantern(): THREE.Group {
    if (this.lanternTemplate) {
      const group = this.lanternTemplate.clone(true);
      const glow = new THREE.PointLight(0xffb347, 0.85, 3.4);
      glow.position.y = -0.03;
      group.add(glow);
      this.lanternLights.push(glow);
      return group;
    }

    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 14, 12),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xff7a00,
        emissiveIntensity: 0.55,
        roughness: 0.4,
        metalness: 0.06,
      })
    );
    body.scale.y = 1.35;
    group.add(body);

    const capTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, 0.08, 10),
      new THREE.MeshStandardMaterial({ color: 0x6b2f11, roughness: 0.65, metalness: 0.12 })
    );
    capTop.position.y = 0.24;
    const capBottom = capTop.clone();
    capBottom.position.y = -0.24;
    group.add(capTop, capBottom);

    const tassel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.03, 0.14, 8),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.72, metalness: 0.02 })
    );
    tassel.position.y = -0.34;
    group.add(tassel);

    const glow = new THREE.PointLight(0xffb347, 0.85, 3.4);
    glow.position.y = -0.03;
    group.add(glow);
    this.lanternLights.push(glow);
    return group;
  }

  private attachLantern(slotIdx: number): void {
    const slot = this.slots[Math.min(slotIdx, this.slots.length - 1)]!;
    const lantern = this.makeLantern();
    lantern.position.set(slot.x, slot.y + LANTERN_DROP_OFFSET, slot.z);
    this.boatGroup.add(lantern);
    const reflection = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 18),
      new THREE.MeshBasicMaterial({
        color: 0xffc36b,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    reflection.rotation.x = -Math.PI / 2;
    reflection.position.y = -0.17;
    this.reflectionGroup.add(reflection);
    this.lanterns.push({
      group: lantern,
      target: slot.clone(),
      startAt: performance.now(),
      reflection,
    });
  }

  private spawnFirework(): void {
    const count = 58;
    const ox = (Math.random() - 0.5) * 9;
    const oy = 3.2 + Math.random() * 2.6;
    const oz = -3 + (Math.random() - 0.5) * 4;
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = ox;
      p[i * 3 + 1] = oy;
      p[i * 3 + 2] = oz;
      const dir = new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 0.9 + 0.2, (Math.random() - 0.5) * 2).normalize();
      const speed = 0.05 + Math.random() * 0.08;
      v[i * 3] = dir.x * speed;
      v[i * 3 + 1] = dir.y * speed;
      v[i * 3 + 2] = dir.z * speed;
      const cc = new THREE.Color(FIREWORK_COLORS[i % FIREWORK_COLORS.length]!);
      c[i * 3] = cc.r;
      c[i * 3 + 1] = cc.g;
      c[i * 3 + 2] = cc.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    const m = new THREE.PointsMaterial({
      size: 0.19,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pts = new THREE.Points(g, m);
    this.scene.add(pts);
    this.fireworks.push({ points: pts, velocity: v, startAt: performance.now(), lifeMs: 1450 });
  }

  private updateFireworks(now: number): void {
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i]!;
      const t = (now - fw.startAt) / fw.lifeMs;
      if (t >= 1) {
        this.scene.remove(fw.points);
        fw.points.geometry.dispose();
        (fw.points.material as THREE.Material).dispose();
        this.fireworks.splice(i, 1);
        continue;
      }
      const pos = fw.points.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let j = 0; j < arr.length; j += 3) {
        arr[j] += fw.velocity[j]!;
        arr[j + 1] += fw.velocity[j + 1]! - 0.0018;
        arr[j + 2] += fw.velocity[j + 2]!;
        fw.velocity[j + 1]! -= 0.00011;
      }
      pos.needsUpdate = true;
      const mat = fw.points.material as THREE.PointsMaterial;
      mat.opacity = 1 - t * t;
      mat.size = 0.19 * (1 + t * 0.35);
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

    const waterGeo = this.water.geometry as THREE.PlaneGeometry;
    const pos = waterGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(t * 1.6 + x * 0.5 + y * 0.35) * 0.12 + Math.cos(t * 1.1 + x * 0.2) * 0.04);
    }
    pos.needsUpdate = true;
    waterGeo.computeVertexNormals();

    this.boatGroup.position.y = BOAT_BASE_Y + Math.sin(t * 1.2) * 0.35;
    this.boatGroup.rotation.z = Math.sin(t * 1.1) * 0.02;
    if (now < this.shakeUntil) this.boatGroup.rotation.y = Math.sin(t * 28) * 0.045;
    else this.boatGroup.rotation.y *= 0.86;

    this.lanterns.forEach((lan, idx) => {
      const tt = Math.min(1, (now - lan.startAt) / 640);
      const e = 1 - Math.pow(1 - tt, 3);
      lan.group.position.lerpVectors(
        new THREE.Vector3(lan.target.x, lan.target.y + LANTERN_DROP_OFFSET, lan.target.z),
        lan.target,
        e
      );
      lan.group.rotation.z = Math.sin(t * 2.8 + idx * 0.5) * 0.11;
      lan.group.rotation.y = Math.sin(t * 1.9 + idx * 0.3) * 0.08;

      // phản chiếu đèn lồng trên mặt nước
      this.worldTmp.set(0, 0, 0);
      lan.group.getWorldPosition(this.worldTmp);
      lan.reflection.position.set(this.worldTmp.x, -0.16, this.worldTmp.z);
      const lanternPulse = 0.55 + Math.sin(t * 6 + idx * 0.8) * 0.45;
      lan.reflection.material.opacity = 0.1 + lanternPulse * 0.16;
      const s = 1 + Math.sin(t * 4 + idx) * 0.18;
      lan.reflection.scale.setScalar(s);
    });

    // phản chiếu đèn bờ sông
    this.shorelineLights.forEach((l, i) => {
      if (!l.userData.reflection) {
        const refl = new THREE.Mesh(
          new THREE.CircleGeometry(0.08, 12),
          new THREE.MeshBasicMaterial({
            color: (l.material as THREE.MeshBasicMaterial).color.getHex(),
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        refl.rotation.x = -Math.PI / 2;
        this.reflectionGroup.add(refl);
        l.userData.reflection = refl;
      }
      const refl = l.userData.reflection as THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
      refl.position.set(l.position.x, -0.17, l.position.z + 1.25 + Math.sin(t * 1.3 + i) * 0.08);
      refl.material.opacity = 0.06 + Math.sin(t * 5 + i) * 0.02;
    });

    this.mistPlanes.forEach((m, i) => {
      m.position.x += Math.sin(t * 0.3 + i) * 0.0018;
      m.rotation.z = Math.sin(t * 0.4 + i) * 0.03;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = (this.celebrating ? 0.08 : 0.05) + Math.sin(t * 1.2 + i) * 0.01;
    });

    if (this.celebrating) {
      this.celebrationFade = Math.min(1, this.celebrationFade + 0.01);
      const pulse = 0.5 + Math.sin(t * 5.2) * 0.5;
      const bg = this.bgDark.clone().lerp(this.bgFestive, this.celebrationFade * (0.65 + pulse * 0.35));
      this.scene.background = bg;
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(bg);
        this.scene.fog.density = 0.008;
      }
      this.moonLight.intensity = 1.45 + pulse * 0.75;
      this.renderer.toneMappingExposure = 1.32 + this.celebrationFade * 0.34;
      this.bloomPass.strength = 0.64;
      this.lanternLights.forEach((l, i) => {
        l.intensity = 1 + pulse * 0.95 + Math.sin(t * 6 + i * 0.6) * 0.25;
      });
      if (now >= this.nextFireworkAt) {
        this.spawnFirework();
        this.nextFireworkAt = now + 280 + Math.random() * 260;
      }
    } else {
      this.scene.background = this.bgDark.clone();
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(this.bgDark);
        this.scene.fog.density = 0.011;
      }
      this.moonLight.intensity = 1.35;
      this.renderer.toneMappingExposure = 1.28;
      this.bloomPass.strength = 0.4;
    }

    this.updateFireworks(now);

    this.camera.position.x = CAM_BASE.x + Math.sin(t * 0.22) * 0.8;
    this.camera.position.y = CAM_BASE.y + Math.sin(t * 0.35) * 0.5;
    this.camera.position.z = CAM_BASE.z;
    this.camera.lookAt(CAM_LOOK.x, CAM_LOOK.y + Math.sin(t * 0.28) * 0.2, CAM_LOOK.z);
    this.composer.render();
    this.rafId = requestAnimationFrame(this.loop);
  };
}

