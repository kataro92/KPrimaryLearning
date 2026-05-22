import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { scheduleAfterAnswer } from '@/features/gameplay/roundUi';
import { generateQuestions, timePerQuestionMs } from './questions';
import { ThanhGiongScene } from './thanhGiongScene';

export type { PlayResult };

export function renderDocHieuSuVietGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'doc-hieu-su-viet';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const { statements } = generateQuestions(level);
  const perMs = timePerQuestionMs(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: statements.length,
    targetTimeSec: perMs / 1000,
    startedAt,
  });

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--su-viet');
  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="thanh-giong-wrap">
      <div class="thanh-giong-status" id="thanh-giong-status">Giai đoạn: Baby Thánh Gióng · Sức mạnh 0/${statements.length}</div>
    </div>
  `;
  const sceneMount = heroHost.querySelector<HTMLElement>('.thanh-giong-wrap')!;
  const statusEl = heroHost.querySelector<HTMLElement>('#thanh-giong-status')!;
  const giongScene = new ThanhGiongScene(sceneMount);
  let index = 0;
  let correctCount = 0;
  let questionStarted = Date.now();
  let locked = false;
  let currentStatement: { text: string; isTrue: boolean; passage: string } | null = null;

  const disableStamps = (pickedTrue: boolean | undefined, statementIsTrue: boolean) => {
    const hint = stage.gameArea.querySelector<HTMLElement>('.history-panel__hint');
    if (hint) {
      hint.textContent = statementIsTrue
        ? 'Câu này ĐÚNG theo đoạn văn · chờ câu tiếp theo…'
        : 'Câu này SAI theo đoạn văn · chờ câu tiếp theo…';
    }
    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stamp').forEach((btn) => {
      btn.disabled = true;
      const isTrueBtn = btn.dataset.ok === 'true';
      if (isTrueBtn === statementIsTrue) btn.classList.add('stamp--answer-correct');
      if (pickedTrue !== undefined && isTrueBtn === pickedTrue) btn.classList.add('stamp--picked');
    });
    stage.gameArea.querySelector('.stamp-row')?.classList.add('stamp-row--locked');
  };

  const answer = (pickedTrue: boolean) => {
    const st = currentStatement;
    if (!st || locked) return;
    locked = true;
    timer.stop();
    const ok = pickedTrue === st.isTrue;
    disableStamps(pickedTrue, st.isTrue);
    if (ok) {
      correctCount++;
      giongScene.onCorrectAnswer(correctCount);
    } else {
      giongScene.onWrongAnswer();
    }
    tracker.recordRound(ok, Date.now() - questionStarted);
    stage.setGameFeedback(ok ? 'correct' : 'wrong');
    updatePowerStatus();
    index++;
    const last = index >= statements.length;
    if (last && correctCount === statements.length) giongScene.transformToLegend();
    scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
  };

  const showQuestion = () => {
    const st = statements[index];
    currentStatement = st;
    locked = false;
    stage.updateDots(index, statements.length);
    stage.gameArea.innerHTML = `
      <div class="history-scroll">
        <div class="history-scroll__strip">
          <p class="history-scroll__passage">${st.passage}</p>
        </div>
        <div class="history-panel">
          <p class="history-panel__q">${st.text}</p>
          <div class="stamp-row">
            <button type="button" class="stamp stamp--true" data-ok="true">✓ Đúng</button>
            <button type="button" class="stamp stamp--false" data-ok="false">✗ Sai</button>
          </div>
          <p class="history-panel__hint">Chạm tem hoặc bấm phím 1/2 (T/F): câu này đúng hay sai?</p>
        </div>
      </div>
    `;

    speakVietnamese(st.text);

    stage.gameArea.querySelectorAll<HTMLButtonElement>('.stamp').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pickedTrue = btn.dataset.ok === 'true';
        answer(pickedTrue);
      });
    });

    questionStarted = Date.now();
    timer.start(
      perMs,
      (r) => {
        syncTimerBar(stage.timerFillEl, r, perMs, timerSfx);
      },
      () => {
        if (locked || !currentStatement) return;
        locked = true;
        timer.stop();
        disableStamps(undefined, currentStatement.isTrue);
        stage.setGameFeedback('timeout');
        tracker.recordRound(false, Date.now() - questionStarted);
        giongScene.onWrongAnswer();
        updatePowerStatus();
        index++;
        const last = index >= statements.length;
        scheduleAfterAnswer(last, showQuestion, () => tracker.finish().then(onDone));
      }
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (locked || !currentStatement) return;
    const k = e.key.toLowerCase();
    if (k === '1' || k === 't' || k === 'y') {
      e.preventDefault();
      answer(true);
    } else if (k === '2' || k === 'f' || k === 'n') {
      e.preventDefault();
      answer(false);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  const updatePowerStatus = () => {
    const evoStep = Math.floor(correctCount / 3);
    const remainToEvolve = ((3 - (correctCount % 3)) % 3) || 3;
    const form =
      correctCount === statements.length
        ? 'Chiến thần trưởng thành'
        : correctCount >= 3
          ? `Kid Thánh Gióng · Tiến hóa ${Math.min(evoStep, 3)}`
          : 'Baby Thánh Gióng';
    const nextMilestone =
      correctCount === statements.length
        ? 'Hoàn hảo! Ngựa sắt đã phun lửa.'
        : `${remainToEvolve} câu đúng nữa để tiến hóa`;
    statusEl.textContent = `Giai đoạn: ${form} · Sức mạnh ${correctCount}/${statements.length} · ${nextMilestone}`;
  };
  updatePowerStatus();

  showQuestion();
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    giongScene.dispose();
    stage.cleanup();
  };
}
