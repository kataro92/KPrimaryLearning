import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface FlyingBowl {
  mesh: THREE.Group;
  from: THREE.Vector3;
  control: THREE.Vector3;
  to: THREE.Vector3;
  startAt: number;
  durationMs: number;
}

export class ThanhGiongScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly riderGroup = new THREE.Group();
  private readonly horseGroup = new THREE.Group();
  private readonly riderArmorGroup = new THREE.Group();
  private readonly horseArmorGroup = new THREE.Group();
  private readonly flamesGroup = new THREE.Group();
  private readonly auraRing: THREE.Mesh;
  private readonly flagGroup = new THREE.Group();
  private flagMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> | null = null;
  private flagBasePositions: Float32Array | null = null;
  private readonly bowls: FlyingBowl[] = [];
  private readonly clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;
  private riderScaleBase = 0.9;
  private horseScaleBase = 1;
  private isAdultLegend = false;
  private evolutionLevel = 0;
  private evolutionPulse = 0;
  private evolutionBurst = 0;
  private readonly cameraBaseZ = 6.2;
  private readonly flameMaterial = new THREE.MeshStandardMaterial({
    color: 0xfb923c,
    emissive: 0xff5b14,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });
  private readonly riderClothMaterial = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.8 });
  private readonly bambooMaterial = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.76 });
  private readonly outlineMat = new THREE.MeshBasicMaterial({ color: 0x1b1525, side: THREE.BackSide });

  constructor(mount: HTMLElement) {
    this.mount = mount;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb3e5fc);
    this.scene.fog = new THREE.Fog(0xb3e5fc, 7, 17);

    this.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);
    this.camera.position.set(0, 1.8, this.cameraBaseZ);
    this.camera.lookAt(0, 1.1, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = 'thanh-giong-canvas';
    this.mount.appendChild(this.renderer.domElement);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.45, 0.86);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.addLights();
    this.buildWorld();
    this.buildHorse();
    this.buildRider();
    this.decorateOutlines(this.horseGroup, 0.02);
    this.decorateOutlines(this.riderGroup, 0.022);
    this.auraRing = this.buildAuraRing();
    this.scene.add(this.auraRing);
    this.buildVietnamFlag();
    this.resize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  onCorrectAnswer(correctCount: number): void {
    if (this.isAdultLegend) return;
    this.spawnRiceBowl();
    this.riderScaleBase = Math.min(1.28, this.riderScaleBase + 0.035);
    this.horseScaleBase = Math.min(1.22, this.horseScaleBase + 0.015);
    this.riderGroup.scale.setScalar(this.riderScaleBase);
    this.horseGroup.scale.setScalar(this.horseScaleBase);
    this.evolutionPulse = 1;

    const nextEvolution = Math.floor(correctCount / 3);
    if (nextEvolution > this.evolutionLevel) {
      this.evolutionLevel = nextEvolution;
      this.upgradeKidForm();
    }
  }

  onWrongAnswer(): void {
    this.riderGroup.rotation.z = -0.06;
    this.horseGroup.rotation.z = 0.03;
    setTimeout(() => {
      if (this.disposed) return;
      this.riderGroup.rotation.z = 0;
      this.horseGroup.rotation.z = 0;
    }, 180);
  }

  transformToLegend(): void {
    this.isAdultLegend = true;
    this.riderScaleBase = 1.42;
    this.horseScaleBase = 1.32;
    this.riderGroup.scale.setScalar(this.riderScaleBase);
    this.horseGroup.scale.setScalar(this.horseScaleBase);
    this.riderArmorGroup.visible = true;
    this.horseArmorGroup.visible = true;
    this.flamesGroup.visible = true;
    this.flamesGroup.scale.setScalar(1.18);
    this.riderClothMaterial.color.setHex(0x475569);
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
    const ambient = new THREE.AmbientLight(0xffffff, 0.78);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xb9d5ff, 0.5);
    const key = new THREE.DirectionalLight(0xfff3dd, 1.25);
    key.position.set(4, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    const fill = new THREE.DirectionalLight(0x99bbff, 0.5);
    fill.position.set(-4, 3, -4);
    this.scene.add(ambient, hemi, key, fill);
  }

  private buildWorld(): void {
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(7, 48),
      new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const mountainMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.92 });
    for (const [x, y, z, s] of [
      [-4.8, 1.2, -4.8, 1.5],
      [-2.4, 1.4, -5.3, 1.8],
      [1.3, 1.3, -5.1, 1.7],
      [4.2, 1.1, -4.7, 1.4],
    ] as const) {
      const mountain = new THREE.Mesh(new THREE.ConeGeometry(s, s * 2.2, 5), mountainMat);
      mountain.position.set(x, y, z);
      this.scene.add(mountain);
    }
  }

  private buildVietnamFlag(): void {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.05, 4.8, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.24 })
    );
    pole.position.set(-3.8, 2.25, -1.8);
    pole.castShadow = true;
    this.flagGroup.add(pole);

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.7, roughness: 0.32 })
    );
    cap.position.set(-3.8, 4.68, -1.8);
    this.flagGroup.add(cap);

    const flagGeo = new THREE.PlaneGeometry(2.6, 1.7, 36, 22);
    const flagMat = new THREE.MeshStandardMaterial({
      map: this.makeVietnamFlagTexture(),
      side: THREE.DoubleSide,
      roughness: 0.7,
      metalness: 0.02,
    });
    this.flagMesh = new THREE.Mesh(flagGeo, flagMat);
    this.flagMesh.position.set(-2.5, 3.85, -1.8);
    this.flagMesh.castShadow = true;
    this.flagGroup.add(this.flagMesh);

    const pos = flagGeo.attributes.position.array as Float32Array;
    this.flagBasePositions = pos.slice();
    this.scene.add(this.flagGroup);
  }

  private makeVietnamFlagTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 680;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#d70018';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.5;
    const outerR = canvas.height * 0.24;
    const innerR = outerR * 0.39;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = '#facc15';
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  private buildHorse(): void {
    const iron = new THREE.MeshStandardMaterial({ color: 0xb8c2cc, metalness: 0.72, roughness: 0.3 });
    const darkIron = new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.75, roughness: 0.35 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 0.85), iron);
    body.castShadow = true;
    body.position.y = 1;
    this.horseGroup.add(body);

    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.9, 0.5), darkIron);
    neck.position.set(1.07, 1.42, 0);
    neck.rotation.z = -0.35;
    neck.castShadow = true;
    this.horseGroup.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.55, 0.5), iron);
    head.position.set(1.42, 1.67, 0);
    head.castShadow = true;
    this.horseGroup.add(head);

    for (const x of [-0.7, 0.7]) {
      for (const z of [-0.24, 0.24]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 1.2, 8), darkIron);
        leg.position.set(x, 0.4, z);
        leg.castShadow = true;
        this.horseGroup.add(leg);
      }
    }

    const saddle = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.24, 0.75),
      new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9 })
    );
    saddle.position.set(-0.12, 1.5, 0);
    saddle.castShadow = true;
    this.horseGroup.add(saddle);

    const horseArmor = new THREE.Mesh(
      new THREE.BoxGeometry(1.24, 0.42, 0.92),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.22 })
    );
    horseArmor.position.set(0.1, 1.08, 0);
    horseArmor.visible = false;
    this.horseArmorGroup.add(horseArmor);

    for (const offset of [0, -0.12, 0.12]) {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.56, 8), this.flameMaterial);
      flame.rotation.z = Math.PI / 2;
      flame.position.set(1.88, 1.65 + offset * 0.2, offset);
      this.flamesGroup.add(flame);
    }
    const fireCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffe7ba, emissive: 0xff9a2a, emissiveIntensity: 1.1 })
    );
    fireCore.position.set(1.79, 1.65, 0);
    this.flamesGroup.add(fireCore);
    this.flamesGroup.visible = false;
    this.horseArmorGroup.visible = false;
    this.horseGroup.add(this.horseArmorGroup);
    this.horseGroup.add(this.flamesGroup);
    this.scene.add(this.horseGroup);
  }

  private buildRider(): void {
    const skin = new THREE.MeshStandardMaterial({ color: 0xf4c7a2, roughness: 0.82 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.8, roughness: 0.24 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.56, 6, 10), this.riderClothMaterial);
    body.position.set(-0.12, 1.95, 0);
    body.castShadow = true;
    this.riderGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), skin);
    head.position.set(-0.12, 2.48, 0);
    head.castShadow = true;
    this.riderGroup.add(head);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), skin);
    hand.position.set(0.24, 2.08, 0.12);
    hand.castShadow = true;
    this.riderGroup.add(hand);

    const bamboo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.9, 10),
      this.bambooMaterial
    );
    bamboo.position.set(0.55, 2.36, 0.12);
    bamboo.rotation.z = -0.34;
    bamboo.castShadow = true;
    this.riderGroup.add(bamboo);
    const spearTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.24, 8),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.88, roughness: 0.22 })
    );
    spearTip.position.set(0.86, 3.2, 0.12);
    spearTip.rotation.z = -0.34;
    spearTip.castShadow = true;
    this.riderGroup.add(spearTip);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.26, 22, 22), metal);
    helmet.position.set(-0.12, 2.52, 0);
    helmet.scale.y = 0.62;
    helmet.visible = false;
    this.riderArmorGroup.add(helmet);

    const chestPlate = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.48, 6, 10), metal);
    chestPlate.position.set(-0.12, 1.95, 0);
    chestPlate.visible = false;
    this.riderArmorGroup.add(chestPlate);
    const crest = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.24, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 })
    );
    crest.position.set(-0.12, 2.7, 0);
    crest.visible = false;
    this.riderArmorGroup.add(crest);
    this.riderArmorGroup.visible = false;
    this.riderGroup.add(this.riderArmorGroup);

    this.scene.add(this.riderGroup);
  }

  private decorateOutlines(group: THREE.Group, thickness = 0.02): void {
    const meshes: THREE.Mesh[] = [];
    group.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      if (obj.userData?.noOutline) return;
      meshes.push(obj);
    });
    meshes.forEach((obj) => {
      const shell = new THREE.Mesh(obj.geometry, this.outlineMat);
      shell.scale.setScalar(1 + thickness);
      shell.renderOrder = -1;
      obj.add(shell);
    });
  }

  private spawnRiceBowl(): void {
    const bowl = new THREE.Group();
    const ceramic = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
    const rice = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 });
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.14, 18), ceramic);
    const riceTop = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), rice);
    riceTop.position.y = 0.07;
    bowl.add(cup, riceTop);
    this.scene.add(bowl);

    this.bowls.push({
      mesh: bowl,
      from: new THREE.Vector3(-2.4, 0.52, 0.6),
      control: new THREE.Vector3(-1.2, 2.9, 0),
      to: new THREE.Vector3(-0.2, 2.22, 0.1),
      startAt: performance.now(),
      durationMs: 2800,
    });
  }

  private upgradeKidForm(): void {
    this.evolutionBurst = 1;
    this.evolutionPulse = 1;
    // Mỗi mốc 3 câu đúng tăng rõ nét vóc dáng "kid" và chi tiết chiến binh.
    const growth = 1 + Math.min(0.16, this.evolutionLevel * 0.06);
    this.riderGroup.scale.setScalar(this.riderScaleBase * growth);
    this.horseGroup.scale.setScalar(this.horseScaleBase * (1 + Math.min(0.09, this.evolutionLevel * 0.03)));
    if (this.evolutionLevel >= 1) {
      this.riderArmorGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) child.visible = true;
      });
      this.horseArmorGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) child.visible = true;
      });
      this.riderArmorGroup.visible = true;
      this.horseArmorGroup.visible = true;
      this.riderArmorGroup.scale.setScalar(0.6);
      this.horseArmorGroup.scale.setScalar(0.75);
      this.riderClothMaterial.color.setHex(0x1d4ed8);
    }
    if (this.evolutionLevel >= 2) {
      this.riderArmorGroup.scale.setScalar(0.82);
      this.horseArmorGroup.scale.setScalar(0.9);
      this.riderClothMaterial.color.setHex(0x1e40af);
      this.bambooMaterial.color.setHex(0x65a30d);
    }
    if (this.evolutionLevel >= 3) {
      this.flamesGroup.visible = true;
      this.flamesGroup.scale.setScalar(0.6);
      this.flameMaterial.emissiveIntensity = 1.05;
    }
  }

  private buildAuraRing(): THREE.Mesh {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.06, 40),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(-0.25, 0.04, 0);
    return ring;
  }

  private updateBowls(now: number): void {
    for (let i = this.bowls.length - 1; i >= 0; i--) {
      const b = this.bowls[i]!;
      const t = Math.min(1, (now - b.startAt) / b.durationMs);
      const inv = 1 - t;
      const x = inv * inv * b.from.x + 2 * inv * t * b.control.x + t * t * b.to.x;
      const y = inv * inv * b.from.y + 2 * inv * t * b.control.y + t * t * b.to.y;
      const z = inv * inv * b.from.z + 2 * inv * t * b.control.z + t * t * b.to.z;
      b.mesh.position.set(x, y, z);
      b.mesh.rotation.y += 0.1;
      b.mesh.scale.setScalar(1 - t * 0.35);
      if (t >= 1) {
        this.scene.remove(b.mesh);
        b.mesh.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            const mat = obj.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
        this.bowls.splice(i, 1);
      }
    }
  }

  private onResize = () => {
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
    if (this.evolutionBurst > 0) {
      this.evolutionBurst = Math.max(0, this.evolutionBurst - 0.018);
      const burst = this.evolutionBurst;
      this.camera.position.z = this.cameraBaseZ - burst * 0.45;
      this.riderGroup.rotation.y = Math.sin(t * 14) * burst * 0.12;
    } else {
      this.camera.position.z = this.cameraBaseZ;
      this.riderGroup.rotation.y *= 0.92;
    }
    this.horseGroup.position.y = Math.sin(t * 2.4) * 0.03;
    this.riderGroup.position.y = 0.02 + Math.sin(t * 2.4 + 0.4) * 0.05;
    if (this.flagMesh && this.flagBasePositions) {
      const geo = this.flagMesh.geometry;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        const baseX = this.flagBasePositions[i]!;
        const baseY = this.flagBasePositions[i + 1]!;
        const pinned = baseX < -1.25 ? 0 : 1;
        const wave =
          Math.sin(t * 5.6 + baseY * 2.1 + baseX * 1.8) * 0.12 +
          Math.sin(t * 2.8 + baseX * 4.2) * 0.06;
        pos[i + 2] = this.flagBasePositions[i + 2]! + wave * pinned;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
      this.flagMesh.rotation.y = -0.15 + Math.sin(t * 0.8) * 0.05;
    }
    if (this.evolutionPulse > 0) {
      this.evolutionPulse = Math.max(0, this.evolutionPulse - 0.006);
      const pulse = 1 + this.evolutionPulse * 0.08;
      this.riderGroup.scale.setScalar(this.riderScaleBase * pulse);
      this.horseGroup.scale.setScalar(this.horseScaleBase * (1 + this.evolutionPulse * 0.04));
      const auraMat = this.auraRing.material as THREE.MeshBasicMaterial;
      auraMat.opacity = this.evolutionPulse * 0.8;
      this.auraRing.scale.setScalar(1 + (1 - this.evolutionPulse) * 1.1);
    } else {
      (this.auraRing.material as THREE.MeshBasicMaterial).opacity = 0;
    }
    if (this.flamesGroup.visible) {
      this.flamesGroup.children.forEach((child, i) => {
        child.scale.y = 0.85 + Math.sin(t * 12 + i) * 0.25;
        child.scale.x = 0.92 + Math.sin(t * 9 + i * 0.7) * 0.16;
      });
      this.flameMaterial.emissiveIntensity = 0.9 + Math.sin(t * 15) * 0.28;
      this.bloomPass.strength = 0.58;
    } else {
      this.bloomPass.strength = 0.35;
    }
    this.updateBowls(now);
    this.composer.render();
    this.rafId = requestAnimationFrame(this.loop);
  };
}
