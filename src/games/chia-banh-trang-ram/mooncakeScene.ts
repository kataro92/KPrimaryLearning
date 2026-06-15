/** Hero bánh trung thu — mỗi câu đúng thêm một miếng bánh */
export class MooncakeScene {
  private readonly mount: HTMLElement;
  private readonly trayEl: HTMLElement;
  private readonly total: number;
  private served = 0;

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.total = totalQuestions;
    this.mount.innerHTML = `
      <div class="trang-ram-moon" aria-hidden="true">
        <div class="trang-ram-moon__sky"></div>
        <div class="trang-ram-moon__disc"></div>
        <div class="trang-ram-moon__tray" id="trang-ram-tray"></div>
      </div>
    `;
    this.trayEl = this.mount.querySelector<HTMLElement>('#trang-ram-tray')!;
  }

  onCorrectAnswer(): void {
    if (this.served >= this.total) return;
    this.served++;
    const piece = document.createElement('span');
    piece.className = 'trang-ram-moon__cake trang-ram-moon__cake--pop';
    piece.textContent = '🥮';
    piece.style.setProperty('--i', String(this.served));
    this.trayEl.appendChild(piece);
  }

  onWrongAnswer(): void {
    this.mount.querySelector('.trang-ram-moon')?.classList.add('trang-ram-moon--shake');
    window.setTimeout(() => {
      this.mount.querySelector('.trang-ram-moon')?.classList.remove('trang-ram-moon--shake');
    }, 420);
  }

  dispose(): void {
    this.mount.innerHTML = '';
  }
}
