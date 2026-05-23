import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { scheduleAfterAnswer, setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
import { speakVietnamese } from '@/features/speech/speechService';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { traitForObject } from './objectTraits';
import { generateTasks, timePerTaskMs, type ShapeTask } from './questions';
import { preloadPropTextures } from './props/textureLibrary';
import { ShapePreviewScene } from './shapePreviewScene';
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
    <div class="thang-long-hero">
      <div class="shape-preview-wrap">
        <div class="shape-preview__canvas-host" id="shape-preview-canvas"></div>
        <div class="shape-preview__caption">
          <p class="shape-preview__name" id="shape-preview-name">Đồ vật</p>
          <p class="shape-preview__trait" id="shape-preview-trait"></p>
        </div>
      </div>
      <div class="thang-long-castle-wrap">
        <div class="thang-long-castle-status" id="thang-long-castle-status">
          Thành cổ đang xây · 0/${tasks.length} mảnh
        </div>
      </div>
    </div>
  `;
  const previewMount = heroHost.querySelector<HTMLElement>('#shape-preview-canvas')!;
  const previewName = heroHost.querySelector<HTMLElement>('#shape-preview-name')!;
  const previewTrait = heroHost.querySelector<HTMLElement>('#shape-preview-trait')!;
  const castleMount = heroHost.querySelector<HTMLElement>('.thang-long-castle-wrap')!;
  const castleStatusEl = heroHost.querySelector<HTMLElement>('#thang-long-castle-status')!;
  void preloadPropTextures();
  const shapePreview = new ShapePreviewScene(previewMount);
  const castleScene = new ThangLongCastleScene(castleMount, tasks.length);

  let index = 0;
  let questionStarted = Date.now();
  let currentTask: ShapeTask | null = null;
  let locked = false;
  let correctCount = 0;

  const showTask = (task: ShapeTask) => {
    currentTask = task;
    locked = false;
    stage.updateDots(index, tasks.length);
    shapePreview.setObject(task.objectId, task.shape);
    previewName.textContent = task.label;
    previewTrait.textContent = traitForObject(task.objectId);
    stage.setFeedback('');

    stage.gameArea.innerHTML = `
      <div class="shape-quiz">
        <p class="shape-quiz__prompt">
          <strong class="shape-quiz__object">${escapeHtml(task.label)}</strong> thuộc dạng hình nào?
        </p>
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
        <p class="game-play__round-hint">Chọn một đáp án hoặc bấm phím 1–3</p>
      </div>
    `;

    speakVietnamese(`${task.label} thuộc dạng hình nào?`);

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

    const submitChoice = (choiceId: string) => {
      if (locked) return;
      locked = true;
      timer.stop();
      const ok = choiceId === task.correctChoiceId;
      lockQuiz(choiceId);
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
        if (locked) return;
        locked = true;
        timer.stop();
        lockQuiz();
        stage.setGameFeedback('timeout');
        tracker.recordRound(false, Date.now() - questionStarted);
        index++;
        const last = index >= tasks.length;
        scheduleAfterAnswer(
          last,
          () => showTask(tasks[index]),
          () => tracker.finish().then(onDone)
        );
      }
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!currentTask || locked) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < currentTask.choices.length) {
      e.preventDefault();
      const btn = stage.gameArea.querySelector<HTMLButtonElement>(`.shape-choice[data-i="${idx}"]`);
      btn?.click();
    }
  };

  window.addEventListener('keydown', onKeyDown);
  showTask(tasks[0]);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    shapePreview.dispose();
    castleScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
