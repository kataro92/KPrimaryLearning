import { loadSettings } from '@/data/storage/settingsStore';
import { subscribeTtsState } from '@/features/speech/speechService';
import { getAudioContext, resumeAudioContext } from './audioContext';

export type BgmGameId =
  | 'trang-nguyen-toan'
  | 'net-chu-rong-tien'
  | 'tu-vung-hoi-an'
  | 'trong-dong'
  | 'hinh-hoc-thang-long'
  | 'doc-hieu-su-viet'
  | 'cuu-chuong-van-mieu'
  | 'tham-hiem-cuu-long'
  | 'tinh-nham-trang-ti';

interface BgmTheme {
  rootHz: number;
  /** Semitone offsets forming a calm pentatonic palette. */
  scale: number[];
  wave: OscillatorType;
  bpm: number;
  /** Master gain for this theme (0–1). */
  level: number;
  filterHz: number;
}

const THEMES: Record<BgmGameId, BgmTheme> = {
  'trang-nguyen-toan': {
    rootHz: 261.63,
    scale: [0, 2, 4, 7, 9, 7, 4, 2],
    wave: 'sine',
    bpm: 68,
    level: 0.11,
    filterHz: 900,
  },
  'net-chu-rong-tien': {
    rootHz: 293.66,
    scale: [0, 3, 5, 7, 10, 7, 5, 3],
    wave: 'triangle',
    bpm: 64,
    level: 0.1,
    filterHz: 1100,
  },
  'tu-vung-hoi-an': {
    rootHz: 196,
    scale: [0, 2, 4, 7, 9, 12, 9, 7],
    wave: 'sine',
    bpm: 72,
    level: 0.12,
    filterHz: 850,
  },
  'trong-dong': {
    rootHz: 110,
    scale: [0, 2, 5, 7, 10, 7, 5, 2],
    wave: 'triangle',
    bpm: 60,
    level: 0.13,
    filterHz: 650,
  },
  'hinh-hoc-thang-long': {
    rootHz: 164.81,
    scale: [0, 2, 4, 7, 9, 4, 7, 9],
    wave: 'sine',
    bpm: 70,
    level: 0.1,
    filterHz: 950,
  },
  'doc-hieu-su-viet': {
    rootHz: 174.61,
    scale: [0, 3, 5, 7, 10, 7, 5, 3],
    wave: 'triangle',
    bpm: 66,
    level: 0.11,
    filterHz: 800,
  },
  'cuu-chuong-van-mieu': {
    rootHz: 123.47,
    scale: [0, 4, 7, 11, 7, 4, 0, 4],
    wave: 'sine',
    bpm: 62,
    level: 0.1,
    filterHz: 750,
  },
  'tham-hiem-cuu-long': {
    rootHz: 130.81,
    scale: [0, 2, 5, 7, 9, 7, 5, 2],
    wave: 'triangle',
    bpm: 74,
    level: 0.12,
    filterHz: 880,
  },
  'tinh-nham-trang-ti': {
    rootHz: 196,
    scale: [0, 2, 4, 7, 9, 12, 9, 4],
    wave: 'triangle',
    bpm: 78,
    level: 0.11,
    filterHz: 1000,
  },
};

const NORMAL_GAIN = 1;
const DUCK_GAIN = 0.35;
const FADE_MS = 480;

let activeGameId: BgmGameId | null = null;
let stopping = false;
let masterGain: GainNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let schedulerId: ReturnType<typeof setInterval> | null = null;
let stepIndex = 0;
let nextNoteTime = 0;
let ttsUnsub: (() => void) | null = null;
let duckTarget = NORMAL_GAIN;

function semitoneHz(base: number, semitones: number): number {
  return base * 2 ** (semitones / 12);
}

function notePeak(theme: BgmTheme): number {
  return theme.level * 0.55;
}

function playPadNote(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  peak: number,
  wave: OscillatorType
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  const attack = 0.08;
  const release = Math.max(0.12, duration - attack);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
  osc.connect(gain);
  gain.connect(filterNode!);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function scheduleNotes(ctx: AudioContext, theme: BgmTheme): void {
  const beatSec = 60 / theme.bpm;
  const noteLen = beatSec * 1.6;
  const lookahead = 0.18;

  while (nextNoteTime < ctx.currentTime + lookahead) {
    const semitone = theme.scale[stepIndex % theme.scale.length]!;
    const freq = semitoneHz(theme.rootHz, semitone);
    playPadNote(ctx, freq, nextNoteTime, noteLen, notePeak(theme), theme.wave);
    nextNoteTime += beatSec;
    stepIndex += 1;
  }
}

function applyDuck(): void {
  if (!masterGain) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(t);
  masterGain.gain.setValueAtTime(masterGain.gain.value, t);
  masterGain.gain.linearRampToValueAtTime(duckTarget, t + 0.12);
}

function ensureTtsDuck(): void {
  if (ttsUnsub) return;
  ttsUnsub = subscribeTtsState((snap) => {
    duckTarget = snap.state === 'generating' ? DUCK_GAIN : NORMAL_GAIN;
    applyDuck();
  });
}

function teardownNodes(): void {
  if (schedulerId !== null) {
    clearInterval(schedulerId);
    schedulerId = null;
  }
  if (masterGain) {
    try {
      masterGain.disconnect();
    } catch {
      /* ignore */
    }
    masterGain = null;
  }
  if (filterNode) {
    try {
      filterNode.disconnect();
    } catch {
      /* ignore */
    }
    filterNode = null;
  }
  stepIndex = 0;
  nextNoteTime = 0;
  duckTarget = NORMAL_GAIN;
}

function fadeOutAndStop(): void {
  if (stopping) return;
  stopping = true;
  const ctx = getAudioContext();
  if (!masterGain || !ctx) {
    teardownNodes();
    activeGameId = null;
    stopping = false;
    return;
  }
  const t = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(t);
  masterGain.gain.setValueAtTime(masterGain.gain.value, t);
  masterGain.gain.linearRampToValueAtTime(0.0001, t + FADE_MS / 1000);
  window.setTimeout(() => {
    teardownNodes();
    activeGameId = null;
    stopping = false;
  }, FADE_MS + 40);
}

/** Resume audio context — safe to call from user-gesture handlers. */
export function resumeBgm(): void {
  resumeAudioContext();
}

/** Start looping ambient BGM for a game (no-op if music disabled or same track). */
export function startBgm(gameId: string): void {
  if (!loadSettings().musicEnabled) return;
  if (!(gameId in THEMES)) return;
  const id = gameId as BgmGameId;
  if (activeGameId === id && schedulerId !== null) {
    resumeBgm();
    return;
  }

  stopBgm(0);
  stopping = false;
  resumeBgm();

  const ctx = getAudioContext(true);
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const theme = THEMES[id];
  filterNode = ctx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.value = theme.filterHz;
  filterNode.Q.value = 0.6;

  masterGain = ctx.createGain();
  masterGain.gain.value = 0.0001;
  filterNode.connect(masterGain);
  masterGain.connect(ctx.destination);

  const t = ctx.currentTime;
  masterGain.gain.linearRampToValueAtTime(theme.level, t + FADE_MS / 1000);

  activeGameId = id;
  stepIndex = 0;
  nextNoteTime = ctx.currentTime + 0.05;
  ensureTtsDuck();

  schedulerId = setInterval(() => {
    if (!loadSettings().musicEnabled) {
      stopBgm();
      return;
    }
    const liveCtx = getAudioContext();
    if (!liveCtx || liveCtx.state !== 'running' || !filterNode) return;
    scheduleNotes(liveCtx, theme);
  }, 120);
}

/** Fade out and stop BGM. Pass `fadeMs = 0` for immediate stop. */
export function stopBgm(fadeMs = FADE_MS): void {
  if (fadeMs <= 0) {
    stopping = false;
    teardownNodes();
    activeGameId = null;
    return;
  }
  fadeOutAndStop();
}

/** Stop duck subscription when app unloads (optional cleanup). */
export function disposeBgmService(): void {
  stopBgm(0);
  ttsUnsub?.();
  ttsUnsub = null;
}
