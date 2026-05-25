/** Vùng thả trên bản đồ SGK Hình 1 — bám `public/maps/vietnam-admin-kntt.svg` */
export type MapRegionId =
  | 'bac-bo'
  | 'trung-bo'
  | 'nam-bo'
  | 'tay-nguyen'
  | 'hoang-sa'
  | 'truong-sa'
  | 'phu-quoc'
  | 'con-son'
  | 'bach-long-vi'
  | 'ly-son'
  | 'con-co'
  | 'phu-quy'
  | 'tho-chu';

/** Chương / mục SGK KNTT lớp 4 (ma trận `docs/content/SGK_LICH_SU_DIA_LI_4_KNTT.md`) */
export type SgkUnitId =
  | 'dia-phuong'
  | 'trung-du-bac-bo'
  | 'dong-bang-bac-bo'
  | 'duyen-hai-trung'
  | 'tay-nguyen'
  | 'dbscl'
  | 'lich-su-vung'
  | 'ban-do-dao';

export type SuDiaKind = 'dia' | 'su' | 'mix';

export interface SuDiaChallenge {
  id: string;
  kind: SuDiaKind;
  /** Câu hỏi / gợi ý đọc to */
  prompt: string;
  /** Chữ trên thẻ kéo */
  cardLabel: string;
  region: MapRegionId;
  /** Cấp danh hiệu tối thiểu (1–3) */
  minLevel: 1 | 2 | 3;
  /** Mục SGK — phục vụ kiểm tra độ phủ ngân hàng */
  sgkUnit: SgkUnitId;
}

export const REGION_LABELS: Record<MapRegionId, string> = {
  'bac-bo': 'Bắc Bộ',
  'trung-bo': 'Miền Trung',
  'nam-bo': 'Nam Bộ (ĐBSCL)',
  'tay-nguyen': 'Tây Nguyên',
  'hoang-sa': 'Quần đảo Hoàng Sa',
  'truong-sa': 'Quần đảo Trường Sa',
  'phu-quoc': 'Đảo Phú Quốc',
  'con-son': 'Đảo Côn Sơn',
  'bach-long-vi': 'Đảo Bạch Long Vĩ',
  'ly-son': 'Đảo Lý Sơn',
  'con-co': 'Đảo Cồn Cỏ',
  'phu-quy': 'Đảo Phú Quý',
  'tho-chu': 'Quần đảo Thổ Chu',
};
