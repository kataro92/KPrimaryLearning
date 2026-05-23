/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH: string;
  readonly VITE_DEV_PORT: string;
  readonly VITE_NEURAL_TTS_ENABLED: string;
  readonly VITE_TTS_MODEL_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
