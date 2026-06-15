/** Hero gian hàng chợ — mỗi câu đúng thêm một món hàng */
export class MarketScene {
  private readonly mount: HTMLElement;
  private readonly goodsEl: HTMLElement;
  private readonly total: number;
  private sold = 0;

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.total = totalQuestions;
    this.mount.innerHTML = `
      <div class="song-hong-market" aria-hidden="true">
        <div class="song-hong-market__awning"></div>
        <div class="song-hong-market__counter"></div>
        <div class="song-hong-market__goods" id="song-hong-goods"></div>
        <div class="song-hong-market__river"></div>
      </div>
    `;
    this.goodsEl = this.mount.querySelector<HTMLElement>('#song-hong-goods')!;
  }

  onCorrectAnswer(): void {
    if (this.sold >= this.total) return;
    this.sold++;
    const icons = ['🍎', '📚', '🧺', '🍚', '🐟', '🌽', '🧃', '🍜', '🥖', '🎋'];
    const item = document.createElement('span');
    item.className = 'song-hong-market__item song-hong-market__item--pop';
    item.textContent = icons[(this.sold - 1) % icons.length];
    item.style.setProperty('--i', String(this.sold));
    this.goodsEl.appendChild(item);
  }

  onWrongAnswer(): void {
    this.mount.querySelector('.song-hong-market')?.classList.add('song-hong-market--shake');
    window.setTimeout(() => {
      this.mount.querySelector('.song-hong-market')?.classList.remove('song-hong-market--shake');
    }, 420);
  }

  dispose(): void {
    this.mount.innerHTML = '';
  }
}
