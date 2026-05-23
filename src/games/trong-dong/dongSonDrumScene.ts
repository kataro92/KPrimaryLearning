import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { loadGltfModel } from '@/core/assets/loadGltfModel';

const BASE = import.meta.env.BASE_URL;
const MODEL_URLS = [`${BASE}models/trong-dong/dong-son-drum.glb`, `${BASE}models/trong-dong/scene.gltf`];

interface GlowMaterial {
  mat: THREE.MeshStandardMaterial;
  emissive: THREE.Color;
  intensity: number;
}

/** Hero 3D — trống Đồng (Sketchfab glTF) với fallback procedural khi chưa có file. */
export class DongSonDrumScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly pivot = new THREE.Group();
  private readonly platform: THREE.Mesh;
  private readonly clock = new THREE.Clock();
  private readonly rim = new THREE.DirectionalLight(0xffe8b8, 0.9);
  private readonly key = new THREE.DirectionalLight(0xfff5e0, 1.2);
  private readonly celebrateLight: THREE.PointLight;
  private readonly bgCelebrate = new THREE.Color(0x5c3010);
  private readonly bgColor: THREE.Color;
  private readonly bgNormal = new THREE.Color(0x1a1208);
  private readonly fogNormal = 0x1a1208;
  private readonly fogCelebrate = 0x3d1a08;
  private readonly glowMaterials: GlowMaterial[] = [];
  private rafId = 0;
  private disposed = false;
  private celebrateUntil = 0;
  private faceTargetY = 0;
  private spinY = 0;
  private loadFailed = false;

  constructor(mount: HTMLElement) {
    this.mount = mount;
    const bg = this.fogNormal;
    this.bgColor = this.bgNormal.clone();
    this.scene = new THREE.Scene();
    this.scene.background = this.bgColor;
    this.scene.fog = new THREE.FogExp2(bg, 0.045);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    this.camera.position.set(0, 1.05, 2.85);
    this.camera.lookAt(0, 0.55, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.renderer.domElement.className = 'dong-son-drum-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xfff0d4, 0.55));
    this.scene.add(new THREE.HemisphereLight(0xfff8eb, 0x3d2810, 0.5));
    this.key.position.set(2.2, 3.5, 2.8);
    this.scene.add(this.key);
    this.rim.position.set(-2.8, 2.2, -1.6);
    this.scene.add(this.rim);
    this.celebrateLight = new THREE.PointLight(0xfbbf24, 0, 6, 2.2);
    this.celebrateLight.position.set(0, 1.1, 1.4);
    this.scene.add(this.celebrateLight);

    this.platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.12, 0.1, 32),
      new THREE.MeshStandardMaterial({
        color: 0x4a3728,
        roughness: 0.82,
        metalness: 0.08,
      })
    );
    this.platform.position.y = -0.05;
    this.scene.add(this.platform);

    this.pivot.position.y = 0.42;
    this.scene.add(this.pivot);

    void this.loadModel();
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  /** Hiệu ứng chúc mừng khi trả lời đúng. */
  celebrate(): void {
    this.celebrateUntil = performance.now() + 1400;
    const twoPi = Math.PI * 2;
    this.faceTargetY = Math.round(this.spinY / twoPi) * twoPi;
    this.captureGlowMaterials();
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.clearPivot();
    this.glowMaterials.length = 0;
    this.mount.innerHTML = '';
    this.renderer.dispose();
    this.platform.geometry.dispose();
    (this.platform.material as THREE.Material).dispose();
  }

  private async loadModel(): Promise<void> {
    let lastError: unknown;
    for (const url of MODEL_URLS) {
      try {
        const gltf = await loadGltfModel(url);
        if (this.disposed) return;
        this.clearPivot();
        const model = gltf.scene;
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = false;
            node.receiveShadow = false;
          }
        });
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scale = 1.35 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y += 0.08;
        this.pivot.add(model);
        this.glowMaterials.length = 0;
        return;
      } catch (err) {
        lastError = err;
      }
    }
    if (this.disposed) return;
    console.warn('Dong Son drum glTF unavailable, using procedural fallback.', lastError);
    this.loadFailed = true;
    this.clearPivot();
    this.pivot.add(this.buildFallbackDrum());
    this.glowMaterials.length = 0;
  }

  private buildFallbackDrum(): THREE.Group {
    const root = new THREE.Group();
    const bronze = new THREE.MeshStandardMaterial({
      color: 0xb8860b,
      roughness: 0.42,
      metalness: 0.72,
      emissive: 0x3d2810,
      emissiveIntensity: 0.12,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.55,
      metalness: 0.5,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.38, 40), bronze);
    body.position.y = 0.2;
    root.add(body);

    const rimGeo = new THREE.TorusGeometry(0.76, 0.045, 12, 48);
    const topRim = new THREE.Mesh(rimGeo, dark);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.y = 0.38;
    root.add(topRim);
    const bottomRim = topRim.clone();
    bottomRim.position.y = 0.02;
    root.add(bottomRim);

    const face = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), dark);
    face.rotation.x = -Math.PI / 2;
    face.position.y = 0.395;
    root.add(face);

    const star = new THREE.Mesh(
      new THREE.RingGeometry(0.08, 0.2, 5, 1),
      new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.35, metalness: 0.8 })
    );
    star.rotation.x = -Math.PI / 2;
    star.position.y = 0.4;
    root.add(star);

    return root;
  }

  private captureGlowMaterials(): void {
    if (this.glowMaterials.length > 0) return;
    this.pivot.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      for (const raw of mats) {
        if (raw instanceof THREE.MeshStandardMaterial) {
          this.glowMaterials.push({
            mat: raw,
            emissive: raw.emissive.clone(),
            intensity: raw.emissiveIntensity,
          });
        }
      }
    });
  }

  private setPatternGlow(strength: number): void {
    for (const { mat, emissive, intensity } of this.glowMaterials) {
      mat.emissive.copy(emissive);
      mat.emissive.lerp(new THREE.Color(0xfbbf24), strength);
      mat.emissiveIntensity = intensity + strength * 0.55;
    }
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
    const delta = this.clock.getDelta();
    const t = this.clock.getElapsedTime();
    const celebrating = performance.now() < this.celebrateUntil;
    const celebrateT = celebrating
      ? 1 - (this.celebrateUntil - performance.now()) / 1400
      : 0;
    const glowPulse = celebrating ? 0.55 + Math.sin(t * 14) * 0.35 : 0;

    if (celebrating) {
      this.spinY = THREE.MathUtils.lerp(this.spinY, this.faceTargetY, Math.min(1, delta * 5.5));
      this.pivot.rotation.y = this.spinY;
      const bob = Math.sin(t * 3.4) * 0.05 + 0.03;
      this.pivot.position.y = 0.42 + bob;
      this.setPatternGlow(Math.min(1, celebrateT * 1.2) * (0.65 + glowPulse * 0.35));
      this.bgColor.lerpColors(this.bgNormal, this.bgCelebrate, Math.min(1, celebrateT * 1.1));
      const fog = this.scene.fog as THREE.FogExp2;
      fog.color.set(this.fogNormal).lerp(new THREE.Color(this.fogCelebrate), Math.min(1, celebrateT));
      this.key.intensity = 1.2 + celebrateT * 0.85;
      this.rim.intensity = 0.9 + celebrateT * 0.65;
      this.celebrateLight.intensity = celebrateT * 2.4 * (0.85 + Math.sin(t * 10) * 0.15);
      this.renderer.toneMappingExposure = 1.22 + celebrateT * 0.35;
    } else {
      this.spinY += delta * (this.loadFailed ? 0.45 : 0.55);
      this.pivot.rotation.y = this.spinY;
      const bob = Math.sin(t * 2.2) * 0.02;
      this.pivot.position.y = 0.42 + bob;
      if (this.glowMaterials.length > 0) {
        this.setPatternGlow(0);
      }
      this.bgColor.lerp(this.bgNormal, 0.08);
      const fog = this.scene.fog as THREE.FogExp2;
      fog.color.lerp(new THREE.Color(this.fogNormal), 0.08);
      this.key.intensity = THREE.MathUtils.lerp(this.key.intensity, 1.2, 0.08);
      this.rim.intensity = THREE.MathUtils.lerp(this.rim.intensity, 0.9, 0.08);
      this.celebrateLight.intensity = THREE.MathUtils.lerp(this.celebrateLight.intensity, 0, 0.12);
      this.renderer.toneMappingExposure = THREE.MathUtils.lerp(this.renderer.toneMappingExposure, 1.22, 0.08);
    }

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.loop);
  };
}
