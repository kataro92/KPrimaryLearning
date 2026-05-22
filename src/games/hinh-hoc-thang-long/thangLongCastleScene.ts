import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { playSfx } from '@/features/audio/sfxService';

interface FallingPart {
  group: THREE.Group;
  assembled: boolean;
  startAt: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
}

/** Thành cổ Thăng Long: đúng thì module rơi xuống ghép thành công trình; hoàn thành thì rồng vàng hạ xuống. */
export class ThangLongCastleScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloomPass: UnrealBloomPass;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly clock = new THREE.Clock();
  private readonly castleRoot = new THREE.Group();
  private readonly dragonRoot = new THREE.Group();
  private readonly stars = new THREE.Group();
  private readonly parts: FallingPart[] = [];
  private readonly maxParts: number;
  private readonly brickTex: THREE.CanvasTexture;
  private readonly roofTex: THREE.CanvasTexture;
  private readonly outlineMat = new THREE.MeshBasicMaterial({ color: 0x17121f, side: THREE.BackSide });
  private rafId = 0;
  private disposed = false;
  private correctCount = 0;
  private celebration = false;
  private dragonPhase = 0;
  private dragonBody: THREE.Mesh[] = [];
  private dragonHead: THREE.Group | null = null;
  private readonly bgNight = new THREE.Color(0x060816);
  private readonly bgCelebrate = new THREE.Color(0x22124a);

  constructor(mount: HTMLElement, totalTasks: number) {
    this.mount = mount;
    this.maxParts = Math.min(10, Math.max(5, totalTasks));
    this.brickTex = this.makeBrickTexture();
    this.roofTex = this.makeRoofTexture();

    this.scene = new THREE.Scene();
    this.scene.background = this.bgNight.clone();
    this.scene.fog = new THREE.FogExp2(this.bgNight.getHex(), 0.036);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 3.4, 8.6);
    this.camera.lookAt(0, 1.5, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.domElement.className = 'thang-long-castle-canvas';
    this.mount.appendChild(this.renderer.domElement);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.45, 0.86);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    this.buildWorld();
    this.buildCastleParts();
    this.buildDragon();
    this.scene.add(this.castleRoot, this.dragonRoot, this.stars);

    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  onCorrectAnswer(): void {
    if (this.correctCount >= this.parts.length) return;
    const idx = this.correctCount;
    this.correctCount++;
    const p = this.parts[idx]!;
    p.assembled = true;
    p.startAt = performance.now();
    playSfx('pop');
    if ((idx + 1) % 2 === 0) playSfx('star');
  }

  onCompletedPerfect(): void {
    this.celebration = true;
    this.dragonPhase = 0;
    playSfx('unlock');
    playSfx('celebrate');
  }

  onWrongAnswer(): void {
    this.castleRoot.rotation.z = -0.03;
    setTimeout(() => {
      if (!this.disposed) this.castleRoot.rotation.z = 0;
    }, 180);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.mount.innerHTML = '';
    this.renderer.dispose();
    this.brickTex.dispose();
    this.roofTex.dispose();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
  }

  private makeBrickTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#8f6a4a';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 16; x++) {
        const off = y % 2 === 0 ? 0 : 16;
        const bx = x * 32 - off;
        const by = y * 32;
        ctx.fillStyle = `hsl(27, 35%, ${35 + Math.random() * 12}%)`;
        ctx.fillRect(bx + 1, by + 1, 30, 30);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.strokeRect(bx + 1, by + 1, 30, 30);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 1.4);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  private makeRoofTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#5b2f1f';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let y = 0; y < 18; y++) {
      ctx.strokeStyle = `rgba(210,120,80,${0.18 + Math.random() * 0.15})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, y * 14 + (y % 2 ? 4 : 0));
      ctx.lineTo(c.width, y * 14 + (y % 2 ? 4 : 0));
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1.8, 1.8);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  private buildWorld(): void {
    this.scene.add(new THREE.AmbientLight(0xbfd6ff, 0.58));
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xb9d5ff, 0.5));
    const key = new THREE.DirectionalLight(0xfff0cc, 1.12);
    key.position.set(5, 8, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0005;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x6ca0ff, 0.7);
    rim.position.set(-5, 4, -4);
    this.scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 12),
      new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.93, metalness: 0.03 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const moat = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 14, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0x103252,
        emissive: 0x0b1d30,
        emissiveIntensity: 0.32,
        roughness: 0.35,
        metalness: 0.18,
        transparent: true,
        opacity: 0.72,
      })
    );
    moat.rotation.x = -Math.PI / 2;
    moat.position.y = -0.16;
    this.scene.add(moat);

    const starGeo = new THREE.BufferGeometry();
    const count = 1800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 24;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = 2 + Math.random() * 7;
      pos[i * 3 + 2] = Math.sin(a) * r - 7;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.stars.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xdbeafe, size: 0.06, transparent: true, opacity: 0.9, depthWrite: false })
      )
    );
  }

  private addPart(order: number, to: THREE.Vector3, from: THREE.Vector3, group: THREE.Group): void {
    if (order >= this.maxParts) return;
    group.visible = false;
    group.position.copy(to);
    group.scale.setScalar(0.001);
    this.castleRoot.add(group);
    this.parts.push({ group, assembled: false, startAt: 0, from, to });
  }

  private buildCastleParts(): void {
    const brickMat = new THREE.MeshStandardMaterial({
      map: this.brickTex,
      roughness: 0.68,
      metalness: 0.08,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      map: this.roofTex,
      roughness: 0.75,
      metalness: 0.06,
    });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5b3a29, roughness: 0.78, metalness: 0.03 });

    const foundation = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.55, 2.2), brickMat);
    base.position.set(0, 0.28, 0);
    this.addOutline(base, 0.022);
    foundation.add(base);
    this.addPart(0, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 4, 0), foundation);

    const wallL = new THREE.Group();
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.42, 2.0), brickMat);
    l.position.set(-1.84, 1.26, 0);
    this.addOutline(l, 0.024);
    wallL.add(l);
    this.addPart(1, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-3, 5, 0), wallL);

    const wallR = new THREE.Group();
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.42, 2.0), brickMat);
    r.position.set(1.84, 1.26, 0);
    this.addOutline(r, 0.024);
    wallR.add(r);
    this.addPart(2, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 5, 0), wallR);

    const backWall = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(3.32, 1.34, 0.42), brickMat);
    b.position.set(0, 1.3, -0.9);
    this.addOutline(b, 0.024);
    backWall.add(b);
    this.addPart(3, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5.2, -2.5), backWall);

    const gate = new THREE.Group();
    const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.25, 0.34), brickMat);
    gateFrame.position.set(0, 0.95, 0.95);
    this.addOutline(gateFrame, 0.022);
    const gateDoor = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.96, 0.13), woodMat);
    gateDoor.position.set(0, 0.83, 1.18);
    this.addOutline(gateDoor, 0.02);
    gate.add(gateFrame, gateDoor);
    this.addPart(4, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 4.8, 2.3), gate);

    const towerL = new THREE.Group();
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 2.15, 10), brickMat);
    t1.position.set(-1.85, 1.58, -0.86);
    this.addOutline(t1, 0.024);
    towerL.add(t1);
    this.addPart(5, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-3.8, 6.2, -2.5), towerL);

    const towerR = new THREE.Group();
    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 2.15, 10), brickMat);
    t2.position.set(1.85, 1.58, -0.86);
    this.addOutline(t2, 0.024);
    towerR.add(t2);
    this.addPart(6, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3.8, 6.2, -2.5), towerR);

    const roofMain = new THREE.Group();
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.25, 4), roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, 2.52, 0);
    this.addOutline(roof, 0.02);
    roofMain.add(roof);
    this.addPart(7, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 7, 0), roofMain);

    const roofTurretL = new THREE.Group();
    const rt1 = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.7, 8), roofMat);
    rt1.position.set(-1.85, 2.9, -0.86);
    this.addOutline(rt1, 0.02);
    roofTurretL.add(rt1);
    this.addPart(8, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-2.8, 7.4, -1.5), roofTurretL);

    const roofTurretR = new THREE.Group();
    const rt2 = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.7, 8), roofMat);
    rt2.position.set(1.85, 2.9, -0.86);
    this.addOutline(rt2, 0.02);
    roofTurretR.add(rt2);
    this.addPart(9, new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.8, 7.4, -1.5), roofTurretR);
  }

  private buildDragon(): void {
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xc6920a,
      emissiveIntensity: 0.4,
      roughness: 0.35,
      metalness: 0.7,
    });
    this.dragonRoot.visible = false;
    this.dragonRoot.position.set(0, 6.4, -1.35);

    const segCount = 14;
    for (let i = 0; i < segCount; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.3 - i * 0.01, 14, 14), goldMat);
      s.position.set(i * 0.26 - 1.7, Math.sin(i * 0.45) * 0.22, Math.cos(i * 0.35) * 0.35);
      this.addOutline(s, 0.03);
      this.dragonRoot.add(s);
      this.dragonBody.push(s);
    }

    this.dragonHead = new THREE.Group();
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.4), goldMat);
    head.position.set(-1.95, 0.05, 0);
    this.addOutline(head, 0.03);
    this.dragonHead.add(head);
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 6), goldMat);
    hornL.position.set(-2.1, 0.25, 0.12);
    hornL.rotation.z = 0.3;
    const hornR = hornL.clone();
    hornR.position.z = -0.12;
    hornR.rotation.z = -0.3;
    this.addOutline(hornL, 0.03);
    this.addOutline(hornR, 0.03);
    this.dragonHead.add(hornL, hornR);
    this.dragonRoot.add(this.dragonHead);

    const dragonLight = new THREE.PointLight(0xfcd34d, 0.85, 10);
    dragonLight.position.set(-1.7, 0.4, 0);
    this.dragonRoot.add(dragonLight);
  }

  private addOutline(mesh: THREE.Mesh, thickness = 0.026): void {
    const shell = new THREE.Mesh(mesh.geometry, this.outlineMat);
    shell.scale.setScalar(1 + thickness);
    shell.renderOrder = -1;
    mesh.add(shell);
  }

  private onResize = (): void => {
    const w = Math.max(220, this.mount.clientWidth);
    const h = Math.max(180, this.mount.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
  };

  private loop = (): void => {
    if (this.disposed) return;
    const now = performance.now();
    const t = this.clock.getElapsedTime();

    this.parts.forEach((p) => {
      if (!p.assembled) return;
      const tt = Math.min(1, (now - p.startAt) / 680);
      const e = 1 - Math.pow(1 - tt, 3);
      p.group.visible = true;
      p.group.position.lerpVectors(p.from, p.to, e);
      p.group.scale.setScalar(0.001 + e * 0.999);
      p.group.rotation.y = (1 - e) * 0.75;
      p.group.rotation.x = (1 - e) * 0.35;
    });

    if (this.celebration) {
      this.dragonRoot.visible = true;
      this.dragonPhase = Math.min(1, this.dragonPhase + 0.01);
      const y = 6.4 + (2.95 - 6.4) * this.dragonPhase;
      this.dragonRoot.position.y = y;
      this.dragonRoot.position.x = Math.sin(t * 1.8) * 0.3;
      this.dragonRoot.rotation.y = Math.PI + Math.sin(t * 1.2) * 0.35;

      this.dragonBody.forEach((s, i) => {
        s.position.y = Math.sin(t * 4 + i * 0.55) * 0.18;
        s.position.z = Math.cos(t * 3.2 + i * 0.42) * 0.32;
      });
      if (this.dragonHead) {
        this.dragonHead.rotation.z = Math.sin(t * 6) * 0.12;
      }

      const bg = this.bgNight.clone().lerp(this.bgCelebrate, 0.55 + Math.sin(t * 4) * 0.15);
      this.scene.background = bg;
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.color.copy(bg);
        this.scene.fog.density = 0.028;
      }
      this.renderer.toneMappingExposure = 1.2;
      this.bloomPass.strength = 0.64;
    } else {
      this.renderer.toneMappingExposure = 1.08;
      this.bloomPass.strength = 0.35;
    }

    this.castleRoot.position.y = Math.sin(t * 1.4) * 0.03;
    this.stars.rotation.y = t * 0.012;
    this.camera.position.x = Math.sin(t * 0.25) * 0.28;
    this.camera.position.y = 3.35 + Math.sin(t * 0.42) * 0.08;
    this.camera.lookAt(0, 1.6, -0.15);

    this.composer.render();
    this.rafId = requestAnimationFrame(this.loop);
  };
}

