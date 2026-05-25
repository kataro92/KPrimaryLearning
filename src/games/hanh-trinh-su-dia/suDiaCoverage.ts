import type { SgkUnitId, SuDiaChallenge } from './challengeTypes';

/** Mỗi mục SGK cần ít nhất bấy nhiêu câu trong ngân hàng gộp */
export const MIN_QUESTIONS_PER_SGK_UNIT = 5;

export const SGK_UNIT_LABELS: Record<SgkUnitId, string> = {
  'dia-phuong': 'Địa phương em',
  'trung-du-bac-bo': 'Trung du và miền núi Bắc Bộ',
  'dong-bang-bac-bo': 'Đồng bằng Bắc Bộ',
  'duyen-hai-trung': 'Duyên hải miền Trung',
  'tay-nguyen': 'Tây Nguyên',
  'dbscl': 'Đồng bằng sông Cửu Long',
  'lich-su-vung': 'Lịch sử & văn hóa theo vùng',
  'ban-do-dao': 'Bản đồ — quần đảo & đảo (Hình 1)',
};

export const ALL_SGK_UNITS: SgkUnitId[] = [
  'dia-phuong',
  'trung-du-bac-bo',
  'dong-bang-bac-bo',
  'duyen-hai-trung',
  'tay-nguyen',
  'dbscl',
  'lich-su-vung',
  'ban-do-dao',
];

export interface CoverageReport {
  total: number;
  byUnit: Record<SgkUnitId, number>;
  missingUnits: SgkUnitId[];
  complete: boolean;
}

export function buildCoverageReport(bank: SuDiaChallenge[]): CoverageReport {
  const byUnit = Object.fromEntries(ALL_SGK_UNITS.map((u) => [u, 0])) as Record<SgkUnitId, number>;
  for (const c of bank) {
    byUnit[c.sgkUnit] = (byUnit[c.sgkUnit] ?? 0) + 1;
  }
  const missingUnits = ALL_SGK_UNITS.filter((u) => (byUnit[u] ?? 0) < MIN_QUESTIONS_PER_SGK_UNIT);
  return {
    total: bank.length,
    byUnit,
    missingUnits,
    complete: missingUnits.length === 0 && bank.length >= 80,
  };
}
