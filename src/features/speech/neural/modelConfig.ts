import { appEnv } from '@/config/env';

/** Hugging Face ONNX model — Vietnamese MMS-TTS (Transformers.js). */
export const TTS_MODEL_ID = appEnv.ttsModelId;

/** Master switch for local neural TTS in worker. */
export const NEURAL_TTS_ENABLED = appEnv.neuralTtsEnabled;

/** Gameplay-safe limit; longer text uses Web Speech fallback on main thread. */
export const MAX_NEURAL_TEXT_LENGTH = 280;
