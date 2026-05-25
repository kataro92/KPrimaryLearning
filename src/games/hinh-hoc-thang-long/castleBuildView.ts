/** Minh họa 2D thành Thăng Long — mỗi câu đúng thêm một tầng. */
export class CastleBuildView {
  private readonly root: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly statusEl: HTMLElement;
  private readonly resizeObserver: ResizeObserver;
  private totalTiers = 10;
  private builtTiers = 0;
  private celebrating = false;
  private buildAnim = 0;
  private rafId = 0;

  constructor(mount: HTMLElement, totalTiers: number) {
    this.totalTiers = Math.max(1, totalTiers);
    this.root = document.createElement('div');
    this.root.className = 'thang-long-castle';
    this.root.innerHTML = `
      <div class="thang-long-castle__sky" aria-hidden="true"></div>
      <canvas class="thang-long-castle__canvas" aria-label="Thành Thăng Long đang xây"></canvas>
      <p class="thang-long-castle__status"></p>
    `;
    mount.appendChild(this.root);
    this.canvas = this.root.querySelector('canvas')!;
    this.statusEl = this.root.querySelector('.thang-long-castle__status')!;
    this.resizeObserver = new ResizeObserver(() => this.repaint());
    this.resizeObserver.observe(this.root);
    this.updateStatus();
    this.repaint();
  }

  /** Gọi sau mỗi câu trả lời đúng. */
  addTier(built: number): void {
    this.builtTiers = Math.min(built, this.totalTiers);
    this.buildAnim = 1;
    this.root.classList.add('thang-long-castle--building');
    this.updateStatus();
    this.repaint();
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 520);
      this.buildAnim = 1 - t;
      this.repaint();
      if (t < 1) this.rafId = requestAnimationFrame(tick);
      else {
        this.root.classList.remove('thang-long-castle--building');
        if (this.builtTiers >= this.totalTiers) this.setCelebration(true);
      }
    };
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(tick);
  }

  setCelebration(on: boolean): void {
    this.celebrating = on && this.builtTiers >= this.totalTiers;
    this.root.classList.toggle('thang-long-castle--complete', this.celebrating);
    this.updateStatus();
    this.repaint();
  }

  dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.root.remove();
  }

  private updateStatus(): void {
    if (this.celebrating) {
      this.statusEl.textContent = '🐉 Thành Thăng Long hoàn chỉnh!';
      return;
    }
    if (this.builtTiers <= 0) {
      this.statusEl.textContent = `Trả lời đúng để xây tầng · 0/${this.totalTiers}`;
      return;
    }
    this.statusEl.textContent = `Đang xây thành · ${this.builtTiers}/${this.totalTiers} tầng`;
  }

  private repaint(): void {
    const w = this.canvas.clientWidth || 280;
    const h = this.canvas.clientHeight || 200;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintCastle(ctx, w, h, this.builtTiers, this.totalTiers, this.celebrating, this.buildAnim);
  }
}

type Ctx = CanvasRenderingContext2D;

function paintCastle(
  ctx: Ctx,
  w: number,
  h: number,
  built: number,
  total: number,
  complete: boolean,
  buildAnim: number
): void {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#7dd3fc');
  sky.addColorStop(0.45, '#bae6fd');
  sky.addColorStop(1, '#fef3c7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const groundY = h - 22;
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(0, groundY, w, h - groundY);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, groundY + 4, w, 6);

  const cx = w * 0.5;
  const baseW = Math.min(w * 0.72, 200);
  const tierH = Math.min(28, (groundY - 48) / total);
  const baseY = groundY;
  let y = baseY;

  drawFoundation(ctx, cx, y, baseW);
  y -= 14;

  const tiersToDraw = built + (buildAnim > 0 ? 1 : 0);
  for (let i = 0; i < tiersToDraw; i++) {
    const isNew = i === built && buildAnim > 0;
    const lift = isNew ? buildAnim * tierH * 0.85 : 0;
    drawTier(ctx, cx, y + lift, baseW, tierH, i, isNew ? 1 - buildAnim : 1);
    y -= tierH;
  }

  if (complete && built >= total) {
    drawCrown(ctx, cx, y, baseW);
    drawDragon(ctx, cx, y - 55, w);
  } else if (built > 0) {
    drawScaffold(ctx, cx, baseY - built * tierH, baseW, Math.min(built, 3));
  }
}

function drawFoundation(ctx: Ctx, cx: number, y: number, bw: number): void {
  ctx.fillStyle = '#78716c';
  ctx.fillRect(cx - bw * 0.55, y - 10, bw * 1.1, 12);
  ctx.fillStyle = '#57534e';
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(cx - bw * 0.5 + i * (bw / 6.5), y - 8, bw / 8, 6);
  }
}

function drawTier(
  ctx: Ctx,
  cx: number,
  y: number,
  bw: number,
  th: number,
  index: number,
  alpha: number
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const wallW = bw * 0.88;
  const x = cx - wallW / 2;
  const h = th - 4;

  ctx.fillStyle = index % 2 === 0 ? '#b45309' : '#9a3412';
  ctx.fillRect(x, y - h, wallW, h);
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y - h, wallW, h);

  ctx.fillStyle = '#fde68a';
  const win = bw * 0.12;
  for (const wx of [-0.22, 0, 0.22]) {
    ctx.fillRect(cx + bw * wx - win / 2, y - h * 0.65, win, win * 1.1);
    ctx.strokeStyle = '#92400e';
    ctx.strokeRect(cx + bw * wx - win / 2, y - h * 0.65, win, win * 1.1);
  }

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x, y - h - 3, wallW, 4);
  ctx.restore();
}

function drawScaffold(ctx: Ctx, cx: number, topY: number, bw: number, n: number): void {
  ctx.strokeStyle = 'rgba(120, 53, 15, 0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < n; i++) {
    const y = topY + i * 18;
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.5, y);
    ctx.lineTo(cx + bw * 0.5, y + 14);
    ctx.moveTo(cx + bw * 0.5, y);
    ctx.lineTo(cx - bw * 0.5, y + 14);
    ctx.stroke();
  }
}

function drawCrown(ctx: Ctx, cx: number, y: number, bw: number): void {
  const rw = bw * 0.95;
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i === 1 ? '#b91c1c' : '#dc2626';
    ctx.beginPath();
    ctx.moveTo(cx - rw / 2 + i * 8, y);
    ctx.lineTo(cx + rw / 2 - i * 8, y);
    ctx.lineTo(cx, y - 22 - i * 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    y -= 8;
  }

  const poleX = cx + rw * 0.35;
  ctx.fillStyle = '#57534e';
  ctx.fillRect(poleX - 2, y - 38, 4, 42);
  ctx.fillStyle = '#da251d';
  ctx.fillRect(poleX, y - 36, 28, 18);
  ctx.fillStyle = '#ffcd00';
  const sx = poleX + 10;
  const sy = y - 27;
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(a + 0.35) * 6, sy + Math.sin(a + 0.35) * 6);
    ctx.lineTo(sx + Math.cos(a - 0.35) * 6, sy + Math.sin(a - 0.35) * 6);
    ctx.closePath();
    ctx.fill();
  }
}

function drawDragon(ctx: Ctx, cx: number, y: number, w: number): void {
  ctx.save();
  ctx.globalAlpha = 0.92;
  const s = Math.min(w * 0.22, 56);
  ctx.translate(cx, y);
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 1.1, s * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(-s * 0.9, -s * 0.1);
  ctx.quadraticCurveTo(-s * 1.4, -s * 0.9, -s * 0.5, -s * 0.5);
  ctx.lineTo(-s * 0.3, -s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(s * 0.9, -s * 0.1);
  ctx.quadraticCurveTo(s * 1.4, -s * 0.9, s * 0.5, -s * 0.5);
  ctx.lineTo(s * 0.3, -s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  circle(ctx, -s * 0.35, -s * 0.05, 5);
  circle(ctx, s * 0.35, -s * 0.05, 5);
  ctx.fillStyle = '#0f172a';
  circle(ctx, -s * 0.35, -s * 0.05, 2.5);
  circle(ctx, s * 0.35, -s * 0.05, 2.5);
  ctx.restore();
}

function circle(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
