#!/usr/bin/env python3
"""Tìm bài Chính tả trong JSON OCR TV → scripts/data/chinh-ta-seeds.json"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = Path(__file__).resolve().parent / "data" / "sgk-content"
OUT = Path(__file__).resolve().parent / "data" / "chinh-ta-seeds.json"

TV_SLUGS = [
    "tieng-viet-lop-4-tap-1-chan-troi-sang-tao",
    "tieng-viet-lop-4-tap-2-chan-troi-sang-tao-pdf",
]

CHINH_TA = re.compile(
    r"chính\s*tả|CHÍNH\s*TẢ|Nghe\s*[-–]?\s*viết|Nhớ\s*[-–]?\s*viết|Nghe\s*-\s*viết",
    re.I,
)
NGHE_VIET = re.compile(r"Nghe\s*[-–]?\s*viết", re.I)
LINE_VI = re.compile(
    r"^[A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐa-zà-ỹ].{8,120}$"
)


def load_book(slug: str) -> dict:
    return json.loads((CONTENT / f"{slug}.json").read_text(encoding="utf-8"))


def extract_seeds() -> list[dict]:
    seeds: list[dict] = []
    for slug in TV_SLUGS:
        book = load_book(slug)
        pages = book["pages"]
        for i, pg in enumerate(pages):
            text = pg.get("text", "")
            if not CHINH_TA.search(text):
                continue
            block_pages = pages[i : min(i + 4, len(pages))]
            block = "\n".join(p["text"] for p in block_pages)
            title_m = re.search(
                r"(?:CHÍNH TẢ|Chính tả)[^\n]*\n+([^\n]{4,80})",
                block,
                re.I,
            )
            title = title_m.group(1).strip() if title_m else f"Trang {pg['page']}"
            lines = []
            for line in block.splitlines():
                line = line.strip()
                if len(line) < 12 or len(line) > 200:
                    continue
                if CHINH_TA.search(line) and len(line) < 40:
                    continue
                if re.search(r"^(Bài|Phần|Tuần)\s+\d", line, re.I):
                    continue
                if LINE_VI.match(line) or ("," in line and len(line) > 20):
                    lines.append(line)
            if lines:
                seeds.append(
                    {
                        "book": book["file"],
                        "page": pg["page"],
                        "method": pg.get("method", "?"),
                        "title": title[:100],
                        "lines": lines[:25],
                    }
                )
    return seeds


def main() -> None:
    seeds = extract_seeds()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(seeds, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(seeds)} blocks → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
