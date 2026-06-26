/**
 * Factory tạo WebGLRenderer dùng chung cho mọi scene 3D.
 *
 * Tập trung chính sách chất lượng (DPR, antialias, shadow map) vào một chỗ,
 * áp theo tầng phần cứng (xem qualityTier.ts). Sửa một nơi → áp cho mọi game.
 *
 * Scene vẫn tự đặt các thuộc tính riêng sau khi tạo (toneMapping, outputColorSpace,
 * className, appendChild...) và tự đặt kích thước shadow map trên đèn bằng
 * profile.shadowMapSize.
 */
import * as THREE from 'three';
import { detectQualityTier, getTierProfile, type QualityTier, type TierProfile } from './qualityTier';

export interface GameRendererOptions {
  /** Canvas có sẵn (vd: FPS tự tạo canvas riêng). Bỏ trống thì Three tự tạo. */
  canvas?: HTMLCanvasElement;
  /** Có cần đổ bóng không (mặc định true). Sẽ bị tắt nếu tầng low. */
  shadows?: boolean;
  /** Ép tầng cụ thể (mặc định tự dò). */
  tier?: QualityTier;
}

export interface GameRendererResult {
  renderer: THREE.WebGLRenderer;
  tier: QualityTier;
  profile: TierProfile;
}

export function createGameRenderer(opts: GameRendererOptions = {}): GameRendererResult {
  const tier = opts.tier ?? detectQualityTier();
  const profile = getTierProfile(tier);

  const renderer = new THREE.WebGLRenderer({
    canvas: opts.canvas,
    antialias: profile.antialias,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.dprCap));

  const shadows = (opts.shadows ?? true) && profile.shadowsEnabled;
  renderer.shadowMap.enabled = shadows;
  if (shadows) {
    renderer.shadowMap.type = profile.shadowMapType;
  }

  return { renderer, tier, profile };
}
