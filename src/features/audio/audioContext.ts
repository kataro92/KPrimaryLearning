let audioCtx: AudioContext | null = null;

/** Shared Web Audio context for SFX and BGM. */
export function getAudioContext(create = false): AudioContext | null {
  try {
    if (!audioCtx && create) audioCtx = new AudioContext();
    return audioCtx;
  } catch {
    return null;
  }
}

/** Resume after a user gesture (browser autoplay policy). */
export function resumeAudioContext(): void {
  try {
    const ctx = getAudioContext(true);
    if (ctx?.state === 'suspended') void ctx.resume();
  } catch {
    /* ignore */
  }
}
