import type { ObjectShape } from './shapeCatalog';
import { OBJECT_BANK } from './objectBank';
import { normalizeObjectLabel } from './objectResolver';
import { displayLabelForQuestion } from './questionLabel';

const BASE = OBJECT_BANK.filter((o) => parseInt(o.id.slice(1), 10) <= 100);

const LABEL_TO_SHAPE = new Map<string, ObjectShape>();
for (const item of BASE) {
  const key = normalizeObjectLabel(item.label);
  if (!LABEL_TO_SHAPE.has(key)) LABEL_TO_SHAPE.set(key, item.shape);
  const display = normalizeObjectLabel(displayLabelForQuestion(item.label));
  if (!LABEL_TO_SHAPE.has(display)) LABEL_TO_SHAPE.set(display, item.shape);
}

/** Từ khóa → dạng hình (ưu tiên khớp SGK / đồ vật quen). */
const KEYWORD_SHAPE: Array<{ keys: string[]; shape: ObjectShape }> = [
  { keys: ['xúc xắc', 'rubik', 'lego', 'ô bàn cờ', 'gạch', 'cửa sổ', 'khung', 'tofu', 'đậu phụ'], shape: 'square' },
  { keys: ['đồng hồ', 'bánh quy', 'lót ly', 'flan', 'chén', 'đĩa', 'pin '], shape: 'circle' },
  { keys: ['thước', 'bánh phở', 'remote', 'điều khiển', 'cửa', 'hộp bút', 'vở', 'sách', 'tre', 'bamboo'], shape: 'rect' },
  { keys: ['pizza', 'dorito', 'onigiri', 'bánh mì', 'nêm', 'mái', 'nón', 'lều', 'kim tự tháp', 'diều', 'ê-tô', 'eke'], shape: 'triangle' },
  { keys: ['mái nhà', 'mái chùa', 'mái hiên', 'thang'], shape: 'trapezoid' },
  { keys: ['xà beng', 'chuồn chuồn', 'băng dính', 'decal'], shape: 'parallelogram' },
  { keys: ['cờ', 'thoi', 'gạch men', 'kim cương'], shape: 'rhombus' },
];

/** Đáp án đúng theo tên đồ vật (sau chuẩn hóa). */
export function shapeFromDisplayLabel(label: string): ObjectShape {
  const display = normalizeObjectLabel(displayLabelForQuestion(label));
  const direct = LABEL_TO_SHAPE.get(display);
  if (direct) return direct;

  for (const rule of KEYWORD_SHAPE) {
    if (rule.keys.some((k) => display.includes(k))) return rule.shape;
  }

  if (display.includes('tam giác')) return 'triangle';
  if (display.includes('tròn')) return 'circle';
  if (display.includes('vuông')) return 'square';
  if (display.includes('bình hành')) return 'parallelogram';
  if (display.includes('thoi')) return 'rhombus';
  if (display.includes('thang')) return 'trapezoid';
  if (display.includes('chữ nhật') || display.includes('dài')) return 'rect';

  return 'rect';
}
