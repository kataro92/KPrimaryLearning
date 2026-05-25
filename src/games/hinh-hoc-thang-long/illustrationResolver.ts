import type { ObjectShape } from './shapeCatalog';
import { BUILDER_VISUAL_SHAPE, visualShapeForBuilder } from './builderVisualShape';
import { illustrationBuilderForObject } from './objectIllustrationMap';

/**
 * Builder vẽ tranh — mỗi câu oNNN dùng nét vẽ oNNN (1:1, khớp đáp án).
 */
export function resolveIllustrationBuilderId(
  objectId: string,
  _label: string,
  shape: ObjectShape
): string {
  const mapped = illustrationBuilderForObject(objectId, shape);
  if (mapped) return mapped;

  const num = parseInt(objectId.slice(1), 10);
  if (num >= 1 && num <= 538 && BUILDER_VISUAL_SHAPE[objectId] === shape) {
    return objectId;
  }

  return firstBuilderForShape(shape);
}

function firstBuilderForShape(shape: ObjectShape): string {
  for (const [builder, s] of Object.entries(BUILDER_VISUAL_SHAPE)) {
    if (s === shape) return builder;
  }
  return 'o003';
}

export function visualShapeForIllustrationBuilder(builderId: string): ObjectShape | undefined {
  return visualShapeForBuilder(builderId);
}
