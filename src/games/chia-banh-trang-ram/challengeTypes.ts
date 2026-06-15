/** Câu trắc nghiệm phân số — SGK Toán 4 Cánh Diều */
import type { FractionVisualSpec } from './fractionVisual';

export interface FractionMcqChallenge {
  prompt: string;
  choices: string[];
  correctIndex: number;
  sgkRef: string;
  /** Hình tô phần (tùy chọn) */
  visual?: FractionVisualSpec;
}
