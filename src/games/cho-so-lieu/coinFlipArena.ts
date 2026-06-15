import type { CoinFace } from './challengeTypes';

export interface CoinFlipArenaCallbacks {
  onAllFlipped: (outcomes: CoinFace[]) => void;
}

/** Vùng tung xu tương tác trong game area */
export class CoinFlipArena {
  private readonly root: HTMLElement;
  private readonly outcomes: CoinFace[];
  private flipIndex = 0;
  private readonly onDone: (outcomes: CoinFace[]) => void;
  private disposed = false;

  constructor(
    mount: HTMLElement,
    instruction: string,
    outcomes: CoinFace[],
    onDone: (outcomes: CoinFace[]) => void
  ) {
    this.root = mount;
    this.outcomes = outcomes;
    this.onDone = onDone;
    this.root.innerHTML = `
      <div class="coin-flip-arena">
        <p class="coin-flip-arena__instruction">${instruction}</p>
        <div class="coin-flip-arena__main">
          <button type="button" class="coin-flip-arena__coin" id="coin-btn" aria-label="Tung xu">
            <span class="coin-flip-arena__face" id="coin-face">?</span>
          </button>
          <div class="coin-flip-arena__tally">
            <span>S (Sao): <strong id="tally-s">0</strong></span>
            <span>N (Ngửa): <strong id="tally-n">0</strong></span>
          </div>
        </div>
        <div class="coin-flip-arena__history" id="coin-history" aria-live="polite"></div>
        <button type="button" class="coin-flip-arena__flip-btn" id="flip-btn">
          Tung xu! (còn ${outcomes.length} lần)
        </button>
      </div>
    `;

    const coinBtn = this.root.querySelector<HTMLButtonElement>('#coin-btn')!;
    const flipBtn = this.root.querySelector<HTMLButtonElement>('#flip-btn')!;
    const handler = () => this.doFlip();
    coinBtn.addEventListener('click', handler);
    flipBtn.addEventListener('click', handler);
  }

  private doFlip(): void {
    if (this.disposed || this.flipIndex >= this.outcomes.length) return;
    const face = this.outcomes[this.flipIndex];
    this.flipIndex++;

    const coinBtn = this.root.querySelector<HTMLButtonElement>('#coin-btn')!;
    const faceEl = this.root.querySelector<HTMLElement>('#coin-face')!;
    const tallyS = this.root.querySelector<HTMLElement>('#tally-s')!;
    const tallyN = this.root.querySelector<HTMLElement>('#tally-n')!;
    const history = this.root.querySelector<HTMLElement>('#coin-history')!;
    const flipBtn = this.root.querySelector<HTMLButtonElement>('#flip-btn')!;

    coinBtn.classList.remove('coin-flip-arena__coin--flip');
    void coinBtn.offsetWidth;
    coinBtn.classList.add('coin-flip-arena__coin--flip');

    window.setTimeout(() => {
      if (this.disposed) return;
      faceEl.textContent = face;
      faceEl.classList.toggle('coin-flip-arena__face--s', face === 'S');
      faceEl.classList.toggle('coin-flip-arena__face--n', face === 'N');

      const s = this.outcomes.slice(0, this.flipIndex).filter((f) => f === 'S').length;
      const n = this.flipIndex - s;
      tallyS.textContent = String(s);
      tallyN.textContent = String(n);

      const chip = document.createElement('span');
      chip.className = `coin-flip-arena__chip coin-flip-arena__chip--${face.toLowerCase()}`;
      chip.textContent = face;
      history.appendChild(chip);

      const left = this.outcomes.length - this.flipIndex;
      if (left > 0) {
        flipBtn.textContent = `Tung xu! (còn ${left} lần)`;
      } else {
        flipBtn.disabled = true;
        coinBtn.disabled = true;
        flipBtn.textContent = 'Đã tung đủ — chọn đáp án bên dưới';
        this.onDone(this.outcomes);
      }
    }, 280);
  }

  dispose(): void {
    this.disposed = true;
    this.root.innerHTML = '';
  }
}
