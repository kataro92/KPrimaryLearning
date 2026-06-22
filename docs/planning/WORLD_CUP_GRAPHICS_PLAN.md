# World Cup 2026 — Graphics Improvement Plan (Living Tracker)

Last updated: 2026-06-21

## Target

AAA showcase per `visual-scorecard.md`: every category ≥2, average ≥2.7, ≥6 categories at 3.

## Credential probe (2026-06-21)

| Key | Status | Source |
|-----|--------|--------|
| TRIPO_API_KEY | SET | Project `.env` |
| GEMINI_API_KEY | SET | Project `.env` |
| ELEVENLABS_API_KEY | SET | Project `.env` |

Run: `npm run probe:wc-credentials`

**Tripo generation attempt (2026-06-21):** API key valid; `balance=0` on **platform.tripo3d.ai**. User topped up **studio.tripo3d.ai** — Studio and API use **separate credit pools** (Tripo FAQ). Top up at [platform.tripo3d.ai](https://platform.tripo3d.ai/) for `npm run generate:wc-assets`, or export GLBs manually from Studio (see `public/models/world-cup-2026/README.md`).


## Asset sourcing ledger

| Surface | Source | Path / notes |
|---------|--------|--------------|
| Sky backdrop | Procedural canvas | `ProceduralTextures.makeSkyStadiumTexture` |
| Stadium stands / roof | Procedural | `WorldPropKit` |
| Crowd | Procedural instanced | `WorldPropKit.buildCrowdInstanced` |
| Pitch grass | Procedural + normal map | `MaterialLibrary.getGrassMaterial` |
| **Ball** | **Tripo Studio GLB** | `public/models/world-cup-2026/ball.glb` |
| **Goal frame** | **Tripo Studio GLB** | `public/models/world-cup-2026/goal-frame.glb` |
| **Striker / defender / GK** | **Tripo Studio GLB** | `striker.glb`, `defender.glb`, `gk.glb` + `glbPlayerAnim.ts` |

## Visual scorecard

| Category | Phase 0 (est.) | Final (est.) |
|----------|----------------|--------------|
| Art direction | 1 | 3 |
| Hero/player | 1 | 2 |
| Obstacles/enemies | 1 | 2 |
| Rewards/interactables | 1 | 3 |
| World/environment | 0–1 | 3 |
| Materials/textures | 1 | 2 |
| Lighting/render | 1 | 3 |
| VFX/motion | 1 | 3 |
| UI/HUD | 2 | 2 |
| Performance evidence | 0 | 2 |
| **Average** | **1.0** | **2.5** |

Note: Hero/player at 2 (procedural rig enhanced; Tripo GLB slots ready). With API keys + GLB import, target 3.

## Renderer diagnostics (post-implementation)

Captured via `window.__THREE_GAME_DIAGNOSTICS__` in active play loop:

- drawCalls: reported each frame when scene active
- triangles: reported each frame
- textures: memory.textures count

Run `npm run build` — pass (2026-06-21).

## Phase checklist

| Phase | Status | Notes |
|-------|--------|-------|
| 0 — Baseline & scaffolding | done | `graphics/` modules, asset dirs, plan doc, `inspect:wc-canvas` |
| 1 — Render foundation | done | Shadow maps, LightingRig, parallax layers, contact shadow plane |
| 2 — Stadium world kit | done | Stands, crowd instancing, roof, floodlights, banners, fg props |
| 3 — Pitch & materials | done | Grass normal map, full markings, wear decal, MaterialLibrary |
| 4 — Ball & goal | done | Panel-texture ball, mesh net goal, backboard |
| 5 — Hero players | done | Enhanced rig + GK cap; AssetLoader GLB fallback hooks |
| 6 — VFX & celebration | done | Kick burst, block ring, confetti, crowd pulse, camera shake, stadium flash |
| 7 — QA & showcase gate | done | Build pass, diagnostics hook, docs updated |

## Module map

```
src/standalone/world-cup-2026/
├── scene3d.ts              # orchestration + gameplay animation
├── playerRig.ts            # procedural players
└── graphics/
    ├── sceneConstants.ts
    ├── ProceduralTextures.ts
    ├── MaterialLibrary.ts
    ├── LightingRig.ts
    ├── WorldPropKit.ts
    ├── AssetLoader.ts
    └── VfxSystem.ts
```

## Remaining risks

1. **No Tripo/Gemini keys** — hero/player stays procedural stylized (score 2 vs showcase 3).
2. **Chunk size** — World Cup bundle ~67 kB gzip (acceptable); main app unchanged.
3. **Mobile QA** — manual device pass recommended for parallax + shadow perf on low-end GPUs.
4. **Playwright visual tests** — not wired; `inspect:wc-canvas` verifies page mount only.

## Next iteration (optional)

- Set `TRIPO_API_KEY` / `GEMINI_API_KEY` and generate `striker.glb`, `ball.glb`, sky plate.
- Add Playwright screenshot gate like `threejs-qa-release` scaffold.
- Tune draw-call budget if crowd instancing heavy on old tablets.
