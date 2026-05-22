import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { scheduleAfterAnswer, setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { generateTasks, timePerTaskMs, type BuildTask } from './questions';
import { ThangLongCastleScene } from './thangLongCastleScene';

export type { PlayResult };

export function renderHinhHocThangLongGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'hinh-hoc-thang-long';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const tasks = generateTasks(level);
  const perMs = timePerTaskMs(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: tasks.length,
    targetTimeSec: perMs / 1000,
    startedAt,
  });

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--thang-long');
  sceneHost.setParallaxSway(false);
  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="thang-long-castle-wrap">
      <div class="thang-long-castle-status" id="thang-long-castle-status">
        Thành cổ đang xây · 0/${tasks.length} mảnh
      </div>
    </div>
  `;
  const castleMount = heroHost.querySelector<HTMLElement>('.thang-long-castle-wrap')!;
  const castleStatusEl = heroHost.querySelector<HTMLElement>('#thang-long-castle-status')!;
  const castleScene = new ThangLongCastleScene(castleMount, tasks.length);
  let index = 0;
  let questionStarted = Date.now();
  let currentTask: BuildTask | null = null;
  let locked = false;
  let trySlot: ((slotId: string) => void) | null = null;
  let correctCount = 0;

  const shapeClass = (s: string) =>
    s === 'square' ? 'brick--sq' : s === 'rect' ? 'brick--rect' : 'brick--tri';

  const showTask = (task: BuildTask) => {
    currentTask = task;
    locked = false;
    stage.updateDots(index, tasks.length);
    stage.gameArea.innerHTML = `
      <div class="wall-build">
        <p class="wall-build__mission">Xây thành: đặt <strong>${task.label}</strong> vào ô đúng hình</p>
        <div class="wall-slots">
          ${task.slots
            .map(
              (s) =>
                `<div class="wall-slot ${shapeClass(s.shape)}" data-slot="${s.id}"><span>${s.label}</span></div>`
            )
            .join('')}
        </div>
        <div class="brick-palette">
          <div class="brick ${shapeClass(task.shape)}" id="active-brick" draggable="true">
            ${task.label}
          </div>
        </div>
        <p class="game-play__round-hint">Kéo gạch vào ô đúng hoặc bấm phím 1-3</p>
      </div>
    `;

    const brick = stage.gameArea.querySelector<HTMLElement>('#active-brick')!;
    const slots = stage.gameArea.querySelectorAll<HTMLElement>('.wall-slot');

    const lockBuild = (pickedSlotId?: string) => {
      stage.gameArea.querySelector('.wall-build')?.classList.add('wall-build--locked');
      slots.forEach((slot) => {
        const id = slot.dataset.slot!;
        if (id === task.targetSlot) slot.classList.add('wall-slot--correct');
        if (pickedSlotId && id === pickedSlotId) slot.classList.add('wall-slot--picked');
      });
      setRoundHint(stage.gameArea, '.game-play__round-hint', WAIT_NEXT_HINT);
    };

    const complete = (ok: boolean, pickedSlotId?: string) => {
      if (locked) return;
      locked = true;
      timer.stop();
      lockBuild(pickedSlotId);
      tracker.recordRound(ok, Date.now() - questionStarted);
      stage.setGameFeedback(ok ? 'correct' : 'wrong');
      if (ok) {
        correctCount++;
        castleScene.onCorrectAnswer();
        castleStatusEl.textContent = `Thành cổ đang xây · ${correctCount}/${tasks.length} mảnh`;
      } else {
        castleScene.onWrongAnswer();
      }
      index++;
      const last = index >= tasks.length;
      if (last && correctCount >= tasks.length) {
        castleScene.onCompletedPerfect();
        castleStatusEl.textContent = '🐉 Hoàn hảo! Rồng vàng hạ xuống trên nóc thành!';
      }
      scheduleAfterAnswer(
        last,
        () => showTask(tasks[index]),
        () => tracker.finish().then(onDone)
      );
    };

    trySlot = (slotId: string) => {
      if (locked) return;
      complete(slotId === task.targetSlot, slotId);
    };

    brick.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      brick.classList.add('brick--dragging');
      brick.setPointerCapture(e.pointerId);
    });
    const onBrickEnd = (e: PointerEvent) => {
      brick.classList.remove('brick--dragging');
      if (brick.hasPointerCapture(e.pointerId)) brick.releasePointerCapture(e.pointerId);
      for (const slot of slots) {
        const r = slot.getBoundingClientRect();
        if (
          e.clientX >= r.left - 16 &&
          e.clientX <= r.right + 16 &&
          e.clientY >= r.top - 16 &&
          e.clientY <= r.bottom + 16
        ) {
          trySlot?.(slot.dataset.slot!);
          return;
        }
      }
    };
    brick.addEventListener('pointerup', onBrickEnd);
    brick.addEventListener('pointercancel', onBrickEnd);
    slots.forEach((slot) => {
      slot.addEventListener('click', () => trySlot?.(slot.dataset.slot!));
    });

    questionStarted = Date.now();
    timer.start(
      perMs,
      (remaining) => {
        syncTimerBar(stage.timerFillEl, remaining, perMs, timerSfx);
      },
      () => complete(false)
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!currentTask || locked) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < currentTask.slots.length) {
      e.preventDefault();
      trySlotByIndex(currentTask, idx);
    }
  };

  const trySlotByIndex = (task: BuildTask, idx: number) => {
    const slot = task.slots[idx];
    if (!slot || locked) return;
    trySlot?.(slot.id);
  };

  window.addEventListener('keydown', onKeyDown);
  showTask(tasks[0]);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    castleScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  };
}
