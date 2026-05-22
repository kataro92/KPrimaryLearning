import { useAppStore } from '@/app/store';
import { ACHIEVEMENT_LEVELS, getGameById } from '@/games/catalog';
import { canPlayAchievement, getOrInitProgress } from '@/features/progress/userProgressStore';
import { mountGameSprite } from '@/assets/gameSprites';
import { formatScoreDisplay } from '@/features/scoring/scoreEngine';
import type { AchievementLevel } from '@/data/types';

export function renderGameSelectScreen(root: HTMLElement, gameId: string): void {
  const game = getGameById(gameId);
  if (!game) return;
  const profileId = useAppStore.getState().playerId || 'guest';

  root.innerHTML = `
    <section class="screen screen--scroll screen--clay">
      <button type="button" class="btn btn-secondary btn--toolbar" id="btn-back">← Về</button>
      <h1>${escapeHtml(game.title)}</h1>
      <p class="subtitle">${escapeHtml(game.subject)} · ${escapeHtml(game.description)}</p>
      <div class="game-select-art" id="game-art"></div>
      <div class="card clay-card play-hint-card">
        <p class="play-hint-card__label">Cách chơi</p>
        <p class="play-hint-card__text">${escapeHtml(game.playHint)}</p>
      </div>
      <p class="subtitle">Chọn danh hiệu</p>
      <div class="level-list" id="levels"></div>
    </section>
  `;

  const levelsEl = root.querySelector('#levels')!;
  mountGameSprite(root.querySelector<HTMLElement>('#game-art')!, gameId, 'thumb');

  void getOrInitProgress(profileId, gameId, game.achievements[1]).then((progress) => {
    levelsEl.innerHTML = ACHIEVEMENT_LEVELS.map((lvl) => {
      const unlocked = canPlayAchievement(progress, lvl);
      const name = game.achievements[lvl];
      const best =
        progress.bestScore > 0 && unlocked
          ? ` · Kỷ lục: ${formatScoreDisplay(progress.bestScore)}`
          : '';
      return `
        <button type="button" class="game-card game-card--level" data-level="${lvl}" ${unlocked ? '' : 'disabled'}>
          <p class="game-card__title">${unlocked ? '▶' : '🔒'} ${escapeHtml(name)}</p>
          <p class="game-card__meta">${unlocked ? `Đang mở${best}` : 'Hoàn thành danh hiệu trước để mở'}</p>
        </button>
      `;
    }).join('');

    levelsEl.querySelectorAll<HTMLButtonElement>('button[data-level]:not([disabled])').forEach((btn) => {
      btn.addEventListener('click', () => {
        const level = Number(btn.dataset.level) as AchievementLevel;
        useAppStore.selectGame(gameId, level);
      });
    });
  });

  root.querySelector('#btn-back')!.addEventListener('click', () => {
    useAppStore.setState({ screen: 'home', selectedGameId: null });
  });
}

function escapeHtml(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
