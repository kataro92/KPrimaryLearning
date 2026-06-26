/** Hero 3D — chợ Thương Nhân ven sông Hồng (procedural Three.js, không cần file model) */
import * as THREE from 'three';
import { FrameLoop } from '@/core/rendering/frameLoop';
import { createGameRenderer } from '@/core/rendering/createGameRenderer';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { playSfx } from '@/features/audio/sfxService';

const COINS_PER_SALE = 10;
const POP_MS = 420;

interface GoodEntry {
  mesh: THREE.Object3D;
  born: number;
}

/** Định nghĩa từng món hàng đặt trên quầy — hình khối + màu truyền thống. */
function buildGood(index: number): THREE.Object3D {
  const kind = index % 6;
  const g = new THREE.Group();
  switch (kind) {
    case 0: {
      // Bao gạo
      const sack = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 10),
        new THREE.MeshStandardMaterial({ color: 0xe7d3a1, roughness: 0.9 })
      );
      sack.scale.set(1, 1.25, 1);
      g.add(sack);
      break;
    }
    case 1: {
      // Lọ gốm
      const jar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.13, 0.26, 14),
        new THREE.MeshStandardMaterial({ color: 0xcf7a4a, roughness: 0.55, metalness: 0.1 })
      );
      jar.position.y = 0.02;
      g.add(jar);
      break;
    }
    case 2: {
      // Dưa hấu
      const melon = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0x3f9b3a, roughness: 0.6 })
      );
      g.add(melon);
      break;
    }
    case 3: {
      // Cá
      const fish = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 12, 10),
        new THREE.MeshStandardMaterial({ color: 0x5cc0e8, roughness: 0.4, metalness: 0.2 })
      );
      fish.scale.set(1.6, 0.9, 0.5);
      g.add(fish);
      break;
    }
    case 4: {
      // Cuộn lụa
      const silk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.26, 16),
        new THREE.MeshStandardMaterial({ color: 0xef9ac0, roughness: 0.5 })
      );
      silk.rotation.z = Math.PI / 2;
      g.add(silk);
      break;
    }
    default: {
      // Nón lá
      const hat = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, 0.2, 18),
        new THREE.MeshStandardMaterial({ color: 0xe7cf8c, roughness: 0.8 })
      );
      hat.position.y = 0.02;
      g.add(hat);
    }
  }
  return g;
}

function stripedAwningTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 32;
  const ctx = c.getContext('2d')!;
  const colors = ['#dc2626', '#fef08a'];
  const stripe = 32;
  for (let x = 0; x < c.width; x += stripe) {
    ctx.fillStyle = colors[(x / stripe) % 2];
    ctx.fillRect(x, 0, stripe, c.height);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function waterTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2;
  for (let y = 12; y < c.height; y += 26) {
    ctx.beginPath();
    for (let x = 0; x <= c.width; x += 8) {
      const yy = y + Math.sin(x * 0.08) * 4;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class MarketScene {
  private readonly mount: HTMLElement;
  private readonly total: number;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly clock = new THREE.Clock();
  private readonly stall = new THREE.Group();
  private readonly boat = new THREE.Group();
  private readonly celebrateLight: THREE.PointLight;
  private readonly waterTex: THREE.CanvasTexture;
  private readonly goods: GoodEntry[] = [];
  private readonly coinValueEl: HTMLElement;

  private sold = 0;
  private coins = 0;
  private frame: FrameLoop | null = null;
  private disposed = false;
  private celebrateUntil = 0;
  private shakeUntil = 0;

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.total = totalQuestions;
    if (getComputedStyle(mount).position === 'static') mount.style.position = 'relative';

    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.scene.fog = new THREE.Fog(0xbbeafe, 7, 16);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    this.camera.position.set(0, 1.75, 4.4);
    this.camera.lookAt(0, 0.7, 0);

    // DPR + antialias theo tầng phần cứng; cảnh này không dùng đổ bóng.
    this.renderer = createGameRenderer({ shadows: false }).renderer;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = 'song-hong-scene-canvas';
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    this.scene.add(new THREE.HemisphereLight(0xfdf6e3, 0x4a7a3a, 0.6));
    const key = new THREE.DirectionalLight(0xfff3d6, 1.1);
    key.position.set(2.5, 4, 3);
    this.scene.add(key);
    this.celebrateLight = new THREE.PointLight(0xfbbf24, 0, 7, 2);
    this.celebrateLight.position.set(0, 1.6, 1.6);
    this.scene.add(this.celebrateLight);

    this.waterTex = waterTexture();
    this.buildWorld();
    this.buildStall();
    this.buildBoat();
    this.buildCoinBadge();
    this.coinValueEl = this.mount.querySelector<HTMLElement>('.song-hong-market__coin-value')!;

    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.frame = new FrameLoop(this.loop, 60);
    this.frame.start();
  }

  private buildWorld(): void {
    // Bãi bờ
    const bank = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 8),
      new THREE.MeshStandardMaterial({ color: 0xcde9a6, roughness: 1 })
    );
    bank.rotation.x = -Math.PI / 2;
    bank.position.set(0, 0, 1.5);
    this.scene.add(bank);
    // Sông
    const river = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 8),
      new THREE.MeshStandardMaterial({ map: this.waterTex, roughness: 0.35, metalness: 0.15 })
    );
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, -0.01, -4);
    this.scene.add(river);
  }

  private buildStall(): void {
    const wood = new THREE.MeshStandardMaterial({ color: 0x9c6b3f, roughness: 0.7 });
    // Quầy hàng
    const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.6), wood);
    counter.position.set(0, 0.25, 0.5);
    this.stall.add(counter);
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.06, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xc89b6a, roughness: 0.6 })
    );
    top.position.set(0, 0.53, 0.5);
    this.stall.add(top);
    // Cột
    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 10);
    for (const x of [-1.15, 1.15]) {
      const post = new THREE.Mesh(postGeo, wood);
      post.position.set(x, 0.75, 0.25);
      this.stall.add(post);
    }
    // Mái che sọc
    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.07, 1.0),
      new THREE.MeshStandardMaterial({ map: stripedAwningTexture(), roughness: 0.7 })
    );
    awning.position.set(0, 1.52, 0.45);
    awning.rotation.x = -0.18;
    this.stall.add(awning);
    this.scene.add(this.stall);
  }

  private buildBoat(): void {
    const hull = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.26, 1.1, 12, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x8a4523, roughness: 0.7 })
    );
    hull.rotation.z = Math.PI / 2;
    hull.rotation.x = Math.PI;
    this.boat.add(hull);
    const sail = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8, side: THREE.DoubleSide })
    );
    sail.position.set(0, 0.45, 0);
    this.boat.add(sail);
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6),
      new THREE.MeshStandardMaterial({ color: 0x5a2c14 })
    );
    mast.position.y = 0.35;
    this.boat.add(mast);
    this.boat.position.set(-5, 0.18, -3.5);
    this.scene.add(this.boat);
  }

  private buildCoinBadge(): void {
    const badge = document.createElement('div');
    badge.className = 'song-hong-market__coins';
    badge.setAttribute('aria-hidden', 'true');
    badge.innerHTML = `
      <svg class="song-hong-market__coin-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#f6c244" stroke="#b7860b" stroke-width="1.5"/><circle cx="12" cy="12" r="5.5" fill="none" stroke="#b7860b" stroke-width="1.2"/><path d="M12 8v8M9 12h6" stroke="#8a5a06" stroke-width="1.2"/></svg>
      <span class="song-hong-market__coin-value">0</span>
      <span class="song-hong-market__coin-unit">xu</span>
    `;
    this.mount.appendChild(badge);
  }

  onCorrectAnswer(): void {
    if (this.sold >= this.total) return;
    const good = buildGood(this.sold);
    const col = this.sold % 6;
    const row = Math.floor(this.sold / 6) % 2;
    good.position.set(-1.0 + col * 0.4, 0.62 + row * 0.02, 0.62 - row * 0.28);
    good.scale.setScalar(0.001);
    this.stall.add(good);
    this.goods.push({ mesh: good, born: performance.now() });
    this.sold++;
    this.addCoins(COINS_PER_SALE);
    this.celebrateUntil = performance.now() + 1200;
  }

  onWrongAnswer(): void {
    this.celebrateUntil = 0;
    this.shakeUntil = performance.now() + 420;
  }

  private addCoins(amount: number): void {
    this.coins += amount;
    this.coinValueEl.textContent = String(this.coins);
    this.coinValueEl.classList.remove('song-hong-market__coin-value--bump');
    void this.coinValueEl.offsetWidth;
    this.coinValueEl.classList.add('song-hong-market__coin-value--bump');
    playSfx('coin');
  }

  /** Tổng tiền lãi đã thu (xu). */
  getProfit(): number {
    return this.coins;
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
    const now = performance.now();
    const t = this.clock.getElapsedTime();

    // Sông trôi + thuyền
    this.waterTex.offset.x = (t * 0.06) % 1;
    this.boat.position.x = ((((t * 0.35 + 5) % 10) + 10) % 10) - 5;
    this.boat.position.y = 0.18 + Math.sin(t * 1.6) * 0.03;
    this.boat.rotation.z = Math.sin(t * 1.6) * 0.05;

    // Lắc nhẹ quầy khi sai
    const shaking = now < this.shakeUntil;
    this.stall.position.x = shaking ? Math.sin(now * 0.05) * 0.06 : 0;

    // Đu đưa nền nhẹ
    this.stall.rotation.y = Math.sin(t * 0.4) * 0.04;

    // Hiệu ứng pop từng món hàng
    for (const entry of this.goods) {
      const p = Math.min(1, (now - entry.born) / POP_MS);
      const e = 1 + 2.2 * Math.pow(1 - p, 2) * (p > 0.0001 ? 1 : 0); // overshoot
      const s = p < 1 ? (1 - Math.pow(1 - p, 3)) * (p < 0.6 ? e : 1) : 1;
      entry.mesh.scale.setScalar(Math.max(0.001, s));
    }

    // Chúc mừng khi bán được hàng
    const celebrating = now < this.celebrateUntil;
    const cT = celebrating ? 1 - (this.celebrateUntil - now) / 1200 : 0;
    this.celebrateLight.intensity = celebrating
      ? 2.2 * (0.7 + Math.sin(t * 12) * 0.3) * (1 - cT * 0.5)
      : THREE.MathUtils.lerp(this.celebrateLight.intensity, 0, 0.15);

    this.renderer.render(this.scene, this.camera);
  };

  dispose(): void {
    this.disposed = true;
    this.frame?.dispose();
    window.removeEventListener('resize', this.onResize);
    disposeObject3D(this.scene);
    this.waterTex.dispose();
    this.renderer.dispose();
    this.mount.innerHTML = '';
  }
}
