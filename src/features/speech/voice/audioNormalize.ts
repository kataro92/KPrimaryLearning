import { VOICE_TARGET_SAMPLE_RATE } from './voiceProfileTypes';

export interface NormalizedVoiceAudio {
  samples: Float32Array;
  sampleRate: number;
  durationSec: number;
}

/** Decode user file → mono PCM at target rate (main thread, Web Audio API). */
export async function normalizeVoiceFile(file: File): Promise<NormalizedVoiceAudio> {
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new AudioContext();
  try {
    const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const samples = resampleToMono(decoded, VOICE_TARGET_SAMPLE_RATE);
    return {
      samples,
      sampleRate: VOICE_TARGET_SAMPLE_RATE,
      durationSec: samples.length / VOICE_TARGET_SAMPLE_RATE,
    };
  } finally {
    await ctx.close();
  }
}

function resampleToMono(buffer: AudioBuffer, targetRate: number): Float32Array {
  const channels = buffer.numberOfChannels;
  const srcRate = buffer.sampleRate;
  const srcLength = buffer.length;
  const mono = new Float32Array(srcLength);
  for (let c = 0; c < channels; c++) {
    const ch = buffer.getChannelData(c);
    for (let i = 0; i < srcLength; i++) mono[i] += ch[i] / channels;
  }

  if (srcRate === targetRate) return mono;

  const outLength = Math.max(1, Math.round((mono.length * targetRate) / srcRate));
  const out = new Float32Array(outLength);
  const ratio = srcRate / targetRate;
  for (let i = 0; i < outLength; i++) {
    const srcIdx = i * ratio;
    const i0 = Math.floor(srcIdx);
    const i1 = Math.min(i0 + 1, mono.length - 1);
    const t = srcIdx - i0;
    out[i] = mono[i0] * (1 - t) + mono[i1] * t;
  }
  return out;
}

export function pcmToWavBlob(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeStr(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(view, 8, 'WAVE');
  writeStr(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeStr(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
