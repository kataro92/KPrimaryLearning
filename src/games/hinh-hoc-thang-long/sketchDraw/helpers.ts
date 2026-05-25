/** Bút chì / mực kiểu sổ vẽ — tọa độ viewBox 0..200, gốc giữa. */
export type Ctx = CanvasRenderingContext2D;

export function paperWash(ctx: Ctx, w: number, h: number): void {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#fffef8');
  g.addColorStop(1, '#f5f0e6');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(120, 90, 60, 0.08)';
  for (let y = 18; y < h; y += 22) {
    ctx.beginPath();
    ctx.moveTo(12, y);
    ctx.lineTo(w - 12, y);
    ctx.stroke();
  }
}

export function pen(ctx: Ctx, color = '#334155', width = 2.2): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export function fill(ctx: Ctx, color: string): void {
  ctx.fillStyle = color;
}

export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, r = 0): void {
  if (r <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function tri(ctx: Ctx, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
}

export function circle(ctx: Ctx, cx: number, cy: number, r: number): void {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
}

export function vnFlag(ctx: Ctx, x: number, y: number, w: number, h: number): void {
  fill(ctx, '#da251d');
  rect(ctx, x, y, w, h, 2);
  ctx.fill();
  pen(ctx, '#b91c1c', 1.5);
  ctx.stroke();
  fill(ctx, '#ffcd00');
  const cx = x + w * 0.38;
  const cy = y + h * 0.5;
  const r = Math.min(w, h) * 0.22;
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const ox = cx + Math.cos(a) * r * 0.35;
    const oy = cy + Math.sin(a) * r * 0.35;
    tri(ctx, cx, cy, ox + Math.cos(a + 0.35) * r, oy + Math.sin(a + 0.35) * r, ox + Math.cos(a - 0.35) * r, oy + Math.sin(a - 0.35) * r);
    ctx.fill();
  }
}
