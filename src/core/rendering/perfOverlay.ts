/**
 * Overlay đo hiệu năng + chọn tầng chất lượng (công cụ dev/QA).
 *
 * - Bật/tắt: Ctrl+Shift+P, hoặc mở trang với ?perf=1.
 * - Hiển thị: FPS tức thời, FPS trung bình, tầng chất lượng hiện tại.
 * - Nút Low/Mid/High/Auto: đổi tầng (lưu localStorage) rồi tải lại để áp cho mọi game.
 *
 * Dùng để so sánh trước–sau khi tối ưu trên máy thật (Giai đoạn 4 của kế hoạch).
 */
import { detectQualityTier, setQualityTier, type QualityTier } from './qualityTier';

const TIERS: Array<QualityTier | 'auto'> = ['auto', 'low', 'mid', 'high'];

export class PerfOverlay {
  private readonly el: HTMLDivElement;
  private readonly fpsEl: HTMLSpanElement;
  private readonly avgEl: HTMLSpanElement;
  private rafId = 0;
  private frames = 0;
  private lastSample = 0;
  private fpsHistory: number[] = [];
  private visible = false;

  constructor() {
    this.el = document.createElement('div');
    this.el.setAttribute('aria-hidden', 'true');
    Object.assign(this.el.style, {
      position: 'fixed',
      top: '8px',
      right: '8px',
      zIndex: '99999',
      font: '12px/1.4 ui-monospace, Menlo, Consolas, monospace',
      background: 'rgba(15,23,42,0.86)',
      color: '#e2e8f0',
      padding: '8px 10px',
      borderRadius: '8px',
      pointerEvents: 'auto',
      userSelect: 'none',
      display: 'none',
      minWidth: '150px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
    } as Partial<CSSStyleDeclaration>);

    const tier = detectQualityTier();
    this.el.innerHTML = `
      <div style="font-weight:700;margin-bottom:4px">⚡ Perf · tầng: <b style="color:#fbbf24">${tier}</b></div>
      <div>FPS: <span data-fps style="color:#4ade80">–</span> · TB: <span data-avg style="color:#93c5fd">–</span></div>
      <div data-buttons style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap"></div>
      <div style="margin-top:5px;color:#94a3b8;font-size:11px">Ctrl+Shift+P để ẩn</div>
    `;
    document.body.appendChild(this.el);

    this.fpsEl = this.el.querySelector<HTMLSpanElement>('[data-fps]')!;
    this.avgEl = this.el.querySelector<HTMLSpanElement>('[data-avg]')!;

    const btnWrap = this.el.querySelector<HTMLDivElement>('[data-buttons]')!;
    for (const t of TIERS) {
      const btn = document.createElement('button');
      btn.textContent = t;
      Object.assign(btn.style, {
        cursor: 'pointer',
        border: '1px solid #475569',
        background: '#1e293b',
        color: '#e2e8f0',
        borderRadius: '5px',
        padding: '3px 7px',
        fontSize: '11px',
      } as Partial<CSSStyleDeclaration>);
      btn.addEventListener('click', () => this.applyTier(t));
      btnWrap.appendChild(btn);
    }

    document.addEventListener('keydown', this.onKey);
    if (new URLSearchParams(location.search).has('perf')) this.show();
  }

  private applyTier(t: QualityTier | 'auto'): void {
    setQualityTier(t === 'auto' ? null : t);
    // Tải lại để renderer mọi game được tạo lại theo tầng mới; giữ overlay bằng ?perf=1.
    const url = new URL(location.href);
    url.searchParams.set('perf', '1');
    location.href = url.toString();
  }

  private onKey = (e: KeyboardEvent): void => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
      e.preventDefault();
      this.toggle();
    }
  };

  toggle(): void {
    if (this.visible) this.hide();
    else this.show();
  }

  show(): void {
    if (this.visible) return;
    this.visible = true;
    this.el.style.display = 'block';
    this.lastSample = performance.now();
    this.frames = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  hide(): void {
    this.visible = false;
    this.el.style.display = 'none';
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private tick = (now: number): void => {
    this.frames++;
    const dt = now - this.lastSample;
    if (dt >= 500) {
      const fps = Math.round((this.frames * 1000) / dt);
      this.fpsEl.textContent = String(fps);
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > 20) this.fpsHistory.shift();
      const avg = Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length);
      this.avgEl.textContent = String(avg);
      this.frames = 0;
      this.lastSample = now;
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    this.hide();
    document.removeEventListener('keydown', this.onKey);
    this.el.remove();
  }
}

/** Khởi tạo overlay một lần (an toàn gọi nhiều lần). */
let instance: PerfOverlay | null = null;
export function initPerfOverlay(): PerfOverlay {
  if (!instance) instance = new PerfOverlay();
  return instance;
}
