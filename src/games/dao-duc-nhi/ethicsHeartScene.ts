import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';

function buildHeartShape(): THREE.Shape {
  const s = new THREE.Shape();
  const x = 0;
  const y = 0;
  s.moveTo(x + 0.5, y + 0.5);
  s.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
  s.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
  s.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
  s.bezierCurveTo(x + 1.2, y + 1.54, x + 1.5, y + 1.1, x + 1.5, y + 0.7);
  s.bezierCurveTo(x + 1.5, y + 0.7, x + 1.5, y, x + 1, y);
  s.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
  return s;
}

/** Trái tim hồng 3D — đập khi đúng, cánh + nhảy khi hoàn thành. */
export class EthicsHeartScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly mount: HTMLElement;
  private readonly root = new THREE.Group();
  private readonly heartMesh: THREE.Mesh;
  private readonly heartMat: THREE.MeshStandardMaterial;
  private readonly wings = new THREE.Group();
  private readonly leftWing: THREE.Mesh;
  private readonly rightWing: THREE.Mesh;
  private readonly sparkles: THREE.Points;
  private readonly clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;

  private growth = 1;
  private targetGrowth = 1;
  private beatUntil = 0;
  private beatStrength = 0;
  private dancing = false;
  private danceStart = 0;
  private wrongShake = 0;

  constructor(mount: HTMLElement) {
    this.mount = mount;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfff1f5);
    this.scene.fog = new THREE.Fog(0xfff1f5, 4, 14);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
    this.camera.position.set(0, 0.35, 3.4);
    this.camera.lookAt(0, 0.2, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.domElement.className = 'dao-duc-heart-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    this.scene.add(new THREE.HemisphereLight(0xffe4ec, 0xf9a8d4, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2, 4, 3);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xfbcfe8, 0.75);
    rim.position.set(-2.5, 1.5, -2);
    this.scene.add(rim);

    const heartGeo = new THREE.ExtrudeGeometry(buildHeartShape(), {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 3,
      curveSegments: 24,
    });
    heartGeo.center();
    heartGeo.rotateZ(Math.PI);
    heartGeo.scale(0.55, 0.55, 0.55);

    this.heartMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xec4899,
      emissiveIntensity: 0.35,
      roughness: 0.38,
      metalness: 0.05,
    });
    this.heartMesh = new THREE.Mesh(heartGeo, this.heartMat);
    this.root.add(this.heartMesh);

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.35, 0.15, 0.7, 0);
    wingShape.quadraticCurveTo(0.35, -0.08, 0, -0.05);
    wingShape.quadraticCurveTo(-0.2, 0.02, 0, 0);
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.04,
      bevelEnabled: false,
    });
    wingGeo.center();
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xfce7f3,
      emissive: 0xf9a8d4,
      emissiveIntensity: 0.25,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    this.leftWing = new THREE.Mesh(wingGeo, wingMat);
    this.rightWing = new THREE.Mesh(wingGeo, wingMat.clone());
    this.leftWing.position.set(-0.62, 0.08, -0.05);
    this.leftWing.rotation.z = 0.35;
    this.leftWing.scale.set(1.1, 1.1, 1);
    this.rightWing.position.set(0.62, 0.08, -0.05);
    this.rightWing.rotation.z = -0.35;
    this.rightWing.scale.set(-1.1, 1.1, 1);
    this.wings.add(this.leftWing, this.rightWing);
    this.wings.visible = false;
    this.root.add(this.wings);

    const sparkleGeo = new THREE.BufferGeometry();
    const pts = new Float32Array(36 * 3);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const r = 0.9 + Math.random() * 0.5;
      pts[i * 3] = Math.cos(a) * r;
      pts[i * 3 + 1] = Math.sin(a) * r * 0.8 + 0.2;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    this.sparkles = new THREE.Points(
      sparkleGeo,
      new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.06,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    this.root.add(this.sparkles);

    this.root.position.y = -0.15;
    this.scene.add(this.root);

    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  /** Mỗi câu đúng — tim đập và to dần. */
  onCorrectAnswer(correctCount: number, total: number): void {
    this.beatUntil = performance.now() + 520;
    this.beatStrength = 1;
    const t = total > 0 ? correctCount / total : 0;
    this.targetGrowth = 1 + t * 0.42;
  }

  onWrongAnswer(): void {
    this.wrongShake = performance.now() + 280;
  }

  /** Đủ câu — mọc cánh và nhảy múa. */
  celebrateComplete(): void {
    this.dancing = true;
    this.danceStart = performance.now();
    this.wings.visible = true;
    const mat = this.sparkles.material as THREE.PointsMaterial;
    mat.opacity = 0.85;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    window.removeEventListener('resize', this.onResize);
    disposeObject3D(this.root);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private readonly onResize = (): void => {
    const w = Math.max(this.mount.clientWidth, 1);
    const h = Math.max(this.mount.clientHeight, 1);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  private loop = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);
    const t = this.clock.getElapsedTime();
    const now = performance.now();

    this.growth += (this.targetGrowth - this.growth) * 0.08;

    let pulse = 1 + Math.sin(t * 2.4) * 0.025;
    if (now < this.beatUntil) {
      const u = 1 - (now - (this.beatUntil - 520)) / 520;
      const beat = Math.sin(u * Math.PI);
      pulse = 1 + beat * 0.14 * this.beatStrength;
      this.heartMat.emissiveIntensity = 0.35 + beat * 0.55;
    } else {
      this.heartMat.emissiveIntensity = 0.32 + Math.sin(t * 3) * 0.06;
      this.beatStrength *= 0.9;
    }

    if (now < this.wrongShake) {
      this.root.rotation.z = Math.sin((this.wrongShake - now) * 0.08) * 0.12;
    } else {
      this.root.rotation.z *= 0.85;
    }

    const s = this.growth * pulse;
    this.heartMesh.scale.set(s, s, s);

    if (this.dancing) {
      const danceT = (now - this.danceStart) / 1000;
      this.root.position.y = -0.15 + Math.abs(Math.sin(danceT * 5.5)) * 0.22;
      this.root.rotation.y = Math.sin(danceT * 2.2) * 0.35;
      const flap = Math.sin(danceT * 8) * 0.45;
      this.leftWing.rotation.z = 0.35 + flap;
      this.rightWing.rotation.z = -0.35 - flap;
      this.sparkles.rotation.y = danceT * 0.6;
      const sm = this.sparkles.material as THREE.PointsMaterial;
      sm.opacity = 0.55 + Math.sin(danceT * 4) * 0.25;
    } else {
      this.root.rotation.y = Math.sin(t * 0.5) * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  };
}
