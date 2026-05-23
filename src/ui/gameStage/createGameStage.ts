import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { gameFeedbackLine, type FeedbackKind } from '@/features/speech/interactiveText';
import { startBgm, stopBgm } from '@/features/audio/bgmService';
import { playSfx } from '@/features/audio/sfxService';
import { cancelSpeech, speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { getOrInitProgress } from '@/features/progress/userProgressStore';
import { mountGameSprite } from '@/assets/gameSprites';
import { formatScoreDisplay } from '@/features/scoring/scoreEngine';
import { ANSWER_FEEDBACK_MS } from '@/features/gameplay/roundTiming';
import { StageFeedback3DFx } from './stageFeedback3dFx';

export interface GameStageHandles {
  root: HTMLElement;
  gameArea: HTMLElement;
  feedbackEl: HTMLElement;
  timerFillEl: HTMLElement;
  dotsEl: HTMLElement;
  setFeedback: (text: string, ok?: boolean) => void;
  setGameFeedback: (kind: FeedbackKind) => void;
  updateDots: (index: number, total: number) => void;
  cleanup: () => void;
}

export function createGameStage(
  root: HTMLElement,
  sceneHost: SceneHost,
  gameId: string,
  themeClass: string
): GameStageHandles {
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  sceneHost.setGameTheme(gameId);

  root.innerHTML = `
    <section class="game-play game-play--clay ${themeClass}">
      <header class="game-play__header">
        <button type="button" class="btn btn-secondary game-play__back" id="btn-back">← Về</button>
        <div class="game-play__title-wrap">
          <h1 class="game-play__title">${game.title}</h1>
          <p class="game-play__subtitle" id="achievement-label"></p>
        </div>
      </header>
      <div class="game-play__content">
        <aside class="game-play__visual-pane">
          <div class="game-play__hero" id="game-hero"></div>
        </aside>
        <section class="game-play__qa-pane">
          <div class="progress-dots" id="dots"></div>
          <div class="timer-bar"><div class="timer-bar__fill" id="timer-fill" style="width:100%"></div></div>
          <div class="game-play__arena" id="game-area"></div>
          <p class="feedback" id="feedback"></p>
        </section>
      </div>
    </section>
  `;

  const gameArea = root.querySelector<HTMLElement>('#game-area')!;
  const feedbackEl = root.querySelector<HTMLElement>('#feedback')!;
  const timerFillEl = root.querySelector<HTMLElement>('#timer-fill')!;
  const dotsEl = root.querySelector<HTMLElement>('#dots')!;
  const achLabel = root.querySelector<HTMLElement>('#achievement-label')!;
  const heroEl = root.querySelector<HTMLElement>('#game-hero')!;
  const feedbackFx3d = new StageFeedback3DFx(sceneHost);
  // Some games replace #game-hero with their own 3D preview (avoid static SVG overlay).
  if (gameId !== 'hinh-hoc-thang-long' && gameId !== 'trong-dong' && gameId !== 'tham-hiem-cuu-long' && gameId !== 'cuu-chuong-van-mieu') {
    mountGameSprite(heroEl, gameId, 'hero');
  }

  void getOrInitProgress(profileId, gameId, game.achievements[1]).then((p) => {
    achLabel.textContent = `${game.achievements[level]}`;
    if (p.bestScore > 0) achLabel.textContent += ` · Kỷ lục: ${formatScoreDisplay(p.bestScore)}`;
  });

  const onBack = () => {
    sceneHost.resetTheme();
    useAppStore.setScreen('home');
  };
  root.querySelector('#btn-back')!.addEventListener('click', onBack);

  const intro = gameFeedbackLine(gameId, 'start');
  feedbackEl.textContent = intro;
  speakVietnamese(intro);
  startBgm(gameId);

  return {
    root,
    gameArea,
    feedbackEl,
    timerFillEl,
    dotsEl,
    setFeedback(text, ok) {
      feedbackEl.textContent = text;
      feedbackEl.className = ok === true ? 'feedback feedback--ok' : ok === false ? 'feedback feedback--bad' : 'feedback';
    },
    setGameFeedback(kind) {
      const ok = kind === 'correct';
      feedbackEl.textContent = gameFeedbackLine(gameId, kind);
      feedbackEl.className = ok ? 'feedback feedback--ok' : kind === 'wrong' || kind === 'timeout' ? 'feedback feedback--bad' : 'feedback';
      if (kind !== 'start') {
        feedbackFx3d.trigger(kind, Math.max(520, ANSWER_FEEDBACK_MS - 400));
        if (kind === 'correct') playSfx(gameId === 'trong-dong' ? 'drumStrike' : 'correct');
        else if (kind === 'wrong') playSfx('wrong');
        else if (kind === 'timeout') playSfx('timeout');
      }
      if (kind === 'correct') speakVietnamese('Chính xác');
    },
    updateDots(index, total) {
      dotsEl.innerHTML = Array.from({ length: total }, (_, i) => {
        let c = '';
        if (i < index) c = 'done';
        if (i === index) c = 'current';
        return `<span class="${c}"></span>`;
      }).join('');
    },
    cleanup: () => {
      stopBgm();
      cancelSpeech();
      feedbackFx3d.dispose();
      sceneHost.resetTheme();
      root.querySelector('#btn-back')?.removeEventListener('click', onBack);
    },
  };
}
