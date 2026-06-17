import './styles.css';
import { SoccerGameCanvas } from './game';
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
import type { LevelState, ShotType } from './types';
import { createUi } from './ui';

let level: LevelState | null = null;
let canvas: SoccerGameCanvas | null = null;
let pendingAfterAnim: (() => void) | null = null;
let inputLocked = false;
let focusAnswerIndex = 0;
const questionTimer = new QuestionTimer();

function shotFromIndex(index: number): ShotType {
  return index === 0 ? 'A' : index === 1 ? 'B' : 'C';
}

function beginCountry(countryId: string): void {
  const country = getCountryById(countryId);
  if (!country) return;
  level = createLevel(countryId);
  canvas?.setCountryColors(country.flagColors);
  canvas?.setStage(1);
  showStageQuestion();
}

function startQuestionTimer(): void {
  if (!level) return;
  questionTimer.start(
    level.stage,
    (ratio) => ui.updateTimer(ratio),
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
  canvas?.setStage(level.stage);
  ui.renderPlayHud(level, country, question);
  focusAnswerIndex = 0;
  ui.highlightAnswer(0);
  inputLocked = false;
  startQuestionTimer();
}

function finishLevel(): void {
  if (!level) return;
  const country = getCountryById(level.countryId)!;
  const score = computeFinalScore(level);
  unlockCountry(level.countryId, score);
  ui.renderDiscovery(country, score);
}

function submitAnswer(index: number, fromTimeout = false): void {
  if (!level || inputLocked) return;
  const country = getCountryById(level.countryId);
  if (!country || !level.currentQuestion) return;

  questionTimer.stop();
  inputLocked = true;
  ui.setAnswersEnabled(false);

  if (!fromTimeout) {
    ui.highlightAnswer(index);
    ui.fadeOtherAnswers(index);
  } else {
    ui.setFeedback('Hết giờ! Thủ môn cản phá.', 'bad');
  }

  const correct = fromTimeout ? false : checkAnswer(level, index);
  if (fromTimeout) {
    level.correctStreak = 0;
    level.lives -= 1;
  }

  const shot: ShotType = fromTimeout ? 'B' : shotFromIndex(index);

  setTimeout(() => {
    canvas?.playShot(shot, correct);
    pendingAfterAnim = () => {
      if (!level) return;
      if (!correct) {
        ui.updateLives(level.lives, level.lives);
        if (level.lives <= 0) {
          ui.renderDefeat(country);
          return;
        }
        ui.setFeedback(fromTimeout ? 'Hết giờ! Mất 1 lượt sút.' : 'Bị cản phá! Mất 1 lượt sút.', 'bad');
        level.usedQuestionIds.delete(level.currentQuestion!.id);
        setTimeout(() => showStageQuestion(), 700);
        return;
      }

      if (level.stage === 4) {
        ui.renderVictoryBanner();
        setTimeout(() => finishLevel(), 500);
        return;
      }

      advanceStage(level);
      ui.setFeedback('Vượt qua hậu vệ! Chặng tiếp theo.', 'ok');
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
  onAnswer(index) {
    submitAnswer(index);
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
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = `${base}index.html`;
  },
  onPlayReady() {
    canvas?.forceResize();
  },
});

canvas = new SoccerGameCanvas(document.querySelector('#wc-canvas')!, {
  onSequenceDone() {
    pendingAfterAnim?.();
    pendingAfterAnim = null;
  },
});

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
    ui.highlightAnswer(focusAnswerIndex);
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    focusAnswerIndex = (focusAnswerIndex + 1) % 3;
    ui.highlightAnswer(focusAnswerIndex);
    return;
  }
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    submitAnswer(focusAnswerIndex);
  }
});

ui.renderMenu();
