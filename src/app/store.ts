import type { AchievementLevel } from '@/data/types';

export type ScreenId =
  | 'welcome'
  | 'home'
  | 'game-select'
  | 'game-play'
  | 'result'
  | 'celebration';

export interface AppState {
  screen: ScreenId;
  playerId: string;
  playerName: string;
  selectedGameId: string | null;
  selectedAchievementLevel: AchievementLevel;
}

type Listener = () => void;

let state: AppState = {
  screen: 'welcome',
  playerId: '',
  playerName: '',
  selectedGameId: null,
  selectedAchievementLevel: 1,
};

const listeners = new Set<Listener>();

export function getAppState(): AppState {
  return state;
}

function setState(partial: Partial<AppState>): void {
  state = { ...state, ...partial };
  listeners.forEach((l) => l());
}

export function subscribeApp(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** API tương thích zustand để không đổi nhiều file */
export const useAppStore = {
  getState: getAppState,
  setState,
  subscribe: subscribeApp,
  setScreen: (screen: ScreenId) => setState({ screen }),
  setPlayer: (playerId: string, playerName: string) => setState({ playerId, playerName }),
  setPlayerName: (playerName: string) => setState({ playerName }),
  selectGame: (selectedGameId: string, selectedAchievementLevel: AchievementLevel) =>
    setState({ selectedGameId, selectedAchievementLevel, screen: 'game-play' }),
  resetSelection: () => setState({ selectedGameId: null, selectedAchievementLevel: 1 }),
};
