import * as THREE from 'three';
import { createSpritePlane } from './gameSpritePlane';

export interface GameTheme {
  background: number;
  accents: number[];
}

export const GAME_THEMES: Record<string, GameTheme> = {
  'tu-vung-hoi-an': { background: 0xfff4d6, accents: [0xf59e0b, 0xdc2626, 0xfbbf24] },
  'tham-hiem-cuu-long': { background: 0xd1fae5, accents: [0x059669, 0x0ea5e9, 0x78350f] },
  'hinh-hoc-thang-long': { background: 0xe2e8f0, accents: [0x64748b, 0xb45309, 0x1e40af] },
  'trong-dong': { background: 0xe8dcc8, accents: [0xb8860b, 0x5c4033, 0xcd7f32] },
  'doc-hieu-su-viet': { background: 0xfee2e2, accents: [0xdc2626, 0xfbbf24, 0x1e3a8a] },
  'hanh-trinh-su-dia': { background: 0xdbeafe, accents: [0x2563eb, 0xfbbf24, 0x16a34a] },
  'cuu-chuong-van-mieu': { background: 0xe0e7ff, accents: [0x4f46e5, 0xfbbf24, 0x78716c] },
  'trang-nguyen-toan': { background: 0x030712, accents: [0x2563eb, 0xfacc15, 0xdc2626] },
  'tinh-nham-trang-ti': { background: 0xdcfce7, accents: [0x16a34a, 0xf97316, 0xca8a04] },
};

export function buildThemeDecor(themeId: string): THREE.Object3D[] {
  const theme = GAME_THEMES[themeId] ?? GAME_THEMES['trang-nguyen-toan'];
  const objs: THREE.Object3D[] = [];

  if (themeId === 'trang-nguyen-toan') {
    /* Canvas 3D robot trong khung hero — không dùng sprite phẳng */
  } else {
    objs.push(createSpritePlane(themeId));
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 2),
      new THREE.MeshBasicMaterial({ color: theme.background, transparent: true, opacity: 0.5 })
    );
    ground.position.y = -2;
    objs.push(ground);
  }

  return objs;
}
