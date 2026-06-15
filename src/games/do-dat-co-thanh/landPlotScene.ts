/** Hero lô đất cổ thành — mỗi câu đúng đo thêm một ô */
export class LandPlotScene {
  private readonly mount: HTMLElement;
  private readonly gridEl: HTMLElement;
  private readonly total: number;
  private measured = 0;

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.total = totalQuestions;
    this.mount.innerHTML = `
      <div class="co-thanh-land" aria-hidden="true">
        <div class="co-thanh-land__wall"></div>
        <div class="co-thanh-land__grid" id="co-thanh-grid"></div>
        <div class="co-thanh-land__label">m²</div>
      </div>
    `;
    this.gridEl = this.mount.querySelector<HTMLElement>('#co-thanh-grid')!;
  }

  onCorrectAnswer(): void {
    if (this.measured >= this.total) return;
    this.measured++;
    const cell = document.createElement('span');
    cell.className = 'co-thanh-land__cell co-thanh-land__cell--fill';
    cell.style.setProperty('--i', String(this.measured));
    this.gridEl.appendChild(cell);
  }

  onWrongAnswer(): void {
    this.mount.querySelector('.co-thanh-land')?.classList.add('co-thanh-land--shake');
    window.setTimeout(() => {
      this.mount.querySelector('.co-thanh-land')?.classList.remove('co-thanh-land--shake');
    }, 420);
  }

  dispose(): void {
    this.mount.innerHTML = '';
  }
}
