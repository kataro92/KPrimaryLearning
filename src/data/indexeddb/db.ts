import type { GameProgress, PlaySession, PlayerProfile } from '../types';

const DB_NAME = 'kv_fun_learning';
const DB_VERSION = 1;
const ACTIVE_PROFILE_KEY = 'kv_active_profile_id';

export interface AppDatabase {
  profile: PlayerProfile | null;
  progress: GameProgress[];
  sessions: PlaySession[];
}

function progressId(profileId: string, gameId: string): string {
  return `${profileId}::${gameId}`;
}

function toAppProgress(stored: GameProgress): GameProgress {
  const maybeComposite = stored.gameId.includes('::');
  if (!maybeComposite) return stored;
  const gameId = (stored as GameProgress & { logicalGameId?: string }).logicalGameId
    ?? stored.gameId.split('::')[1]
    ?? stored.gameId;
  return { ...stored, gameId };
}

let dbPromise: Promise<IDBDatabase> | null = null;
let repairPromise: Promise<void> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      autoRepairLegacyData(db)
        .catch((err) => {
          console.warn('[db] auto-repair skipped due to error', err);
        })
        .finally(() => resolve(db));
    };
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'playerIdLocal' });
      }
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'gameId' });
      }
      if (!db.objectStoreNames.contains('sessions')) {
        const s = db.createObjectStore('sessions', { keyPath: 'sessionId' });
        s.createIndex('by_game', 'gameId', { unique: false });
      }
    };
  });
  return dbPromise;
}

function requestToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function autoRepairLegacyData(db: IDBDatabase): Promise<void> {
  if (repairPromise) return repairPromise;
  repairPromise = (async () => {
    const readTx = db.transaction(['profile', 'progress', 'sessions'], 'readonly');
    const [profiles, progressRows, sessionRows] = await Promise.all([
      requestToPromise(readTx.objectStore('profile').getAll() as IDBRequest<PlayerProfile[]>),
      requestToPromise(readTx.objectStore('progress').getAll() as IDBRequest<GameProgress[]>),
      requestToPromise(readTx.objectStore('sessions').getAll() as IDBRequest<PlaySession[]>),
      transactionDone(readTx),
    ]).then(([p, g, s]) => [p, g, s] as const);

    if (profiles.length === 0) return;

    const activeProfile =
      profiles.find((p) => p.playerIdLocal === getActiveProfileId()) ?? profiles[0]!;
    if (getActiveProfileId() !== activeProfile.playerIdLocal) {
      setActiveProfileId(activeProfile.playerIdLocal);
    }

    const writeTx = db.transaction(['progress', 'sessions'], 'readwrite');
    const progressStore = writeTx.objectStore('progress');
    const sessionsStore = writeTx.objectStore('sessions');
    let hasWrites = false;

    for (const row of progressRows) {
      const logicalGameId =
        (row as GameProgress & { logicalGameId?: string }).logicalGameId ??
        (row.gameId.includes('::') ? row.gameId.split('::')[1] : row.gameId) ??
        row.gameId;
      const normalizedProfileId = row.profileId ?? activeProfile.playerIdLocal;
      const normalizedKey = progressId(normalizedProfileId, logicalGameId);
      const needsRewrite =
        row.profileId !== normalizedProfileId ||
        row.gameId !== normalizedKey ||
        (row as GameProgress & { logicalGameId?: string }).logicalGameId !== logicalGameId;
      if (!needsRewrite) continue;

      hasWrites = true;
      const normalized = {
        ...row,
        profileId: normalizedProfileId,
        logicalGameId,
        gameId: normalizedKey,
      } as GameProgress;
      progressStore.put(normalized);
      if (row.gameId !== normalizedKey) progressStore.delete(row.gameId);
    }

    for (const row of sessionRows) {
      if (row.profileId) continue;
      hasWrites = true;
      sessionsStore.put({ ...row, profileId: activeProfile.playerIdLocal });
    }

    if (!hasWrites) return;
    await transactionDone(writeTx);
  })();

  return repairPromise;
}

function tx<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T | void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const result = fn(store);
        transaction.oncomplete = () => {
          if (result instanceof IDBRequest) {
            resolve(result.result as T);
          } else {
            resolve();
          }
        };
        transaction.onerror = () => reject(transaction.error);
      })
  );
}

export async function getProfile(): Promise<PlayerProfile | null> {
  const activeId = getActiveProfileId();
  const profiles = await getProfiles();
  if (activeId) {
    const active = profiles.find((p) => p.playerIdLocal === activeId);
    if (active) return active;
  }
  return profiles[0] ?? null;
}

export async function getProfiles(): Promise<PlayerProfile[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('profile', 'readonly').objectStore('profile').getAll();
    req.onsuccess = () =>
      resolve(
        ((req.result as PlayerProfile[]) ?? []).sort((a, b) => b.createdAt - a.createdAt)
      );
    req.onerror = () => reject(req.error);
  });
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfileId(profileId: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
}

export async function getProfileById(profileId: string): Promise<PlayerProfile | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('profile', 'readonly').objectStore('profile').get(profileId);
    req.onsuccess = () => resolve((req.result as PlayerProfile) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProfile(profile: PlayerProfile): Promise<void> {
  await tx('profile', 'readwrite', (store) => store.put(profile));
}

export async function getProgress(profileId: string, gameId: string): Promise<GameProgress | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db
      .transaction('progress', 'readonly')
      .objectStore('progress')
      .get(progressId(profileId, gameId));
    req.onsuccess = () => {
      const found = (req.result as GameProgress) ?? null;
      if (found) {
        resolve(toAppProgress(found));
        return;
      }
      const legacyReq = db.transaction('progress', 'readonly').objectStore('progress').get(gameId);
      legacyReq.onsuccess = () => {
        const legacy = (legacyReq.result as GameProgress) ?? null;
        resolve(legacy ? { ...legacy, id: progressId(profileId, gameId), profileId } : null);
      };
      legacyReq.onerror = () => reject(legacyReq.error);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveProgress(progress: GameProgress): Promise<void> {
  if (!progress.profileId) throw new Error('saveProgress requires profileId');
  const normalized = {
    ...progress,
    logicalGameId: progress.gameId,
    gameId: progressId(progress.profileId, progress.gameId),
  };
  await tx('progress', 'readwrite', (store) => store.put(normalized as GameProgress));
}

export async function saveSession(session: PlaySession): Promise<void> {
  if (!session.profileId) throw new Error('saveSession requires profileId');
  await tx('sessions', 'readwrite', (store) => store.put(session));
}

export async function getRecentSessions(
  profileId: string,
  gameId: string,
  limit = 5
): Promise<PlaySession[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('sessions', 'readonly').objectStore('sessions').getAll();
    req.onsuccess = () => {
      const all = (req.result as PlaySession[]).filter((s) => s.gameId === gameId);
      const scoped = all.filter((s) => (s.profileId ?? '') === profileId);
      const using = scoped.length > 0 ? scoped : all.filter((s) => !s.profileId);
      resolve(using.sort((a, b) => b.endedAt - a.endedAt).slice(0, limit));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getAllProgress(profileId: string): Promise<GameProgress[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('progress', 'readonly').objectStore('progress').getAll();
    req.onsuccess = () => {
      const all = (req.result as GameProgress[]) ?? [];
      const scoped = all.filter((p) => (p.profileId ?? '') === profileId);
      if (scoped.length > 0) {
        resolve(scoped.map(toAppProgress));
        return;
      }
      const legacy = all.filter((p) => !p.profileId && !p.gameId.includes('::'));
      resolve(legacy.map((p) => ({ ...p, profileId })));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getAllSessions(profileId: string): Promise<PlaySession[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('sessions', 'readonly').objectStore('sessions').getAll();
    req.onsuccess = () => {
      const all = (req.result as PlaySession[]) ?? [];
      const scoped = all.filter((s) => (s.profileId ?? '') === profileId);
      const using = scoped.length > 0 ? scoped : all.filter((s) => !s.profileId);
      resolve(using.sort((a, b) => b.endedAt - a.endedAt));
    };
    req.onerror = () => reject(req.error);
  });
}
