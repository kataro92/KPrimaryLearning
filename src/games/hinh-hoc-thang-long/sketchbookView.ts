import type { ObjectShape } from './objectBank';
import { traitForObject } from './objectTraits';
import { measureSketchArtSize, prewarmSketchIllustration } from './sketchIllustrationCache';
import { renderSketchIllustration } from './sketchIllustrations';

export interface SketchbookPage {
  objectId: string;
  label: string;
  shape: ObjectShape;
}

/** Quyển sổ vẽ — minh họa 2D, lật trang sau mỗi câu. */
export class SketchbookView {
  private readonly root: HTMLElement;
  private readonly pageFront: HTMLElement;
  private readonly pageBack: HTMLElement;
  private readonly canvasFront: HTMLCanvasElement;
  private readonly canvasBack: HTMLCanvasElement;
  private readonly indexEl: HTMLElement;
  private flipGen = 0;
  private flipTimer: number | null = null;
  private activeFront = true;
  private artWidth = 280;
  private artHeight = 200;

  constructor(mount: HTMLElement, totalPages: number) {
    this.root = document.createElement('div');
    this.root.className = 'sketchbook';
    this.root.innerHTML = `
      <div class="sketchbook__cover" aria-hidden="true"></div>
      <div class="sketchbook__book">
        <div class="sketchbook__page-stack">
          <article class="sketchbook__sheet sketchbook__sheet--front" data-sheet="front">
            <div class="sketchbook__paper">
              <canvas class="sketchbook__art" aria-hidden="true"></canvas>
            </div>
            <footer class="sketchbook__footer">
              <p class="sketchbook__name"></p>
              <p class="sketchbook__trait"></p>
            </footer>
          </article>
          <article class="sketchbook__sheet sketchbook__sheet--back" data-sheet="back" hidden>
            <div class="sketchbook__paper">
              <canvas class="sketchbook__art" aria-hidden="true"></canvas>
            </div>
            <footer class="sketchbook__footer">
              <p class="sketchbook__name"></p>
              <p class="sketchbook__trait"></p>
            </footer>
          </article>
        </div>
        <p class="sketchbook__index">Trang 1 / ${totalPages}</p>
      </div>
    `;
    mount.appendChild(this.root);

    this.pageFront = this.root.querySelector('[data-sheet="front"]')!;
    this.pageBack = this.root.querySelector('[data-sheet="back"]')!;
    this.canvasFront = this.pageFront.querySelector('canvas')!;
    this.canvasBack = this.pageBack.querySelector('canvas')!;
    this.indexEl = this.root.querySelector('.sketchbook__index')!;
    this.root.querySelector('.sketchbook__index')!.textContent = `Trang 1 / ${totalPages}`;
    this.setSheetInStack(this.pageFront, true);
    this.setSheetInStack(this.pageBack, false);
    this.resizeObserver = new ResizeObserver(() => {
      this.syncArtSize();
      this.repaintActive();
    });
    this.resizeObserver.observe(this.root);
    this.syncArtSize();
  }

  get element(): HTMLElement {
    return this.root;
  }

  getArtSize(): { width: number; height: number } {
    return { width: this.artWidth, height: this.artHeight };
  }

  /** Chờ layout sổ vẽ (kích thước canvas > 0) trước khi preload. */
  whenArtSizeReady(timeoutMs = 3200): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      let settled = false;
      const settle = (fromTimeout: boolean) => {
        if (settled) return;
        settled = true;
        this.syncArtSize();
        if (fromTimeout || this.artWidth <= 8 || this.artHeight <= 8) {
          const m = measureSketchArtSize(this.root);
          this.artWidth = m.width > 8 ? m.width : this.artWidth;
          this.artHeight = m.height > 8 ? m.height : this.artHeight;
        }
        resolve({ width: this.artWidth, height: this.artHeight });
      };

      window.setTimeout(() => settle(true), timeoutMs);

      const tick = () => {
        if (settled) return;
        this.syncArtSize();
        if (this.artWidth > 8 && this.artHeight > 8) {
          settle(false);
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(() => requestAnimationFrame(tick));
    });
  }

  /** Vẽ sẵn trang (gọi trước khi lật / hiện câu). */
  prewarmPage(page: SketchbookPage): void {
    prewarmSketchIllustration(page.objectId, page.label, page.shape, this.artWidth, this.artHeight);
  }

  private syncArtSize(): void {
    const m = measureSketchArtSize(this.root);
    this.artWidth = m.width;
    this.artHeight = m.height;
  }

  private readonly resizeObserver: ResizeObserver;
  private current: SketchbookPage | null = null;
  private total = 1;
  private pageNum = 1;

  setTotal(total: number): void {
    this.total = total;
    this.updateIndex();
  }

  /** Gỡ trạng thái lật trang 3D — tránh trang bị ẩn (--turned / --flipped). */
  private resetFlipClasses(): void {
    for (const sheet of [this.pageFront, this.pageBack]) {
      sheet.classList.remove(
        'sketchbook__sheet--turning',
        'sketchbook__sheet--flipped',
        'sketchbook__sheet--turned'
      );
    }
  }

  private cancelFlipAnimation(): void {
    this.flipGen++;
    if (this.flipTimer !== null) {
      window.clearTimeout(this.flipTimer);
      this.flipTimer = null;
    }
    this.resetFlipClasses();
  }

  /** Trang đang xem ở lớp trên; trang kia ẩn hẳn (tờ sau trong DOM hay đè tờ trước nếu chỉ dùng [hidden]). */
  private setSheetInStack(sheet: HTMLElement, visible: boolean): void {
    if (visible) {
      sheet.removeAttribute('hidden');
      sheet.classList.add('sketchbook__sheet--active');
      sheet.classList.remove('sketchbook__sheet--stack-hidden');
    } else {
      sheet.setAttribute('hidden', '');
      sheet.classList.remove('sketchbook__sheet--active');
      sheet.classList.add('sketchbook__sheet--stack-hidden');
    }
  }

  private applyActiveStack(): void {
    this.setSheetInStack(this.pageFront, this.activeFront);
    this.setSheetInStack(this.pageBack, !this.activeFront);
  }

  showPage(page: SketchbookPage, pageIndex: number): void {
    this.cancelFlipAnimation();
    this.current = page;
    this.pageNum = pageIndex + 1;
    this.activeFront = true;
    this.applyActiveStack();
    this.syncArtSize();
    this.prewarmPage(page);
    this.paintSheet(this.pageFront, this.canvasFront, page);
    this.updateIndex();
    const pageKey = page.objectId;
    requestAnimationFrame(() => {
      if (!this.activeFront || this.current?.objectId !== pageKey) return;
      this.applyActiveStack();
      this.syncArtSize();
      this.paintSheet(this.pageFront, this.canvasFront, page);
    });
  }

  /** Lật sang trang mới (gọi sau khi trả lời / hết giờ). */
  flipToPage(page: SketchbookPage, pageIndex: number): Promise<void> {
    if (this.flipTimer !== null) {
      window.clearTimeout(this.flipTimer);
      this.flipTimer = null;
    }
    const gen = ++this.flipGen;
    const turning = this.activeFront ? this.pageFront : this.pageBack;
    const incoming = this.activeFront ? this.pageBack : this.pageFront;
    const inCanvas = this.activeFront ? this.canvasBack : this.canvasFront;

    this.prewarmPage(page);
    this.paintSheet(incoming, inCanvas, page);
    this.setSheetInStack(incoming, true);
    this.setSheetInStack(turning, true);
    turning.classList.add('sketchbook__sheet--turning');

    return new Promise((resolve) => {
      const done = () => {
        if (gen !== this.flipGen) return;
        turning.classList.remove('sketchbook__sheet--turning', 'sketchbook__sheet--flipped');
        turning.classList.add('sketchbook__sheet--turned');
        this.setSheetInStack(turning, false);
        incoming.classList.remove('sketchbook__sheet--turned', 'sketchbook__sheet--flipped');
        this.activeFront = !this.activeFront;
        this.applyActiveStack();
        this.current = page;
        this.pageNum = pageIndex + 1;
        this.updateIndex();
        resolve();
      };
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return;
        turning.removeEventListener('transitionend', onEnd);
        done();
      };
      turning.addEventListener('transitionend', onEnd);
      requestAnimationFrame(() => turning.classList.add('sketchbook__sheet--flipped'));
      this.flipTimer = window.setTimeout(() => {
        this.flipTimer = null;
        done();
      }, 720);
    });
  }

  dispose(): void {
    this.cancelFlipAnimation();
    this.resizeObserver.disconnect();
    this.root.remove();
  }

  private paintSheet(sheet: HTMLElement, canvas: HTMLCanvasElement, page: SketchbookPage): void {
    const name = sheet.querySelector('.sketchbook__name')!;
    const trait = sheet.querySelector('.sketchbook__trait')!;
    name.textContent = page.label;
    trait.textContent = traitForObject(page.objectId);
    this.syncArtSize();
    renderSketchIllustration(canvas, page.objectId, page.label, page.shape, {
      width: this.artWidth,
      height: this.artHeight,
    });
  }

  private repaintActive(): void {
    if (!this.current) return;
    const canvas = this.activeFront ? this.canvasFront : this.canvasBack;
    this.syncArtSize();
    renderSketchIllustration(canvas, this.current.objectId, this.current.label, this.current.shape, {
      width: this.artWidth,
      height: this.artHeight,
    });
  }

  private updateIndex(): void {
    this.indexEl.textContent = `Trang ${this.pageNum} / ${this.total}`;
  }
}
