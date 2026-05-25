import type { SceneHost } from '@/core/rendering/sceneHost';
import { renderButSenVietGame } from './but-sen-viet/play';
import { renderCuuChuongGame } from './cuu-chuong-van-mieu/play';
import { renderDocHieuSuVietGame } from './doc-hieu-su-viet/play';
import { renderHanhTrinhSuDiaGame } from './hanh-trinh-su-dia/play';
import { renderHinhHocThangLongGame } from './hinh-hoc-thang-long/play';
import { renderThamHiemCuuLongGame } from './tham-hiem-cuu-long/play';
import { renderTinhNhamGame } from './tinh-nham-trang-ti/play';
import { renderTrongDongGame } from './trong-dong/play';
import { renderTrangNguyenToanGame } from './trang-nguyen-toan/play';
import { renderTuVungHoiAnGame } from './tu-vung-hoi-an/play';
import { renderDaoDucNhiGame } from './dao-duc-nhi/play';

export const PLAYABLE_GAME_IDS = new Set([
  'tinh-nham-trang-ti',
  'trang-nguyen-toan',
  'cuu-chuong-van-mieu',
  'but-sen-viet',
  'hinh-hoc-thang-long',
  'tu-vung-hoi-an',
  'trong-dong',
  'doc-hieu-su-viet',
  'hanh-trinh-su-dia',
  'tham-hiem-cuu-long',
  'dao-duc-nhi',
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
  'but-sen-viet': renderButSenVietGame,
  'hinh-hoc-thang-long': renderHinhHocThangLongGame,
  'tu-vung-hoi-an': renderTuVungHoiAnGame,
  'trong-dong': renderTrongDongGame,
  'doc-hieu-su-viet': renderDocHieuSuVietGame,
  'hanh-trinh-su-dia': renderHanhTrinhSuDiaGame,
  'tham-hiem-cuu-long': renderThamHiemCuuLongGame,
  'dao-duc-nhi': renderDaoDucNhiGame,
};

export function getGameRenderer(gameId: string): GameRenderer | undefined {
  return RENDERERS[gameId];
}

export function isPlayableGame(gameId: string): boolean {
  return PLAYABLE_GAME_IDS.has(gameId);
}
