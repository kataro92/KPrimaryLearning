import { loadSettings } from '@/data/storage/settingsStore';
import { normalizeTtsVoicePreset } from '@/features/speech/ttsVoicePreset';
import {
  ensureSpeechVoicesLoaded,
  listVietnameseVoices,
  pickVietnameseVoiceForPreset,
} from './vietnameseVoicePicker';

export function isWebSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function hasVietnameseWebSpeechVoice(): boolean {
  return listVietnameseVoices().length > 0;
}

export function cancelWebSpeech(): void {
  if (!isWebSpeechAvailable()) return;
  window.speechSynthesis.cancel();
}

export function speakWebSpeech(text: string, rate = 1): void {
  if (!isWebSpeechAvailable()) return;
  window.speechSynthesis.cancel();
  const preset = normalizeTtsVoicePreset(loadSettings().ttsVoicePreset);
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  utter.rate = rate;
  utter.pitch = 1;
  const voice = pickVietnameseVoiceForPreset(preset);
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

if (typeof window !== 'undefined' && isWebSpeechAvailable()) {
  void ensureSpeechVoicesLoaded();
  window.speechSynthesis.getVoices();
}
