/** Biến môi trường Vite (client-safe, prefix VITE_). */
function readBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value !== 'false' && value !== '0';
}

export const appEnv = {
  basePath: import.meta.env.BASE_URL,
  neuralTtsEnabled: readBool(import.meta.env.VITE_NEURAL_TTS_ENABLED, true),
  ttsModelId: import.meta.env.VITE_TTS_MODEL_ID || 'Xenova/mms-tts-vie',
} as const;
