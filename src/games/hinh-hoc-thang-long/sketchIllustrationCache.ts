import type { ObjectShape } from './objectBank';
import { resolveIllustrationBuilderId } from './illustrationResolver';
import { paintBuilder } from './sketchDraw/paintBuilder';

const bitmapCache = new Map<string, HTMLCanvasElement>();

const FALLBACK_W = 280;
const FALLBACK_H = 200;

function deviceDpr(): number {
  return Math.min(window.devicePixelRatio || 1, 2);
}

function cacheKey(builderId: string, width: number, height: number, dpr: number): string {
  return `${builderId}|${Math.round(width)}x${Math.round(height)}|${dpr}`;
}

function renderToOffscreen(builderId: string, width: number, height: number, dpr: number): HTMLCanvasElement {
  const key = cacheKey(builderId, width, height, dpr);
  const hit = bitmapCache.get(key);
  if (hit) return hit;

  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.round(width * dpr));
  off.height = Math.max(1, Math.round(height * dpr));
  const ctx = off.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBuilder(ctx, builderId, width, height);
  }
  bitmapCache.set(key, off);
  return off;
}

export function prewarmSketchIllustration(
  objectId: string,
  label: string,
  shape: ObjectShape,
  width: number,
  height: number
): void {
  const builderId = resolveIllustrationBuilderId(objectId, label, shape);
  renderToOffscreen(builderId, width, height, deviceDpr());
}

function uniqueBuilderKeys(
  items: Array<{ objectId: string; label: string; shape: ObjectShape }>,
  width: number,
  height: number
): string[] {
  const w = width > 0 ? width : FALLBACK_W;
  const h = height > 0 ? height : FALLBACK_H;
  const dpr = deviceDpr();
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const item of items) {
    const builderId = resolveIllustrationBuilderId(item.objectId, item.label, item.shape);
    const dedupe = cacheKey(builderId, w, h, dpr);
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    keys.push(dedupe);
    renderToOffscreen(builderId, w, h, dpr);
  }
  return keys;
}

function builderIdFromCacheKey(key: string): string {
  return key.split('|')[0] ?? 'o003';
}

function parseCacheKeyDimensions(key: string): { width: number; height: number; dpr: number } {
  const [, dim, dprStr] = key.split('|');
  const [w, h] = (dim ?? `${FALLBACK_W}x${FALLBACK_H}`).split('x').map((n) => parseInt(n, 10));
  return {
    width: Number.isFinite(w) && w > 0 ? w : FALLBACK_W,
    height: Number.isFinite(h) && h > 0 ? h : FALLBACK_H,
    dpr: parseFloat(dprStr ?? '1') || 1,
  };
}

export function preloadSketchIllustrations(
  items: Array<{ objectId: string; label: string; shape: ObjectShape }>,
  width: number,
  height: number
): void {
  uniqueBuilderKeys(items, width, height);
}

/** Vẽ sẵn từng minh họa, nhường khung hình để UI loading cập nhật. */
export function preloadSketchIllustrationsAsync(
  items: Array<{ objectId: string; label: string; shape: ObjectShape }>,
  width: number,
  height: number,
  onProgress?: (done: number, total: number) => void,
  shouldAbort?: () => boolean
): Promise<void> {
  const w = width > 0 ? width : FALLBACK_W;
  const h = height > 0 ? height : FALLBACK_H;
  const dpr = deviceDpr();
  const seen = new Set<string>();
  const queue: string[] = [];
  for (const item of items) {
    const builderId = resolveIllustrationBuilderId(item.objectId, item.label, item.shape);
    const dedupe = cacheKey(builderId, w, h, dpr);
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    queue.push(dedupe);
  }

  const total = queue.length;
  if (total === 0) {
    onProgress?.(0, 0);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let index = 0;

    const step = () => {
      if (shouldAbort?.()) {
        resolve();
        return;
      }
      if (index >= total) {
        onProgress?.(total, total);
        resolve();
        return;
      }

      try {
        const key = queue[index]!;
        const { width: rw, height: rh, dpr: rd } = parseCacheKeyDimensions(key);
        renderToOffscreen(builderIdFromCacheKey(key), rw, rh, rd);
      } catch (err) {
        console.warn('[sketch-preload] render failed', queue[index], err);
      }
      index++;
      onProgress?.(index, total);
      window.setTimeout(step, 0);
    };

    window.setTimeout(step, 0);
  });
}

export function blitSketchIllustration(
  canvas: HTMLCanvasElement,
  objectId: string,
  label: string,
  shape: ObjectShape,
  size?: { width: number; height: number }
): void {
  const builderId = resolveIllustrationBuilderId(objectId, label, shape);
  const w =
    size && size.width > 0
      ? size.width
      : canvas.clientWidth > 0
        ? canvas.clientWidth
        : FALLBACK_W;
  const h =
    size && size.height > 0
      ? size.height
      : canvas.clientHeight > 0
        ? canvas.clientHeight
        : FALLBACK_H;
  const dpr = deviceDpr();
  const src = renderToOffscreen(builderId, w, h, dpr);
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
}

export function clearSketchIllustrationCache(): void {
  bitmapCache.clear();
}

export function defaultSketchArtSize(): { width: number; height: number } {
  return { width: FALLBACK_W, height: FALLBACK_H };
}

/** Đo khung vẽ sau khi sổ đã gắn vào DOM. */
export function measureSketchArtSize(sketchbookRoot: HTMLElement): { width: number; height: number } {
  const paper = sketchbookRoot.querySelector<HTMLElement>('.sketchbook__paper');
  const canvas = sketchbookRoot.querySelector<HTMLCanvasElement>('.sketchbook__art');
  const rect = paper?.getBoundingClientRect();
  const w = rect && rect.width > 8 ? rect.width : canvas?.clientWidth || FALLBACK_W;
  const h = rect && rect.height > 8 ? rect.height : canvas?.clientHeight || FALLBACK_H;
  return { width: w, height: h };
}
