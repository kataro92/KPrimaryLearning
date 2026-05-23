import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { scheduleAfterAnswer } from '@/features/gameplay/roundUi';
import {
  generateMcqQuestions,
  questionCount,
  timePerQuestionMs,
  type McqQuestion,
} from './questions';
import { GundamRobotScene } from './gundamRobotScene';

export type { PlayResult };

export function renderTrangNguyenToanGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'trang-nguyen-toan';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const questions = generateMcqQuestions(questionCount(level), level);
  const perQMs = timePerQuestionMs(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: questions.length,
    targetTimeSec: perQMs / 1000,
    startedAt,
  });

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--trang-nguyen');
  sceneHost.setParallaxSway(false);

  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="mecha-robot-wrap">
      <div class="mecha-robot-status" id="mecha-status">Siêu robot Trạng Nguyên · 0/${questions.length} mảnh</div>
    </div>
  `;
  const sceneMount = heroHost.querySelector<HTMLElement>('.mecha-robot-wrap')!;
  const statusEl = heroHost.querySelector<HTMLElement>('#mecha-status')!;
  const mechaScene = new GundamRobotScene(sceneMount, questions.length);

  let index = 0;
  let correctCount = 0;
  let questionStarted = Date.now();
  let locked = false;
  let currentQuestion: McqQuestion | null = null;

  const lockTablets = (pickedIndex: number | undefined, correctIndex: number) => {
    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn) => {
      btn.disabled = true;
      const i = Number(btn.dataset.i);
      if (i === correctIndex) btn.classList.add('stone-tablet--reveal-ok');
      if (pickedIndex !== undefined && i === pickedIndex && i !== correctIndex) {
        btn.classList.add('stone-tablet--picked-bad');
      }
      if (pickedIndex !== undefined && i === pickedIndex && i === correctIndex) {
        btn.classList.add('stone-tablet--picked-ok');
      }
    });
    stage.gameArea.querySelector('.stone-row')?.classList.add('stone-row--locked');
  };

  const submitChoice = (choiceIndex: number) => {
    const q = currentQuestion;
    if (locked || !q) return;
    locked = true;
    timer.stop();
    const ok = choiceIndex === q.correctIndex;
    lockTablets(choiceIndex, q.correctIndex);
    tracker.recordRound(ok, Date.now() - questionStarted);
    if (ok) {
      correctCount++;
      mechaScene.onCorrectAnswer();
      const done = correctCount >= questions.length;
      statusEl.textContent = done
        ? '🎆 Robot hoàn thành! Pháo hoa & sức mạnh tối đa!'
        : `Siêu robot Trạng Nguyên · ${correctCount}/${questions.length} mảnh`;
    } else {
      mechaScene.onWrongAnswer();
    }
    stage.setGameFeedback(ok ? 'correct' : 'wrong');
    index++;
    const last = index >= questions.length;
    scheduleAfterAnswer(
      last,
      () => showQuestion(questions[index]),
      () => tracker.finish().then(onDone)
    );
  };

  const showQuestion = (q: McqQuestion) => {
    currentQuestion = q;
    locked = false;
    stage.updateDots(index, questions.length);
    stage.setFeedback('');
    stage.gameArea.innerHTML = `
      <div class="temple-arena">
        <div class="temple-arena__board" id="prompt"></div>
        <div class="stone-row" id="stones">
          ${q.choices
            .map(
              (_, i) =>
                `<button type="button" class="stone-tablet" data-i="${i}"><span></span></button>`
            )
            .join('')}
        </div>
        <p class="game-play__round-hint">Chọn bia đá hoặc bấm phím 1-4</p>
      </div>
    `;
    stage.gameArea.querySelector<HTMLElement>('#prompt')!.textContent = q.prompt;
    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn, i) => {
      btn.querySelector('span')!.textContent = q.choices[i] ?? '';
    });

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.i);
        submitChoice(i);
      });
    });

    questionStarted = Date.now();
    timer.start(
      perQMs,
      (r) => {
        syncTimerBar(stage.timerFillEl, r, perQMs, timerSfx);
      },
      () => {
        if (locked || !currentQuestion) return;
        locked = true;
        timer.stop();
        lockTablets(undefined, currentQuestion.correctIndex);
        stage.setGameFeedback('timeout');
        tracker.recordRound(false, Date.now() - questionStarted);
        index++;
        const last = index >= questions.length;
        scheduleAfterAnswer(
          last,
          () => showQuestion(questions[index]),
          () => tracker.finish().then(onDone)
        );
      }
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (locked || !currentQuestion) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < currentQuestion.choices.length) {
      e.preventDefault();
      submitChoice(idx);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  showQuestion(questions[0]);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    mechaScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  };
}
