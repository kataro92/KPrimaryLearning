import type { CountryProfile, Difficulty, LevelState, QuizQuestion } from './types';
import { COUNTRIES } from './countries';

const STAGE_DIFFICULTY: Record<1 | 2 | 3 | 4, Difficulty> = {
  1: 'easy',
  2: 'medium',
  3: 'hard',
  4: 'hard',
};

export function getCountryById(id: string): CountryProfile | undefined {
  return COUNTRIES.find((c) => c.id === id);
}

export function createLevel(countryId: string): LevelState {
  return {
    countryId,
    stage: 1,
    lives: 3,
    correctStreak: 0,
    currentQuestion: null,
    usedQuestionIds: new Set(),
    score: 0,
    startedAt: Date.now(),
  };
}

export function pickQuestion(level: LevelState, country: CountryProfile): QuizQuestion {
  const difficulty = STAGE_DIFFICULTY[level.stage];
  const pool = country.questions.filter(
    (q) => q.difficulty === difficulty && !level.usedQuestionIds.has(q.id)
  );
  const fallback = country.questions.filter((q) => q.difficulty === difficulty);
  const chosen = (pool.length > 0 ? pool : fallback)[
    Math.floor(Math.random() * (pool.length > 0 ? pool.length : fallback.length))
  ]!;
  level.usedQuestionIds.add(chosen.id);
  level.currentQuestion = chosen;
  return chosen;
}

export function checkAnswer(level: LevelState, answerIndex: number): boolean {
  if (!level.currentQuestion) return false;
  const correct = level.currentQuestion.correctIndex === answerIndex;
  if (correct) {
    level.correctStreak += 1;
    level.score += level.stage === 4 ? 4 : level.stage;
  } else {
    level.correctStreak = 0;
    level.lives -= 1;
  }
  return correct;
}

export function advanceStage(level: LevelState): boolean {
  if (level.stage >= 4) return true;
  level.stage = (level.stage + 1) as 1 | 2 | 3 | 4;
  level.currentQuestion = null;
  return false;
}

export function isLevelComplete(level: LevelState): boolean {
  return level.stage === 4 && level.currentQuestion === null && level.lives > 0;
}

export function computeFinalScore(level: LevelState): number {
  const base = level.score * 2;
  const lifeBonus = level.lives * 3;
  const streakBonus = Math.min(level.correctStreak, 5);
  return Math.min(10, Math.round((base + lifeBonus + streakBonus) * 0.5 * 2) / 2);
}

const STORAGE_KEY = 'wc2026_unlocked';

export function getUnlockedCountryIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [COUNTRIES[0]!.id];
    const parsed = JSON.parse(raw) as string[];
    return parsed.length > 0 ? parsed : [COUNTRIES[0]!.id];
  } catch {
    return [COUNTRIES[0]!.id];
  }
}

export function unlockCountry(id: string): void {
  const current = new Set(getUnlockedCountryIds());
  current.add(id);
  const idx = COUNTRIES.findIndex((c) => c.id === id);
  if (idx >= 0 && idx + 1 < COUNTRIES.length) {
    current.add(COUNTRIES[idx + 1]!.id);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
}
