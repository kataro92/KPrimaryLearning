import { useAppStore } from '@/app/store';
import type { PlayResult } from '@/features/gameplay/types';
import { formatScoreDisplay } from '@/features/scoring/scoreEngine';
import { playSfx } from '@/features/audio/sfxService';
import { buildResultPresentation } from './resultTier';

export function renderResultScreen(
  root: HTMLElement,
  result: PlayResult,
  options?: { celebration?: boolean }
): void {
  const celebration = options?.celebration ?? false;
  const pres = buildResultPresentation(result, celebration);
  const mins = Math.floor(result.durationMs / 60000);
  const secs = Math.floor((result.durationMs % 60000) / 1000);
  const timeStr = mins > 0 ? `${mins} phút ${secs} giây` : `${secs} giây`;

  const starHtml = [1, 2, 3]
    .map((i) => {
      const lit = i <= result.stars;
      return `<span class="result-star ${lit ? 'result-star--lit' : ''}" style="--star-i:${i}">${lit ? '⭐' : '☆'}</span>`;
    })
    .join('');

  root.innerHTML = `
    <section class="screen screen--clay result-screen result-screen--${pres.tier}" aria-live="polite">
      <div class="result-fx" id="result-fx" aria-hidden="true"></div>
      <h1 class="result-screen__title">Kết quả</h1>
      <div class="clay-card ${pres.cardClass}">
        <p class="result-emoji" aria-hidden="true">${pres.emoji}</p>
        <p class="result-headline">${escapeHtml(pres.title)}</p>
        <div class="result-stars">${starHtml}</div>
        <p class="result-score">${formatScoreDisplay(result.score)}</p>
        <p class="result-grade">${escapeHtml(result.grade)}</p>
        <p class="result-meta">Đúng ${result.correct}/${result.total} · ${timeStr}</p>
        <p class="result-message">${escapeHtml(pres.message)}</p>
        <button type="button" class="btn btn-primary result-btn-in" id="btn-home">Về trang trò chơi</button>
        <button type="button" class="btn btn-secondary result-btn-in result-btn-in--full" id="btn-replay">Chơi lại</button>
      </div>
    </section>
  `;

  spawnTierEffects(root.querySelector<HTMLElement>('#result-fx')!, pres.tier, result);

  root.querySelector('#btn-home')!.addEventListener('click', () => {
    useAppStore.resetSelection();
    useAppStore.setScreen('home');
  });
  root.querySelector('#btn-replay')!.addEventListener('click', () => {
    useAppStore.setScreen('game-play');
  });
}

function spawnTierEffects(container: HTMLElement, tier: string, result: PlayResult): void {
  if (result.unlocked && result.newAchievementName) {
    playSfx('unlock');
  } else if (tier === 'excellent') {
    playSfx('celebrate');
  } else if (tier === 'good') {
    playSfx('star');
  } else if (tier === 'low') {
    playSfx('timeout');
  }

  if (tier === 'excellent') {
    const colors = ['#facc15', '#22c55e', '#3b82f6', '#f472b6', '#fb923c'];
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('span');
      p.className = 'confetti';
      p.style.setProperty('--x', `${10 + Math.random() * 80}%`);
      p.style.setProperty('--delay', `${Math.random() * 0.6}s`);
      p.style.setProperty('--rot', `${Math.random() * 360}deg`);
      p.style.background = colors[i % colors.length]!;
      container.appendChild(p);
    }
  } else if (tier === 'good') {
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = '✦';
      s.style.setProperty('--x', `${15 + i * 10}%`);
      s.style.setProperty('--delay', `${i * 0.12}s`);
      container.appendChild(s);
    }
  } else if (tier === 'low') {
    const cloud = document.createElement('span');
    cloud.className = 'result-cloud';
    cloud.textContent = '☁️';
    container.appendChild(cloud);
  }
}

function escapeHtml(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
