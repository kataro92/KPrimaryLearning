/**
 * World Cup 2026 — 2.5D Three.js pitch (side-view, matches Thiet_Ke_Game_Soccer_Quiz.md)
 */

import * as THREE from 'three';
import { FrameLoop } from '@/core/rendering/frameLoop';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import {
  bezierPoint,
  easeInOutCubic,
  easeInOutQuad,
  easeOutCubic,
  lerp,
  runSequence,
} from './animation';
import { loadBallWithFallback, loadGoalWithFallback, loadPlayerModelWithFallback, repaintPlayerGlb } from './graphics/AssetLoader';
import { animateGlbPlayer, disposeGlbPlayerAnimations, isGlbPlayer } from './graphics/glbPlayerAnim';
import {
  applyStadiumFlash,
  applyWrongAnswerDim,
  configureRenderer,
  createLightingRig,
  enableShadows,
  type LightingRig,
} from './graphics/LightingRig';
import {
  BALL_BASE,
  DEFENDER_BASE,
  DRIBBLE_OFFSET,
  GOAL_RECT,
  GK_BASE,
  PARALLAX,
  STRIKER_BASE,
} from './graphics/sceneConstants';
import { applyPitchPerspectiveX } from './graphics/pitchPerspective';
import {
  animateGoalNet,
  createVfxSystem,
  makeBlobShadow,
  shakeCameraOffset,
  tickBlockRing,
  tickConfetti,
  triggerBlockRing,
  triggerConfetti,
  updateVfx,
  type VfxHandles,
} from './graphics/VfxSystem';
import { createQuizBoard3D, type QuizBoard3D } from './graphics/QuizBoard3D';
import { loadOptionalWorldTextures } from './graphics/optionalWorldTextures';
import {
  buildWorldLayers,
  pulseCrowd,
  updateBannerColors,
  type WorldLayers,
} from './graphics/WorldPropKit';
import type { QuizQuestion, SceneSnapshot, ShotType } from './types';
import {
  animatePlayerRig,
  attachPlayerRig,
  buildPlayerRig,
  getPlayerRig,
  kitFromFlag,
  opponentKitFromFlag,
  recolorPlayerKit,
} from './playerRig';

export interface Scene3DCallbacks {
  onSequenceDone: () => void;
  onQuizAnswer?: (index: number) => void;
}

export interface SetStageOptions {
  hardReset?: boolean;
}

function shotCurve(shot: ShotType, isBoss: boolean): {
  peak: { x: number; y: number };
  end: { x: number; y: number };
} {
  const target = isBoss
    ? {
        x: GOAL_RECT.nxMin + (GOAL_RECT.nxMax - GOAL_RECT.nxMin) * 0.35,
        y: (GOAL_RECT.nyMin + GOAL_RECT.nyMax) / 2,
      }
    : { x: DEFENDER_BASE.x - 0.012, y: DEFENDER_BASE.y };
  const midX = (STRIKER_BASE.x + target.x) * 0.5;
  if (shot === 'A') return { peak: { x: midX, y: STRIKER_BASE.y - 0.17 }, end: target };
  if (shot === 'B') return { peak: { x: midX, y: STRIKER_BASE.y - 0.07 }, end: target };
  return { peak: { x: midX + 0.03, y: STRIKER_BASE.y + 0.01 }, end: target };
}

declare global {
  interface Window {
    __THREE_GAME_DIAGNOSTICS__?: Record<string, number>;
  }
}

export class WorldCupScene3D {
  private mount: HTMLElement;
  private callbacks: Scene3DCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private lighting!: LightingRig;
  private world!: WorldLayers;
  private vfx!: VfxHandles;
  private frame: FrameLoop | null = null;
  private cancelSeq: (() => void) | null = null;
  private idleT = 0;
  private runCycle = 0;
  private kickAnimT = 0;
  private gkDiveT = 0;
  private active = true;
  private viewHalfH = 4;
  private viewHalfW = 7;
  private blockRingT = 0;
  private confettiT = 0;
  private wrongDimT = 0;
  private stadiumFlashT = 0;
  private cameraShakeT = 0;
  private frameDt = 0.016;

  private bgFarGroup = new THREE.Group();
  private bgMidGroup = new THREE.Group();
  private pitchGroup = new THREE.Group();
  private scrollGroup = new THREE.Group();
  private striker!: THREE.Group;
  private defenderOutfield!: THREE.Group;
  private defenderGk!: THREE.Group;
  private defenderActive!: THREE.Group;
  private ball!: THREE.Group;
  private goalGroup = new THREE.Group();
  private goalNetMeshes: THREE.Mesh[] = [];
  private kickFlashT = 0;
  private strikerShadow!: THREE.Mesh;
  private defenderShadow!: THREE.Mesh;
  private ballShadow!: THREE.Mesh;
  private cameraPanX = 0;
  private targetCameraPanX = 0;
  private countryFlagColors: [string, string, string] = ['#2563eb', '#ffffff', '#1e3a8a'];
  private quizBoard!: QuizBoard3D;
  private currentQuiz: QuizQuestion | null = null;
  private quizInputLocked = false;
  private raycaster = new THREE.Raycaster();
  private pointerNdc = new THREE.Vector2();
  private removeQuizPointer: (() => void) | null = null;

  snapshot: SceneSnapshot = {
    phase: 'idle',
    stage: 1,
    isBoss: false,
    scrollOffset: 0,
    strikerX: STRIKER_BASE.x,
    strikerY: STRIKER_BASE.y,
    defenderX: DEFENDER_BASE.x,
    defenderY: DEFENDER_BASE.y,
    ball: { x: BALL_BASE.x, y: BALL_BASE.y, progress: 0 },
    hitFlash: 0,
    netShake: 0,
    celebrate: 0,
    disappointment: 0,
    shot: null,
    correct: null,
    trailIntensity: 0,
  };

  constructor(mount: HTMLElement, callbacks: Scene3DCallbacks) {
    this.mount = mount;
    this.callbacks = callbacks;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    configureRenderer(this.renderer);
    this.renderer.domElement.className = 'wc-three-canvas';
    this.mount.insertBefore(this.renderer.domElement, this.mount.firstChild);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x7dd3fc, 14, 32);
    this.camera = new THREE.OrthographicCamera(-7, 7, 4, -4, 0.1, 50);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    this.lighting = createLightingRig();
    this.scene.add(this.lighting.root);

    this.vfx = createVfxSystem();

    this.quizBoard = createQuizBoard3D((nx, ny) => this.normToWorld(nx, ny));
    this.quizBoard.setVisible(false);
    this.scene.add(this.quizBoard.root);
    this.bindQuizPointer();

    window.addEventListener('resize', this.resize);
    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    const loaded = await loadOptionalWorldTextures();
    if (!this.mount.isConnected) return;

    if (loaded.sky) {
      this.scene.fog = null;
      this.renderer.setClearColor(0x7a3e12, 1);
      this.mount.classList.add('wc-play-stage--sky-art');
    }

    this.world = buildWorldLayers({
      normToWorld: (nx, ny) => this.normToWorld(nx, ny),
      flagColors: this.countryFlagColors,
      grassAnisotropy: this.renderer.capabilities.getMaxAnisotropy(),
      optionalTextures: {
        sky: loaded.sky ?? undefined,
        grass: loaded.grass ?? undefined,
      },
    });

    this.bgFarGroup.add(this.world.bgFar);
    this.bgMidGroup.add(this.world.bgMid);
    this.pitchGroup.add(this.world.playfield);
    this.pitchGroup.add(this.world.fgProps);
    this.scrollGroup.add(this.vfx.root);
    this.scene.add(this.bgFarGroup, this.bgMidGroup, this.pitchGroup, this.scrollGroup);

    void this.initActors();
    this.resize();
    this.frame = new FrameLoop(this.loop, 60);
    this.frame.start();
  }

  private async initActors(): Promise<void> {
    this.striker = await this.spawnPlayer('striker');
    this.defenderOutfield = await this.spawnPlayer('defender');
    this.defenderGk = await this.spawnPlayer('gk');
    this.defenderGk.visible = false;
    this.defenderActive = this.defenderOutfield;
    this.ball = await loadBallWithFallback();

    this.strikerShadow = makeBlobShadow();
    this.defenderShadow = makeBlobShadow();
    this.ballShadow = makeBlobShadow(0.12);
    this.ballShadow.scale.set(0.65, 0.65, 1);

    await this.rebuildGoal();
    enableShadows(this.striker, true, false);
    enableShadows(this.defenderOutfield, true, false);
    enableShadows(this.defenderGk, true, false);
    enableShadows(this.ball, true, false);

    this.scrollGroup.add(
      this.strikerShadow,
      this.defenderShadow,
      this.ballShadow,
      this.striker,
      this.defenderOutfield,
      this.defenderGk,
      this.ball
    );
    this.applyPlayerKits();
    this.resetPositions();
  }

  private async rebuildGoal(): Promise<void> {
    this.scrollGroup.remove(this.goalGroup);
    disposeObject3D(this.goalGroup);
    this.goalGroup = new THREE.Group();
    const topLeft = this.normToWorld(GOAL_RECT.nxMin, GOAL_RECT.nyMin);
    const bottomRight = this.normToWorld(GOAL_RECT.nxMax, GOAL_RECT.nyMax);
    const built = await loadGoalWithFallback(topLeft, bottomRight);
    this.goalGroup = built.group;
    this.goalNetMeshes = built.netMeshes;
    this.goalGroup.visible = this.snapshot.isBoss;
    this.scrollGroup.add(this.goalGroup);
  }

  setView(mode: 'menu' | 'play'): void {
    this.active = mode === 'play';
    this.quizBoard.setVisible(mode === 'play' && this.currentQuiz !== null);
    if (mode === 'play') this.forceResize();
  }

  setQuiz(question: QuizQuestion): void {
    this.currentQuiz = question;
    this.quizInputLocked = false;
    this.quizBoard.setVisible(true);
    this.quizBoard.setQuestion(question.prompt, this.snapshot.isBoss ? 'gk' : 'defender');
    this.quizBoard.setOptions(question.options);
    this.quizBoard.setEnabled(true);
    this.quizBoard.setHighlight(null);
    this.quizBoard.setFeedback('');
  }

  setQuizAnswersEnabled(enabled: boolean): void {
    this.quizInputLocked = !enabled;
    this.quizBoard.setEnabled(enabled);
  }

  highlightQuizAnswer(index: number | null): void {
    this.quizBoard.setHighlight(index);
  }

  fadeOtherQuizAnswers(selected: number): void {
    this.quizBoard.fadeOthers(selected);
  }

  setQuizFeedback(text: string, kind: 'ok' | 'bad' | 'neutral' = 'neutral'): void {
    this.quizBoard.setFeedback(text, kind);
  }

  private bindQuizPointer(): void {
    const onPointer = (e: PointerEvent) => {
      if (!this.active || this.quizInputLocked || !this.currentQuiz) return;
      const rect = this.renderer.domElement.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      this.pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);
      const idx = this.quizBoard.pick(this.raycaster);
      if (idx !== null) this.callbacks.onQuizAnswer?.(idx);
    };
    this.renderer.domElement.addEventListener('pointerdown', onPointer);
    this.removeQuizPointer = () => this.renderer.domElement.removeEventListener('pointerdown', onPointer);
  }

  setCountryColors(colors: [string, string, string]): void {
    this.countryFlagColors = colors;
    updateBannerColors(this.bgMidGroup, colors);
    updateBannerColors(this.world.fgProps, colors);
    this.applyPlayerKits();
  }

  private applyPlayerKits(): void {
    if (isGlbPlayer(this.striker)) {
      repaintPlayerGlb(this.striker, 'striker', this.countryFlagColors);
    } else {
      const strikerRig = getPlayerRig(this.striker);
      if (strikerRig) recolorPlayerKit(strikerRig, kitFromFlag(this.countryFlagColors));
    }
    if (isGlbPlayer(this.defenderOutfield)) {
      repaintPlayerGlb(this.defenderOutfield, 'defender', this.countryFlagColors);
    } else {
      const defenderRig = getPlayerRig(this.defenderOutfield);
      if (defenderRig) recolorPlayerKit(defenderRig, opponentKitFromFlag(this.countryFlagColors));
    }
    if (isGlbPlayer(this.defenderGk)) {
      repaintPlayerGlb(this.defenderGk, 'gk', this.countryFlagColors);
    }
  }

  setStage(stage: 1 | 2 | 3 | 4, options: SetStageOptions = {}): void {
    const wasBoss = this.snapshot.isBoss;
    this.snapshot.stage = stage;
    this.snapshot.isBoss = stage === 4;
    if (stage === 4 !== wasBoss) {
      this.swapDefender(stage === 4);
      void this.rebuildGoal();
    }
    this.goalGroup.visible = stage === 4;
    if (options.hardReset) this.resetPositions();
  }

  forceResize(): void {
    this.resize();
  }

  resetPositions(): void {
    const defBase = this.snapshot.isBoss ? GK_BASE : DEFENDER_BASE;
    this.snapshot.scrollOffset = 0;
    this.snapshot.strikerX = STRIKER_BASE.x;
    this.snapshot.strikerY = STRIKER_BASE.y;
    this.snapshot.defenderX = defBase.x;
    this.snapshot.defenderY = defBase.y;
    this.snapshot.ball = { x: BALL_BASE.x, y: BALL_BASE.y, progress: 0 };
    this.snapshot.hitFlash = 0;
    this.snapshot.netShake = 0;
    this.snapshot.celebrate = 0;
    this.snapshot.disappointment = 0;
    this.snapshot.phase = 'idle';
    this.snapshot.shot = null;
    this.snapshot.correct = null;
    this.snapshot.trailIntensity = 0;
    this.runCycle = 0;
    this.kickAnimT = 0;
    this.gkDiveT = 0;
    this.blockRingT = 0;
    this.confettiT = 0;
    this.wrongDimT = 0;
    this.stadiumFlashT = 0;
    this.scrollGroup.position.x = 0;
    this.bgFarGroup.position.x = 0;
    this.bgMidGroup.position.x = 0;
    this.pitchGroup.position.x = 0;
    this.cameraPanX = 0;
    this.targetCameraPanX = 0;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.lookAt(0, 0, 0);
    this.ball.rotation.set(0, 0, 0);
    applyWrongAnswerDim(this.lighting.lights, 0);
    applyStadiumFlash(this.lighting.lights, 0);
    this.applySnapshotToMeshes();
  }

  playShot(shot: ShotType, correct: boolean): void {
    if (this.snapshot.phase !== 'idle' && this.snapshot.phase !== 'selecting') return;
    this.cancelSeq?.();
    this.snapshot.shot = shot;
    this.snapshot.correct = correct;
    this.snapshot.trailIntensity = this.snapshot.isBoss && correct ? 1 : 0;
    this.snapshot.phase = 'kicking';

    this.cancelSeq = runSequence({
      durationMs: 320,
      onUpdate: (t) => {
        const p = easeOutCubic(t);
        this.kickAnimT = p;
        this.snapshot.strikerX = lerp(STRIKER_BASE.x, STRIKER_BASE.x + 0.055, p);
        this.snapshot.strikerY = STRIKER_BASE.y;
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.kickAnimT = 1;
        this.flyBall(correct);
      },
    });
  }

  dispose(): void {
    this.frame?.dispose();
    this.cancelSeq?.();
    this.removeQuizPointer?.();
    window.removeEventListener('resize', this.resize);
    disposeGlbPlayerAnimations(this.striker);
    disposeGlbPlayerAnimations(this.defenderOutfield);
    disposeGlbPlayerAnimations(this.defenderGk);
    disposeObject3D(this.scene);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private spawnPlayer(role: 'striker' | 'defender' | 'gk'): Promise<THREE.Group> {
    return loadPlayerModelWithFallback(role, this.countryFlagColors, () => {
      const wrapper = new THREE.Group();
      attachPlayerRig(wrapper, buildPlayerRig(role === 'gk', role === 'striker'));
      return wrapper;
    });
  }

  private swapDefender(isGk: boolean): void {
    this.defenderActive.visible = false;
    this.defenderActive = isGk ? this.defenderGk : this.defenderOutfield;
    this.defenderActive.visible = true;
    if (!isGlbPlayer(this.defenderActive)) {
      const defenderRig = getPlayerRig(this.defenderActive);
      if (defenderRig && !defenderRig.isGk) {
        recolorPlayerKit(defenderRig, opponentKitFromFlag(this.countryFlagColors));
      }
    }
  }

  private setBallAtStriker(offsetX = DRIBBLE_OFFSET, offsetY = BALL_BASE.y - STRIKER_BASE.y): void {
    this.snapshot.ball = {
      x: this.snapshot.strikerX + offsetX,
      y: this.snapshot.strikerY + offsetY,
      progress: 0,
    };
  }

  private normToWorld(nx: number, ny: number): THREE.Vector3 {
    const rectX = (nx - 0.5) * this.viewHalfW * 2;
    const y = (0.5 - ny) * this.viewHalfH * 2;
    const x = applyPitchPerspectiveX(ny, rectX, this.viewHalfW);
    return new THREE.Vector3(x, y, 0);
  }

  private applyParallax(scrollX: number): void {
    this.scrollGroup.position.x = scrollX;
    this.bgFarGroup.position.x = scrollX * PARALLAX.bgFar;
    this.bgMidGroup.position.x = scrollX * PARALLAX.bgMid;
    this.layoutSkyBackdrop();
  }

  private applySnapshotToMeshes(): void {
    const running =
      this.snapshot.phase === 'scrolling' ||
      this.snapshot.phase === 'returning' ||
      this.snapshot.phase === 'flying';
    const idleBounce =
      this.snapshot.phase === 'idle' ? Math.sin(this.idleT * 3) * 0.008 : 0;
    const runBob = running ? Math.sin(this.runCycle) * 0.012 : 0;
    const strikerNy = this.snapshot.strikerY + (this.snapshot.disappointment ? 0.02 : 0) + idleBounce + runBob;
    const strikerPos = this.normToWorld(this.snapshot.strikerX, strikerNy);
    this.striker.position.set(strikerPos.x, strikerPos.y, 0.12);

    const defPos = this.normToWorld(this.snapshot.defenderX, this.snapshot.defenderY);
    this.defenderActive.position.set(defPos.x, defPos.y, 0.12);

    const ballPos = this.normToWorld(this.snapshot.ball.x, this.snapshot.ball.y);
    const ballLift = this.snapshot.ball.progress * 0.08;
    const squash = this.snapshot.shot === 'C' && this.snapshot.phase === 'flying' ? 1 - ballLift * 0.15 : 1;
    this.ball.position.set(ballPos.x, ballPos.y, 0.14 + ballLift);
    this.ball.scale.set(1, squash, 1);

    this.strikerShadow.position.set(strikerPos.x, strikerPos.y - 0.02, 0.02);
    this.defenderShadow.position.set(defPos.x, defPos.y - 0.02, 0.02);
    this.lighting.lights.strikerLight.position.set(strikerPos.x - 0.3, strikerPos.y + 0.5, 0.35);
    this.lighting.lights.defenderLight.position.set(defPos.x + 0.3, defPos.y + 0.45, 0.35);
    const shadowScale = Math.max(0.45, 1 - ballLift * 4);
    this.ballShadow.position.set(ballPos.x, ballPos.y - 0.02, 0.015);
    this.ballShadow.scale.set(shadowScale * 0.65, shadowScale * 0.35, 1);
    (this.ballShadow.material as THREE.MeshBasicMaterial).opacity = 0.22 + shadowScale * 0.2;

    if (this.snapshot.phase === 'flying' || this.snapshot.phase === 'scrolling') {
      this.ball.rotation.z += 0.14;
      this.ball.rotation.x += 0.08;
    }

    const scrollX = -this.snapshot.scrollOffset * this.viewHalfW * 2;
    this.applyParallax(scrollX);
    this.targetCameraPanX =
      this.snapshot.scrollOffset * 0.22 + (this.snapshot.strikerX - STRIKER_BASE.x) * 0.35;

    updateVfx(
      this.vfx,
      {
        kickFlashT: this.kickFlashT,
        hitFlash: this.snapshot.hitFlash,
        trailIntensity: this.snapshot.trailIntensity,
        phase: this.snapshot.phase,
        ballX: this.snapshot.ball.x,
        ballY: this.snapshot.ball.y,
        blockRingT: this.blockRingT,
        confettiT: this.confettiT,
        celebrate: this.snapshot.celebrate,
      },
      (nx, ny) => this.normToWorld(nx, ny)
    );

    this.goalGroup.rotation.z = this.snapshot.netShake * 0.06;
    animateGoalNet(this.goalNetMeshes, Math.abs(this.snapshot.netShake), this.idleT);

    const strikerRig = getPlayerRig(this.striker);
    const defenderRig = getPlayerRig(this.defenderActive);
    if (isGlbPlayer(this.striker)) {
      animateGlbPlayer(this.striker, this.snapshot.phase, this.idleT, this.runCycle, {
        kickT: this.snapshot.phase === 'kicking' ? this.kickAnimT : undefined,
        disappointed: this.snapshot.disappointment > 0,
        celebrate: this.snapshot.celebrate > 0 ? this.snapshot.celebrate : undefined,
      }, this.frameDt);
    } else if (strikerRig) {
      animatePlayerRig(strikerRig, this.snapshot.phase, this.idleT, this.runCycle, {
        kickT: this.snapshot.phase === 'kicking' ? this.kickAnimT : undefined,
        disappointed: this.snapshot.disappointment > 0,
        ballHoldY:
          this.snapshot.phase === 'idle' || this.snapshot.phase === 'selecting'
            ? this.snapshot.ball.y - this.snapshot.strikerY
            : undefined,
      });
    }
    if (isGlbPlayer(this.defenderActive)) {
      animateGlbPlayer(this.defenderActive, this.snapshot.phase, this.idleT, this.runCycle, {
        diveT: this.gkDiveT > 0 ? this.gkDiveT : undefined,
        diveDir: this.snapshot.shot === 'C' ? 1 : -1,
        blocking: this.snapshot.phase === 'blocking',
      }, this.frameDt);
    } else if (defenderRig) {
      animatePlayerRig(defenderRig, this.snapshot.phase, this.idleT, this.runCycle, {
        diveT: this.gkDiveT > 0 ? this.gkDiveT : undefined,
        diveDir: this.snapshot.shot === 'C' ? 1 : -1,
        blocking: this.snapshot.phase === 'blocking',
      });
    }

    if (this.snapshot.celebrate > 0 && isGlbPlayer(this.striker)) {
      pulseCrowd(this.world.crowdCards, this.snapshot.celebrate, 1);
      this.stadiumFlashT = Math.max(this.stadiumFlashT, this.snapshot.celebrate);
    } else if (this.snapshot.celebrate > 0 && strikerRig) {
      animatePlayerRig(strikerRig, 'goal', this.snapshot.celebrate, this.runCycle);
      this.striker.position.y -= this.snapshot.celebrate * 0.06;
      strikerRig.kit.torso.emissiveIntensity = 0.16 + Math.sin(this.snapshot.celebrate * 14) * 0.1;
      pulseCrowd(this.world.crowdCards, this.snapshot.celebrate, 1);
      this.stadiumFlashT = Math.max(this.stadiumFlashT, this.snapshot.celebrate);
    } else if (strikerRig) {
      strikerRig.kit.torso.emissiveIntensity = 0.16;
    }

    applyStadiumFlash(this.lighting.lights, this.stadiumFlashT);
    applyWrongAnswerDim(this.lighting.lights, this.wrongDimT);
  }

  private flyBall(correct: boolean): void {
    const shot = this.snapshot.shot!;
    const curve = shotCurve(shot, this.snapshot.isBoss);
    const start = { x: this.snapshot.ball.x, y: this.snapshot.ball.y };
    this.snapshot.phase = 'flying';
    this.kickFlashT = 1;
    const defBaseY = this.snapshot.isBoss ? GK_BASE.y : DEFENDER_BASE.y;

    this.cancelSeq = runSequence({
      durationMs: correct ? 780 : 680,
      onUpdate: (t) => {
        const p = easeInOutQuad(t);
        const pt = bezierPoint(p, start, curve.peak, curve.end);
        this.snapshot.ball = { x: pt.x, y: pt.y, progress: p };
        if (!correct && t > 0.55) {
          this.snapshot.defenderY = lerp(defBaseY, defBaseY - 0.08, (t - 0.55) / 0.45);
        } else if (correct) {
          this.snapshot.defenderY = lerp(
            defBaseY,
            defBaseY + (shot === 'C' ? -0.06 : 0.06),
            Math.min(1, t * 1.4)
          );
          if (this.snapshot.isBoss && t > 0.35) {
            this.snapshot.defenderY = lerp(defBaseY, defBaseY - 0.14, Math.min(1, (t - 0.35) / 0.45));
            this.gkDiveT = Math.min(1, (t - 0.35) / 0.5);
          } else {
            this.gkDiveT = 0;
          }
        }
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        if (correct) {
          if (this.snapshot.isBoss) this.playGoal();
          else this.advanceAfterBeat();
        } else {
          this.playBlock();
        }
      },
    });
  }

  private advanceAfterBeat(): void {
    const shot = this.snapshot.shot!;
    const beatBallX = DEFENDER_BASE.x + 0.04;
    const beatBallY = DEFENDER_BASE.y + (shot === 'C' ? 0.012 : -0.008);
    const startStrikerX = this.snapshot.strikerX;
    const startDefenderX = this.snapshot.defenderX;

    this.snapshot.phase = 'returning';

    this.cancelSeq = runSequence({
      durationMs: 520,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.snapshot.ball = {
          x: lerp(curveEndX(shot, this.snapshot.isBoss), beatBallX, p),
          y: lerp(curveEndY(shot, this.snapshot.isBoss), beatBallY, p),
          progress: 0,
        };
        this.snapshot.defenderX = lerp(startDefenderX, 0.42, p);
        this.snapshot.defenderY = lerp(DEFENDER_BASE.y, DEFENDER_BASE.y + 0.04, p);
        this.snapshot.strikerX = lerp(startStrikerX, beatBallX - DRIBBLE_OFFSET - 0.06, p * 0.55);
        this.applySnapshotToMeshes();
      },
      onComplete: () => this.chaseAndCollect(beatBallX, beatBallY),
    });
  }

  private chaseAndCollect(beatBallX: number, beatBallY: number): void {
    this.snapshot.phase = 'scrolling';
    this.runCycle = 0;

    this.cancelSeq = runSequence({
      durationMs: 680,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.runCycle += 0.28;
        const targetStrikerX = lerp(beatBallX - DRIBBLE_OFFSET - 0.06, beatBallX - DRIBBLE_OFFSET, p);
        this.snapshot.strikerX = targetStrikerX;
        this.snapshot.strikerY = lerp(STRIKER_BASE.y, STRIKER_BASE.y - 0.01, p);
        this.snapshot.ball = {
          x: lerp(beatBallX, targetStrikerX + DRIBBLE_OFFSET, p),
          y: lerp(beatBallY, STRIKER_BASE.y + (BALL_BASE.y - STRIKER_BASE.y), p),
          progress: 0,
        };
        this.snapshot.defenderX = lerp(0.42, -0.08, p);
        this.applySnapshotToMeshes();
      },
      onComplete: () => this.dribbleToNextDefender(),
    });
  }

  private dribbleToNextDefender(): void {
    const startStrikerX = this.snapshot.strikerX;
    const startScroll = this.snapshot.scrollOffset;

    this.swapDefender(false);
    this.snapshot.defenderX = 1.08;
    this.snapshot.defenderY = DEFENDER_BASE.y;
    this.gkDiveT = 0;

    this.cancelSeq = runSequence({
      durationMs: 1500,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.runCycle += 0.22;
        this.snapshot.scrollOffset = lerp(startScroll, 0.38, p);
        this.snapshot.strikerX = lerp(startStrikerX, STRIKER_BASE.x, p);
        this.snapshot.strikerY = STRIKER_BASE.y;
        this.setBallAtStriker();
        this.snapshot.ball.y = STRIKER_BASE.y + (BALL_BASE.y - STRIKER_BASE.y) + Math.sin(this.runCycle * 2) * 0.004;
        this.snapshot.defenderX = lerp(1.08, DEFENDER_BASE.x, Math.max(0, (p - 0.25) / 0.75));
        this.applySnapshotToMeshes();
      },
      onComplete: () => this.softSettleToIdle(),
    });
  }

  private softSettleToIdle(): void {
    const from = {
      scroll: this.snapshot.scrollOffset,
      strikerX: this.snapshot.strikerX,
      strikerY: this.snapshot.strikerY,
      ballX: this.snapshot.ball.x,
      ballY: this.snapshot.ball.y,
      defenderX: this.snapshot.defenderX,
      defenderY: this.snapshot.defenderY,
    };

    this.cancelSeq = runSequence({
      durationMs: 480,
      onUpdate: (t) => {
        const p = easeInOutCubic(t);
        this.snapshot.scrollOffset = lerp(from.scroll, 0, p);
        this.snapshot.strikerX = lerp(from.strikerX, STRIKER_BASE.x, p);
        this.snapshot.strikerY = lerp(from.strikerY, STRIKER_BASE.y, p);
        this.snapshot.ball = {
          x: lerp(from.ballX, BALL_BASE.x, p),
          y: lerp(from.ballY, BALL_BASE.y, p),
          progress: 0,
        };
        const defBase = this.snapshot.isBoss ? GK_BASE : DEFENDER_BASE;
        this.snapshot.defenderX = lerp(from.defenderX, defBase.x, p);
        this.snapshot.defenderY = lerp(from.defenderY, defBase.y, p);
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.runCycle = 0;
        this.gkDiveT = 0;
        this.callbacks.onSequenceDone();
      },
    });
  }

  private playBlock(): void {
    this.snapshot.phase = 'blocking';
    this.snapshot.hitFlash = 1;
    triggerBlockRing({ blockRingT: this.blockRingT });
    this.blockRingT = 1;
    this.cameraShakeT = 1;
    this.wrongDimT = 1;
    const shot = this.snapshot.shot!;
    const blockX = DEFENDER_BASE.x - 0.055;
    const isBoss = this.snapshot.isBoss;

    this.cancelSeq = runSequence({
      durationMs: isBoss ? 760 : 560,
      onUpdate: (t) => {
        const p = easeOutCubic(t);
        const curve = shotCurve(shot, this.snapshot.isBoss);
        if (isBoss && t > 0.42) {
          const hold = (t - 0.42) / 0.58;
          this.snapshot.ball = {
            x: lerp(blockX, GK_BASE.x - 0.03, hold),
            y: lerp(curve.end.y, GK_BASE.y + 0.05, hold),
            progress: 0,
          };
          this.gkDiveT = hold * 0.85;
        } else {
          const back = bezierPoint(1 - p, { x: blockX, y: curve.end.y }, curve.peak, {
            x: BALL_BASE.x,
            y: BALL_BASE.y,
          });
          this.snapshot.ball = { x: back.x, y: back.y, progress: 1 - p };
          if (t > 0.45) {
            this.snapshot.strikerY = lerp(STRIKER_BASE.y, STRIKER_BASE.y + 0.025, (t - 0.45) / 0.55);
          }
        }
        this.snapshot.hitFlash = 1 - t;
        if (t > 0.5) this.snapshot.disappointment = (t - 0.5) * 2;
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.snapshot.disappointment = 0;
        this.gkDiveT = 0;
        this.wrongDimT = 0;
        this.resetPositions();
        this.callbacks.onSequenceDone();
      },
    });
  }

  private playGoal(): void {
    this.snapshot.phase = 'goal';
    this.snapshot.netShake = 1;
    this.snapshot.celebrate = 1;
    triggerConfetti({ confettiT: this.confettiT });
    this.confettiT = 1;
    this.stadiumFlashT = 1;
    this.cancelSeq = runSequence({
      durationMs: 1400,
      onUpdate: (t) => {
        this.snapshot.netShake = Math.max(0, 1 - t * 1.2) * Math.sin(t * 24);
        this.snapshot.celebrate = t;
        if (!isGlbPlayer(this.striker)) {
          this.snapshot.strikerY = lerp(STRIKER_BASE.y, STRIKER_BASE.y + 0.04, easeOutCubic(Math.min(1, t * 2)));
        }
        this.applySnapshotToMeshes();
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.stadiumFlashT = 0;
        this.callbacks.onSequenceDone();
      },
    });
  }

  private layoutSkyBackdrop(): void {
    if (!this.world?.skyMesh) return;
    const sky = this.world.skyMesh;
    const w = this.viewHalfW * 2.2;
    const h = this.viewHalfH * 2.2;
    sky.scale.set(w, h, 1);
    sky.position.set(this.bgFarGroup.position.x * 0.15, this.world.usesSkyArt ? 0.55 : 0, -0.95);
  }

  private resize = (): void => {
    const w = Math.max(this.mount.clientWidth, 1);
    const h = Math.max(this.mount.clientHeight, 1);
    this.viewHalfH = 4;
    this.viewHalfW = this.viewHalfH * (w / h);
    this.camera.left = -this.viewHalfW;
    this.camera.right = this.viewHalfW;
    this.camera.top = this.viewHalfH;
    this.camera.bottom = -this.viewHalfH;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.layoutSkyBackdrop();

    if (!this.world) return;

    const saved = this.currentQuiz;
    this.quizBoard.relayout((nx, ny) => this.normToWorld(nx, ny));
    if (saved) {
      this.quizBoard.setQuestion(saved.prompt, this.snapshot.isBoss ? 'gk' : 'defender');
      this.quizBoard.setOptions(saved.options);
    }
  };

  private loop = (): void => {
    const dt = 0.016;
    this.frameDt = dt;
    this.idleT += dt;
    if (this.kickFlashT > 0) this.kickFlashT = Math.max(0, this.kickFlashT - 0.06);
    tickBlockRing({ blockRingT: this.blockRingT });
    tickConfetti({ confettiT: this.confettiT });
    if (this.stadiumFlashT > 0 && this.snapshot.phase !== 'goal') {
      this.stadiumFlashT = Math.max(0, this.stadiumFlashT - 0.02);
    }
    if (this.wrongDimT > 0 && this.snapshot.phase !== 'blocking') {
      this.wrongDimT = Math.max(0, this.wrongDimT - 0.03);
    }

    this.cameraPanX = lerp(this.cameraPanX, this.targetCameraPanX, 0.1);
    let shakeX = 0;
    let shakeY = 0;
    if (this.cameraShakeT > 0) {
      const s = shakeCameraOffset(this.cameraShakeT);
      shakeX = s.x;
      shakeY = s.y;
      this.cameraShakeT = Math.max(0, this.cameraShakeT - 0.08);
    }
    this.camera.position.x = this.cameraPanX + shakeX;
    this.camera.position.y = shakeY;
    this.camera.lookAt(this.cameraPanX + shakeX, shakeY, 0);
    this.quizBoard.root.position.x = this.camera.position.x;
    this.quizBoard.tick(dt);

    const hideQuiz =
      this.snapshot.phase === 'scrolling' ||
      this.snapshot.phase === 'returning';
    this.quizBoard.root.visible = this.active && this.currentQuiz !== null && !hideQuiz;

    if (this.snapshot.phase === 'idle') {
      const defBase = this.snapshot.isBoss ? GK_BASE : DEFENDER_BASE;
      this.snapshot.defenderX = defBase.x + Math.sin(this.idleT * 2.2) * 0.012;
      this.snapshot.defenderY = defBase.y + Math.abs(Math.sin(this.idleT * 2.8)) * 0.012;
    }
    if (this.active && this.mount.clientHeight > 0) {
      this.applySnapshotToMeshes();
      this.renderer.render(this.scene, this.camera);
      const info = this.renderer.info.render;
      window.__THREE_GAME_DIAGNOSTICS__ = {
        drawCalls: info.calls,
        triangles: info.triangles,
        textures: this.renderer.info.memory.textures,
        skyArt: this.world?.usesSkyArt ? 1 : 0,
        grassArt: this.world?.usesGrassArt ? 1 : 0,
      };
    }
  };
}

function curveEndX(shot: ShotType, isBoss: boolean): number {
  return shotCurve(shot, isBoss).end.x;
}

function curveEndY(shot: ShotType, isBoss: boolean): number {
  return shotCurve(shot, isBoss).end.y;
}

/** @deprecated use WorldCupScene3D */
export { WorldCupScene3D as SoccerGameCanvas };
