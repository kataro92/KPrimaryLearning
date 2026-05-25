import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { fitModelToHeight, tryLoadGltfScene } from '@/core/assets/fitGltfModel';

const BASE = import.meta.env.BASE_URL;
const PEN_MODEL_URLS = [
  `${BASE}models/but-sen-viet/pen.glb`,
  `${BASE}models/but-sen-viet/scene.gltf`,
] as const;

/** Hero 3D — bút (Sketchfab CC BY) + fallback procedural; phản hồi khi gõ đúng/sai. */
export class ButSenPenScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly pivot = new THREE.Group();
  private readonly inkDrip: THREE.Mesh;
  private readonly lotusRing: THREE.Group;
  private readonly clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;
  private loadFailed = false;

  private progress = 0;
  private targetProgress = 0;
  private pulseUntil = 0;
  private shakeUntil = 0;
  private celebrateUntil = 0;

  constructor(mount: HTMLElement) {
    this.mount = mount;
    const bg = 0xfff7ed;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bg);
    this.scene.fog = new THREE.Fog(bg, 5, 16);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    this.camera.position.set(0.15, 0.55, 2.85);
    this.camera.lookAt(0, 0.35, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = 'but-sen-pen-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xfff5eb, 0.62));
    this.scene.add(new THREE.HemisphereLight(0xfffbeb, 0xfde68a, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(2.2, 4, 2.5);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xfbcfe8, 0.55);
    rim.position.set(-2.5, 1.2, -1.8);
    this.scene.add(rim);

    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.1, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.82, metalness: 0.04 })
    );
    desk.position.y = -0.05;
    this.scene.add(desk);

    this.pivot.position.set(0, 0.42, 0);
    this.scene.add(this.pivot);

    const inkMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    this.inkDrip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), inkMat);
    this.inkDrip.scale.set(0.2, 0.2, 0.2);
    this.inkDrip.position.set(0.02, -0.42, 0.08);
    this.pivot.add(this.inkDrip);

    this.lotusRing = this.buildLotusRing();
    this.lotusRing.visible = false;
    this.pivot.add(this.lotusRing);

    void this.loadModel();
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  /** Tiến độ câu đúng (0…total) — mực và sen nở dần. */
  setProgress(step: number, total: number): void {
    const t = Math.max(0, Math.min(step, total));
    this.targetProgress = total > 0 ? t / total : 0;
    if (t > 0) this.pulseUntil = performance.now() + 480;
  }

  onCorrect(): void {
    this.pulseUntil = performance.now() + 520;
  }

  onWrong(): void {
    this.shakeUntil = performance.now() + 380;
  }

  celebrateComplete(): void {
    this.celebrateUntil = performance.now() + 4200;
    this.lotusRing.visible = true;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.clearPivot();
    this.mount.innerHTML = '';
    this.renderer.dispose();
    this.inkDrip.geometry.dispose();
    (this.inkDrip.material as THREE.Material).dispose();
    disposeObject3D(this.lotusRing);
  }

  private async loadModel(): Promise<void> {
    const scene = await tryLoadGltfScene(PEN_MODEL_URLS);
    if (this.disposed) return;
    this.clearPivot();
    if (scene) {
      this.stylePenMaterials(scene);
      fitModelToHeight(scene, 1.05, 0.02);
      scene.rotation.y = Math.PI / 6;
      this.pivot.add(scene);
      this.pivot.add(this.inkDrip);
      this.pivot.add(this.lotusRing);
      return;
    }
    console.warn('Bút Sen pen glTF unavailable, using procedural fallback.');
    this.loadFailed = true;
    const pen = this.buildFallbackPen();
    pen.rotation.z = -0.22;
    this.pivot.add(pen);
    this.pivot.add(this.inkDrip);
    this.pivot.add(this.lotusRing);
  }

  private stylePenMaterials(root: THREE.Object3D): void {
    const warm = new THREE.Color(0xfef3c7);
    root.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const rawMats = Array.isArray(node.material) ? node.material : [node.material];
      const nextMats = rawMats.map((raw) => {
        let mat = raw;
        if (!(mat instanceof THREE.MeshStandardMaterial)) {
          if (mat instanceof THREE.MeshBasicMaterial || mat instanceof THREE.MeshLambertMaterial) {
            const std = new THREE.MeshStandardMaterial({
              map: mat.map,
              color: mat.color,
              transparent: mat.transparent,
              opacity: mat.opacity,
              side: mat.side,
              name: mat.name,
            });
            mat.dispose();
            mat = std;
          } else {
            return mat;
          }
        }
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.color.setHex(0xffffff);
          mat.color.multiply(warm);
        }
        mat.metalness = Math.min(mat.metalness, 0.35);
        mat.roughness = Math.max(mat.roughness, 0.42);
        mat.needsUpdate = true;
        return mat;
      });
      node.material = nextMats.length === 1 ? nextMats[0]! : nextMats;
    });
  }

  private buildFallbackPen(): THREE.Group {
    const root = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.48,
      metalness: 0.12,
    });
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.4,
      metalness: 0.18,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.28,
      metalness: 0.72,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.15,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.72, 20), bodyMat);
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.05;
    root.add(body);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.22, 18), capMat);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(-0.42, 0.06, 0);
    root.add(cap);

    const band = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.012, 8, 24), goldMat);
    band.rotation.y = Math.PI / 2;
    band.position.set(-0.28, 0.06, 0);
    root.add(band);

    const nib = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 16), goldMat);
    nib.rotation.z = -Math.PI / 2;
    nib.position.set(0.4, 0.04, 0);
    root.add(nib);

    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.18, 20), capMat);
    grip.rotation.z = Math.PI / 2;
    grip.position.set(0.08, 0.06, 0);
    root.add(grip);

    return root;
  }

  private buildLotusRing(): THREE.Group {
    const ring = new THREE.Group();
    ring.position.y = -0.38;
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf9a8d4,
      emissive: 0xec4899,
      emissiveIntensity: 0.2,
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const count = 8;
    for (let i = 0; i < count; i++) {
      const petal = new THREE.Mesh(new THREE.CircleGeometry(0.14, 12, 0, Math.PI * 0.55), petalMat);
      const a = (i / count) * Math.PI * 2;
      petal.position.set(Math.cos(a) * 0.2, 0.02, Math.sin(a) * 0.2);
      petal.rotation.y = -a + Math.PI / 2;
      petal.rotation.x = -0.55;
      ring.add(petal);
    }
    const center = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.05, 12),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.45, metalness: 0.1 })
    );
    center.position.y = 0.04;
    ring.add(center);
    return ring;
  }

  private clearPivot(): void {
    const keep = new Set<THREE.Object3D>([this.inkDrip, this.lotusRing]);
    const toRemove = this.pivot.children.filter((c) => !keep.has(c));
    for (const child of toRemove) {
      this.pivot.remove(child);
      disposeObject3D(child);
    }
  }

  private onResize = (): void => {
    const w = Math.max(180, this.mount.clientWidth);
    const h = Math.max(160, this.mount.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  private loop = (): void => {
    if (this.disposed) return;
    const t = this.clock.getElapsedTime();
    const now = performance.now();

    this.progress += (this.targetProgress - this.progress) * 0.1;
    const inkScale = 0.15 + this.progress * 0.85;
    this.inkDrip.scale.set(inkScale, inkScale * 1.2, inkScale);

    const pulsing = now < this.pulseUntil;
    const shaking = now < this.shakeUntil;
    const celebrating = now < this.celebrateUntil;

    let scale = 1;
    if (pulsing) scale = 1 + Math.sin(t * 22) * 0.06;
    if (celebrating) scale = 1.08 + Math.sin(t * 5) * 0.04;
    this.pivot.scale.setScalar(scale);

    this.pivot.rotation.y = celebrating
      ? t * 2.2
      : Math.sin(t * 0.55) * 0.12 + (this.loadFailed ? Math.sin(t * 0.7) * 0.08 : 0);
    this.pivot.rotation.z = shaking ? Math.sin(t * 28) * 0.08 : -0.08 + Math.sin(t * 1.2) * 0.03;
    this.pivot.position.y = 0.42 + (pulsing ? Math.abs(Math.sin(t * 18)) * 0.05 : Math.sin(t * 2) * 0.015);

    if (celebrating) {
      this.lotusRing.rotation.y = t * 1.4;
      this.lotusRing.position.y = -0.38 + Math.sin(t * 4) * 0.04;
    }

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.loop);
  };
}
