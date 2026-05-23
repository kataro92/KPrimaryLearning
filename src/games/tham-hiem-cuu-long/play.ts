import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState } from '@/features/gameplay/timerBar';
import { tickTimerSfx } from '@/features/audio/sfxService';
import { TimerEngine } from '@/core/engine/timerEngine';
import { scheduleAfterAnswer } from '@/features/gameplay/roundUi';
import { gameFeedbackLine } from '@/features/speech/interactiveText';
import { playSfx } from '@/features/audio/sfxService';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { BINS, pickItems, timePerItemMs, type ClassifyItem } from './questions';
import { FpsCrossbowScene, type FpsOption } from './fpsCrossbowScene';

export type { PlayResult };

export function renderThamHiemCuuLongGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'tham-hiem-cuu-long';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const items = pickItems(level);
  const perMs = timePerItemMs(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: items.length,
    targetTimeSec: perMs / 1000,
    startedAt,
  });

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--cuu-long');
  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="fps-wrap" tabindex="-1">
      <button type="button" class="fps-back-btn btn btn-secondary" id="fps-back">← Về</button>
    </div>
  `;

  const fpsMount = heroHost.querySelector<HTMLElement>('.fps-wrap')!;
  const backBtn = fpsMount.querySelector<HTMLElement>('#fps-back')!;
  backBtn.addEventListener('click', () => {
    sceneHost.resetTheme();
    useAppStore.setScreen('home');
  });

  stage.feedbackEl.classList.add('fps-a11y-feedback');
  stage.root.querySelector('.game-play__qa-pane')?.appendChild(stage.feedbackEl);

  const fpsScene = new FpsCrossbowScene(fpsMount);
  const focusFps = () => {
    requestAnimationFrame(() => fpsScene.focusControl());
  };
  focusFps();

  const pushHudFeedback = (text: string, kind: 'ok' | 'bad' | 'neutral' = 'neutral') => {
    fpsScene.setHudFeedback(text, kind);
  };

  const origSetFeedback = stage.setFeedback.bind(stage);
  stage.setFeedback = (text, ok) => {
    origSetFeedback(text, ok);
    pushHudFeedback(text, ok === true ? 'ok' : ok === false ? 'bad' : 'neutral');
  };

  const origSetGameFeedback = stage.setGameFeedback.bind(stage);
  stage.setGameFeedback = (kind) => {
    origSetGameFeedback(kind);
    const ok = kind === 'correct';
    const text = gameFeedbackLine(gameId, kind);
    pushHudFeedback(text, ok ? 'ok' : kind === 'wrong' || kind === 'timeout' ? 'bad' : 'neutral');
  };

  let index = 0;
  let questionStarted = Date.now();
  let roundLocked = false;
  let currentItem: ClassifyItem | null = null;
  let currentOptions: FpsOption[] = [];
  const optionColors = [0x22c55e, 0x3b82f6, 0xf59e0b];
  const optionCodes: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];
  let submitAnswer: ((binId: string) => Promise<void>) | null = null;

  const showItem = (item: ClassifyItem) => {
    roundLocked = false;
    currentItem = item;
    currentOptions = [...BINS]
      .sort(() => Math.random() - 0.5)
      .map((b, i) => ({
        id: b.id,
        label: b.label,
        code: optionCodes[i]!,
        colorHex: optionColors[i]!,
      }));
    fpsScene.setOptions(currentOptions);
    fpsScene.setHudQuestion(item.label);
    fpsScene.setHudProgress(index, index, items.length);
    stage.setFeedback('');

    submitAnswer = async (binId: string) => {
      if (!currentItem || roundLocked) return;
      roundLocked = true;
      timer.stop();
      const ok = currentItem.bin === binId;
      fpsScene.markAnswer(binId, ok);
      tracker.recordRound(ok, Date.now() - questionStarted);
      stage.setGameFeedback(ok ? 'correct' : 'wrong');
      index++;
      const last = index >= items.length;
      scheduleAfterAnswer(
        last,
        () => showItem(items[index]),
        () => tracker.finish().then(onDone)
      );
    };

    currentShoot = () => {
      const hitId = fpsScene.shoot();
      if (hitId) {
        fpsScene.flashHit(true);
        void submitAnswer?.(hitId);
      } else {
        fpsScene.flashHit(false);
        stage.setFeedback('Bắn trượt rồi, ngắm lại nhé!');
        playSfx('miss');
      }
    };

    focusFps();

    questionStarted = Date.now();
    timer.start(
      perMs,
      (remaining) => {
        fpsScene.setHudTimer(remaining / perMs);
        tickTimerSfx(remaining / perMs, timerSfx);
      },
      () => {
        if (roundLocked || !currentItem) return;
        roundLocked = true;
        timer.stop();
        stage.setGameFeedback('timeout');
        tracker.recordRound(false, Date.now() - questionStarted);
        index++;
        const last = index >= items.length;
        scheduleAfterAnswer(
          last,
          () => showItem(items[index]),
          () => tracker.finish().then(onDone)
        );
      }
    );
  };

  let currentShoot: (() => void) | null = null;

  const onKeyDown = (e: KeyboardEvent) => {
    if (roundLocked) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      currentShoot?.();
      return;
    }
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < currentOptions.length) {
      e.preventDefault();
      void answerByIndex(idx);
      return;
    }
    const codeIdx = optionCodes.indexOf(e.key.toUpperCase() as 'A' | 'B' | 'C');
    if (codeIdx >= 0 && codeIdx < currentOptions.length) {
      e.preventDefault();
      void answerByIndex(codeIdx);
    }
  };

  const answerByIndex = async (idx: number) => {
    const opt = currentOptions[idx];
    if (!opt || roundLocked) return;
    await submitAnswer?.(opt.id);
  };

  const onShootClick = () => {
    if (!roundLocked) currentShoot?.();
  };
  fpsMount.addEventListener('click', onShootClick);
  window.addEventListener('keydown', onKeyDown);

  pushHudFeedback(gameFeedbackLine(gameId, 'start'), 'neutral');
  showItem(items[0]);
  return () => {
    fpsMount.removeEventListener('click', onShootClick);
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    fpsScene.dispose();
    stage.cleanup();
  };
}
