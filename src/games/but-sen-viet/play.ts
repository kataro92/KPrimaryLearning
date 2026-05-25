import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { cancelSpeech, speakVietnamese } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { playSfx } from '@/features/audio/sfxService';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { bindGameLifecycle, createGameSession } from '@/features/gameplay/gameSession';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { ButSenPenScene } from './butSenPenScene';
import {
  generateChallenges,
  questionCount,
  timeForChallengeMs,
  type SpellingChallenge,
} from './questions';
import { consumeTelexWord } from '@/features/input/telexConverter';

export type { PlayResult };

function graphemes(s: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('vi', { granularity: 'grapheme' });
    return [...seg.segment(s.normalize('NFC'))].map((x) => x.segment);
  }
  return [...s.normalize('NFC')];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.every((item, i) => item === arr[i])) {
    [a[0], a[1]] = [a[1], a[0]];
  }
  return a;
}

function scrambledAnswerChars(answer: string): string[] {
  const chars = graphemes(answer.normalize('NFC')).filter((ch) => ch !== ' ');
  return shuffle(chars);
}

export function renderButSenVietGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'but-sen-viet';
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

  const session = createGameSession();
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--but-sen');
  stage.setFeedback('');
  cancelSpeech();
  sceneHost.setParallaxSway(false);

  const heroHost = stage.root.querySelector<HTMLElement>('#game-hero')!;
  heroHost.innerHTML = `
    <div class="but-sen-hero">
      <div class="but-sen-hero__canvas-host" id="but-sen-pen-canvas"></div>
      <p class="but-sen-hero__caption">Bút Sen — gõ đúng để mực chảy</p>
    </div>
  `;
  const penMount = heroHost.querySelector<HTMLElement>('#but-sen-pen-canvas')!;
  const penScene = new ButSenPenScene(penMount);
  let correctCount = 0;

  let index = 0;
  let questionStarted = Date.now();
  let roundLocked = false;
  let typedLen = 0;
  let currentChallenge: SpellingChallenge | null = null;
  let targetWord = '';
  let timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  let composing = false;

  stage.gameArea.innerHTML = `
    <div class="but-sen-play">
      <p class="but-sen-play__sentence">
        <span id="ctx-before"></span><span class="but-sen-play__gap" id="target-slot">…</span><span id="ctx-after"></span>
      </p>
      <div class="but-sen-play__row">
        <input
          type="text"
          class="but-sen-play__ime"
          id="typing-ime"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          inputmode="text"
          placeholder="Gõ từ còn thiếu (Telex: ee, aa, ow, dd…)"
          aria-label="Ô gõ chữ"
        />
        <div class="but-sen-play__hint-chars" id="hint-chars"></div>
      </div>
    </div>
  `;

  const imeInput = stage.gameArea.querySelector<HTMLInputElement>('#typing-ime')!;
  const hintCharsEl = stage.gameArea.querySelector<HTMLElement>('#hint-chars')!;
  const ctxBefore = stage.gameArea.querySelector<HTMLElement>('#ctx-before')!;
  const ctxAfter = stage.gameArea.querySelector<HTMLElement>('#ctx-after')!;
  const targetSlot = stage.gameArea.querySelector<HTMLElement>('#target-slot')!;
  const sentenceEl = stage.gameArea.querySelector<HTMLElement>('.but-sen-play__sentence')!;

  const renderHintChars = (answer: string) => {
    hintCharsEl.replaceChildren();
    for (const ch of scrambledAnswerChars(answer)) {
      const span = document.createElement('span');
      span.className = 'but-sen-play__hint-char';
      span.textContent = ch;
      hintCharsEl.appendChild(span);
    }
  };

  const targetGraphemes = () => graphemes(targetWord);

  const syncSentenceDisplay = () => {
    if (!currentChallenge) return;
    ctxBefore.textContent = currentChallenge.before;
    ctxAfter.textContent = currentChallenge.after;
    const chars = targetGraphemes();
    const typed = chars.slice(0, typedLen).join('');
    const done = typedLen >= chars.length;
    targetSlot.textContent = done ? chars.join('') : typed + (typedLen < chars.length ? '…' : '');
    targetSlot.classList.toggle('but-sen-play__gap--done', done);
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
    imeInput.disabled = true;
  };

  const unlockTypingUi = () => {
    imeInput.disabled = false;
  };

  const finishRound = (ok: boolean, timeout = false) => {
    timer.stop();
    roundLocked = true;
    lockTypingUi();
    tracker.recordRound(ok, Date.now() - questionStarted);
    stage.setGameFeedback(timeout ? 'timeout' : ok ? 'correct' : 'wrong');
    if (ok) {
      correctCount++;
      penScene.onCorrect();
      penScene.setProgress(correctCount, challenges.length);
      index++;
    } else if (!timeout) {
      penScene.onWrong();
    }
    const last = index >= challenges.length;
    if (last) {
      penScene.celebrateComplete();
      session.delay(() => void tracker.finish().then(onDone), 450);
      return;
    }
    if (ok) {
      session.scheduleAfterAnswer(
        false,
        () => showChallenge(challenges[index]),
        () => tracker.finish().then(onDone)
      );
      return;
    }
    index++;
    session.scheduleAfterAnswer(
      index >= challenges.length,
      () => showChallenge(challenges[index]),
      () => tracker.finish().then(onDone)
    );
  };

  const completeWord = () => {
    roundLocked = true;
    timer.stop();
    playSfx('pop');
    typedLen = targetGraphemes().length;
    syncSentenceDisplay();
    imeInput.value = '';
    imeInput.blur();
    session.delay(() => finishRound(true), 400);
  };

  const showWrong = () => {
    playSfx('wrong');
    sentenceEl.classList.add('but-sen-play__sentence--shake');
    session.delay(() => sentenceEl.classList.remove('but-sen-play__sentence--shake'), 350);
  };

  const syncAfterType = () => {
    syncSentenceDisplay();
    if (typedLen >= targetGraphemes().length) completeWord();
  };

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

  const flushImeInput = () => applyInputBuffer(imeInput.value);

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
        syncAfterType();
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
  stage.gameArea.addEventListener('click', focusIme);

  const showChallenge = (c: SpellingChallenge) => {
    currentChallenge = c;
    targetWord = c.answer;
    typedLen = 0;
    roundLocked = false;
    unlockTypingUi();
    stage.updateDots(index, challenges.length);
    stage.setFeedback('');
    syncSentenceDisplay();
    renderHintChars(c.answer);
    imeInput.value = '';
    focusIme();
    const readAloud = `${c.before} … ${c.after}`.replace(/\s+/g, ' ').trim();
    if (readAloud.length > 2) speakVietnamese(readAloud);
    questionStarted = Date.now();
    startTimer(timeForChallengeMs(level, c.answer));
  };

  stage.updateDots(0, challenges.length);
  showChallenge(challenges[0]);

  return bindGameLifecycle(sceneHost, () => {
    penScene.dispose();
    timer.stop();
    session.dispose();
    imeInput.removeEventListener('compositionstart', onCompositionStart);
    imeInput.removeEventListener('compositionend', onCompositionEnd);
    imeInput.removeEventListener('input', onInput);
    imeInput.removeEventListener('keydown', onImeKeyDown);
    stage.gameArea.removeEventListener('click', focusIme);
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}
