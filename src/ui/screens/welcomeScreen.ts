import { useAppStore } from '@/app/store';
import { getProfiles, setActiveProfileId } from '@/data/indexeddb/db';
import { resumeAudio } from '@/features/audio/sfxService';
import { ensurePlayer } from '@/features/progress/userProgressStore';

export function renderWelcomeScreen(root: HTMLElement): void {
  root.innerHTML = `
    <section class="screen screen--clay screen--welcome">
      <h1>Ai đang học hôm nay?</h1>
      <p class="subtitle">Chọn hồ sơ cũ hoặc tạo hồ sơ mới</p>
      <div class="welcome-profiles" id="welcome-profiles" hidden>
        <p class="welcome-profiles__label">Hồ sơ đã lưu</p>
        <div class="welcome-profiles__grid" id="welcome-profiles-grid"></div>
      </div>
      <div class="card clay-card welcome-create-card">
        <label for="player-name" class="subtitle clay-label">Dùng tên khác</label>
        <input id="player-name" class="input-text" type="text" maxlength="24" placeholder="Ví dụ: Minh" autocomplete="nickname" />
        <button type="button" class="btn btn-primary" id="btn-start">Vào trang chủ</button>
      </div>
    </section>
  `;

  const input = root.querySelector<HTMLInputElement>('#player-name')!;
  const btn = root.querySelector('#btn-start')!;
  const existingWrap = root.querySelector<HTMLElement>('#welcome-profiles')!;
  const profilesGrid = root.querySelector<HTMLElement>('#welcome-profiles-grid')!;

  const go = async () => {
    resumeAudio();
    const name = input.value.trim();
    if (!name) {
      input.focus();
      return;
    }
    const profile = await ensurePlayer(name);
    useAppStore.setPlayer(profile.playerIdLocal, profile.displayName);
    useAppStore.setScreen('home');
  };

  void (async () => {
    const profiles = await getProfiles();
    if (profiles.length === 0) {
      input.focus();
      return;
    }
    existingWrap.hidden = false;
    profilesGrid.innerHTML = profiles
      .map(
        (profile) => `
      <button type="button" class="welcome-profile-card game-card" data-profile-id="${profile.playerIdLocal}">
        <span class="welcome-profile-card__avatar" aria-hidden="true">${escapeHtml(profile.displayName.slice(0, 1).toUpperCase())}</span>
        <span class="welcome-profile-card__meta">
          <strong>${escapeHtml(profile.displayName)}</strong>
          <small>Tiếp tục hồ sơ này</small>
        </span>
      </button>`
      )
      .join('');
    profilesGrid
      .querySelectorAll<HTMLButtonElement>('.welcome-profile-card')
      .forEach((profileBtn) => {
        profileBtn.addEventListener('click', () => {
          const profileId = profileBtn.dataset.profileId;
          const profile = profiles.find((p) => p.playerIdLocal === profileId);
          if (!profile) return;
          resumeAudio();
          setActiveProfileId(profile.playerIdLocal);
          useAppStore.setPlayer(profile.playerIdLocal, profile.displayName);
          useAppStore.setScreen('home');
        });
      });
    input.focus();
  })();

  btn.addEventListener('click', () => void go());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') void go();
  });
}

function escapeHtml(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
