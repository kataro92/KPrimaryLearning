import type { CountryProfile, Difficulty, LevelState, QuizQuestion } from './types';
import { COUNTRIES } from './countries';
import { pickRandomItem, shuffleArray, shuffleQuestionOptions } from './quizRandom';

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
  const byDifficulty = country.questions.filter((q) => q.difficulty === difficulty);

  let pool = byDifficulty.filter((q) => !level.usedQuestionIds.has(q.id));
  if (pool.length === 0) {
    // Hết câu mới trong lượt — xáo lại toàn bộ độ khó, cho phép lặp nhưng vẫn random.
    level.usedQuestionIds.forEach((id) => {
      if (byDifficulty.some((q) => q.id === id)) level.usedQuestionIds.delete(id);
    });
    pool = byDifficulty;
  }

  const shuffled = shuffleArray(pool);
  const base = pickRandomItem(shuffled) ?? byDifficulty[0]!;
  const presented = shuffleQuestionOptions(base);
  level.usedQuestionIds.add(base.id);
  level.currentQuestion = presented;
  return presented;
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

export function advanceStage(level: LevelState): void {
  if (level.stage >= 4) return;
  level.stage = (level.stage + 1) as 1 | 2 | 3 | 4;
  level.currentQuestion = null;
}

export function computeFinalScore(level: LevelState): number {
  const base = level.score * 2;
  const lifeBonus = level.lives * 3;
  const streakBonus = Math.min(level.correctStreak, 5);
  return Math.min(10, Math.round((base + lifeBonus + streakBonus) * 0.5 * 2) / 2);
}

const STORAGE_UNLOCK = 'wc2026_unlocked';
const STORAGE_COMPLETED = 'wc2026_completed';
const STORAGE_BEST = 'wc2026_best';

export function getUnlockedCountryIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_UNLOCK);
    if (!raw) return [COUNTRIES[0]!.id];
    const parsed = JSON.parse(raw) as string[];
    return parsed.length > 0 ? parsed : [COUNTRIES[0]!.id];
  } catch {
    return [COUNTRIES[0]!.id];
  }
}

export function getCompletedCountryIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_COMPLETED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function getBestScore(countryId: string): number {
  try {
    const raw = localStorage.getItem(STORAGE_BEST);
    if (!raw) return 0;
    const map = JSON.parse(raw) as Record<string, number>;
    return map[countryId] ?? 0;
  } catch {
    return 0;
  }
}

export function unlockCountry(id: string, score: number): void {
  const current = new Set(getUnlockedCountryIds());
  current.add(id);
  const idx = COUNTRIES.findIndex((c) => c.id === id);
  if (idx >= 0 && idx + 1 < COUNTRIES.length) {
    current.add(COUNTRIES[idx + 1]!.id);
  }
  localStorage.setItem(STORAGE_UNLOCK, JSON.stringify([...current]));

  const completed = new Set(getCompletedCountryIds());
  completed.add(id);
  localStorage.setItem(STORAGE_COMPLETED, JSON.stringify([...completed]));

  try {
    const raw = localStorage.getItem(STORAGE_BEST);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[id] = Math.max(map[id] ?? 0, score);
    localStorage.setItem(STORAGE_BEST, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getNextCountryId(currentId: string): string | null {
  const idx = COUNTRIES.findIndex((c) => c.id === currentId);
  if (idx < 0 || idx + 1 >= COUNTRIES.length) return null;
  const next = COUNTRIES[idx + 1]!;
  return getUnlockedCountryIds().includes(next.id) ? next.id : null;
}
