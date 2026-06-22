# World Cup 2026 — 3D assets

Optional glTF models loaded by `src/standalone/world-cup-2026/graphics/AssetLoader.ts`.
If a file is missing, the game uses procedural fallbacks automatically.

| File | Role | Source |
|------|------|--------|
| `ball.glb` | Match ball | Tripo / manual export (optional) |
| `goal-frame.glb` | Goal frame | Tripo / manual export (optional) |
| `striker.glb` | Player #10 | Rigged Tripo: **idle, jump, run, slash, walk** (5 clips) → scroll **run**, ghi bàn **jump**. |
| `defender.glb` | Defender #4 | Rigged Tripo: **idle, jump, run, slash, walk** (5 clips) — cùng thứ tự striker. |
| `gk.glb` | Goalkeeper #1 | Rigged Tripo: **idle, jump_down, look_around, run, walk** — cản phá **jump_down**. |

Place generated textures in `public/textures/world-cup-2026/` (see README there).

## Generate with Tripo (optional)

### Important: Studio vs API credits

| Product | Top-up URL | Used by this project? |
|---------|------------|----------------------|
| **Tripo Studio** | [studio.tripo3d.ai](https://studio.tripo3d.ai/) | No — separate billing |
| **Tripo API** | [platform.tripo3d.ai](https://platform.tripo3d.ai/) | Yes — `TRIPO_API_KEY` in `.env` |

Credits bought on Studio **do not** apply to the API. For `npm run generate:wc-assets`, top up at **platform.tripo3d.ai** (same login may work, but billing is separate). Check balance:

```bash
npm run tripo:balance
```

### Option A — API (automated)

1. Add `TRIPO_API_KEY` from [platform.tripo3d.ai](https://platform.tripo3d.ai/) to `.env`.
2. Ensure `npm run tripo:balance` shows `balance=` **> 0**.
3. Run:

```bash
npm run generate:wc-assets
npm run build
```

### Option B — Studio (manual export)

1. Generate models in [studio.tripo3d.ai](https://studio.tripo3d.ai/) (text/image → 3D).
2. Export **GLB** and save into this folder with exact names:

   - `ball.glb`
   - `goal-frame.glb`
   - `striker.glb` (optional — game still uses procedural player animation if skipped)
   - `defender.glb`
   - `gk.glb`

3. `npm run build` — `AssetLoader.ts` picks up files automatically; missing files use procedural fallbacks.

The game loads GLB files automatically via `AssetLoader.ts`; procedural fallbacks apply if a file is missing.

