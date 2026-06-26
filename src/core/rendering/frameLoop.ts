/**
 * Vòng lặp render dùng chung: giới hạn FPS + tự tạm dừng khi tab/cửa sổ ẩn.
 *
 * Mục tiêu tối ưu:
 * - Không vẽ vượt FPS mục tiêu (mặc định 60) — tránh lãng phí trên màn 120Hz.
 * - Tự `stop()` khi `document.hidden` (chuyển tab) và `start()` lại khi quay về — tiết kiệm pin/GPU.
 * - Bỏ qua đồng hồ trong lúc ẩn để khi quay lại không bị "nhảy hình" (delta quá lớn).
 *
 * Cách dùng trong một scene:
 *   this.frame = new FrameLoop((dtSeconds) => this.update(dtSeconds), 60);
 *   this.frame.start();
 *   // ... khi hủy:
 *   this.frame.dispose();
 */
export class FrameLoop {
  private rafId = 0;
  private lastTick = 0;
  private lastFrame = 0;
  private disposed = false;
  private readonly minInterval: number;

  /**
   * @param onFrame nhận delta giây đã được kẹp (clamp) để an toàn sau khi tab ẩn.
   * @param fps FPS mục tiêu (mặc định 60).
   * @param maxDelta delta tối đa mỗi khung (giây) để tránh nhảy hình, mặc định 0.05s.
   */
  constructor(
    private readonly onFrame: (deltaSeconds: number) => void,
    fps = 60,
    private readonly maxDelta = 0.05
  ) {
    this.minInterval = 1000 / fps;
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  start(): void {
    if (this.rafId || this.disposed || document.hidden) return;
    this.lastTick = performance.now();
    this.lastFrame = this.lastTick;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private onVisibility = (): void => {
    if (document.hidden) this.stop();
    else this.start();
  };

  private tick = (now: number): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.tick);
    if (now - this.lastFrame < this.minInterval) return;
    const delta = Math.min((now - this.lastTick) / 1000, this.maxDelta);
    this.lastTick = now;
    this.lastFrame = now;
    this.onFrame(delta);
  };
}
