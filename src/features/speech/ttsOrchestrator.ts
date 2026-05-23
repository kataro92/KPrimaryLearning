import { loadSettings } from '@/data/storage/settingsStore';
import { stopBufferedAudio, playWavBuffer } from './audioPlayback';
import {
  cancelWebSpeech,
  hasVietnameseWebSpeechVoice,
  isWebSpeechAvailable,
  speakWebSpeech,
} from './providers/webSpeechProvider';
import { MAX_NEURAL_TEXT_LENGTH } from './neural/modelConfig';
import type {
  SpeechBackend,
  SpeechProvider,
  TtsRuntimeSnapshot,
  TtsRuntimeState,
  TtsWorkerEvent,
} from './types';

/** Neural ONNX inference can be slower on first run / WASM. */
const SYNTHESIZE_TIMEOUT_MS = 20000;
/** First model download from Hugging Face Hub. */
const INIT_TIMEOUT_MS = 180000;

type StateListener = (snapshot: TtsRuntimeSnapshot) => void;

function detectBackend(): SpeechBackend {
  if (typeof window === 'undefined') return 'unavailable';
  if ('gpu' in navigator) return 'webgpu';
  if (typeof WebAssembly === 'object') return 'wasm';
  return 'webspeech-only';
}

function supportsWorker(): boolean {
  return typeof Worker !== 'undefined';
}

class TtsOrchestrator {
  private worker: Worker | null = null;
  private initRequestId = 0;
  private speakRequestId = 0;
  private activeSpeakId = 0;
  private initPromise: Promise<void> | null = null;
  private synthesizeTimer: ReturnType<typeof setTimeout> | null = null;

  private state: TtsRuntimeState = 'idle';
  private progress = 0;
  private lastError: string | null = null;
  private lastProvider: SpeechProvider = 'webspeech';

  private readonly listeners = new Set<StateListener>();

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): TtsRuntimeSnapshot {
    const backend = detectBackend();
    const webOk = isWebSpeechAvailable();
    return {
      state: this.state,
      progress: this.progress,
      provider: this.lastProvider,
      backend,
      canSpeak: webOk || this.state === 'ready',
      hasVietnameseVoice: hasVietnameseWebSpeechVoice(),
      lastError: this.lastError,
    };
  }

  /** Warm worker + MMS model (non-blocking). */
  preload(): void {
    const settings = loadSettings();
    if (!settings.soundEnabled || settings.ttsMode === 'webspeech') return;
    void this.ensureInitialized();
  }

  cancel(): void {
    this.clearSynthesizeTimer();
    this.activeSpeakId += 1;
    cancelWebSpeech();
    stopBufferedAudio();
    this.postToWorker({ type: 'cancel' });
  }

  speak(text: string, rate = 1): void {
    const settings = loadSettings();
    if (!settings.soundEnabled || !text.trim()) return;

    this.cancel();
    const requestId = ++this.speakRequestId;
    this.activeSpeakId = requestId;

    if (settings.ttsMode === 'webspeech' || !supportsWorker()) {
      this.lastProvider = 'webspeech';
      this.notify();
      speakWebSpeech(text, rate);
      return;
    }

    void this.speakAuto(text, rate, requestId);
  }

  dispose(): void {
    this.cancel();
    if (this.worker) {
      this.postToWorker({ type: 'dispose' });
      this.worker.terminate();
      this.worker = null;
    }
    this.initPromise = null;
    this.setState('idle', 0);
  }

  private async speakAuto(text: string, rate: number, requestId: number): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_NEURAL_TEXT_LENGTH) {
      this.lastProvider = 'webspeech';
      this.notify();
      speakWebSpeech(text, rate);
      return;
    }

    await this.ensureInitialized();
    if (requestId !== this.activeSpeakId) return;

    if (this.state === 'ready') {
      const usedNeural = await this.tryNeuralSpeak(trimmed, requestId);
      if (usedNeural) return;
    }

    if (requestId !== this.activeSpeakId) return;
    this.lastProvider = 'webspeech';
    this.notify();
    speakWebSpeech(text, rate);
  }

  private async tryNeuralSpeak(text: string, requestId: number): Promise<boolean> {
    const worker = this.worker;
    if (!worker) return false;

    return new Promise((resolve) => {
      let settled = false;

      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        this.clearSynthesizeTimer();
        worker.removeEventListener('message', onMessage);
        resolve(ok);
      };

      const onMessage = (event: MessageEvent<TtsWorkerEvent>) => {
        if (requestId !== this.activeSpeakId) {
          finish(false);
          return;
        }

        const msg = event.data;
        if (msg.type === 'synthesize-audio' && msg.requestId === requestId) {
          this.lastProvider = 'local-neural';
          this.notify();
          playWavBuffer(msg.wavBuffer);
          finish(true);
          return;
        }

        if (msg.type === 'synthesize-done' && msg.requestId === requestId) {
          finish(msg.ok);
        }
      };

      worker.addEventListener('message', onMessage);
      this.postToWorker({ type: 'synthesize', requestId, text });

      this.synthesizeTimer = setTimeout(() => {
        this.postToWorker({ type: 'cancel', requestId });
        finish(false);
      }, SYNTHESIZE_TIMEOUT_MS);
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (!supportsWorker()) return;
    if (this.state === 'ready') return;
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this.runInit();
    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private runInit(): Promise<void> {
    const worker = this.getOrCreateWorker();
    if (!worker) return Promise.resolve();

    const requestId = ++this.initRequestId;

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        worker.removeEventListener('message', onMessage);
        this.lastError = 'Init timeout';
        this.setState('error', 0);
        reject(new Error('TTS init timeout'));
      }, INIT_TIMEOUT_MS);

      const onMessage = (event: MessageEvent<TtsWorkerEvent>) => {
        const msg = event.data;
        if (msg.type === 'state') {
          this.setState(msg.state, msg.progress ?? this.progress);
          if (msg.state === 'ready') {
            clearTimeout(timeout);
            worker.removeEventListener('message', onMessage);
            this.lastError = null;
            resolve(undefined);
          }
          if (msg.state === 'error') {
            clearTimeout(timeout);
            worker.removeEventListener('message', onMessage);
            reject(new Error(msg.detail ?? 'TTS init failed'));
          }
        }
        if (msg.type === 'error') {
          clearTimeout(timeout);
          worker.removeEventListener('message', onMessage);
          this.lastError = msg.message;
          this.setState('error', 0);
          reject(new Error(msg.message));
        }
      };

      worker.addEventListener('message', onMessage);
      this.postToWorker({ type: 'init', requestId });
    }).catch((): void => {
      /* Fallback path uses Web Speech; init failure is non-fatal. */
    });
  }

  private getOrCreateWorker(): Worker | null {
    if (!supportsWorker()) return null;
    if (this.worker) return this.worker;

    try {
      this.worker = new Worker(new URL('./localTts.worker.ts', import.meta.url), {
        type: 'module',
      });
      this.worker.onmessage = (event: MessageEvent<TtsWorkerEvent>) => {
        this.handleWorkerEvent(event.data);
      };
      this.worker.onerror = () => {
        this.lastError = 'Worker crashed';
        this.setState('error', 0);
      };
      return this.worker;
    } catch {
      this.lastError = 'Worker unavailable';
      return null;
    }
  }

  private handleWorkerEvent(msg: TtsWorkerEvent): void {
    if (msg.type === 'state') {
      this.setState(msg.state, msg.progress ?? this.progress);
      return;
    }
    if (msg.type === 'error') {
      this.lastError = msg.message;
      this.setState('error', 0);
    }
  }

  private postToWorker(cmd: import('./types').TtsWorkerCommand): void {
    this.worker?.postMessage(cmd);
  }

  private setState(state: TtsRuntimeState, progress: number): void {
    this.state = state;
    this.progress = progress;
    this.notify();
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((l) => l(snapshot));
  }

  private clearSynthesizeTimer(): void {
    if (this.synthesizeTimer) {
      clearTimeout(this.synthesizeTimer);
      this.synthesizeTimer = null;
    }
  }
}

const orchestrator = new TtsOrchestrator();

export function getTtsOrchestrator(): TtsOrchestrator {
  return orchestrator;
}

export type { TtsRuntimeSnapshot, TtsRuntimeState, SpeechProvider, SpeechBackend };
