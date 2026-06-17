import type { LevelState } from './types';

const TIME_MS: Record<1 | 2 | 3 | 4, number> = {
  1: 25000,
  2: 20000,
  3: 15000,
  4: 20000,
};

export class QuestionTimer {
  private raf = 0;
  private endAt = 0;
  private totalMs = 0;
  private onTick: ((ratio: number) => void) | null = null;
  private onTimeout: (() => void) | null = null;

  start(stage: LevelState['stage'], onTick: (ratio: number) => void, onTimeout: () => void): void {
    this.stop();
    this.totalMs = TIME_MS[stage];
    this.endAt = performance.now() + this.totalMs;
    this.onTick = onTick;
    this.onTimeout = onTimeout;
    this.loop();
  }

  stop(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.onTick = null;
    this.onTimeout = null;
  }

  private loop = (): void => {
    const remaining = Math.max(0, this.endAt - performance.now());
    const ratio = this.totalMs > 0 ? remaining / this.totalMs : 0;
    this.onTick?.(ratio);
    if (remaining <= 0) {
      this.onTimeout?.();
      this.stop();
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}
