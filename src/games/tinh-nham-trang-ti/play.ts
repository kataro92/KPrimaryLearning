import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { bindGameLifecycle, createGameSession } from '@/features/gameplay/gameSession';
import { setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import {
  generateQuestions,
  questionCount,
  timePerQuestionMs,
  type MathQuestion,
} from './questions';
import { TrexBattleScene } from './trexBattleScene';

export type { PlayResult };

export function renderTinhNhamGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'tinh-nham-trang-ti';
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

  const session = createGameSession();
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--trang-ti');
  sceneHost.setParallaxSway(false);
  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="trang-ti-trex-wrap">
      <div class="trang-ti-trex-status" id="trex-status">T-Rex phòng thủ · 0/${questions.length} phát trúng</div>
    </div>
  `;
  const trexMount = heroHost.querySelector<HTMLElement>('.trang-ti-trex-wrap')!;
  const trexStatusEl = heroHost.querySelector<HTMLElement>('#trex-status')!;
  const trexScene = new TrexBattleScene(trexMount, questions.length);
  let index = 0;
  let questionStarted = Date.now();
  let streakFlash = 0;
  let locked = false;
  let correctHits = 0;

  const lockArena = () => {
    const arena = stage.gameArea.querySelector('.arena-math');
    arena?.classList.add('arena-math--locked');
    const input = stage.gameArea.querySelector<HTMLInputElement>('#answer');
    const btn = stage.gameArea.querySelector<HTMLButtonElement>('#btn-submit');
    if (input) input.disabled = true;
    if (btn) btn.disabled = true;
    setRoundHint(stage.gameArea, '.game-play__round-hint', WAIT_NEXT_HINT);
  };

  const showQuestion = (q: MathQuestion) => {
    locked = false;
    stage.updateDots(index, questions.length);
    stage.setFeedback('');
    stage.gameArea.innerHTML = `
      <div class="arena-math">
        <div class="arena-math__drum">🥁</div>
        <p class="arena-math__problem" id="math-text">${q.text}</p>
        <input id="answer" class="arena-math__input" type="number" inputmode="numeric" placeholder="?" autocomplete="off" />
        <button type="button" class="btn btn-primary arena-math__go" id="btn-submit">Trống!</button>
        <p class="game-play__round-hint">Gõ đáp án rồi bấm Trống hoặc Enter</p>
      </div>
    `;

    speakVietnamese(q.text);

    const answerEl = stage.gameArea.querySelector<HTMLInputElement>('#answer')!;
    const submit = () => {
      if (locked) return;
      const val = Number(answerEl.value.trim());
      if (Number.isNaN(val)) return;
      locked = true;
      timer.stop();
      lockArena();
      const ok = val === q.answer;
      tracker.recordRound(ok, Date.now() - questionStarted);
      if (ok) {
        streakFlash++;
        correctHits++;
        trexScene.onCorrectAnswer();
        trexStatusEl.textContent = `T-Rex phòng thủ · ${correctHits}/${questions.length} phát trúng`;
        speakVietnamese('Chính xác');
        stage.setGameFeedback('correct');
        if (correctHits >= questions.length) {
          trexScene.onCompleted();
          trexStatusEl.textContent = '💥 Trúng toàn bộ! T-Rex đã ngất!';
        }
      } else {
        streakFlash = 0;
        trexScene.onWrongAnswer();
        stage.setGameFeedback('wrong');
      }
      index++;
      const last = index >= questions.length;
      session.scheduleAfterAnswer(
        last,
        () => showQuestion(questions[index]),
        () => tracker.finish().then(onDone)
      );
    };

    stage.gameArea.querySelector('#btn-submit')!.addEventListener('click', submit);
    answerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
    answerEl.focus();

    questionStarted = Date.now();
    timer.start(
      perQMs,
      (r) => {
        syncTimerBar(stage.timerFillEl, r, perQMs, timerSfx, { warnPct: 35, dangerPct: 15 });
      },
      () => {
        if (locked) return;
        locked = true;
        timer.stop();
        lockArena();
        stage.setGameFeedback('timeout');
        tracker.recordRound(false, Date.now() - questionStarted);
        streakFlash = 0;
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

  showQuestion(questions[0]);
  return bindGameLifecycle(sceneHost, () => {
    timer.stop();
    session.dispose();
    trexScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}
