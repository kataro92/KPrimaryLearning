import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { scheduleAfterAnswer, setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
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
  heroHost.innerHTML =
    '<div class="fps-wrap"><div class="fps-crosshair">+</div><div class="fps-hit-marker" id="fps-hit-marker">✦</div></div>';
  const fpsMount = heroHost.querySelector<HTMLElement>('.fps-wrap')!;
  const hitMarkerEl = heroHost.querySelector<HTMLElement>('#fps-hit-marker')!;
  const fpsScene = new FpsCrossbowScene(fpsMount);
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

    stage.updateDots(index, items.length);
    stage.setFeedback('');
    stage.gameArea.innerHTML = `
      <div class="fps-quiz">
        <p class="fps-quiz__prompt">Bắn vào đáp án đúng cho vật phẩm: <strong>${item.label}</strong></p>
        <div class="fps-quiz__options">
          ${currentOptions
            .map(
              (o) =>
                `<button type="button" class="fps-option" data-id="${o.id}" style="--opt-color:#${o.colorHex.toString(16).padStart(6, '0')}">
                  <span class="fps-option__code">${o.code}</span>
                  <span>${o.label}</span>
                </button>`
            )
            .join('')}
        </div>
        <p class="fps-quiz__hint">Ngắm vào bảng A/B/C cùng màu với đáp án bên dưới · Click/Space để bắn</p>
      </div>
    `;

    const lockFpsOptions = (pickedId?: string) => {
      const correctId = currentItem?.bin;
      stage.gameArea.querySelector('.fps-quiz__options')?.classList.add('round-choices--locked');
      stage.gameArea.querySelectorAll<HTMLButtonElement>('.fps-option').forEach((btn) => {
        btn.disabled = true;
        if (btn.dataset.id === correctId) btn.classList.add('round-btn--correct');
        if (pickedId && btn.dataset.id === pickedId) btn.classList.add('round-btn--picked');
      });
      setRoundHint(stage.gameArea, '.fps-quiz__hint', WAIT_NEXT_HINT);
    };

    submitAnswer = async (binId: string) => {
      if (!currentItem || roundLocked) return;
      roundLocked = true;
      timer.stop();
      lockFpsOptions(binId);
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

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.fps-option').forEach((btn) => {
      btn.addEventListener('click', () => void submitAnswer?.(btn.dataset.id!));
    });

    currentShoot = () => {
      const hitId = fpsScene.shoot();
      hitMarkerEl.classList.remove('fps-hit-marker--ok', 'fps-hit-marker--bad');
      void hitMarkerEl.offsetWidth;
      if (hitId) {
        hitMarkerEl.classList.add('fps-hit-marker--ok');
        void submitAnswer?.(hitId);
      } else {
        hitMarkerEl.classList.add('fps-hit-marker--bad');
        stage.setFeedback('Bắn trượt rồi, ngắm lại nhé!');
        playSfx('miss');
      }
    };

    questionStarted = Date.now();
    timer.start(
      perMs,
      (remaining) => {
        syncTimerBar(stage.timerFillEl, remaining, perMs, timerSfx);
      },
      () => {
        if (roundLocked || !currentItem) return;
        roundLocked = true;
        timer.stop();
        lockFpsOptions();
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
    const btn = stage.gameArea.querySelector<HTMLButtonElement>(`.fps-option[data-id="${opt.id}"]`);
    btn?.classList.add('fps-option--active');
    await Promise.resolve();
    btn?.classList.remove('fps-option--active');
    await submitAnswer?.(opt.id);
  };

  const onShootClick = () => {
    if (!roundLocked) currentShoot?.();
  };
  fpsMount.addEventListener('click', onShootClick);
  window.addEventListener('keydown', onKeyDown);

  showItem(items[0]);
  return () => {
    fpsMount.removeEventListener('click', onShootClick);
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    fpsScene.dispose();
    stage.cleanup();
  };
}
