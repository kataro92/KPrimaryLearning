import { normalizeObjectLabel } from './objectResolver';

/** Nhãn hiển thị trong câu hỏi — bỏ tiền tố/hậu tố máy sinh, gọn và tự nhiên. */
export function displayLabelForQuestion(label: string): string {
  let s = normalizeObjectLabel(label);
  s = s.replace(/\s+/g, ' ').trim();

  const fixes: Array<[RegExp, string]> = [
    [/^tên$/, 'thẻ tên'],
    [/^nhớ$/, 'thẻ ghi nhớ'],
    [/^dính cuộn$/, 'cuộn băng dính'],
    [/^tay ghế$/, 'tay vịn ghế'],
    [/^brownie$/, 'bánh brownie'],
    [/^tofu$/, 'miếng đậu phụ'],
    [/^decal$/, 'miếng decal'],
    [/^remote$/, 'điều khiển tivi'],
    [/^onigiri$/, 'cơm nắm onigiri'],
    [/^dorito$/, 'miếng bánh dorito'],
    [/^pizza$/, 'miếng pizza'],
    [/^sandwich$/, 'bánh sandwich'],
    [/^sushi$/, 'khay sushi'],
    [/^flan$/, 'bánh flan'],
    [/^nem rán$/, 'viên nem rán'],
    [/^kite giấy/i, 'diều giấy'],
    [/^miếng brownie$/, 'miếng bánh brownie'],
    [/^miếng tofu vuông$/, 'miếng đậu phụ vuông'],
  ];
  for (const [re, rep] of fixes) {
    if (re.test(s)) s = rep;
  }

  if (s.length > 0) {
    s = s.charAt(0).toUpperCase() + s.slice(1);
  }
  return s;
}

export function questionPromptText(label: string): string {
  const name = displayLabelForQuestion(label);
  return `Trong tranh vẽ là ${name}. Đây là dạng hình gì?`;
}

export function speechQuestionText(label: string): string {
  const name = displayLabelForQuestion(label);
  return `${name} là dạng hình gì?`;
}
