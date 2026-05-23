import { getTtsOrchestrator } from './ttsOrchestrator';
import { NEURAL_TTS_ENABLED, TTS_MODEL_ID } from './neural/modelConfig';
import type { SpeechBackend, SpeechProvider, TtsRuntimeSnapshot } from './types';

export { TTS_MODEL_ID, NEURAL_TTS_ENABLED };

export type { SpeechBackend, SpeechProvider, TtsRuntimeSnapshot };
export type { TtsRuntimeState } from './types';

const orchestrator = getTtsOrchestrator();

/** @deprecated Prefer TtsRuntimeSnapshot — kept for existing call sites. */
export interface SpeechRuntimeStatus {
  provider: SpeechProvider;
  backend: SpeechBackend;
  canSpeak: boolean;
  hasVietnameseVoice: boolean;
  ttsState: TtsRuntimeSnapshot['state'];
}

export function getSpeechRuntimeStatus(): SpeechRuntimeStatus {
  const s = orchestrator.getSnapshot();
  return {
    provider: s.provider,
    backend: s.backend,
    canSpeak: s.canSpeak,
    hasVietnameseVoice: s.hasVietnameseVoice,
    ttsState: s.state,
  };
}

export function getTtsRuntimeSnapshot(): TtsRuntimeSnapshot {
  return orchestrator.getSnapshot();
}

export function subscribeTtsState(listener: (snapshot: TtsRuntimeSnapshot) => void): () => void {
  return orchestrator.subscribe(listener);
}

/** Warm local TTS worker in background (safe to call from Home). */
export function preloadLocalTts(): void {
  orchestrator.preload();
}

export function cancelSpeech(): void {
  orchestrator.cancel();
}

export function speakVietnamese(text: string, rate = 1): void {
  orchestrator.speak(text, rate);
}

export function disposeSpeech(): void {
  orchestrator.dispose();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => disposeSpeech());
}
