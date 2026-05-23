import * as THREE from 'three';
import type { ObjectShape } from './objectBank';
import { buildObjectProp, disposeObjectProp } from './props/builders';
import { applyObjectSkins } from './props/skinApplier';
import { preloadPropTextures } from './props/textureLibrary';

/** Góc xoay ban đầu để mặt đặc trưng (vuông / chữ nhật / tam giác) hướng về camera. */
const SHAPE_YAW: Record<ObjectShape, number> = {
  square: Math.PI / 4,
  rect: 0,
  triangle: -Math.PI / 2,
};

/** Minh họa 3D riêng cho từng đồ vật (100 mẫu) — cột trái. */
export class ShapePreviewScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly pivot = new THREE.Group();
  private readonly platform: THREE.Mesh;
  private readonly clock = new THREE.Clock();
  private readonly rim = new THREE.DirectionalLight(0xfff0cc, 0.85);
  private readonly propLight = new THREE.PointLight(0xfff5e6, 1.25, 9);
  private readonly fillFront = new THREE.DirectionalLight(0xc4ddff, 0.55);
  private rafId = 0;
  private disposed = false;
  private currentObjectId = '';
  private spinOffsetY = 0;

  constructor(mount: HTMLElement) {
    this.mount = mount;
    this.scene = new THREE.Scene();
    const bg = 0x121c33;
    this.scene.background = new THREE.Color(bg);
    this.scene.fog = new THREE.FogExp2(bg, 0.038);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 40);
    this.camera.position.set(0, 1.45, 3.25);
    this.camera.lookAt(0, 0.82, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.renderer.domElement.className = 'shape-preview-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xf0f6ff, 0.72));
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x5b6b88, 0.62));
    const key = new THREE.DirectionalLight(0xfff8eb, 1.35);
    key.position.set(2.8, 4.2, 3.2);
    this.scene.add(key);
    this.rim.position.set(-3.5, 2.5, -2.2);
    this.scene.add(this.rim);
    this.fillFront.position.set(0, 1.5, 4);
    this.scene.add(this.fillFront);

    this.propLight.position.set(0.4, 1.1, 1.6);
    this.pivot.add(this.propLight);

    this.platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.55, 0.14, 36),
      new THREE.MeshStandardMaterial({
        color: 0x3d4f6a,
        emissive: 0x1e3a5f,
        emissiveIntensity: 0.35,
        roughness: 0.75,
        metalness: 0.12,
      })
    );
    this.platform.position.y = -0.08;
    this.scene.add(this.platform);

    this.pivot.position.y = 0.78;
    this.scene.add(this.pivot);

    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.setObject('o001', 'square');
    void preloadPropTextures().then(() => {
      if (!this.disposed) this.refreshCurrentSkins();
    });
    this.loop();
  }

  setObject(objectId: string, shape: ObjectShape): void {
    if (this.disposed) return;
    if (objectId === this.currentObjectId && this.hasPropMesh()) return;
    this.currentObjectId = objectId;
    this.spinOffsetY = SHAPE_YAW[shape];
    this.clearPivot();
    const prop = buildObjectProp(objectId);
    prop.rotation.y = this.spinOffsetY;
    this.pivot.add(prop);
    this.rim.intensity = 0.75 + (objectId.charCodeAt(1) % 5) * 0.05;
    this.propLight.intensity = 1.15 + (objectId.charCodeAt(2) % 4) * 0.08;
  }

  private refreshCurrentSkins(): void {
    const prop = this.pivot.children.find((c): c is THREE.Group => c instanceof THREE.Group);
    if (prop && this.currentObjectId) applyObjectSkins(prop, this.currentObjectId);
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

  private hasPropMesh(): boolean {
    return this.pivot.children.some((c) => c instanceof THREE.Group);
  }

  private clearPivot(): void {
    const toRemove = [...this.pivot.children];
    for (const child of toRemove) {
      if (child === this.propLight) continue;
      this.pivot.remove(child);
      if (child instanceof THREE.Group) disposeObjectProp(child);
    }
  }

  private onResize = (): void => {
    const w = Math.max(180, this.mount.clientWidth);
    const h = Math.max(140, this.mount.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  private loop = (): void => {
    if (this.disposed) return;
    const t = this.clock.getElapsedTime();
    this.pivot.rotation.y = this.spinOffsetY + t * 0.72;
    this.pivot.position.y = 0.78 + Math.sin(t * 2) * 0.035;
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.loop);
  };
}
