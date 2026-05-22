import { playSfx, resumeAudio } from './sfxService';

/** Gắn tiếng click cho nút trong một vùng DOM (màn hình / section). */
export function bindUiClickSounds(root: ParentNode): void {
  root.addEventListener(
    'click',
    (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest('button, .game-card, [role="button"]');
      if (!btn || btn.hasAttribute('disabled')) return;
      resumeAudio();
      playSfx('click');
    },
    true
  );
}
