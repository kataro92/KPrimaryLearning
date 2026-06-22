import * as THREE from 'three';
import {
  TRIPO_NLA_GK_INDEX,
  TRIPO_NLA_PLAYER_5_INDEX,
  TRIPO_NLA_STRIKER_INDEX_LEGACY,
} from './glbPlayerConfig';

export interface GlbPlayerAnimOpts {
  kickT?: number;
  diveT?: number;
  diveDir?: number;
  blocking?: boolean;
  disappointed?: boolean;
  celebrate?: number;
}

type GlbClipSlot = 'idle' | 'run' | 'kick' | 'jump';

const CLIP_PATTERNS: Record<GlbClipSlot, RegExp[]> = {
  idle: [/idle/i, /stand/i],
  run: [/run/i, /walk/i, /jog/i],
  kick: [/slash/i, /kick/i, /shoot/i, /punch/i, /jump_down/i, /dive/i, /save/i],
  jump: [/jump/i, /cheer/i, /celebrat/i, /victory/i, /look_around/i],
};

function isNlaTrackExport(clips: THREE.AnimationClip[]): boolean {
  return clips.length > 0 && clips.every((c) => /^NlaTrack/i.test(c.name));
}

function sortNlaTracks(clips: THREE.AnimationClip[]): THREE.AnimationClip[] {
  return [...clips].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

function pickNla5Clips(ordered: THREE.AnimationClip[]): Partial<Record<GlbClipSlot, THREE.AnimationClip>> {
  const idx = TRIPO_NLA_PLAYER_5_INDEX;
  return {
    idle: ordered[idx.idle]!,
    jump: ordered[idx.jump]!,
    run: ordered[idx.run]!,
    kick: ordered[idx.slash]!,
  };
}

function pickNlaGkClips(ordered: THREE.AnimationClip[]): Partial<Record<GlbClipSlot, THREE.AnimationClip>> {
  const idx = TRIPO_NLA_GK_INDEX;
  return {
    idle: ordered[idx.idle]!,
    jump: ordered[idx.lookAround]!,
    run: ordered[idx.run]!,
    kick: ordered[idx.jumpDown]!,
  };
}

function pickNlaTrackClips(
  clips: THREE.AnimationClip[],
  role?: string
): Partial<Record<GlbClipSlot, THREE.AnimationClip>> {
  const ordered = sortNlaTracks(clips);
  if (role === 'gk' && ordered.length >= 5) {
    return pickNlaGkClips(ordered);
  }
  if ((role === 'striker' || role === 'defender') && ordered.length >= 5) {
    return pickNla5Clips(ordered);
  }
  if (role === 'striker' && ordered.length >= 4) {
    const leg = TRIPO_NLA_STRIKER_INDEX_LEGACY;
    return {
      idle: ordered[leg.idle]!,
      run: ordered[leg.run]!,
      kick: ordered[leg.slash]!,
      jump: ordered[leg.run]!,
    };
  }
  const sorted = [...clips].sort((a, b) => b.duration - a.duration);
  if (sorted.length >= 4) {
    return {
      idle: sorted[0]!,
      run: sorted[1]!,
      kick: sorted[2]!,
      jump: sorted[3]!,
    };
  }
  const only = sorted[0]!;
  return { idle: only, run: only, kick: only, jump: only };
}

function pickClip(clips: THREE.AnimationClip[], slot: GlbClipSlot, role?: string): THREE.AnimationClip | null {
  for (const pattern of CLIP_PATTERNS[slot]) {
    const hit = clips.find((c) => pattern.test(c.name));
    if (hit) return hit;
  }
  if (isNlaTrackExport(clips)) {
    return pickNlaTrackClips(clips, role)[slot] ?? null;
  }
  return null;
}

function phaseToSlot(phase: string, opts: GlbPlayerAnimOpts, role?: string): GlbClipSlot {
  if (role === 'gk' && opts.diveT !== undefined && opts.diveT > 0) return 'kick';
  if (phase === 'goal' || (opts.celebrate !== undefined && opts.celebrate > 0)) return 'jump';
  if (opts.blocking || phase === 'blocking') return 'kick';
  if (phase === 'scrolling' || phase === 'returning' || phase === 'flying') {
    return role === 'gk' ? 'idle' : 'run';
  }
  return 'idle';
}

export interface GlbPlayerAnimState {
  mixer: THREE.AnimationMixer;
  actions: Partial<Record<GlbClipSlot, THREE.AnimationAction>>;
  activeSlot: GlbClipSlot | null;
}

export function bindGlbPlayerAnimations(
  wrapper: THREE.Group,
  model: THREE.Object3D,
  clips: readonly THREE.AnimationClip[]
): GlbPlayerAnimState | null {
  if (!clips.length) return null;

  const role = wrapper.userData.playerRole as string | undefined;
  const mixer = new THREE.AnimationMixer(model);
  const actions: Partial<Record<GlbClipSlot, THREE.AnimationAction>> = {};
  for (const slot of Object.keys(CLIP_PATTERNS) as GlbClipSlot[]) {
    const clip = pickClip([...clips], slot, role);
    if (!clip) continue;
    const action = mixer.clipAction(clip);
    if (slot === 'idle' || slot === 'run') {
      action.setLoop(THREE.LoopRepeat, Infinity);
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }
    actions[slot] = action;
  }

  if (!actions.idle && !actions.run && !actions.kick && !actions.jump) {
    mixer.stopAllAction();
    return null;
  }

  const state: GlbPlayerAnimState = { mixer, actions, activeSlot: null };
  wrapper.userData.glbAnim = state;

  if (actions.idle) {
    actions.idle.reset().setEffectiveWeight(1).play();
    state.activeSlot = 'idle';
  } else if (actions.run) {
    actions.run.reset().setEffectiveWeight(1).play();
    state.activeSlot = 'run';
  }

  return state;
}

function playGlbSlot(state: GlbPlayerAnimState, slot: GlbClipSlot): void {
  if (state.activeSlot === slot) {
    const current = state.actions[slot];
    if (current && !current.isRunning()) current.play();
    return;
  }
  const next = state.actions[slot];
  if (!next) return;
  const prev = state.activeSlot ? state.actions[state.activeSlot] : null;
  if (prev && prev !== next) prev.fadeOut(0.12);
  next.reset().setEffectiveWeight(1).fadeIn(0.1).play();
  state.activeSlot = slot;
}

function updateGlbMixer(
  wrapper: THREE.Group,
  phase: string,
  opts: GlbPlayerAnimOpts,
  dt: number
): boolean {
  const state = wrapper.userData.glbAnim as GlbPlayerAnimState | undefined;
  if (!state) return false;
  const role = wrapper.userData.playerRole as string | undefined;
  playGlbSlot(state, phaseToSlot(phase, opts, role));
  state.mixer.update(dt);
  resetGlbWrapperMotion(wrapper);
  return true;
}

function resetGlbWrapperMotion(wrapper: THREE.Group): void {
  wrapper.rotation.set(0, 0, 0);
  const child = wrapper.children[0];
  if (child) child.position.y = 0;
}

/** Rigged GLB: clips only — no wrapper tilt/bounce (kick forward comes from scene strikerX). */
export function animateGlbPlayer(
  wrapper: THREE.Group,
  phase: string,
  idleT: number,
  runCycle: number,
  opts: GlbPlayerAnimOpts = {},
  dt = 0.016
): void {
  if (updateGlbMixer(wrapper, phase, opts, dt)) return;
  applyStaticGlbAccent(wrapper, phase, idleT, runCycle, opts);
}

function applyStaticGlbAccent(
  wrapper: THREE.Group,
  phase: string,
  idleT: number,
  runCycle: number,
  opts: GlbPlayerAnimOpts
): void {
  const role = wrapper.userData.playerRole as string | undefined;
  const isGk = role === 'gk';
  const faceSign = role === 'striker' ? 1 : -1;
  const child = wrapper.children[0];

  resetGlbWrapperMotion(wrapper);

  const idle = phase === 'idle' || phase === 'selecting';
  if (idle) {
    wrapper.rotation.z += Math.sin(idleT * 3) * 0.025 * faceSign;
    if (child) child.position.y += Math.sin(idleT * 2.4) * 0.012;
  }

  if (phase === 'scrolling' || phase === 'returning' || phase === 'flying') {
    wrapper.rotation.z += Math.sin(runCycle) * 0.055 * faceSign;
  }

  if (opts.blocking) wrapper.rotation.z += 0.12 * faceSign;

  if (opts.diveT !== undefined && opts.diveT > 0 && !isGk) {
    const dir = opts.diveDir ?? -1;
    wrapper.rotation.z += dir * opts.diveT * (isGk ? 0.65 : 0.45);
    wrapper.position.y += opts.diveT * 0.06;
  }

  if (opts.disappointed) wrapper.rotation.z += 0.06 * faceSign;
}

export function disposeGlbPlayerAnimations(wrapper: THREE.Group): void {
  const state = wrapper.userData.glbAnim as GlbPlayerAnimState | undefined;
  if (!state) return;
  state.mixer.stopAllAction();
  delete wrapper.userData.glbAnim;
}

export function isGlbPlayer(group: THREE.Group): boolean {
  return Boolean(group.userData.isGlbPlayer);
}
