import { loadSettings } from '@/data/storage/settingsStore';

export type SpeechProvider = 'webspeech';
export type SpeechBackend = 'webgpu' | 'wasm' | 'webspeech-only' | 'unavailable';

export interface SpeechRuntimeStatus {
  provider: SpeechProvider;
  backend: SpeechBackend;
  canSpeak: boolean;
  hasVietnameseVoice: boolean;
}

function detectSpeechBackend(): SpeechBackend {
  if (typeof window === 'undefined') return 'unavailable';
  if ('gpu' in navigator) return 'webgpu';
  if (typeof WebAssembly === 'object') return 'wasm';
  return 'webspeech-only';
}

function resolveVietnameseVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.startsWith('vi')) ?? null;
}

export function getSpeechRuntimeStatus(): SpeechRuntimeStatus {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return {
      provider: 'webspeech',
      backend: 'unavailable',
      canSpeak: false,
      hasVietnameseVoice: false,
    };
  }

  const vi = resolveVietnameseVoice();
  return {
    provider: 'webspeech',
    backend: detectSpeechBackend(),
    canSpeak: true,
    hasVietnameseVoice: Boolean(vi),
  };
}

export function speakVietnamese(text: string, rate = 1): void {
  const settings = loadSettings();
  if (!settings.soundEnabled || !('speechSynthesis' in window)) return;
  if (settings.ttsMode === 'webspeech' || settings.ttsMode === 'auto') {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';
    utter.rate = rate;

    const vi = resolveVietnameseVoice();
    if (vi) utter.voice = vi;
    window.speechSynthesis.speak(utter);
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
