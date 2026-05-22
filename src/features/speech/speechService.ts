import { loadSettings } from '@/data/storage/settingsStore';

export function speakVietnamese(text: string, rate = 1): void {
  const settings = loadSettings();
  if (!settings.soundEnabled || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  utter.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const vi = voices.find((v) => v.lang.startsWith('vi'));
  if (vi) utter.voice = vi;

  window.speechSynthesis.speak(utter);
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
