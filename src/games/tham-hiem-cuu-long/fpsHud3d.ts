import * as THREE from 'three';

type FeedbackKind = 'ok' | 'bad' | 'neutral';

interface TextPlate {
  group: THREE.Group;
  mesh: THREE.Mesh;
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  frame?: THREE.Mesh;
}

/** Căn HUD theo hàng 3 mục tiêu (x ±2.9, y 2, z -8.2). */
const TARGET_ROW_Y = 2.0;
const TARGET_ROW_Z = -8.2;
const TARGET_SPAN_X = 5.8;
const HUD_Z = TARGET_ROW_Z + 0.12;

const STATUS_Y = TARGET_ROW_Y + 2.65;
const QUESTION_Y = TARGET_ROW_Y - 2.28;
const FEEDBACK_Y = TARGET_ROW_Y - 3.12;
const FEEDBACK_Z = TARGET_ROW_Z + 1.65;

const QUESTION_PLATE_W = TARGET_SPAN_X + 1.15;
/** Tấm cao hơn để chữ câu hỏi đọc rõ; canvas khớp tỉ lệ w/h tránh bẹt chữ. */
const QUESTION_PLATE_H = 2.0;

function canvasHeightForPlate(cw: number, pw: number, ph: number): number {
  return Math.round(cw * (ph / pw));
}
const TIMER_BAR_W = TARGET_SPAN_X * 0.78;
const TIMER_BAR_H = 0.12;
const DOT_SIZE = 0.14;
const DOT_SPACING = 0.22;

function drawTallCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  scaleY: number
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, scaleY);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length > 0 ? lines : [text];
}

function drawPanelBg(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fill = 'rgba(15, 23, 42, 0.92)',
  stroke = 'rgba(251, 191, 36, 0.5)'
): void {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(12, 12, w - 24, h - 24, 18);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 5;
  ctx.stroke();
}

/** HUD 3D cố định trong scene — không gắn nỏ/camera. */
export class FpsHud3d {
  readonly worldHud = new THREE.Group();
  private readonly timerRoot = new THREE.Group();
  private timerFill!: THREE.Mesh;
  private readonly dotsRoot = new THREE.Group();
  private questionPlate!: TextPlate;
  private feedbackPlate!: TextPlate;
  private readonly woodMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
  private timerHalfW = TIMER_BAR_W / 2;
  private worldAttached = false;
  private disposed = false;
  private dotsTotal = -1;
  private timerRatio = 1;
  private questionShownAt = 0;

  constructor() {
    this.worldHud.position.set(0, STATUS_Y, HUD_Z);

    this.buildQuestionPlate();
    this.buildFeedbackPlate();
    this.buildTimer();
    this.dotsRoot.position.set(0, 0.26, 0.03);
    this.worldHud.add(this.timerRoot, this.dotsRoot);

    this.setFeedback('', 'neutral');
    this.setQuestion('...');
    this.setTimer(1);
    this.setProgress(0, 0, 1);
  }

  attachToWorld(world: THREE.Object3D): void {
    if (this.worldAttached) return;
    this.worldAttached = true;
    world.add(this.worldHud, this.questionPlate.group, this.feedbackPlate.group);
  }

  updateFacing(camera: THREE.Object3D): void {
    for (const g of [this.worldHud, this.questionPlate.group, this.feedbackPlate.group]) {
      if (!g.visible) continue;
      g.lookAt(camera.position.x, g.position.y, camera.position.z);
    }
  }

  setQuestion(text: string): void {
    this.paintQuestion(text);
    this.questionShownAt = performance.now();
  }

  /** Hiệu ứng theo thời gian: chữ câu hỏi hiện dần, thanh giờ đập khi sắp hết. */
  tick(now: number): void {
    // Câu hỏi hiện dần lên trong ~280ms.
    const appear = Math.min(1, (now - this.questionShownAt) / 280);
    const ease = 1 - Math.pow(1 - appear, 3);
    const qMat = this.questionPlate.mesh.material as THREE.MeshBasicMaterial;
    qMat.opacity = ease;
    this.questionPlate.group.position.y = QUESTION_Y - (1 - ease) * 0.18;
    // Thanh giờ đập khi còn dưới 25%.
    if (this.timerRatio < 0.25) {
      const pulse = 1 + Math.sin(now * 0.012) * 0.12;
      this.timerFill.scale.y = pulse;
      const mat = this.timerFill.material as THREE.MeshLambertMaterial;
      mat.emissiveIntensity = 0.25 + (pulse - 1) * 1.5;
    } else {
      this.timerFill.scale.y = 1;
    }
  }

  setFeedback(text: string, kind: FeedbackKind = 'neutral'): void {
    const trimmed = text.trim();
    if (!trimmed) {
      this.feedbackPlate.group.visible = false;
      return;
    }
    this.feedbackPlate.group.visible = true;
    const fg = kind === 'ok' ? '#86efac' : kind === 'bad' ? '#fca5a5' : '#fef9c3';
    this.paintFeedback(trimmed, fg);
  }

  setTimer(ratio: number): void {
    const r = Math.max(0, Math.min(1, ratio));
    this.timerRatio = r;
    this.timerFill.scale.x = Math.max(0.02, r);
    this.timerFill.position.x = -this.timerHalfW + this.timerHalfW * r;
    const mat = this.timerFill.material as THREE.MeshLambertMaterial;
    if (r < 0.25) mat.color.setHex(0xef4444);
    else if (r < 0.5) mat.color.setHex(0xf59e0b);
    else mat.color.setHex(0x22c55e);
  }

  setProgress(done: number, current: number, total: number): void {
    // Dựng lại dãy chấm chỉ khi tổng số câu đổi; ngược lại chỉ cập nhật màu để tránh GC mỗi câu.
    if (total !== this.dotsTotal) {
      this.rebuildDots(total);
    }
    this.dotsRoot.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return;
      let color = 0x64748b;
      let scale = 0.86;
      if (i < done) {
        color = 0x22c55e;
        scale = 1;
      } else if (i === current) {
        color = 0xfbbf24;
        scale = 1.18;
      }
      const mat = child.material as THREE.MeshLambertMaterial;
      mat.color.setHex(color);
      mat.emissive.setHex(color);
      child.scale.setScalar(scale);
    });
  }

  private rebuildDots(total: number): void {
    while (this.dotsRoot.children.length > 0) {
      const child = this.dotsRoot.children[0]!;
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        const mat = child.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
      this.dotsRoot.remove(child);
    }
    this.dotsTotal = total;
    const spacing = DOT_SPACING;
    const startX = -((total - 1) * spacing) / 2;
    for (let i = 0; i < total; i++) {
      const dot = new THREE.Mesh(
        new THREE.BoxGeometry(DOT_SIZE, DOT_SIZE, 0.05),
        new THREE.MeshLambertMaterial({ color: 0x64748b, emissive: 0x64748b, emissiveIntensity: 0.3 })
      );
      dot.position.set(startX + i * spacing, 0, 0.04);
      this.dotsRoot.add(dot);
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.disposePlate(this.questionPlate);
    this.disposePlate(this.feedbackPlate);
    this.timerRoot.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const m = o.material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m.dispose();
      }
    });
    this.setProgress(0, 0, 0);
    this.woodMat.dispose();
    this.worldHud.removeFromParent();
    this.questionPlate.group.removeFromParent();
    this.feedbackPlate.group.removeFromParent();
  }

  private buildQuestionPlate(): void {
    const cw = 2048;
    this.questionPlate = this.createTextPlate(
      cw,
      canvasHeightForPlate(cw, QUESTION_PLATE_W, QUESTION_PLATE_H),
      QUESTION_PLATE_W,
      QUESTION_PLATE_H,
      new THREE.Vector3(0, QUESTION_Y, HUD_Z),
      true
    );
  }

  private buildFeedbackPlate(): void {
    this.feedbackPlate = this.createTextPlate(
      960,
      120,
      QUESTION_PLATE_W * 0.88,
      0.34,
      new THREE.Vector3(0, FEEDBACK_Y, FEEDBACK_Z),
      false
    );
    this.feedbackPlate.group.visible = false;
  }

  private createTextPlate(
    cw: number,
    ch: number,
    pw: number,
    ph: number,
    pos: THREE.Vector3,
    withFrame: boolean
  ): TextPlate {
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;

    const group = new THREE.Group();
    group.position.copy(pos);

    let frame: THREE.Mesh | undefined;
    if (withFrame) {
      frame = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.1, ph + 0.1, 0.07), this.woodMat);
      group.add(frame);
    }

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pw, ph),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false, depthTest: false })
    );
    mesh.position.z = 0.04;
    mesh.renderOrder = 10;
    group.add(mesh);

    return { group, mesh, texture, canvas, ctx, w: cw, h: ch, frame };
  }

  private buildTimer(): void {
    const w = TIMER_BAR_W;
    const h = TIMER_BAR_H;
    this.timerHalfW = w / 2;
    this.timerRoot.position.set(0, -0.08, 0.03);
    const bg = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x334155 })
    );
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, h + 0.08, 0.05), this.woodMat);
    frame.position.z = -0.02;
    this.timerFill = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.08, h - 0.04, 0.07),
      new THREE.MeshLambertMaterial({ color: 0x22c55e, emissive: 0x166534, emissiveIntensity: 0.25 })
    );
    this.timerFill.position.set(0, 0, 0.03);
    this.timerRoot.add(frame, bg, this.timerFill);
  }

  private paintQuestion(text: string): void {
    const { ctx, texture, w, h } = this.questionPlate;
    drawPanelBg(ctx, w, h, 'rgba(15, 23, 42, 0.94)', 'rgba(251, 191, 36, 0.62)');
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 56px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawTallCenteredText(ctx, 'Phân loại:', w / 2, h * 0.2, 1.75);
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 56px system-ui, sans-serif';
    const lines = wrapLines(ctx, text, w - 120);
    const lineH = 112;
    const startY = h * 0.62 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => drawTallCenteredText(ctx, line, w / 2, startY + i * lineH, 2));
    texture.needsUpdate = true;
  }

  private paintFeedback(text: string, fg: string): void {
    const { ctx, texture, w, h } = this.feedbackPlate;
    ctx.clearRect(0, 0, w, h);
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = fg;
    const lines = wrapLines(ctx, text, w - 40);
    const lineH = 44;
    const startY = h / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineH));
    ctx.shadowBlur = 0;
    texture.needsUpdate = true;
  }

  private disposePlate(plate: TextPlate): void {
    plate.texture.dispose();
    plate.mesh.geometry.dispose();
    (plate.mesh.material as THREE.Material).dispose();
    if (plate.frame instanceof THREE.Mesh) plate.frame.geometry.dispose();
  }
}

export interface Crosshair3d {
  group: THREE.Group;
  /** Đổi trạng thái khi ngắm trúng/không trúng mục tiêu. */
  setLocked(on: boolean): void;
}

export function createCrosshair3d(): Crosshair3d {
  const g = new THREE.Group();
  g.position.set(0, 0, -0.55);
  const idleColor = 0xffffff;
  const lockColor = 0x4ade80;
  const mat = new THREE.MeshBasicMaterial({ color: idleColor, transparent: true, opacity: 0.92, toneMapped: false });
  const arm = 0.018;
  const thick = 0.0016;
  const h = new THREE.Mesh(new THREE.BoxGeometry(arm * 2, thick, thick), mat);
  const v = new THREE.Mesh(new THREE.BoxGeometry(thick, arm * 2, thick), mat);
  // Chấm tâm chỉ hiện khi đã ngắm trúng mục tiêu.
  const dotMat = new THREE.MeshBasicMaterial({ color: lockColor, transparent: true, opacity: 0, toneMapped: false });
  const dot = new THREE.Mesh(new THREE.CircleGeometry(thick * 2.2, 12), dotMat);
  g.add(h, v, dot);
  let locked = false;
  return {
    group: g,
    setLocked(on: boolean) {
      if (on === locked) return;
      locked = on;
      mat.color.setHex(on ? lockColor : idleColor);
      dotMat.opacity = on ? 0.95 : 0;
      const s = on ? 1.4 : 1;
      g.scale.set(s, s, 1);
    },
  };
}

/**
 * Nỏ góc nhìn thứ nhất gắn vào camera — đung đưa khi đứng yên, giật khi bắn.
 * Dựng từ khối hộp/trụ low-poly để khớp phong cách voxel của cảnh.
 */
export function createCrossbow3d(): {
  group: THREE.Group;
  idleTick(now: number): void;
  recoil(): void;
  dispose(): void;
} {
  const group = new THREE.Group();
  group.position.set(0.34, -0.34, -0.78);
  group.rotation.set(0.06, -0.16, 0.04);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b3f1d, roughness: 0.78, metalness: 0.05 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x3f2a16, roughness: 0.7, metalness: 0.08 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.7 });
  const stringMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, toneMapped: false });
  const boltMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5, metalness: 0.2 });

  // Báng nỏ (stock) hướng về phía người chơi.
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.42), woodMat);
  stock.position.set(0, 0, 0.06);
  // Tay cầm.
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.05), darkMat);
  grip.position.set(0, -0.075, 0.16);
  grip.rotation.x = 0.32;
  // Thân ngang đỡ hai cánh cung.
  const riser = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.035, 0.05), darkMat);
  riser.position.set(0, 0.005, -0.14);
  // Hai cánh cung.
  const limbL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.035), woodMat);
  limbL.position.set(-0.28, 0.02, -0.14);
  limbL.rotation.z = -0.22;
  const limbR = limbL.clone();
  limbR.position.x = 0.28;
  limbR.rotation.z = 0.22;
  // Dây cung.
  const string = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.006, 0.006), stringMat);
  string.position.set(0, 0.03, -0.05);
  // Mũi tên đã lắp sẵn.
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 6), boltMat);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.set(0, 0.035, -0.18);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 6), metalMat);
  tip.rotation.x = -Math.PI / 2;
  tip.position.set(0, 0.035, -0.37);

  group.add(stock, grip, riser, limbL, limbR, string, shaft, tip);

  let recoilUntil = 0;
  const recoilMs = 180;
  const baseZ = group.position.z;
  return {
    group,
    idleTick(now: number) {
      const sway = Math.sin(now * 0.0016) * 0.006;
      const bob = Math.cos(now * 0.0011) * 0.004;
      let kick = 0;
      if (now < recoilUntil) {
        const t = (recoilUntil - now) / recoilMs;
        kick = Math.sin(t * Math.PI) * 0.07;
      }
      group.position.y = -0.34 + bob;
      group.position.z = baseZ + kick;
      group.rotation.z = 0.04 + sway;
      group.rotation.x = 0.06 + kick * 0.6;
    },
    recoil() {
      recoilUntil = performance.now() + recoilMs;
    },
    dispose() {
      group.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const m = node.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      group.removeFromParent();
    },
  };
}

export function createHitFlashRig(): {
  group: THREE.Group;
  flash: (ok: boolean) => void;
  tick: (now: number) => void;
} {
  const g = new THREE.Group();
  g.position.set(0, 0.06, -0.48);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false });
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), mat);
  g.add(star);
  let until = 0;
  return {
    group: g,
    flash(ok: boolean) {
      until = performance.now() + 260;
      mat.color.setHex(ok ? 0x22c55e : 0xef4444);
      mat.opacity = 1;
    },
    tick(now: number) {
      if (now < until) {
        const t = (until - now) / 260;
        mat.opacity = t;
        star.scale.setScalar(0.7 + (1 - t) * 0.6);
      } else {
        mat.opacity = 0;
      }
    },
  };
}
