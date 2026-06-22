#!/usr/bin/env python3
"""Print Tripo account balance (uses TRIPO_API_KEY from env or .env)."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from urllib import error, request

ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT / ".env"
if ENV.is_file():
    for line in ENV.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

key = os.environ.get("TRIPO_API_KEY", "")
if not key:
    print("TRIPO_API_KEY=MISSING", file=sys.stderr)
    sys.exit(1)

req = request.Request(
    "https://api.tripo3d.ai/v2/openapi/user/balance",
    headers={"Authorization": f"Bearer {key}"},
)
try:
    with request.urlopen(req, timeout=20) as resp:
        body = json.load(resp)
except error.HTTPError as exc:
    print(f"Tripo balance check failed: HTTP {exc.code}", file=sys.stderr)
    sys.exit(1)

data = body.get("data") or {}
balance = data.get("balance", "?")
frozen = data.get("frozen", "?")
print(f"balance={balance} frozen={frozen}")
if isinstance(balance, (int, float)) and balance <= 0:
    sys.exit(2)
