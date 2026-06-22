#!/usr/bin/env bash
# Probe API keys for World Cup asset tooling (reads project .env only).
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -f "$root/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$root/.env"
  set +a
fi
probe() {
  local name="$1"
  if [[ -n "${!name:-}" ]]; then echo "${name}=SET"
  else echo "${name}=MISSING"
  fi
}
probe TRIPO_API_KEY
probe GEMINI_API_KEY
probe ELEVENLABS_API_KEY
