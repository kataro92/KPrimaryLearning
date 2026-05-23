/// <reference lib="webworker" />
import { disposeNeuralTts, isNeuralTtsEnabled, loadNeuralTts, synthesizeNeural } from './neural/neuralTtsEngine';
import type { TtsWorkerCommand, TtsWorkerEvent, TtsRuntimeState } from './types';

let runtimeState: TtsRuntimeState = 'idle';
let activeSynthesizeId: number | null = null;
const cancelledIds = new Set<number>();

function post(event: TtsWorkerEvent, transfer?: Transferable[]): void {
  if (transfer?.length) {
    self.postMessage(event, transfer);
  } else {
    self.postMessage(event);
  }
}

function setState(state: TtsRuntimeState, progress?: number, detail?: string): void {
  runtimeState = state;
  post({ type: 'state', state, progress, detail });
}

function isCancelled(requestId: number): boolean {
  return cancelledIds.has(requestId);
}

async function runInit(requestId: number): Promise<void> {
  if (isCancelled(requestId)) return;

  if (!isNeuralTtsEnabled()) {
    setState('warming-up', 0, 'neural-disabled');
    await delay(80);
    if (isCancelled(requestId)) return;
    setState('ready', 100, 'fallback-only');
    return;
  }

  try {
    setState('downloading-model', 0, 'mms-load');
    await loadNeuralTts((progress, detail) => {
      if (isCancelled(requestId)) return;
      const state: TtsRuntimeState =
        progress >= 100 ? 'warming-up' : 'downloading-model';
      setState(state, progress, detail);
    });

    if (isCancelled(requestId)) return;
    setState('ready', 100, 'mms-ready');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Neural TTS init failed';
    post({ type: 'error', code: 'INIT_FAILED', message });
    setState('error', 0, message);
  }
}

async function runSynthesize(requestId: number, text: string): Promise<void> {
  if (isCancelled(requestId)) {
    post({ type: 'synthesize-done', requestId, ok: false, errorCode: 'CANCELLED' });
    return;
  }

  activeSynthesizeId = requestId;
  setState('generating');

  if (!isNeuralTtsEnabled() || runtimeState !== 'ready') {
    post({
      type: 'synthesize-done',
      requestId,
      ok: false,
      errorCode: 'MODEL_NOT_LOADED',
    });
    setState(runtimeState === 'error' ? 'error' : 'ready', 100);
    activeSynthesizeId = null;
    return;
  }

  try {
    const wavBuffer = await synthesizeNeural(text);
    if (isCancelled(requestId)) {
      post({ type: 'synthesize-done', requestId, ok: false, errorCode: 'CANCELLED' });
      setState('ready', 100);
      activeSynthesizeId = null;
      return;
    }

    post({ type: 'synthesize-audio', requestId, wavBuffer }, [wavBuffer]);
    setState('ready', 100);
    activeSynthesizeId = null;
  } catch (err) {
    if (isCancelled(requestId)) {
      post({ type: 'synthesize-done', requestId, ok: false, errorCode: 'CANCELLED' });
    } else {
      const message = err instanceof Error ? err.message : 'Synthesis failed';
      post({ type: 'error', code: 'SYNTHESIS_FAILED', message });
      post({
        type: 'synthesize-done',
        requestId,
        ok: false,
        errorCode: 'WORKER_ERROR',
      });
    }
    setState('ready', 100);
    activeSynthesizeId = null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

self.onmessage = (event: MessageEvent<TtsWorkerCommand>) => {
  const cmd = event.data;
  switch (cmd.type) {
    case 'init':
      cancelledIds.delete(cmd.requestId);
      void runInit(cmd.requestId);
      break;
    case 'synthesize':
      void runSynthesize(cmd.requestId, cmd.text);
      break;
    case 'cancel':
      if (cmd.requestId != null) {
        cancelledIds.add(cmd.requestId);
      } else if (activeSynthesizeId != null) {
        cancelledIds.add(activeSynthesizeId);
      }
      if (runtimeState === 'generating') {
        setState('ready', 100);
      }
      activeSynthesizeId = null;
      break;
    case 'dispose':
      cancelledIds.clear();
      activeSynthesizeId = null;
      runtimeState = 'idle';
      void disposeNeuralTts().finally(() => setState('idle'));
      break;
    default:
      break;
  }
};
