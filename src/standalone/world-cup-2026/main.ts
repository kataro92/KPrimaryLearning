import './styles.css';
import { COUNTRIES } from './countries';
import { SoccerGameCanvas } from './game';
import {
  advanceStage,
  checkAnswer,
  computeFinalScore,
  createLevel,
  getCountryById,
  getUnlockedCountryIds,
  pickQuestion,
  unlockCountry,
} from './quiz';
import type { LevelState, ShotType } from './types';
import { createUi } from './ui';

let level: LevelState | null = null;
let canvas: SoccerGameCanvas | null = null;
let pendingAfterAnim: (() => void) | null = null;
let inputLocked = false;

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

function showStageQuestion(): void {
  if (!level) return;
  const country = getCountryById(level.countryId);
  if (!country) return;
  const question = pickQuestion(level, country);
  canvas?.setStage(level.stage);
  ui.renderPlayHud(level, country, question);
  inputLocked = false;
}

function finishLevel(): void {
  if (!level) return;
  const country = getCountryById(level.countryId)!;
  const score = computeFinalScore(level);
  unlockCountry(level.countryId);
  ui.renderDiscovery(country, score);
}

const ui = createUi(document.querySelector('#wc-app')!, {
  onStartMenu() {
    ui.renderCountrySelect(getUnlockedCountryIds());
  },
  onStartCountry(countryId) {
    beginCountry(countryId);
  },
  onAnswer(index) {
    if (!level || inputLocked) return;
    const country = getCountryById(level.countryId);
    if (!country || !level.currentQuestion) return;

    inputLocked = true;
    ui.setAnswersEnabled(false);
    ui.highlightAnswer(index);
    ui.fadeOtherAnswers(index);

    const correct = checkAnswer(level, index);
    const shot = shotFromIndex(index);

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
          ui.setFeedback('Bị cản phá! Mất 1 lượt sút.', 'bad');
          level.usedQuestionIds.delete(level.currentQuestion!.id);
          setTimeout(() => showStageQuestion(), 700);
          return;
        }

        const completed = level.stage === 4;
        if (completed) {
          ui.renderVictoryBanner();
          setTimeout(() => finishLevel(), 500);
          return;
        }

        advanceStage(level);
        ui.setFeedback('Vượt qua hậu vệ! Chặng tiếp theo.', 'ok');
        setTimeout(() => showStageQuestion(), 400);
      };
    }, 350);
  },
  onRetry() {
    if (!level) return;
    beginCountry(level.countryId);
  },
  onNextCountry() {
    const unlocked = getUnlockedCountryIds();
    const next = COUNTRIES.find((c) => unlocked.includes(c.id) && c.id !== level?.countryId);
    if (next) beginCountry(next.id);
    else ui.renderCountrySelect(unlocked);
  },
  onPlayAgain() {
    ui.renderCountrySelect(getUnlockedCountryIds());
  },
  onBackHome() {
    const base = import.meta.env.BASE_URL || '/';
    window.location.href = `${base}index.html`;
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
  const map: Record<string, number> = { '1': 0, '2': 1, '3': 2 };
  if (e.key in map) {
    e.preventDefault();
    ui.onAnswer(map[e.key]!);
  }
});

ui.renderMenu();
