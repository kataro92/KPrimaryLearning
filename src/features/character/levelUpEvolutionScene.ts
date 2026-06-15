import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { buildCharacterStage, buildKnightModel } from './characterKnightBuilder';
import type { KnightTier } from './characterKnightScene';

export type EvolutionPhase = 'charge' | 'flash' | 'transform' | 'reveal' | 'done';

export interface EvolutionPhaseInfo {
  phase: EvolutionPhase;
  progress: number;
}

const TIER_AURA_COLORS = [0x4ade80, 0x38bdf8, 0xc084fc, 0xfbbf24, 0xf472b6] as const;

export class LevelUpEvolutionScene {
  private readonly mount: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly knight: THREE.Group;
  private readonly tierGroups: THREE.Group[];
  private readonly auraRing: THREE.Mesh;
  private readonly energySphere: THREE.Mesh;
  private readonly sparkles: THREE.Points;
  private readonly beamRings: THREE.Mesh[];
  private readonly clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;
  private fromTier: KnightTier;
  private toTier: KnightTier;
  private evolutionProgress = 0;
  private tierSwitched = false;
  private onPhaseChange: ((info: EvolutionPhaseInfo) => void) | null = null;
  private lastPhase: EvolutionPhase = 'charge';

  constructor(mount: HTMLElement, fromTier: KnightTier, toTier: KnightTier) {
    this.mount = mount;
    this.fromTier = fromTier;
    this.toTier = toTier;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f0a1e);
    this.scene.fog = new THREE.FogExp2(0x1e1035, 0.08);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    this.camera.position.set(0, 1.85, 5.2);
    this.camera.lookAt(0, 1.35, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.55;
    this.renderer.domElement.className = 'level-up-evolution__canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.28, 0.6, 0.9);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.addLights();
    buildCharacterStage(this.scene);

    const built = buildKnightModel();
    this.knight = built.knight;
    this.tierGroups = built.tierGroups;
    this.knight.position.y = 0.35;
    this.scene.add(this.knight);

    this.auraRing = this.buildAuraRing();
    this.scene.add(this.auraRing);

    this.energySphere = this.buildEnergySphere();
    this.scene.add(this.energySphere);

    this.sparkles = this.buildSparkles(120);
    this.scene.add(this.sparkles);

    this.beamRings = [this.buildBeamRing(1.1), this.buildBeamRing(1.55), this.buildBeamRing(2.05)];
    this.beamRings.forEach((r) => this.scene.add(r));

    this.applyTier(this.fromTier);
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  start(onPhaseChange?: (info: EvolutionPhaseInfo) => void): void {
    this.onPhaseChange = onPhaseChange ?? null;
    this.evolutionProgress = 0;
    this.tierSwitched = false;
    this.clock.start();
    this.emitPhase('charge', 0);
  }

  /** 0 → 1 tiến trình toàn bộ cinematic (~6s khi gọi từ screen). */
  setProgress(progress: number): void {
    this.evolutionProgress = Math.min(1, Math.max(0, progress));
    const p = this.evolutionProgress;

    if (p < 0.2) {
      this.emitPhase('charge', p / 0.2);
    } else if (p < 0.28) {
      this.emitPhase('flash', (p - 0.2) / 0.08);
    } else if (p < 0.62) {
      this.emitPhase('transform', (p - 0.28) / 0.34);
    } else if (p < 0.88) {
      this.emitPhase('reveal', (p - 0.62) / 0.26);
    } else {
      this.emitPhase('done', (p - 0.88) / 0.12);
    }

    if (!this.tierSwitched && p >= 0.45) {
      this.tierSwitched = true;
      this.applyTier(this.toTier);
    }
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.composer.dispose();
    this.renderer.dispose();
    this.mount.innerHTML = '';
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
  }

  private emitPhase(phase: EvolutionPhase, localProgress: number): void {
    if (phase !== this.lastPhase) {
      this.lastPhase = phase;
      this.onPhaseChange?.({ phase, progress: localProgress });
    }
  }

  private addLights(): void {
    this.scene.add(new THREE.AmbientLight(0x9d8df5, 0.45));
    const key = new THREE.DirectionalLight(0xfff7ed, 1.6);
    key.position.set(2.5, 8, 5);
    key.castShadow = true;
    const rim = new THREE.DirectionalLight(0xfde68a, 0.85);
    rim.position.set(-3, 4, -5);
    const under = new THREE.PointLight(0x7c3aed, 1.2, 12);
    under.position.set(0, 0.4, 1.5);
    this.scene.add(key, rim, under);
  }

  private buildAuraRing(): THREE.Mesh {
    const geo = new THREE.RingGeometry(0.75, 1.05, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: TIER_AURA_COLORS[this.fromTier],
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    return ring;
  }

  private buildEnergySphere(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(1.35, 32, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.y = 1.35;
    return sphere;
  }

  private buildBeamRing(radius: number): THREE.Mesh {
    const geo = new THREE.TorusGeometry(radius, 0.04, 8, 72);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.35;
    return ring;
  }

  private buildSparkles(count: number): THREE.Points {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 1.6;
      const y = 0.5 + Math.random() * 2.2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r;
      const hue = 0.12 + Math.random() * 0.2;
      const c = new THREE.Color().setHSL(hue, 0.9, 0.65);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }

  private applyTier(tier: KnightTier): void {
    this.tierGroups.forEach((g, i) => {
      if (g) g.visible = i === tier;
    });
    const auraMat = this.auraRing.material as THREE.MeshBasicMaterial;
    auraMat.color.setHex(TIER_AURA_COLORS[tier]);
    this.bloomPass.strength = 0.28 + tier * 0.12;
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);
    const t = this.clock.getElapsedTime();
    const p = this.evolutionProgress;

    const charge = p < 0.2 ? p / 0.2 : p < 0.28 ? 1 : 0;
    const flash = p >= 0.2 && p < 0.28 ? (p - 0.2) / 0.08 : 0;
    const transform = p >= 0.28 && p < 0.62 ? (p - 0.28) / 0.34 : 0;
    const reveal = p >= 0.62 ? Math.min(1, (p - 0.62) / 0.26) : 0;

    const shake = charge > 0 ? Math.sin(t * 38) * 0.018 * charge : 0;
    this.knight.position.x = shake;
    this.knight.position.y = 0.35 + Math.sin(t * 2.5) * 0.02 * (reveal || 0.3);

    const spinSpeed =
      flash > 0.5 ? 0.35 + flash * 2.5 : transform > 0 ? 0.8 + transform * 4.5 : reveal > 0 ? 0.25 : 0.08;
    this.knight.rotation.y += spinSpeed * this.clock.getDelta();

    const scalePulse =
      1 +
      charge * 0.06 * Math.sin(t * 12) +
      flash * 0.35 +
      transform * 0.2 * Math.sin(t * 8) +
      reveal * 0.08;
    this.knight.scale.setScalar(scalePulse);

    const auraMat = this.auraRing.material as THREE.MeshBasicMaterial;
    auraMat.opacity = 0.25 + charge * 0.45 + transform * 0.35 + reveal * 0.2;
    this.auraRing.rotation.z = t * (1.2 + transform * 3);
    this.auraRing.scale.setScalar(1 + charge * 0.15 + transform * 0.4);

    const sphereMat = this.energySphere.material as THREE.MeshBasicMaterial;
    sphereMat.opacity =
      flash * 0.85 * (1 - Math.abs(flash - 0.5) * 2) + transform * 0.35 * (1 - transform * 0.5);
    this.energySphere.scale.setScalar(0.6 + flash * 1.4 + transform * 0.5);
    this.energySphere.rotation.y = t * 2.2;

    const sparkleMat = this.sparkles.material as THREE.PointsMaterial;
    sparkleMat.opacity = transform * 0.95 + reveal * 0.85;
    this.sparkles.rotation.y = t * 1.8;

    this.beamRings.forEach((ring, i) => {
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = transform * 0.7 * (1 - i * 0.22);
      ring.rotation.z = t * (2 + i * 0.8) * (i % 2 === 0 ? 1 : -1);
      ring.scale.setScalar(0.7 + transform * 0.6 + Math.sin(t * 3 + i) * 0.05);
    });

    this.bloomPass.strength = 0.28 + charge * 0.35 + flash * 1.1 + transform * 0.55 + reveal * 0.25;

    const camPull = charge * 0.15 - reveal * 0.25;
    this.camera.position.z = 5.2 + camPull;
    this.camera.position.y = 1.85 + reveal * 0.12;

    this.composer.render();
  };

  private onResize = (): void => {
    const w = this.mount.clientWidth || 320;
    const h = this.mount.clientHeight || 420;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.bloomPass.resolution.set(w, h);
  };
}
