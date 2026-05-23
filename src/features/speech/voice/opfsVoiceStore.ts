import type { VoiceProfileMeta } from './voiceProfileTypes';

const ROOT = 'kv-tts-voices';

function supportsOpfs(): boolean {
  return typeof navigator !== 'undefined' && 'storage' in navigator && 'getDirectory' in navigator.storage;
}

async function rootDir(): Promise<FileSystemDirectoryHandle> {
  if (!supportsOpfs()) throw new Error('OPFS_UNAVAILABLE');
  return navigator.storage.getDirectory();
}

async function profileDir(profileId: string, create = false): Promise<FileSystemDirectoryHandle> {
  const root = await rootDir();
  return root.getDirectoryHandle(`${ROOT}/${profileId}`, { create });
}

async function writeFile(
  dir: FileSystemDirectoryHandle,
  name: string,
  data: ArrayBuffer | Blob
): Promise<void> {
  const handle = await dir.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(data);
  await writable.close();
}

async function readFile(dir: FileSystemDirectoryHandle, name: string): Promise<ArrayBuffer | null> {
  try {
    const handle = await dir.getFileHandle(name);
    return handle.getFile().then((f) => f.arrayBuffer());
  } catch {
    return null;
  }
}

export async function saveVoicePcm(
  profileId: string,
  pcm: Float32Array,
  meta: VoiceProfileMeta
): Promise<void> {
  const dir = await profileDir(profileId, true);
  await writeFile(dir, 'reference.pcm', pcm.buffer.slice(0));
  await writeFile(dir, 'meta.json', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
}

export async function saveVoiceMeta(profileId: string, meta: VoiceProfileMeta): Promise<void> {
  const dir = await profileDir(profileId, true);
  await writeFile(dir, 'meta.json', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
}

export async function loadVoiceMeta(profileId: string): Promise<VoiceProfileMeta | null> {
  try {
    const dir = await profileDir(profileId, false);
    const raw = await readFile(dir, 'meta.json');
    if (!raw) return null;
    return JSON.parse(new TextDecoder().decode(raw)) as VoiceProfileMeta;
  } catch {
    return null;
  }
}

export async function loadVoicePcm(profileId: string): Promise<Float32Array | null> {
  try {
    const dir = await profileDir(profileId, false);
    const raw = await readFile(dir, 'reference.pcm');
    if (!raw) return null;
    return new Float32Array(raw);
  } catch {
    return null;
  }
}

export async function deleteVoiceProfile(profileId: string): Promise<void> {
  try {
    const root = await rootDir();
    await root.removeEntry(`${ROOT}/${profileId}`, { recursive: true });
  } catch {
    /* already gone */
  }
}

export function isOpfsAvailable(): boolean {
  return supportsOpfs();
}
