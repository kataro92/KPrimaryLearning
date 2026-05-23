import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { fitModelToHeight, tryLoadGltfScene } from '@/core/assets/fitGltfModel';

const BASE = import.meta.env.BASE_URL;
const TURTLE_MODEL_URLS = [
  `${BASE}models/cuu-chuong-van-mieu/turtle.glb`,
  `${BASE}models/cuu-chuong-van-mieu/scene.gltf`,
] as const;

/** Hero 3D — rùa Văn Miếu tiến dần khi trả lời đúng. */
export class VanMieuTurtleScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly pivot = new THREE.Group();
  private readonly path = new THREE.Group();
  private readonly platform: THREE.Mesh;
  private readonly clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;
  private progress = 0;
  private targetProgress = 0;
  private hopUntil = 0;
  private loadFailed = false;

  constructor(mount: HTMLElement, totalSteps: number) {
    this.mount = mount;
    void totalSteps;

    const bg = 0x0f1a12;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bg);
    this.scene.fog = new THREE.FogExp2(bg, 0.042);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 40);
    this.camera.position.set(0, 1.35, 3.4);
    this.camera.lookAt(0, 0.45, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.domElement.className = 'van-mieu-turtle-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xe8ffe8, 0.5));
    this.scene.add(new THREE.HemisphereLight(0xfff8eb, 0x14532d, 0.55));
    const key = new THREE.DirectionalLight(0xfff5dc, 1.15);
    key.position.set(2.5, 4, 2.8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0004;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xfbbf24, 0.55);
    rim.position.set(-3, 2, -2);
    this.scene.add(rim);

    this.platform = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.12, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.78, metalness: 0.1 })
    );
    this.platform.position.y = -0.06;
    this.scene.add(this.platform);

    const stele = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 1.1, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.65, metalness: 0.08 })
    );
    stele.position.set(1.35, 0.55, -0.15);
    this.scene.add(stele);

    this.path.position.y = 0.08;
    this.pivot.position.y = 0.35;
    this.path.add(this.pivot);
    this.scene.add(this.path);

    void this.loadModel();
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  /** Cập nhật vị trí rùa theo số câu đúng (0…total). */
  setProgress(step: number, total: number): void {
    const t = Math.max(0, Math.min(step, total));
    this.targetProgress = total > 0 ? t / total : 0;
    this.hopUntil = performance.now() + 520;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.clearPivot();
    this.mount.innerHTML = '';
    this.renderer.dispose();
    this.platform.geometry.dispose();
    (this.platform.material as THREE.Material).dispose();
  }

  private async loadModel(): Promise<void> {
    const scene = await tryLoadGltfScene(TURTLE_MODEL_URLS);
    if (this.disposed) return;
    this.clearPivot();
    if (scene) {
      this.styleTurtleMaterials(scene);
      fitModelToHeight(scene, 0.55);
      scene.rotation.y = -Math.PI / 2;
      this.pivot.add(scene);
      return;
    }
    this.loadFailed = true;
    this.pivot.add(this.buildFallbackTurtle());
  }

  private styleTurtleMaterials(root: THREE.Object3D): void {
    const shellTint = new THREE.Color(0x7dd3a8);
    root.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = true;
      node.receiveShadow = true;

      const rawMats = Array.isArray(node.material) ? node.material : [node.material];
      const nextMats = rawMats.map((raw) => {
        let mat = raw;
        if (!(mat instanceof THREE.MeshStandardMaterial)) {
          if (mat instanceof THREE.MeshPhysicalMaterial) {
            mat.metalness = Math.min(mat.metalness, 0.25);
            return mat;
          }
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

        const label = `${mat.name} ${node.name}`.toLowerCase();
        const isEye = label.includes('eye');
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
          mat.color.setHex(0xffffff);
          if (!isEye) mat.color.multiply(shellTint);
        } else if (!isEye) {
          mat.color.set(0x3f8f5c);
        }
        if (mat.normalMap) mat.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
        if (mat.metalnessMap) mat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
        if (mat.roughnessMap) mat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
        if (!isEye) {
          mat.metalness = Math.min(mat.metalness, 0.18);
          mat.roughness = Math.max(mat.roughness, 0.52);
        }
        mat.needsUpdate = true;
        return mat;
      });
      node.material = nextMats.length === 1 ? nextMats[0]! : nextMats;
    });
  }

  private buildFallbackTurtle(): THREE.Group {
    const root = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.55, metalness: 0.12 })
    );
    shell.scale.set(1.1, 0.75, 1.25);
    shell.position.y = 0.12;
    root.add(shell);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5, metalness: 0.08 })
    );
    head.position.set(0.32, 0.1, 0);
    root.add(head);
    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.06, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6, metalness: 0.05 })
      );
      leg.position.set(0.05, 0.02, side * 0.22);
      root.add(leg);
    }
    return root;
  }

  private clearPivot(): void {
    const toRemove = [...this.pivot.children];
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
    this.progress += (this.targetProgress - this.progress) * 0.08;
    const x = -1.15 + this.progress * 2.3;
    this.path.position.x = x;
    const hopping = performance.now() < this.hopUntil;
    this.pivot.position.y = 0.35 + (hopping ? Math.abs(Math.sin(t * 16)) * 0.12 : Math.sin(t * 2) * 0.02);
    this.pivot.rotation.z = hopping ? Math.sin(t * 20) * 0.06 : 0;
    if (this.loadFailed) {
      this.pivot.rotation.y = Math.sin(t * 0.8) * 0.15;
    }
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.loop);
  };
}
