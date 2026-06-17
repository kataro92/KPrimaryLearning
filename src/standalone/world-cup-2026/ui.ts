import { COUNTRIES } from './countries';
import { getBestScore, getCompletedCountryIds } from './quiz';
import type { CountryProfile, LevelState, QuizQuestion, ScreenId } from './types';

const SHOT_HINTS = ['Đá bổng', 'Đá thẳng', 'Đá sệt'] as const;

export interface UiHandles {
  root: HTMLElement;
  showScreen: (id: ScreenId) => void;
  renderMenu: () => void;
  renderCountrySelect: (unlockedIds: string[]) => void;
  renderPlayHud: (level: LevelState, country: CountryProfile, question: QuizQuestion) => void;
  updateLives: (lives: number, lostIndex?: number) => void;
  updateProgress: (stage: number) => void;
  updateTimer: (ratio: number) => void;
  setFeedback: (text: string, kind?: 'ok' | 'bad' | 'neutral') => void;
  setAnswersEnabled: (enabled: boolean) => void;
  highlightAnswer: (index: number | null) => void;
  fadeOtherAnswers: (selected: number) => void;
  renderDiscovery: (country: CountryProfile, score: number) => void;
  renderDefeat: (country: CountryProfile) => void;
  renderVictoryBanner: () => void;
  onAnswer: (index: number) => void;
  onStartCountry: (countryId: string) => void;
  onRetry: () => void;
  onNextCountry: () => void;
  onBackHome: () => void;
  onPlayAgain: () => void;
  onStartMenu: () => void;
  onPlayReady: () => void;
}

export function createUi(root: HTMLElement, handles: Partial<UiHandles>): UiHandles {
  root.innerHTML = `
    <div class="wc-app">
      <header class="wc-header">
        <button type="button" class="wc-btn wc-btn--ghost" id="wc-back-home">← Về trang chính</button>
        <h1 class="wc-title">World Cup 2026</h1>
      </header>

      <section class="wc-screen" id="wc-screen-menu">
        <div class="wc-hero-card">
          <p class="wc-kicker">Soccer Quiz Adventure</p>
          <h2>Chinh phục các đội bóng World Cup 2026!</h2>
          <p class="wc-sub">Trả lời câu hỏi, chọn kiểu sút A/B/C, vượt qua hậu vệ và thủ môn để khám phá văn hóa từng quốc gia.</p>
          <button type="button" class="wc-btn wc-btn--primary" id="wc-start">Bắt đầu</button>
        </div>
      </section>

      <section class="wc-screen" id="wc-screen-country" hidden>
        <h2>Chọn quốc gia</h2>
        <div class="wc-country-grid" id="wc-country-grid"></div>
      </section>

      <section class="wc-screen wc-screen--play" id="wc-screen-play" hidden>
        <div class="wc-hud">
          <div class="wc-lives" id="wc-lives" aria-label="Lượt sút"></div>
          <div class="wc-progress" id="wc-progress"></div>
        </div>
        <div class="wc-timer-bar" aria-hidden="true"><div class="wc-timer-bar__fill" id="wc-timer-fill"></div></div>
        <div class="wc-question-box" id="wc-question"></div>
        <div class="wc-answers" id="wc-answers"></div>
        <p class="wc-feedback" id="wc-feedback"></p>
        <div class="wc-field-wrap">
          <canvas id="wc-canvas" aria-label="Sân bóng"></canvas>
        </div>
      </section>

      <section class="wc-screen" id="wc-screen-discovery" hidden>
        <div class="wc-discovery-card" id="wc-discovery"></div>
      </section>

      <section class="wc-screen" id="wc-screen-defeat" hidden>
        <div class="wc-result-card wc-result-card--bad">
          <h2>Hết lượt sút!</h2>
          <p id="wc-defeat-text">Thử lại nhé, bạn sắp ghi bàn rồi!</p>
          <button type="button" class="wc-btn wc-btn--primary" id="wc-retry">Chơi lại</button>
        </div>
      </section>
    </div>
  `;

  const screens: Record<ScreenId, HTMLElement> = {
    menu: root.querySelector('#wc-screen-menu')!,
    'country-select': root.querySelector('#wc-screen-country')!,
    play: root.querySelector('#wc-screen-play')!,
    discovery: root.querySelector('#wc-screen-discovery')!,
    defeat: root.querySelector('#wc-screen-defeat')!,
    victory: root.querySelector('#wc-screen-discovery')!,
  };

  const ui: UiHandles = {
    root,
    showScreen(id) {
      Object.entries(screens).forEach(([key, el]) => {
        if (key === 'victory') return;
        el.hidden = key !== id;
      });
    },
    renderMenu() {
      ui.showScreen('menu');
    },
    renderCountrySelect(unlockedIds) {
      ui.showScreen('country-select');
      const completed = new Set(getCompletedCountryIds());
      const grid = root.querySelector<HTMLElement>('#wc-country-grid')!;
      grid.innerHTML = '';
      for (const c of COUNTRIES) {
        const locked = !unlockedIds.includes(c.id);
        const done = completed.has(c.id);
        const best = getBestScore(c.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `wc-country-card${locked ? ' wc-country-card--locked' : ''}${done ? ' wc-country-card--done' : ''}`;
        btn.disabled = locked;
        btn.innerHTML = `
          <span class="wc-country-card__flag" style="background:linear-gradient(90deg,${c.flagColors.join(',')})"></span>
          <strong>${c.name}</strong>
          <small>${locked ? 'Chưa mở khóa' : done ? `Đã hoàn thành · ${best}/10` : 'Sẵn sàng'}</small>
        `;
        if (!locked) btn.addEventListener('click', () => ui.onStartCountry(c.id));
        grid.appendChild(btn);
      }
    },
    renderPlayHud(level, country, question) {
      ui.showScreen('play');
      root.querySelector('#wc-question')!.textContent = question.prompt;
      const answers = root.querySelector<HTMLElement>('#wc-answers')!;
      answers.innerHTML = '';
      const labels: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];
      question.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wc-answer-btn';
        btn.dataset.index = String(i);
        btn.innerHTML = `<span class="wc-answer-btn__code">${labels[i]}</span><span class="wc-answer-btn__shot">${SHOT_HINTS[i]}</span><span>${opt}</span>`;
        btn.addEventListener('click', () => ui.onAnswer(i));
        answers.appendChild(btn);
      });
      ui.updateLives(level.lives);
      ui.updateProgress(level.stage);
      ui.updateTimer(1);
      const stageLabel = level.stage === 4 ? 'Thủ môn' : `Hậu vệ ${level.stage}`;
      ui.setFeedback(`${country.name} · ${stageLabel} — Chọn đáp án để sút (1/2/3)`, 'neutral');
      ui.setAnswersEnabled(true);
      ui.highlightAnswer(null);
      requestAnimationFrame(() => ui.onPlayReady());
    },
    updateLives(lives, lostIndex) {
      const wrap = root.querySelector<HTMLElement>('#wc-lives')!;
      wrap.innerHTML = Array.from({ length: 3 }, (_, i) => {
        const alive = i < lives;
        const breaking = lostIndex === i;
        return `<span class="wc-life${alive ? '' : ' wc-life--lost'}${breaking ? ' wc-life--break' : ''}" aria-hidden="true">⚽</span>`;
      }).join('');
    },
    updateProgress(stage) {
      const wrap = root.querySelector<HTMLElement>('#wc-progress')!;
      wrap.innerHTML = [1, 2, 3, 4]
        .map((s) => {
          const label = s < 4 ? `HV${s}` : '🏆';
          const cls = s < stage ? 'done' : s === stage ? 'current' : '';
          return `<span class="wc-progress__dot ${cls}">${label}</span>`;
        })
        .join('');
    },
    updateTimer(ratio) {
      const fill = root.querySelector<HTMLElement>('#wc-timer-fill');
      if (!fill) return;
      fill.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
      fill.classList.toggle('wc-timer-bar__fill--warn', ratio <= 0.2);
    },
    setFeedback(text, kind = 'neutral') {
      const el = root.querySelector<HTMLElement>('#wc-feedback')!;
      el.textContent = text;
      el.className = `wc-feedback wc-feedback--${kind}`;
    },
    setAnswersEnabled(enabled) {
      root.querySelectorAll<HTMLButtonElement>('.wc-answer-btn').forEach((b) => {
        b.disabled = !enabled;
      });
    },
    highlightAnswer(index) {
      root.querySelectorAll<HTMLButtonElement>('.wc-answer-btn').forEach((b, i) => {
        b.classList.toggle('wc-answer-btn--selected', index === i);
      });
    },
    fadeOtherAnswers(selected) {
      root.querySelectorAll<HTMLButtonElement>('.wc-answer-btn').forEach((b, i) => {
        if (i !== selected) b.classList.add('wc-answer-btn--fade');
      });
    },
    renderDiscovery(country, score) {
      ui.showScreen('discovery');
      root.querySelector<HTMLElement>('#wc-discovery')!.innerHTML = `
        <p class="wc-kicker">MÀN CHƠI HOÀN THÀNH - GOAL!!!</p>
        <h2>${country.name}</h2>
        <p class="wc-score">Điểm: ${score}/10</p>
        <dl class="wc-facts">
          <div><dt>Văn hóa</dt><dd>${country.culture}</dd></div>
          <div><dt>Bóng đá</dt><dd>${country.footballHistory}</dd></div>
          <div><dt>Món ăn</dt><dd>${country.signatureFood}</dd></div>
          <div><dt>Nhân vật</dt><dd>${country.figure}</dd></div>
        </dl>
        <div class="wc-actions">
          <button type="button" class="wc-btn wc-btn--primary" id="wc-next">Quốc gia tiếp theo</button>
          <button type="button" class="wc-btn wc-btn--ghost" id="wc-play-again">Chơi lại</button>
        </div>
      `;
      root.querySelector('#wc-next')!.addEventListener('click', () => ui.onNextCountry());
      root.querySelector('#wc-play-again')!.addEventListener('click', () => ui.onPlayAgain());
    },
    renderDefeat(country) {
      ui.showScreen('defeat');
      root.querySelector('#wc-defeat-text')!.textContent =
        `Bạn chưa vượt qua ${country.name}. Hãy thử lại nhé!`;
    },
    renderVictoryBanner() {
      ui.setFeedback('MÀN CHƠI HOÀN THÀNH - GOAL!!!', 'ok');
    },
    onAnswer: () => {},
    onStartCountry: () => {},
    onRetry: () => {},
    onNextCountry: () => {},
    onBackHome: () => {},
    onPlayAgain: () => {},
    onStartMenu: () => {},
    onPlayReady: () => {},
    ...handles,
  };

  root.querySelector('#wc-start')!.addEventListener('click', () => ui.onStartMenu());
  root.querySelector('#wc-back-home')!.addEventListener('click', () => ui.onBackHome());
  root.querySelector('#wc-retry')!.addEventListener('click', () => ui.onRetry());

  return ui;
}
