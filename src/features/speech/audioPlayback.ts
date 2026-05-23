let activeUrl: string | null = null;
let activeAudio: HTMLAudioElement | null = null;

export function stopBufferedAudio(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = '';
    activeAudio = null;
  }
  if (activeUrl) {
    URL.revokeObjectURL(activeUrl);
    activeUrl = null;
  }
}

/** Play WAV bytes from local neural TTS worker (Phase 2+). */
export function playWavBuffer(wavBuffer: ArrayBuffer): void {
  stopBufferedAudio();
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  activeUrl = URL.createObjectURL(blob);
  activeAudio = new Audio(activeUrl);
  void activeAudio.play().catch(() => {
    stopBufferedAudio();
  });
  activeAudio.onended = () => stopBufferedAudio();
}
