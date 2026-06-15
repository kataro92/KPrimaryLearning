---
name: kv-3d-models
description: >-
  Creates and modifies 3D models for KVPrimaryFunLearning games using Three.js
  procedural geometry, glTF/GLB assets under public/models/, and Sketchfab fetch.
  Use when adding or changing hero props, game scenes, meshes, GLB/glTF files,
  Sketchfab downloads, fitModelToHeight, or procedural fallbacks.
---

# KV 3D Models

Vanilla TypeScript + Three.js only. No framework migration. Prefer **lightweight procedural** meshes; add **glTF** when a recognizable asset is needed; always ship a **procedural fallback** if glTF may be missing.

## Choose an approach

| Need | Approach | Output location |
|------|----------|-----------------|
| Simple stylized prop (cube, drum, robot blocks) | Procedural `THREE.*Geometry` in a `*Scene.ts` or `props/builders.ts` | `src/games/...` |
| Recognizable licensed model (hero, boat, mech) | Sketchfab CC BY → `npm run fetch:models` | `public/models/<game>/` |
| Thăng Long minh họa đồ vật | **2D canvas** trong sổ vẽ (`sketchDraw/parts2d.ts`, `sketchIllustrations.ts`) — không dùng Three.js | `src/games/hinh-hoc-thang-long/sketchDraw/` |
| Heavy sculpt / UV / animation outside repo | Optional Blender via CLI-Hub → export GLB → same `public/models/` paths | See [reference.md](reference.md) |

Default order: **procedural → glTF → external DCC** (last resort).

## Create a new procedural model

1. Add geometry in a dedicated `buildFallback*` / `build*` method on a `THREE.Group` (see `dongSonDrumScene.ts`, `ethicsHeartScene.ts`).
2. Use `MeshStandardMaterial` with stylized PBR (moderate roughness, low metalness unless metal).
3. Fit to gameplay scale with `fitModelToHeight` or local box scaling (target height documented in scene, e.g. ~1.35–5.2 units).
4. In `dispose()`, traverse and dispose geometries, materials, textures; cancel RAF and remove listeners.
5. Wire gameplay hooks: `onCorrect*`, `onWrong*`, `onCompleted*` from `play.ts`.

Thăng Long: sửa minh họa trong `sketchDraw/parts2d.ts` (`draw_oNNN`), không thêm glTF cho game này trừ khi product đổi lại sang 3D.

## Add or replace a glTF hero / prop

1. Pick a **CC BY** (or compatible) Sketchfab model; record author + license in `public/models/<game>/README.md`.
2. Add entry to `scripts/download-sketchfab-model.mjs` `MODELS` array (`uid`, `outDir`, `outFile`, `name`).
3. Run `SKETCHFAB_API_TOKEN=... npm run fetch:models` (token not committed).
4. In scene, define URL candidates (glb + `scene.gltf` folder):

```typescript
const MODEL_URLS = [
  `${import.meta.env.BASE_URL}models/my-game/hero.glb`,
  `${import.meta.env.BASE_URL}models/my-game/scene.gltf`,
] as const;
```

5. Load with `tryLoadGltfScene(MODEL_URLS)` from `@/core/assets/fitGltfModel`; on failure, call procedural fallback and `console.warn` once.
6. After load: `fitModelToHeight(model, targetHeight, yOffset)`; set `castShadow` / `receiveShadow` on meshes as needed.
7. Tint or restyle with `traverse` + material clone (see `vanMieuTurtleScene.styleTurtleMaterials`).

Core loaders (do not duplicate):

- `loadGltfModel` — cached `GLTFLoader` (`src/core/assets/loadGltfModel.ts`)
- `tryLoadGltfScene` / `fitModelToHeight` — `src/core/assets/fitGltfModel.ts`
- `disposeObject3D` — `src/core/assets/disposeObject3D.ts`

## Modify an existing model

**Procedural:** edit the builder function; keep colors aligned with `gameThemes.ts` / scene palette.

**glTF file:** re-export GLB preserving ~Y-up, reasonable origin at base/center; replace file under `public/models/`; clear browser cache in dev if needed.

**Runtime only (no file change):** adjust `fitModelToHeight`, `rotation.y`, material `color`/`emissive` in scene `loadModel` — prefer this for quick iteration.

## Thăng Long: minh họa mới (o001–o100)

1. Thêm/sửa hàm `draw_oNNN` trong `sketchDraw/parts2d.ts` (hoặc map kind trong generator).
2. `objectResolver.ts`: `KEYWORD_BUILDER` cho nhãn bổ sung (o101+).
3. `objectTraits.ts`: dòng mô tả dưới tranh trong sổ.

## Quality checklist

- [ ] `npm run build` passes
- [ ] Scene `dispose()` disposes all owned GPU resources
- [ ] glTF path works **and** fallback renders when file absent
- [ ] License README updated for new Sketchfab assets
- [ ] Hero faces player / camera as required by game design
- [ ] No heavy assets in bundle unless under `public/models/` (not imported as TS modules)

## Scene standards

Follow `.cursor/rules/kvprimaryfunlearning-threejs-scenes.mdc`: ACESFilmic, pixel ratio ≤ 2, layered lights, immediate feedback on correct answers.

## More detail

- Paths, examples, optional Blender CLI-Hub: [reference.md](reference.md)
- Business/tech constraints: `docs/requirements/TECHNICAL_REQUIREMENTS.md`
