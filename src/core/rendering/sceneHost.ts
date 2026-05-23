import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { buildThemeDecor, GAME_THEMES } from './gameThemes';

/** Canvas Three.js nền (2.5D) — đổi theme theo từng game */
export class SceneHost {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.OrthographicCamera;
  private rafId = 0;
  private disposed = false;
  private themeGroup = new THREE.Group();
  private overlayGroup = new THREE.Group();
  private currentThemeId = 'default';
  private parallaxSway = true;

  constructor(container: HTMLElement) {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'scene-canvas';
    container.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf4f1fa);

    const aspect = w / h;
    const frustum = 5;
    this.camera = new THREE.OrthographicCamera(
      (-frustum * aspect) / 2,
      (frustum * aspect) / 2,
      frustum / 2,
      -frustum / 2,
      0.1,
      100
    );
    this.camera.position.z = 10;

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);
    this.scene.add(this.themeGroup);
    this.scene.add(this.overlayGroup);

    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  setGameTheme(gameId: string): void {
    if (this.currentThemeId === gameId) return;
    this.currentThemeId = gameId;
    const theme = GAME_THEMES[gameId];
    if (theme) {
      this.scene.background = new THREE.Color(theme.background);
    }
    while (this.themeGroup.children.length > 0) {
      const child = this.themeGroup.children[0];
      this.themeGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        const mat = child.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    }
    for (const obj of buildThemeDecor(gameId)) {
      this.themeGroup.add(obj);
    }
  }

  resetTheme(): void {
    this.currentThemeId = 'default';
    this.parallaxSway = true;
    this.scene.background = new THREE.Color(0xf4f1fa);
    this.clearOverlay();
    while (this.themeGroup.children.length > 0) {
      this.themeGroup.remove(this.themeGroup.children[0]);
    }
  }

  /** Bật/tắt lắc nhẹ nền (game runner 2.5D thường tắt) */
  setParallaxSway(enabled: boolean): void {
    this.parallaxSway = enabled;
    if (!enabled) {
      this.themeGroup.rotation.y = 0;
      this.overlayGroup.rotation.y = 0;
    }
  }

  addToOverlay(obj: THREE.Object3D): void {
    this.overlayGroup.add(obj);
  }

  clearOverlay(): void {
    while (this.overlayGroup.children.length > 0) {
      const child = this.overlayGroup.children[0];
      this.overlayGroup.remove(child);
      disposeObject3D(child);
    }
  }

  private onResize = (): void => {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const aspect = w / h;
    const frustum = 5;
    this.camera.left = (-frustum * aspect) / 2;
    this.camera.right = (frustum * aspect) / 2;
    this.camera.top = frustum / 2;
    this.camera.bottom = -frustum / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  private loop = (): void => {
    if (this.disposed) return;
    if (this.parallaxSway) {
      const sway = Math.sin(Date.now() * 0.0004) * 0.08;
      this.themeGroup.rotation.y = sway;
      this.overlayGroup.rotation.y = sway * 0.5;
    }
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.loop);
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.resetTheme();
    this.renderer.dispose();
    this.canvas.remove();
  }
}
