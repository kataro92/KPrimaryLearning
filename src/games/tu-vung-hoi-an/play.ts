import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameById } from '@/games/catalog';
import { playSfx } from '@/features/audio/sfxService';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { ANSWER_FEEDBACK_MS } from '@/features/gameplay/roundTiming';
import { bindGameLifecycle, createGameSession } from '@/features/gameplay/gameSession';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { selectPairs, sessionTimeMs } from './questions';
import { HoiAnBoatScene } from './boatLanternScene';
import { cancelEnglish, speakEnglish, warmEnglishVoices } from './speakEnglish';

export type { PlayResult };

type CardFace = 'en' | 'vi';

interface MemoryCard {
  id: string;
  pairId: string;
  face: CardFace;
  label: string;
  /** Emoji/hình minh hoạ — chỉ gắn ở mặt tiếng Việt để ghép tranh ↔ từ. */
  emoji?: string;
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
  // Cấp 1: chế độ ghép trực tiếp (thẻ mở sẵn) để giảm tải trí nhớ cho học sinh nhỏ.
  const directMode = level === 1;
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
    },
    {
      id: `${p.en}-vi`,
      pairId: p.en,
      face: 'vi' as CardFace,
      label: p.vi,
      emoji: p.emoji,
    },
  ]);
  cards.sort(() => Math.random() - 0.5);
  warmEnglishVoices();

  let matched = 0;
  let flipped: MemoryCard[] = [];
  let lock = false;
  const roundStart = Date.now();

  const session = createGameSession();
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

  const gridRows = Math.ceil(cards.length / 4);
  const hudHint = directMode
    ? 'Chạm từ tiếng Anh rồi chạm tranh đúng'
    : 'Lật hai đèn lồng để ghép Anh ↔ Việt';
  stage.gameArea.innerHTML = `
    <p class="memory-hud">${hudHint} · còn <span id="pairs-left">${totalPairs}</span> cặp</p>
    <div class="lantern-grid${directMode ? ' lantern-grid--direct' : ''}" id="grid" style="--hoi-an-rows: ${gridRows}"></div>
    <div class="vocab-reveal" id="vocab-reveal" aria-live="polite"></div>
  `;
  const grid = stage.gameArea.querySelector<HTMLElement>('#grid')!;
  const pairsLeftEl = stage.gameArea.querySelector<HTMLElement>('#pairs-left')!;
  const revealEl = stage.gameArea.querySelector<HTMLElement>('#vocab-reveal')!;
  const GRID_COLS = 4;
  const SEL_CLASS = directMode ? 'lantern-card--selected' : 'lantern-card--open';
  const SEL_SELECTOR = `.${SEL_CLASS}`;

  const showReveal = (en: string, vi: string, emoji?: string) => {
    revealEl.innerHTML = `${
      emoji ? `<span class="vocab-reveal__emoji" aria-hidden="true">${emoji}</span>` : ''
    }<span class="vocab-reveal__text"><b>${escapeHtml(en)}</b> = ${escapeHtml(vi)}</span>`;
    revealEl.classList.add('vocab-reveal--show');
    session.delay(() => revealEl.classList.remove('vocab-reveal--show'), 1400);
  };

  const matchedIds = new Set<string>();
  let keyboardSelect: ((idx: number) => void) | null = null;

  const renderGrid = () => {
    grid.innerHTML = cards
      .map(
        (c) => `
      <button type="button" class="lantern-card ${matchedIds.has(c.id) ? 'lantern-card--matched' : ''}${directMode ? ' lantern-card--open lantern-card--static' : ''}"
        data-id="${c.id}" aria-label="thẻ từ vựng ${escapeAttr(c.label)}" ${matchedIds.has(c.id) ? 'disabled' : ''}>
        <span class="lantern-card__back"><span class="lantern-card__back-icon"></span></span>
        <span class="lantern-card__face vocab-play-card ${c.emoji ? 'vocab-play-card--pic' : ''}">
          ${c.emoji ? `<span class="vocab-play-card__emoji" aria-hidden="true">${c.emoji}</span>` : ''}
          <span class="vocab-play-card__word">${escapeHtml(c.label)}</span>
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
    if (lock || btn.classList.contains(SEL_CLASS) || btn.classList.contains('lantern-card--matched'))
      return;
    btn.classList.add(SEL_CLASS);
    playSfx('flip');
    if (card.face === 'en') speakEnglish(card.label);
    flipped.push(card);
    if (flipped.length < 2) return;
    lock = true;
    const [a, b] = flipped;
    const ok = a.pairId === b.pairId && a.face !== b.face;
    const openBtns = grid.querySelectorAll<HTMLButtonElement>(SEL_SELECTOR);
    openBtns.forEach((b) => b.classList.add('lantern-card--checking'));
    stage.setFeedback(directMode ? 'Đang kiểm tra...' : 'Đang kiểm tra cặp đèn lồng...', undefined);
    session.delay(() => {
      const btns = grid.querySelectorAll<HTMLButtonElement>(SEL_SELECTOR);
      if (ok) {
        matched++;
        boatScene.onCorrectPair();
        const enCard = a.face === 'en' ? a : b;
        const viCard = a.face === 'en' ? b : a;
        showReveal(enCard.label, viCard.label, viCard.emoji);
        flipped.forEach((c) => matchedIds.add(c.id));
        tracker.recordRound(true, Date.now() - roundStart);
        btns.forEach((b) => {
          b.classList.remove(SEL_CLASS);
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
          session.delay(() => void endSession(), ANSWER_FEEDBACK_MS);
        }
      } else {
        boatScene.onWrongPair();
        tracker.recordRound(false, Date.now() - roundStart);
        btns.forEach((b) => {
          b.classList.remove(SEL_CLASS);
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

  const moveFocus = (delta: number) => {
    const all = Array.from(grid.querySelectorAll<HTMLButtonElement>('.lantern-card'));
    if (!all.length) return;
    const active = document.activeElement;
    const cur = all.findIndex((b) => b === active);
    if (cur < 0) {
      all.find((b) => !b.disabled)?.focus();
      return;
    }
    for (let i = cur + delta; i >= 0 && i < all.length; i += delta) {
      if (!all[i].disabled) {
        all[i].focus();
        return;
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (lock) return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        return moveFocus(-1);
      case 'ArrowRight':
        e.preventDefault();
        return moveFocus(1);
      case 'ArrowUp':
        e.preventDefault();
        return moveFocus(-GRID_COLS);
      case 'ArrowDown':
        e.preventDefault();
        return moveFocus(GRID_COLS);
      default:
        break;
    }
    if (!keyboardSelect) return;
    const idx = Number(e.key) - 1;
    if (idx >= 0 && idx <= 8) {
      e.preventDefault();
      keyboardSelect(idx);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  return bindGameLifecycle(sceneHost, () => {
    window.removeEventListener('keydown', onKeyDown);
    cancelEnglish();
    timer.stop();
    session.dispose();
    boatScene.dispose();
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
