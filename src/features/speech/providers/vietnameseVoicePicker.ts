import type { TtsVoicePreset } from '@/data/types';

/** Gợi ý tên giọng theo preset (Chrome / Edge / Safari / Windows). */
const PRESET_HINTS: Record<TtsVoicePreset, RegExp[]> = {
  female: [/female|femme|woman|girl|nữ|nu\b|linh|mai|my\b|hoai|google.*vi/i],
  male: [/male|homme|man\b|boy|nam\b|daniel|david|minh|hung|google.*vi.*male/i],
  cartoon: [/child|kid|junior|fun|comic|cartoon|hoathinh|bé|nhí|zira|samantha/i],
};

const ANTI_HINTS: Record<TtsVoicePreset, RegExp[]> = {
  female: [/male|nam\b|man\b|boy|daniel|david/i],
  male: [/female|nữ|woman|girl|mai\b|linh/i],
  cartoon: [/male|nam\b|daniel/i],
};

export function listVietnameseVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('vi'));
}

/** Có thể chọn preset nam / hoạt hình (≥2 giọng vi trên máy). */
export function hasMultipleVietnameseWebSpeechVoices(): boolean {
  return listVietnameseVoices().length > 1;
}

function voiceBlob(voice: SpeechSynthesisVoice): string {
  return `${voice.name} ${voice.voiceURI}`.toLowerCase();
}

function scoreVoice(voice: SpeechSynthesisVoice, preset: TtsVoicePreset): number {
  const blob = voiceBlob(voice);
  let score = 0;
  for (const re of PRESET_HINTS[preset]) {
    if (re.test(blob)) score += 10;
  }
  for (const re of ANTI_HINTS[preset]) {
    if (re.test(blob)) score -= 12;
  }
  if (voice.default && preset === 'female') score += 2;
  if (voice.localService) score += 1;
  return score;
}

export function pickVietnameseVoiceForPreset(preset: TtsVoicePreset): SpeechSynthesisVoice | null {
  const voices = listVietnameseVoices();
  if (!voices.length) return null;

  let best = voices[0]!;
  let bestScore = -Infinity;
  for (const v of voices) {
    const s = scoreVoice(v, preset);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return best;
}

/** Có giọng hệ thống khác giọng nữ mặc định → đủ để đọc bằng Web Speech thay vì chỉnh âm. */
export function hasDistinctWebSpeechVoiceForPreset(preset: TtsVoicePreset): boolean {
  if (preset === 'female') return false;
  const female = pickVietnameseVoiceForPreset('female');
  const picked = pickVietnameseVoiceForPreset(preset);
  if (!female || !picked) return false;
  if (female.voiceURI === picked.voiceURI) return false;
  return scoreVoice(picked, preset) >= 8;
}

export function shouldPreferWebSpeechForPreset(preset: TtsVoicePreset): boolean {
  return hasDistinctWebSpeechVoiceForPreset(preset);
}

export function formatVoiceLabel(voice: SpeechSynthesisVoice | null): string {
  if (!voice) return '';
  const short = voice.name.replace(/\s+/g, ' ').trim();
  return short.length > 48 ? `${short.slice(0, 45)}…` : short;
}

/** Đợi trình duyệt nạp danh sách giọng (Safari / Chrome lần đầu). */
export function ensureSpeechVoicesLoaded(timeoutMs = 800): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve();
  }
  if (listVietnameseVoices().length > 0) return Promise.resolve();

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve();
    };
    window.speechSynthesis.onvoiceschanged = finish;
    window.speechSynthesis.getVoices();
    setTimeout(finish, timeoutMs);
  });
}
