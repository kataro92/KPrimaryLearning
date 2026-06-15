import type { SceneHost } from '@/core/rendering/sceneHost';
import { renderButSenVietGame } from './but-sen-viet/play';
import { renderCuuChuongGame } from './cuu-chuong-van-mieu/play';
import { renderDocHieuSuVietGame } from './doc-hieu-su-viet/play';
import { renderHanhTrinhSuDiaGame } from './hanh-trinh-su-dia/play';
import { renderThamHiemCuuLongGame } from './tham-hiem-cuu-long/play';
import { renderTinhNhamGame } from './tinh-nham-trang-ti/play';
import { renderTrongDongGame } from './trong-dong/play';
import { renderTrangNguyenToanGame } from './trang-nguyen-toan/play';
import { renderTuVungHoiAnGame } from './tu-vung-hoi-an/play';
import { renderDaoDucNhiGame } from './dao-duc-nhi/play';
import { renderBepBacHocTroGame } from './bep-bac-hoc-tro/play';
import { renderChoSoLieuGame } from './cho-so-lieu/play';
import { renderChiaBanhTrangRamGame } from './chia-banh-trang-ram/play';
import { renderDoDatCoThanhGame } from './do-dat-co-thanh/play';
import { renderThapTrieuSoGame } from './thap-trieu-so/play';
import { renderThuongNhanSongHongGame } from './thuong-nhan-song-hong/play';

export const PLAYABLE_GAME_IDS = new Set([
  'tinh-nham-trang-ti',
  'thap-trieu-so',
  'thuong-nhan-song-hong',
  'chia-banh-trang-ram',
  'do-dat-co-thanh',
  'bep-bac-hoc-tro',
  'cho-so-lieu',
  'trang-nguyen-toan',
  'cuu-chuong-van-mieu',
  'but-sen-viet',
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
  'tu-vung-hoi-an': renderTuVungHoiAnGame,
  'trong-dong': renderTrongDongGame,
  'doc-hieu-su-viet': renderDocHieuSuVietGame,
  'hanh-trinh-su-dia': renderHanhTrinhSuDiaGame,
  'tham-hiem-cuu-long': renderThamHiemCuuLongGame,
  'dao-duc-nhi': renderDaoDucNhiGame,
  'thap-trieu-so': renderThapTrieuSoGame,
  'thuong-nhan-song-hong': renderThuongNhanSongHongGame,
  'chia-banh-trang-ram': renderChiaBanhTrangRamGame,
  'do-dat-co-thanh': renderDoDatCoThanhGame,
  'bep-bac-hoc-tro': renderBepBacHocTroGame,
  'cho-so-lieu': renderChoSoLieuGame,
};

export function getGameRenderer(gameId: string): GameRenderer | undefined {
  return RENDERERS[gameId];
}

export function isPlayableGame(gameId: string): boolean {
  return PLAYABLE_GAME_IDS.has(gameId);
}
