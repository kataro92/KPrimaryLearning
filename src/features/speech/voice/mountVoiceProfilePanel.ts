import { loadSettings, saveSettings } from '@/data/storage/settingsStore';
import type { TtsVoicePreset } from '@/data/types';
import { speakVietnamese } from '@/features/speech/speechService';
import {
  ensureSpeechVoicesLoaded,
  formatVoiceLabel,
  hasDistinctWebSpeechVoiceForPreset,
  hasMultipleVietnameseWebSpeechVoices,
  listVietnameseVoices,
  pickVietnameseVoiceForPreset,
} from '@/features/speech/providers/vietnameseVoicePicker';
import {
  TTS_VOICE_PRESETS,
  normalizeTtsVoicePreset,
} from '@/features/speech/ttsVoicePreset';
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

const PREVIEW_LINE = 'Xin chào! Mình là bạn học tập.';

function insertVoicePanel(container: HTMLElement, html: string): void {
  const levelAnchor = container.querySelector('.player-level');
  if (levelAnchor) {
    levelAnchor.insertAdjacentHTML('afterend', html);
  } else {
    container.insertAdjacentHTML('afterbegin', html);
  }
}

export async function mountVoiceProfilePanel(
  container: HTMLElement,
  profileId: string
): Promise<void> {
  await ensureSpeechVoicesLoaded();

  if (!hasMultipleVietnameseWebSpeechVoices()) {
    insertVoicePanel(
      container,
      `
    <p class="voice-profile-notice clay-card" role="status">${escapeHtml(singleVoiceNoticeLine())}</p>
    `
    );
    return;
  }

  let previewUrl: string | null = null;
  const [status, settings] = await Promise.all([
    getVoiceProfileStatus(profileId),
    Promise.resolve(loadSettings()),
  ]);
  const activePreset = normalizeTtsVoicePreset(settings.ttsVoicePreset);
  const presetNote = describePresetVoice(activePreset);

  const presetButtons = (Object.keys(TTS_VOICE_PRESETS) as TtsVoicePreset[])
    .map((key) => {
      const p = TTS_VOICE_PRESETS[key];
      const active = key === activePreset ? ' voice-preset--active' : '';
      return `<button type="button" class="voice-preset${active}" data-preset="${key}" aria-pressed="${key === activePreset}">
        <span class="voice-preset__emoji" aria-hidden="true">${p.emoji}</span>
        <span class="voice-preset__label">${p.label}</span>
      </button>`;
    })
    .join('');

  const sampleReady = status.state === 'ready';
  const panelHtml = `
    <section class="voice-profile clay-card" aria-label="Giọng đọc">
      <h3 class="voice-profile__title">Giọng đọc</h3>
      <p class="voice-profile__hint">Bật nút <strong>Giọng</strong> trên trang chủ để nghe khi chơi.</p>
      <div class="voice-preset-row" role="group" aria-label="Chọn kiểu giọng">
        ${presetButtons}
      </div>
      <p class="voice-profile__preset-note" id="voice-preset-note">${escapeHtml(presetNote)}</p>
      <div class="voice-profile__toolbar">
        <button type="button" class="btn btn-secondary" id="voice-try-preset">Nghe thử</button>
      </div>
      <details class="voice-profile__extra">
        <summary>File mẫu riêng (tùy chọn)</summary>
        <p class="voice-profile__extra-hint">Tải ${VOICE_SAMPLE_MIN_SEC}–${VOICE_SAMPLE_MAX_SEC}s tiếng Việt — chỉ lưu trên máy này, không đổi giọng AI.</p>
        <p class="voice-profile__status" id="voice-status">${escapeHtml(formatStatus(status))}</p>
        <div class="voice-profile__actions">
          <label class="btn btn-secondary voice-profile__upload">
            Chọn file
            <input type="file" id="voice-file" accept="audio/*" hidden />
          </label>
          <button type="button" class="btn btn-secondary" id="voice-preview" ${sampleReady ? '' : 'disabled'}>Nghe file</button>
          <button type="button" class="btn btn-secondary" id="voice-remove" ${sampleReady ? '' : 'disabled'}>Xóa</button>
        </div>
        <p class="voice-profile__note" id="voice-progress" hidden></p>
      </details>
    </section>
  `;

  insertVoicePanel(container, panelHtml);

  const section = container.querySelector<HTMLElement>('.voice-profile')!;
  const statusEl = section.querySelector<HTMLElement>('#voice-status')!;
  const progressEl = section.querySelector<HTMLElement>('#voice-progress')!;
  const fileInput = section.querySelector<HTMLInputElement>('#voice-file')!;
  const previewBtn = section.querySelector<HTMLButtonElement>('#voice-preview')!;
  const removeBtn = section.querySelector<HTMLButtonElement>('#voice-remove')!;
  const tryBtn = section.querySelector<HTMLButtonElement>('#voice-try-preset')!;
  const presetNoteEl = section.querySelector<HTMLElement>('#voice-preset-note')!;

  const refreshPresetNote = (preset: TtsVoicePreset) => {
    presetNoteEl.textContent = describePresetVoice(preset);
  };

  section.querySelectorAll<HTMLButtonElement>('.voice-preset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = normalizeTtsVoicePreset(btn.dataset.preset);
      const next = { ...loadSettings(), ttsVoicePreset: preset };
      saveSettings(next);
      section.querySelectorAll('.voice-preset').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('voice-preset--active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      refreshPresetNote(preset);
    });
  });

  tryBtn.addEventListener('click', () => {
    speakVietnamese(PREVIEW_LINE);
  });

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
    statusEl.textContent = 'Chưa có file.';
    progressEl.hidden = true;
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;

    progressEl.hidden = false;
    progressEl.textContent = 'Đang lưu...';

    try {
      const meta = await importVoiceSampleFile(profileId, file);
      statusEl.textContent = `Đã lưu (${meta.durationSec.toFixed(1)}s).`;
      previewBtn.disabled = false;
      removeBtn.disabled = false;
      progressEl.textContent = '';
    } catch (err) {
      statusEl.textContent = formatUploadError(err);
      progressEl.hidden = true;
    }
  });
}

function singleVoiceNoticeLine(): string {
  const viCount = listVietnameseVoices().length;
  if (viCount === 0) {
    return 'Giọng đọc: dùng giọng AI tiếng Việt. Bật nút Giọng trên trang chủ khi chơi.';
  }
  return 'Giọng đọc: máy chỉ có một giọng — dùng giọng AI tiếng Việt. Bật nút Giọng trên trang chủ khi chơi.';
}

function describePresetVoice(preset: TtsVoicePreset): string {
  if (preset === 'female') {
    return 'Giọng nữ: đọc bằng giọng AI tiếng Việt (tự nhiên nhất trên máy này).';
  }
  if (!hasDistinctWebSpeechVoiceForPreset(preset)) {
    return preset === 'male'
      ? 'Giọng nam: chọn giọng máy tính gần nhất có sẵn.'
      : 'Giọng hoạt hình: chọn giọng máy tính gần nhất có sẵn.';
  }
  const voice = pickVietnameseVoiceForPreset(preset);
  const label = formatVoiceLabel(voice);
  return preset === 'male'
    ? `Giọng nam: dùng giọng máy tính «${label}».`
    : `Giọng hoạt hình: dùng giọng máy tính «${label}».`;
}

function formatStatus(status: VoiceProfileStatus): string {
  if (status.state === 'unsupported') return status.reason;
  if (status.state === 'ready') {
    return `Có file mẫu (${status.meta.durationSec.toFixed(1)}s).`;
  }
  return 'Chưa có file mẫu.';
}

function formatUploadError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.startsWith('VOICE_TOO_SHORT')) {
    return `File quá ngắn (cần ≥ ${VOICE_SAMPLE_MIN_SEC}s).`;
  }
  if (raw.startsWith('VOICE_TOO_LONG')) {
    return `File quá dài (tối đa ${VOICE_SAMPLE_MAX_SEC}s).`;
  }
  if (raw === 'OPFS_UNAVAILABLE') {
    return 'Trình duyệt không lưu được file local.';
  }
  return 'Không đọc được file. Thử WAV hoặc MP3 khác.';
}

function escapeHtml(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
