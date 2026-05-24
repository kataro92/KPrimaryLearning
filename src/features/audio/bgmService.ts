import { loadSettings } from '@/data/storage/settingsStore';
import { subscribeTtsState } from '@/features/speech/speechService';
import { resumeAudioContext } from './audioContext';

export type BgmGameId =
  | 'trang-nguyen-toan'
  | 'tu-vung-hoi-an'
  | 'trong-dong'
  | 'hinh-hoc-thang-long'
  | 'doc-hieu-su-viet'
  | 'cuu-chuong-van-mieu'
  | 'tham-hiem-cuu-long'
  | 'tinh-nham-trang-ti';

interface BgmTrack {
  file: string;
  title: string;
  volume: number;
}

const BGM_BASE = `${import.meta.env.BASE_URL}audio/bgm/`;

const TRACKS: Record<BgmGameId, BgmTrack> = {
  'trang-nguyen-toan': {
    file: 'trang-nguyen-toan.ogg',
    title: 'Mech Street Fighters',
    volume: 0.32,
  },
  'tu-vung-hoi-an': {
    file: 'tu-vung-hoi-an.ogg',
    title: 'Bustling Village',
    volume: 0.3,
  },
  'trong-dong': {
    file: 'trong-dong.ogg',
    title: 'Of Knights and Kings',
    volume: 0.3,
  },
  'hinh-hoc-thang-long': {
    file: 'hinh-hoc-thang-long.ogg',
    title: 'Fantasy Game Background',
    volume: 0.28,
  },
  'doc-hieu-su-viet': {
    file: 'doc-hieu-su-viet.ogg',
    title: 'Dreaming in Puzzles',
    volume: 0.28,
  },
  'cuu-chuong-van-mieu': {
    file: 'cuu-chuong-van-mieu.ogg',
    title: "Spells-a-Brewin'",
    volume: 0.28,
  },
  'tham-hiem-cuu-long': {
    file: 'tham-hiem-cuu-long.ogg',
    title: 'Urban Assault',
    volume: 0.34,
  },
  'tinh-nham-trang-ti': {
    file: 'tinh-nham-trang-ti.ogg',
    title: 'Coin-Op Chaos',
    volume: 0.32,
  },
};

const NORMAL_GAIN = 1;
const DUCK_GAIN = 0.35;
const FADE_MS = 480;

let activeGameId: BgmGameId | null = null;
let audio: HTMLAudioElement | null = null;
let baseVolume = 0.3;
let fadeTimer: ReturnType<typeof setInterval> | null = null;
let stopping = false;
let ttsUnsub: (() => void) | null = null;
let duckTarget = NORMAL_GAIN;

function effectiveVolume(): number {
  return baseVolume * duckTarget;
}

function clearFadeTimer(): void {
  if (fadeTimer !== null) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
}

function fadeTo(target: number, durationMs: number, onDone?: () => void): void {
  clearFadeTimer();
  if (!audio) {
    onDone?.();
    return;
  }
  const startVol = audio.volume;
  const start = performance.now();
  fadeTimer = setInterval(() => {
    if (!audio) {
      clearFadeTimer();
      onDone?.();
      return;
    }
    const t = Math.min(1, (performance.now() - start) / durationMs);
    audio.volume = startVol + (target - startVol) * t;
    if (t >= 1) {
      clearFadeTimer();
      onDone?.();
    }
  }, 16);
}

function teardownAudio(): void {
  clearFadeTimer();
  if (audio) {
    audio.pause();
    audio.src = '';
    audio = null;
  }
  activeGameId = null;
  duckTarget = NORMAL_GAIN;
  stopping = false;
}

function applyDuck(): void {
  if (!audio) return;
  fadeTo(effectiveVolume(), 120);
}

function ensureTtsDuck(): void {
  if (ttsUnsub) return;
  ttsUnsub = subscribeTtsState((snap) => {
    duckTarget = snap.state === 'generating' ? DUCK_GAIN : NORMAL_GAIN;
    applyDuck();
  });
}

/** Resume audio context — safe to call from user-gesture handlers. */
export function resumeBgm(): void {
  resumeAudioContext();
  if (!audio || !loadSettings().musicEnabled) return;
  if (audio.paused) {
    void audio.play().then(() => {
      if (audio && audio.volume < effectiveVolume() * 0.5) {
        fadeTo(effectiveVolume(), FADE_MS);
      }
    }).catch(() => {
      /* autoplay blocked until gesture */
    });
  }
}

/** Start looping ambient BGM for a game (no-op if music disabled or same track). */
export function startBgm(gameId: string): void {
  if (!loadSettings().musicEnabled) return;
  if (!(gameId in TRACKS)) return;
  const id = gameId as BgmGameId;
  if (activeGameId === id && audio) {
    resumeBgm();
    return;
  }

  stopBgm(0);
  stopping = false;
  resumeBgm();

  const track = TRACKS[id];
  baseVolume = track.volume;
  const el = new Audio(`${BGM_BASE}${track.file}`);
  el.loop = true;
  el.preload = 'auto';
  el.volume = 0.0001;
  audio = el;
  activeGameId = id;
  ensureTtsDuck();

  void el.play().then(() => {
    fadeTo(effectiveVolume(), FADE_MS);
  }).catch(() => {
    /* autoplay blocked until gesture; resumeBgm will retry */
  });
}

/** Fade out and stop BGM. Pass `fadeMs = 0` for immediate stop. */
export function stopBgm(fadeMs = FADE_MS): void {
  if (fadeMs <= 0) {
    stopping = false;
    teardownAudio();
    return;
  }
  if (stopping || !audio) return;
  stopping = true;
  fadeTo(0, fadeMs, () => {
    teardownAudio();
  });
}

/** Stop duck subscription when app unloads (optional cleanup). */
export function disposeBgmService(): void {
  stopBgm(0);
  ttsUnsub?.();
  ttsUnsub = null;
}
