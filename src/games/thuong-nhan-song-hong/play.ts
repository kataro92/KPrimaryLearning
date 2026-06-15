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
import { MarketScene } from './marketScene';
import type { OpsMcqChallenge } from './questions';
import { generateQuestions, timePerQuestionMs } from './questions';

export type { PlayResult };

export function renderThuongNhanSongHongGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'thuong-nhan-song-hong';
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
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--song-hong');
  sceneHost.setParallaxSway(false);

  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="song-hong-hero">
      <div class="song-hong-hero__market" id="song-hong-market"></div>
      <p class="song-hong-hero__caption" id="song-hong-status">Chợ Sông Hồng · 0/${questions.length} giao dịch</p>
    </div>
  `;
  const marketMount = heroHost.querySelector<HTMLElement>('#song-hong-market')!;
  const statusEl = heroHost.querySelector<HTMLElement>('#song-hong-status')!;
  const marketScene = new MarketScene(marketMount, questions.length);

  let index = 0;
  let correctCount = 0;
  let questionStarted = Date.now();
  let locked = false;
  let current: OpsMcqChallenge | null = null;

  const updateStatus = () => {
    statusEl.textContent = `Chợ Sông Hồng · ${correctCount}/${questions.length} giao dịch`;
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
      marketScene.onCorrectAnswer();
    } else {
      marketScene.onWrongAnswer();
    }
    tracker.recordRound(ok, Date.now() - questionStarted);
    stage.setGameFeedback(ok ? 'correct' : 'wrong');
    updateStatus();
    index++;
    const last = index >= questions.length;
    session.scheduleAfterAnswer(
      last,
      () => showQuestion(questions[index]),
      () => tracker.finish().then(onDone)
    );
  };

  const showQuestion = (q: OpsMcqChallenge) => {
    current = q;
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
    speakVietnamese(q.prompt);
    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn, i) => {
      btn.querySelector('span')!.textContent = q.choices[i] ?? '';
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
        tracker.recordRound(false, Date.now() - questionStarted);
        index++;
        const last = index >= questions.length;
        session.scheduleAfterAnswer(
          last,
          () => showQuestion(questions[index]),
          () => tracker.finish().then(onDone)
        );
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

  showQuestion(questions[0]);
  return bindGameLifecycle(sceneHost, () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    session.dispose();
    marketScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}
