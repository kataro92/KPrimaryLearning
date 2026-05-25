/** Câu điền âm/vần — trích từ SGK / bài chính tả lớp 4 (không tự ghép câu) */
export interface SpellingChallenge {
  before: string;
  after: string;
  answer: string;
  distractors: string[];
  hint?: string;
  /** Nguồn SGK: bài, tác giả, trang (nếu có) */
  sgkRef: string;
}
