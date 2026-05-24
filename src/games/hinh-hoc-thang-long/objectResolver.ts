import { OBJECT_BANK, type ObjectItem, type ObjectShape } from './objectBank';

const BASE_ITEMS = OBJECT_BANK.filter((o) => parseInt(o.id.slice(1), 10) <= 100);

/** Bỏ tiền tố/hậu tố phụ từ bộ câu hỏi mở rộng để khớp nhãn gốc. */
export function normalizeObjectLabel(label: string): string {
  let s = label.toLowerCase().trim();
  const prefixes = [
    'tấm tấm ',
    'miếng miếng ',
    'tấm ',
    'miếng ',
    'viên ',
    'khối ',
    'cuốn ',
    'hộp ',
    'thẻ ',
    'thanh ',
    'tờ ',
    'cánh ',
    'băng ',
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of prefixes) {
      if (s.startsWith(p)) {
        s = s.slice(p.length);
        changed = true;
        break;
      }
    }
  }
  const suffixes = [' trên bàn', ' ngoài sân', ' vuông', ' dài', ' mỏng', ' tam giác', ' mini'];
  for (const suf of suffixes) {
    if (s.endsWith(suf)) s = s.slice(0, -suf.length);
  }
  return s.trim();
}

const LABEL_TO_BUILDER = new Map<string, string>();
for (const item of BASE_ITEMS) {
  const key = normalizeObjectLabel(item.label);
  if (!LABEL_TO_BUILDER.has(key)) LABEL_TO_BUILDER.set(key, item.id);
}

/** Khớp từ khóa trong nhãn → mẫu procedural o001–o100. */
const KEYWORD_BUILDER: Array<{ keys: string[]; id: string }> = [
  { keys: ['xúc xắc', 'rubik'], id: 'o023' },
  { keys: ['phô mai'], id: 'o027' },
  { keys: ['gương'], id: 'o009' },
  { keys: ['sushi', 'khay sushi'], id: 'o010' },
  { keys: ['brownie', 'chocolate'], id: 'o015' },
  { keys: ['kính'], id: 'o025' },
  { keys: ['đá lát', 'gạch lát', 'gạch mosaic', 'gạch men'], id: 'o002' },
  { keys: ['bánh quy'], id: 'o012' },
  { keys: ['thảm'], id: 'o006' },
  { keys: ['sữa'], id: 'o045' },
  { keys: ['tofu'], id: 'o024' },
  { keys: ['decal'], id: 'o022' },
  { keys: ['xếp hình', 'lego'], id: 'o030' },
  { keys: ['kẹo'], id: 'o033' },
  { keys: ['bìa'], id: 'o014' },
  { keys: ['sandwich'], id: 'o020' },
  { keys: ['flan'], id: 'o029' },
  { keys: ['khung ảnh', 'khung tranh'], id: 'o004' },
  { keys: ['lót bàn', 'lót ly'], id: 'o019' },
  { keys: ['thẻ tên', 'thẻ học', 'thẻ nhớ', 'thẻ từ'], id: 'o044' },
  { keys: ['sách'], id: 'o050' },
  { keys: ['thước'], id: 'o040' },
  { keys: ['hộp bút', 'khay bút', 'khay đựng bút'], id: 'o042' },
  { keys: ['ván gỗ', 'gỗ pallet', 'pallet'], id: 'o067' },
  { keys: ['gạch ống'], id: 'o038' },
  { keys: ['cửa'], id: 'o041' },
  { keys: ['biển báo'], id: 'o037' },
  { keys: ['bánh mì'], id: 'o043' },
  { keys: ['giấy a4', 'giấy'], id: 'o014' },
  { keys: ['remote'], id: 'o063' },
  { keys: ['bảng đen'], id: 'o056' },
  { keys: ['bút chì'], id: 'o051' },
  { keys: ['menu'], id: 'o044' },
  { keys: ['diêm'], id: 'o060' },
  { keys: ['socola'], id: 'o015' },
  { keys: ['pizza'], id: 'o072' },
  { keys: ['nón lá', 'nón'], id: 'o076' },
  { keys: ['ê-tô', 'eke'], id: 'o073' },
  { keys: ['kim tự tháp', 'pyramid'], id: 'o079' },
  { keys: ['cảnh báo', 'biển báo giao'], id: 'o082' },
  { keys: ['cánh diều'], id: 'o080' },
  { keys: ['onigiri'], id: 'o095' },
  { keys: ['dorito', 'snack'], id: 'o099' },
  { keys: ['mái nhà', 'mái ngói', 'mái chùa'], id: 'o068' },
  { keys: ['cờ'], id: 'o069' },
  { keys: ['lều'], id: 'o083' },
  { keys: ['núi'], id: 'o079' },
  { keys: ['đinh ba'], id: 'o082' },
];

const SHAPE_DEFAULT: Record<ObjectShape, string> = {
  square: 'o003',
  rect: 'o040',
  triangle: 'o072',
};

export function getObjectItem(objectId: string): ObjectItem | undefined {
  return OBJECT_BANK.find((o) => o.id === objectId);
}

/** ID builder procedural (o001–o100) cho mọi mục trong ngân hàng. */
export function resolveBuilderId(objectId: string, label: string, shape: ObjectShape): string {
  const num = parseInt(objectId.slice(1), 10);
  if (num >= 1 && num <= 100) return objectId;

  const norm = normalizeObjectLabel(label);
  const direct = LABEL_TO_BUILDER.get(norm);
  if (direct) return direct;

  for (const rule of KEYWORD_BUILDER) {
    if (rule.keys.some((k) => norm.includes(k))) return rule.id;
  }

  for (const item of BASE_ITEMS) {
    const base = normalizeObjectLabel(item.label);
    if (norm.includes(base) || base.includes(norm)) return item.id;
  }

  return SHAPE_DEFAULT[shape];
}
