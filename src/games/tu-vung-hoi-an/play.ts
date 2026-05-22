import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { playSfx } from '@/features/audio/sfxService';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { ANSWER_FEEDBACK_MS } from '@/features/gameplay/roundTiming';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { makeVisualCardDataUrl } from '@/features/visuals/answerVisual';
import { selectPairs, sessionTimeMs } from './questions';
import { HoiAnBoatScene } from './boatLanternScene';

export type { PlayResult };

type CardFace = 'en' | 'vi';

interface MemoryCard {
  id: string;
  pairId: string;
  face: CardFace;
  label: string;
  artUrl: string;
}

export function renderTuVungHoiAnGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'tu-vung-hoi-an';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const pairs = selectPairs(level);
  const totalPairs = pairs.length;
  const sessionMs = sessionTimeMs(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: totalPairs,
    targetTimeSec: sessionMs / 1000 / totalPairs,
    startedAt,
  });

  const cards: MemoryCard[] = pairs.flatMap((p) => [
    {
      id: `${p.en}-en`,
      pairId: p.en,
      face: 'en' as CardFace,
      label: p.en,
      artUrl: makeVisualCardDataUrl({ title: p.en, subtitle: 'ENGLISH', seed: `${p.en}-en` }),
    },
    {
      id: `${p.en}-vi`,
      pairId: p.en,
      face: 'vi' as CardFace,
      label: p.vi,
      artUrl: makeVisualCardDataUrl({ title: p.vi, subtitle: 'TIENG VIET', seed: `${p.en}-vi` }),
    },
  ]);
  cards.sort(() => Math.random() - 0.5);

  let matched = 0;
  let flipped: MemoryCard[] = [];
  let lock = false;
  const roundStart = Date.now();

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--hoi-an');
  sceneHost.setParallaxSway(false);
  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="hoi-an-boat-wrap">
      <div class="hoi-an-boat-status" id="boat-status">Thuyền sông đêm Hội An · 0/${totalPairs} đèn lồng</div>
    </div>
  `;
  const boatMount = heroHost.querySelector<HTMLElement>('.hoi-an-boat-wrap')!;
  const boatStatusEl = heroHost.querySelector<HTMLElement>('#boat-status')!;
  const boatScene = new HoiAnBoatScene(boatMount, totalPairs);

  stage.gameArea.innerHTML = `
    <p class="memory-hud">Ghép đèn lồng: từ tiếng Anh ↔ tiếng Việt · <span id="pairs-left">${totalPairs}</span> cặp còn lại</p>
    <div class="lantern-grid" id="grid"></div>
  `;
  const grid = stage.gameArea.querySelector<HTMLElement>('#grid')!;
  const pairsLeftEl = stage.gameArea.querySelector<HTMLElement>('#pairs-left')!;

  const matchedIds = new Set<string>();
  let keyboardSelect: ((idx: number) => void) | null = null;

  const renderGrid = () => {
    grid.innerHTML = cards
      .map(
        (c) => `
      <button type="button" class="lantern-card ${matchedIds.has(c.id) ? 'lantern-card--matched' : ''}"
        data-id="${c.id}" aria-label="đèn lồng" ${matchedIds.has(c.id) ? 'disabled' : ''}>
        <span class="lantern-card__back"><span class="lantern-card__back-icon"></span></span>
        <span class="lantern-card__face">
          <img class="edu-visual-thumb" src="${c.artUrl}" alt="${escapeAttr(c.label)}" />
          <strong>${c.label}</strong>
        </span>
      </button>`
      )
      .join('');
    grid.querySelectorAll<HTMLButtonElement>('.lantern-card').forEach((btn) => {
      const card = cards.find((c) => c.id === btn.dataset.id)!;
      if (btn.classList.contains('lantern-card--matched')) return;
      btn.addEventListener('click', () => onFlip(btn, card));
    });
    keyboardSelect = (idx: number) => {
      const live = Array.from(grid.querySelectorAll<HTMLButtonElement>('.lantern-card:not(.lantern-card--matched)'));
      const btn = live[idx];
      if (!btn) return;
      const card = cards.find((c) => c.id === btn.dataset.id);
      if (!card) return;
      onFlip(btn, card);
    };
  };

  const startSessionTimer = () => {
    timer.start(
      sessionMs,
      (remaining) => {
        syncTimerBar(stage.timerFillEl, remaining, sessionMs, timerSfx);
      },
      () => void endSession()
    );
  };

  const endSession = async () => {
    timer.stop();
    const result = await tracker.finish();
    onDone(result);
  };

  const onFlip = (btn: HTMLButtonElement, card: MemoryCard) => {
    if (lock || btn.classList.contains('lantern-card--open') || btn.classList.contains('lantern-card--matched'))
      return;
    btn.classList.add('lantern-card--open');
    playSfx('flip');
    flipped.push(card);
    if (flipped.length < 2) return;
    lock = true;
    const [a, b] = flipped;
    const ok = a.pairId === b.pairId && a.face !== b.face;
    const openBtns = grid.querySelectorAll<HTMLButtonElement>('.lantern-card--open');
    openBtns.forEach((b) => b.classList.add('lantern-card--checking'));
    stage.setFeedback('Đang kiểm tra cặp đèn lồng...', undefined);
    setTimeout(() => {
      const btns = grid.querySelectorAll<HTMLButtonElement>('.lantern-card--open');
      if (ok) {
        matched++;
        boatScene.onCorrectPair();
        flipped.forEach((c) => matchedIds.add(c.id));
        tracker.recordRound(true, Date.now() - roundStart);
        btns.forEach((b) => {
          b.classList.remove('lantern-card--open');
          b.classList.remove('lantern-card--checking');
          b.classList.add('lantern-card--matched');
          b.disabled = true;
        });
        pairsLeftEl.textContent = String(totalPairs - matched);
        boatStatusEl.textContent =
          matched >= totalPairs
            ? '🎆 Đã treo đủ đèn lồng! Pháo hoa mừng trên sông!'
            : `Thuyền sông đêm Hội An · ${matched}/${totalPairs} đèn lồng`;
        stage.setGameFeedback('correct');
        if (matched >= totalPairs) {
          setTimeout(() => void endSession(), ANSWER_FEEDBACK_MS);
        }
      } else {
        boatScene.onWrongPair();
        tracker.recordRound(false, Date.now() - roundStart);
        btns.forEach((b) => {
          b.classList.remove('lantern-card--open');
          b.classList.remove('lantern-card--checking');
        });
        stage.setGameFeedback('wrong');
      }
      flipped = [];
      lock = false;
    }, ANSWER_FEEDBACK_MS);
  };

  stage.updateDots(0, totalPairs);
  renderGrid();
  startSessionTimer();

  const onKeyDown = (e: KeyboardEvent) => {
    if (lock || !keyboardSelect) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx <= 8) {
      e.preventDefault();
      keyboardSelect(idx);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    timer.stop();
    boatScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  };
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;');
}
