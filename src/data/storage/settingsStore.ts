import { AppSettings, DEFAULT_SETTINGS } from '../types';

const KEY = 'kv_settings';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const merged: AppSettings = { ...DEFAULT_SETTINGS, ...parsed };
  // Before BGM: musicEnabled gated SFX; preserve that preference as sfxEnabled.
    if (parsed.sfxEnabled === undefined && parsed.musicEnabled !== undefined) {
      merged.sfxEnabled = parsed.musicEnabled;
    }
    return merged;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
