import { pipeline, type ProgressInfo } from '@huggingface/transformers';
import { configureNeuralEnv } from './configureTransformers';
import { MAX_NEURAL_TEXT_LENGTH, NEURAL_TTS_ENABLED, TTS_MODEL_ID } from './modelConfig';

export type NeuralProgressCallback = (progress: number, detail?: string) => void;

type MmsPipeline = Awaited<ReturnType<typeof pipeline<'text-to-speech'>>>;

let mmsPipeline: MmsPipeline | null = null;
let loadPromise: Promise<void> | null = null;

function pickDevice(): 'webgpu' | 'wasm' {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) return 'webgpu';
  return 'wasm';
}

function mapProgress(info: ProgressInfo): { progress: number; detail: string } | null {
  if (info.status === 'progress') {
    return { progress: Math.round(info.progress), detail: info.file };
  }
  if (info.status === 'progress_total') {
    return { progress: Math.round(info.progress), detail: 'total' };
  }
  if (info.status === 'ready') {
    return { progress: 100, detail: `ready:${info.model}` };
  }
  if (info.status === 'done') {
    return { progress: 100, detail: info.file };
  }
  return null;
}

export function isNeuralTtsEnabled(): boolean {
  return NEURAL_TTS_ENABLED;
}

export function isNeuralTtsReady(): boolean {
  return Boolean(mmsPipeline);
}

export async function loadNeuralTts(onProgress: NeuralProgressCallback): Promise<void> {
  if (!NEURAL_TTS_ENABLED) throw new Error('Neural TTS disabled');
  if (mmsPipeline) return;
  if (loadPromise) {
    await loadPromise;
    return;
  }

  configureNeuralEnv();
  const device = pickDevice();
  onProgress(0, `device:${device}`);

  loadPromise = (async () => {
    mmsPipeline = await pipeline('text-to-speech', TTS_MODEL_ID, {
      dtype: 'q8',
      device,
      progress_callback: (info) => {
        const mapped = mapProgress(info);
        if (mapped) onProgress(mapped.progress, mapped.detail);
      },
    });
    onProgress(100, 'mms-ready');
  })();

  try {
    await loadPromise;
  } catch (err) {
    mmsPipeline = null;
    loadPromise = null;
    throw err;
  }
}

function normalizeText(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= MAX_NEURAL_TEXT_LENGTH) return trimmed;
  return trimmed.slice(0, MAX_NEURAL_TEXT_LENGTH);
}

export async function synthesizeNeural(text: string): Promise<ArrayBuffer> {
  if (!mmsPipeline) throw new Error('MODEL_NOT_LOADED');
  const input = normalizeText(text);
  if (!input) throw new Error('EMPTY_TEXT');

  const output = await mmsPipeline(input);
  return output.toBlob().arrayBuffer();
}

export async function disposeNeuralTts(): Promise<void> {
  if (mmsPipeline) {
    try {
      await mmsPipeline.dispose();
    } catch {
      /* ignore */
    }
  }
  mmsPipeline = null;
  loadPromise = null;
}
