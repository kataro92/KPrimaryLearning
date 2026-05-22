export interface ScoreInput {
  correct: number;
  total: number;
  avgTimePerQuestionSec: number;
  targetTimeSec: number;
  maxStreak: number;
}

/** Làm tròn điểm theo bước 0.5 (vd: 9.9 → 10, 8.2 → 8, 8.3 → 8.5) */
export function roundScoreToHalf(raw: number): number {
  const clamped = Math.min(10, Math.max(0, raw));
  return Math.round(clamped * 2) / 2;
}

/** Hiển thị điểm: số nguyên không có .0 (10 thay vì 10.0) */
export function formatScoreDisplay(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

/** Điểm 0-10, làm tròn bước 0.5 */
export function computeScore(input: ScoreInput): number {
  const accuracy = input.total > 0 ? (input.correct / input.total) * 10 : 0;
  const speedRatio = input.avgTimePerQuestionSec / Math.max(input.targetTimeSec, 0.1);
  const speed = Math.max(0, 10 - speedRatio);
  const combo =
    input.total > 0
      ? Math.min(10, (input.maxStreak / input.total) * 10)
      : 0;
  const raw = 0.7 * accuracy + 0.2 * speed + 0.1 * combo;
  return roundScoreToHalf(raw);
}

export function starCount(score: number): number {
  if (score >= 9) return 3;
  if (score >= 7) return 2;
  if (score >= 5) return 1;
  return 0;
}

export function gradeLabel(score: number): string {
  if (score >= 9) return 'Xuất sắc';
  if (score >= 7) return 'Tốt';
  if (score >= 5) return 'Đạt';
  return 'Cần cố gắng';
}
