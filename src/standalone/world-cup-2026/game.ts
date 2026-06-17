import { bezierPoint, easeInOutQuad, easeOutCubic, lerp, runSequence } from './animation';
import type { SceneSnapshot, ShotType } from './types';

export interface GameCanvasCallbacks {
  onSequenceDone: () => void;
}

const STRIKER_BASE = { x: 0.2, y: 0.75 };
const BALL_BASE = { x: 0.26, y: 0.78 };
const DEFENDER_BASE = { x: 0.8, y: 0.75 };
const GK_BASE = { x: 0.72, y: 0.72 };

function shotCurve(shot: ShotType): { peak: { x: number; y: number }; end: { x: number; y: number } } {
  if (shot === 'A') return { peak: { x: 0.5, y: 0.4 }, end: { x: 0.88, y: 0.78 } };
  if (shot === 'B') return { peak: { x: 0.5, y: 0.55 }, end: { x: 0.88, y: 0.78 } };
  return { peak: { x: 0.55, y: 0.76 }, end: { x: 0.88, y: 0.78 } };
}

export class SoccerGameCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private cancelSeq: (() => void) | null = null;
  private callbacks: GameCanvasCallbacks;
  private flagColors: [string, string, string] = ['#22c55e', '#fff', '#3b82f6'];
  private idleT = 0;

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

  constructor(canvas: HTMLCanvasElement, callbacks: GameCanvasCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    this.resize();
    window.addEventListener('resize', this.resize);
    this.loop();
  }

  setCountryColors(colors: [string, string, string]): void {
    this.flagColors = colors;
  }

  setStage(stage: 1 | 2 | 3 | 4): void {
    this.snapshot.stage = stage;
    this.snapshot.isBoss = stage === 4;
    this.resetPositions();
  }

  forceResize(): void {
    this.resize();
  }

  resetPositions(): void {
    this.snapshot.scrollOffset = 0;
    this.snapshot.strikerX = STRIKER_BASE.x;
    this.snapshot.strikerY = STRIKER_BASE.y;
    this.snapshot.defenderX = this.snapshot.isBoss ? GK_BASE.x : DEFENDER_BASE.x;
    this.snapshot.defenderY = this.snapshot.isBoss ? GK_BASE.y : DEFENDER_BASE.y;
    this.snapshot.ball = { x: BALL_BASE.x, y: BALL_BASE.y, progress: 0 };
    this.snapshot.hitFlash = 0;
    this.snapshot.netShake = 0;
    this.snapshot.celebrate = 0;
    this.snapshot.disappointment = 0;
    this.snapshot.phase = 'idle';
    this.snapshot.shot = null;
    this.snapshot.correct = null;
    this.snapshot.trailIntensity = 0;
  }

  playShot(shot: ShotType, correct: boolean): void {
    if (this.snapshot.phase !== 'idle' && this.snapshot.phase !== 'selecting') return;
    this.cancelSeq?.();
    this.snapshot.shot = shot;
    this.snapshot.correct = correct;
    this.snapshot.trailIntensity = this.snapshot.isBoss && correct ? 1 : 0;
    this.snapshot.phase = 'kicking';

    this.cancelSeq = runSequence({
      durationMs: 250,
      onUpdate: (t) => {
        this.snapshot.strikerX = lerp(STRIKER_BASE.x, STRIKER_BASE.x + 0.03, easeOutCubic(t));
      },
      onComplete: () => this.flyBall(correct),
    });
  }

  private flyBall(correct: boolean): void {
    const shot = this.snapshot.shot!;
    const curve = shotCurve(shot);
    const start = { x: BALL_BASE.x, y: BALL_BASE.y };
    this.snapshot.phase = 'flying';

    this.cancelSeq = runSequence({
      durationMs: correct ? 700 : 650,
      onUpdate: (t) => {
        const p = easeInOutQuad(t);
        const pt = bezierPoint(p, start, curve.peak, curve.end);
        this.snapshot.ball = { x: pt.x, y: pt.y, progress: p };
        if (!correct && t > 0.55) {
          this.snapshot.defenderY = lerp(DEFENDER_BASE.y, DEFENDER_BASE.y - 0.08, (t - 0.55) / 0.45);
        } else if (correct) {
          this.snapshot.defenderY = lerp(
            DEFENDER_BASE.y,
            DEFENDER_BASE.y + (shot === 'C' ? -0.06 : 0.06),
            Math.min(1, t * 1.4)
          );
        }
      },
      onComplete: () => {
        if (correct) {
          if (this.snapshot.isBoss) this.playGoal();
          else this.scrollNext();
        } else {
          this.playBlock();
        }
      },
    });
  }

  private playBlock(): void {
    this.snapshot.phase = 'blocking';
    this.snapshot.hitFlash = 1;
    const shot = this.snapshot.shot!;
    const blockX = 0.72;

    this.cancelSeq = runSequence({
      durationMs: 500,
      onUpdate: (t) => {
        const p = easeOutCubic(t);
        const curve = shotCurve(shot);
        const back = bezierPoint(1 - p, { x: blockX, y: curve.end.y }, curve.peak, {
          x: BALL_BASE.x,
          y: BALL_BASE.y,
        });
        this.snapshot.ball = { x: back.x, y: back.y, progress: 1 - p };
        this.snapshot.hitFlash = 1 - t;
        if (t > 0.5) this.snapshot.disappointment = (t - 0.5) * 2;
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.snapshot.disappointment = 0;
        this.resetPositions();
        this.callbacks.onSequenceDone();
      },
    });
  }

  private scrollNext(): void {
    this.snapshot.phase = 'scrolling';
    this.cancelSeq = runSequence({
      durationMs: 1200,
      onUpdate: (t) => {
        const p = easeInOutQuad(t);
        this.snapshot.scrollOffset = p * 0.35;
        this.snapshot.strikerX = lerp(BALL_BASE.x - 0.04, STRIKER_BASE.x, 1 - p * 0.3);
        this.snapshot.ball.x = lerp(0.9, BALL_BASE.x, 1 - p);
        this.snapshot.ball.y = lerp(0.78, BALL_BASE.y, 1 - p);
        this.snapshot.defenderX = lerp(DEFENDER_BASE.x, DEFENDER_BASE.x + 0.2, p);
      },
      onComplete: () => {
        this.resetPositions();
        this.callbacks.onSequenceDone();
      },
    });
  }

  private playGoal(): void {
    this.snapshot.phase = 'goal';
    this.snapshot.netShake = 1;
    this.snapshot.celebrate = 1;
    this.cancelSeq = runSequence({
      durationMs: 1400,
      onUpdate: (t) => {
        this.snapshot.netShake = Math.max(0, 1 - t * 1.2) * Math.sin(t * 24);
        this.snapshot.celebrate = t;
        this.snapshot.strikerY = lerp(STRIKER_BASE.y, STRIKER_BASE.y + 0.04, easeOutCubic(Math.min(1, t * 2)));
      },
      onComplete: () => {
        this.snapshot.phase = 'idle';
        this.callbacks.onSequenceDone();
      },
    });
  }

  private resize = (): void => {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  private loop = (): void => {
    this.idleT += 0.016;
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private draw(): void {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, w, h);

    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    sky.addColorStop(0, '#7dd3fc');
    sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const horizonY = h * 0.65;
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, horizonY, w, h - horizonY);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, horizonY + 8, w, h - horizonY - 8);

    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.05, horizonY + 20, w * 0.9, h - horizonY - 40);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, horizonY + 20);
    ctx.lineTo(w * 0.5, h - 20);
    ctx.stroke();

    const scrollPx = this.snapshot.scrollOffset * w;
    ctx.save();
    ctx.translate(-scrollPx, 0);

    if (this.snapshot.isBoss) this.drawGoal(w, h, horizonY);
    this.drawPlayer(
      w * this.snapshot.defenderX,
      h * this.snapshot.defenderY,
      this.snapshot.isBoss,
      false
    );

    const idleBounce = Math.sin(this.idleT * 3) * 3;
    this.drawPlayer(
      w * this.snapshot.strikerX,
      h * (this.snapshot.strikerY + (this.snapshot.disappointment ? 0.02 : 0)) + idleBounce,
      false,
      true
    );
    this.drawBall(w * this.snapshot.ball.x, h * this.snapshot.ball.y);

    if (this.snapshot.trailIntensity > 0 && this.snapshot.phase === 'flying') {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.ellipse(
        w * this.snapshot.ball.x - 24,
        h * this.snapshot.ball.y,
        28,
        10,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    if (this.snapshot.hitFlash > 0) {
      ctx.fillStyle = `rgba(248,113,113,${this.snapshot.hitFlash * 0.7})`;
      ctx.beginPath();
      ctx.arc(w * 0.72, h * 0.74, 28 * this.snapshot.hitFlash, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    this.drawFlagStrip(w);
  }

  private drawFlagStrip(w: number): void {
    const ctx = this.ctx;
    const sw = w / 3;
    const [c1, c2, c3] = this.flagColors;
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, sw, 8);
    ctx.fillStyle = c2;
    ctx.fillRect(sw, 0, sw, 8);
    ctx.fillStyle = c3;
    ctx.fillRect(sw * 2, 0, sw, 8);
  }

  private drawGoal(w: number, h: number, horizonY: number): void {
    const ctx = this.ctx;
    const gx = w * 0.82;
    const gy = horizonY + 30;
    const shake = this.snapshot.netShake * 6;
    ctx.save();
    ctx.translate(shake, 0);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.strokeRect(gx, gy, w * 0.16, h * 0.35);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const x = gx + (i / 8) * w * 0.16;
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x, gy + h * 0.35);
      ctx.stroke();
    }
    for (let j = 0; j < 6; j++) {
      const y = gy + (j / 6) * h * 0.35;
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx + w * 0.16, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawPlayer(x: number, y: number, isGk: boolean, isStriker: boolean): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    const shirt = isGk ? '#facc15' : isStriker ? '#3b82f6' : '#ef4444';
    const shorts = isStriker ? '#1e3a8a' : '#7f1d1d';
    ctx.fillStyle = shirt;
    ctx.beginPath();
    ctx.ellipse(0, -28, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fcd9b6';
    ctx.beginPath();
    ctx.arc(0, -52, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = shorts;
    ctx.fillRect(-12, -10, 24, 16);
    ctx.fillStyle = '#111827';
    ctx.fillRect(-10, 6, 8, 18);
    ctx.fillRect(2, 6, 8, 18);
    if (isGk) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-18, -36, 10, 14);
      ctx.fillRect(8, -36, 10, 14);
    }
    ctx.restore();
  }

  private drawBall(x: number, y: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4, -1);
    ctx.lineTo(0, 4);
    ctx.lineTo(-4, -1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.cancelSeq?.();
    window.removeEventListener('resize', this.resize);
  }
}
