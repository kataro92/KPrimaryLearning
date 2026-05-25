/**
 * Sửa nhãn + shape bổ sung theo tên đồ vật (không chia ngẫu nhiên).
 * Chạy: npx tsx scripts/fix-hinh-hoc-content.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { OBJECT_BANK } from '../src/games/hinh-hoc-thang-long/objectBank.ts';
import { BUILDER_VISUAL_SHAPE } from '../src/games/hinh-hoc-thang-long/builderVisualShape.ts';
import { displayLabelForQuestion } from '../src/games/hinh-hoc-thang-long/questionLabel.ts';
import { shapeFromDisplayLabel } from '../src/games/hinh-hoc-thang-long/shapeFromLabel.ts';

let bank = readFileSync('src/games/hinh-hoc-thang-long/objectBank.ts', 'utf8');
const baseEnd = bank.indexOf('import { OBJECT_SUPPLEMENT }');

for (const item of OBJECT_BANK.filter((o) => parseInt(o.id.slice(1), 10) <= 100)) {
  const label = displayLabelForQuestion(item.label);
  const shape = BUILDER_VISUAL_SHAPE[item.id] ?? shapeFromDisplayLabel(label);
  bank = bank.replace(
    new RegExp(`\\{ id: '${item.id}', label: '[^']*', shape: '[a-z]+', minLevel: ${item.minLevel} \\}`),
    `{ id: '${item.id}', label: '${label.replace(/'/g, "\\'")}', shape: '${shape}', minLevel: ${item.minLevel} }`
  );
}

const lines = [
  "import type { ObjectItem } from './objectBank';",
  '/** Đồ vật bổ sung — nhãn tự nhiên, shape theo tên đồ vật. */',
  'export const OBJECT_SUPPLEMENT: ObjectItem[] = [',
];

for (const item of OBJECT_BANK.filter((o) => parseInt(o.id.slice(1), 10) > 100)) {
  const label = displayLabelForQuestion(item.label);
  const shape = shapeFromDisplayLabel(label);
  lines.push(
    `  { id: '${item.id}', label: '${label.replace(/'/g, "\\'")}', shape: '${shape}', minLevel: ${item.minLevel} },`
  );
}
lines.push('];', '');

writeFileSync('src/games/hinh-hoc-thang-long/objectBank.ts', bank);
writeFileSync('src/games/hinh-hoc-thang-long/objectSupplement.ts', lines.join('\n'));

console.log('Fixed content.');
