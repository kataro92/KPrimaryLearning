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
  fill = 'rgba(15, 23, 42, 0.9)',
  stroke = 'rgba(251, 191, 36, 0.45)'
): void {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(10, 10, w - 20, h - 20, 16);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 4;
  ctx.stroke();
}

/** Bảng thông tin 3D gắn trên camera (nằm trong thế giới 3D). */
export class FpsHud3d {
  readonly root = new THREE.Group();
  private readonly timerRoot = new THREE.Group();
  private timerFill!: THREE.Mesh;
  private readonly dotsRoot = new THREE.Group();
  private questionPlate!: TextPlate;
  private feedbackPlate!: TextPlate;
  private readonly woodMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
  private disposed = false;

  constructor() {
    this.buildQuestionPlate();
    this.buildFeedbackPlate();
    this.buildTimer();
    this.dotsRoot.position.set(0, 0.54, -1.38);
    this.root.add(this.questionPlate.group, this.feedbackPlate.group, this.timerRoot, this.dotsRoot);
    this.setFeedback('', 'neutral');
    this.setQuestion('...');
    this.setTimer(1);
    this.setProgress(0, 0, 1);
  }

  attachTo(camera: THREE.Object3D): void {
    camera.add(this.root);
  }

  setQuestion(text: string): void {
    this.paintQuestion(text);
  }

  setFeedback(text: string, kind: FeedbackKind = 'neutral'): void {
    const fg = kind === 'ok' ? '#86efac' : kind === 'bad' ? '#fca5a5' : '#fef9c3';
    const stroke =
      kind === 'ok'
        ? 'rgba(34, 197, 94, 0.55)'
        : kind === 'bad'
          ? 'rgba(239, 68, 68, 0.55)'
          : 'rgba(251, 191, 36, 0.45)';
    this.paintFeedback(text, fg, stroke);
  }

  setTimer(ratio: number): void {
    const r = Math.max(0, Math.min(1, ratio));
    this.timerFill.scale.x = Math.max(0.02, r);
    this.timerFill.position.x = -0.52 + 0.52 * r;
    const mat = this.timerFill.material as THREE.MeshLambertMaterial;
    if (r < 0.25) mat.color.setHex(0xef4444);
    else if (r < 0.5) mat.color.setHex(0xf59e0b);
    else mat.color.setHex(0x22c55e);
  }

  setProgress(done: number, current: number, total: number): void {
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
    const spacing = 0.11;
    const startX = -((total - 1) * spacing) / 2;
    for (let i = 0; i < total; i++) {
      let color = 0x64748b;
      if (i < done) color = 0x22c55e;
      else if (i === current) color = 0xfbbf24;
      const dot = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 0.07, 0.04),
        new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.25 })
      );
      dot.position.set(startX + i * spacing, 0, 0.03);
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
    this.root.removeFromParent();
  }

  private buildQuestionPlate(): void {
    this.questionPlate = this.createTextPlate(920, 200, 1.75, 0.38, new THREE.Vector3(0, 0.28, -1.42));
  }

  private buildFeedbackPlate(): void {
    this.feedbackPlate = this.createTextPlate(760, 120, 1.45, 0.22, new THREE.Vector3(0, -0.34, -1.38));
  }

  private createTextPlate(
    cw: number,
    ch: number,
    pw: number,
    ph: number,
    pos: THREE.Vector3
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

    const frame = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.08, ph + 0.08, 0.06), this.woodMat);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pw, ph),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false })
    );
    mesh.position.z = 0.035;
    group.add(frame, mesh);

    return { group, mesh, texture, canvas, ctx, w: cw, h: ch };
  }

  private buildTimer(): void {
    this.timerRoot.position.set(0, 0.46, -1.4);
    const bg = new THREE.Mesh(
      new THREE.BoxGeometry(1.08, 0.07, 0.05),
      new THREE.MeshLambertMaterial({ color: 0x334155 })
    );
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.12, 0.04), this.woodMat);
    frame.position.z = -0.02;
    this.timerFill = new THREE.Mesh(
      new THREE.BoxGeometry(1.04, 0.05, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x22c55e, emissive: 0x166534, emissiveIntensity: 0.2 })
    );
    this.timerFill.position.set(0, 0, 0.02);
    this.timerRoot.add(frame, bg, this.timerFill);
  }

  private paintQuestion(text: string): void {
    const { ctx, texture, w, h } = this.questionPlate;
    drawPanelBg(ctx, w, h);
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const prompt = `Bắn đáp án đúng cho:`;
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(prompt, w / 2, h * 0.32);
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 34px system-ui, sans-serif';
    const lines = wrapLines(ctx, text, w - 56);
    const lineH = 40;
    const startY = h * 0.58 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineH));
    texture.needsUpdate = true;
  }

  private paintFeedback(text: string, fg: string, stroke: string): void {
    const { ctx, texture, w, h } = this.feedbackPlate;
    drawPanelBg(ctx, w, h, 'rgba(15, 23, 42, 0.88)', stroke);
    ctx.fillStyle = fg;
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = wrapLines(ctx, text || ' ', w - 48);
    const lineH = 32;
    const startY = h / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineH));
    texture.needsUpdate = true;
  }

  private disposePlate(plate: TextPlate): void {
    plate.texture.dispose();
    plate.mesh.geometry.dispose();
    (plate.mesh.material as THREE.Material).dispose();
    const frame = plate.group.children[0];
    if (frame instanceof THREE.Mesh) frame.geometry.dispose();
  }
}

export function createCrosshair3d(): THREE.Group {
  const g = new THREE.Group();
  g.position.set(0, 0, -0.55);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92, toneMapped: false });
  const h = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.11, 0.004), mat);
  const v = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.018, 0.004), mat.clone());
  g.add(h, v);
  return g;
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
