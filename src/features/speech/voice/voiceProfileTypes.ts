/** Metadata for a locally stored reference voice sample (preview only, not TTS clone). */
export interface VoiceProfileMeta {
  profileId: string;
  durationSec: number;
  sampleRate: number;
  sampleCount: number;
  createdAt: number;
}

export const VOICE_SAMPLE_MIN_SEC = 8;
export const VOICE_SAMPLE_MAX_SEC = 25;
export const VOICE_TARGET_SAMPLE_RATE = 16000;
