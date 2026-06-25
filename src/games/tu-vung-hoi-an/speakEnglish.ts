import { loadSettings } from '@/data/storage/settingsStore';

/** Phát âm từ tiếng Anh qua Web Speech (en-US), tôn trọng cài đặt âm thanh. */
function isAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isAvailable()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => /^en[-_]US/i.test(v.lang)) ??
    voices.find((v) => /^en[-_]GB/i.test(v.lang)) ??
    voices.find((v) => /^en/i.test(v.lang)) ??
    null
  );
}

/** Nạp sẵn danh sách giọng (một số trình duyệt trả rỗng ở lần gọi đầu). */
export function warmEnglishVoices(): void {
  if (!isAvailable()) return;
  window.speechSynthesis.getVoices();
}

export function speakEnglish(text: string, rate = 0.92): void {
  if (!isAvailable() || !loadSettings().soundEnabled || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = rate;
  utter.pitch = 1;
  const voice = pickEnglishVoice();
  if (voice) utter.voice = voice;
  synth.speak(utter);
}

export function cancelEnglish(): void {
  if (isAvailable()) window.speechSynthesis.cancel();
}
