/** Câu điền âm/vần — mỗi câu có phần trước/sau chỗ trống và đáp án đúng */
export interface SpellingChallenge {
  before: string;
  after: string;
  answer: string;
  distractors: string[];
  hint?: string;
}
