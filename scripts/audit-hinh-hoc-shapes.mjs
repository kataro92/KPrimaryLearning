/**
 * Soát: nhãn câu hỏi + khớp shape đáp án vs minh họa (builder).
 * Chạy: npx tsx scripts/audit-hinh-hoc-shapes.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { OBJECT_BANK } from '../src/games/hinh-hoc-thang-long/objectBank.ts';
import { SHAPE_LABELS } from '../src/games/hinh-hoc-thang-long/shapeCatalog.ts';
import { resolveIllustrationBuilderId } from '../src/games/hinh-hoc-thang-long/illustrationResolver.ts';
import { visualShapeForBuilder } from '../src/games/hinh-hoc-thang-long/builderVisualShape.ts';
import { displayLabelForQuestion } from '../src/games/hinh-hoc-thang-long/questionLabel.ts';

/** Dạng hình mà nét vẽ 2D của builder chủ yếu thể hiện. */
const BUILDER_VISUAL_SHAPE = {
  o001: 'square', o002: 'square', o003: 'square', o004: 'square', o005: 'square',
  o006: 'square', o007: 'square', o008: 'circle', o009: 'square', o010: 'rect',
  o011: 'square', o012: 'circle', o013: 'square', o014: 'rect', o015: 'rect',
  o016: 'square', o017: 'square', o018: 'rhombus', o019: 'circle', o020: 'rect',
  o021: 'square', o022: 'square', o023: 'square', o024: 'square', o025: 'square',
  o026: 'rect', o027: 'square', o028: 'rect', o029: 'square', o030: 'square',
  o031: 'rect', o032: 'rect', o033: 'rect', o034: 'square', o035: 'rect',
  o036: 'rect', o037: 'rect', o038: 'rect', o039: 'rect', o040: 'rect',
  o041: 'rect', o042: 'rect', o043: 'triangle', o044: 'rect', o045: 'rect',
  o046: 'rect', o047: 'rect', o048: 'rect', o049: 'rect', o050: 'rect',
  o051: 'rect', o052: 'rect', o053: 'rect', o054: 'rect', o055: 'rect',
  o056: 'rect', o057: 'rect', o058: 'rect', o059: 'rect', o060: 'rect',
  o061: 'rect', o062: 'rect', o063: 'rect', o064: 'parallelogram', o065: 'rect',
  o066: 'rect', o067: 'rect', o068: 'trapezoid', o069: 'rect', o070: 'triangle',
  o071: 'triangle', o072: 'triangle', o073: 'triangle', o074: 'trapezoid',
  o075: 'triangle', o076: 'triangle', o077: 'trapezoid', o078: 'triangle',
  o079: 'triangle', o080: 'triangle', o081: 'triangle', o082: 'triangle',
  o083: 'trapezoid', o084: 'triangle', o085: 'triangle', o086: 'triangle',
  o087: 'trapezoid', o088: 'triangle', o089: 'triangle', o090: 'triangle',
  o091: 'rect', o092: 'trapezoid', o093: 'rect', o094: 'triangle', o095: 'triangle',
  o096: 'trapezoid', o097: 'triangle', o098: 'triangle', o099: 'triangle', o100: 'square',
};

const grammarBad = [];
const shapeMismatch = [];
const shapeHintConflict = [];

for (const item of OBJECT_BANK) {
  const display = displayLabelForQuestion(item.label);
  if (display !== item.label && /tấm tấm|miếng miếng|tấm tấm/i.test(item.label)) {
    grammarBad.push({ id: item.id, raw: item.label, display });
  }
  if (/^(Tấm|Miếng) (Tấm|Miếng)/i.test(item.label)) {
    grammarBad.push({ id: item.id, raw: item.label, display, note: 'lặp tiền tố' });
  }

  const builder = resolveIllustrationBuilderId(item.id, display, item.shape);
  const visual = visualShapeForBuilder(builder);
  if (visual && visual !== item.shape) {
    shapeMismatch.push({
      id: item.id,
      label: item.label,
      display,
      answer: SHAPE_LABELS[item.shape],
      builder,
      artShows: SHAPE_LABELS[visual],
    });
  }

  const hint = item.label.toLowerCase();
  if (hint.includes('vuông') && item.shape !== 'square' && item.shape !== 'rhombus') {
    shapeHintConflict.push({ id: item.id, label: item.label, answer: item.shape, note: 'nhãn có "vuông"' });
  }
  if (hint.includes('tam giác') && item.shape !== 'triangle') {
    shapeHintConflict.push({ id: item.id, label: item.label, answer: item.shape, note: 'nhãn có tam giác' });
  }
}

console.log('=== Ngữ pháp / nhãn (mẫu) ===', grammarBad.length);
grammarBad.slice(0, 12).forEach((x) => console.log(x.id, '|', x.raw, '→', x.display));

console.log('\n=== Minh họa ≠ đáp án ===', shapeMismatch.length);
shapeMismatch.forEach((x) =>
  console.log(`${x.id} | ${x.label}\n   Đáp án: ${x.answer} | Tranh ( ${x.builder} ): ${x.artShows}`)
);

console.log('\n=== Nhãn gợi ý hình ≠ đáp án ===', shapeHintConflict.length);
shapeHintConflict.slice(0, 20).forEach((x) => console.log(x.id, x.label, '→', x.answer, x.note));

writeFileSync(
  'scripts/data/hinh-hoc-shape-audit.json',
  JSON.stringify({ grammarBad, shapeMismatch, shapeHintConflict }, null, 2)
);
console.log('\nWrote scripts/data/hinh-hoc-shape-audit.json');
