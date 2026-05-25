import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { bindGameLifecycle, createGameSession } from '@/features/gameplay/gameSession';
import { generateQuestions, timePerQuestionMs, type DrumQuestion } from './questions';
import { DongSonDrumScene } from './dongSonDrumScene';

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

  const session = createGameSession();
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--trong-dong');
  sceneHost.setParallaxSway(false);
  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="trong-dong-hero">
      <div class="trong-dong-hero__canvas-host" id="dong-son-drum-canvas"></div>
      <p class="trong-dong-hero__caption">Trống Đồng Đông Sơn</p>
    </div>
  `;
  const drumMount = heroHost.querySelector<HTMLElement>('#dong-son-drum-canvas')!;
  const drumScene = new DongSonDrumScene(drumMount);
  const origSetGameFeedback = stage.setGameFeedback.bind(stage);
  stage.setGameFeedback = (kind) => {
    origSetGameFeedback(kind);
    if (kind === 'correct') drumScene.celebrate();
  };

  let index = 0;
  let questionStarted = Date.now();
  let roundLocked = false;
  let currentQuestion: DrumQuestion | null = null;
  let currentApply: ((choiceIndex: number) => void) | null = null;

  const lockChoices = (pickedIndex?: number, correctIndex?: number) => {
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

  const showQuestion = () => {
    const q = questions[index];
    currentQuestion = q;
    roundLocked = false;
    stage.updateDots(index, questions.length);
    stage.setFeedback('');
    stage.gameArea.innerHTML = `
      <div class="drum-puzzle">
        <p class="drum-puzzle__passage">${q.passage}</p>
        <p class="drum-puzzle__question">${q.prompt}</p>
        <div class="stone-row" id="drum-choices">
          ${q.choices
            .map(
              (_, i) =>
                `<button type="button" class="stone-tablet" data-i="${i}"><span></span></button>`
            )
            .join('')}
        </div>
        <p class="game-play__round-hint">Chọn một đáp án hoặc bấm phím 1–4</p>
      </div>
    `;

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn, i) => {
      btn.querySelector('span')!.textContent = q.choices[i] ?? '';
    });

    speakVietnamese(q.prompt);

    const applyChoice = (choiceIndex: number) => {
      if (roundLocked) return;
      roundLocked = true;
      timer.stop();
      const ok = choiceIndex === q.correctIndex;
      lockChoices(choiceIndex, q.correctIndex);
      tracker.recordRound(ok, Date.now() - questionStarted);
      stage.setGameFeedback(ok ? 'correct' : 'wrong');
      index++;
      const last = index >= questions.length;
      session.scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
    };
    currentApply = (choiceIndex: number) => {
      if (q.choices[choiceIndex] == null) return;
      applyChoice(choiceIndex);
    };

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (roundLocked) return;
        const i = Number(btn.dataset.i);
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
        lockChoices(undefined, currentQuestion.correctIndex);
        tracker.recordRound(false, Date.now() - questionStarted);
        stage.setGameFeedback('timeout');
        index++;
        const last = index >= questions.length;
        session.scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
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
  return bindGameLifecycle(sceneHost, () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    session.dispose();
    drumScene.dispose();
    stage.cleanup();
  });
}
