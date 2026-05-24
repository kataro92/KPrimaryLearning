import { VOCAB_SUPPLEMENT } from './vocabSupplement';
import { VOCAB_SUPPLEMENT_EXTRA } from './vocabSupplementExtra';

export interface VocabPair {
  en: string;
  vi: string;
  emoji: string;
  level: 1 | 2 | 3;
}

export const VOCAB_PAIRS: VocabPair[] = [
  { en: 'apple', vi: 'táo', emoji: '🍎', level: 1 },
  { en: 'book', vi: 'sách', emoji: '📚', level: 1 },
  { en: 'cat', vi: 'mèo', emoji: '🐱', level: 1 },
  { en: 'school', vi: 'trường', emoji: '🏫', level: 1 },
  { en: 'water', vi: 'nước', emoji: '💧', level: 1 },
  { en: 'mother', vi: 'mẹ', emoji: '👩', level: 1 },
  { en: 'father', vi: 'bố', emoji: '👨', level: 1 },
  { en: 'friend', vi: 'bạn', emoji: '🧑‍🤝‍🧑', level: 1 },
  { en: 'pen', vi: 'bút', emoji: '🖊️', level: 1 },
  { en: 'notebook', vi: 'vở', emoji: '📓', level: 1 },
  { en: 'banana', vi: 'chuối', emoji: '🍌', level: 1 },
  { en: 'rice', vi: 'cơm', emoji: '🍚', level: 1 },
  { en: 'teacher', vi: 'giáo viên', emoji: '👩‍🏫', level: 2 },
  { en: 'breakfast', vi: 'bữa sáng', emoji: '🌅', level: 2 },
  { en: 'elephant', vi: 'voi', emoji: '🐘', level: 2 },
  { en: 'library', vi: 'thư viện', emoji: '📖', level: 2 },
  { en: 'beautiful', vi: 'đẹp', emoji: '✨', level: 2 },
  { en: 'hospital', vi: 'bệnh viện', emoji: '🏥', level: 2 },
  { en: 'market', vi: 'chợ', emoji: '🛒', level: 2 },
  { en: 'farmer', vi: 'nông dân', emoji: '🧑‍🌾', level: 2 },
  { en: 'science', vi: 'khoa học', emoji: '🔬', level: 2 },
  { en: 'history', vi: 'lịch sử', emoji: '📜', level: 2 },
  { en: 'mountain', vi: 'núi', emoji: '⛰️', level: 2 },
  { en: 'river', vi: 'sông', emoji: '🏞️', level: 2 },
  { en: 'discover', vi: 'khám phá', emoji: '🔍', level: 3 },
  { en: 'environment', vi: 'môi trường', emoji: '🌿', level: 3 },
  { en: 'important', vi: 'quan trọng', emoji: '⭐', level: 3 },
  { en: 'recycle', vi: 'tái chế', emoji: '♻️', level: 3 },
  { en: 'energy', vi: 'năng lượng', emoji: '⚡', level: 3 },
  { en: 'festival', vi: 'lễ hội', emoji: '🎊', level: 3 },
  { en: 'traditional', vi: 'truyền thống', emoji: '🏮', level: 3 },
  { en: 'continent', vi: 'châu lục', emoji: '🌍', level: 3 },
  { en: 'triangle', vi: 'tam giác', emoji: '🔺', level: 3 },
  { en: 'rectangle', vi: 'hình chữ nhật', emoji: '▭', level: 3 },
  { en: 'fraction', vi: 'phân số', emoji: '➗', level: 3 },
  { en: 'protect', vi: 'bảo vệ', emoji: '🛡️', level: 3 },
  { en: 'dolphin', vi: 'cá heo', emoji: '🐬', level: 3 },
  ...VOCAB_SUPPLEMENT,
  ...VOCAB_SUPPLEMENT_EXTRA,
];

export function pairCount(level: 1 | 2 | 3): number {
  if (level === 1) return 6;
  if (level === 2) return 8;
  return 10;
}

export function selectPairs(level: 1 | 2 | 3): VocabPair[] {
  const pool = VOCAB_PAIRS.filter((p) => p.level <= level);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, pairCount(level));
}

export function sessionTimeMs(level: 1 | 2 | 3): number {
  // Mức dễ: 6 cặp * 30s = 180s
  if (level === 1) return 180000;
  if (level === 2) return 150000;
  return 180000;
}
