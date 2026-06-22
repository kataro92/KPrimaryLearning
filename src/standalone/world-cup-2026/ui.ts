import { COUNTRIES } from './countries';
import { getCountryFlagAlt, getCountryFlagUrl } from './flagAssets';
import { getBestScore, getCompletedCountryIds, getCountryById } from './quiz';
import type { CountryProfile, LevelState, ScreenId } from './types';

export interface UiHandles {
  root: HTMLElement;
  showScreen: (id: ScreenId) => void;
  renderMenu: () => void;
  renderCountrySelect: (unlockedIds: string[]) => void;
  renderPlayHud: (level: LevelState) => void;
  updateLives: (lives: number, lostIndex?: number) => void;
  updateProgress: (stage: number) => void;
  updateTimer: (ratio: number) => void;
  renderDiscovery: (country: CountryProfile, score: number) => void;
  renderDefeat: (country: CountryProfile) => void;
  onStartCountry: (countryId: string) => void;
  onRetry: () => void;
  onNextCountry: () => void;
  onBackHome: () => void;
  onPlayAgain: () => void;
  onStartMenu: () => void;
  onPlayReady: () => void;
  onScreenChange: (screen: ScreenId) => void;
}

export function createUi(root: HTMLElement, handles: Partial<UiHandles>): UiHandles {
  root.innerHTML = `
    <div class="clay-backdrop wc-clay-backdrop" aria-hidden="true">
      <div class="clay-blob clay-blob--violet"></div>
      <div class="clay-blob clay-blob--pink"></div>
      <div class="clay-blob clay-blob--sky"></div>
    </div>
    <div class="wc-shell screen screen--clay">
      <header class="wc-header clay-card">
        <button type="button" class="btn btn-secondary btn--toolbar" id="wc-back-home">← Về trang chính</button>
        <div class="wc-header__title-wrap">
          <p class="wc-kicker">Soccer Quiz Adventure</p>
          <h1 class="wc-title">World Cup 2026</h1>
        </div>
      </header>

      <section class="wc-screen" id="wc-screen-menu">
        <div class="clay-card wc-hero-card">
          <p class="wc-kicker wc-kicker--accent">Hành trình bóng đá</p>
          <h2>Chinh phục các đội bóng World Cup 2026!</h2>
          <p class="subtitle wc-sub">Trả lời câu hỏi, vượt qua hậu vệ và thủ môn để khám phá văn hóa từng quốc gia.</p>
          <button type="button" class="btn btn-primary" id="wc-start">Bắt đầu chơi</button>
        </div>
      </section>

      <section class="wc-screen" id="wc-screen-country" hidden>
        <h2 class="wc-section-title">Chọn quốc gia</h2>
        <p class="subtitle wc-section-sub">Mỗi quốc gia có 4 chặng: 3 hậu vệ và 1 thủ môn.</p>
        <div class="wc-country-grid" id="wc-country-grid"></div>
      </section>

      <section class="wc-screen wc-screen--play" id="wc-screen-play" hidden>
        <div class="wc-play-stage" id="wc-play-stage">
          <header class="wc-play-hud-bar clay-card" aria-label="Thanh tiến trình">
            <div class="wc-play-flag" id="wc-play-flag" hidden>
              <img id="wc-play-flag-img" alt="" width="48" height="32" decoding="async" />
            </div>
            <div class="wc-lives" id="wc-lives" aria-label="Lượt sút"></div>
            <div class="wc-play-hud-bar__timer">
              <div class="timer-bar" aria-hidden="true"><div class="timer-bar__fill" id="wc-timer-fill"></div></div>
            </div>
            <div class="wc-stage-dots" id="wc-progress" aria-label="Tiến trình chặng"></div>
          </header>
        </div>
      </section>

      <section class="wc-screen" id="wc-screen-discovery" hidden>
        <div class="clay-card wc-discovery-card" id="wc-discovery"></div>
      </section>

      <section class="wc-screen" id="wc-screen-defeat" hidden>
        <div class="clay-card wc-result-card wc-result-card--bad">
          <h2>Hết lượt sút!</h2>
          <p class="subtitle" id="wc-defeat-text">Thử lại nhé, bạn sắp ghi bàn rồi!</p>
          <button type="button" class="btn btn-primary" id="wc-retry">Chơi lại</button>
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
      root.querySelector('.wc-shell')?.classList.toggle('wc-shell--playing', id === 'play');
      root.querySelector('.wc-clay-backdrop')?.classList.toggle('wc-clay-backdrop--hidden', id === 'play');
      ui.onScreenChange(id);
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
        btn.className = `game-card wc-country-card${locked ? ' wc-country-card--locked' : ''}${done ? ' wc-country-card--done' : ''}`;
        btn.disabled = locked;
        const flagUrl = getCountryFlagUrl(c.id);
        const flagImg = flagUrl
          ? `<img class="wc-country-card__flag" src="${flagUrl}" alt="${getCountryFlagAlt(c.name)}" width="64" height="42" loading="lazy" />`
          : `<span class="wc-country-card__flag wc-country-card__flag--fallback" style="background:linear-gradient(90deg,${c.flagColors.join(',')})" aria-hidden="true"></span>`;
        btn.innerHTML = `
          ${flagImg}
          <strong>${c.name}</strong>
          <small class="subtitle">${locked ? 'Chưa mở khóa' : done ? `Đã hoàn thành · ${best}/10` : 'Sẵn sàng'}</small>
        `;
        if (!locked) btn.addEventListener('click', () => ui.onStartCountry(c.id));
        grid.appendChild(btn);
      }
    },
    renderPlayHud(level) {
      ui.showScreen('play');
      const country = getCountryById(level.countryId);
      const flagWrap = root.querySelector<HTMLElement>('#wc-play-flag')!;
      const flagImg = root.querySelector<HTMLImageElement>('#wc-play-flag-img')!;
      const flagUrl = country ? getCountryFlagUrl(country.id) : null;
      if (country && flagUrl) {
        flagImg.src = flagUrl;
        flagImg.alt = getCountryFlagAlt(country.name);
        flagWrap.hidden = false;
      } else {
        flagImg.removeAttribute('src');
        flagWrap.hidden = true;
      }
      ui.updateLives(level.lives);
      ui.updateProgress(level.stage);
      ui.updateTimer(1);
      requestAnimationFrame(() => ui.onPlayReady());
    },
    updateLives(lives, lostIndex) {
      const wrap = root.querySelector<HTMLElement>('#wc-lives')!;
      wrap.innerHTML = Array.from({ length: 3 }, (_, i) => {
        const alive = i < lives;
        const breaking = lostIndex === i;
        return `<span class="wc-life clay-orb${alive ? '' : ' wc-life--lost'}${breaking ? ' wc-life--break' : ''}" aria-hidden="true">⚽</span>`;
      }).join('');
    },
    updateProgress(stage) {
      const wrap = root.querySelector<HTMLElement>('#wc-progress')!;
      wrap.innerHTML = [1, 2, 3, 4]
        .map((s) => {
          const label = s < 4 ? `HV${s}` : '🏆';
          let cls = 'wc-stage-dot';
          if (s < stage) cls += ' wc-stage-dot--done';
          if (s === stage) cls += ' wc-stage-dot--current';
          return `<span class="${cls}">${label}</span>`;
        })
        .join('');
    },
    updateTimer(ratio) {
      const fill = root.querySelector<HTMLElement>('#wc-timer-fill');
      if (!fill) return;
      fill.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
      fill.classList.toggle('timer-bar__fill--warn', ratio <= 0.2 && ratio > 0.08);
      fill.classList.toggle('timer-bar__fill--danger', ratio <= 0.08);
    },
    renderDiscovery(country, score) {
      ui.showScreen('discovery');
      root.querySelector<HTMLElement>('#wc-discovery')!.innerHTML = `
        <p class="wc-kicker wc-kicker--success">MÀN CHƠI HOÀN THÀNH - GOAL!!!</p>
        <h2>${country.name}</h2>
        <p class="wc-score">Điểm: ${score}/10</p>
        <dl class="wc-facts">
          <div><dt>Văn hóa</dt><dd>${country.culture}</dd></div>
          <div><dt>Bóng đá</dt><dd>${country.footballHistory}</dd></div>
          <div><dt>Món ăn</dt><dd>${country.signatureFood}</dd></div>
          <div><dt>Nhân vật</dt><dd>${country.figure}</dd></div>
        </dl>
        <div class="wc-actions">
          <button type="button" class="btn btn-primary" id="wc-next">Quốc gia tiếp theo</button>
          <button type="button" class="btn btn-secondary" id="wc-play-again">Chơi lại</button>
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
    onStartCountry: () => {},
    onRetry: () => {},
    onNextCountry: () => {},
    onBackHome: () => {},
    onPlayAgain: () => {},
    onStartMenu: () => {},
    onPlayReady: () => {},
    onScreenChange: () => {},
    ...handles,
  };

  root.querySelector('#wc-start')!.addEventListener('click', () => ui.onStartMenu());
  root.querySelector('#wc-back-home')!.addEventListener('click', () => ui.onBackHome());
  root.querySelector('#wc-retry')!.addEventListener('click', () => ui.onRetry());

  return ui;
}
