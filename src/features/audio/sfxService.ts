import { loadSettings } from '@/data/storage/settingsStore';
import { getAudioContext, resumeAudioContext } from './audioContext';

export type SfxKind =
  | 'correct'
  | 'wrong'
  | 'timeout'
  | 'click'
  | 'flip'
  | 'pop'
  | 'shoot'
  | 'miss'
  | 'warn'
  | 'danger'
  | 'celebrate'
  | 'unlock'
  | 'star'
  | 'drumStrike';

export interface TimerSfxState {
  warned: boolean;
  dangered: boolean;
}

/** Gọi sau thao tác người dùng để mở khóa AudioContext (trình duyệt). */
export function resumeAudio(): void {
  if (!loadSettings().sfxEnabled && !loadSettings().musicEnabled) return;
  resumeAudioContext();
}

function tone(
  ctx: AudioContext,
  opts: {
    freq: number;
    type?: OscillatorType;
    start: number;
    duration: number;
    peak: number;
    attack?: number;
    decay?: number;
  }
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type ?? 'sine';
  osc.frequency.value = opts.freq;
  const attack = opts.attack ?? 0.012;
  const decay = opts.decay ?? Math.max(0.04, opts.duration - attack);
  gain.gain.setValueAtTime(0.0001, opts.start);
  gain.gain.exponentialRampToValueAtTime(opts.peak, opts.start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, opts.start + attack + decay);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(opts.start);
  osc.stop(opts.start + opts.duration + 0.02);
}

export function playSfx(kind: SfxKind): void {
  if (!loadSettings().sfxEnabled) return;
  const ctx = getAudioContext(true);
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const t = ctx.currentTime;

  switch (kind) {
    case 'correct':
      tone(ctx, { freq: 523.25, start: t, duration: 0.12, peak: 0.09 });
      tone(ctx, { freq: 659.25, start: t + 0.1, duration: 0.16, peak: 0.1 });
      tone(ctx, { freq: 783.99, start: t + 0.22, duration: 0.2, peak: 0.08, type: 'triangle' });
      break;
    case 'wrong':
      tone(ctx, { freq: 220, type: 'sawtooth', start: t, duration: 0.14, peak: 0.045 });
      tone(ctx, { freq: 185, type: 'sawtooth', start: t + 0.12, duration: 0.18, peak: 0.04 });
      break;
    case 'timeout':
      tone(ctx, { freq: 392, start: t, duration: 0.1, peak: 0.07 });
      tone(ctx, { freq: 294, start: t + 0.11, duration: 0.22, peak: 0.08 });
      tone(ctx, { freq: 220, start: t + 0.28, duration: 0.28, peak: 0.06 });
      break;
    case 'click':
      tone(ctx, { freq: 880, type: 'triangle', start: t, duration: 0.05, peak: 0.035, attack: 0.004 });
      break;
    case 'flip':
      tone(ctx, { freq: 640, type: 'triangle', start: t, duration: 0.06, peak: 0.04, attack: 0.006 });
      tone(ctx, { freq: 520, start: t + 0.05, duration: 0.08, peak: 0.03 });
      break;
    case 'pop':
      tone(ctx, { freq: 740, start: t, duration: 0.07, peak: 0.07, attack: 0.008 });
      tone(ctx, { freq: 988, start: t + 0.06, duration: 0.1, peak: 0.06 });
      break;
    case 'shoot':
      tone(ctx, { freq: 190, type: 'square', start: t, duration: 0.11, peak: 0.06, attack: 0.01 });
      tone(ctx, { freq: 120, type: 'square', start: t + 0.04, duration: 0.08, peak: 0.03 });
      break;
    case 'miss':
      tone(ctx, { freq: 160, type: 'sawtooth', start: t, duration: 0.1, peak: 0.035 });
      break;
    case 'warn':
      tone(ctx, { freq: 740, type: 'triangle', start: t, duration: 0.08, peak: 0.05 });
      break;
    case 'danger':
      tone(ctx, { freq: 880, type: 'square', start: t, duration: 0.07, peak: 0.055 });
      tone(ctx, { freq: 880, type: 'square', start: t + 0.14, duration: 0.07, peak: 0.055 });
      break;
    case 'celebrate':
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        tone(ctx, { freq: f, start: t + i * 0.09, duration: 0.22, peak: 0.07 - i * 0.008, type: 'triangle' });
      });
      break;
    case 'unlock':
      tone(ctx, { freq: 440, start: t, duration: 0.1, peak: 0.07 });
      tone(ctx, { freq: 554.37, start: t + 0.1, duration: 0.12, peak: 0.08 });
      tone(ctx, { freq: 659.25, start: t + 0.2, duration: 0.18, peak: 0.09 });
      tone(ctx, { freq: 880, start: t + 0.32, duration: 0.28, peak: 0.08, type: 'triangle' });
      break;
    case 'star':
      tone(ctx, { freq: 1318.5, type: 'triangle', start: t, duration: 0.14, peak: 0.05 });
      tone(ctx, { freq: 1568, type: 'triangle', start: t + 0.1, duration: 0.16, peak: 0.045 });
      break;
    case 'drumStrike':
      tone(ctx, { freq: 78, type: 'sine', start: t, duration: 0.42, peak: 0.2, attack: 0.004, decay: 0.38 });
      tone(ctx, { freq: 156, type: 'triangle', start: t, duration: 0.28, peak: 0.09, attack: 0.003 });
      tone(ctx, { freq: 312, start: t + 0.04, duration: 0.18, peak: 0.045 });
      tone(ctx, { freq: 520, type: 'triangle', start: t + 0.1, duration: 0.45, peak: 0.028 });
      break;
    default:
      break;
  }
}

/** Một lần khi thanh thời gian qua ngưỡng cảnh báo / nguy hiểm. */
export function tickTimerSfx(pct: number, state: TimerSfxState): void {
  if (pct <= 15 && !state.dangered) {
    state.dangered = true;
    playSfx('danger');
  } else if (pct <= 35 && pct > 15 && !state.warned) {
    state.warned = true;
    playSfx('warn');
  }
  if (pct > 35) {
    state.warned = false;
    state.dangered = false;
  }
}

export function createTimerSfxState(): TimerSfxState {
  return { warned: false, dangered: false };
}
