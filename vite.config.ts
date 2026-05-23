import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/KPrimaryLearning/';
  const port = Number(env.VITE_DEV_PORT) || 5173;

  return {
    base,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port,
      strictPort: false,
    },
    optimizeDeps: {
      exclude: ['@huggingface/transformers'],
    },
    worker: {
      format: 'es',
    },
  };
});
