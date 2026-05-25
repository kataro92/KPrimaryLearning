import type { ObjectShape } from './objectBank';
import { blitSketchIllustration } from './sketchIllustrationCache';

export function renderSketchIllustration(
  canvas: HTMLCanvasElement,
  objectId: string,
  label: string,
  shape: ObjectShape,
  size?: { width: number; height: number }
): void {
  blitSketchIllustration(canvas, objectId, label, shape, size);
}
