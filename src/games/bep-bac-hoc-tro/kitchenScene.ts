/** Hero bếp — mỗi câu đúng thêm nguyên liệu vào nồi */
export class KitchenScene {
  private readonly mount: HTMLElement;
  private readonly potEl: HTMLElement;
  private readonly total: number;
  private steps = 0;
  private readonly icons = ['🥕', '🧅', '🍚', '🥩', '🌶️', '🧄', '🥬', '🍲', '🫘', '🥔', '🍅', '🧂'];

  constructor(mount: HTMLElement, totalQuestions: number) {
    this.mount = mount;
    this.total = totalQuestions;
    this.mount.innerHTML = `
      <div class="bep-bac-kitchen" aria-hidden="true">
        <div class="bep-bac-kitchen__hood"></div>
        <div class="bep-bac-kitchen__pot">
          <div class="bep-bac-kitchen__ingredients" id="bep-bac-ingredients"></div>
          <div class="bep-bac-kitchen__pot-rim"></div>
        </div>
        <div class="bep-bac-kitchen__stove"></div>
      </div>
    `;
    this.potEl = this.mount.querySelector<HTMLElement>('#bep-bac-ingredients')!;
  }

  onCorrectAnswer(): void {
    if (this.steps >= this.total) return;
    this.steps++;
    const item = document.createElement('span');
    item.className = 'bep-bac-kitchen__item bep-bac-kitchen__item--pop';
    item.textContent = this.icons[(this.steps - 1) % this.icons.length];
    this.potEl.appendChild(item);
  }

  onWrongAnswer(): void {
    this.mount.querySelector('.bep-bac-kitchen')?.classList.add('bep-bac-kitchen--shake');
    window.setTimeout(() => {
      this.mount.querySelector('.bep-bac-kitchen')?.classList.remove('bep-bac-kitchen--shake');
    }, 420);
  }

  dispose(): void {
    this.mount.innerHTML = '';
  }
}
