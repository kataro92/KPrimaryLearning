import { ANSWER_FEEDBACK_MS } from './roundTiming';

export { ANSWER_FEEDBACK_MS };

export const WAIT_NEXT_HINT = 'Đã trả lời, chờ câu tiếp theo…';

/** Chờ phản hồi / hoạt hoạ rồi sang câu tiếp hoặc kết thúc phiên */
export function scheduleAfterAnswer(
  isLast: boolean,
  onNext: () => void,
  onDone: () => void | Promise<void>
): void {
  setTimeout(() => {
    if (isLast) void Promise.resolve(onDone());
    else onNext();
  }, ANSWER_FEEDBACK_MS);
}

export function setRoundHint(root: ParentNode, selector: string, text: string): void {
  const el = root.querySelector<HTMLElement>(selector);
  if (el) el.textContent = text;
}

/** Khóa nhóm nút lựa chọn và thêm class trang trí */
export function lockChoiceRow(
  root: ParentNode,
  opts: {
    rowSelector: string;
    buttonSelector: string;
    rowLockedClass?: string;
    onEach?: (btn: HTMLButtonElement, index: number) => void;
  }
): void {
  root.querySelector(opts.rowSelector)?.classList.add(opts.rowLockedClass ?? 'round-choices--locked');
  root.querySelectorAll<HTMLButtonElement>(opts.buttonSelector).forEach((btn, i) => {
    btn.disabled = true;
    opts.onEach?.(btn, i);
  });
}
