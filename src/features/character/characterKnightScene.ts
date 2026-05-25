import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { buildCharacterStage, buildKnightModel } from './characterKnightBuilder';

export interface CharacterKnightStats {
  avgScore: number;
  bestScore: number;
  accuracyPct: number;
  unlockedPct: number;
  totalSessions: number;
}

export type KnightTier = 0 | 1 | 2 | 3 | 4;

export function computeKnightTier(stats: CharacterKnightStats): KnightTier {
  const scorePart = ((stats.avgScore * 0.4 + stats.bestScore * 0.2) / 10) * 0.45;
  const accPart = (stats.accuracyPct / 100) * 0.28;
  const unlockPart = (stats.unlockedPct / 100) * 0.17;
  const playPart = Math.min(1, stats.totalSessions / 15) * 0.1;
  const power = scorePart + accPart + unlockPart + playPart;
  if (power >= 0.78) return 4;
  if (power >= 0.58) return 3;
  if (power >= 0.38) return 2;
  if (power >= 0.18) return 1;
  return 0;
}

const TIER_LABELS = [
  'Hiệp sĩ tập sự',
  'Hiệp sĩ da thuộc',
  'Hiệp sĩ thép',
  'Hiệp sĩ danh dự',
  'Hiệp sĩ vàng rực rỡ',
] as const;

export class CharacterKnightScene {
  private readonly mount: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly knight: THREE.Group;
  private readonly tierGroups: THREE.Group[];
  private readonly auraRing: THREE.Mesh;
  private readonly sparkles: THREE.Points;
  private readonly confetti: THREE.Points;
  private readonly swordGlow: THREE.Mesh | null;
  private readonly cape: THREE.Mesh | null;
  private readonly capeBaseZ: Float32Array | null;
  private readonly leftPupil: THREE.Mesh;
  private readonly rightPupil: THREE.Mesh;
  private readonly wings: THREE.Mesh[];
  private readonly flagBanner: THREE.Group | null;
  private readonly clouds: THREE.Group;
  private readonly clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;
  private tier: KnightTier = 0;
  private tierPulse = 0;
  private blinkTimer = 0;
  private nextBlink = 2.8;

  constructor(mount: HTMLElement, stats: CharacterKnightStats) {
    this.mount = mount;
    this.tier = computeKnightTier(stats);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7dd3fc);
    this.scene.fog = new THREE.Fog(0xe0f2fe, 10, 24);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    this.camera.position.set(0, 1.95, 4.85);
    this.camera.lookAt(0, 1.38, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.domElement.className = 'character-knight-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.32, 0.55, 0.85);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.addLights();
    this.clouds = buildCharacterStage(this.scene);

    const built = buildKnightModel();
    this.knight = built.knight;
    this.tierGroups = built.tierGroups;
    this.cape = built.cape;
    this.capeBaseZ = built.capeBaseZ;
    this.swordGlow = built.swordGlow;
    this.leftPupil = built.leftPupil;
    this.rightPupil = built.rightPupil;
    this.wings = built.wings;
    this.flagBanner = built.flagBanner;
    this.knight.position.y = 0.35;
    this.scene.add(this.knight);

    this.auraRing = this.buildAuraRing();
    this.scene.add(this.auraRing);
    this.sparkles = this.buildSparkles(0xfff176, 56);
    this.scene.add(this.sparkles);
    this.confetti = this.buildSparkles(0xf472b6, 32, 0.11);
    this.scene.add(this.confetti);

    this.applyTier(this.tier);
    this.mountTierBadge();

    this.resize();
    window.addEventListener('resize', this.onResize);
    this.tierPulse = 1;
    this.loop();
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.composer.dispose();
    this.renderer.dispose();
    this.mount.innerHTML = '';
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
      if (obj instanceof THREE.Points) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      }
    });
  }

  private mountTierBadge(): void {
    const badge = document.createElement('p');
    badge.className = 'character-knight-tier';
    badge.textContent = TIER_LABELS[this.tier];
    this.mount.appendChild(badge);
  }

  private addLights(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.78));
    const hemi = new THREE.HemisphereLight(0xfff7ed, 0x7dd3fc, 0.62);
    const key = new THREE.DirectionalLight(0xfffbeb, 1.45);
    key.position.set(3.2, 9, 4.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const fill = new THREE.DirectionalLight(0xc4b5fd, 0.72);
    fill.position.set(-4.5, 5, -2);
    const rim = new THREE.DirectionalLight(0xfde68a, 0.55);
    rim.position.set(0, 4, -6);
    this.scene.add(hemi, key, fill, rim);
  }

  private buildAuraRing(): THREE.Mesh {
    const geo = new THREE.RingGeometry(0.9, 1.22, 56);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    ring.visible = false;
    return ring;
  }

  private buildSparkles(color: number, count: number, size = 0.09): THREE.Points {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.55 + Math.random() * 0.95;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = 0.75 + Math.random() * 1.75;
      pos[i * 3 + 2] = Math.sin(a) * r;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    pts.visible = false;
    return pts;
  }

  private applyTier(tier: KnightTier): void {
    this.tierGroups.forEach((g, i) => {
      if (g) g.visible = i === tier;
    });
    this.auraRing.visible = tier >= 2;
    this.sparkles.visible = tier >= 3;
    this.confetti.visible = tier >= 4;
    this.bloomPass.strength = tier >= 4 ? 0.62 : tier >= 3 ? 0.45 : tier >= 2 ? 0.36 : 0.32;
    const auraMat = this.auraRing.material as THREE.MeshBasicMaterial;
    if (tier >= 4) auraMat.color.setHex(0xfbbf24);
    else if (tier >= 3) auraMat.color.setHex(0xc084fc);
    else if (tier >= 2) auraMat.color.setHex(0x38bdf8);
    else auraMat.color.setHex(0x4ade80);
  }

  private updateBlink(dt: number): void {
    this.blinkTimer += dt;
    if (this.blinkTimer < this.nextBlink) return;
    const blinkPhase = this.blinkTimer - this.nextBlink;
    if (blinkPhase < 0.12) {
      const squish = blinkPhase < 0.06 ? 0.12 : 1;
      this.leftPupil.scale.y = squish;
      this.rightPupil.scale.y = squish;
      return;
    }
    this.leftPupil.scale.y = 1;
    this.rightPupil.scale.y = 1;
    if (blinkPhase > 0.2) {
      this.blinkTimer = 0;
      this.nextBlink = 2.4 + Math.random() * 2.2;
    }
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);
    const t = this.clock.getElapsedTime();
    const dt = this.clock.getDelta();
    this.updateBlink(dt);

    this.knight.rotation.y = Math.sin(t * 0.42) * 0.14;
    this.knight.position.y = 0.35 + Math.sin(t * 1.35) * 0.045;

    if (this.cape?.visible && this.capeBaseZ) {
      const pos = this.cape.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const wave = Math.sin(t * 2.4 + x * 4.5) * 0.07;
        pos.setZ(i, this.capeBaseZ[i * 3 + 2] + wave);
      }
      pos.needsUpdate = true;
    }

    if (this.swordGlow?.visible) {
      const pulse = 0.9 + Math.sin(t * 4.2) * 0.18;
      this.swordGlow.scale.setScalar(pulse);
      const mat = this.swordGlow.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1 + Math.sin(t * 5.5) * 0.4;
    }

    for (const wing of this.wings) {
      if (!wing.visible) continue;
      const side = wing.position.x < 0 ? -1 : 1;
      wing.rotation.z = side * (0.42 + Math.sin(t * 3.2) * 0.12);
    }

    if (this.auraRing.visible) {
      this.auraRing.rotation.z = t * 0.55;
      const mat = this.auraRing.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.38 + Math.sin(t * 2.2) * 0.14;
    }

    if (this.sparkles.visible) {
      this.sparkles.rotation.y = t * 0.5;
    }
    if (this.confetti.visible) {
      this.confetti.rotation.y = -t * 0.35;
      this.confetti.position.y = Math.sin(t * 1.1) * 0.05;
    }

    this.clouds.children.forEach((cloud, i) => {
      const phase = (cloud.userData.phase as number) ?? i;
      cloud.position.x += Math.sin(t * 0.25 + phase) * 0.0008;
      cloud.position.y = 3.15 + i * 0.15 + Math.sin(t * 0.5 + phase) * 0.08;
    });

    if (this.flagBanner?.visible) {
      const flag = this.flagBanner.children.find((c) => c instanceof THREE.Mesh && c !== this.flagBanner!.children[0]);
      if (flag) {
        flag.rotation.z = Math.sin(t * 2.8) * 0.1;
        flag.rotation.x = Math.sin(t * 1.6) * 0.04;
      }
    }

    if (this.tierPulse > 0) {
      this.tierPulse = Math.max(0, this.tierPulse - 0.01);
      this.knight.scale.setScalar(1 + this.tierPulse * 0.1);
    }

    this.composer.render();
  };

  private onResize = (): void => {
    const w = this.mount.clientWidth || 272;
    const h = this.mount.clientHeight || 453;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.bloomPass.resolution.set(w, h);
  };

  private resize(): void {
    this.onResize();
  }
}
