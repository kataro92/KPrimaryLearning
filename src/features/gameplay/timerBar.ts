import { createTimerSfxState, tickTimerSfx, type TimerSfxState } from '@/features/audio/sfxService';

export { createTimerSfxState, type TimerSfxState };

/** Cập nhật thanh thời gian + âm cảnh báo (một lần mỗi ngưỡng). */
export function syncTimerBar(
  fillEl: HTMLElement,
  remainingMs: number,
  totalMs: number,
  sfxState: TimerSfxState,
  classOpts?: { warnPct?: number; dangerPct?: number }
): number {
  const pct = totalMs > 0 ? (remainingMs / totalMs) * 100 : 0;
  fillEl.style.width = `${pct}%`;
  const warnAt = classOpts?.warnPct ?? 35;
  const dangerAt = classOpts?.dangerPct ?? 15;
  if (classOpts) {
    fillEl.classList.toggle('timer-bar__fill--warn', pct <= warnAt && pct > dangerAt);
    fillEl.classList.toggle('timer-bar__fill--danger', pct <= dangerAt);
  }
  tickTimerSfx(pct, sfxState);
  return pct;
}
