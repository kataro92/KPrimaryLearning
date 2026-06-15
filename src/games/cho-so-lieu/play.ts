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
import { CoinFlipArena } from './coinFlipArena';
import {
  buildCoinFlipAnswer,
  coinFlipTimeMs,
  rollOutcomes,
} from './coinFlipRound';
import type { StatsMcqChallenge, StatsRound } from './questions';
import { generateQuestions, timePerQuestionMs } from './questions';
import { isCoinFlipRound, type CoinFlipChallenge } from './challengeTypes';
import { StatsMarketScene } from './statsMarketScene';

export type { PlayResult };

interface ActiveAnswer {
  prompt: string;
  choices: string[];
  correctIndex: number;
}

export function renderChoSoLieuGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'cho-so-lieu';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const questions = generateQuestions(level);
  const defaultPerMs = timePerQuestionMs(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: questions.length,
    targetTimeSec: defaultPerMs / 1000,
    startedAt,
  });

  const session = createGameSession();
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--cho-so');
  sceneHost.setParallaxSway(false);

  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="cho-so-hero">
      <div class="cho-so-hero__market" id="cho-so-market"></div>
      <p class="cho-so-hero__caption" id="cho-so-status">Chợ Số Liệu · 0/${questions.length} cột</p>
    </div>
  `;
  const marketMount = heroHost.querySelector<HTMLElement>('#cho-so-market')!;
  const statusEl = heroHost.querySelector<HTMLElement>('#cho-so-status')!;
  const marketScene = new StatsMarketScene(marketMount, questions.length);

  let index = 0;
  let correctCount = 0;
  let questionStarted = Date.now();
  let locked = false;
  let currentAnswer: ActiveAnswer | null = null;
  let coinArena: CoinFlipArena | null = null;
  let perMs = defaultPerMs;

  const updateStatus = () => {
    statusEl.textContent = `Chợ Số Liệu · ${correctCount}/${questions.length} cột`;
  };

  const disposeCoinArena = () => {
    coinArena?.dispose();
    coinArena = null;
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

  const advanceRound = (ok: boolean) => {
    tracker.recordRound(ok, Date.now() - questionStarted);
    stage.setGameFeedback(ok ? 'correct' : 'wrong');
    updateStatus();
    index++;
    const last = index >= questions.length;
    session.scheduleAfterAnswer(
      last,
      () => showRound(questions[index]),
      () => tracker.finish().then(onDone)
    );
  };

  const submit = (choiceIndex: number) => {
    const ans = currentAnswer;
    if (!ans || locked) return;
    locked = true;
    timer.stop();
    const ok = choiceIndex === ans.correctIndex;
    lockChoices(choiceIndex, ans.correctIndex);
    if (ok) {
      correctCount++;
      marketScene.onCorrectAnswer();
    } else {
      marketScene.onWrongAnswer();
    }
    disposeCoinArena();
    advanceRound(ok);
  };

  const onTimeout = () => {
    if (locked && currentAnswer) return;
    locked = true;
    timer.stop();
    if (currentAnswer) {
      lockChoices(undefined, currentAnswer.correctIndex);
    }
    stage.setGameFeedback('timeout');
    disposeCoinArena();
    advanceRound(false);
  };

  const startTimer = () => {
    questionStarted = Date.now();
    timer.start(
      perMs,
      (r) => syncTimerBar(stage.timerFillEl, r, perMs, timerSfx),
      onTimeout
    );
  };

  const mountStoneRow = (ans: ActiveAnswer) => {
    const host = stage.gameArea.querySelector<HTMLElement>('#coin-answer')!;
    host.hidden = false;
    host.innerHTML = `
      <div class="temple-arena__board coin-flip-arena__prompt" id="prompt"></div>
      <div class="stone-row" id="stones">
        ${ans.choices
          .map(
            (_, i) =>
              `<button type="button" class="stone-tablet" data-i="${i}"><span></span></button>`
          )
          .join('')}
      </div>
      <p class="game-play__round-hint">Chọn bia đá hoặc bấm phím 1-4</p>
    `;
    host.querySelector<HTMLElement>('#prompt')!.textContent = ans.prompt;
    speakVietnamese(ans.prompt);
    host.querySelectorAll<HTMLButtonElement>('.stone-tablet').forEach((btn, i) => {
      btn.querySelector('span')!.textContent = ans.choices[i] ?? '';
      btn.addEventListener('click', () => submit(Number(btn.dataset.i)));
    });
    locked = false;
  };

  const showCoinFlipRound = (round: CoinFlipChallenge) => {
    disposeCoinArena();
    currentAnswer = null;
    locked = true;
    perMs = coinFlipTimeMs(level as 2 | 3, round.flipCount);
    stage.updateDots(index, questions.length);
    stage.setFeedback('');
    timer.stop();

    const outcomes = rollOutcomes(round.flipCount);
    stage.gameArea.innerHTML = `
      <div class="temple-arena temple-arena--cho-so temple-arena--coin-flip">
        <div id="coin-mount"></div>
        <div id="coin-answer" hidden></div>
      </div>
    `;

    const mount = stage.gameArea.querySelector<HTMLElement>('#coin-mount')!;
    coinArena = new CoinFlipArena(mount, round.instruction, outcomes, (final) => {
      const built = buildCoinFlipAnswer(final, round.ask);
      currentAnswer = {
        prompt: built.prompt,
        choices: built.choices,
        correctIndex: built.correctIndex,
      };
      mountStoneRow(currentAnswer);
    });

    speakVietnamese(round.instruction);
    startTimer();
  };

  const showMcqRound = (q: StatsMcqChallenge) => {
    disposeCoinArena();
    perMs = defaultPerMs;
    currentAnswer = { prompt: q.prompt, choices: q.choices, correctIndex: q.correctIndex };
    locked = false;
    stage.updateDots(index, questions.length);
    stage.setFeedback('');
    timer.stop();
    stage.gameArea.innerHTML = `
      <div class="temple-arena temple-arena--cho-so">
        ${q.chartHtml ? `<div class="cho-chart-wrap">${q.chartHtml}</div>` : ''}
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
    startTimer();
  };

  const showRound = (round: StatsRound) => {
    if (isCoinFlipRound(round)) {
      showCoinFlipRound(round);
    } else {
      showMcqRound(round);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (locked || !currentAnswer) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx < currentAnswer.choices.length) {
      e.preventDefault();
      submit(idx);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  showRound(questions[0]);
  return bindGameLifecycle(sceneHost, () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    disposeCoinArena();
    session.dispose();
    marketScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}
