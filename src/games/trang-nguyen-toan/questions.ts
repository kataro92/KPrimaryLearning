export interface McqQuestion {
  prompt: string;
  choices: string[];
  correctIndex: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMcq(prompt: string, answer: number, extraWrong: number[] = []): McqQuestion {
  const pool = new Set<number>();
  for (const w of extraWrong) {
    if (w !== answer && w >= 0) pool.add(w);
  }
  while (pool.size < 3) {
    const d = answer + randInt(-4, 4);
    if (d !== answer && d >= 0) pool.add(d);
  }
  const nums = shuffle([answer, ...Array.from(pool).slice(0, 3)]);
  const choices = nums.map(String);
  return {
    prompt,
    choices,
    correctIndex: choices.indexOf(String(answer)),
  };
}

export function generateMcqQuestions(count: number, level: 1 | 2 | 3): McqQuestion[] {
  const qs: McqQuestion[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  while (qs.length < count && attempts < count * 24) {
    const q = generateOne(level);
    attempts++;
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    qs.push(q);
  }
  while (qs.length < count) {
    qs.push(generateOne(level));
  }
  return qs;
}

function generateOne(level: 1 | 2 | 3): McqQuestion {
  if (level === 1) {
    const type = randInt(0, 3);
    if (type === 0) {
      const a = randInt(10, 99);
      const b = randInt(10, 99);
      return buildMcq(`${a} + ${b} = ?`, a + b, [a + b + 10, a + b - 10, a + b + 1]);
    }
    if (type === 1) {
      const a = randInt(30, 120);
      const b = randInt(10, 29);
      return buildMcq(`${a} - ${b} = ?`, a - b, [a - b + 10, a - b - 10, a - b + 1]);
    }
    if (type === 2) {
      const side = randInt(2, 12);
      return buildMcq(`Hình vuông cạnh ${side}cm có chu vi bằng bao nhiêu cm?`, side * 4, [
        side * 2,
        side * 3,
        side * 5,
      ]);
    }
    const half = randInt(2, 12);
    const whole = half * 2;
    return buildMcq(`Một nửa số ${whole} là bao nhiêu?`, half, [half + 1, half - 1, whole]);
  }
  if (level === 2) {
    const type = randInt(0, 4);
    if (type === 0) {
      const a = randInt(2, 12);
      const b = randInt(2, 9);
      return buildMcq(`${a} × ${b} = ?`, a * b, [a * b + b, a * b - a, a + b]);
    }
    if (type === 1) {
      const b = randInt(2, 9);
      const ans = randInt(2, 9);
      const a = b * ans;
      return buildMcq(`${a} chia ${b} bằng mấy?`, ans, [ans + 1, Math.max(1, ans - 1), b]);
    }
    if (type === 2) {
      const length = randInt(4, 20);
      const width = randInt(2, 10);
      const p = (length + width) * 2;
      return buildMcq(`Hình chữ nhật dài ${length}cm, rộng ${width}cm. Chu vi là?`, p, [
        length * width,
        length + width,
        p + 4,
      ]);
    }
    if (type === 3) {
      const pack = randInt(3, 9);
      const each = randInt(4, 12);
      const total = pack * each;
      return buildMcq(`Có ${pack} túi, mỗi túi ${each} viên bi. Có tất cả bao nhiêu viên bi?`, total, [
        pack + each,
        total - each,
        total + pack,
      ]);
    }
    const apples = randInt(20, 60);
    const eaten = randInt(5, 19);
    const left = apples - eaten;
    return buildMcq(
      `Lan có ${apples} quả táo, ăn ${eaten} quả. Còn lại bao nhiêu quả?`,
      left,
      [left + 1, left - 1, eaten, apples]
    );
  }
  const type = randInt(0, 5);
  if (type === 0) {
    const a = randInt(4, 12);
    const b = randInt(3, 9);
    const c = randInt(1, 9);
    const ans = a * b + c;
    return buildMcq(`${a} × ${b} + ${c} = ?`, ans, [a * b, a + b + c, ans - 1, ans + 2]);
  }
  if (type === 1) {
    const a = randInt(4, 9);
    const b = randInt(2, 8);
    const c = randInt(1, 6);
    const ans = a * (b + c);
    return buildMcq(`${a} × (${b} + ${c}) = ?`, ans, [a * b + c, a * b + a * c - a, ans + a]);
  }
  if (type === 2) {
    const each = randInt(4, 12);
    const boxes = randInt(3, 10);
    const total = each * boxes;
    return buildMcq(`Có ${total} quyển vở, chia đều ${each} quyển mỗi hộp. Được mấy hộp?`, boxes, [
      each,
      boxes + 1,
      Math.max(1, boxes - 1),
    ]);
  }
  if (type === 3) {
    const a = randInt(100, 999);
    const b = randInt(10, 99);
    return buildMcq(`${a} + ${b} = ?`, a + b, [a + b + 10, a + b - 10, a + b + 1]);
  }
  if (type === 4) {
    const quarter = randInt(5, 20);
    const n = quarter * 4;
    return buildMcq(`Một phần tư số ${n} là bao nhiêu?`, quarter, [quarter + 1, quarter - 1, n]);
  }
  const d = randInt(7, 15);
  const r = randInt(4, 12);
  const area = d * r;
  return buildMcq(`Hình chữ nhật dài ${d}cm, rộng ${r}cm. Diện tích là?`, area, [
    (d + r) * 2,
    d + r,
    area + d,
  ]);
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 22000;
  return 20000;
}

export function questionCount(level: 1 | 2 | 3): number {
  if (level === 1) return 10;
  if (level === 2) return 12;
  return 12;
}
