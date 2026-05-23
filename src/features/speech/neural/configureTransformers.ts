import { env } from '@huggingface/transformers';

export function configureNeuralEnv(): void {
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = 1;
  }
}
