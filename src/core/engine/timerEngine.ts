export type TimerTick = (remainingMs: number) => void;
export type TimerEnd = () => void;

export class TimerEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private endAt = 0;

  start(durationMs: number, onTick: TimerTick, onEnd: TimerEnd): void {
    this.stop();
    this.endAt = Date.now() + durationMs;
    onTick(durationMs);
    this.intervalId = setInterval(() => {
      const remaining = Math.max(0, this.endAt - Date.now());
      onTick(remaining);
      if (remaining <= 0) {
        this.stop();
        onEnd();
      }
    }, 100);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
