import type { MapRegionId, SuDiaChallenge } from './challengeTypes';
import { SU_DIA_BANK } from './suDiaBank';
import { SU_DIA_BANK_EXTRA } from './suDiaBankExtra';
import { SU_DIA_BANK_SUPPLEMENT } from './suDiaBankSupplement';
import { buildCoverageReport } from './suDiaCoverage';

export type { SuDiaChallenge, MapRegionId, SuDiaKind, SgkUnitId } from './challengeTypes';
export { REGION_LABELS } from './challengeTypes';
export { buildCoverageReport, SGK_UNIT_LABELS, ALL_SGK_UNITS } from './suDiaCoverage';

/** Toàn bộ ngân hàng (chính + extra) */
export const SU_DIA_ALL: SuDiaChallenge[] = [
  ...SU_DIA_BANK,
  ...SU_DIA_BANK_EXTRA,
  ...SU_DIA_BANK_SUPPLEMENT,
];

/** Báo cáo độ phủ SGK — dùng QA / vòng lặp hoàn thiện */
export const SU_DIA_COVERAGE = buildCoverageReport(SU_DIA_ALL);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateChallenges(level: 1 | 2 | 3, count: number): SuDiaChallenge[] {
  const pool = SU_DIA_ALL.filter((c) => c.minLevel <= level);
  const shuffled = shuffle(pool);
  const picked: SuDiaChallenge[] = [];
  const used = new Set<string>();
  for (const c of shuffled) {
    if (used.has(c.id)) continue;
    used.add(c.id);
    picked.push(c);
    if (picked.length >= count) break;
  }
  while (picked.length < count && pool.length > 0) {
    picked.push(pool[picked.length % pool.length]!);
  }
  return picked;
}

export function activeRegionsForLevel(level: 1 | 2 | 3): Set<MapRegionId> {
  const ids = new Set<MapRegionId>();
  for (const c of SU_DIA_ALL) {
    if (c.minLevel <= level) ids.add(c.region);
  }
  return ids;
}

export function questionCount(level: 1 | 2 | 3): number {
  if (level === 1) return 10;
  if (level === 2) return 12;
  return 14;
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 45000;
  if (level === 2) return 40000;
  return 38000;
}
