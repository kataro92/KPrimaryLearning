/** Chuyển chuỗi gõ Telex (ASCII) sang tiếng Việt có dấu */

const VOWEL_REPLACEMENTS: [RegExp, string][] = [
  [/uw/g, 'ư'],
  [/ow/g, 'ơ'],
  [/aa/g, 'â'],
  [/ee/g, 'ê'],
  [/oo/g, 'ô'],
  [/aw/g, 'ă'],
];

type ToneKey = 's' | 'f' | 'r' | 'x' | 'j' | 'z';

const TONES: Record<string, Partial<Record<ToneKey, string>>> = {
  a: { s: 'á', f: 'à', r: 'ả', x: 'ã', j: 'ạ', z: 'a' },
  ă: { s: 'ắ', f: 'ằ', r: 'ẳ', x: 'ẵ', j: 'ặ', z: 'ă' },
  â: { s: 'ấ', f: 'ầ', r: 'ẩ', x: 'ẫ', j: 'ậ', z: 'â' },
  e: { s: 'é', f: 'è', r: 'ẻ', x: 'ẽ', j: 'ẹ', z: 'e' },
  ê: { s: 'ế', f: 'ề', r: 'ể', x: 'ễ', j: 'ệ', z: 'ê' },
  i: { s: 'í', f: 'ì', r: 'ỉ', x: 'ĩ', j: 'ị', z: 'i' },
  o: { s: 'ó', f: 'ò', r: 'ỏ', x: 'õ', j: 'ọ', z: 'o' },
  ô: { s: 'ố', f: 'ồ', r: 'ổ', x: 'ỗ', j: 'ộ', z: 'ô' },
  ơ: { s: 'ớ', f: 'ờ', r: 'ở', x: 'ỡ', j: 'ợ', z: 'ơ' },
  u: { s: 'ú', f: 'ù', r: 'ủ', x: 'ũ', j: 'ụ', z: 'u' },
  ư: { s: 'ứ', f: 'ừ', r: 'ử', x: 'ữ', j: 'ự', z: 'ư' },
  y: { s: 'ý', f: 'ỳ', r: 'ỷ', x: 'ỹ', j: 'ỵ', z: 'y' },
};

const VOWELS = 'aăâeêioôơuưy';
const TONE_KEYS = 'sfrxj';

function applyVowelReplacements(s: string): string {
  let out = s.replace(/dd/g, 'đ');
  for (const [re, rep] of VOWEL_REPLACEMENTS) {
    out = out.replace(re, rep);
  }
  return out;
}

/** Đặt dấu thanh (sắc, huyền, hỏi, ngã, nặng, z=bỏ) lên nguyên âm chính */
function applyTones(s: string): string {
  const chars = [...s];
  for (let i = 0; i < chars.length; i++) {
    const t = chars[i] as ToneKey;
    if (!TONE_KEYS.includes(t)) continue;

    let vowelIdx = -1;
    for (let j = i - 1; j >= 0; j--) {
      const c = chars[j]!.toLowerCase();
      if (VOWELS.includes(c)) {
        vowelIdx = j;
        if ('oeu'.includes(c) && j > 0 && VOWELS.includes(chars[j - 1]!.toLowerCase())) {
          vowelIdx = j - 1;
        }
        break;
      }
      if (c !== 'đ' && !VOWELS.includes(c) && c !== t) break;
    }

    if (vowelIdx < 0) continue;
    const base = chars[vowelIdx]!.toLowerCase();
    const toned = TONES[base]?.[t];
    if (toned) {
      chars[vowelIdx] = toned;
      chars[i] = '';
    }
  }
  return chars.join('');
}

function isAsciiTelex(s: string): boolean {
  return /^[a-zA-Z0-9\s]+$/.test(s);
}

function isOnlyWhitespace(s: string): boolean {
  return s.length > 0 && s.trim() === '';
}

/** Telex → tiếng Việt; chuỗi đã có dấu thì giữ nguyên (NFC) */
export function telexToVietnamese(raw: string): string {
  if (!raw) return '';
  if (isOnlyWhitespace(raw)) return raw;
  if (!isAsciiTelex(raw)) {
    return raw.normalize('NFC');
  }
  let s = raw.toLowerCase();
  s = applyVowelReplacements(s);
  s = applyTones(s);
  return s.normalize('NFC');
}

export function normVi(s: string): string {
  return s.normalize('NFC').toLowerCase();
}

function isSpaceGrapheme(ch: string): boolean {
  return ch === ' ' || ch === '\u00a0';
}

function rawStartsWithSpace(raw: string): boolean {
  return isSpaceGrapheme(raw[0] ?? '');
}

const TELEX_ALPHABET = 'abcdefghijklmnopqrstuwowrxfjzs0123456789 ';

/**
 * Chuỗi raw (Telex hoặc Unicode) có thể tiếp tục gõ thành target không
 */
export function canTelexBecome(target: string, raw: string): boolean {
  if (isSpaceGrapheme(target)) {
    return raw === '' || rawStartsWithSpace(raw);
  }
  const nTarget = normVi(target);
  if (!raw) return true;

  const conv = telexToVietnamese(raw);
  const nConv = normVi(conv);
  if (nConv === nTarget) return true;
  if (nTarget.startsWith(nConv) && nConv.length < nTarget.length) return true;

  const maxLen = raw.length + 8;
  const seen = new Set<string>();
  const queue: string[] = [raw.toLowerCase()];

  while (queue.length > 0) {
    const p = queue.shift()!;
    if (seen.has(p) || p.length > maxLen) continue;
    seen.add(p);

    const c = telexToVietnamese(p);
    const nc = normVi(c);
    if (nc === nTarget) return true;
    if (nc.length > nTarget.length && !nTarget.startsWith(nc)) continue;
    if (p.length >= maxLen) continue;

    for (const ch of TELEX_ALPHABET) {
      const next = p + ch;
      if (!seen.has(next)) queue.push(next);
    }
  }
  return false;
}

export type TelexConsume = { kind: 'match'; consumed: number } | { kind: 'partial' } | { kind: 'wrong' };

/** Ăn prefix raw để khớp một grapheme đích (vd: "ee" → "ê") */
export function consumeTelexGrapheme(target: string, raw: string): TelexConsume {
  if (isSpaceGrapheme(target)) {
    if (rawStartsWithSpace(raw)) return { kind: 'match', consumed: 1 };
    if (!raw) return { kind: 'partial' };
    return { kind: 'wrong' };
  }

  const lower = raw.toLowerCase();
  const nTarget = normVi(target);

  for (let len = lower.length; len >= 1; len--) {
    const sub = lower.slice(0, len);
    if (normVi(telexToVietnamese(sub)) === nTarget) {
      return { kind: 'match', consumed: len };
    }
  }

  if (canTelexBecome(target, lower)) {
    return { kind: 'partial' };
  }
  return { kind: 'wrong' };
}

/** Gõ cả từ Telex (vd: "ddeem" → đem) — trả về số ký tự đã khớp grapheme */
export function consumeTelexWord(
  targets: string[],
  startIndex: number,
  raw: string
): { nextIndex: number; consumedRaw: number } | { partial: true } | { wrong: true } {
  let idx = startIndex;
  let pos = 0;
  const lower = raw.toLowerCase();

  while (idx < targets.length && pos < lower.length) {
    const rest = lower.slice(pos);
    const result = consumeTelexGrapheme(targets[idx]!, rest);
    if (result.kind === 'partial') return { partial: true };
    if (result.kind === 'wrong') return { wrong: true };
    pos += result.consumed;
    idx++;
  }

  if (pos < lower.length) {
    const leftover = lower.slice(pos);
    const nextTarget = targets[idx];
    if (nextTarget && canTelexBecome(nextTarget, leftover)) {
      return { partial: true };
    }
    if (leftover.trim() || (leftover && !nextTarget)) {
      return { wrong: true };
    }
  }

  return { nextIndex: idx, consumedRaw: pos };
}
