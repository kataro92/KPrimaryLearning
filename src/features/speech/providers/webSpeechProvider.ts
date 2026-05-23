function resolveVietnameseVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.startsWith('vi')) ?? null;
}

export function isWebSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function hasVietnameseWebSpeechVoice(): boolean {
  return Boolean(resolveVietnameseVoice());
}

export function cancelWebSpeech(): void {
  if (!isWebSpeechAvailable()) return;
  window.speechSynthesis.cancel();
}

export function speakWebSpeech(text: string, rate = 1): void {
  if (!isWebSpeechAvailable()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  utter.rate = rate;
  const vi = resolveVietnameseVoice();
  if (vi) utter.voice = vi;
  window.speechSynthesis.speak(utter);
}

if (typeof window !== 'undefined' && isWebSpeechAvailable()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
