import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { TimerEngine } from '@/core/engine/timerEngine';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { bindGameLifecycle, createGameSession } from '@/features/gameplay/gameSession';
import { setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
import { speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { EthicsHeartScene } from './ethicsHeartScene';
import type { EthicsChallenge } from './questions';
import { generateQuestions, timePerQuestionMs } from './questions';

export type { PlayResult };

export function renderDaoDucNhiGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'dao-duc-nhi';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const questions = generateQuestions(level);
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
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--dao-duc');
  sceneHost.setParallaxSway(false);

  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="dao-duc-hero">
      <div class="dao-duc-hero__canvas-host" id="dao-duc-heart-canvas"></div>
      <p class="dao-duc-hero__caption" id="dao-duc-status">Trái tim ấm · 0/${questions.length}</p>
    </div>
  `;
  const heartMount = heroHost.querySelector<HTMLElement>('#dao-duc-heart-canvas')!;
  const statusEl = heroHost.querySelector<HTMLElement>('#dao-duc-status')!;
  const heartScene = new EthicsHeartScene(heartMount);

  let index = 0;
  let correctCount = 0;
  let questionStarted = Date.now();
  let locked = false;
  let current: EthicsChallenge | null = null;

  const updateStatus = () => {
    statusEl.textContent = `Trái tim ấm · ${correctCount}/${questions.length} việc làm đúng`;
  };

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
    setRoundHint(stage.gameArea, '.game-play__round-hint', WAIT_NEXT_HINT);
  };

  const submit = (choiceIndex: number) => {
    const q = current;
    if (!q || locked) return;
    locked = true;
    timer.stop();
    const ok = choiceIndex === q.correctIndex;
    lockChoices(choiceIndex, q.correctIndex);
    if (ok) {
      correctCount++;
      heartScene.onCorrectAnswer(correctCount, questions.length);
    } else {
      heartScene.onWrongAnswer();
    }
    tracker.recordRound(ok, Date.now() - questionStarted);
    stage.setGameFeedback(ok ? 'correct' : 'wrong');
    updateStatus();
    index++;
    const last = index >= questions.length;
    if (last) {
      heartScene.celebrateComplete();
    }
    session.scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
  };

  const showQuestion = () => {
    const q = questions[index];
    current = q;
    locked = false;
    stage.updateDots(index, questions.length);
    stage.setFeedback('');
    stage.gameArea.innerHTML = `
      <div class="ethics-puzzle">
        <p class="ethics-puzzle__scenario">${q.scenario}</p>
        <p class="ethics-puzzle__question">${q.question}</p>
        <div class="stone-row" id="ethics-choices">
          ${q.choices
            .map((_, i) => `<button type="button" class="stone-tablet" data-i="${i}"><span></span></button>`)
            .join('')}
        </div>
        <p class="game-play__round-hint">Chọn bia đá hoặc bấm phím 1–3</p>
      </div>
    `;

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn, i) => {
      btn.querySelector('span')!.textContent = q.choices[i] ?? '';
    });

    speakVietnamese(`${q.scenario} ${q.question}`);

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn) => {
      btn.addEventListener('click', () => submit(Number(btn.dataset.i)));
    });

    questionStarted = Date.now();
    timer.start(
      perMs,
      (r) => syncTimerBar(stage.timerFillEl, r, perMs, timerSfx),
      () => {
        if (locked || !current) return;
        locked = true;
        timer.stop();
        lockChoices(undefined, current.correctIndex);
        stage.setGameFeedback('timeout');
        heartScene.onWrongAnswer();
        tracker.recordRound(false, Date.now() - questionStarted);
        updateStatus();
        index++;
        const last = index >= questions.length;
        session.scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
      }
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (locked || !current) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < current.choices.length) {
      e.preventDefault();
      submit(idx);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  updateStatus();
  showQuestion();

  return bindGameLifecycle(sceneHost, () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    session.dispose();
    heartScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}
