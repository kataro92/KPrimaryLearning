/**
 * Đồng bộ shape đáp án với nét vẽ minh họa.
 * Chạy: npx tsx scripts/sync-hinh-hoc-shapes.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { BUILDER_VISUAL_SHAPE } from '../src/games/hinh-hoc-thang-long/builderVisualShape.ts';
import { OBJECT_BANK } from '../src/games/hinh-hoc-thang-long/objectBank.ts';
import { resolveIllustrationBuilderId } from '../src/games/hinh-hoc-thang-long/illustrationResolver.ts';
import { visualShapeForBuilder } from '../src/games/hinh-hoc-thang-long/builderVisualShape.ts';

function patchShapeInFile(path, id, shape) {
  let src = readFileSync(path, 'utf8');
  const re = new RegExp(`(\\{ id: '${id}', label: '[^']+', shape: ')[a-z]+(')`, 'g');
  src = src.replace(re, `$1${shape}$2`);
  writeFileSync(path, src);
}

const bankPath = 'src/games/hinh-hoc-thang-long/objectBank.ts';
const supPath = 'src/games/hinh-hoc-thang-long/objectSupplement.ts';

for (let n = 1; n <= 100; n++) {
  const id = `o${String(n).padStart(3, '0')}`;
  const shape = BUILDER_VISUAL_SHAPE[id];
  if (shape) patchShapeInFile(bankPath, id, shape);
}

for (const item of OBJECT_BANK) {
  const num = parseInt(item.id.slice(1), 10);
  if (num <= 100) continue;
  const builder = resolveIllustrationBuilderId(item.id, item.label, item.shape);
  const visual = visualShapeForBuilder(builder);
  if (visual) patchShapeInFile(supPath, item.id, visual);
}

console.log('Synced shapes in objectBank (o001–o100) and objectSupplement.');
