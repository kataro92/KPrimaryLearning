import {
  VOICE_SAMPLE_MAX_SEC,
  VOICE_SAMPLE_MIN_SEC,
} from './voiceProfileTypes';
import {
  createReferencePreviewUrl,
  getVoiceProfileStatus,
  importVoiceSampleFile,
  removeVoiceProfile,
  type VoiceProfileStatus,
} from './voiceProfileService';

export async function mountVoiceProfilePanel(
  container: HTMLElement,
  profileId: string
): Promise<void> {
  let previewUrl: string | null = null;
  const status = await getVoiceProfileStatus(profileId);

  const statusLine = formatStatus(status);
  container.insertAdjacentHTML(
    'afterbegin',
    `
    <section class="voice-profile clay-card" aria-label="Giọng tham khảo">
      <h3 class="voice-profile__title">Giọng tham khảo (tùy chọn)</h3>
      <p class="voice-profile__hint">
        Tải ${VOICE_SAMPLE_MIN_SEC}–${VOICE_SAMPLE_MAX_SEC} giây tiếng Việt để nghe lại trên máy này.
        Đọc trong game vẫn dùng giọng AI tiếng Việt (MMS), không nhái giọng file mẫu.
      </p>
      <p class="voice-profile__status" id="voice-status">${escapeHtml(statusLine)}</p>
      <div class="voice-profile__actions">
        <label class="btn btn-secondary voice-profile__upload">
          Tải file mẫu
          <input type="file" id="voice-file" accept="audio/*" hidden />
        </label>
        <button type="button" class="btn btn-secondary" id="voice-preview" ${status.state === 'ready' ? '' : 'disabled'}>Nghe mẫu</button>
        <button type="button" class="btn btn-secondary" id="voice-remove" ${status.state === 'ready' ? '' : 'disabled'}>Xóa mẫu</button>
      </div>
      <p class="voice-profile__note" id="voice-progress" hidden></p>
    </section>
  `
  );

  const statusEl = container.querySelector<HTMLElement>('#voice-status')!;
  const progressEl = container.querySelector<HTMLElement>('#voice-progress')!;
  const fileInput = container.querySelector<HTMLInputElement>('#voice-file')!;
  const previewBtn = container.querySelector<HTMLButtonElement>('#voice-preview')!;
  const removeBtn = container.querySelector<HTMLButtonElement>('#voice-remove')!;

  previewBtn.addEventListener('click', async () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = await createReferencePreviewUrl(profileId);
    if (!previewUrl) return;
    const audio = new Audio(previewUrl);
    void audio.play();
  });

  removeBtn.addEventListener('click', async () => {
    await removeVoiceProfile(profileId);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    previewBtn.disabled = true;
    removeBtn.disabled = true;
    statusEl.textContent = 'Chưa có file mẫu.';
    progressEl.hidden = true;
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;

    progressEl.hidden = false;
    progressEl.textContent = 'Đang lưu file mẫu...';

    try {
      const meta = await importVoiceSampleFile(profileId, file);
      statusEl.textContent = `Đã lưu mẫu (${meta.durationSec.toFixed(1)}s, chỉ trên máy này).`;
      previewBtn.disabled = false;
      removeBtn.disabled = false;
      progressEl.textContent = 'Xong! Bấm "Nghe mẫu" để nghe lại.';
    } catch (err) {
      statusEl.textContent = formatUploadError(err);
      progressEl.textContent = '';
      progressEl.hidden = true;
    }
  });
}

function formatStatus(status: VoiceProfileStatus): string {
  if (status.state === 'unsupported') return status.reason;
  if (status.state === 'ready') {
    return `Đã có file mẫu (${status.meta.durationSec.toFixed(1)}s).`;
  }
  return 'Chưa có file mẫu.';
}

function formatUploadError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.startsWith('VOICE_TOO_SHORT')) {
    return `File quá ngắn. Cần ít nhất ${VOICE_SAMPLE_MIN_SEC} giây.`;
  }
  if (raw.startsWith('VOICE_TOO_LONG')) {
    return `File quá dài. Tối đa ${VOICE_SAMPLE_MAX_SEC} giây.`;
  }
  if (raw === 'OPFS_UNAVAILABLE') {
    return 'Trình duyệt không hỗ trợ lưu file local. Hãy dùng Chrome/Edge mới.';
  }
  return 'Không xử lý được file. Hãy thử file WAV/MP3 khác.';
}

function escapeHtml(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
