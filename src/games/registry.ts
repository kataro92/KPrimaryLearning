import type { SceneHost } from '@/core/rendering/sceneHost';
import { renderCuuChuongGame } from './cuu-chuong-van-mieu/play';
import { renderDocHieuSuVietGame } from './doc-hieu-su-viet/play';
import { renderHinhHocThangLongGame } from './hinh-hoc-thang-long/play';
import { renderNetChuRongTienGame } from './net-chu-rong-tien/play';
import { renderThamHiemCuuLongGame } from './tham-hiem-cuu-long/play';
import { renderTinhNhamGame } from './tinh-nham-trang-ti/play';
import { renderTrongDongGame } from './trong-dong/play';
import { renderTrangNguyenToanGame } from './trang-nguyen-toan/play';
import { renderTuVungHoiAnGame } from './tu-vung-hoi-an/play';

export const PLAYABLE_GAME_IDS = new Set([
  'tinh-nham-trang-ti',
  'trang-nguyen-toan',
  'cuu-chuong-van-mieu',
  'net-chu-rong-tien',
  'hinh-hoc-thang-long',
  'tu-vung-hoi-an',
  'trong-dong',
  'doc-hieu-su-viet',
  'tham-hiem-cuu-long',
]);

export type GameRenderer = (
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: import('@/features/gameplay/types').PlayResult) => void
) => () => void;

const RENDERERS: Record<string, GameRenderer> = {
  'tinh-nham-trang-ti': renderTinhNhamGame,
  'trang-nguyen-toan': renderTrangNguyenToanGame,
  'cuu-chuong-van-mieu': renderCuuChuongGame,
  'net-chu-rong-tien': renderNetChuRongTienGame,
  'hinh-hoc-thang-long': renderHinhHocThangLongGame,
  'tu-vung-hoi-an': renderTuVungHoiAnGame,
  'trong-dong': renderTrongDongGame,
  'doc-hieu-su-viet': renderDocHieuSuVietGame,
  'tham-hiem-cuu-long': renderThamHiemCuuLongGame,
};

export function getGameRenderer(gameId: string): GameRenderer | undefined {
  return RENDERERS[gameId];
}

export function isPlayableGame(gameId: string): boolean {
  return PLAYABLE_GAME_IDS.has(gameId);
}
