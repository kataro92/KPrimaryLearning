/** Hero chợ số liệu — mỗi câu đúng thêm một cột biểu đồ mini */
export class StatsMarketScene {
  private readonly mount: HTMLElement;
  private readonly barsEl: HTMLElement;
  private readonly total: number;
  private count = 0;
  private readonly colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.total = totalQuestions;
    this.mount.innerHTML = `
      <div class="cho-so-market" aria-hidden="true">
        <div class="cho-so-market__sign">📊 Chợ Số Liệu</div>
        <div class="cho-so-market__bars" id="cho-so-bars"></div>
        <div class="cho-so-market__floor"></div>
      </div>
    `;
    this.barsEl = this.mount.querySelector<HTMLElement>('#cho-so-bars')!;
  }

  onCorrectAnswer(): void {
    if (this.count >= this.total) return;
    this.count++;
    const h = 24 + (this.count % 5) * 12;
    const bar = document.createElement('div');
    bar.className = 'cho-so-market__bar cho-so-market__bar--rise';
    bar.style.height = `${h}px`;
    bar.style.background = this.colors[(this.count - 1) % this.colors.length];
    bar.style.setProperty('--i', String(this.count));
    this.barsEl.appendChild(bar);
  }

  onWrongAnswer(): void {
    this.mount.querySelector('.cho-so-market')?.classList.add('cho-so-market--shake');
    window.setTimeout(() => {
      this.mount.querySelector('.cho-so-market')?.classList.remove('cho-so-market--shake');
    }, 420);
  }

  dispose(): void {
    this.mount.innerHTML = '';
  }
}
