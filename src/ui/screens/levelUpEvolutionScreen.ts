import type { PlayResult } from '@/features/gameplay/types';
import { LevelUpEvolutionScene, type EvolutionPhase } from '@/features/character/levelUpEvolutionScene';
import { levelToKnightTier } from '@/features/progress/playerLevel';
import { playSfx } from '@/features/audio/sfxService';

const EVOLUTION_DURATION_MS = 6200;

const PHASE_COPY: Record<EvolutionPhase, string> = {
  charge: 'Năng lượng học tập đang tích tụ…',
  flash: 'Ánh sáng mạnh hơn!',
  transform: 'BIẾN HÓA!',
  reveal: 'Sức mạnh mới đã thức tỉnh!',
  done: 'Hoàn tất biến hóa!',
};

export function renderLevelUpEvolutionScreen(
  root: HTMLElement,
  result: PlayResult,
  onComplete: () => void
): void {
  const levelUp = result.levelUp;
  if (!levelUp) {
    onComplete();
    return;
  }

  const fromTier = levelToKnightTier(levelUp.fromLevel);
  const toTier = levelToKnightTier(levelUp.toLevel);
  const jumped = levelUp.toLevel - levelUp.fromLevel;

  root.innerHTML = `
    <section class="screen level-up-evolution" aria-live="assertive">
      <div class="level-up-evolution__bg" aria-hidden="true">
        <span class="level-up-evolution__beam level-up-evolution__beam--1"></span>
        <span class="level-up-evolution__beam level-up-evolution__beam--2"></span>
        <span class="level-up-evolution__beam level-up-evolution__beam--3"></span>
        <span class="level-up-evolution__flash" id="evo-flash"></span>
      </div>
      <div class="level-up-evolution__stage" id="evo-stage" aria-hidden="true"></div>
      <div class="level-up-evolution__hud">
        <p class="level-up-evolution__eyebrow" id="evo-eyebrow">Cấp ${levelUp.fromLevel} → Cấp ${levelUp.toLevel}</p>
        <h1 class="level-up-evolution__callout" id="evo-callout">${PHASE_COPY.charge}</h1>
        <div class="level-up-evolution__reveal" id="evo-reveal" hidden>
          <span class="level-up-evolution__badge">Cấp ${levelUp.toLevel}</span>
          <h2 class="level-up-evolution__title">${escapeHtml(levelUp.toTitle)}</h2>
          ${
            jumped > 1
              ? `<p class="level-up-evolution__jump">Bạn nhảy ${jumped} cấp một lúc — thật phi thường!</p>`
              : `<p class="level-up-evolution__prev">Từ <em>${escapeHtml(levelUp.fromTitle)}</em></p>`
          }
        </div>
        <button type="button" class="btn btn-secondary level-up-evolution__skip" id="evo-skip">Bỏ qua</button>
        <button type="button" class="btn btn-primary level-up-evolution__continue" id="evo-continue" hidden>Tiếp tục</button>
      </div>
    </section>
  `;

  const stage = root.querySelector<HTMLElement>('#evo-stage')!;
  const callout = root.querySelector<HTMLElement>('#evo-callout')!;
  const reveal = root.querySelector<HTMLElement>('#evo-reveal')!;
  const flashEl = root.querySelector<HTMLElement>('#evo-flash')!;
  const continueBtn = root.querySelector<HTMLButtonElement>('#evo-continue')!;
  const skipBtn = root.querySelector<HTMLButtonElement>('#evo-skip')!;

  const scene = new LevelUpEvolutionScene(stage, fromTier, toTier);
  let finished = false;
  let rafId = 0;
  let startTs = 0;
  let sfxPlayed = { charge: false, flash: false, transform: false, reveal: false };

  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(rafId);
    scene.dispose();
    onComplete();
  };

  const tick = (now: number) => {
    if (finished) return;
    if (!startTs) startTs = now;
    const elapsed = now - startTs;
    const progress = Math.min(1, elapsed / EVOLUTION_DURATION_MS);
    scene.setProgress(progress);

    if (progress >= 1) {
      reveal.hidden = false;
      callout.textContent = 'Chúc mừng bạn đã lên cấp!';
      continueBtn.hidden = false;
      skipBtn.hidden = true;
      return;
    }
    rafId = requestAnimationFrame(tick);
  };

  scene.start(({ phase }) => {
    callout.textContent = PHASE_COPY[phase];
    callout.dataset.phase = phase;

    if (phase === 'charge' && !sfxPlayed.charge) {
      sfxPlayed.charge = true;
      playSfx('evolveCharge');
    }
    if (phase === 'flash' && !sfxPlayed.flash) {
      sfxPlayed.flash = true;
      playSfx('evolveFlash');
      flashEl.classList.add('level-up-evolution__flash--on');
      window.setTimeout(() => flashEl.classList.remove('level-up-evolution__flash--on'), 420);
    }
    if (phase === 'transform' && !sfxPlayed.transform) {
      sfxPlayed.transform = true;
      playSfx('evolveTransform');
    }
    if (phase === 'reveal' && !sfxPlayed.reveal) {
      sfxPlayed.reveal = true;
      playSfx('evolveReveal');
      playSfx('celebrate');
      reveal.hidden = false;
      callout.textContent = `Cấp ${levelUp.toLevel} — ${levelUp.toTitle}`;
    }
    if (phase === 'done') {
      continueBtn.hidden = false;
      skipBtn.hidden = true;
    }
  });

  rafId = requestAnimationFrame(tick);

  continueBtn.addEventListener('click', finish);
  skipBtn.addEventListener('click', () => {
    cancelAnimationFrame(rafId);
    scene.setProgress(1);
    reveal.hidden = false;
    callout.textContent = `Cấp ${levelUp.toLevel} — ${levelUp.toTitle}`;
    continueBtn.hidden = false;
    skipBtn.hidden = true;
  });
}

function escapeHtml(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
