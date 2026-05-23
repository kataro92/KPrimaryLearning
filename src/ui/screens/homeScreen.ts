import { useAppStore } from '@/app/store';
import { loadSettings, saveSettings } from '@/data/storage/settingsStore';
import { getAllProgress, getAllSessions } from '@/data/indexeddb/db';
import { GAMES } from '@/games/catalog';
import { isPlayableGame } from '@/games/registry';
import { getOrInitProgress } from '@/features/progress/userProgressStore';
import { mountGameSprite } from '@/assets/gameSprites';
import { formatScoreDisplay } from '@/features/scoring/scoreEngine';
import { CharacterKnightScene } from '@/features/character/characterKnightScene';
import { preloadLocalTts } from '@/features/speech/speechService';
import { mountVoiceProfilePanel } from '@/features/speech/voice/mountVoiceProfilePanel';

let activeKnightScene: CharacterKnightScene | null = null;

export function renderHomeScreen(root: HTMLElement): void {
  const { playerName: name, playerId } = useAppStore.getState();
  const profileId = playerId || 'guest';
  const settings = loadSettings();

  root.innerHTML = `
    <section class="screen screen--scroll screen--games screen--clay">
      <h1>Xin chào, ${escapeHtml(name)}!</h1>
      <p class="subtitle">Chọn trò chơi để luyện tập</p>
      <aside class="profile-dock clay-card" aria-label="Hồ sơ và điều hướng">
        <button type="button" class="dock-action" id="btn-character">
          <span class="dock-action__chip">Nhân vật</span>
          <span class="dock-action__tooltip" role="tooltip">Xem báo cáo học tập tổng quan</span>
        </button>
        <button type="button" class="dock-action" id="btn-logout">
          <span class="dock-action__chip">Thoát</span>
          <span class="dock-action__tooltip" role="tooltip">Về trang chọn hồ sơ và tên</span>
        </button>
      </aside>
      <aside class="settings-dock clay-card" aria-label="Cấu hình nhanh">
        <label class="settings-toggle">
          <input type="checkbox" id="opt-sound" ${settings.soundEnabled ? 'checked' : ''} />
          <span class="settings-toggle__chip">Giọng</span>
          <span class="settings-toggle__tooltip" role="tooltip">Bật đọc câu bằng giọng nói</span>
        </label>
        <label class="settings-toggle">
          <input type="checkbox" id="opt-sfx" ${settings.sfxEnabled ? 'checked' : ''} />
          <span class="settings-toggle__chip">SFX</span>
          <span class="settings-toggle__tooltip" role="tooltip">Bật hiệu ứng âm thanh</span>
        </label>
        <label class="settings-toggle">
          <input type="checkbox" id="opt-music" ${settings.musicEnabled ? 'checked' : ''} />
          <span class="settings-toggle__chip">Nhạc</span>
          <span class="settings-toggle__tooltip" role="tooltip">Bật nhạc nền khi chơi</span>
        </label>
        <label class="settings-toggle">
          <input type="checkbox" id="opt-large" ${settings.largeText ? 'checked' : ''} />
          <span class="settings-toggle__chip">Chữ+</span>
          <span class="settings-toggle__tooltip" role="tooltip">Bật cỡ chữ lớn hơn</span>
        </label>
      </aside>
      <div class="game-tile-grid" id="game-list" role="list"></div>
      <div class="character-modal" id="character-modal" hidden>
        <div class="character-modal__backdrop" id="character-close-bg"></div>
        <div class="character-modal__panel clay-card" role="dialog" aria-modal="true" aria-label="Báo cáo nhân vật">
          <div class="character-modal__header">
            <h2 class="character-modal__title">Nhân vật của bạn</h2>
            <button type="button" class="btn btn-secondary character-modal__close" id="character-close-btn">Đóng</button>
          </div>
          <div class="character-modal__body" id="character-report-body">
            <p class="subtitle">Đang tải báo cáo...</p>
          </div>
        </div>
      </div>
    </section>
  `;

  const applyLargeText = (on: boolean) => {
    document.documentElement.classList.toggle('large-text', on);
  };
  applyLargeText(settings.largeText);
  if (settings.soundEnabled) preloadLocalTts();

  root.querySelector('#opt-sound')!.addEventListener('change', (e) => {
    const s = loadSettings();
    s.soundEnabled = (e.target as HTMLInputElement).checked;
    saveSettings(s);
    if (s.soundEnabled) preloadLocalTts();
  });
  root.querySelector('#opt-sfx')!.addEventListener('change', (e) => {
    const s = loadSettings();
    s.sfxEnabled = (e.target as HTMLInputElement).checked;
    saveSettings(s);
  });
  root.querySelector('#opt-music')!.addEventListener('change', (e) => {
    const s = loadSettings();
    s.musicEnabled = (e.target as HTMLInputElement).checked;
    saveSettings(s);
  });
  root.querySelector('#opt-large')!.addEventListener('change', (e) => {
    const s = loadSettings();
    s.largeText = (e.target as HTMLInputElement).checked;
    saveSettings(s);
    applyLargeText(s.largeText);
  });
  const modal = root.querySelector<HTMLElement>('#character-modal')!;
  const reportBody = root.querySelector<HTMLElement>('#character-report-body')!;
  const closeModal = () => {
    modal.hidden = true;
    activeKnightScene?.dispose();
    activeKnightScene = null;
  };

  root.querySelector('#btn-character')!.addEventListener('click', () => {
    modal.hidden = false;
    activeKnightScene?.dispose();
    activeKnightScene = null;
    reportBody.innerHTML = `<p class="subtitle">Đang tải báo cáo...</p>`;
    void renderCharacterReport(profileId, reportBody).catch(() => {
      activeKnightScene?.dispose();
      activeKnightScene = null;
      reportBody.innerHTML = `
        <p class="subtitle">Không tải được báo cáo. Hãy đóng và thử lại.</p>
      `;
    });
  });
  root.querySelector('#character-close-btn')!.addEventListener('click', closeModal);
  root.querySelector('#character-close-bg')!.addEventListener('click', closeModal);
  root.querySelector('#btn-logout')!.addEventListener('click', () => {
    useAppStore.resetSelection();
    useAppStore.setPlayer('', '');
    useAppStore.setScreen('welcome');
  });

  const list = root.querySelector('#game-list')!;

  void (async () => {
    for (const game of GAMES) {
      const progress = await getOrInitProgress(profileId, game.id, game.achievements[1]);
      const tile = document.createElement('div');
      tile.setAttribute('role', 'listitem');
      const playable = isPlayableGame(game.id);
      const record =
        progress.bestScore > 0 ? ` · Kỷ lục ${formatScoreDisplay(progress.bestScore)}` : '';
      tile.innerHTML = `
        <button type="button" class="game-card game-card--tile${playable ? '' : ' game-card--disabled'}" data-game-id="${game.id}" ${playable ? '' : 'disabled'}>
          <span class="game-card__art" data-art-slot></span>
          <div class="game-card__body">
            <p class="game-card__title">${escapeHtml(game.title)}</p>
            <p class="game-card__meta">${escapeHtml(game.subject)}</p>
            <p class="game-card__desc">${escapeHtml(game.description)}${record}</p>
            <div class="badge-row">
              <span class="badge badge--active">${escapeHtml(game.achievements[1])}</span>
              <span class="badge ${progress.achievementLevelUnlocked >= 2 ? 'badge--active' : 'badge--locked'}">${escapeHtml(game.achievements[2])}</span>
              <span class="badge ${progress.achievementLevelUnlocked >= 3 ? 'badge--active' : 'badge--locked'}">${escapeHtml(game.achievements[3])}</span>
            </div>
            ${playable ? '' : '<p class="game-card__soon">Sắp mở</p>'}
          </div>
        </button>
      `;
      const artSlot = tile.querySelector<HTMLElement>('[data-art-slot]');
      if (artSlot) mountGameSprite(artSlot, game.id, 'card');
      list.appendChild(tile);
    }

    list.querySelectorAll<HTMLButtonElement>('.game-card:not([disabled])').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gameId = btn.dataset.gameId!;
        useAppStore.setState({ screen: 'game-select', selectedGameId: gameId });
      });
    });
  })();
}

async function renderCharacterReport(profileId: string, reportBody: HTMLElement): Promise<void> {
  const [sessions, progressList] = await Promise.all([
    getAllSessions(profileId),
    getAllProgress(profileId),
  ]);
  const totalSessions = sessions.length;
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correctCount, 0);
  const totalWrong = sessions.reduce((sum, s) => sum + s.wrongCount, 0);
  const totalQuestions = totalCorrect + totalWrong;
  const avgScore =
    totalSessions > 0
      ? Math.round((sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions) * 10) / 10
      : 0;
  const bestScore = sessions.reduce((max, s) => Math.max(max, s.score), 0);
  const totalMinutes = Math.round(sessions.reduce((sum, s) => sum + s.durationMs, 0) / 60000);
  const lastPlayedAt = sessions[0]?.endedAt;
  const unlockedTier3 = progressList.filter((p) => p.achievementLevelUnlocked >= 3).length;
  const accuracyPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const unlockedPct = Math.round((unlockedTier3 / GAMES.length) * 100);
  const accuracyTier = pctTier(accuracyPct);
  const unlockTier = pctTier(unlockedPct);
  const avgScoreTier = scoreTier(avgScore);

  const rows = GAMES.map((game) => {
    const progress = progressList.find((p) => p.gameId === game.id);
    const gameSessions = sessions.filter((s) => s.gameId === game.id);
    return {
      title: game.title,
      sessions: gameSessions.length,
      bestScore: progress?.bestScore ?? 0,
      level: progress?.achievementLevelUnlocked ?? 1,
    };
  }).filter((r) => r.sessions > 0 || r.bestScore > 0);

  const maxSessions = Math.max(1, ...rows.map((r) => r.sessions));
  const gameBars = rows.length
    ? rows
        .sort((a, b) => b.sessions - a.sessions || b.bestScore - a.bestScore)
        .slice(0, 8)
        .map((row) => {
          const barTier = scoreTier(row.bestScore);
          return `<li>
      <div class="character-bar__head">
        <strong>${escapeHtml(row.title)}</strong>
        <span>${row.sessions} lượt</span>
      </div>
      <div class="character-bar__track">
        <span class="character-bar__fill character-bar__fill--${barTier}" style="width:${Math.round((row.sessions / maxSessions) * 100)}%"></span>
      </div>
      <p>Điểm cao <span class="character-score character-score--${barTier}">${formatScoreDisplay(row.bestScore)}</span> · Mốc ${row.level}</p>
    </li>`;
        })
        .join('')
    : '<li><strong>Chưa có dữ liệu</strong><p>Hãy chơi vài ván để thấy biểu đồ chi tiết.</p></li>';

  const knightStats = {
    avgScore,
    bestScore,
    accuracyPct,
    unlockedPct,
    totalSessions,
  };

  reportBody.innerHTML = `
    <div class="character-report-layout">
      <div class="character-knight-stage" id="character-knight-mount" aria-hidden="true"></div>
      <div class="character-report-stats">
    <div class="character-kpis">
      <article class="character-kpi"><span>Lượt chơi</span><strong>${totalSessions}</strong></article>
      <article class="character-kpi"><span>Tổng điểm TB</span><strong class="character-score character-score--${avgScoreTier}">${avgScore}</strong></article>
      <article class="character-kpi"><span>Điểm cao nhất</span><strong class="character-score character-score--${scoreTier(bestScore)}">${formatScoreDisplay(bestScore)}</strong></article>
      <article class="character-kpi"><span>Tổng phút học</span><strong>${totalMinutes}</strong></article>
      <article class="character-kpi"><span>Câu đã làm</span><strong>${totalQuestions}</strong></article>
      <article class="character-kpi"><span>Đúng / Sai</span><strong>${totalCorrect}/${totalWrong}</strong></article>
    </div>
    <div class="character-chart-grid">
      <article class="character-chart-card">
        <h3>Tỷ lệ làm đúng</h3>
        <div class="character-donut character-donut--${accuracyTier}" style="--pct:${accuracyPct}">
          <span class="character-donut__label character-donut__label--${accuracyTier}">${accuracyPct}%</span>
        </div>
        <p>${totalCorrect} câu đúng · ${totalWrong} câu sai</p>
      </article>
      <article class="character-chart-card">
        <h3>Tiến độ mốc cao nhất</h3>
        <div class="character-progress">
          <div class="character-progress__track">
            <span class="character-progress__fill character-progress__fill--${unlockTier}" style="width:${unlockedPct}%"></span>
          </div>
          <strong>${unlockedTier3}/${GAMES.length} trò đạt mốc 3 (${unlockedPct}%)</strong>
        </div>
        <p>Tiếp tục chơi đều để mở hết các danh hiệu cao nhất.</p>
      </article>
    </div>
    <p class="character-meta">
      ${lastPlayedAt ? `Lần chơi gần nhất: ${formatDateTime(lastPlayedAt)} · ` : ''}Đã mở tối đa mốc 3 ở ${unlockedTier3}/${GAMES.length} trò.
    </p>
    <p class="character-legend" aria-hidden="true">
      <span class="character-legend__item character-legend__item--high">Tốt</span>
      <span class="character-legend__item character-legend__item--mid">Khá</span>
      <span class="character-legend__item character-legend__item--low">Cần luyện thêm</span>
    </p>
    <h3 class="character-section-title">Biểu đồ lượt chơi theo trò</h3>
    <ul class="character-game-bars">${gameBars}</ul>
      </div>
    </div>
  `;

  const knightMount = reportBody.querySelector<HTMLElement>('#character-knight-mount');
  if (knightMount) {
    activeKnightScene = new CharacterKnightScene(knightMount, knightStats);
  }

  const statsPane = reportBody.querySelector<HTMLElement>('.character-report-stats');
  if (statsPane) {
    void mountVoiceProfilePanel(statsPane, profileId).catch(() => {
      /* voice panel optional */
    });
  }
}

/** Ngưỡng %: ≥80 xanh, 50–79 vàng, <50 đỏ */
function pctTier(pct: number): 'high' | 'mid' | 'low' {
  if (pct >= 80) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

/** Ngưỡng điểm 0–10: ≥8 xanh, 5–7.9 vàng, <5 đỏ */
function scoreTier(score: number): 'high' | 'mid' | 'low' {
  if (score >= 8) return 'high';
  if (score >= 5) return 'mid';
  return 'low';
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeHtml(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
