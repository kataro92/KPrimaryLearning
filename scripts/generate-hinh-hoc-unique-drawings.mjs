/**
 * Sinh minh họa 1:1 cho mọi câu hỏi: builder oNNN khớp đáp án câu oNNN.
 * - o001–o100: giữ nét vẽ chi tiết trong parts2d.ts (không ghi đè)
 * - o101–o538: parts2dExtra.ts + builderVisualShapeExtra.ts
 * - objectIllustrationMap.ts: gán oNNN → oNNN
 * Chạy: npx tsx scripts/generate-hinh-hoc-unique-drawings.mjs
 */
import { writeFileSync } from 'fs';
import { OBJECT_BANK } from '../src/games/hinh-hoc-thang-long/objectBank.ts';

const PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#b45309', '#64748b', '#0ea5e9', '#a855f7', '#84cc16', '#f43f5e', '#06b6d4',
];

function hue(i) {
  return PALETTE[i % PALETTE.length];
}

function artForBuilder(builderNum, shape) {
  const i = builderNum;
  const c = hue(i);
  const c2 = hue(i + 7);
  const c3 = hue(i + 3);
  const rot = (i % 5) * 0.12;
  const sk = (i % 7) - 3;

  switch (shape) {
    case 'circle':
      return [
        `fill(ctx,'${c2}');circle(ctx,0,0,${44 + (i % 11)});ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        i % 4 === 0
          ? `for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'${c}',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*30,Math.sin(a)*30);ctx.lineTo(Math.cos(a)*42,Math.sin(a)*42);ctx.stroke();}`
          : i % 4 === 1
            ? `fill(ctx,'${c}');circle(ctx,${(i % 5) - 2},${(i % 3) - 1},${7 + (i % 4)});ctx.fill();`
            : i % 4 === 2
              ? `pen(ctx,'${c}',2.2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,20);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(24,6);ctx.stroke();`
              : `fill(ctx,'${c}');circle(ctx,-16,-10,9);ctx.fill();fill(ctx,'${c3}');circle(ctx,14,12,11);ctx.fill();`,
      ].join('');
    case 'square':
      return [
        `fill(ctx,'${c}');rect(ctx,-${48 + (i % 7)},-${48 + (i % 5)},${96 + (i % 9)},${96 + (i % 8)},${3 + (i % 5)});ctx.fill();`,
        `pen(ctx,'${c3}',${1.5 + (i % 2)});ctx.stroke();`,
        i % 3 === 0
          ? `for(let a=0;a<4;a++){fill(ctx,'${c2}');rect(ctx,-32+(a%2)*32,-32+Math.floor(a/2)*32,28,28,2);ctx.fill();}`
          : i % 3 === 1
            ? `fill(ctx,'${c2}');rect(ctx,-36,-36,72,72,2);ctx.fill();pen(ctx,'${c3}',1.5);ctx.stroke();`
            : `pen(ctx,'${c2}',1.2);ctx.strokeRect(-30,-30,60,60);pen(ctx,'${c}',1);ctx.strokeRect(-18,-18,36,36);`,
      ].join('');
    case 'rect':
      return [
        `fill(ctx,'${c}');rect(ctx,-${70 + sk},-${12 + (i % 7)},${140 + sk * 2},${24 + (i % 9)},${2 + (i % 4)});ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `for(let t=0;t<${6 + (i % 6)};t++){pen(ctx,'${c2}',1);ctx.beginPath();ctx.moveTo(-${58 + sk}+t*${9 + (i % 2)},-${12 + (i % 7)});ctx.lineTo(-${58 + sk}+t*${9 + (i % 2)},${12 + (i % 7)});ctx.stroke();}`,
      ].join('');
    case 'triangle':
      return [
        `fill(ctx,'${c}');tri(ctx,-${46 + (i % 6)},${28 + (i % 5)},${46 + (i % 6)},${28 + (i % 5)},${(i % 3) - 1},-${36 + (i % 7)});ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `pen(ctx,'${c2}',1.2);for(let t=0;t<${2 + (i % 4)};t++){ctx.beginPath();ctx.moveTo(-18+t*16,-2);ctx.lineTo(-12+t*16,16);ctx.stroke();}`,
      ].join('');
    case 'trapezoid': {
      const top = 34 + (i % 13);
      const bot = 66 + (i % 11);
      const h = 26 + (i % 8);
      return [
        `fill(ctx,'${c}');ctx.beginPath();ctx.moveTo(-${top},-${h});ctx.lineTo(${top},-${h});ctx.lineTo(${bot},${h});ctx.lineTo(-${bot},${h});ctx.closePath();ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `fill(ctx,'${c2}');rect(ctx,-${bot - 5},${h},${(bot - 5) * 2},${5 + (i % 4)},2);ctx.fill();`,
      ].join('');
    }
    case 'parallelogram':
      return [
        `ctx.save();ctx.rotate(${rot});fill(ctx,'${c}');ctx.beginPath();ctx.moveTo(-52,22);ctx.lineTo(12,-32);ctx.lineTo(52,-22);ctx.lineTo(-12,32);ctx.closePath();ctx.fill();`,
        `pen(ctx,'${c3}',2.5);ctx.stroke();ctx.restore();`,
        `pen(ctx,'${c2}',2.5);ctx.beginPath();ctx.moveTo(${18 + (i % 9)},${-28 + (i % 6)});ctx.lineTo(${46 + (i % 7)},${-36 + (i % 5)});ctx.lineTo(${40 + (i % 6)},${-26 + (i % 4)});ctx.closePath();ctx.fillStyle='${c3}';ctx.fill();`,
      ].join('');
    case 'rhombus':
      return [
        `fill(ctx,'${c}');ctx.beginPath();ctx.moveTo(0,-${48 + (i % 9)});ctx.lineTo(${42 + (i % 7)},0);ctx.lineTo(0,${48 + (i % 9)});ctx.lineTo(-${42 + (i % 7)},0);ctx.closePath();ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `fill(ctx,'${c2}');ctx.beginPath();ctx.moveTo(0,-${32 + (i % 6)});ctx.lineTo(${28 + (i % 5)},0);ctx.lineTo(0,${32 + (i % 6)});ctx.lineTo(-${28 + (i % 5)},0);ctx.closePath();ctx.fill();`,
      ].join('');
    default:
      return `fill(ctx,'#94a3b8');rect(ctx,-40,-40,80,80,4);ctx.fill();`;
  }
}

if (OBJECT_BANK.length !== 538) {
  throw new Error(`Expected 538 bank items, got ${OBJECT_BANK.length}`);
}

const extraItems = OBJECT_BANK.filter((item) => parseInt(item.id.slice(1), 10) > 100);

const visualLines = [
  "import type { ObjectShape } from './shapeCatalog';",
  '',
  '/** Dạng hình builder o101–o538 — 1:1 với câu hỏi cùng mã (scripts/generate-hinh-hoc-unique-drawings.mjs). */',
  'export const BUILDER_VISUAL_SHAPE_EXTRA: Record<string, ObjectShape> = {',
];
const drawFns = [];
const drawMap = [];

for (const item of extraItems) {
  const builderId = item.id;
  const num = parseInt(builderId.slice(1), 10);
  visualLines.push(`  ${builderId}: '${item.shape}',`);
  const art = artForBuilder(num, item.shape);
  drawFns.push(`function draw_${builderId}(ctx: Ctx): void {\n  ${art}\n}\n`);
  drawMap.push(`  ${builderId}: draw_${builderId},`);
}

visualLines.push('};', '');

const parts2dExtra = [
  "import type { Ctx } from './helpers';",
  "import { circle, fill, pen, rect, tri } from './helpers';",
  '',
  '/** Minh họa o101–o538 — mỗi câu một nét vẽ (generate-hinh-hoc-unique-drawings.mjs). */',
  'type DrawFn = (ctx: Ctx) => void;',
  '',
  ...drawFns,
  'export const BUILDER_DRAW_EXTRA: Record<string, DrawFn> = {',
  ...drawMap,
  '};',
  '',
].join('\n');

const mapLines = [
  "import type { ObjectShape } from './shapeCatalog';",
  "import { BUILDER_VISUAL_SHAPE } from './builderVisualShape';",
  '',
  '/** Mỗi câu oNNN → builder oNNN (1:1, khớp đáp án). Sinh: generate-hinh-hoc-unique-drawings.mjs */',
  'export const OBJECT_ILLUSTRATION_BUILDER: Record<string, string> = {',
];
for (const item of OBJECT_BANK) {
  mapLines.push(`  ${item.id}: '${item.id}',`);
}
mapLines.push(
  '};',
  '',
  'export function illustrationBuilderForObject(',
  '  objectId: string,',
  '  shape: ObjectShape',
  '): string | undefined {',
  '  const builder = OBJECT_ILLUSTRATION_BUILDER[objectId];',
  '  if (!builder) return undefined;',
  '  return BUILDER_VISUAL_SHAPE[builder] === shape ? builder : undefined;',
  '}',
  ''
);

writeFileSync('src/games/hinh-hoc-thang-long/sketchDraw/parts2dExtra.ts', parts2dExtra);
writeFileSync('src/games/hinh-hoc-thang-long/builderVisualShapeExtra.ts', visualLines.join('\n'));
writeFileSync('src/games/hinh-hoc-thang-long/objectIllustrationMap.ts', mapLines.join('\n'));

console.log(`Wrote parts2dExtra.ts (${extraItems.length} builders o101–o538)`);
console.log('Wrote builderVisualShapeExtra.ts');
console.log(`Wrote objectIllustrationMap.ts (${OBJECT_BANK.length} identity mappings)`);
