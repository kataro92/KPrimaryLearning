/**
 * Gán lại trường shape cho 250 đồ vật — phủ đủ 7 dạng hình lớp 4.
 * Chạy: node scripts/assign-hinh-hoc-shapes.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseItems(src) {
  const items = [];
  for (const m of src.matchAll(
    /\{\s*id:\s*'(o\d+)',\s*label:\s*'([^']+)',\s*shape:\s*'[\w]+',\s*minLevel:\s*([123])\s*\}/g
  )) {
    items.push({ id: m[1], label: m[2], minLevel: Number(m[3]) });
  }
  return items;
}

/** Ưu tiên từ khóa SGK / đồ vật thực tế. */
function inferShape(id, label) {
  const l = label.toLowerCase();
  const n = parseInt(id.slice(1), 10);

  if (/đồng hồ|lót ly|bánh quy|mặt tròn|viên pin|pin tiểu|chén|đĩa|hoa quả tròn|bánh flan|onigiri|phô mai viên|nem rán|brownie tròn/.test(l)) {
    return 'circle';
  }
  if (/mái nhà|mái ngói|mái chùa|mái hiên|mái lều|mái che|mái sóng|nón lá|lều cắm|kim tự tháp|bánh kem|sandwich cắt|pizza|dorito|snack giòn|nêm /.test(l)) {
    if (/kim tự tháp|pizza|dorito|sandwich cắt|onigiri|nêm cá|nêm xà phòng/.test(l)) return 'triangle';
    return 'trapezoid';
  }
  if (/cờ|đuôi nõn|rhombus|hình thoi|viên gạch men|decal|rubik|xếp hình|lego/.test(l)) {
    return 'rhombus';
  }
  if (/bình hành|xà beng|biển báo|chuồn chuồn|cánh diều thân|decal|thẻ bài|khay sách|pallet|dầm gỗ|thanh tre|vải cuộn|băng dính/.test(l)) {
    return 'parallelogram';
  }
  if (/tam giác|nêm |cánh én|cánh buồm|cánh máy|cánh tàu|eke |biển báo giao|wedge|pyramid/.test(l)) {
    return 'triangle';
  }
  if (/vuông|ô bàn cờ|rubik|xúc xắc|gạch lát|gạch hoa|gương|khung|thảm|hộp quà|tofu vuông|sandwich vuông|brownie|mosaic/.test(l)) {
    return 'square';
  }
  if (/chữ nhật|thước|bánh mì|bánh phở|remote|bảng đen|cửa|hộp bút|hộp sữa|vở |sách|thẻ |thớt|ván |pin |bamboo|tre |khay /.test(l)) {
    return 'rect';
  }

  // Phân bổ đều theo id cho phần còn lại
  const shapes = ['square', 'rect', 'triangle', 'parallelogram', 'rhombus', 'trapezoid', 'circle'];
  return shapes[n % shapes.length];
}

function patchFile(path, items) {
  let src = readFileSync(path, 'utf8');
  for (const item of items) {
    const shape = inferShape(item.id, item.label);
    const re = new RegExp(
      `(\\{\\s*id:\\s*'${item.id}',\\s*label:\\s*'${item.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*shape:\\s*)'[a-z]+'`,
      'g'
    );
    src = src.replace(re, `$1'${shape}'`);
  }
  writeFileSync(path, src);
}

const bankPath = join(ROOT, 'src/games/hinh-hoc-thang-long/objectBank.ts');
const supPath = join(ROOT, 'src/games/hinh-hoc-thang-long/objectSupplement.ts');

const bankSrc = readFileSync(bankPath, 'utf8');
const supSrc = readFileSync(supPath, 'utf8');
const baseItems = parseItems(bankSrc);
const supItems = parseItems(supSrc);

patchFile(bankPath, baseItems);
patchFile(supPath, supItems);

const all = [...baseItems, ...supItems].map((i) => ({ ...i, shape: inferShape(i.id, i.label) }));
const counts = {};
for (const i of all) counts[i.shape] = (counts[i.shape] || 0) + 1;
console.log('Assigned shapes:', counts);
