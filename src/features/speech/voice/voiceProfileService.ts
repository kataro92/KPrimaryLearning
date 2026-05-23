import {
  deleteVoiceProfile,
  isOpfsAvailable,
  loadVoiceMeta,
  loadVoicePcm,
  saveVoicePcm,
} from './opfsVoiceStore';
import { normalizeVoiceFile, pcmToWavBlob } from './audioNormalize';
import type { VoiceProfileMeta } from './voiceProfileTypes';
import {
  VOICE_SAMPLE_MAX_SEC,
  VOICE_SAMPLE_MIN_SEC,
  VOICE_TARGET_SAMPLE_RATE,
} from './voiceProfileTypes';

export type VoiceProfileStatus =
  | { state: 'none' }
  | { state: 'ready'; meta: VoiceProfileMeta }
  | { state: 'unsupported'; reason: string };

export async function getVoiceProfileStatus(profileId: string): Promise<VoiceProfileStatus> {
  if (!isOpfsAvailable()) {
    return { state: 'unsupported', reason: 'Trình duyệt chưa hỗ trợ lưu giọng local (OPFS).' };
  }
  const meta = await loadVoiceMeta(profileId);
  const pcm = await loadVoicePcm(profileId);
  if (!meta || !pcm) return { state: 'none' };
  return { state: 'ready', meta };
}

export async function importVoiceSampleFile(
  profileId: string,
  file: File
): Promise<VoiceProfileMeta> {
  if (!isOpfsAvailable()) {
    throw new Error('OPFS_UNAVAILABLE');
  }

  const normalized = await normalizeVoiceFile(file);
  if (normalized.durationSec < VOICE_SAMPLE_MIN_SEC) {
    throw new Error(`VOICE_TOO_SHORT:${normalized.durationSec.toFixed(1)}`);
  }
  if (normalized.durationSec > VOICE_SAMPLE_MAX_SEC) {
    throw new Error(`VOICE_TOO_LONG:${normalized.durationSec.toFixed(1)}`);
  }

  const meta: VoiceProfileMeta = {
    profileId,
    durationSec: normalized.durationSec,
    sampleRate: normalized.sampleRate,
    sampleCount: normalized.samples.length,
    createdAt: Date.now(),
  };

  await saveVoicePcm(profileId, normalized.samples, meta);
  return meta;
}

export async function removeVoiceProfile(profileId: string): Promise<void> {
  await deleteVoiceProfile(profileId);
}

export async function createReferencePreviewUrl(profileId: string): Promise<string | null> {
  const pcm = await loadVoicePcm(profileId);
  const meta = await loadVoiceMeta(profileId);
  if (!pcm || !meta) return null;
  const blob = pcmToWavBlob(pcm, meta.sampleRate || VOICE_TARGET_SAMPLE_RATE);
  return URL.createObjectURL(blob);
}
