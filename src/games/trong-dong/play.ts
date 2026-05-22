import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { hitRect } from '@/features/gameplay/pointerDrop';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { scheduleAfterAnswer } from '@/features/gameplay/roundUi';
import { generateQuestions, timePerQuestionMs, type DrumQuestion } from './questions';

export type { PlayResult };

export function renderTrongDongGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'trong-dong';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const { questions } = generateQuestions(level);
  const perMs = timePerQuestionMs(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: questions.length,
    targetTimeSec: perMs / 1000,
    startedAt,
  });

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--trong-dong');
  let index = 0;
  let questionStarted = Date.now();
  let roundLocked = false;
  let currentQuestion: DrumQuestion | null = null;
  let currentApply: ((choiceIndex: number) => void) | null = null;

  const lockChoiceButtons = (pickedIndex?: number, correctIndex?: number) => {
    const guide = stage.gameArea.querySelector<HTMLElement>('.drum-puzzle__guide');
    if (guide) guide.textContent = 'Đã chọn đáp án, chờ câu tiếp theo…';
    stage.gameArea.querySelectorAll<HTMLButtonElement>('.relic-chip').forEach((chip) => {
      chip.disabled = true;
      const i = Number(chip.dataset.i);
      if (i === correctIndex) chip.classList.add('relic-chip--correct');
      if (pickedIndex !== undefined && i === pickedIndex) chip.classList.add('relic-chip--picked');
    });
    stage.gameArea.querySelector('#relic-tray')?.classList.add('relic-tray--locked');
  };

  const showQuestion = () => {
    const q = questions[index];
    currentQuestion = q;
    roundLocked = false;
    stage.updateDots(index, questions.length);
    stage.gameArea.innerHTML = `
      <div class="drum-puzzle">
        <p class="drum-puzzle__passage">${q.passage}</p>
        <p class="drum-puzzle__question">${q.prompt}</p>
        <div class="drum-face" id="drum-face">
          <div class="drum-slot" id="drum-slot" title="Thả mảnh ghép vào đây">?</div>
        </div>
        <p class="drum-puzzle__guide game-play__round-hint">Kéo đáp án vào giữa trống đồng · phím 1-4</p>
        <div class="relic-tray" id="relic-tray">
          ${q.choices
            .map(
              (c, i) =>
                `<button type="button" class="relic-chip" data-i="${i}" data-label="${escapeAttr(c)}">${c}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    speakVietnamese(q.prompt);
    const slot = stage.gameArea.querySelector<HTMLElement>('#drum-slot')!;

    const applyChoice = (choiceIndex: number) => {
      if (roundLocked) return;
      roundLocked = true;
      timer.stop();
      const label = q.choices[choiceIndex] ?? '?';
      const ok = choiceIndex === q.correctIndex;
      slot.textContent = label.length > 14 ? `${label.slice(0, 12)}…` : label;
      lockChoiceButtons(choiceIndex, q.correctIndex);
      tracker.recordRound(ok, Date.now() - questionStarted);
      stage.setGameFeedback(ok ? 'correct' : 'wrong');
      index++;
      const last = index >= questions.length;
      scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
    };
    currentApply = (choiceIndex: number) => {
      if (q.choices[choiceIndex] == null) return;
      applyChoice(choiceIndex);
    };

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.relic-chip').forEach((chip) => {
      chip.addEventListener('pointerdown', (e) => {
        if (roundLocked) return;
        e.preventDefault();
        chip.classList.add('relic-chip--dragging');
        chip.setPointerCapture(e.pointerId);
      });
      const end = (e: PointerEvent) => {
        if (roundLocked) return;
        chip.classList.remove('relic-chip--dragging');
        if (chip.hasPointerCapture(e.pointerId)) chip.releasePointerCapture(e.pointerId);
        const rect = slot.getBoundingClientRect();
        if (hitRect(e.clientX, e.clientY, rect, 24)) {
          const i = Number(chip.dataset.i);
          applyChoice(i);
        }
      };
      chip.addEventListener('pointerup', end);
      chip.addEventListener('pointercancel', end);
      chip.addEventListener('click', () => {
        if (roundLocked) return;
        const i = Number(chip.dataset.i);
        currentApply?.(i);
      });
    });

    questionStarted = Date.now();
    timer.start(
      perMs,
      (r) => {
        syncTimerBar(stage.timerFillEl, r, perMs, timerSfx);
      },
      () => {
        if (roundLocked || !currentQuestion) return;
        roundLocked = true;
        timer.stop();
        lockChoiceButtons(undefined, currentQuestion.correctIndex);
        tracker.recordRound(false, Date.now() - questionStarted);
        stage.setGameFeedback('timeout');
        index++;
        const last = index >= questions.length;
        scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
      }
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (roundLocked || !currentQuestion || !currentApply) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < currentQuestion.choices.length) {
      e.preventDefault();
      currentApply(idx);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  showQuestion();
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    stage.cleanup();
  };
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;');
}
