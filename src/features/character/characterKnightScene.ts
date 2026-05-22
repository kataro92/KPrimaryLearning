import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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
  private readonly knight = new THREE.Group();
  private readonly tierGroups: THREE.Group[] = [];
  private readonly auraRing: THREE.Mesh;
  private readonly sparkles: THREE.Points;
  private readonly swordGlow: THREE.Mesh;
  private readonly cape: THREE.Mesh;
  private readonly capeBaseZ: Float32Array;
  private readonly headMesh: THREE.Mesh;
  private readonly legsMesh: THREE.Mesh;
  private readonly clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;
  private tier: KnightTier = 0;
  private tierPulse = 0;

  constructor(mount: HTMLElement, stats: CharacterKnightStats) {
    this.mount = mount;
    this.tier = computeKnightTier(stats);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb8dcff);
    this.scene.fog = new THREE.Fog(0xb8dcff, 8, 22);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    this.camera.position.set(0, 2.1, 5.4);
    this.camera.lookAt(0, 1.35, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.domElement.className = 'character-knight-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.28, 0.5, 0.9);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.addLights();
    this.buildStage();
    this.buildKnight();
    this.auraRing = this.buildAuraRing();
    this.scene.add(this.auraRing);
    this.sparkles = this.buildSparkles();
    this.scene.add(this.sparkles);
    this.swordGlow = this.knight.getObjectByName('sword-glow') as THREE.Mesh;
    this.cape = this.knight.getObjectByName('knight-cape') as THREE.Mesh;
    const capePos = this.cape.geometry.attributes.position as THREE.BufferAttribute;
    this.capeBaseZ = capePos.array.slice() as Float32Array;
    this.headMesh = this.knight.getObjectByName('knight-head') as THREE.Mesh;
    this.legsMesh = this.knight.getObjectByName('knight-legs') as THREE.Mesh;

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
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const hemi = new THREE.HemisphereLight(0xfff7ed, 0x93c5fd, 0.55);
    const key = new THREE.DirectionalLight(0xfffbeb, 1.35);
    key.position.set(3.5, 8, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const fill = new THREE.DirectionalLight(0xbfdbfe, 0.65);
    fill.position.set(-4, 4, -3);
    const rim = new THREE.DirectionalLight(0xfde68a, 0.45);
    rim.position.set(0, 3, -5);
    this.scene.add(hemi, key, fill, rim);
  }

  private buildStage(): void {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 48),
      new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.92 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.25, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.35, roughness: 0.45 })
    );
    pedestal.position.y = 0.18;
    pedestal.receiveShadow = true;
    pedestal.castShadow = true;
    this.scene.add(pedestal);

    for (let i = 0; i < 6; i++) {
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.08, 0),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0ea5e9,
          emissiveIntensity: 0.35,
          metalness: 0.6,
          roughness: 0.2,
        })
      );
      const a = (i / 6) * Math.PI * 2;
      gem.position.set(Math.cos(a) * 1.1, 0.42, Math.sin(a) * 1.1);
      this.scene.add(gem);
    }
  }

  private buildKnight(): void {
    this.knight.position.y = 0.35;
    const skin = new THREE.MeshStandardMaterial({ color: 0xfcd9b6, roughness: 0.82 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.78 });
    const leather = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.72 });
    const steel = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.88,
      roughness: 0.22,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.15,
    });

    const g0 = new THREE.Group();
    const tunic = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.62, 8, 14), cloth);
    tunic.position.y = 1.15;
    tunic.castShadow = true;
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), cloth);
    hood.position.set(0, 1.72, 0);
    hood.scale.set(1, 0.85, 1);
    hood.castShadow = true;
    const woodSword = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.9, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 })
    );
    woodSword.position.set(0.42, 1.2, 0.15);
    woodSword.rotation.z = -0.2;
    g0.add(tunic, hood, woodSword);
    this.tierGroups[0] = g0;

    const g1 = new THREE.Group();
    const leatherChest = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.38), leather);
    leatherChest.position.y = 1.12;
    leatherChest.castShadow = true;
    const leatherHelm = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 18), leather);
    leatherHelm.position.set(0, 1.78, 0);
    leatherHelm.scale.set(1, 0.7, 1);
    const smallShield = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.06, 20),
      steel
    );
    smallShield.position.set(-0.48, 1.1, 0.12);
    smallShield.rotation.y = Math.PI / 2;
    g1.add(leatherChest, leatherHelm, smallShield);
    g1.visible = false;
    this.tierGroups[1] = g1;

    const g2 = new THREE.Group();
    const plateChest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.82, 0.42), steel);
    plateChest.position.y = 1.1;
    plateChest.castShadow = true;
    for (const side of [-1, 1]) {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), steel);
      pauldron.position.set(side * 0.48, 1.38, 0);
      pauldron.scale.set(1.1, 0.75, 0.9);
      pauldron.castShadow = true;
      g2.add(pauldron);
    }
    const helm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.32, 16), steel);
    helm2.position.set(0, 1.82, 0);
    const ironShield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.52), steel);
    ironShield.position.set(-0.52, 1.05, 0.1);
    const ironSword = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.05, 0.14), steel);
    ironSword.position.set(0.46, 1.25, 0.12);
    ironSword.rotation.z = -0.25;
    g2.add(plateChest, helm2, ironShield, ironSword);
    g2.visible = false;
    this.tierGroups[2] = g2;

    const g3 = new THREE.Group();
    const honorChest = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.9, 0.46), steel);
    honorChest.position.y = 1.08;
    const capeGeo = new THREE.PlaneGeometry(1.1, 1.35, 12, 10);
    const capeMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });
    const capeMesh = new THREE.Mesh(capeGeo, capeMat);
    capeMesh.name = 'knight-cape';
    capeMesh.position.set(0, 1.2, -0.22);
    capeMesh.rotation.x = 0.12;
    const plume = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 })
    );
    plume.position.set(0, 2.05, 0);
    const bigShield = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 })
    );
    bigShield.position.set(-0.55, 1.05, 0.14);
    bigShield.rotation.y = Math.PI / 2;
    g3.add(honorChest, capeMesh, plume, bigShield);
    g3.visible = false;
    this.tierGroups[3] = g3;

    const g4 = new THREE.Group();
    const goldChest = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.95, 0.5), gold);
    goldChest.position.y = 1.06;
    goldChest.castShadow = true;
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.5), gold);
      wing.position.set(side * 0.58, 1.32, -0.05);
      wing.rotation.z = side * 0.35;
      wing.castShadow = true;
      g4.add(wing);
    }
    const crown = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.06, 10, 24),
      new THREE.MeshStandardMaterial({
        color: 0xfde047,
        emissive: 0xfacc15,
        emissiveIntensity: 0.55,
        metalness: 0.95,
        roughness: 0.15,
      })
    );
    crown.position.set(0, 2.02, 0);
    crown.rotation.x = Math.PI / 2;
    const holySword = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.15, 0.16), gold);
    holySword.position.set(0.5, 1.28, 0.14);
    holySword.rotation.z = -0.28;
    const swordGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfff7ed,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.85,
      })
    );
    swordGlow.name = 'sword-glow';
    swordGlow.position.set(0.58, 1.75, 0.16);
    g4.add(goldChest, crown, holySword, swordGlow);
    g4.visible = false;
    this.tierGroups[4] = g4;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), skin);
    head.name = 'knight-head';
    head.position.set(0, 1.68, 0.08);
    head.castShadow = true;
    const legs = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.5, 6, 10), cloth);
    legs.name = 'knight-legs';
    legs.position.set(0, 0.55, 0);
    legs.castShadow = true;

    this.knight.add(head, legs);
    for (const g of this.tierGroups) this.knight.add(g);
    this.scene.add(this.knight);
  }

  private buildAuraRing(): THREE.Mesh {
    const geo = new THREE.RingGeometry(0.85, 1.15, 48);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    ring.visible = false;
    return ring;
  }

  private buildSparkles(): THREE.Points {
    const count = 48;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 0.8;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = 0.8 + Math.random() * 1.6;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
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
    this.headMesh.visible = tier <= 1;
    this.legsMesh.visible = tier <= 1;
    this.auraRing.visible = tier >= 2;
    this.sparkles.visible = tier >= 4;
    this.bloomPass.strength = tier >= 4 ? 0.55 : tier >= 3 ? 0.38 : 0.28;
    const auraMat = this.auraRing.material as THREE.MeshBasicMaterial;
    if (tier >= 4) auraMat.color.setHex(0xfbbf24);
    else if (tier >= 3) auraMat.color.setHex(0xa78bfa);
    else auraMat.color.setHex(0x38bdf8);
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);
    const t = this.clock.getElapsedTime();
    this.knight.rotation.y = Math.sin(t * 0.35) * 0.12;
    this.knight.position.y = 0.35 + Math.sin(t * 1.2) * 0.03;

    if (this.cape?.visible) {
      const pos = this.cape.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const wave = Math.sin(t * 2.2 + x * 4) * 0.06;
        pos.setZ(i, this.capeBaseZ[i * 3 + 2] + wave);
      }
      pos.needsUpdate = true;
    }

    if (this.swordGlow?.visible) {
      const pulse = 0.85 + Math.sin(t * 4) * 0.15;
      this.swordGlow.scale.setScalar(pulse);
      const mat = this.swordGlow.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.9 + Math.sin(t * 5) * 0.35;
    }

    if (this.auraRing.visible) {
      this.auraRing.rotation.z = t * 0.5;
      const mat = this.auraRing.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.32 + Math.sin(t * 2) * 0.12;
    }

    if (this.sparkles.visible) {
      this.sparkles.rotation.y = t * 0.4;
    }

    if (this.tierPulse > 0) {
      this.tierPulse = Math.max(0, this.tierPulse - 0.012);
      this.knight.scale.setScalar(1 + this.tierPulse * 0.08);
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
