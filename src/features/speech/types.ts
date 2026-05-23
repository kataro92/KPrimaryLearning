/** Runtime state exposed to UI / diagnostics */
export type TtsRuntimeState =
  | 'idle'
  | 'downloading-model'
  | 'warming-up'
  | 'ready'
  | 'generating'
  | 'error';

export type SpeechBackend = 'webgpu' | 'wasm' | 'webspeech-only' | 'unavailable';
export type SpeechProvider = 'local-neural' | 'webspeech';

export type LocalTtsErrorCode =
  | 'MODEL_NOT_LOADED'
  | 'NOT_IMPLEMENTED'
  | 'CANCELLED'
  | 'WORKER_ERROR';

/** Main thread -> worker */
export type TtsWorkerCommand =
  | { type: 'init'; requestId: number }
  | { type: 'synthesize'; requestId: number; text: string }
  | { type: 'cancel'; requestId?: number }
  | { type: 'dispose' };

/** Worker -> main thread */
export type TtsWorkerEvent =
  | { type: 'state'; state: TtsRuntimeState; progress?: number; detail?: string }
  | {
      type: 'synthesize-done';
      requestId: number;
      ok: boolean;
      errorCode?: LocalTtsErrorCode;
    }
  | { type: 'synthesize-audio'; requestId: number; wavBuffer: ArrayBuffer }
  | { type: 'error'; code: string; message: string };

export interface TtsRuntimeSnapshot {
  state: TtsRuntimeState;
  progress: number;
  provider: SpeechProvider;
  backend: SpeechBackend;
  canSpeak: boolean;
  hasVietnameseVoice: boolean;
  lastError: string | null;
}
