import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { lockChoiceRow, scheduleAfterAnswer, setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import {
  generateQuestions,
  questionCount,
  timePerQuestionMs,
  type MathQuestion,
} from './questions';
import { VanMieuTurtleScene } from './vanMieuTurtleScene';

export type { PlayResult };

export function renderCuuChuongGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'cuu-chuong-van-mieu';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const questions = generateQuestions(questionCount(level), level);
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

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--van-mieu');
  sceneHost.setParallaxSway(false);
  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="van-mieu-hero">
      <div class="van-mieu-hero__canvas-host" id="van-mieu-turtle-canvas"></div>
      <p class="van-mieu-hero__caption">Rùa Vàng tiến về bia Văn Miếu</p>
    </div>
  `;
  const turtleMount = heroHost.querySelector<HTMLElement>('#van-mieu-turtle-canvas')!;
  const turtleScene = new VanMieuTurtleScene(turtleMount, questions.length);
  turtleScene.setProgress(0, questions.length);

  let index = 0;
  let questionStarted = Date.now();
  let turtleStep = 0;
  let keyInput: ((key: string) => void) | null = null;
  let locked = false;

  const lockNumpad = () => {
    lockChoiceRow(stage.gameArea, {
      rowSelector: '#numpad',
      buttonSelector: '.numpad__key',
      rowLockedClass: 'round-choices--locked',
    });
    setRoundHint(stage.gameArea, '.game-play__round-hint', WAIT_NEXT_HINT);
  };

  const showQuestion = (q: MathQuestion) => {
    locked = false;
    stage.updateDots(index, questions.length);
    stage.setFeedback('');
    stage.gameArea.innerHTML = `
      <div class="stele-run">
        <div class="stele-run__track">
          <span class="turtle-icon" id="turtle" style="left:${Math.min(turtleStep * 8, 72)}%">🐢</span>
        </div>
        <p class="stele-run__math" id="math-text">${q.text} = ?</p>
        <div class="numpad" id="numpad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
            .map((n) => `<button type="button" class="numpad__key" data-n="${n}">${n}</button>`)
            .join('')}
          <button type="button" class="numpad__key numpad__key--clear" data-n="c">⌫</button>
          <button type="button" class="numpad__key numpad__key--ok" data-n="ok">✓</button>
        </div>
        <p class="stele-run__answer" id="answer-display">_</p>
        <p class="game-play__round-hint">Bấm số hoặc phím 0-9, Enter để gửi</p>
      </div>
    `;

    let buf = '';
    const display = stage.gameArea.querySelector<HTMLElement>('#answer-display')!;
    keyInput = (n: string) => {
      if (n === 'c') buf = buf.slice(0, -1);
      else if (n === 'ok') submit();
      else buf += n;
      display.textContent = buf || '_';
    };

    const submit = () => {
      if (locked) return;
      locked = true;
      timer.stop();
      lockNumpad();
      const val = Number(buf);
      const ok = !Number.isNaN(val) && val === q.answer;
      if (!ok) display.textContent = `${buf || '?'} → ${q.answer}`;
      tracker.recordRound(ok, Date.now() - questionStarted);
      if (ok) {
        turtleStep++;
        turtleScene.setProgress(turtleStep, questions.length);
        speakVietnamese('Chính xác');
        stage.setGameFeedback('correct');
      } else {
        stage.setGameFeedback('wrong');
      }
      index++;
      const last = index >= questions.length;
      scheduleAfterAnswer(
        last,
        () => showQuestion(questions[index]),
        () => tracker.finish().then(onDone)
      );
    };

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.numpad__key').forEach((btn) => {
      btn.addEventListener('click', () => {
        keyInput?.(btn.dataset.n!);
      });
    });

    questionStarted = Date.now();
    timer.start(
      perQMs,
      (r) => {
        syncTimerBar(stage.timerFillEl, r, perQMs, timerSfx);
      },
      () => {
        if (locked) return;
        locked = true;
        timer.stop();
        lockNumpad();
        display.textContent = `Đáp án: ${q.answer}`;
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
    if (!keyInput || locked) return;
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      keyInput(e.key);
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      keyInput('c');
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      keyInput('ok');
    }
  };
  window.addEventListener('keydown', onKeyDown);

  showQuestion(questions[0]);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    turtleScene.dispose();
    stage.cleanup();
  };
}
