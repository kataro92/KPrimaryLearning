# KV 3D Models — Reference

## Asset layout (`public/models/`)

| Game / feature | Typical paths | Fallback |
|----------------|---------------|----------|
| Trống Đồng | `trong-dong/dong-son-drum.glb`, `scene.gltf` | `dongSonDrumScene.buildFallbackDrum` |
| Trạng Nguyên | `trang-nguyen-toan/mech.glb` | Mecha procedural blocks |
| Trạng Tí | `tinh-nham-trang-ti/trex.glb` | Procedural T-Rex |
| Văn Miếu | `cuu-chuong-van-mieu/turtle.glb` | Green procedural turtle |
| Hội An | `tu-vung-hoi-an/boat/`, `lantern/` | Boat + lantern procedural |
| Thăng Long | `hinh-hoc-thang-long/props/oNNN.glb` | `builders.ts` procedural |
| Thám hiểm Cửu Long | `tham-hiem-cuu-long/crossbow/` | (game-specific) |

URLs in code must use `import.meta.env.BASE_URL` prefix for GitHub Pages deploys.

## Sketchfab pipeline

```bash
# .env or shell — never commit token
SKETCHFAB_API_TOKEN=your_token npm run fetch:models
```

Edit `scripts/download-sketchfab-model.mjs` → `MODELS[]` with:

- `uid` — model ID from Sketchfab URL
- `outDir` — under `public/models/...`
- `outFile` — preferred single `.glb` name
- `name` — human label for logs

Each folder needs `README.md`: author, license link, manual download steps.

## Code templates

### Hero scene: glTF + fallback

Pattern from `dongSonDrumScene.ts` / `vanMieuTurtleScene.ts`:

```typescript
private async loadModel(): Promise<void> {
  const scene = await tryLoadGltfScene(MODEL_URLS);
  if (this.disposed) return;
  this.clearPivot();
  if (scene) {
    fitModelToHeight(scene, TARGET_HEIGHT, yOffset);
    this.pivot.add(scene);
    return;
  }
  console.warn('glTF unavailable, using procedural fallback.');
  this.pivot.add(this.buildFallback());
}
```

### Thăng Long GLTF override

`loadPropGltfTemplate(builderId)` → `clonePropGltf(template, shape)` in `gltfProps.ts`.

### Dispose pivot contents

```typescript
import { disposeObject3D } from '@/core/assets/disposeObject3D';

private clearPivot(): void {
  while (this.pivot.children.length) {
    const child = this.pivot.children[0];
    this.pivot.remove(child);
    disposeObject3D(child);
  }
}
```

## Optional: Blender via CLI-Hub

For mesh edits agents cannot do in code (sculpt, rig, complex UV):

```bash
# Project venv from docs/tools/CLI_HUB.md
npm run cli-hub -- install blender
# Requires Blender app installed on the machine
npm run cli-hub -- launch blender --help
```

Export **glTF 2.0 / GLB**, Y-up, apply transforms, reasonable poly count for primary web (low-poly stylized). Copy into `public/models/<game>/` and document license if not original work.

## What not to do

- Do not add large `.glb` files to git without user approval (many models are gitignored or fetched locally).
- Do not import GLB from `src/` as bundled assets — use `public/models/`.
- Do not skip procedural fallback for hero meshes.
- Do not leave placeholder `BoxGeometry` in production when the task asked for a finished asset — complete fallback or fetch glTF.

## Related source files

- `src/core/assets/loadGltfModel.ts`
- `src/core/assets/fitGltfModel.ts`
- `src/core/assets/disposeObject3D.ts`
- `src/games/hinh-hoc-thang-long/props/builders.ts`
- `src/games/hinh-hoc-thang-long/props/gltfProps.ts`
- `scripts/download-sketchfab-model.mjs`
