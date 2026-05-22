import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { playSfx } from '@/features/audio/sfxService';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { scheduleAfterAnswer, setRoundHint, WAIT_NEXT_HINT } from '@/features/gameplay/roundUi';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import {
  generateChallenges,
  questionCount,
  timeForChallengeMs,
  type SpellingChallenge,
} from './questions';
import { consumeTelexWord } from '@/features/input/telexConverter';
import { TypingRunnerScene } from './typingRunnerScene';

export type { PlayResult };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tách theo ký tự hiển thị (hỗ trợ dấu tiếng Việt) */
function graphemes(s: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('vi', { granularity: 'grapheme' });
    return [...seg.segment(s)].map((x) => x.segment);
  }
  return [...s.normalize('NFC')];
}

function virtualKeyChoices(next: string, c: SpellingChallenge): string[] {
  const pool = new Set<string>();
  for (const d of c.distractors) {
    for (const ch of d) if (ch !== ' ') pool.add(ch);
  }
  for (const ch of c.answer) if (ch !== ' ') pool.add(ch);
  pool.delete(next);
  const wrong = shuffle([...pool]).slice(0, 2);
  while (wrong.length < 2) {
    wrong.push(['s', 'x', 'a', 'e', 'o'][wrong.length]!);
  }
  return shuffle([next, ...wrong.slice(0, 2)]);
}

export function renderNetChuRongTienGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'net-chu-rong-tien';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const challenges = generateChallenges(questionCount(level), level);
  const startedAt = Date.now();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: challenges.length,
    targetTimeSec: 12,
    startedAt,
  });

  const stage = createGameStage(root, sceneHost, gameId, 'game-play--net-chu');
  const runner = new TypingRunnerScene(sceneHost);
  let index = 0;
  let questionStarted = Date.now();
  let roundLocked = false;
  let typedLen = 0;
  let currentChallenge: SpellingChallenge | null = null;
  let targetWord = '';
  let timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  let rafId = 0;
  let composing = false;
  let imeInput: HTMLInputElement;

  const loop = () => {
    runner.tick();
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  stage.gameArea.innerHTML = `
    <div class="mario-typing">
      <p class="mario-typing__banner">⌨ Gõ chữ — Mario Rồng Tiên chạy!</p>
      <div class="mario-typing__sentence">
        <span class="mario-typing__ctx" id="ctx-before"></span>
        <span class="mario-typing__gap" id="target-slot">???</span>
        <span class="mario-typing__ctx" id="ctx-after"></span>
      </div>
      <p class="mario-typing__hint" id="hint-line"></p>
      <div class="mario-typing__blocks" id="letter-strip" aria-label="Các khối chữ cần gõ"></div>
      <label class="mario-typing__ime">
        <span class="mario-typing__ime-label">Gõ Telex: ee=ê, aa=â, ow=ơ, dd=đ, sắc=s, huyền=f…</span>
        <input
          type="text"
          class="mario-typing__ime-input"
          id="typing-ime"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          inputmode="text"
          aria-label="Ô gõ tiếng Việt có dấu"
        />
      </label>
      <p class="mario-typing__guide">Gõ đúng từng khối — Mario tiến · ⌫ lùi</p>
      <div class="mario-typing__touch-keys" id="typing-keys"></div>
    </div>
  `;

  const stripEl = stage.gameArea.querySelector<HTMLElement>('#letter-strip')!;
  const keysEl = stage.gameArea.querySelector<HTMLElement>('#typing-keys')!;
  imeInput = stage.gameArea.querySelector<HTMLInputElement>('#typing-ime')!;
  const courseEl = stage.gameArea.querySelector<HTMLElement>('.mario-typing')!;
  const targetGraphemes = () => graphemes(targetWord);

  const renderStrip = () => {
    const chars = graphemes(targetWord);
    runner.setWord(chars, typedLen);
    stripEl.innerHTML = chars
      .map((ch, i) => {
        let cls = 'mario-block';
        if (i < typedLen) cls += ' mario-block--done';
        else if (i === typedLen) cls += ' mario-block--current';
        const label = ch === ' ' ? '␣' : ch;
        return `<span class="${cls}">${label}</span>`;
      })
      .join('');
  };

  const renderVirtualKeys = () => {
    if (!currentChallenge || typedLen >= targetGraphemes().length) {
      keysEl.innerHTML = '';
      return;
    }
    const next = targetGraphemes()[typedLen]!;
    const choices = virtualKeyChoices(next, currentChallenge);
    keysEl.innerHTML = choices
      .map(
        (ch) =>
          `<button type="button" class="mario-key" data-ch="${ch === ' ' ? ' ' : ch}">${
            ch === ' ' ? '␣' : ch
          }</button>`
      )
      .join('');
    keysEl.querySelectorAll<HTMLButtonElement>('.mario-key').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (roundLocked) return;
        handleChar(btn.dataset.ch!);
      });
    });
  };

  const updateRunner = () => {
    const total = targetGraphemes().length;
    const progress = total > 0 ? typedLen / total : 0;
    runner.setProgress(progress);
  };

  const startTimer = (perQMs: number) => {
    timer.stop();
    timer.start(
      perQMs,
      (remaining) => {
        syncTimerBar(stage.timerFillEl, remaining, perQMs, timerSfx, { warnPct: 35, dangerPct: 15 });
      },
      () => finishRound(false, true)
    );
  };

  const lockTypingUi = () => {
    courseEl?.classList.add('mario-typing--locked');
    keysEl?.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
      b.disabled = true;
    });
    if (imeInput) imeInput.disabled = true;
    setRoundHint(stage.gameArea, '#hint-line', WAIT_NEXT_HINT);
  };

  const finishRound = (ok: boolean, timeout = false) => {
    timer.stop();
    roundLocked = true;
    lockTypingUi();
    tracker.recordRound(ok, Date.now() - questionStarted);
    stage.setGameFeedback(timeout ? 'timeout' : ok ? 'correct' : 'wrong');
    index++;
    const last = index >= challenges.length;
    scheduleAfterAnswer(
      last,
      () => showChallenge(challenges[index]),
      () => tracker.finish().then(onDone)
    );
  };

  const completeWord = () => {
    roundLocked = true;
    timer.stop();
    playSfx('pop');
    const slot = stage.gameArea.querySelector<HTMLElement>('#target-slot')!;
    slot.textContent = targetWord;
    slot.classList.add('mario-typing__gap--done');
    runner.setProgress(1);
    imeInput.value = '';
    imeInput.blur();
    setTimeout(() => finishRound(true), 400);
  };

  const showWrong = () => {
    playSfx('wrong');
    stripEl.classList.add('mario-typing__blocks--shake');
    setTimeout(() => stripEl.classList.remove('mario-typing__blocks--shake'), 350);
  };

  const syncAfterType = () => {
    updateRunner();
    renderStrip();
    renderVirtualKeys();
    if (typedLen >= targetGraphemes().length) {
      completeWord();
    }
  };

  /** Xử lý buffer ô gõ — Telex (ee→ê) hoặc Unicode có dấu sẵn */
  const applyInputBuffer = (raw: string) => {
    if (roundLocked || !currentChallenge || !raw) return;

    const expected = targetGraphemes();
    const result = consumeTelexWord(expected, typedLen, raw);

    if ('partial' in result) return;

    if ('wrong' in result) {
      showWrong();
      imeInput.value = '';
      return;
    }

    typedLen = result.nextIndex;
    imeInput.value = raw.slice(result.consumedRaw);
    syncAfterType();
  };

  /** Phím màn hình — chữ có dấu sẵn */
  const handleChar = (raw: string) => {
    if (roundLocked || composing) return;
    applyInputBuffer(raw);
  };

  const flushImeInput = () => {
    applyInputBuffer(imeInput.value);
  };

  const onCompositionStart = () => {
    composing = true;
  };

  const onCompositionEnd = () => {
    composing = false;
    flushImeInput();
  };

  const onInput = () => {
    if (composing || roundLocked) return;
    flushImeInput();
  };

  const onImeKeyDown = (e: KeyboardEvent) => {
    if (roundLocked || composing) return;
    if (e.key === ' ' && targetGraphemes()[typedLen] === ' ') {
      e.preventDefault();
      applyInputBuffer(imeInput.value + ' ');
      return;
    }
    if (e.key === 'Backspace' && imeInput.value === '') {
      e.preventDefault();
      if (typedLen > 0) {
        typedLen--;
        updateRunner();
        renderStrip();
        renderVirtualKeys();
      }
    }
  };

  const focusIme = () => {
    if (!roundLocked) imeInput.focus();
  };

  imeInput.addEventListener('compositionstart', onCompositionStart);
  imeInput.addEventListener('compositionend', onCompositionEnd);
  imeInput.addEventListener('input', onInput);
  imeInput.addEventListener('keydown', onImeKeyDown);
  courseEl.addEventListener('click', focusIme);

  const showChallenge = (c: SpellingChallenge) => {
    currentChallenge = c;
    targetWord = c.answer;
    typedLen = 0;
    roundLocked = false;
    stage.updateDots(index, challenges.length);
    stage.setFeedback('');
    stage.gameArea.querySelector('#ctx-before')!.textContent = c.before;
    stage.gameArea.querySelector('#ctx-after')!.textContent = c.after;
    stage.gameArea.querySelector('#hint-line')!.textContent = c.hint
      ? `Luyện: ${c.hint}`
      : '';
    const slot = stage.gameArea.querySelector<HTMLElement>('#target-slot')!;
    slot.textContent = '???';
    slot.classList.remove('mario-typing__gap--done');
    renderStrip();
    renderVirtualKeys();
    updateRunner();
    imeInput.value = '';
    focusIme();
    speakVietnamese(`Gõ: ${c.answer}`);
    questionStarted = Date.now();
    startTimer(timeForChallengeMs(level, c.answer));
  };

  stage.updateDots(0, challenges.length);
  showChallenge(challenges[0]);

  return () => {
    cancelAnimationFrame(rafId);
    timer.stop();
    imeInput.removeEventListener('compositionstart', onCompositionStart);
    imeInput.removeEventListener('compositionend', onCompositionEnd);
    imeInput.removeEventListener('input', onInput);
    imeInput.removeEventListener('keydown', onImeKeyDown);
    courseEl.removeEventListener('click', focusIme);
    runner.dispose();
    stage.cleanup();
  };
}
