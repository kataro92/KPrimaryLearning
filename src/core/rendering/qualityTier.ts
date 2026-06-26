/**
 * Tầng chất lượng đồ họa thích ứng theo phần cứng.
 *
 * Mục tiêu: máy mạnh được hình đẹp (DPR 2, shadow 2048, bloom), máy yếu
 * (Chromebook, tablet cũ) tự hạ tải để vẫn mượt — thay vì mọi máy chạy cùng một mức.
 *
 * Cách dùng:
 *   const profile = getTierProfile();            // tự dò
 *   renderer.setPixelRatio(Math.min(dpr, profile.dprCap));
 *   key.shadow.mapSize.set(profile.shadowMapSize, profile.shadowMapSize);
 *
 * Có thể ép tầng (vd: nút cài đặt cho phụ huynh) bằng setQualityTier('low').
 */
import * as THREE from 'three';

export type QualityTier = 'low' | 'mid' | 'high';

export interface TierProfile {
  tier: QualityTier;
  /** Trần devicePixelRatio (giới hạn số pixel render). */
  dprCap: number;
  /** Bật đổ bóng hay không. */
  shadowsEnabled: boolean;
  /** Kích thước shadow map (px vuông). */
  shadowMapSize: number;
  /** Kiểu lọc shadow của Three.js. */
  shadowMapType: THREE.ShadowMapType;
  /** Bật hậu kỳ bloom hay không. */
  bloomEnabled: boolean;
  /** FPS mục tiêu cho vòng lặp render. */
  fpsCap: number;
  /** Bật MSAA phần cứng (antialias). */
  antialias: boolean;
}

const PROFILES: Record<QualityTier, TierProfile> = {
  high: {
    tier: 'high',
    dprCap: 2,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowMapType: THREE.PCFSoftShadowMap,
    bloomEnabled: true,
    fpsCap: 60,
    antialias: true,
  },
  mid: {
    tier: 'mid',
    dprCap: 1.5,
    shadowsEnabled: true,
    shadowMapSize: 1024,
    shadowMapType: THREE.PCFShadowMap,
    bloomEnabled: true,
    fpsCap: 60,
    antialias: true,
  },
  low: {
    tier: 'low',
    dprCap: 1,
    shadowsEnabled: false,
    shadowMapSize: 512,
    shadowMapType: THREE.PCFShadowMap,
    bloomEnabled: false,
    fpsCap: 30,
    antialias: false,
  },
};

const STORAGE_KEY = 'kv_quality_tier';

function readStoredOverride(): QualityTier | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'low' || v === 'mid' || v === 'high' ? v : null;
  } catch {
    return null;
  }
}

let override: QualityTier | null = readStoredOverride();
let detected: QualityTier | null = null;

/** Dò tầng từ phần cứng (số nhân CPU, RAM, DPR). Kết quả được cache. */
export function detectQualityTier(): QualityTier {
  if (override) return override;
  if (detected) return detected;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4; // GB (chỉ Chromium hỗ trợ)
  const dpr = window.devicePixelRatio || 1;

  let tier: QualityTier = 'mid';

  // Máy mạnh: nhiều nhân + nhiều RAM.
  if (cores >= 8 && memory >= 8) tier = 'high';

  // Máy yếu: ít nhân hoặc ít RAM.
  if (cores <= 4 || memory <= 4) tier = 'low';

  // Rất yếu: chắc chắn low.
  if (cores <= 2 || memory <= 2) tier = 'low';

  // Màn DPI rất cao trên máy yếu càng nặng → giữ low.
  if (tier !== 'high' && dpr >= 2 && cores <= 4) tier = 'low';

  detected = tier;
  return tier;
}

/** Lấy profile của tầng hiện tại (hoặc tầng chỉ định). */
export function getTierProfile(tier: QualityTier = detectQualityTier()): TierProfile {
  return PROFILES[tier];
}

/**
 * Ép một tầng cố định (vd: cài đặt thủ công). Truyền null để quay lại tự dò.
 * Lựa chọn được lưu vào localStorage nên giữ nguyên sau khi tải lại trang.
 * Lưu ý: đổi tầng chỉ áp cho renderer tạo MỚI (vào lại game), nên thường cần tải lại trang.
 */
export function setQualityTier(tier: QualityTier | null): void {
  override = tier;
  try {
    if (tier) localStorage.setItem(STORAGE_KEY, tier);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* localStorage bị chặn — bỏ qua, vẫn áp trong phiên hiện tại. */
  }
}
