/**
 * Câu hỏi + đáp án render bằng mesh 3D (canvas texture), đặt theo lưới A–O.
 * Visual language: docs/design/WORLD_CUP_2026_GAME_UI_STYLE_GUIDE.md
 */

import * as THREE from 'three';
import { disposeObject3D } from '@/core/assets/disposeObject3D';
import { WC_ANSWER_RIM, WC_COLORS, WC_FONTS, WC_MOTION } from './designTokens';
import { SCREEN_GRID, type GridRect } from './screenGridLayout';

export type NormToWorld = (nx: number, ny: number) => THREE.Vector3;

const ANSWER_RECTS = [SCREEN_GRID.answerA, SCREEN_GRID.answerB, SCREEN_GRID.answerC] as const;

interface PanelMesh {
  mesh: THREE.Mesh;
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

function rectWorld(rect: GridRect, normToWorld: NormToWorld): { w: number; h: number; cx: number; cy: number } {
  const tl = normToWorld(rect.nxMin, rect.nyMin);
  const br = normToWorld(rect.nxMax, rect.nyMax);
  return {
    w: Math.abs(br.x - tl.x),
    h: Math.abs(tl.y - br.y),
    cx: (tl.x + br.x) / 2,
    cy: (tl.y + br.y) / 2,
  };
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPanelShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.save();
  ctx.fillStyle = WC_COLORS.panelShadow;
  roundRect(ctx, x + 4, y + 6, w, h, r);
  ctx.fill();
  ctx.restore();
}

function drawChibiPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  rimColor?: string
): void {
  drawPanelShadow(ctx, x, y, w, h, r);

  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(1, '#F8FAFC');
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.35;
  const gloss = ctx.createLinearGradient(x, y, x + w * 0.6, y + h * 0.45);
  gloss.addColorStop(0, 'rgba(255,255,255,0.95)');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  roundRect(ctx, x + 3, y + 3, w - 6, h * 0.42, r * 0.7);
  ctx.fill();
  ctx.restore();

  if (rimColor) {
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = Math.max(4, h * 0.04);
    roundRect(ctx, x, y, w, h, r);
    ctx.stroke();
  }
}

function drawChibiText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  cx: number,
  startY: number,
  lineH: number,
  font: string,
  fill: string,
  shadow = true
): void {
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => {
    const y = startY + i * lineH;
    if (shadow) {
      ctx.fillStyle = 'rgba(15,23,42,0.22)';
      ctx.fillText(line, cx + 1, y + 2);
    }
    ctx.fillStyle = fill;
    ctx.fillText(line, cx, y);
  });
}

function makePanel(rect: GridRect, normToWorld: NormToWorld, z: number, dpr = 2): PanelMesh {
  const { w, h, cx, cy } = rectWorld(rect, normToWorld);
  const pxW = Math.max(64, Math.floor(w * 120 * dpr));
  const pxH = Math.max(48, Math.floor(h * 120 * dpr));
  const canvas = document.createElement('canvas');
  canvas.width = pxW;
  canvas.height = pxH;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(cx, cy, z);
  return { mesh, texture, canvas, ctx };
}

function drawSpeechBubbleBody(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  r: number,
  rimColor: string
): void {
  drawPanelShadow(ctx, bx, by, bw, bh, r);

  const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(1, '#F8FAFC');
  ctx.fillStyle = grad;
  roundRect(ctx, bx, by, bw, bh, r);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.32;
  const gloss = ctx.createLinearGradient(bx, by, bx + bw * 0.55, by + bh * 0.4);
  gloss.addColorStop(0, 'rgba(255,255,255,0.95)');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  roundRect(ctx, bx + 3, by + 3, bw - 6, bh * 0.38, r * 0.65);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = rimColor;
  ctx.lineWidth = Math.max(4, bh * 0.045);
  roundRect(ctx, bx, by, bw, bh, r);
  ctx.stroke();
}

function drawSpeechTail(
  ctx: CanvasRenderingContext2D,
  anchorX: number,
  anchorY: number,
  tipX: number,
  tipY: number,
  rimColor: string,
  fill: string
): void {
  const midX = (anchorX + tipX) / 2 + (tipY - anchorY) * 0.08;
  const midY = (anchorY + tipY) / 2;

  ctx.save();
  ctx.fillStyle = WC_COLORS.panelShadow;
  ctx.beginPath();
  ctx.moveTo(anchorX + 2, anchorY + 3);
  ctx.quadraticCurveTo(midX + 2, midY + 4, tipX + 2, tipY + 4);
  ctx.lineTo(anchorX - (tipX - anchorX) * 0.15 + 2, anchorY + 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(anchorX, anchorY);
  ctx.quadraticCurveTo(midX, midY, tipX, tipY);
  ctx.lineTo(anchorX - (tipX - anchorX) * 0.18, anchorY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = rimColor;
  ctx.lineWidth = Math.max(3, Math.abs(tipY - anchorY) * 0.12);
  ctx.beginPath();
  ctx.moveTo(anchorX, anchorY);
  ctx.quadraticCurveTo(midX, midY, tipX, tipY);
  ctx.stroke();
}

function drawSpeakerBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  speaker: QuestionSpeaker,
  scale: number
): number {
  const label = speaker === 'gk' ? 'Thủ môn' : 'Hậu vệ';
  const rim = speaker === 'gk' ? WC_COLORS.energyYellow : WC_COLORS.goalRed;
  const fill = speaker === 'gk' ? '#FEF9C3' : '#FEE2E2';
  const fontSize = Math.floor(11 * scale);
  ctx.font = `900 ${fontSize}px ${WC_FONTS.heading}`;
  const textW = ctx.measureText(label).width;
  const padX = Math.floor(10 * scale);
  const padY = Math.floor(5 * scale);
  const badgeW = textW + padX * 2;
  const badgeH = fontSize + padY * 2;
  const r = badgeH / 2;

  ctx.fillStyle = WC_COLORS.panelShadow;
  roundRect(ctx, x + 2, y + 3, badgeW, badgeH, r);
  ctx.fill();

  ctx.fillStyle = fill;
  roundRect(ctx, x, y, badgeW, badgeH, r);
  ctx.fill();
  ctx.strokeStyle = rim;
  ctx.lineWidth = Math.max(2, scale * 1.8);
  roundRect(ctx, x, y, badgeW, badgeH, r);
  ctx.stroke();

  ctx.fillStyle = WC_COLORS.inkNavy;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + padX, y + badgeH / 2);

  return badgeH;
}

function drawQuestionSpeechBubble(panel: PanelMesh, text: string, speaker: QuestionSpeaker): void {
  const { ctx, canvas } = panel;
  const pad = Math.floor(canvas.height * 0.05);
  const innerW = canvas.width - pad * 2;
  const innerH = canvas.height - pad * 2;
  const r = Math.floor(canvas.height * 0.11);
  const rimColor = speaker === 'gk' ? WC_COLORS.energyYellow : WC_COLORS.goalRed;
  const tailLen = Math.floor(Math.min(innerW, innerH) * 0.22);
  const bubbleW = innerW - tailLen * 0.35;
  const bubbleH = innerH - tailLen * 0.42;
  const bx = pad;
  const by = pad;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const tailTipX = bx + bubbleW + tailLen * 0.55;
  const tailTipY = by + bubbleH + tailLen;
  const tailAnchorX = bx + bubbleW - r * 0.55;
  const tailAnchorY = by + bubbleH - 2;

  drawSpeechBubbleBody(ctx, bx, by, bubbleW, bubbleH, r, rimColor);
  drawSpeechTail(ctx, tailAnchorX, tailAnchorY, tailTipX, tailTipY, rimColor, '#F8FAFC');

  const scale = canvas.height / 120;
  const badgeH = drawSpeakerBadge(ctx, bx + 12, by + 10, speaker, scale);
  const textTop = by + badgeH + 14;
  const textBottom = by + bubbleH - 12;
  const textAreaH = Math.max(24, textBottom - textTop);

  const fontSize = Math.floor(Math.min(canvas.height * 0.095, textAreaH / 2.8));
  const lines = wrapLines(ctx, text, bubbleW * 0.82);
  const lineH = fontSize * 1.28;
  const blockH = lines.length * lineH;
  const startY = textTop + (textAreaH - blockH) / 2 + lineH / 2;
  drawChibiText(
    ctx,
    lines,
    bx + bubbleW / 2,
    startY,
    lineH,
    `800 ${fontSize}px ${WC_FONTS.heading}`,
    WC_COLORS.inkNavy
  );

  panel.texture.needsUpdate = true;
}

function drawAnswerPanel(
  panel: PanelMesh,
  text: string,
  rimColor: string,
  state: 'normal' | 'selected' | 'fade' | 'disabled'
): void {
  const { ctx, canvas } = panel;
  const pad = Math.floor(canvas.height * 0.08);
  const innerW = canvas.width - pad * 2;
  const innerH = canvas.height - pad * 2;
  const r = Math.floor(canvas.height * 0.14);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const panelAlpha = state === 'fade' ? WC_MOTION.fadeAlpha : state === 'disabled' ? WC_MOTION.disabledAlpha : 1;
  ctx.globalAlpha = panelAlpha;

  drawChibiPanel(ctx, pad, pad, innerW, innerH, r, rimColor);

  if (state === 'selected') {
    ctx.fillStyle = 'rgba(250,204,21,0.32)';
    roundRect(ctx, pad, pad, innerW, innerH, r);
    ctx.fill();
    ctx.strokeStyle = WC_COLORS.energyYellow;
    ctx.lineWidth = Math.max(5, innerH * 0.05);
    roundRect(ctx, pad, pad, innerW, innerH, r);
    ctx.stroke();
  }

  const fontSize = Math.floor(canvas.height * 0.13);
  const lines = wrapLines(ctx, text, innerW * 0.84);
  const lineH = canvas.height * 0.15;
  const startY = canvas.height / 2 - ((lines.length - 1) * lineH) / 2;
  const textAlpha = state === 'fade' ? 0.2 : 1;
  ctx.globalAlpha = panelAlpha * textAlpha;
  drawChibiText(ctx, lines, canvas.width / 2, startY, lineH, `700 ${fontSize}px ${WC_FONTS.body}`, WC_COLORS.inkNavy);
  ctx.globalAlpha = 1;
  panel.texture.needsUpdate = true;
}

function drawFeedbackPanel(panel: PanelMesh, text: string, kind: 'ok' | 'bad' | 'neutral'): void {
  const { ctx, canvas } = panel;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!text) {
    panel.texture.needsUpdate = true;
    panel.mesh.visible = false;
    return;
  }
  panel.mesh.visible = true;

  const padX = 8;
  const pillH = canvas.height * 0.55;
  const pillY = (canvas.height - pillH) / 2;
  const r = pillH / 2;

  if (kind === 'ok') {
    ctx.fillStyle = WC_COLORS.pitchGreen;
  } else if (kind === 'bad') {
    ctx.fillStyle = WC_COLORS.goalRed;
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
  }
  roundRect(ctx, padX, pillY, canvas.width - padX * 2, pillH, r);
  ctx.fill();

  if (kind === 'ok') {
    ctx.fillStyle = WC_COLORS.energyYellow;
    for (let i = 0; i < 5; i++) {
      const sx = padX + 18 + i * 14;
      const sy = pillY + pillH * 0.25;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 3, sy + 8);
      ctx.lineTo(sx - 3, sy + 8);
      ctx.closePath();
      ctx.fill();
    }
  }

  const fontSize = Math.floor(pillH * 0.42);
  drawChibiText(
    ctx,
    [text],
    canvas.width / 2,
    canvas.height / 2,
    pillH,
    `900 ${fontSize}px ${WC_FONTS.heading}`,
    kind === 'neutral' ? WC_COLORS.inkNavy : WC_COLORS.cleanWhite,
    kind !== 'neutral'
  );
  panel.texture.needsUpdate = true;
}

export type QuestionSpeaker = 'defender' | 'gk';

export interface QuizBoard3D {
  root: THREE.Group;
  setQuestion: (prompt: string, speaker?: QuestionSpeaker) => void;
  setOptions: (options: [string, string, string]) => void;
  setEnabled: (enabled: boolean) => void;
  setHighlight: (index: number | null) => void;
  fadeOthers: (selected: number) => void;
  setFeedback: (text: string, kind?: 'ok' | 'bad' | 'neutral') => void;
  setVisible: (visible: boolean) => void;
  relayout: (normToWorld: NormToWorld) => void;
  tick: (dt: number) => void;
  pick: (raycaster: THREE.Raycaster) => number | null;
  dispose: () => void;
}

export function createQuizBoard3D(normToWorld: NormToWorld): QuizBoard3D {
  const root = new THREE.Group();
  root.name = 'quiz-board';

  let questionPanel = makePanel(SCREEN_GRID.question, normToWorld, 0.22);
  let feedbackPanel = makePanel(SCREEN_GRID.feedback, normToWorld, 0.24);
  feedbackPanel.mesh.visible = false;

  const answerPanels: PanelMesh[] = ANSWER_RECTS.map((rect, i) => {
    const p = makePanel(rect, normToWorld, 0.23);
    p.mesh.userData.answerIndex = i;
    return p;
  });

  root.add(questionPanel.mesh, feedbackPanel.mesh, ...answerPanels.map((p) => p.mesh));

  let options: [string, string, string] = ['', '', ''];
  let questionSpeaker: QuestionSpeaker = 'defender';
  let questionPrompt = '';
  let enabled = true;
  let highlight: number | null = null;
  let answerStates: Array<'normal' | 'selected' | 'fade' | 'disabled'> = ['normal', 'normal', 'normal'];
  const targetScales = [1, 1, 1];
  const currentScales = [1, 1, 1];
  let questionTargetScale = 1;
  let questionCurrentScale = 1;

  function redrawAnswers(): void {
    answerPanels.forEach((p, i) => {
      drawAnswerPanel(p, options[i]!, WC_ANSWER_RIM[i]!, answerStates[i]!);
    });
  }

  function bumpAnswer(index: number): void {
    targetScales[index] = WC_MOTION.popOvershoot;
  }

  const api: QuizBoard3D = {
    root,
    setQuestion(prompt, speaker = 'defender') {
      questionPrompt = prompt;
      questionSpeaker = speaker;
      drawQuestionSpeechBubble(questionPanel, prompt, speaker);
      questionTargetScale = WC_MOTION.popOvershoot;
    },
    setOptions(next) {
      options = next;
      highlight = null;
      answerStates = ['normal', 'normal', 'normal'];
      targetScales.fill(WC_MOTION.popSettle);
      redrawAnswers();
    },
    setEnabled(value) {
      enabled = value;
      if (!value) {
        answerStates = answerStates.map((s) => (s === 'fade' ? 'fade' : 'disabled'));
      } else {
        answerStates = answerStates.map((s, i) =>
          highlight === i ? 'selected' : s === 'fade' ? 'fade' : 'normal'
        );
      }
      redrawAnswers();
    },
    setHighlight(index) {
      highlight = index;
      if (!enabled) return;
      answerStates = answerStates.map((s, i) => (s === 'fade' ? 'fade' : i === index ? 'selected' : 'normal'));
      if (index !== null) bumpAnswer(index);
      redrawAnswers();
    },
    fadeOthers(selected) {
      answerStates = answerStates.map((_, i) => (i === selected ? 'selected' : 'fade'));
      bumpAnswer(selected);
      redrawAnswers();
    },
    setFeedback(text, kind = 'neutral') {
      drawFeedbackPanel(feedbackPanel, text, kind);
    },
    setVisible(visible) {
      root.visible = visible;
    },
    relayout(n2w) {
      disposeObject3D(questionPanel.mesh);
      disposeObject3D(feedbackPanel.mesh);
      answerPanels.forEach((p) => disposeObject3D(p.mesh));
      root.clear();

      questionPanel = makePanel(SCREEN_GRID.question, n2w, 0.22);
      feedbackPanel = makePanel(SCREEN_GRID.feedback, n2w, 0.24);
      feedbackPanel.mesh.visible = false;
      answerPanels.length = 0;
      ANSWER_RECTS.forEach((rect, i) => {
        const p = makePanel(rect, n2w, 0.23);
        p.mesh.userData.answerIndex = i;
        answerPanels.push(p);
      });
      root.add(questionPanel.mesh, feedbackPanel.mesh, ...answerPanels.map((p) => p.mesh));
      drawQuestionSpeechBubble(questionPanel, questionPrompt, questionSpeaker);
      redrawAnswers();
    },
    tick(dt) {
      questionCurrentScale = THREE.MathUtils.lerp(
        questionCurrentScale,
        questionTargetScale,
        Math.min(1, dt * WC_MOTION.popSpeed)
      );
      if (questionTargetScale > WC_MOTION.popSettle && Math.abs(questionCurrentScale - questionTargetScale) < 0.004) {
        questionTargetScale = WC_MOTION.popSettle;
      }
      questionPanel.mesh.scale.setScalar(questionCurrentScale);

      answerPanels.forEach((p, i) => {
        const target = targetScales[i]!;
        currentScales[i] = THREE.MathUtils.lerp(currentScales[i]!, target, Math.min(1, dt * WC_MOTION.popSpeed));
        if (target > WC_MOTION.popSettle && Math.abs(currentScales[i]! - target) < 0.004) {
          targetScales[i] = WC_MOTION.popSettle;
        }
        p.mesh.scale.setScalar(currentScales[i]!);
      });
    },
    pick(raycaster) {
      if (!enabled || !root.visible) return null;
      const hits = raycaster.intersectObjects(
        answerPanels.map((p) => p.mesh),
        false
      );
      const hit = hits[0];
      if (!hit) return null;
      const idx = hit.object.userData.answerIndex;
      return typeof idx === 'number' ? idx : null;
    },
    dispose() {
      disposeObject3D(root);
    },
  };

  return api;
}
