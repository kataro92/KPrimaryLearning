/**
 * Sinh bổ sung ngân hàng Hình học Thăng Long:
 * - 210 câu o329–o538 (lớp 4, tiếng Việt chuẩn)
 * - 210 minh họa o101–o310 (1 câu ↔ 1 builder, khớp đáp án)
 * Chạy: node scripts/generate-hinh-hoc-wave3.mjs
 */
import { writeFileSync } from 'fs';

const SHAPES = ['square', 'rect', 'triangle', 'parallelogram', 'rhombus', 'trapezoid', 'circle'];

/** Phân bổ 210 câu mới — ưu tiên dạng đang thiếu (ít rect). */
const WAVE3_SHAPE_COUNTS = {
  circle: 46,
  rhombus: 51,
  parallelogram: 45,
  trapezoid: 45,
  triangle: 5,
  square: 15,
  rect: 3,
};

const WAVE3_ITEMS = [
  // circle (46) — đồ dùng quen thuộc lớp 4
  ['Đồng hồ bàn học', 1],
  ['Mặt trăng đêm', 1],
  ['Nắp nồi cơm', 1],
  ['Bánh donut', 1],
  ['Đĩa sứ trắng', 1],
  ['Quả bóng đá', 1],
  ['Nút áo tròn', 2],
  ['Đồng xu lưu niệm', 2],
  ['Mặt đồng hồ treo', 1],
  ['Bánh bao nhân', 2],
  ['Miếng cam', 1],
  ['Đĩa nhựa màu', 2],
  ['Huy hiệu tròn', 2],
  ['Nút bấm điện', 2],
  ['Bánh quy tròn', 1],
  ['Mặt trời vẽ', 1],
  ['Đĩa gốm men', 2],
  ['Quả táo', 1],
  ['Đồng hồ báo thức', 2],
  ['Miếng bánh bông lan', 2],
  ['Nút vặn cửa', 2],
  ['Đĩa kẹo Tết', 1],
  ['Huy chương thi đua', 2],
  ['Quả cam ngọt', 1],
  ['Đồng hồ mini', 2],
  ['Bánh bao chay', 2],
  ['Mặt đồng hồ đỏ', 1],
  ['Đĩa in hoa', 2],
  ['Nút ghim văn phòng', 2],
  ['Quả chanh vàng', 1],
  ['Đồng xu đồng', 2],
  ['Bánh quy socola', 2],
  ['Mặt trăng khuyết', 1],
  ['Đĩa sứ xanh', 2],
  ['Huy hiệu sao', 2],
  ['Quả nho tím', 2],
  ['Đồng hồ kim giờ', 2],
  ['Bánh trung thu tròn', 1],
  ['Nút áo xanh', 2],
  ['Đĩa kẹo dẻo', 2],
  ['Miếng bánh kem tròn', 2],
  ['Quả ổi xanh', 2],
  ['Đồng hồ học sinh', 2],
  ['Bánh quy bơ', 2],
  ['Mặt trời buổi sáng', 1],
  ['Đĩa trái cây', 2],
  // rhombus (51)
  ['Viên ngọc trang sức', 2],
  ['Khung thoi dệt', 2],
  ['Gạch hoa lục giác', 2],
  ['Diều giấy nhỏ', 1],
  ['Mảnh kính màu', 3],
  ['Huy hiệu kim cương', 2],
  ['Gạch men xanh', 2],
  ['Viên đá quý', 3],
  ['Khung ảnh nghiêng', 2],
  ['Gạch lát hình thoi', 2],
  ['Cánh diều giấy', 1],
  ['Mảnh gương vỡ', 3],
  ['Huy hiệu lục giác', 2],
  ['Gạch mosaic', 2],
  ['Viên pha lê', 3],
  ['Khung cửa kính', 2],
  ['Gạch sân thể thao', 2],
  ['Diều giấy nhỏ', 1],
  ['Mảnh kính mờ', 3],
  ['Huy hiệu vàng', 2],
  ['Gạch men đỏ', 2],
  ['Viên đá cẩn', 3],
  ['Khung tranh nghiêng', 2],
  ['Gạch vỉa hè', 2],
  ['Cánh diều rực', 1],
  ['Mảnh gương tròn', 3],
  ['Huy hiệu bạc', 2],
  ['Gạch hoa vàng', 2],
  ['Viên ngọc xanh', 3],
  ['Khung kính cửa', 2],
  ['Gạch lát sân', 2],
  ['Diều con nhỏ', 1],
  ['Mảnh kính xanh', 3],
  ['Huy hiệu đỏ', 2],
  ['Gạch men trắng', 2],
  ['Viên đá lấp lánh', 3],
  ['Khung ảnh kính', 2],
  ['Gạch hoa tím', 2],
  ['Cánh diều xanh', 1],
  ['Mảnh gương nhỏ', 3],
  ['Huy hiệu xanh', 2],
  ['Gạch mosaic vàng', 2],
  ['Viên pha lê hồng', 3],
  ['Khung cửa sổ kính', 2],
  ['Gạch sân xanh', 2],
  ['Diều giấy xanh', 1],
  ['Mảnh kính vàng', 3],
  ['Huy hiệu tím', 2],
  ['Gạch men hồng', 2],
  ['Viên ngọc đỏ', 3],
  ['Khung tranh kính', 2],
  // parallelogram (45)
  ['Thanh xiên cửa', 2],
  ['Mảnh gỗ nghiêng', 2],
  ['Nhãn vở xiên', 2],
  ['Thanh sắt xiên', 3],
  ['Mảnh bìa xiên', 2],
  ['Thanh gỗ pallet', 2],
  ['Nhãn dán xiên', 2],
  ['Thanh nhôm xiên', 3],
  ['Mảnh ván xiên', 2],
  ['Thanh tre xiên', 2],
  ['Nhãn sách xiên', 2],
  ['Thanh đồng xiên', 3],
  ['Mảnh nhựa xiên', 2],
  ['Thanh gỗ nghiêng', 2],
  ['Nhãn hộp xiên', 2],
  ['Thanh sắt nhỏ', 3],
  ['Mảnh bìa cứng xiên', 2],
  ['Thanh ván xiên', 2],
  ['Nhãn vở màu', 2],
  ['Thanh kẽm xiên', 3],
  ['Mảnh gỗ nhỏ', 2],
  ['Thanh tre nhỏ', 2],
  ['Nhãn dán màu', 2],
  ['Thanh nhựa xiên', 3],
  ['Mảnh ván nhỏ', 2],
  ['Thanh gỗ dài', 2],
  ['Nhãn sách màu', 2],
  ['Thanh sắt dài', 3],
  ['Mảnh bìa xiên nhỏ', 2],
  ['Thanh pallet xiên', 2],
  ['Nhãn vở học sinh', 2],
  ['Thanh đồng nhỏ', 3],
  ['Mảnh nhựa nghiêng', 2],
  ['Thanh gỗ học sinh', 2],
  ['Nhãn hộp màu', 2],
  ['Thanh kẽm nhỏ', 3],
  ['Mảnh ván nghiêng', 2],
  ['Thanh tre dài', 2],
  ['Nhãn dán học sinh', 2],
  ['Thanh nhôm nhỏ', 3],
  ['Mảnh gỗ học sinh', 2],
  ['Thanh xiên nhỏ', 2],
  ['Nhãn vở xiên nhỏ', 2],
  ['Thanh sắt học sinh', 3],
  ['Mảnh bìa học sinh', 2],
  // trapezoid (45)
  ['Mái nhà ngói đỏ', 1],
  ['Cái xẻng nhựa', 1],
  ['Mái hiên nhà', 1],
  ['Chậu hoa lớn', 2],
  ['Mái chùa nhỏ', 1],
  ['Cái cốc loe', 2],
  ['Mái lều trại', 2],
  ['Thùng đựng đồ', 2],
  ['Mái nhà xanh', 1],
  ['Cái ly loe', 2],
  ['Mái vòm nhỏ', 2],
  ['Chậu cây cảnh', 2],
  ['Mái hiên xanh', 1],
  ['Cái bát loe', 2],
  ['Mái lều xanh', 2],
  ['Thùng rác nhựa', 2],
  ['Mái ngói vàng', 1],
  ['Cái cốc nhựa', 2],
  ['Mái chắn nắng', 2],
  ['Chậu hoa nhỏ', 2],
  ['Mái nhà đỏ', 1],
  ['Cái ly nhựa', 2],
  ['Mái vòm đỏ', 2],
  ['Thùng đựng sách', 2],
  ['Mái hiên đỏ', 1],
  ['Cái bát nhựa', 2],
  ['Mái lều đỏ', 2],
  ['Chậu cây nhỏ', 2],
  ['Mái ngói xanh', 1],
  ['Cái xẻng nhỏ', 2],
  ['Mái chùa vàng', 1],
  ['Thùng đựng đồ chơi', 2],
  ['Mái nhà vàng', 1],
  ['Cái cốc loe xanh', 2],
  ['Mái vòm xanh', 2],
  ['Chậu hoa xanh', 2],
  ['Mái hiên vàng', 1],
  ['Cái ly loe đỏ', 2],
  ['Mái lều vàng', 2],
  ['Thùng rác xanh', 2],
  ['Mái ngói đỏ nhỏ', 1],
  ['Cái bát loe vàng', 2],
  ['Mái chắn nắng xanh', 2],
  ['Chậu cây đỏ', 2],
  ['Mái vòm vàng', 2],
  // triangle (5)
  ['Miếng bánh mì nướng', 1],
  ['Nón lá tre', 1],
  ['Cờ cắm lớp học', 1],
  ['Miếng pizza nhỏ', 2],
  ['Diều giấy nhiều màu', 1],
  // square (15)
  ['Khăn gấp thổ cẩm', 1],
  ['Miếng bánh chưng', 1],
  ['Ô cờ vua', 1],
  ['Khung ảnh treo tường', 2],
  ['Miếng đậu phụ', 2],
  ['Gạch đỏ lát sân', 1],
  ['Khay nhựa đựng đồ', 2],
  ['Miếng bánh brownie', 2],
  ['Ô bàn cờ caro', 1],
  ['Khung tranh treo phòng', 2],
  ['Miếng phô mai', 2],
  ['Gạch lát sân trường', 1],
  ['Khay đựng đồ ăn', 2],
  ['Miếng bánh quy sữa', 2],
  ['Ô sổ ô ly', 1],
  // rect (3)
  ['Thước kẻ dài', 1],
  ['Hộp bút chì', 1],
  ['Quyển vở kẻ ngang', 1],
];

function assertWave3Data() {
  const flat = [];
  for (const shape of SHAPES) {
    const n = WAVE3_SHAPE_COUNTS[shape];
    const slice = WAVE3_ITEMS.filter(([, lv]) => true);
    void slice;
  }
  let idx = 0;
  const planned = [];
  for (const shape of SHAPES) {
    for (let k = 0; k < WAVE3_SHAPE_COUNTS[shape]; k++) {
      const row = WAVE3_ITEMS[idx++];
      if (!row) throw new Error(`Thiếu nhãn wave3 tại ${shape} #${k}`);
      planned.push({ shape, label: row[0], minLevel: row[1] });
    }
  }
  if (idx !== WAVE3_ITEMS.length) {
    throw new Error(`WAVE3_ITEMS length ${WAVE3_ITEMS.length} !== used ${idx}`);
  }
  return planned;
}

const PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#b45309', '#64748b', '#0ea5e9', '#a855f7', '#84cc16', '#f43f5e', '#06b6d4',
];

function hue(i) {
  return PALETTE[i % PALETTE.length];
}

function artForBuilder(builderNum, shape) {
  const i = builderNum - 101;
  const c = hue(i);
  const c2 = hue(i + 7);
  const c3 = hue(i + 3);
  const rot = (i % 5) * 0.12;
  const sk = (i % 7) - 3;

  switch (shape) {
    case 'circle':
      return [
        `fill(ctx,'${c2}');circle(ctx,0,0,${48 + (i % 8)});ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        i % 3 === 0
          ? `for(let k=0;k<12;k++){const a=k/12*Math.PI*2-Math.PI/2;pen(ctx,'${c}',1.2);ctx.beginPath();ctx.moveTo(Math.cos(a)*32,Math.sin(a)*32);ctx.lineTo(Math.cos(a)*44,Math.sin(a)*44);ctx.stroke();}`
          : i % 3 === 1
            ? `fill(ctx,'${c}');circle(ctx,0,0,${8 + (i % 5)});ctx.fill();`
            : `pen(ctx,'${c}',2.5);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-6,22);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(28,4);ctx.stroke();`,
      ].join('');
    case 'square':
      return [
        `fill(ctx,'${c}');rect(ctx,-${50 + (i % 6)},-${50 + (i % 6)},${100 + (i % 8)},${100 + (i % 8)},${4 + (i % 4)});ctx.fill();`,
        `pen(ctx,'${c3}',${1.5 + (i % 2)});ctx.stroke();`,
        i % 2 === 0
          ? `for(let a=0;a<4;a++){fill(ctx,'${c2}');rect(ctx,-35+(a%2)*35,-35+Math.floor(a/2)*35,30,30,2);ctx.fill();}`
          : `fill(ctx,'${c2}');rect(ctx,-38,-38,76,76,2);ctx.fill();pen(ctx,'${c3}',1.5);ctx.stroke();`,
      ].join('');
    case 'rect':
      return [
        `fill(ctx,'${c}');rect(ctx,-${72 + sk},-${14 + (i % 6)},${144 + sk * 2},${28 + (i % 8)},${3 + (i % 3)});ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `for(let t=0;t<${8 + (i % 5)};t++){pen(ctx,'${c2}',1);ctx.beginPath();ctx.moveTo(-${60 + sk}+t*${8 + (i % 3)},-${14 + (i % 6)});ctx.lineTo(-${60 + sk}+t*${8 + (i % 3)},${14 + (i % 6)});ctx.stroke();}`,
      ].join('');
    case 'triangle':
      return [
        `fill(ctx,'${c}');tri(ctx,-${48 + (i % 5)},${30 + (i % 4)},${48 + (i % 5)},${30 + (i % 4)},0,-${38 + (i % 6)});ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `pen(ctx,'${c2}',1.2);for(let t=0;t<3;t++){ctx.beginPath();ctx.moveTo(-20+t*18,-5);ctx.lineTo(-15+t*18,18);ctx.stroke();}`,
      ].join('');
    case 'trapezoid': {
      const top = 36 + (i % 12);
      const bot = 70 + (i % 10);
      return [
        `fill(ctx,'${c}');ctx.beginPath();ctx.moveTo(-${top},-${32 + (i % 6)});ctx.lineTo(${top},-${32 + (i % 6)});ctx.lineTo(${bot},${28 + (i % 8)});ctx.lineTo(-${bot},${28 + (i % 8)});ctx.closePath();ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `fill(ctx,'${c2}');rect(ctx,-${bot - 4},${28 + (i % 8)},${(bot - 4) * 2},${6 + (i % 4)},2);ctx.fill();`,
      ].join('');
    }
    case 'parallelogram':
      return [
        `ctx.save();ctx.rotate(${rot});fill(ctx,'${c}');ctx.beginPath();ctx.moveTo(-55,25);ctx.lineTo(15,-35);ctx.lineTo(55,-25);ctx.lineTo(-15,35);ctx.closePath();ctx.fill();`,
        `pen(ctx,'${c3}',2.5);ctx.stroke();ctx.restore();`,
        `pen(ctx,'${c2}',3);ctx.beginPath();ctx.moveTo(${20 + (i % 8)},${-30 + (i % 6)});ctx.lineTo(${48 + (i % 6)},${-38 + (i % 5)});ctx.lineTo(${42 + (i % 5)},${-28 + (i % 4)});ctx.closePath();ctx.fillStyle='${c3}';ctx.fill();`,
      ].join('');
    case 'rhombus':
      return [
        `fill(ctx,'${c}');ctx.beginPath();ctx.moveTo(0,-${50 + (i % 8)});ctx.lineTo(${44 + (i % 6)},0);ctx.lineTo(0,${50 + (i % 8)});ctx.lineTo(-${44 + (i % 6)},0);ctx.closePath();ctx.fill();`,
        `pen(ctx,'${c3}',2);ctx.stroke();`,
        `fill(ctx,'${c2}');ctx.beginPath();ctx.moveTo(0,-${34 + (i % 5)});ctx.lineTo(${30 + (i % 4)},0);ctx.lineTo(0,${34 + (i % 5)});ctx.lineTo(-${30 + (i % 4)},0);ctx.closePath();ctx.fill();`,
      ].join('');
    default:
      return `fill(ctx,'#94a3b8');rect(ctx,-40,-40,80,80,4);ctx.fill();`;
  }
}

const planned = assertWave3Data();
if (planned.length !== 210) throw new Error(`planned ${planned.length} !== 210`);

const objectLines = [
  "import type { ObjectItem } from './objectBank';",
  '',
  '/** Bổ sung o329–o538 — 1 câu / 1 minh họa (builder o101–o310), cân bằng dạng hình. */',
  'export const OBJECT_SUPPLEMENT_WAVE3: ObjectItem[] = [',
];
const visualLines = [
  "import type { ObjectShape } from './shapeCatalog';",
  '',
  '/** Dạng hình vẽ cho builder o101–o310 (sinh bởi scripts/generate-hinh-hoc-wave3.mjs). */',
  'export const BUILDER_VISUAL_SHAPE_EXTRA: Record<string, ObjectShape> = {',
];
const drawFns = [];
const drawMap = [];

for (let n = 0; n < 210; n++) {
  const objId = `o${String(329 + n).padStart(3, '0')}`;
  const builderId = `o${String(101 + n).padStart(3, '0')}`;
  const { shape, label, minLevel } = planned[n];
  objectLines.push(
    `  { id: '${objId}', label: '${label.replace(/'/g, "\\'")}', shape: '${shape}', minLevel: ${minLevel} },`
  );
  visualLines.push(`  ${builderId}: '${shape}',`);
  const art = artForBuilder(101 + n, shape);
  drawFns.push(`function draw_${builderId}(ctx: Ctx): void {\n  ${art}\n}\n`);
  drawMap.push(`  ${builderId}: draw_${builderId},`);
}

objectLines.push('];', '');
visualLines.push('};', '');

const parts2dExtra = [
  "import type { Ctx } from './helpers';",
  "import { circle, fill, pen, rect, tri } from './helpers';",
  '',
  '/** Minh họa bổ sung o101–o310 — sinh bởi scripts/generate-hinh-hoc-wave3.mjs */',
  'type DrawFn = (ctx: Ctx) => void;',
  '',
  ...drawFns,
  'export const BUILDER_DRAW_EXTRA: Record<string, DrawFn> = {',
  ...drawMap,
  '};',
  '',
].join('\n');

const illustrationMap = [
  "import type { ObjectShape } from './shapeCatalog';",
  "import { BUILDER_VISUAL_SHAPE } from './builderVisualShape';",
  "import { BUILDER_VISUAL_SHAPE_EXTRA } from './builderVisualShapeExtra';",
  '',
  'const ALL_BUILDER_SHAPE = { ...BUILDER_VISUAL_SHAPE, ...BUILDER_VISUAL_SHAPE_EXTRA };',
  '',
  '/** Mỗi mục wave3 → builder riêng (1:1), sinh bởi scripts/generate-hinh-hoc-wave3.mjs */',
  'export const WAVE3_ILLUSTRATION_BUILDER: Record<string, string> = {',
];
for (let n = 0; n < 210; n++) {
  const objId = `o${String(329 + n).padStart(3, '0')}`;
  const builderId = `o${String(101 + n).padStart(3, '0')}`;
  illustrationMap.push(`  ${objId}: '${builderId}',`);
}
illustrationMap.push(
  '};',
  '',
  'export function wave3IllustrationBuilder(objectId: string, shape: ObjectShape): string | undefined {',
  '  const builder = WAVE3_ILLUSTRATION_BUILDER[objectId];',
  '  if (!builder) return undefined;',
  '  return ALL_BUILDER_SHAPE[builder] === shape ? builder : undefined;',
  '}',
  ''
);

writeFileSync('src/games/hinh-hoc-thang-long/objectSupplementWave3.ts', objectLines.join('\n'));
writeFileSync('src/games/hinh-hoc-thang-long/builderVisualShapeExtra.ts', visualLines.join('\n'));
writeFileSync('src/games/hinh-hoc-thang-long/sketchDraw/parts2dExtra.ts', parts2dExtra);
writeFileSync('src/games/hinh-hoc-thang-long/wave3IllustrationMap.ts', illustrationMap.join('\n'));

console.log('Wrote objectSupplementWave3.ts (210 items)');
console.log('Wrote builderVisualShapeExtra.ts (210 builders)');
console.log('Wrote sketchDraw/parts2dExtra.ts');
console.log('Wrote wave3IllustrationMap.ts (1:1)');
