import type { AppSettings } from '@/data/types';
import { loadSettings } from '@/data/storage/settingsStore';
import { shouldPreferWebSpeechForPreset } from '@/features/speech/providers/vietnameseVoicePicker';

export type TtsVoicePreset = 'female' | 'male' | 'cartoon';

export const TTS_VOICE_PRESETS: Record<
  TtsVoicePreset,
  { label: string; emoji: string; hint: string }
> = {
  female: {
    label: 'Giọng nữ',
    emoji: '👩',
    hint: 'Giọng AI tiếng Việt (mặc định)',
  },
  male: {
    label: 'Giọng nam',
    emoji: '👨',
    hint: 'Giọng máy tính nam (nếu trình duyệt có)',
  },
  cartoon: {
    label: 'Giọng hoạt hình',
    emoji: '🎭',
    hint: 'Giọng máy tính nhí/nhẹ (nếu có)',
  },
};

export function normalizeTtsVoicePreset(raw: unknown): TtsVoicePreset {
  if (raw === 'male' || raw === 'cartoon' || raw === 'female') return raw;
  return 'female';
}

export function getActiveTtsVoicePreset(settings?: AppSettings): TtsVoicePreset {
  const merged = settings ?? loadSettings();
  return normalizeTtsVoicePreset(merged.ttsVoicePreset);
}

/** Giữ nguyên tốc độ game — không biến âm giả. */
export function effectiveSpeechRate(baseRate = 1): number {
  return baseRate;
}

/** Nam / hoạt hình: ưu tiên giọng hệ thống thật khi khác giọng nữ. */
export function preferWebSpeechForCurrentPreset(settings?: AppSettings): boolean {
  const preset = getActiveTtsVoicePreset(settings);
  return shouldPreferWebSpeechForPreset(preset);
}
