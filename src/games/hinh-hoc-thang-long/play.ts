import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { bindGameLifecycle, createGameSession } from '@/features/gameplay/gameSession';
import { setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
import { speakVietnamese } from '@/features/speech/speechService';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { choiceCountForLevel } from './shapeCatalog';
import { questionPromptText, speechQuestionText } from './questionLabel';
import { generateTasks, timePerTaskMs, type ShapeTask } from './questions';
import { CastleBuildView } from './castleBuildView';
import {
  clearSketchIllustrationCache,
  preloadSketchIllustrationsAsync,
} from './sketchIllustrationCache';
import { SketchbookView, type SketchbookPage } from './sketchbookView';

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

  const session = createGameSession();
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--thang-long');
  sceneHost.setParallaxSway(false);

  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="thang-long-visual">
      <div class="thang-long-visual__castle" id="castle-mount"></div>
      <div class="thang-long-visual__sketch" id="sketchbook-mount"></div>
    </div>
  `;
  const castleMount = heroHost.querySelector<HTMLElement>('#castle-mount')!;
  const sketchMount = heroHost.querySelector<HTMLElement>('#sketchbook-mount')!;
  castleMount.replaceChildren();
  sketchMount.replaceChildren();
  const castle = new CastleBuildView(castleMount, tasks.length);
  const sketchbook = new SketchbookView(sketchMount, tasks.length);
  const sketchPages: SketchbookPage[] = tasks.map((t) => ({
    objectId: t.objectId,
    label: t.label,
    shape: t.shape,
  }));

  let index = 0;
  let booting = true;
  let disposed = false;
  let correctCount = 0;
  let questionStarted = Date.now();
  let currentTask: ShapeTask | null = null;
  let locked = false;
  let flipping = false;

  const showTask = (task: ShapeTask, withFlip: boolean) => {
    const page = { objectId: task.objectId, label: task.label, shape: task.shape };
    if (withFlip && index > 0) {
      flipping = true;
      void sketchbook.flipToPage(page, index).then(() => {
        flipping = false;
        beginRound(task);
      });
      return;
    }
    sketchbook.showPage(page, index);
    beginRound(task);
  };

  const beginRound = (task: ShapeTask) => {
    currentTask = task;
    locked = false;
    const next = tasks[index + 1];
    if (next) {
      sketchbook.prewarmPage({
        objectId: next.objectId,
        label: next.label,
        shape: next.shape,
      });
    }
    stage.updateDots(index, tasks.length);
    stage.setFeedback('');

    stage.gameArea.innerHTML = `
      <div class="shape-quiz shape-quiz--choices-${choiceCountForLevel(level)}">
        <p class="shape-quiz__prompt">${escapeHtml(questionPromptText(task.label))}</p>
        <div class="shape-quiz__choices" id="shape-choices">
          ${task.choices
            .map(
              (c, i) =>
                `<button type="button" class="shape-choice shape-choice--${c.shape}" data-choice="${c.id}" data-shape="${c.shape}" data-i="${i}">
                  <span class="shape-choice__glyph" aria-hidden="true"></span>
                  <span class="shape-choice__label">${c.label}</span>
                </button>`
            )
            .join('')}
        </div>
        <p class="game-play__round-hint">Chọn một đáp án hoặc bấm phím 1–${choiceCountForLevel(level)}</p>
      </div>
    `;

    speakVietnamese(speechQuestionText(task.label));

    const quiz = stage.gameArea.querySelector<HTMLElement>('.shape-quiz')!;
    const choiceBtns = stage.gameArea.querySelectorAll<HTMLButtonElement>('.shape-choice');

    const lockQuiz = (pickedId?: string) => {
      quiz.classList.add('shape-quiz--locked');
      choiceBtns.forEach((btn) => {
        btn.disabled = true;
        const id = btn.dataset.choice!;
        if (id === task.correctChoiceId) btn.classList.add('shape-choice--correct');
        if (pickedId && id === pickedId && id !== task.correctChoiceId) {
          btn.classList.add('shape-choice--picked-wrong');
        }
        if (pickedId && id === pickedId && id === task.correctChoiceId) {
          btn.classList.add('shape-choice--picked-ok');
        }
      });
      setRoundHint(stage.gameArea, '.game-play__round-hint', WAIT_NEXT_HINT);
    };

    const advance = (last: boolean) => {
      if (last) {
        if (correctCount >= tasks.length) castle.setCelebration(true);
        session.scheduleAfterAnswer(true, () => {}, () => tracker.finish().then(onDone));
        return;
      }
      session.scheduleAfterAnswer(false, () => showTask(tasks[index], true), () => tracker.finish().then(onDone));
    };

    const submitChoice = (choiceId: string) => {
      if (locked || flipping) return;
      locked = true;
      timer.stop();
      const ok = choiceId === task.correctChoiceId;
      lockQuiz(choiceId);
      tracker.recordRound(ok, Date.now() - questionStarted);
      stage.setGameFeedback(ok ? 'correct' : 'wrong');
      if (ok) {
        correctCount++;
        castle.addTier(correctCount);
      }
      index++;
      advance(index >= tasks.length);
    };

    choiceBtns.forEach((btn) => {
      btn.addEventListener('click', () => submitChoice(btn.dataset.choice!));
    });

    questionStarted = Date.now();
    timer.start(
      perMs,
      (remaining) => {
        syncTimerBar(stage.timerFillEl, remaining, perMs, timerSfx);
      },
      () => {
        if (locked || flipping) return;
        locked = true;
        timer.stop();
        lockQuiz();
        stage.setGameFeedback('timeout');
        tracker.recordRound(false, Date.now() - questionStarted);
        index++;
        advance(index >= tasks.length);
      }
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (booting || !currentTask || locked || flipping) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < currentTask.choices.length) {
      e.preventDefault();
      const btn = stage.gameArea.querySelector<HTMLButtonElement>(`.shape-choice[data-i="${idx}"]`);
      btn?.click();
    }
  };

  window.addEventListener('keydown', onKeyDown);

  const showBootLoading = (done: number, total: number) => {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    stage.root.classList.add('game-play--thang-long-loading');
    stage.gameArea.innerHTML = `
      <div class="thang-long-preload" role="status" aria-live="polite">
        <p class="thang-long-preload__title">Đang chuẩn bị sổ vẽ…</p>
        <p class="thang-long-preload__hint">Vui lòng đợi một chút trước khi bắt đầu.</p>
        <div class="thang-long-preload__bar" aria-hidden="true">
          <div class="thang-long-preload__fill" style="width:${pct}%"></div>
        </div>
        <p class="thang-long-preload__pct">${total > 0 ? `${done} / ${total} tranh` : 'Đang đo khung vẽ…'}</p>
      </div>
    `;
    stage.setFeedback('');
  };

  const hideBootLoading = () => {
    booting = false;
    stage.root.classList.remove('game-play--thang-long-loading');
  };

  const bootGame = async () => {
    try {
      showBootLoading(0, 0);
      const { width, height } = await sketchbook.whenArtSizeReady();
      if (disposed) return;

      await preloadSketchIllustrationsAsync(
        sketchPages,
        width,
        height,
        (done, total) => {
          if (disposed) return;
          showBootLoading(done, total);
        },
        () => disposed
      );
      if (disposed) return;

      await new Promise<void>((r) => {
        requestAnimationFrame(() => requestAnimationFrame(() => r()));
      });
      if (disposed) return;

      hideBootLoading();
      showTask(tasks[0], false);
    } catch (err) {
      console.error('[hinh-hoc-thang-long] boot failed', err);
      if (!disposed) {
        hideBootLoading();
        showTask(tasks[0], false);
      }
    }
  };

  requestAnimationFrame(() => {
    void bootGame();
  });

  return bindGameLifecycle(sceneHost, () => {
    disposed = true;
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    session.dispose();
    clearSketchIllustrationCache();
    castle.dispose();
    sketchbook.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
