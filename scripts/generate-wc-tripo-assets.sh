#!/usr/bin/env bash
# Generate World Cup 2026 glTF assets via Tripo (requires TRIPO_API_KEY in .env + credits).
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi
if [[ -z "${TRIPO_API_KEY:-}" ]]; then
  echo "TRIPO_API_KEY missing. Add it to .env (see .env.example)." >&2
  exit 1
fi
if ! python3 "$root/scripts/tripo-balance.py"; then
  echo "Tripo balance is 0 or unavailable. Top up at https://platform.tripo3d.ai/ for the account tied to this API key." >&2
  exit 1
fi
TRIPO_SCRIPT="$root/.cursor/skills/threejs-3d-generator/scripts/threejs_3d_asset.py"
if [[ ! -f "$TRIPO_SCRIPT" ]]; then
  echo "Tripo skill script not found at $TRIPO_SCRIPT" >&2
  exit 1
fi
OUT="$root/public/models/world-cup-2026"
MODEL_VERSION="v3.1-20260211"
run_text() {
  local name="$1"
  local prompt="$2"
  local tmp="$OUT/_tripo-$name"
  echo "==> Tripo: $name"
  python3 "$TRIPO_SCRIPT" text \
    --prompt "$prompt" \
    --model-version "$MODEL_VERSION" \
    --texture-quality standard \
    --geometry-quality standard \
    --wait --download --out-dir "$tmp"
  local glb
  glb="$(find "$tmp" -name '*.glb' -type f | head -1)"
  if [[ -z "$glb" ]]; then
    echo "No GLB downloaded for $name in $tmp" >&2
    exit 1
  fi
  cp "$glb" "$OUT/$name.glb"
  echo "Installed $OUT/$name.glb"
  rm -rf "$tmp"
}
mkdir -p "$OUT"
run_text ball \
  "classic soccer football ball, black and white pentagon hexagon panels, game-ready low poly browser prop, centered pivot, PBR, isolated"
run_text goal-frame \
  "soccer goal frame, white metal posts and crossbar, empty net opening, game-ready low poly, side view readable silhouette, isolated"
run_text striker \
  "stylized cartoon football soccer player striker number 10, full body T-pose, side-readable silhouette, kid-friendly game character, clean jersey shorts boots, low poly"
run_text defender \
  "stylized cartoon football defender player number 4, full body T-pose, side-readable silhouette, kid-friendly, low poly game character"
run_text gk \
  "stylized cartoon goalkeeper yellow jersey gloves number 1, full body T-pose, kid-friendly low poly game character"
echo "Done. Rebuild: npm run build"
