/** Kiểm tra điểm (x,y) có nằm trong vùng thả (có thể mở rộng padding). */
export function hitRect(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  padding = 16
): boolean {
  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

/** Gắn kéo-thả: pointerup trên phần tử kéo → gọi onDrop nếu thả vào target. */
export function bindPointerDrop(
  dragEl: HTMLElement,
  dropEl: HTMLElement,
  onDrop: () => void,
  options?: { padding?: number; onDragStart?: () => void; onDragEnd?: () => void }
): void {
  const padding = options?.padding ?? 16;

  dragEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dragEl.setPointerCapture(e.pointerId);
    options?.onDragStart?.();
  });

  const end = (e: PointerEvent) => {
    if (dragEl.hasPointerCapture(e.pointerId)) {
      dragEl.releasePointerCapture(e.pointerId);
    }
    options?.onDragEnd?.();
    const rect = dropEl.getBoundingClientRect();
    if (hitRect(e.clientX, e.clientY, rect, padding)) {
      onDrop();
    }
  };

  dragEl.addEventListener('pointerup', end);
  dragEl.addEventListener('pointercancel', end);
}
