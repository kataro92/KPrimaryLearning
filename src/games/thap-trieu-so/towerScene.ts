/** Hero tháp CSS — mỗi câu đúng thêm một tầng */
export class TowerScene {
  private readonly mount: HTMLElement;
  private readonly floorsEl: HTMLElement;
  private readonly total: number;
  private built = 0;

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.total = totalQuestions;
    this.mount.innerHTML = `
      <div class="trieu-tower" aria-hidden="true">
        <div class="trieu-tower__spire"></div>
        <div class="trieu-tower__floors" id="trieu-tower-floors"></div>
        <div class="trieu-tower__base"></div>
      </div>
    `;
    this.floorsEl = this.mount.querySelector<HTMLElement>('#trieu-tower-floors')!;
  }

  onCorrectAnswer(): void {
    if (this.built >= this.total) return;
    this.built++;
    const floor = document.createElement('div');
    floor.className = 'trieu-tower__floor trieu-tower__floor--rise';
    floor.style.setProperty('--i', String(this.built));
    this.floorsEl.prepend(floor);
  }

  onWrongAnswer(): void {
    this.mount.querySelector('.trieu-tower')?.classList.add('trieu-tower--shake');
    window.setTimeout(() => {
      this.mount.querySelector('.trieu-tower')?.classList.remove('trieu-tower--shake');
    }, 420);
  }

  dispose(): void {
    this.mount.innerHTML = '';
  }
}
