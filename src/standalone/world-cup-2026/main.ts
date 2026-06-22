import '@/styles/clay-tokens.css';
import '@/styles/clay.css';
import '@/styles/clay-game.css';
import './styles.css';
import { disposeBgmService, resumeBgm, startBgm, stopBgm } from '@/features/audio/bgmService';
import {
  createTimerSfxState,
  playSfx,
  resumeAudio,
  tickTimerSfx,
  type TimerSfxState,
} from '@/features/audio/sfxService';
import { bindUiClickSounds } from '@/features/audio/uiClick';
import { WorldCupScene3D } from './scene3d';
import {
  advanceStage,
  checkAnswer,
  computeFinalScore,
  createLevel,
  getCountryById,
  getNextCountryId,
  getUnlockedCountryIds,
  pickQuestion,
  unlockCountry,
} from './quiz';
import { QuestionTimer } from './timer';
import type { LevelState, ScreenId, ShotType } from './types';
import { createUi } from './ui';

let level: LevelState | null = null;
let scene3d: WorldCupScene3D | null = null;
let pendingAfterAnim: (() => void) | null = null;
let inputLocked = false;
let focusAnswerIndex = 0;
const questionTimer = new QuestionTimer();
const timerSfx: TimerSfxState = createTimerSfxState();
const WC_BGM_ID = 'world-cup-2026';

function primeAudio(): void {
  resumeAudio();
  resumeBgm();
  startBgm(WC_BGM_ID);
}

function shotFromIndex(index: number): ShotType {
  return index === 0 ? 'A' : index === 1 ? 'B' : 'C';
}

function syncSceneView(screen: ScreenId): void {
  if (!scene3d) return;
  scene3d.setView(screen === 'play' ? 'play' : 'menu');
  requestAnimationFrame(() => scene3d?.forceResize());
}

function beginCountry(countryId: string): void {
  const country = getCountryById(countryId);
  if (!country) return;
  level = createLevel(countryId);
  scene3d?.setCountryColors(country.flagColors);
  scene3d?.setStage(1, { hardReset: true });
  showStageQuestion();
}

function startQuestionTimer(): void {
  if (!level) return;
  timerSfx.warned = false;
  timerSfx.dangered = false;
  questionTimer.start(
    level.stage,
    (ratio) => {
      ui.updateTimer(ratio);
      tickTimerSfx(ratio * 100, timerSfx);
    },
    () => handleTimeout()
  );
}

function handleTimeout(): void {
  if (!level || inputLocked) return;
  submitAnswer(-1, true);
}

function showStageQuestion(): void {
  if (!level) return;
  const country = getCountryById(level.countryId);
  if (!country) return;
  const question = pickQuestion(level, country);
  scene3d?.setStage(level.stage);
  scene3d?.setQuiz(question);
  ui.renderPlayHud(level);
  focusAnswerIndex = 0;
  scene3d?.highlightQuizAnswer(0);
  inputLocked = false;
  startQuestionTimer();
}

function finishLevel(): void {
  if (!level) return;
  const country = getCountryById(level.countryId)!;
  const score = computeFinalScore(level);
  unlockCountry(level.countryId, score);
  playSfx('unlock');
  ui.renderDiscovery(country, score);
}

function submitAnswer(index: number, fromTimeout = false): void {
  if (!level || inputLocked) return;
  const country = getCountryById(level.countryId);
  if (!country || !level.currentQuestion) return;

  questionTimer.stop();
  inputLocked = true;
  scene3d?.setQuizAnswersEnabled(false);

  if (!fromTimeout) {
    scene3d?.highlightQuizAnswer(index);
    scene3d?.fadeOtherQuizAnswers(index);
  } else {
    playSfx('timeout');
    scene3d?.setQuizFeedback('Hết giờ! Thủ môn cản phá.', 'bad');
  }

  const correct = fromTimeout ? false : checkAnswer(level, index);
  if (fromTimeout) {
    level.correctStreak = 0;
    level.lives -= 1;
  }

  const shot: ShotType = fromTimeout ? 'B' : shotFromIndex(index);

  setTimeout(() => {
    playSfx('shoot');
    scene3d?.playShot(shot, correct);
    pendingAfterAnim = () => {
      if (!level) return;
      if (!correct) {
        playSfx(fromTimeout ? 'miss' : 'wrong');
        ui.updateLives(level.lives, level.lives);
        if (level.lives <= 0) {
          ui.renderDefeat(country);
          return;
        }
        scene3d?.setQuizFeedback(
          fromTimeout ? 'Hết giờ! Mất 1 lượt sút.' : 'Bị cản phá! Mất 1 lượt sút.',
          'bad'
        );
        level.usedQuestionIds.delete(level.currentQuestion!.id);
        setTimeout(() => showStageQuestion(), 700);
        return;
      }

      if (level.stage === 4) {
        playSfx('celebrate');
        scene3d?.setQuizFeedback('MÀN CHƠI HOÀN THÀNH - GOAL!!!', 'ok');
        setTimeout(() => finishLevel(), 500);
        return;
      }

      playSfx('correct');
      advanceStage(level);
      scene3d?.setQuizFeedback('Vượt qua hậu vệ! Chặng tiếp theo.', 'ok');
      setTimeout(() => showStageQuestion(), 400);
    };
  }, fromTimeout ? 200 : 350);
}

const ui = createUi(document.querySelector('#wc-app')!, {
  onStartMenu() {
    ui.renderCountrySelect(getUnlockedCountryIds());
  },
  onStartCountry(countryId) {
    beginCountry(countryId);
  },
  onRetry() {
    if (!level) return;
    beginCountry(level.countryId);
  },
  onNextCountry() {
    const nextId = level ? getNextCountryId(level.countryId) : null;
    if (nextId) beginCountry(nextId);
    else ui.renderCountrySelect(getUnlockedCountryIds());
  },
  onPlayAgain() {
    ui.renderCountrySelect(getUnlockedCountryIds());
  },
  onBackHome() {
    questionTimer.stop();
    stopBgm();
    scene3d?.dispose();
    scene3d = null;
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = `${base}index.html`;
  },
  onPlayReady() {
    scene3d?.forceResize();
  },
  onScreenChange(screen) {
    syncSceneView(screen);
  },
});

scene3d = new WorldCupScene3D(document.querySelector('#wc-play-stage')!, {
  onSequenceDone() {
    pendingAfterAnim?.();
    pendingAfterAnim = null;
  },
  onQuizAnswer(index) {
    submitAnswer(index);
  },
});
scene3d.setView('menu');

window.addEventListener('keydown', (e) => {
  if (!level || inputLocked) return;
  const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, a: 0, b: 1, c: 2, A: 0, B: 1, C: 2 };
  if (e.key in map) {
    e.preventDefault();
    submitAnswer(map[e.key]!);
    return;
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    focusAnswerIndex = (focusAnswerIndex + 2) % 3;
    scene3d?.highlightQuizAnswer(focusAnswerIndex);
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    focusAnswerIndex = (focusAnswerIndex + 1) % 3;
    scene3d?.highlightQuizAnswer(focusAnswerIndex);
    return;
  }
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    submitAnswer(focusAnswerIndex);
  }
});

bindUiClickSounds(document.querySelector('#wc-app')!);
document.addEventListener('pointerdown', primeAudio, { passive: true });
window.addEventListener('pagehide', () => disposeBgmService());

ui.renderMenu();
startBgm(WC_BGM_ID);
