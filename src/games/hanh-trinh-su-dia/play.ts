import { useAppStore } from '@/app/store';
import type { SceneHost } from '@/core/rendering/sceneHost';
import { createSessionTracker } from '@/features/gameplay/sessionTracker';
import type { PlayResult } from '@/features/gameplay/types';
import { speakVietnamese, cancelSpeech } from '@/features/speech/speechService';
import { getGameById } from '@/games/catalog';
import { playSfx } from '@/features/audio/sfxService';
import { createTimerSfxState, syncTimerBar } from '@/features/gameplay/timerBar';
import { TimerEngine } from '@/core/engine/timerEngine';
import { createGameStage } from '@/ui/gameStage/createGameStage';
import { bindGameLifecycle, createGameSession } from '@/features/gameplay/gameSession';
import {
  generateChallenges,
  questionCount,
  timePerQuestionMs,
  activeRegionsForLevel,
  type SuDiaChallenge,
} from './questions';
import { REGION_LABELS } from './challengeTypes';
import { VietnamMapView } from './vietnamMapView';

export type { PlayResult };

const KIND_BADGE: Record<SuDiaChallenge['kind'], string> = {
  dia: 'Địa lí',
  su: 'Lịch sử',
  mix: 'Sử & Địa',
};

export function renderHanhTrinhSuDiaGame(
  root: HTMLElement,
  sceneHost: SceneHost,
  onDone: (result: PlayResult) => void
): () => void {
  const gameId = 'hanh-trinh-su-dia';
  const level = useAppStore.getState().selectedAchievementLevel as 1 | 2 | 3;
  const profileId = useAppStore.getState().playerId || 'guest';
  const game = getGameById(gameId)!;
  const challenges = generateChallenges(level, questionCount(level));
  const perMs = timePerQuestionMs(level);
  const activeRegions = activeRegionsForLevel(level);
  const startedAt = Date.now();
  const timer = new TimerEngine();
  const timerSfx = createTimerSfxState();
  const tracker = createSessionTracker({
    profileId,
    gameId,
    level,
    achievements: game.achievements,
    total: challenges.length,
    targetTimeSec: perMs / 1000,
    startedAt,
  });

  const session = createGameSession();
  const stage = createGameStage(root, sceneHost, gameId, 'game-play--su-dia');
  cancelSpeech();
  sceneHost.setParallaxSway(false);

  let index = 0;
  let questionStarted = Date.now();
  let locked = false;
  let current: SuDiaChallenge | null = null;
  let mapView: VietnamMapView | null = null;

  stage.gameArea.innerHTML = `
    <div class="su-dia-play">
      <div class="su-dia-play__prompt">
        <span class="su-dia-badge" id="su-dia-badge"></span>
        <p class="su-dia-play__text" id="su-dia-prompt"></p>
      </div>
      <div class="su-dia-play__map" id="su-dia-map-mount"></div>
      <div class="su-dia-play__card-row">
        <p class="su-dia-play__hint">Kéo thẻ hoặc chạm đúng vùng trên bản đồ</p>
        <div class="su-dia-card-wrap">
          <div class="su-dia-card" id="su-dia-card" role="button" tabindex="0" aria-grabbed="false"></div>
        </div>
      </div>
    </div>
  `;

  const badgeEl = stage.gameArea.querySelector<HTMLElement>('#su-dia-badge')!;
  const promptEl = stage.gameArea.querySelector<HTMLElement>('#su-dia-prompt')!;
  const mapMount = stage.gameArea.querySelector<HTMLElement>('#su-dia-map-mount')!;
  const cardEl = stage.gameArea.querySelector<HTMLElement>('#su-dia-card')!;

  const startTimer = () => {
    timer.stop();
    timer.start(
      perMs,
      (remaining) => {
        syncTimerBar(stage.timerFillEl, remaining, perMs, timerSfx, { warnPct: 35, dangerPct: 15 });
      },
      () => finishRound(false, true)
    );
  };

  const finishRound = (ok: boolean, timeout = false) => {
    if (locked) return;
    locked = true;
    timer.stop();
    mapView?.detachCard();
    cardEl.classList.add('su-dia-card--disabled');
    tracker.recordRound(ok, Date.now() - questionStarted);
    stage.setGameFeedback(timeout ? 'timeout' : ok ? 'correct' : 'wrong');
    index++;
    const last = index >= challenges.length;
    if (last) {
      session.delay(() => void tracker.finish().then(onDone), 450);
      return;
    }
    session.scheduleAfterAnswer(
      false,
      () => showRound(challenges[index]!),
      () => tracker.finish().then(onDone)
    );
  };

  const onDrop = (region: SuDiaChallenge['region']) => {
    const c = current;
    if (!c || locked) return;
    if (region === c.region) {
      playSfx('pop');
      mapView?.highlightRegion(region, 'ok');
      stage.setFeedback(`Đúng rồi! Thuộc ${REGION_LABELS[c.region]}.`);
      finishRound(true);
      return;
    }
    playSfx('wrong');
    mapView?.highlightRegion(region, 'bad');
    cardEl.classList.add('su-dia-card--shake');
    session.delay(() => cardEl.classList.remove('su-dia-card--shake'), 400);
    stage.setFeedback('Chưa đúng. Thử kéo vào vùng khác nhé!');
    session.delay(() => mapView?.highlightRegion(region, null), 600);
  };

  const showRound = (c: SuDiaChallenge) => {
    current = c;
    locked = false;
    stage.updateDots(index, challenges.length);
    stage.setFeedback('');
    badgeEl.textContent = KIND_BADGE[c.kind];
    badgeEl.className = `su-dia-badge su-dia-badge--${c.kind}`;
    promptEl.textContent = c.prompt;
    cardEl.textContent = c.cardLabel;
    cardEl.classList.remove('su-dia-card--disabled', 'su-dia-card--shake');
    mapView?.dispose();
    mapView = new VietnamMapView({
      mount: mapMount,
      activeRegions,
      onDrop,
    });
    mapView.setActiveRegions(activeRegions);
    mapView.attachCard(cardEl);
    speakVietnamese(c.prompt);
    questionStarted = Date.now();
    startTimer();
  };

  stage.updateDots(0, challenges.length);
  showRound(challenges[0]!);

  return bindGameLifecycle(sceneHost, () => {
    timer.stop();
    session.dispose();
    mapView?.dispose();
    mapView = null;
    sceneHost.setParallaxSway(true);
    stage.cleanup();
  });
}
