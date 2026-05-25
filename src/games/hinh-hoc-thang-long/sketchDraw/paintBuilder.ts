import type { Ctx } from './helpers';
import { paperWash, pen } from './helpers';
import { BUILDER_DRAW } from './parts2d';

export function paintBuilder(ctx: Ctx, builderId: string, width: number, height: number): void {
  paperWash(ctx, width, height);
  const s = Math.min(width, height) * 0.82;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(s / 200, s / 200);
  const draw = BUILDER_DRAW[builderId] ?? BUILDER_DRAW.o003;
  draw(ctx);
  pen(ctx, 'rgba(51, 65, 85, 0.35)', 1.2);
  ctx.strokeRect(-72, -72, 144, 144);
  ctx.restore();
}
