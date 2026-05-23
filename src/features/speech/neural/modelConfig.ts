/** Hugging Face ONNX model — Vietnamese MMS-TTS (Transformers.js). */
export const TTS_MODEL_ID = 'Xenova/mms-tts-vie';

/** Master switch for local neural TTS in worker. */
export const NEURAL_TTS_ENABLED = true;

/** Gameplay-safe limit; longer text uses Web Speech fallback on main thread. */
export const MAX_NEURAL_TEXT_LENGTH = 280;
