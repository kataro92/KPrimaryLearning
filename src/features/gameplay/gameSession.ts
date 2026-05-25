import type { SceneHost } from '@/core/rendering/sceneHost';
import { cancelSpeech } from '@/features/speech/speechService';
import { scheduleAfterAnswer as scheduleAfterAnswerBase } from './roundUi';

/** Phiên chơi — hủy timer/vòng đợi/TTS khi ấn Về hoặc thoát game. */
export type GameSession = {
  readonly active: boolean;
  scheduleAfterAnswer: (
    isLast: boolean,
    onNext: () => void,
    onDone: () => void | Promise<void>
  ) => void;
  /** setTimeout có guard; trả hàm hủy. */
  delay: (fn: () => void, ms: number) => () => void;
  dispose: () => void;
};

export function createGameSession(): GameSession {
  let alive = true;
  let cancelPendingRound: (() => void) | null = null;
  const timeouts = new Set<number>();

  const dispose = () => {
    if (!alive) return;
    alive = false;
    cancelPendingRound?.();
    cancelPendingRound = null;
    for (const id of timeouts) clearTimeout(id);
    timeouts.clear();
    cancelSpeech();
  };

  return {
    get active() {
      return alive;
    },
    scheduleAfterAnswer(isLast, onNext, onDone) {
      cancelPendingRound?.();
      cancelPendingRound = scheduleAfterAnswerBase(
        isLast,
        () => {
          if (!alive) return;
          onNext();
        },
        () => {
          if (!alive) return;
          void Promise.resolve(onDone());
        }
      );
    },
    delay(fn, ms) {
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        if (alive) fn();
      }, ms);
      timeouts.add(id);
      return () => {
        clearTimeout(id);
        timeouts.delete(id);
      };
    },
    dispose,
  };
}

/** Gắn teardown lên SceneHost; nút Về gọi cùng hàm này. */
export function bindGameLifecycle(sceneHost: SceneHost, teardown: () => void): () => void {
  const run = () => teardown();
  sceneHost.setActiveGameTeardown(run);
  return () => sceneHost.exitActiveGame();
}
