#!/usr/bin/env node
/**
 * Sinh ngân hàng câu hỏi bổ sung lớp 4 (HK1/HK2) — tham chiếu ma trận đề thi
 * Kết nối tri thức / Chân trời sáng tạo (2021–2025).
 * Chạy: node scripts/generate-grade4-question-banks.mjs
 * Nguồn tham khảo: docs/content/EXAM_SOURCES_GRADE4.md (55+ đề, 2020–2025)
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE_META = JSON.parse(
  readFileSync(join(__dirname, 'exam-sources-grade4.json'), 'utf8')
);
const SOURCE_REF = `Tham chiếu ${SOURCE_META.sourceCount} nguồn đề lớp 4 (${SOURCE_META.yearRange}) — xem docs/content/EXAM_SOURCES_GRADE4.md`;

function writeTs(relPath, header, body) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  const content = `${header}\n${body}\n`;
  writeFileSync(full, content, 'utf8');
  console.log('wrote', relPath, `(${content.length} bytes)`);
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function mcq(prompt, answer, wrong) {
  const pool = new Set(wrong.filter((w) => w !== answer && w >= 0));
  while (pool.size < 3) pool.add(answer + pool.size + 1);
  const nums = [answer, ...Array.from(pool).slice(0, 3)].sort(() => Math.random() - 0.5);
  const choices = nums.map(String);
  return { prompt, choices, correctIndex: choices.indexOf(String(answer)) };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ——— Toán: trắc nghiệm (đề HK1/HK2) ———
function buildMathMcqBank(count = 160) {
  const out = [];
  const seen = new Set();
  const templates = [
    () => {
      const a = randInt(100, 9999);
      const b = randInt(10, 999);
      return mcq(`${a} + ${b} = ?`, a + b, [a + b + 10, a + b - 10, a + b + 1]);
    },
    () => {
      const a = randInt(500, 9999);
      const b = randInt(10, 499);
      return mcq(`${a} - ${b} = ?`, a - b, [a - b + 10, a - b - 10, a - b + 1]);
    },
    () => {
      const a = randInt(2, 12);
      const b = randInt(2, 12);
      return mcq(`${a} × ${b} = ?`, a * b, [a * b + b, a * b - a, a + b]);
    },
    () => {
      const b = randInt(2, 9);
      const ans = randInt(2, 12);
      const a = b * ans;
      return mcq(`${a} : ${b} = ?`, ans, [ans + 1, Math.max(1, ans - 1), b]);
    },
    () => {
      const side = randInt(3, 25);
      return mcq(`Hình vuông cạnh ${side} cm có chu vi bao nhiêu cm?`, side * 4, [side * 2, side * 3, side * 5]);
    },
    () => {
      const d = randInt(5, 20);
      const r = randInt(3, 15);
      return mcq(`Hình chữ nhật dài ${d} cm, rộng ${r} cm. Diện tích là?`, d * r, [(d + r) * 2, d + r, d * r + d]);
    },
    () => {
      const d = randInt(6, 22);
      const r = randInt(4, 14);
      return mcq(`Hình chữ nhật dài ${d} cm, rộng ${r} cm. Chu vi là?`, (d + r) * 2, [d * r, d + r, (d + r) * 2 + 4]);
    },
    () => {
      const n = randInt(4, 30);
      return mcq(`Một phần tư số ${n * 4} là bao nhiêu?`, n, [n + 1, n - 1, n * 4]);
    },
    () => {
      const n = randInt(5, 40);
      return mcq(`Một nửa số ${n * 2} là bao nhiêu?`, n, [n + 1, n - 1, n * 2]);
    },
    () => {
      const kg = randInt(2, 15);
      const g = randInt(100, 900);
      const total = kg * 1000 + g;
      return mcq(`${kg} kg ${g} g = ? g`, total, [total + 100, total - 100, kg + g]);
    },
    () => {
      const km = randInt(1, 9);
      const m = randInt(100, 900);
      return mcq(`${km} km ${m} m = ? m`, km * 1000 + m, [km * 100 + m, km * 1000 - m, km + m]);
    },
    () => {
      const packs = randInt(3, 12);
      const each = randInt(4, 15);
      const total = packs * each;
      return mcq(`Có ${packs} hộp, mỗi hộp ${each} cái bút. Có tất cả bao nhiêu cái bút?`, total, [packs + each, total - each, total + packs]);
    },
    () => {
      const total = randInt(40, 120);
      const give = randInt(5, 35);
      return mcq(`Lan có ${total} viên bi, cho bạn ${give} viên. Lan còn bao nhiêu viên?`, total - give, [total - give + 1, give, total]);
    },
    () => {
      const a = randInt(3, 9);
      const b = randInt(2, 8);
      const c = randInt(1, 7);
      const ans = a * b + c;
      return mcq(`${a} × ${b} + ${c} = ?`, ans, [a * b, a + b + c, ans - 1]);
    },
    () => {
      const price = randInt(3, 9) * 1000;
      const qty = randInt(2, 5);
      return mcq(`Mỗi quyển vở ${price} đồng. Mua ${qty} quyển hết bao nhiêu đồng?`, price * qty, [price + qty, price * qty + 1000, price * (qty - 1)]);
    },
    () => {
      const year = randInt(2010, 2020);
      const century = Math.floor(year / 100) + 1;
      return mcq(`Năm ${year} thuộc thế kỷ nào?`, century, [century + 1, century - 1, century + 2]);
    },
    () => {
      const a = randInt(4, 12);
      const b = randInt(3, 9);
      const c = randInt(2, 6);
      const ans = a * (b + c);
      return mcq(`${a} × (${b} + ${c}) = ?`, ans, [a * b + c, a * b, ans + a]);
    },
  ];
  let attempts = 0;
  while (out.length < count && attempts < count * 30) {
    attempts++;
    const q = templates[randInt(0, templates.length - 1)]();
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    out.push(q);
  }
  return out;
}

function buildMathTextBank(count = 160) {
  const out = [];
  const seen = new Set();
  const templates = [
    () => {
      const a = randInt(10, 99);
      const b = randInt(10, 99);
      return { text: `${a} + ${b}`, answer: a + b };
    },
    () => {
      const a = randInt(50, 200);
      const b = randInt(10, 49);
      return { text: `${a} - ${b}`, answer: a - b };
    },
    () => {
      const a = randInt(2, 12);
      const b = randInt(2, 9);
      return { text: `${a} × ${b}`, answer: a * b };
    },
    () => {
      const b = randInt(2, 9);
      const ans = randInt(2, 12);
      return { text: `${b * ans} : ${b}`, answer: ans };
    },
    () => {
      const side = randInt(3, 18);
      return { text: `Chu vi HV cạnh ${side}cm`, answer: side * 4 };
    },
    () => {
      const d = randInt(6, 18);
      const r = randInt(4, 12);
      return { text: `Diện tích HCN ${d}×${r}`, answer: d * r };
    },
    () => {
      const n = randInt(4, 25);
      return { text: `1/4 của ${n * 4}`, answer: n };
    },
    () => {
      const packs = randInt(3, 10);
      const each = randInt(4, 12);
      return { text: `${packs} túi × ${each} viên`, answer: packs * each };
    },
    () => {
      const a = randInt(3, 9);
      const b = randInt(2, 8);
      const c = randInt(1, 6);
      return { text: `${a}×${b}+${c}`, answer: a * b + c };
    },
    () => {
      const a = randInt(3, 9);
      const b = randInt(2, 7);
      const c = randInt(1, 5);
      return { text: `${a}×(${b}+${c})`, answer: a * (b + c) };
    },
    () => {
      const tables = [6, 7, 8, 9, 11, 12];
      const a = tables[randInt(0, tables.length - 1)];
      const b = randInt(2, 12);
      return { text: `${a} × ${b}`, answer: a * b };
    },
    () => {
      const total = randInt(200, 900);
      const q = randInt(10, 99);
      return { text: `${total} + ${q}`, answer: total + q };
    },
  ];
  let attempts = 0;
  while (out.length < count && attempts < count * 30) {
    attempts++;
    const q = templates[randInt(0, templates.length - 1)]();
    if (seen.has(q.text)) continue;
    seen.add(q.text);
    out.push(q);
  }
  return out;
}

/** Wave 2 — ma trận GK1/HK2 (S15–S25, S16–S19): làm tròn, biểu thức, tổng-hiệu, thời gian, phân số */
function buildMathMcqBankExtra(count = 150) {
  const out = [];
  const seen = new Set();
  const templates = [
    () => {
      const n = randInt(1000, 99999);
      const rounded = Math.round(n / 1000) * 1000;
      return mcq(`Làm tròn ${n} đến hàng nghìn được số nào?`, rounded, [rounded + 1000, rounded - 1000, rounded + 100]);
    },
    () => {
      const a = randInt(2, 12);
      const b = randInt(2, 9);
      const c = randInt(1, 6);
      return mcq(`Giá trị ${a} × ${b} × ${c} = ?`, a * b * c, [a * b + c, a + b * c, a * b * c + 1]);
    },
    () => {
      const h = randInt(1, 11);
      const m = randInt(10, 59);
      return mcq(`${h} giờ ${m} phút = ? phút`, h * 60 + m, [h * 60 + m + 10, h + m, h * 100 + m]);
    },
    () => {
      const sum = randInt(200, 800);
      const diff = randInt(10, 120);
      const big = (sum + diff) / 2;
      return mcq(`Tổng hai số là ${sum}, hiệu là ${diff}. Số lớn là?`, big, [big + 1, big - 1, sum - big]);
    },
    () => {
      const bags = randInt(5, 12);
      const each = randInt(4, 15);
      const sold = randInt(1, bags - 1);
      return mcq(`Có ${bags} bao, mỗi bao ${each} kg. Bán ${sold} bao còn bao nhiêu kg?`, (bags - sold) * each, [
        bags * each,
        sold * each,
        (bags - sold) * each + each,
      ]);
    },
    () => {
      const chép = randInt(40, 120);
      const ro = randInt(10, 50);
      const total = chép + ro;
      return mcq(`Ao có ${total} con cá gồm cá chép và cá rô. Cá chép ${chép} con. Cá rô có bao nhiêu con?`, ro, [chép, total, ro + 10]);
    },
    () => {
      const whole = randInt(12, 48);
      const half = whole / 2;
      const quarter = whole / 4;
      return mcq(`1/2 của ${whole} bằng bao nhiêu?`, half, [quarter, whole, half + 2]);
    },
    () => {
      const n = randInt(5, 25);
      return mcq(`1/4 của ${n * 4} bằng bao nhiêu?`, n, [n + 1, n * 2, n - 1]);
    },
    () => {
      const a = randInt(10000, 99999);
      const digit = 9;
      const place = [10000, 1000, 100, 10, 1];
      const s = String(a);
      const pos = randInt(0, s.length - 1);
      const val = Number(s[pos]) * place[5 - s.length + pos] || 1;
      return mcq(`Giá trị chữ số ${s[pos]} trong số ${a} là?`, Number(s[pos]) * Math.pow(10, s.length - 1 - pos), [
        Number(s[pos]),
        val + 10,
        val - 1,
      ]);
    },
    () => {
      const packs = randInt(4, 9);
      const each = randInt(5, 12);
      const n = randInt(2, packs - 1);
      return mcq(`${packs} hộp, mỗi hộp ${each} cái. Lấy ${n} hộp được bao nhiêu cái?`, n * each, [packs * each, each, n + each]);
    },
    () => {
      const p = randInt(200, 900);
      const q = randInt(100, 999);
      const r = randInt(1, 9);
      return mcq(`${p} + ${q} × ${r} = ?`, p + q * r, [p + q + r, q * r, p + q * r + 10]);
    },
    () => {
      const length = randInt(8, 30);
      const width = randInt(5, 15);
      const area = length * width;
      return mcq(`Mảnh đất dài ${length}m, rộng ${width}m. Diện tích bao nhiêu m²?`, area, [(length + width) * 2, length + width, area + length]);
    },
  ];
  let attempts = 0;
  while (out.length < count && attempts < count * 40) {
    attempts++;
    const q = templates[randInt(0, templates.length - 1)]();
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    out.push(q);
  }
  return out;
}

function buildMathTextBankExtra(count = 150) {
  const out = [];
  const seen = new Set();
  const templates = [
    () => {
      const h = randInt(1, 10);
      const m = randInt(10, 50);
      return { text: `${h}g${m}p→phút`, answer: h * 60 + m };
    },
    () => {
      const sum = randInt(100, 500);
      const diff = randInt(10, 80);
      const big = (sum + diff) / 2;
      return { text: `TH: tổng ${sum} hiệu ${diff}`, answer: big };
    },
    () => {
      const n = randInt(6, 30);
      return { text: `1/2 của ${n * 2} so 1/4 ${n * 4}`, answer: n };
    },
    () => {
      const a = randInt(3, 9);
      const b = randInt(2, 8);
      const c = randInt(1, 5);
      return { text: `${a}×${b}×${c}`, answer: a * b * c };
    },
    () => {
      const p = randInt(100, 500);
      const q = randInt(10, 99);
      const r = randInt(2, 8);
      return { text: `${p}+${q}×${r}`, answer: p + q * r };
    },
    () => {
      const bags = randInt(4, 10);
      const each = randInt(5, 12);
      const sold = randInt(1, bags - 1);
      return { text: `${bags} bao ${each}kg bán ${sold}`, answer: (bags - sold) * each };
    },
  ];
  let attempts = 0;
  while (out.length < count && attempts < count * 40) {
    attempts++;
    const q = templates[randInt(0, templates.length - 1)]();
    if (seen.has(q.text)) continue;
    seen.add(q.text);
    out.push(q);
  }
  return out;
}

// ——— Tiếng Việt: s/x, ch/tr, d/gi/r ———
const SX_WORDS = [
  ['sao', 'xao', 'sau', 'xau'], ['xinh', 'sinh', 'xịn', 'sin'], ['sắn', 'xắn', 'sân', 'xân'],
  ['sóng', 'xóng', 'sông', 'xông'], ['sáng', 'xáng', 'san', 'xan'], ['soạn', 'xoạn', 'soan', 'xoan'],
  ['sen', 'xen', 'san', 'xén'], ['sương', 'xương', 'sươn', 'xươn'], ['sung', 'xung', 'sum', 'xum'],
  ['sữa', 'xữa', 'sửa', 'xửa'], ['sưởi', 'xưởi', 'sưỡi', 'xưỡi'], ['sẻ', 'xẻ', 'sế', 'xế'],
  ['sơn', 'xơn', 'son', 'xon'], ['sút', 'xút', 'súc', 'xúc'], ['xuân', 'suân', 'xân', 'suân'],
  ['xanh', 'sanh', 'san', 'xan'], ['xúc', 'súc', 'súc động', 'xúc động'], ['xóm', 'sóm', 'xom', 'som'],
  ['xấu', 'sấu', 'xẩu', 'sẩu'], ['siêng', 'xiêng', 'siêng năng', 'xiêng năng'], ['sàn', 'xàn', 'san', 'xach'],
  ['xưa', 'sưa', 'xừa', 'sưa kia'], ['xào', 'sào', 'xao', 'sao'], ['sào', 'xào', 'xao', 'sao'],
  ['xúm', 'súm', 'xum', 'sum'], ['sơ', 'xơ', 'so', 'xo'], ['xối', 'sối', 'xoi', 'soi'],
  ['sát', 'xát', 'sat', 'xat'], ['suối', 'xuối', 'suoi', 'xuoi'], ['sạch', 'xạch', 'sach', 'xach'],
  ['xót', 'sót', 'xot', 'sot'], ['sót', 'xót', 'sot', 'xot'], ['xén', 'sén', 'xen', 'sen'],
  ['xới', 'sới', 'xoi', 'soi'], ['sới', 'xới', 'soi', 'xoi'], ['sán', 'xán', 'san', 'xan'],
  ['sưu tầm', 'xưu tầm', 'sưu', 'xưu'], ['xinh đẹp', 'sinh đẹp', 'xinh xắn', 'sinh xắn'],
  ['sư tử', 'xư tử', 'sư', 'xư'], ['xoa', 'soa', 'xoa đầu', 'soa đầu'], ['sao băng', 'xao băng', 'sao chổi', 'xao chổi'],
  ['sương mù', 'xương mù', 'sương mai', 'xương mai'], ['xum xếp', 'sum xếp', 'xum', 'sum'],
  ['sấm sét', 'xấm sét', 'sấm', 'xấm'], ['xao xuyến', 'sao xuyến', 'xao', 'sao'],
  ['sinh hoạt', 'xinh hoạt', 'sinh', 'xinh'], ['xung quanh', 'sung quanh', 'xung', 'sung'],
  ['sơ đồ', 'xơ đồ', 'sơ', 'xơ'], ['xung phong', 'sung phong', 'xung', 'sung'],
  ['sư phụ', 'xư phụ', 'sư', 'xư'], ['xung đột', 'sung đột', 'xung', 'sung'],
  ['sơ sinh', 'xơ sinh', 'sơ', 'xơ'], ['xung khắc', 'sung khắc', 'xung', 'sung'],
];

const CHTR_WORDS = [
  ['chăm', 'trăm', 'chăm chỉ', 'trăng'], ['trường', 'chường', 'trườn', 'chườn'],
  ['trình bày', 'chình bày', 'trình', 'chình'], ['bác', 'trác', 'bách', 'trác sĩ'],
  ['trang nghiêm', 'chang nghiêm', 'trang', 'chang'], ['tre', 'che', 'cre', 'tre xanh'],
  ['trồng', 'chồng', 'trồng cây', 'chồng cây'], ['trĩu', 'chĩu', 'trĩu quả', 'chĩu quả'],
  ['trong', 'chong', 'trong veo', 'chong veo'], ['trước', 'chước', 'trước cổng', 'chước cổng'],
  ['chạy', 'trạy', 'chạy bộ', 'trạy bộ'], ['trả lời', 'chả lời', 'trả', 'chả'],
  ['chân', 'trân', 'chân tay', 'trân tay'], ['chảo', 'trảo', 'chảo nấu', 'trảo nấu'],
  ['chưa', 'trưa', 'chưa xong', 'trưa xong'], ['chê', 'trê', 'chê bai', 'trê bai'],
  ['chép', 'trép', 'chép bài', 'trép bài'], ['chấm', 'trấm', 'chấm điểm', 'trấm điểm'],
  ['nhảy', 'trảy', 'chảy', 'nhảy dây'], ['chan', 'tran', 'chan nước', 'tran nước'],
  ['chim', 'trim', 'chim chóc', 'trim chóc'], ['trời', 'chời', 'trời đẹp', 'chời đẹp'],
  ['chữ', 'trữ', 'chữ viết', 'trữ viết'], ['trẻ', 'chẻ', 'trẻ em', 'chẻ em'],
  ['chợ', 'trợ', 'chợ quê', 'trợ quê'], ['truyện', 'chuyện', 'truyện cổ', 'chuyện cổ'],
  ['chính', 'trính', 'chính xác', 'trính xác'], ['trung thành', 'chung thành', 'trung', 'chung'],
  ['chung', 'trung', 'chung tay', 'trung tay'], ['trách nhiệm', 'chách nhiệm', 'trách', 'chách'],
  ['chọn', 'trọn', 'chọn lọc', 'trọn lọc'], ['trong lành', 'chong lành', 'trong', 'chong'],
  ['chăm sóc', 'trăm sóc', 'chăm', 'trăm'], ['truyền thống', 'chuyền thống', 'truyền', 'chuyền'],
  ['chúc mừng', 'trúc mừng', 'chúc', 'trúc'], ['trân trọng', 'chân trọng', 'trân', 'chân'],
  ['chủ nhật', 'trủ nhật', 'chủ', 'trủ'], ['trưa nay', 'chưa nay', 'trưa', 'chưa'],
  ['chăn nuôi', 'trăn nuôi', 'chăn', 'trăn'], ['trồng trọt', 'chồng trọt', 'trồng', 'chồng'],
  ['chăm chỉ', 'trăm chỉ', 'chăm', 'trăm'], ['trí tuệ', 'chí tuệ', 'trí', 'chí'],
  ['chính trực', 'trính trực', 'chính', 'trính'], ['trung bình', 'chung bình', 'trung', 'chung'],
  ['chung sức', 'trung sức', 'chung', 'trung'], ['truyền đạt', 'chuyền đạt', 'truyền', 'chuyền'],
  ['chủ động', 'trủ động', 'chủ', 'trủ'], ['trung kiên', 'chung kiên', 'trung', 'chung'],
];

const DGR_WORDS = [
  ['đại', 'dại', 'giải', 'rại'], ['biết', 'diet', 'riet', 'giet'], ['chảy', 'trảy', 'giảy', 'rảy'],
  ['chu đáo', 'tru đáo', 'giu đáo', 'riu đáo'], ['trôi', 'chôi', 'giôi', 'rôi'], ['kể', 'cể', 'gể', 'rể'],
  ['đi', 'ri', 'gi', 'di'], ['đỏ', 'rỏ', 'giỏ', 'dỏ'], ['giỏi', 'dỏi', 'rỏi', 'giỏi giang'],
  ['dễ', 'giễ', 'rễ', 'dễ làm'], ['ra', 'da', 'gra', 'ra sân'], ['đẹp', 'rẹp', 'giẹp', 'dẹp'],
  ['đứng', 'rứng', 'giứng', 'dứng'], ['đọc', 'rọc', 'giọc', 'dọc'], ['đúng', 'rúng', 'giúng', 'dúng'],
  ['điểm', 'riểm', 'giểm', 'diểm'], ['đạt', 'rạt', 'giạt', 'dạt'], ['đều', 'rều', 'giều', 'dều'],
  ['đặt', 'rặt', 'giặt', 'dặt'], ['đổi', 'rổi', 'giổi', 'dổi'], ['đợi', 'rợi', 'giợi', 'dợi'],
  ['đá', 'rá', 'giá', 'dá'], ['đầy', 'rầy', 'giầy', 'dầy'], ['đủ', 'rủ', 'giủ', 'dủ'],
  ['đưa', 'rưa', 'giưa', 'dưa'], ['đón', 'rón', 'gión', 'dón'], ['đạp', 'ráp', 'giáp', 'dáp'],
  ['đánh', 'ránh', 'giánh', 'dánh'], ['đỡ', 'rỡ', 'giỡ', 'dỡ'], ['đồng', 'rồng', 'giồng', 'dồng'],
  ['đất', 'rất', 'giất', 'dất'], ['đường', 'rường', 'giường', 'dường'], ['đội', 'rội', 'giội', 'dội'],
  ['động', 'rộng', 'giộng', 'dộng'], ['đoàn', 'roàn', 'gioàn', 'doàn'], ['đoạt', 'roạt', 'gioạt', 'doạt'],
  ['đoạn', 'roạn', 'gioạn', 'doạn'], ['đo lường', 'ro lường', 'gio lường', 'do lường'],
  ['đoàn kết', 'roàn kết', 'gioàn kết', 'doàn kết'], ['đoàn viên', 'roàn viên', 'gioàn viên', 'doàn viên'],
];

const LN_WORDS = [
  ['lá', 'ná', 'la', 'na'], ['làm', 'nàm', 'lam', 'nam'], ['lúa', 'núa', 'lua', 'nua'],
  ['lợn', 'nợn', 'lon', 'non'], ['lời', 'nời', 'loi', 'noi'], ['lạ', 'nạ', 'la', 'na'],
  ['lòng', 'nòng', 'long', 'nong'], ['lấy', 'nấy', 'lay', 'nay'], ['lắng', 'nắng', 'lang', 'nang'],
  ['lặng', 'nặng', 'lang', 'nang'], ['lười', 'nười', 'luoi', 'nuoi'], ['lướt', 'nướt', 'luot', 'nuot'],
  ['loài', 'noài', 'loai', 'noai'], ['lối', 'nối', 'loi', 'noi'], ['lội', 'nội', 'loi', 'noi'],
  ['lơ', 'nơ', 'lo', 'no'], ['lơ đãng', 'nơ đãng', 'lơ lửng', 'nơ lửng'],
  ['lao động', 'nao động', 'lao', 'nao'], ['lạnh', 'nạnh', 'lanh', 'nanh'],
  ['lấp lánh', 'nấp lánh', 'lap lanh', 'nap nanh'], ['lần', 'nần', 'lan', 'nan'],
  ['lẫn', 'nẫn', 'lan', 'nan'], ['lập', 'nập', 'lap', 'nap'],
];

const CHTR_EXTRA = [
  ['trí nhớ', 'chí nhớ', 'trí', 'chí'], ['trách', 'chách', 'trach', 'chach'],
  ['trốn', 'chốn', 'tron', 'chon'], ['trúc', 'chúc', 'truc', 'chuc'],
  ['trượt', 'chượt', 'truot', 'chuot'], ['trượng', 'chượng', 'truong', 'chuong'],
  ['truyền', 'chuyền', 'truyen', 'chuyen'], ['truyện', 'chuyện', 'truyen', 'chuyen'],
  ['trừng phạt', 'chừng phạt', 'trung phat', 'chung phat'],
];
CHTR_WORDS.push(...CHTR_EXTRA);
DGR_WORDS.push(...LN_WORDS);

const SPELL_CTX_UNIVERSAL = [
  ['Cô giáo đọc từ ', ' cho lớp nghe.'],
  ['Em tập viết chữ ', '.'],
  ['Trong bài có từ ', '.'],
  ['Các bạn đọc to từ ', '.'],
  ['Sách giáo khoa có từ ', '.'],
  ['Cô hướng dẫn viết từ ', '.'],
  ['Em chọn đúng từ ', '.'],
  ['Đoạn văn có chữ ', ' rất hay.'],
];

function parseSpellingBankFile(relPath) {
  const text = readFileSync(join(ROOT, relPath), 'utf8');
  const items = [];
  const re =
    /before:\s*'((?:\\'|[^'])*)',\s*after:\s*'((?:\\'|[^'])*)',\s*answer:\s*'((?:\\'|[^'])*)',\s*distractors:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(text))) {
    const distractors = [...m[4].matchAll(/'((?:\\'|[^'])*)'/g)].map((x) => x[1].replace(/\\'/g, "'"));
    items.push({
      before: m[1].replace(/\\'/g, "'"),
      after: m[2].replace(/\\'/g, "'"),
      answer: m[3].replace(/\\'/g, "'"),
      distractors,
    });
  }
  return items;
}

function fullSentence(before, answer, after) {
  return `${before}${answer}${after}`.replace(/\s+/g, ' ').trim();
}

/** Loại khung câu gắn sai nghĩa (sinh tự động cũ) */
function isValidSpellingSentence(before, answer, after) {
  const sent = fullSentence(before, answer, after);
  if (/Bạn Nam học rất .+ \./.test(sent) && !['chăm', 'chăm chỉ', 'siêng', 'siêng năng'].includes(answer)) return false;
  if (/Chúng em đến .+ học\./.test(sent) && answer !== 'trường') return false;
  if (/Trên bầu trời có .+ \./.test(sent) && !['sao', 'sao băng', 'sao chổi', 'mây', 'sương mù'].includes(answer)) return false;
  if (/Bé Lan rất .+ \./.test(sent) && !['xinh', 'xinh đẹp', 'ngoan'].includes(answer)) return false;
  if (/Hôm nay trời .+ quang\./.test(sent)) return false;
  if (/Chúng em .+ ơn thầy/.test(sent) && answer !== 'biết') return false;
  if (/Việc này rất .+ \./.test(sent) && !['dễ', 'khó', 'hay', 'đẹp'].includes(answer)) return false;
  if (sent.includes('  ')) return false;
  return true;
}

function buildSpellingSupplement(words, hint, mainBankRelPath, target = 150) {
  const main = parseSpellingBankFile(mainBankRelPath);
  const mainKeys = new Set(main.map((c) => `${c.before}|${c.answer}|${c.after}`));
  const ctxByAnswer = new Map(main.map((c) => [c.answer, [c.before, c.after]]));
  const out = [];
  let u = 0;
  let i = 0;
  while (out.length < target && i < words.length * 4) {
    const [answer, ...distractors] = words[i % words.length];
    i++;
    let before;
    let after;
    if (ctxByAnswer.has(answer) && !out.some((o) => o.answer === answer)) {
      [before, after] = ctxByAnswer.get(answer);
    } else {
      [before, after] = SPELL_CTX_UNIVERSAL[u % SPELL_CTX_UNIVERSAL.length];
      u++;
    }
    if (!isValidSpellingSentence(before, answer, after)) {
      [before, after] = SPELL_CTX_UNIVERSAL[u % SPELL_CTX_UNIVERSAL.length];
      u++;
    }
    const key = `${before}|${answer}|${after}`;
    if (mainKeys.has(key) || out.some((o) => `${o.before}|${o.answer}|${o.after}` === key)) continue;
    out.push({ before, after, answer, distractors: distractors.slice(0, 3), hint });
  }
  return out;
}

// ——— Tiếng Anh ———
const EN_VI_PAIRS = [
  ['classroom', 'lớp học', '🏫'], ['homework', 'bài tập về nhà', '📝'], ['subject', 'môn học', '📖'],
  ['pencil case', 'hộp bút', '✏️'], ['ruler', 'thước kẻ', '📏'], ['eraser', 'cục tẩy', '🧽'],
  ['chalk', 'phấn', '🖍️'], ['uniform', 'đồng phục', '👔'], ['playground', 'sân chơi', '🛝'],
  ['cousin', 'anh chị em họ', '👧'], ['grandparents', 'ông bà', '👴'], ['nephew', 'cháu trai', '👦'],
  ['niece', 'cháu gái', '👧'], ['neighbor', 'hàng xóm', '🏘️'], ['relative', 'người thân', '👪'],
  ['buffalo', 'con trâu', '🐃'], ['goat', 'con dê', '🐐'], ['duck', 'con vịt', '🦆'],
  ['chicken', 'con gà', '🐔'], ['pig', 'con lợn', '🐷'], ['sheep', 'con cừu', '🐑'],
  ['tiger', 'con hổ', '🐯'], ['bear', 'con gấu', '🐻'], ['wolf', 'con sói', '🐺'],
  ['peach', 'quả đào', '🍑'], ['grape', 'quả nho', '🍇'], ['mango', 'quả xoài', '🥭'],
  ['pineapple', 'quả dứa', '🍍'], ['carrot', 'củ cà rốt', '🥕'], ['potato', 'củ khoai tây', '🥔'],
  ['onion', 'củ hành', '🧅'], ['tomato', 'quả cà chua', '🍅'], ['cabbage', 'cải bắp', '🥬'],
  ['noodle', 'mì', '🍜'], ['soup', 'súp', '🥣'], ['sandwich', 'bánh mì kẹp', '🥪'],
  ['juice', 'nước ép', '🧃'], ['biscuit', 'bánh quy', '🍪'], ['yogurt', 'sữa chua', '🥛'],
  ['doctor', 'bác sĩ', '👨‍⚕️'], ['nurse', 'y tá', '👩‍⚕️'], ['police officer', 'cảnh sát', '👮'],
  ['firefighter', 'lính cứu hỏa', '🚒'], ['engineer', 'kỹ sư', '👷'], ['artist', 'họa sĩ', '🎨'],
  ['musician', 'nhạc sĩ', '🎵'], ['athlete', 'vận động viên', '🏃'], ['pilot', 'phi công', '✈️'],
  ['post office', 'bưu điện', '📮'], ['supermarket', 'siêu thị', '🛒'], ['bakery', 'tiệm bánh', '🥖'],
  ['pharmacy', 'nhà thuốc', '💊'], ['stadium', 'sân vận động', '🏟️'], ['museum', 'bảo tàng', '🏛️'],
  ['castle', 'lâu đài', '🏰'], ['village', 'làng quê', '🏡'], ['countryside', 'nông thôn', '🌾'],
  ['desert', 'sa mạc', '🏜️'], ['island', 'hòn đảo', '🏝️'], ['waterfall', 'thác nước', '💦'],
  ['volcano', 'núi lửa', '🌋'], ['rainbow', 'cầu vồng', '🌈'], ['storm', 'bão', '🌪️'],
  ['foggy', 'có sương mù', '🌫️'], ['windy', 'có gió', '💨'], ['cloudy', 'nhiều mây', '☁️'],
  ['sunny', 'nắng', '☀️'], ['snowy', 'có tuyết', '❄️'], ['season', 'mùa', '🍂'],
  ['spring', 'mùa xuân', '🌸'], ['summer', 'mùa hè', '☀️'], ['autumn', 'mùa thu', '🍁'],
  ['winter', 'mùa đông', '⛄'], ['exercise', 'tập thể dục', '🤸'], ['healthy', 'khỏe mạnh', '💪'],
  ['illness', 'bệnh tật', '🤒'], ['medicine', 'thuốc', '💊'], ['toothache', 'đau răng', '🦷'],
  ['headache', 'đau đầu', '🤕'], ['fever', 'sốt', '🌡️'], ['cough', 'ho', '😷'],
  ['recycle', 'tái chế', '♻️'], ['pollution', 'ô nhiễm', '🏭'], ['plastic', 'nhựa', '🧴'],
  ['metal', 'kim loại', '🔩'], ['wood', 'gỗ', '🪵'], ['glass', 'thủy tinh', '🪟'],
  ['electricity', 'điện', '⚡'], ['solar', 'năng lượng mặt trời', '☀️'], ['battery', 'pin', '🔋'],
  ['keyboard', 'bàn phím', '⌨️'], ['screen', 'màn hình', '🖥️'], ['internet', 'mạng internet', '🌐'],
  ['download', 'tải xuống', '⬇️'], ['password', 'mật khẩu', '🔐'], ['website', 'trang web', '🌐'],
  ['hobby', 'sở thích', '🎯'], ['collect', 'sưu tầm', '📦'], ['draw', 'vẽ', '✏️'],
  ['sing', 'hát', '🎤'], ['dance', 'nhảy', '💃'], ['swim', 'bơi', '🏊'],
  ['skate', 'trượt patin', '⛸️'], ['camp', 'cắm trại', '⛺'], ['picnic', 'dã ngoại', '🧺'],
  ['ticket', 'vé', '🎫'], ['passport', 'hộ chiếu', '🛂'], ['luggage', 'hành lý', '🧳'],
  ['airport', 'sân bay', '✈️'], ['platform', 'sân ga', '🚉'], ['traffic', 'giao thông', '🚦'],
  ['helmet', 'mũ bảo hiểm', '⛑️'], ['seatbelt', 'dây an toàn', '🔒'], ['crosswalk', 'vạch sang đường', '🚶'],
  ['charity', 'từ thiện', '❤️'], ['volunteer', 'tình nguyện', '🤝'], ['respect', 'tôn trọng', '🙏'],
  ['honest', 'trung thực', '✅'], ['brave', 'dũng cảm', '🦁'], ['polite', 'lịch sự', '🙂'],
  ['generous', 'hào phóng', '🎁'], ['patient', 'kiên nhẫn', '⏳'], ['creative', 'sáng tạo', '💡'],
  ['curious', 'tò mò', '🔍'], ['confident', 'tự tin', '💪'], ['friendly', 'thân thiện', '😊'],
  ['helpful', 'hay giúp đỡ', '🤲'], ['careful', 'cẩn thận', '⚠️'], ['proud', 'tự hào', '🏆'],
  ['worried', 'lo lắng', '😟'], ['excited', 'hào hứng', '🎉'], ['surprised', 'ngạc nhiên', '😲'],
  ['bored', 'chán', '😑'], ['angry', 'tức giận', '😠'], ['scared', 'sợ hãi', '😨'],
  ['lonely', 'cô đơn', '😔'], ['grateful', 'biết ơn', '🙏'], ['fair', 'công bằng', '⚖️'],
  ['peace', 'hòa bình', '☮️'], ['freedom', 'tự do', '🕊️'], ['culture', 'văn hóa', '🎭'],
  ['tradition', 'truyền thống', '🏮'], ['festival', 'lễ hội', '🎊'], ['celebrate', 'ăn mừng', '🎉'],
  ['decorate', 'trang trí', '🎀'], ['perform', 'biểu diễn', '🎭'], ['audience', 'khán giả', '👥'],
  ['stage', 'sân khấu', '🎪'], ['costume', 'trang phục', '👗'], ['mask', 'mặt nạ', '🎭'],
  ['fireworks', 'pháo hoa', '🎆'], ['lantern', 'đèn lồng', '🏮'], ['drum', 'trống', '🥁'],
  ['flute', 'sáo', '🎶'], ['violin', 'đàn violin', '🎻'], ['guitar', 'đàn ghi-ta', '🎸'],
  ['piano', 'đàn piano', '🎹'], ['orchestra', 'dàn nhạc', '🎼'], ['melody', 'giai điệu', '🎵'],
  ['rhythm', 'nhịp điệu', '🥁'], ['lyrics', 'lời bài hát', '📝'], ['concert', 'buổi hòa nhạc', '🎤'],
  ['album', 'album nhạc', '💿'], ['photograph', 'bức ảnh', '📷'], ['camera', 'máy ảnh', '📸'],
  ['video', 'video', '🎬'], ['cartoon', 'phim hoạt hình', '📺'], ['documentary', 'phim tài liệu', '🎞️'],
  ['novel', 'tiểu thuyết', '📕'], ['poem', 'bài thơ', '📜'], ['author', 'tác giả', '✍️'],
  ['chapter', 'chương sách', '📑'], ['paragraph', 'đoạn văn', '📄'], ['dictionary', 'từ điển', '📖'],
  ['translate', 'dịch', '🔤'], ['pronounce', 'phát âm', '🗣️'], ['grammar', 'ngữ pháp', '📚'],
  ['vocabulary', 'từ vựng', '📝'], ['spelling', 'chính tả', '✏️'], ['pronoun', 'đại từ', '👤'],
  ['adjective', 'tính từ', '🏷️'], ['adverb', 'trạng từ', '⏱️'], ['preposition', 'giới từ', '📍'],
  ['conjunction', 'liên từ', '🔗'], ['question', 'câu hỏi', '❓'], ['answer', 'câu trả lời', '✅'],
];

// ——— Khoa học: đọc hiểu ———
function buildSciencePassages(count = 35) {
  const topics = [
    {
      passage:
        'Cơ thể người cần thức ăn, nước uống, không khí và ánh sáng mặt trời để sống khỏe. Thiếu một trong các yếu tố này, cơ thể dễ mệt mỏi và ốm.',
      qs: [
        ['Cơ thể cần những gì để sống khỏe?', ['Thức ăn, nước, không khí, ánh sáng', 'Chỉ cần nước', 'Chỉ cần thức ăn', 'Chỉ cần ngủ'], 0],
        ['Thiếu yếu tố cần thiết, cơ thể sẽ ra sao?', ['Dễ mệt và ốm', 'Cao lớn hơn', 'Không thay đổi', 'Chỉ khát nước'], 0],
        ['Ánh sáng mặt trời giúp cơ thể tạo vitamin gì?', ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin K'], 0],
      ],
    },
    {
      passage:
        'Tiêu hóa là quá trình biến thức ăn thành chất bổ dưỡng. Miệng nghiền thức ăn, dạ dày tiết dịch tiêu hóa, ruột non hấp thụ chất dinh dưỡng.',
      qs: [
        ['Tiêu hóa là gì?', ['Biến thức ăn thành chất bổ dưỡng', 'Thải phân ra ngoài', 'Hít thở không khí', 'Bơm máu'], 0],
        ['Bộ phận nào hấp thụ chất dinh dưỡng chủ yếu?', ['Ruột non', 'Da', 'Xương', 'Tim'], 0],
        ['Dạ dày có vai trò gì?', ['Tiết dịch tiêu hóa', 'Hấp thụ oxy', 'Nghe âm thanh', 'Bảo vệ da'], 0],
      ],
    },
    {
      passage:
        'Không khí gồm chủ yếu nitơ và ôxy. Ôxy cần cho sự cháy và hô hấp. Nitơ chiếm khoảng bốn phần năm thể tích không khí.',
      qs: [
        ['Không khí gồm chủ yếu những khí nào?', ['Nitơ và ôxy', 'Chỉ ôxy', 'Chỉ nitơ', 'Hiđro và heli'], 0],
        ['Ôxy cần cho quá trình nào?', ['Hô hấp và sự cháy', 'Quang hợp của động vật', 'Tiêu hóa', 'Ngủ'], 0],
        ['Nitơ chiếm khoảng bao nhiêu phần không khí?', ['Bốn phần năm', 'Một phần mười', 'Một nửa', 'Toàn bộ'], 0],
      ],
    },
    {
      passage:
        'Nước có thể ở thể rắn, lỏng hoặc khí. Nước đá là thể rắn, nước lỏng thường gặp ở sông hồ, hơi nước là thể khí. Khi đun nóng, nước bay hơi.',
      qs: [
        ['Nước đá thuộc thể nào?', ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Thể plasma'], 0],
        ['Khi đun nóng, nước chuyển thành gì?', ['Hơi nước', 'Nước đá', 'Muối', 'Cát'], 0],
        ['Nước có mấy thể cơ bản?', ['Ba thể', 'Hai thể', 'Bốn thể', 'Một thể'], 0],
      ],
    },
    {
      passage:
        'Thực vật quang hợp nhờ lá, ánh sáng, nước và khí cábonic. Quá trình tạo ra ôxy và chất hữu cơ nuôi cây. Rễ hút nước và muối khoáng từ đất.',
      qs: [
        ['Quang hợp cần những gì?', ['Ánh sáng, nước, CO₂', 'Chỉ nước', 'Chỉ đất', 'Chỉ gió'], 0],
        ['Quang hợp tạo ra khí gì?', ['Ôxy', 'Hiđro', 'Nitơ', 'Khí độc'], 0],
        ['Rễ cây có chức năng gì?', ['Hút nước và muối khoáng', 'Hô hấp chính', 'Tiết mật', 'Bay'], 0],
      ],
    },
    {
      passage:
        'Động vật có xương sống và không xương sống. Cá, chim, ếch, rắn, thú có xương sống. Côn trùng, giun, nhện không có xương sống.',
      qs: [
        ['Cá thuộc nhóm nào?', ['Có xương sống', 'Không xương sống', 'Thực vật', 'Khoáng vật'], 0],
        ['Côn trùng thuộc nhóm nào?', ['Không xương sống', 'Có xương sống', 'Thú', 'Cá'], 0],
        ['Ếch có xương sống không?', ['Có', 'Không', 'Chỉ khi lớn', 'Không xác định'], 0],
      ],
    },
    {
      passage:
        'Mạch máu gồm động mạch, tĩnh mạch và mao mạch. Tim bơm máu đi khắp cơ thể. Máu mang ôxy và chất dinh dưỡng đến các cơ quan.',
      qs: [
        ['Tim có vai trò gì?', ['Bơm máu', 'Tiêu hóa thức ăn', 'Sản xuất mật', 'Nghe âm thanh'], 0],
        ['Máu mang gì đến cơ quan?', ['Ôxy và chất dinh dưỡng', 'Chỉ nước', 'Chỉ khí CO₂', 'Chỉ muối'], 0],
        ['Mao mạch thuộc hệ gì?', ['Tuần hoàn máu', 'Tiêu hóa', 'Thần kinh', 'Bài tiết'], 0],
      ],
    },
    {
      passage:
        'Bệnh lây qua đường tiêu hóa do vi khuẩn, virus trong thức ăn nước uống bẩn. Rửa tay trước ăn và ăn chín uống sôi là cách phòng bệnh hiệu quả.',
      qs: [
        ['Bệnh đường tiêu hóa lây qua đâu?', ['Thức ăn nước uống bẩn', 'Chỉ qua không khí', 'Chỉ qua da', 'Chỉ qua ánh sáng'], 0],
        ['Cách phòng bệnh nào đúng?', ['Rửa tay và ăn chín uống sôi', 'Không tắm', 'Ăn sống', 'Uống nước ao'], 0],
        ['Vi khuẩn có thể có trong thức ăn không?', ['Có', 'Không', 'Chỉ trong đá', 'Chỉ trong gỗ'], 0],
      ],
    },
    {
      passage:
        'Trái Đất quay quanh Mặt Trời một vòng trong khoảng 365 ngày. Trục Trái Đất nghiêng tạo ra các mùa. Một ngày là thời gian Trái Đất tự quay một vòng.',
      qs: [
        ['Trái Đất quay quanh Mặt Trời mất bao lâu?', ['Khoảng 365 ngày', '1 ngày', '30 ngày', '7 ngày'], 0],
        ['Mùa xuân hạ thu đông do điều gì?', ['Trục Trái Đất nghiêng', 'Mặt Trăng che', 'Gió mạnh', 'Núi cao'], 0],
        ['Một ngày là gì?', ['Trái Đất tự quay một vòng', 'Quay quanh Mặt Trời', 'Một tháng', 'Một năm'], 0],
      ],
    },
    {
      passage:
        'Năng lượng có thể chuyển từ dạng này sang dạng khác. Pin lưu năng lượng hóa học. Bóng đèn biến điện năng thành quang năng và nhiệt năng.',
      qs: [
        ['Pin lưu năng lượng dạng gì?', ['Hóa học', 'Âm thanh', 'Cơ học', 'Hạt nhân'], 0],
        ['Bóng đèn biến điện năng thành gì?', ['Quang và nhiệt', 'Chỉ âm thanh', 'Chỉ cơ học', 'Chỉ hóa học'], 0],
        ['Năng lượng có thể chuyển đổi không?', ['Có', 'Không', 'Chỉ trong sách', 'Chỉ ban đêm'], 0],
      ],
    },
  ];
  const rounds = [];
  for (let t = 0; t < count; t++) {
    const topic = topics[t % topics.length];
    rounds.push({
      passage: topic.passage + (t >= topics.length ? ` (Bài ${t + 1})` : ''),
      questions: topic.qs.map(([prompt, choices, correctIndex]) => ({ prompt, choices, correctIndex })),
    });
  }
  return rounds;
}

// ——— Lịch sử bổ sung ———
const HISTORY_EXTRA = [
  [
    'Nhà Lý do Lý Công Uẩn sáng lập năm 1009. Kinh đô đặt tại Thăng Long. Thời Lý có chùa Một Cột và Quốc Tử Giám.',
    [
      ['Nhà Lý do Lý Công Uẩn sáng lập.', true],
      ['Kinh đô thời Lý là Thăng Long.', true],
      ['Chùa Một Cột gắn với thời Lý.', true],
      ['Nhà Lý sáng lập năm 938.', false],
      ['Kinh đô Lý đặt tại Huế.', false],
      ['Quốc Tử Giám xây thời nhà Nguyễn.', false],
    ],
  ],
  [
    'Nhà Trần thay Lý, đẩy lùi quân Nguyên Mông ba lần. Dân tộc ta giữ vững độc lập. Thời Trần có Hội nghị Diên Hồng.',
    [
      ['Nhà Trần đẩy lùi quân Nguyên Mông.', true],
      ['Hội nghị Diên Hồng gắn thời Trần.', true],
      ['Thời Trần giữ vững độc lập.', true],
      ['Trần nhường ngôi cho quân Nguyên.', false],
      ['Diên Hồng là lễ hội thời Lý.', false],
      ['Nguyên Mông xâm lược một lần duy nhất.', false],
    ],
  ],
  [
    'Nhà Lê sơ do Lê Lợi lãnh đạo khởi nghĩa Lam Sơn. Chiến thắng Bạch Đằng năm 1428 kết thúc 20 năm kháng chiến chống Minh.',
    [
      ['Lê Lợi lãnh đạo khởi nghĩa Lam Sơn.', true],
      ['Chiến thắng Bạch Đằng 1428 chống Minh.', true],
      ['Nhà Lê sơ thành lập sau kháng chiến.', true],
      ['Lê Lợi đầu hàng quân Minh.', false],
      ['Bạch Đằng 1428 do Ngô Quyền chỉ huy.', false],
      ['Kháng chiến chống Minh kéo dài 2 năm.', false],
    ],
  ],
  [
    'Quang Trung đại phá quân Thanh năm 1789 tại Ngọc Hồi, Đống Đa. Sự kiện thể hiện tinh thần đoàn kết dân tộc.',
    [
      ['Quang Trung đại phá quân Thanh năm 1789.', true],
      ['Trận Ngọc Hồi - Đống Đa năm 1789.', true],
      ['Chiến thắng thể hiện tinh thần đoàn kết.', true],
      ['Quang Trung thua quân Thanh năm 1789.', false],
      ['Trận diễn ra năm 938.', false],
      ['Quân Thanh giúp ta giành độc lập.', false],
    ],
  ],
  [
    'Nguyễn Huệ lên ngôi hoàng đế năm 1788, hiệu Quang Trung. Ông chú trọng giáo dục và xây dựng đất nước.',
    [
      ['Nguyễn Huệ lên ngôi năm 1788.', true],
      ['Hiệu Quang Trung gắn với Nguyễn Huệ.', true],
      ['Quang Trung chú trọng giáo dục.', true],
      ['Nguyễn Huệ là vua nhà Trần.', false],
      ['Quang Trung bỏ học hành.', false],
      ['1788 là năm Ngô Quyền đánh Nam Hán.', false],
    ],
  ],
  [
    'Phan Bội Châu và Phan Chu Trinh là nhà yêu nước cuối thời Nguyễn. Cả hai đều mong muốn đất nước giàu mạnh, độc lập.',
    [
      ['Phan Bội Châu là nhà yêu nước.', true],
      ['Phan Chu Trinh mong đất nước giàu mạnh.', true],
      ['Họ hoạt động cuối thời Nguyễn.', true],
      ['Phan Bội Châu là vua nhà Lý.', false],
      ['Phan Chu Trinh phản đối độc lập.', false],
      ['Hai ông sống thời Văn Lang.', false],
    ],
  ],
  [
    'Cách mạng tháng Tám năm 1945 do Đảng và Bác Hồ lãnh đạo. Nhân dân giành chính quyền, lập nước Việt Nam Dân chủ Cộng hòa.',
    [
      ['Cách mạng tháng Tám năm 1945.', true],
      ['Bác Hồ gắn với cách mạng 1945.', true],
      ['Lập nước Việt Nam Dân chủ Cộng hòa.', true],
      ['Cách mạng 1945 do thực dân Pháp lãnh đạo.', false],
      ['Tháng Tám năm 1975.', false],
      ['1945 lập nước Văn Lang.', false],
    ],
  ],
  [
    'Chiến thắng Điện Biên Phủ năm 1954 kết thúc kháng chiến chống Pháp. Sự kiện góp phần đưa đất nước hòa bình, thống nhất.',
    [
      ['Điện Biên Phủ năm 1954.', true],
      ['Chiến thắng chống thực dân Pháp.', true],
      ['Góp phần hòa bình thống nhất.', true],
      ['Điện Biên Phủ năm 938.', false],
      ['Ta thua Pháp năm 1954.', false],
      ['1954 kết thúc kháng chiến chống Mỹ.', false],
    ],
  ],
  [
    'Nhà Hậu Lê do Lê Lợi mở đầu. Thời kỳ này ban hành Bộ luật Hồng Đức, thúc đẩy giáo dục và văn hóa.',
    [
      ['Nhà Hậu Lê do Lê Lợi mở đầu.', true],
      ['Bộ luật Hồng Đức ban hành thời Hậu Lê.', true],
      ['Thời Hậu Lê chú trọng giáo dục.', true],
      ['Hồng Đức là luật thời nhà Nguyễn.', false],
      ['Lê Lợi là vua nhà Trần.', false],
      ['Hậu Lê không có đóng góp văn hóa.', false],
    ],
  ],
  [
    'Tây Sơn do ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ lãnh đạo. Phong trào đánh đuổi chúa Nguyễn, chúa Trịnh.',
    [
      ['Tây Sơn do ba anh em Nguyễn lãnh đạo.', true],
      ['Phong trào Tây Sơn chống chúa Trịnh Nguyễn.', true],
      ['Nguyễn Huệ là nhân vật Tây Sơn.', true],
      ['Tây Sơn do Ngô Quyền sáng lập.', false],
      ['Tây Sơn ủng hộ thực dân Pháp.', false],
      ['Nguyễn Lữ là vua nhà Lý.', false],
    ],
  ],
  [
    'Nhà Nguyễn thống nhất đất nước năm 1802. Kinh đô đặt tại Huế. Thời Nguyễn xây kinh thành và lăng tẩm.',
    [
      ['Nhà Nguyễn thống nhất năm 1802.', true],
      ['Kinh đô thời Nguyễn ở Huế.', true],
      ['Thời Nguyễn có kinh thành Huế.', true],
      ['Nhà Nguyễn thống nhất năm 938.', false],
      ['Kinh đô Nguyễn là Thăng Long.', false],
      ['Nhà Nguyễn do Lý Công Uẩn sáng lập.', false],
    ],
  ],
  [
    'Trương Định cùng nhân dân Nam Kỳ chống Pháp xâm lược. Ông là tấm gương yêu nước tiêu biểu cuối thế kỷ XIX.',
    [
      ['Trương Định chống Pháp xâm lược.', true],
      ['Ông lãnh đạo nhân dân Nam Kỳ.', true],
      ['Trương Định là tấm gương yêu nước.', true],
      ['Trương Định đầu hàng Pháp.', false],
      ['Ông hoạt động ở miền Bắc thời Lý.', false],
      ['Trương Định là vua nhà Trần.', false],
    ],
  ],
  [
    'Hoàng Diệu bảo vệ thành Hà Nội chống quân Pháp năm 1882. Ông hy sinh anh dũng, thể hiện tinh thần bất khuất.',
    [
      ['Hoàng Diệu bảo vệ Hà Nội năm 1882.', true],
      ['Ông hy sinh chống quân Pháp.', true],
      ['Hoàng Diệu thể hiện tinh thần bất khuất.', true],
      ['Hoàng Diệu mở cửa thành cho Pháp.', false],
      ['1882 là năm Điện Biên Phủ.', false],
      ['Hoàng Diệu là vua Quang Trung.', false],
    ],
  ],
  [
    'Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, thống nhất đất nước. Lên ngôi hoàng đế, đặt tên nước là Đại Cồ Việt.',
    [
      ['Đinh Bộ Lĩnh dẹp loạn 12 sứ quân.', true],
      ['Ông thống nhất đất nước.', true],
      ['Đại Cồ Việt là tên nước thời Đinh.', true],
      ['Đinh Bộ Lĩnh là vua nhà Lý.', false],
      ['12 sứ quân xảy ra thời Nguyễn.', false],
      ['Đinh Bộ Lĩnh đầu hàng giặc ngoại.', false],
    ],
  ],
  [
    'Lý Thái Tổ dời đô về Thăng Long năm 1010. Sự kiện có ý nghĩa phát triển kinh tế văn hóa Đại Việt.',
    [
      ['Lý Thái Tổ dời đô về Thăng Long năm 1010.', true],
      ['Thăng Long là kinh đô thời Lý.', true],
      ['Dời đô góp phần phát triển Đại Việt.', true],
      ['1010 dời đô về Huế.', false],
      ['Lý Thái Tổ là vua nhà Trần.', false],
      ['Thăng Long đặt tên thời Nguyễn.', false],
    ],
  ],
  [
    'Trần Hưng Đạo chỉ huy cuộc kháng chiến chống Nguyên Mông. Ông viết Hịch tướng sĩ động viên quân dân.',
    [
      ['Trần Hưng Đạo chống Nguyên Mông.', true],
      ['Ông viết Hịch tướng sĩ.', true],
      ['Trần Hưng Đạo là danh tướng nhà Trần.', true],
      ['Trần Hưng Đạo đầu hàng Nguyên.', false],
      ['Hịch tướng sĩ viết thời Nguyễn.', false],
      ['Ông là vua nhà Lê sơ.', false],
    ],
  ],
  [
    'Lê Thánh Tông là vua sáng thời Hậu Lê. Ông chú trọng khoa cử, phát triển văn học và khoa học.',
    [
      ['Lê Thánh Tông là vua thời Hậu Lê.', true],
      ['Ông chú trọng khoa cử.', true],
      ['Thời ông văn học phát triển.', true],
      ['Lê Thánh Tông là vua Tây Sơn.', false],
      ['Ông bãi bỏ khoa cử.', false],
      ['Lê Thánh Tông sống thời Văn Lang.', false],
    ],
  ],
  [
    'Ngày 2 tháng 9 năm 1945, Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình. Sự kiện khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    [
      ['Tuyên ngôn Độc lập đọc ngày 2/9/1945.', true],
      ['Bác Hồ đọc tại Ba Đình.', true],
      ['Sự kiện khai sinh nước Việt Nam Dân chủ Cộng hòa.', true],
      ['Tuyên ngôn đọc năm 1954.', false],
      ['2/9/1945 tại Huế.', false],
      ['1945 lập nước Văn Lang.', false],
    ],
  ],
];

const HISTORY_EXTRA_WAVE2 = [
  [
    'Lý Chiêu Hoàng là nữ hoàng duy nhất trong lịch sử phong kiến Việt Nam. Bà nhường ngôi cho Trần Cảnh, mở đầu nhà Trần.',
    [
      ['Lý Chiêu Hoàng là nữ hoàng.', true],
      ['Bà nhường ngôi cho Trần Cảnh.', true],
      ['Nhà Trần bắt đầu sau sự kiện này.', true],
      ['Lý Chiêu Hoàng là vua nhà Nguyễn.', false],
      ['Nhà Trần thành lập năm 938.', false],
      ['Trần Cảnh là vua nhà Lý.', false],
    ],
  ],
  [
    'Cuộc kháng chiến chống quân Tống thời nhà Lý do Lý Thường Kiệt lãnh đạo. Chiến thắng giữ vững nền độc lập.',
    [
      ['Kháng chiến chống Tống thời Lý.', true],
      ['Lý Thường Kiệt là danh tướng thời Lý.', true],
      ['Chiến thắng giữ vững độc lập.', true],
      ['Lý Thường Kiệt là vua nhà Trần.', false],
      ['Quân Tống giúp ta giành độc lập.', false],
      ['Sự kiện xảy ra thời Quang Trung.', false],
    ],
  ],
  [
    'Nhà Mạc do Mạc Đăng Dung sáng lập. Thời kỳ đất nước có hai chính quyền song song Lê - Mạc.',
    [
      ['Nhà Mạc do Mạc Đăng Dung sáng lập.', true],
      ['Có thời kỳ hai chính quyền Lê - Mạc.', true],
      ['Mạc Đăng Dung là nhân vật lịch sử.', true],
      ['Nhà Mạc thống nhất năm 1802.', false],
      ['Mạc Đăng Dung là vua nhà Trần.', false],
      ['Không có giai đoạn song song Lê - Mạc.', false],
    ],
  ],
  [
    'Nguyễn Trãi viết Bình Ngô đại cáo sau chiến thắng Lam Sơn. Tác phẩm thể hiện tinh thần yêu nước.',
    [
      ['Nguyễn Trãi viết Bình Ngô đại cáo.', true],
      ['Tác phẩm gắn với khởi nghĩa Lam Sơn.', true],
      ['Bình Ngô đại cáo thể hiện yêu nước.', true],
      ['Nguyễn Trãi là vua nhà Lý.', false],
      ['Bình Ngô đại cáo viết thời Nguyễn Huệ.', false],
      ['Nguyễn Trãi đầu hàng quân Minh.', false],
    ],
  ],
  [
    'Chiến dịch Điện Biên Phủ năm 1954 do Đại tướng Võ Nguyên Giáp chỉ huy. Chiến thắng lịch sử chống thực dân Pháp.',
    [
      ['Điện Biên Phủ năm 1954.', true],
      ['Võ Nguyên Giáp chỉ huy chiến dịch.', true],
      ['Chiến thắng chống thực dân Pháp.', true],
      ['Điện Biên Phủ năm 1975.', false],
      ['Võ Nguyên Giáp chỉ huy chống Mỹ năm 1954.', false],
      ['Ta thua tại Điện Biên Phủ.', false],
    ],
  ],
];

const EN_VI_EXTRA = [
  ['classmate', 'bạn cùng lớp', '👧'], ['homework', 'bài tập về nhà', '📝'], ['subject', 'môn học', '📖'],
  ['pencil case', 'hộp bút', '✏️'], ['ruler', 'thước kẻ', '📏'], ['eraser', 'cục tẩy', '🧽'],
  ['whiteboard', 'bảng trắng', '⬜'], ['principal', 'hiệu trưởng', '🏫'], ['uniform', 'đồng phục', '👔'],
  ['cousin', 'anh chị em họ', '👦'], ['grandparents', 'ông bà', '👴'], ['nephew', 'cháu trai', '👦'],
  ['buffalo', 'con trâu', '🐃'], ['goat', 'con dê', '🐐'], ['duck', 'con vịt', '🦆'],
  ['peach', 'quả đào', '🍑'], ['grape', 'quả nho', '🍇'], ['mango', 'quả xoài', '🥭'],
  ['carrot', 'củ cà rốt', '🥕'], ['potato', 'củ khoai tây', '🥔'], ['onion', 'củ hành', '🧅'],
  ['doctor', 'bác sĩ', '👨‍⚕️'], ['nurse', 'y tá', '👩‍⚕️'], ['firefighter', 'lính cứu hỏa', '🚒'],
  ['post office', 'bưu điện', '📮'], ['supermarket', 'siêu thị', '🛒'], ['pharmacy', 'nhà thuốc', '💊'],
  ['desert', 'sa mạc', '🏜️'], ['island', 'hòn đảo', '🏝️'], ['waterfall', 'thác nước', '💦'],
  ['spring', 'mùa xuân', '🌸'], ['summer', 'mùa hè', '☀️'], ['autumn', 'mùa thu', '🍁'],
  ['exercise', 'tập thể dục', '🤸'], ['healthy', 'khỏe mạnh', '💪'], ['medicine', 'thuốc', '💊'],
  ['plastic', 'nhựa', '🧴'], ['recycle', 'tái chế', '♻️'], ['pollution', 'ô nhiễm', '🏭'],
  ['hobby', 'sở thích', '🎯'], ['draw', 'vẽ', '✏️'], ['sing', 'hát', '🎤'], ['swim', 'bơi', '🏊'],
  ['ticket', 'vé', '🎫'], ['traffic', 'giao thông', '🚦'], ['helmet', 'mũ bảo hiểm', '⛑️'],
  ['brave', 'dũng cảm', '🦁'], ['polite', 'lịch sự', '🙂'], ['curious', 'tò mò', '🔍'],
  ['worried', 'lo lắng', '😟'], ['excited', 'hào hứng', '🎉'], ['grammar', 'ngữ pháp', '📚'],
  ['spelling', 'chính tả', '✏️'], ['question', 'câu hỏi', '❓'], ['answer', 'câu trả lời', '✅'],
  ['weekend', 'cuối tuần', '📅'], ['birthday', 'sinh nhật', '🎂'], ['holiday', 'ngày nghỉ', '🏖️'],
  ['kitchen', 'nhà bếp', '🍳'], ['bedroom', 'phòng ngủ', '🛏️'], ['bathroom', 'phòng tắm', '🚿'],
  ['garden', 'khu vườn', '🌻'], ['forest', 'rừng', '🌲'], ['ocean', 'đại dương', '🌊'],
  ['planet', 'hành tinh', '🪐'], ['solar system', 'hệ Mặt Trời', '☀️'], ['gravity', 'trọng lực', '🌍'],
  ['magnet', 'nam châm', '🧲'], ['electricity', 'điện', '⚡'], ['battery', 'pin', '🔋'],
  ['keyboard', 'bàn phím', '⌨️'], ['screen', 'màn hình', '🖥️'], ['internet', 'mạng internet', '🌐'],
  ['weather', 'thời tiết', '🌤️'], ['temperature', 'nhiệt độ', '🌡️'], ['degree', 'độ', '📐'],
  ['kilogram', 'kilôgam', '⚖️'], ['liter', 'lít', '🥤'], ['meter', 'mét', '📏'],
  ['triangle', 'tam giác', '🔺'], ['circle', 'hình tròn', '⭕'], ['square', 'hình vuông', '⬜'],
  ['rectangle', 'hình chữ nhật', '▭'], ['fraction', 'phân số', '➗'], ['decimal', 'số thập phân', '🔢'],
];

const SCIENCE_TOPICS_EXTRA = [
  {
    passage:
      'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    qs: [
      ['Thức ăn cung cấp chất đạm và vitamin.', ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], 0],
      ['Vận động giúp phòng bệnh béo phì.', ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], 0],
      ['Béo phì liên quan chế độ ăn và vận động.', ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], 0],
    ],
  },
  {
    passage:
      'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    qs: [
      ['Trái Đất quay quanh Mặt Trời.', ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], 0],
      ['Các mùa liên quan chuyển động quanh Mặt Trời.', ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], 0],
      ['Trái Đất tự quay quanh trục.', ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], 0],
    ],
  },
  {
    passage:
      'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    qs: [
      ['Xả rác xuống sông gây ô nhiễm.', ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], 0],
      ['Nước sạch cần được bảo vệ.', ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], 0],
      ['Ô nhiễm nước ảnh hưởng sức khỏe.', ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], 0],
    ],
  },
  {
    passage:
      'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    qs: [
      ['Tai dùng để nghe.', ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], 0],
      ['Nghe nhạc quá to có thể hại tai.', ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], 0],
      ['Mắt giúp ta nhìn.', ['Đúng', 'Sai', 'Để nghe', 'Để nói'], 0],
    ],
  },
];

function buildSciencePassagesExtra(count = 25) {
  const rounds = [];
  for (let t = 0; t < count; t++) {
    const topic = SCIENCE_TOPICS_EXTRA[t % SCIENCE_TOPICS_EXTRA.length];
    rounds.push({
      passage: topic.passage,
      questions: topic.qs.map(([prompt, choices, correctIndex]) => ({ prompt, choices, correctIndex })),
    });
  }
  return rounds;
}

// ——— Hình học: đồ vật ———
const OBJECT_LABELS = {
  square: [
    'Viên xúc xắc', 'Miếng phô mai vuông', 'Tấm gương vuông', 'Khay sushi', 'Miếng brownie',
    'Tấm kính vuông', 'Khối đá lát', 'Miếng bánh quy vuông', 'Tấm thảm họa tiết', 'Hộp sữa vuông',
    'Miếng tofu vuông', 'Tấm decal vuông', 'Khối xếp hình', 'Miếng kẹo dẻo', 'Tấm bìa màu',
    'Viên gạch mosaic', 'Miếng sandwich vuông', 'Tấm lót bàn', 'Khung ảnh vuông', 'Miếng bánh flan',
  ],
  rect: [
    'Thẻ tên', 'Cuốn sách mỏng', 'Thước kẻ dài', 'Hộp bút', 'Tấm ván gỗ',
    'Viên gạch ống', 'Cánh cửa phòng', 'Tấm biển báo', 'Khay đựng bút', 'Hộp socola',
    'Tờ giấy A4', 'Miếng bánh mì', 'Thẻ nhớ', 'Hộp diêm', 'Tấm thẻ học',
    'Băng dính cuộn', 'Hộp sữa hộp', 'Tấm menu', 'Cánh tay ghế', 'Thân bút chì',
  ],
  triangle: [
    'Miếng pizza', 'Nón lá', 'Cái ê-tô', 'Kim tự tháp mini', 'Dấu hiệu cảnh báo',
    'Miếng sandwich tam giác', 'Cánh diều', 'Đinh ba trang trí', 'Miếng bánh sandwich', 'Núi nhọn',
    'Cái chặn cửa', 'Biển báo tam giác', 'Miếng phô mai tam giác', 'Hình ghim', 'Cái thước tam giác',
    'Miếng bánh gốc', 'Đỉnh mái nhà', 'Cái kẹp giấy', 'Hình cờ tam giác', 'Miếng tortilla gập',
  ],
};

// ——— Cửu Long: phân loại ———
const MEKONG_ITEMS = [
  ['Cá chép', '🐟', 'dong-vat'], ['Sen hồng', '🪷', 'thuc-vat'], ['Nước dâng', '🌊', 'hien-tuong'],
  ['Tôm càng xanh', '🦐', 'dong-vat'], ['Bèo sen', '🍃', 'thuc-vat'], ['Lũ lụt', '🌊', 'hien-tuong'],
  ['Vịt trời', '🦆', 'dong-vat'], ['Cây nhãn', '🌳', 'thuc-vat'], ['Hạn hán', '☀️', 'hien-tuong'],
  ['Cá mè', '🐟', 'dong-vat'], ['Rau nhút', '🥬', 'thuc-vat'], ['Sương muối', '🌫️', 'hien-tuong'],
  ['Ếch tía', '🐸', 'dong-vat'], ['Cây bình bát', '🌿', 'thuc-vat'], ['Triều cường', '🌊', 'hien-tuong'],
  ['Chuột chù', '🐭', 'dong-vat'], ['Cây điền điển', '🌳', 'thuc-vat'], ['Mưa phùn', '🌧️', 'hien-tuong'],
  ['Cá rô', '🐠', 'dong-vat'], ['Bông điền', '🌸', 'thuc-vat'], ['Gió lốc', '🌪️', 'hien-tuong'],
  ['Rắn nước', '🐍', 'dong-vat'], ['Cây chà là', '🌴', 'thuc-vat'], ['Sạt lở bờ', '⛰️', 'hien-tuong'],
  ['Cua đồng', '🦀', 'dong-vat'], ['Lúa nước', '🌾', 'thuc-vat'], ['Nắng nóng', '🔥', 'hien-tuong'],
  ['Cò bợ', '🦩', 'dong-vat'], ['Cây bần', '🌳', 'thuc-vat'], ['Mưa dông', '⛈️', 'hien-tuong'],
  ['Cá thát lát', '🐟', 'dong-vat'], ['Rau muống', '🥗', 'thuc-vat'], ['Sấm chớp', '⚡', 'hien-tuong'],
  ['Ốc nhồi', '🐌', 'dong-vat'], ['Cây tràm', '🌲', 'thuc-vat'], ['Bão nhiệt đới', '🌀', 'hien-tuong'],
  ['Chim cút', '🐦', 'dong-vat'], ['Hoa súng', '🪷', 'thuc-vat'], ['Nước mặn xâm nhập', '🧂', 'hien-tuong'],
  ['Cá chốt', '🐟', 'dong-vat'], ['Cây vú sữa', '🌳', 'thuc-vat'], ['Khô hạn', '🏜️', 'hien-tuong'],
  ['Tôm đất', '🦐', 'dong-vat'], ['Cây mận', '🌳', 'thuc-vat'], ['Sương giá', '❄️', 'hien-tuong'],
  ['Nhện cây', '🕷️', 'dong-vat'], ['Cây khế', '🌳', 'thuc-vat'], ['Lốc xoáy', '🌪️', 'hien-tuong'],
  ['Dế đồng', '🦗', 'dong-vat'], ['Cây nhãn lồng', '🌳', 'thuc-vat'], ['Mưa acid', '🧪', 'hien-tuong'],
  ['Cá diếc', '🐟', 'dong-vat'], ['Cây dừa', '🥥', 'thuc-vat'], ['Bụi mù', '🌫️', 'hien-tuong'],
  ['Thằn lằn', '🦎', 'dong-vat'], ['Cây chôm chôm', '🌳', 'thuc-vat'], ['Nước thủy triều', '🌊', 'hien-tuong'],
  ['Chuồn chuồn', '🪰', 'dong-vat'], ['Cây mít', '🌳', 'thuc-vat'], ['Gió monsoon', '💨', 'hien-tuong'],
  ['Cá trê', '🐟', 'dong-vat'], ['Cây sầu riêng', '🌳', 'thuc-vat'], ['Sạt lở đất', '🏔️', 'hien-tuong'],
  ['Bọ cạp', '🦂', 'dong-vat'], ['Cây thanh long', '🌵', 'thuc-vat'], ['Mưa lớn', '🌧️', 'hien-tuong'],
  ['Cá hồi', '🐟', 'dong-vat'], ['Cây bưởi', '🍊', 'thuc-vat'], ['Áp thấp', '🌀', 'hien-tuong'],
  ['Kiến vàng', '🐜', 'dong-vat'], ['Cây cam', '🍊', 'thuc-vat'], ['Nắng gắt', '☀️', 'hien-tuong'],
  ['Giun đất', '🪱', 'dong-vat'], ['Cây xoài', '🥭', 'thuc-vat'], ['Sương mù dày', '🌫️', 'hien-tuong'],
  ['Cá ngừ', '🐟', 'dong-vat'], ['Cây ổi', '🍐', 'thuc-vat'], ['Lũ quét', '🌊', 'hien-tuong'],
  ['Bướm đêm', '🦋', 'dong-vat'], ['Cây nhãn', '🌳', 'thuc-vat'], ['Gió giật', '💨', 'hien-tuong'],
  ['Nòng nọc', '🐸', 'dong-vat'], ['Cây măng cụt', '🍇', 'thuc-vat'], ['Mưa rào', '🌧️', 'hien-tuong'],
  ['Cá nục', '🐟', 'dong-vat'], ['Cây vải', '🍒', 'thuc-vat'], ['Khí hậu ẩm', '💧', 'hien-tuong'],
  ['Châu chấu', '🦗', 'dong-vat'], ['Cây na', '🌳', 'thuc-vat'], ['Nhiệt độ tăng', '🌡️', 'hien-tuong'],
  ['Cá hồng', '🐟', 'dong-vat'], ['Cây khế chua', '🌿', 'thuc-vat'], ['Bão cuốn', '🌀', 'hien-tuong'],
  ['Nhện nước', '🕷️', 'dong-vat'], ['Cây đu đủ', '🌴', 'thuc-vat'], ['Sóng thần', '🌊', 'hien-tuong'],
  ['Cá mòi', '🐟', 'dong-vat'], ['Cây me', '🌳', 'thuc-vat'], ['Hơi nước bốc', '💨', 'hien-tuong'],
  ['Đom đóm', '✨', 'dong-vat'], ['Cây sắn', '🌿', 'thuc-vat'], ['Mưa ngâu', '🌧️', 'hien-tuong'],
  ['Cá trích', '🐟', 'dong-vat'], ['Cây khoai lang', '🍠', 'thuc-vat'], ['Gió mùa đông bắc', '❄️', 'hien-tuong'],
  ['Chim sẻ', '🐦', 'dong-vat'], ['Cây đậu phộng', '🥜', 'thuc-vat'], ['Nước ngập úng', '🌊', 'hien-tuong'],
  ['Cá ngựa', '🐴', 'dong-vat'], ['Cây lạc', '🥜', 'thuc-vat'], ['Khô cằn', '🏜️', 'hien-tuong'],
  ['Ong mật', '🐝', 'dong-vat'], ['Cây đậu xanh', '🫘', 'thuc-vat'], ['Mưa phù sa', '🌧️', 'hien-tuong'],
  ['Cá chim', '🐟', 'dong-vat'], ['Cây ngô', '🌽', 'thuc-vat'], ['Áp suất thấp', '📉', 'hien-tuong'],
  ['Dơi', '🦇', 'dong-vat'], ['Cây lúa mì', '🌾', 'thuc-vat'], ['Cháy rừng', '🔥', 'hien-tuong'],
  ['Cá mập', '🦈', 'dong-vat'], ['Cây khoai tây', '🥔', 'thuc-vat'], ['Bụi khói', '💨', 'hien-tuong'],
  ['Sứa', '🪼', 'dong-vat'], ['Cây rau má', '🌿', 'thuc-vat'], ['Tuyết rơi', '❄️', 'hien-tuong'],
  ['Sao biển', '⭐', 'dong-vat'], ['Cây rau ngót', '🥬', 'thuc-vat'], ['Băng tan', '🧊', 'hien-tuong'],
  ['Cá voi', '🐋', 'dong-vat'], ['Cây rau đay', '🥗', 'thuc-vat'], ['Hạn mặn', '🧂', 'hien-tuong'],
  ['Rùa biển', '🐢', 'dong-vat'], ['Cây rau muống', '🥬', 'thuc-vat'], ['Xói mòn', '🏔️', 'hien-tuong'],
  ['Cá heo', '🐬', 'dong-vat'], ['Cây rau cải', '🥬', 'thuc-vat'], ['Ô nhiễm nước', '☣️', 'hien-tuong'],
  ['Hải âu', '🕊️', 'dong-vat'], ['Cây rau dền', '🥬', 'thuc-vat'], ['Thủy triều', '🌊', 'hien-tuong'],
  ['Cá mực', '🦑', 'dong-vat'], ['Cây rau lang', '🥬', 'thuc-vat'], ['El Nino', '🌡️', 'hien-tuong'],
  ['Cua ghẹ', '🦀', 'dong-vat'], ['Cây rau sam', '🌿', 'thuc-vat'], ['La Nina', '🌧️', 'hien-tuong'],
  ['Sam biển', '⭐', 'dong-vat'], ['Cây rau muống đồng', '🥬', 'thuc-vat'], ['Khí nhà kính', '🏭', 'hien-tuong'],
  ['Sao biển đỏ', '⭐', 'dong-vat'], ['Cây rau đắng', '🌿', 'thuc-vat'], ['Mưa axit', '🧪', 'hien-tuong'],
  ['Cá nóc', '🐡', 'dong-vat'], ['Cây rau muống nước', '🥬', 'thuc-vat'], ['Sạt lở ven sông', '⛰️', 'hien-tuong'],
  ['Cá thu', '🐟', 'dong-vat'], ['Cây rau sắng', '🌿', 'thuc-vat'], ['Nước đục', '🟤', 'hien-tuong'],
  ['Cá ngừ đại dương', '🐟', 'dong-vat'], ['Cây rau muống trắng', '🥬', 'thuc-vat'], ['Cạn kiệt nước', '💧', 'hien-tuong'],
];

// ——— Emit files ———
const mathMcq = buildMathMcqBank(165);
writeTs(
  'src/games/trang-nguyen-toan/mcqBank.ts',
  "export interface McqQuestion {\n  prompt: string;\n  choices: string[];\n  correctIndex: number;\n}\n",
  `/** Ngân hàng trắc nghiệm toán lớp 4 (HK1/HK2) — ${mathMcq.length} câu, sinh từ ma trận đề thi */\nexport const MCQ_BANK: McqQuestion[] = [\n${mathMcq
    .map(
      (q) =>
        `  { prompt: '${esc(q.prompt)}', choices: [${q.choices.map((c) => `'${esc(c)}'`).join(', ')}], correctIndex: ${q.correctIndex} },`
    )
    .join('\n')}\n];`
);

const mathText1 = buildMathTextBank(165);
writeTs(
  'src/games/tinh-nham-trang-ti/mathBank.ts',
  "export interface MathQuestion {\n  text: string;\n  answer: number;\n}\n",
  `/** Bài tập nhẩm lớp 4 — ${mathText1.length} câu */\nexport const MATH_BANK: MathQuestion[] = [\n${mathText1
    .map((q) => `  { text: '${esc(q.text)}', answer: ${q.answer} },`)
    .join('\n')}\n];`
);

const mathText2 = buildMathTextBank(165);
writeTs(
  'src/games/cuu-chuong-van-mieu/mathBank.ts',
  "export interface MathQuestion {\n  text: string;\n  answer: number;\n}\n",
  `/** Bảng nhân/chia lớp 4 — ${mathText2.length} câu */\nexport const MATH_BANK: MathQuestion[] = [\n${mathText2
    .map((q) => `  { text: '${esc(q.text)}', answer: ${q.answer} },`)
    .join('\n')}\n];`
);

const vocabLines = EN_VI_PAIRS.map(([en, vi, emoji], i) => {
  const level = i < 50 ? 1 : i < 120 ? 2 : 3;
  return `  { en: '${esc(en)}', vi: '${esc(vi)}', emoji: '${emoji}', level: ${level} as const },`;
});
writeTs(
  'src/games/tu-vung-hoi-an/vocabSupplement.ts',
  "import type { VocabPair } from './questions';",
  `/** Từ vựng tiếng Anh lớp 4 — ${EN_VI_PAIRS.length} cặp bổ sung */\nexport const VOCAB_SUPPLEMENT: VocabPair[] = [\n${vocabLines.join('\n')}\n];`
);

const scienceRounds = buildSciencePassages(40);
writeTs(
  'src/games/trong-dong/scienceSupplement.ts',
  'export interface PassageRound {\n  passage: string;\n  questions: { prompt: string; choices: string[]; correctIndex: number }[];\n}\n',
  `/** Đọc hiểu khoa học HK1/HK2 — ${scienceRounds.reduce((n, r) => n + r.questions.length, 0)} câu */\nexport const SCIENCE_SUPPLEMENT: PassageRound[] = [\n${scienceRounds
    .map(
      (r) =>
        `  {\n    passage: '${esc(r.passage)}',\n    questions: [\n${r.questions
          .map(
            (q) =>
              `      { prompt: '${esc(q.prompt)}', choices: [${q.choices.map((c) => `'${esc(c)}'`).join(', ')}], correctIndex: ${q.correctIndex} },`
          )
          .join('\n')}\n    ],\n  },`
    )
    .join('\n')}\n];`
);

writeTs(
  'src/games/doc-hieu-su-viet/historySupplement.ts',
  "import type { HistoryPassage } from './historyBank';",
  `/** Lịch sử lớp 4 bổ sung — ${HISTORY_EXTRA.reduce((n, p) => n + p[1].length, 0)} nhận định */\nexport const HISTORY_SUPPLEMENT_DATA: [string, [string, boolean][]][] = ${JSON.stringify(HISTORY_EXTRA, null, 2)};\n\nexport const HISTORY_SUPPLEMENT: HistoryPassage[] = HISTORY_SUPPLEMENT_DATA.map(([passage, statements]) => ({\n  passage,\n  statements: statements.map(([text, isTrue]) => ({ text, isTrue })),\n}));`
);

const OBJECT_PREFIX = ['Chiếc', 'Tấm', 'Miếng', 'Khối', 'Cái', 'Hộp', 'Viên', 'Tờ', 'Cuốn', 'Thanh'];
const OBJECT_SUFFIX = [' trong phòng', ' trên bàn', ' ngoài sân', ' trong lớp', ' ở bếp', ' trong túi', ' trên kệ', ''];

let objId = 101;
const objectRows = [];
const objectSeen = new Set();
for (const [shape, labels] of Object.entries(OBJECT_LABELS)) {
  for (const base of labels) {
    for (let v = 0; v < 3 && objectRows.length < 150; v++) {
      const label =
        v === 0
          ? base
          : `${OBJECT_PREFIX[v % OBJECT_PREFIX.length]} ${base.toLowerCase()}${OBJECT_SUFFIX[v % OBJECT_SUFFIX.length]}`;
      if (objectSeen.has(label)) continue;
      objectSeen.add(label);
      const minLevel = objId % 3 === 0 ? 3 : objId % 2 === 0 ? 2 : 1;
      objectRows.push(
        `  { id: 'o${String(objId++).padStart(3, '0')}', label: '${esc(label)}', shape: '${shape}', minLevel: ${minLevel} },`
      );
    }
  }
}
writeTs(
  'src/games/hinh-hoc-thang-long/objectSupplement.ts',
  "import type { ObjectItem } from './objectBank';",
  `/** Đồ vật hình học bổ sung — ${objectRows.length} mục */\nexport const OBJECT_SUPPLEMENT: ObjectItem[] = [\n${objectRows.join('\n')}\n];`
);

const itemRows = MEKONG_ITEMS.map(([label, emoji, bin], i) => {
  const id = String(31 + i);
  return `  { id: '${id}', label: '${esc(label)}', emoji: '${emoji}', bin: '${bin}' },`;
});
writeTs(
  'src/games/tham-hiem-cuu-long/itemsSupplement.ts',
  "import type { ClassifyItem } from './questions';",
  `/** Phân loại Cửu Long bổ sung — ${itemRows.length} mục */\nexport const ITEMS_SUPPLEMENT: ClassifyItem[] = [\n${itemRows.join('\n')}\n];`
);

// ——— Wave 2 emit ———
const mathMcqExtra = buildMathMcqBankExtra(150);
writeTs(
  'src/games/trang-nguyen-toan/mcqBankExtra.ts',
  "export interface McqQuestion {\n  prompt: string;\n  choices: string[];\n  correctIndex: number;\n}\n",
  `/** ${SOURCE_REF} — wave 2: ${mathMcqExtra.length} câu */\nexport const MCQ_BANK_EXTRA: McqQuestion[] = [\n${mathMcqExtra
    .map(
      (q) =>
        `  { prompt: '${esc(q.prompt)}', choices: [${q.choices.map((c) => `'${esc(c)}'`).join(', ')}], correctIndex: ${q.correctIndex} },`
    )
    .join('\n')}\n];`
);

const mathExtra1 = buildMathTextBankExtra(150);
writeTs(
  'src/games/tinh-nham-trang-ti/mathBankExtra.ts',
  "export interface MathQuestion {\n  text: string;\n  answer: number;\n}\n",
  `/** ${SOURCE_REF} — wave 2 */\nexport const MATH_BANK_EXTRA: MathQuestion[] = [\n${mathExtra1
    .map((q) => `  { text: '${esc(q.text)}', answer: ${q.answer} },`)
    .join('\n')}\n];`
);

const mathExtra2 = buildMathTextBankExtra(150);
writeTs(
  'src/games/cuu-chuong-van-mieu/mathBankExtra.ts',
  "export interface MathQuestion {\n  text: string;\n  answer: number;\n}\n",
  `/** ${SOURCE_REF} — wave 2 */\nexport const MATH_BANK_EXTRA: MathQuestion[] = [\n${mathExtra2
    .map((q) => `  { text: '${esc(q.text)}', answer: ${q.answer} },`)
    .join('\n')}\n];`
);

const vocabExtraLines = EN_VI_EXTRA.map(([en, vi, emoji], i) => {
  const level = i < 40 ? 1 : i < 90 ? 2 : 3;
  return `  { en: '${esc(en)}', vi: '${esc(vi)}', emoji: '${emoji}', level: ${level} as const },`;
});
writeTs(
  'src/games/tu-vung-hoi-an/vocabSupplementExtra.ts',
  "import type { VocabPair } from './questions';",
  `/** ${SOURCE_REF} — ${EN_VI_EXTRA.length} cặp */\nexport const VOCAB_SUPPLEMENT_EXTRA: VocabPair[] = [\n${vocabExtraLines.join('\n')}\n];`
);

const scienceExtra = buildSciencePassagesExtra(30);
writeTs(
  'src/games/trong-dong/scienceSupplementExtra.ts',
  'export interface PassageRound {\n  passage: string;\n  questions: { prompt: string; choices: string[]; correctIndex: number }[];\n}\n',
  `/** ${SOURCE_REF} — ${scienceExtra.reduce((n, r) => n + r.questions.length, 0)} câu */\nexport const SCIENCE_SUPPLEMENT_EXTRA: PassageRound[] = [\n${scienceExtra
    .map(
      (r) =>
        `  {\n    passage: '${esc(r.passage)}',\n    questions: [\n${r.questions
          .map(
            (q) =>
              `      { prompt: '${esc(q.prompt)}', choices: [${q.choices.map((c) => `'${esc(c)}'`).join(', ')}], correctIndex: ${q.correctIndex} },`
          )
          .join('\n')}\n    ],\n  },`
    )
    .join('\n')}\n];`
);

writeTs(
  'src/games/doc-hieu-su-viet/historySupplementExtra.ts',
  '',
  `/** ${SOURCE_REF} — lịch sử wave 2 */\nexport const HISTORY_SUPPLEMENT_EXTRA_DATA: [string, [string, boolean][]][] = ${JSON.stringify(HISTORY_EXTRA_WAVE2, null, 2)};`
);

console.log(`\nDone. ${SOURCE_META.sourceCount} nguồn đề đã ghi trong docs/content/EXAM_SOURCES_GRADE4.md`);
console.log('Chạy npm run build sau khi đã gắn import *Extra vào questions.ts.');
