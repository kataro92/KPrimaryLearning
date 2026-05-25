import type { MapRegionId } from './challengeTypes';

/** Vùng thả — tọa độ % hiệu chỉnh theo Hình 1 SGK (ảnh `page-16-admin-map-reference.png`, 2026-05-24) */
export interface DropZoneLayout {
  id: MapRegionId;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export const DROP_ZONE_LAYOUTS: DropZoneLayout[] = [
  { id: 'bac-bo', label: 'Bắc Bộ', left: 36, top: 10, width: 24, height: 30 },
  { id: 'trung-bo', label: 'Miền Trung', left: 40, top: 36, width: 20, height: 18 },
  { id: 'nam-bo', label: 'Nam Bộ', left: 38, top: 52, width: 22, height: 28 },
  { id: 'tay-nguyen', label: 'Tây Nguyên', left: 50, top: 44, width: 14, height: 16 },
  { id: 'hoang-sa', label: 'Hoàng Sa', left: 70, top: 35, width: 12, height: 12 },
  { id: 'truong-sa', label: 'Trường Sa', left: 74, top: 56, width: 16, height: 16 },
  { id: 'phu-quoc', label: 'Phú Quốc', left: 26, top: 66, width: 8, height: 8 },
  { id: 'con-son', label: 'Côn Sơn', left: 31, top: 75, width: 6, height: 7 },
  { id: 'bach-long-vi', label: 'Bạch Long Vĩ', left: 66, top: 20, width: 6, height: 6 },
  { id: 'ly-son', label: 'Lý Sơn', left: 48, top: 46, width: 6, height: 6 },
  { id: 'con-co', label: 'Cồn Cỏ', left: 54, top: 28, width: 6, height: 6 },
  { id: 'phu-quy', label: 'Phú Quý', left: 48, top: 56, width: 6, height: 6 },
  { id: 'tho-chu', label: 'Thổ Chu', left: 18, top: 64, width: 8, height: 8 },
];

export const MAP_IMAGE_URL = `${import.meta.env.BASE_URL}maps/sgk-kntt-grade4/page-16-admin-map-reference.png`;
