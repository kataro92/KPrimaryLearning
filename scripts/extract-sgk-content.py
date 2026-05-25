#!/usr/bin/env python3
"""Trích toàn bộ văn bản SGK từ pdfs/ → scripts/data/sgk-content/{slug}.json"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from dataclasses import asdict, dataclass
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "pdfs"
OUT_DIR = Path(__file__).resolve().parent / "data" / "sgk-content"
MANIFEST = Path(__file__).resolve().parent / "data" / "sgk-content-manifest.json"
MIN_CHARS_FOR_TEXT = 80
OCR_LANG = "vie+eng"
VI_CHARS = re.compile(
    r"[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]",
    re.I,
)


@dataclass
class PageExtract:
    page: int
    chars: int
    method: str  # pypdf | ocr
    text: str


def slugify(name: str) -> str:
    s = re.sub(r"\.pdf$", "", name, flags=re.I)
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s[:120] or "sgk"


def vietnamese_quality(text: str) -> float:
    """Tỉ lệ ký tự có dấu — font lỗi / scan thường < 2%."""
    letters = re.sub(r"[\s\d\W_]+", "", text, flags=re.UNICODE)
    if len(letters) < 30:
        return 0.0
    return len(VI_CHARS.findall(text)) / len(letters)


def is_readable_vietnamese(text: str) -> bool:
    return vietnamese_quality(text) >= 0.035


def normalize_text(raw: str) -> str:
    t = raw.replace("\r\n", "\n")
    t = re.sub(r"[^\S\n]+", " ", t)
    t = re.sub(r" +", " ", t)
  # fix common pypdf unicode escapes like /uni1EC3
    t = re.sub(r"/uni([0-9A-Fa-f]{4})", lambda m: chr(int(m.group(1), 16)), t)
    return t.strip()


def ocr_page(pdf_path: Path, page_index: int) -> str:
    try:
        import fitz  # pymupdf
    except ImportError:
        return ""
    doc = fitz.open(str(pdf_path))
    if page_index >= len(doc):
        doc.close()
        return ""
    page = doc[page_index]
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    doc.close()
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        png = Path(tmp.name)
    try:
        pix.save(str(png))
        proc = subprocess.run(
            ["tesseract", str(png), "stdout", "-l", OCR_LANG, "--psm", "6"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if proc.returncode == 0:
            return normalize_text(proc.stdout)
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    finally:
        png.unlink(missing_ok=True)
    return ""


def extract_pdf(pdf_path: Path, use_ocr: bool, force_ocr: bool = False) -> dict:
    from pypdf import PdfReader

    reader = PdfReader(str(pdf_path))
    pages: list[PageExtract] = []
    ocr_count = 0
    text_count = 0

    for i, page in enumerate(reader.pages):
        raw = page.extract_text() or ""
        text = normalize_text(raw)
        method = "pypdf"
        need_ocr = use_ocr and (
            force_ocr
            or len(text) < MIN_CHARS_FOR_TEXT
            or not is_readable_vietnamese(text)
        )
        if need_ocr:
            ocr_text = ocr_page(pdf_path, i)
            if force_ocr and ocr_text:
                if is_readable_vietnamese(ocr_text) or vietnamese_quality(ocr_text) >= vietnamese_quality(text):
                    text = ocr_text
                    method = "ocr"
                    ocr_count += 1
            elif len(ocr_text) > len(text) and (
                is_readable_vietnamese(ocr_text) or not is_readable_vietnamese(text)
            ):
                text = ocr_text
                method = "ocr"
                ocr_count += 1
        if text and is_readable_vietnamese(text):
            text_count += 1
        pages.append(PageExtract(page=i + 1, chars=len(text), method=method, text=text))

    total_chars = sum(p.chars for p in pages)
    quality = (
        "good"
        if total_chars > 20000 and text_count > len(pages) * 0.5
        else "partial"
        if total_chars > 3000
        else "scan"
    )

    return {
        "file": pdf_path.name,
        "slug": slugify(pdf_path.name),
        "pageCount": len(pages),
        "pagesWithText": text_count,
        "ocrPages": ocr_count,
        "totalChars": total_chars,
        "extractQuality": quality,
        "extracted": date.today().isoformat(),
        "pages": [asdict(p) for p in pages],
    }


def main() -> None:
    use_ocr = "--ocr" in sys.argv
    force_ocr = "--force-ocr" in sys.argv
    only = None
    for arg in sys.argv[1:]:
        if arg.startswith("--pdf="):
            only = arg.split("=", 1)[1]
    if force_ocr:
        use_ocr = True

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    if only:
        pdfs = [p for p in pdfs if only in p.name]

    manifest_entries = []
    for pdf in pdfs:
        print(f"Extracting {pdf.name} …", flush=True)
        data = extract_pdf(pdf, use_ocr=use_ocr, force_ocr=force_ocr)
        out_path = OUT_DIR / f"{data['slug']}.json"
        if out_path.exists() and not use_ocr and not force_ocr:
            try:
                prev = json.loads(out_path.read_text(encoding="utf-8"))
                if prev.get("totalChars", 0) > data["totalChars"]:
                    print(
                        f"  → giữ bản cũ ({prev['totalChars']} chars, có thể đã OCR)",
                        flush=True,
                    )
                    data = prev
            except json.JSONDecodeError:
                pass
        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=0), encoding="utf-8")
        manifest_entries.append(
            {
                "file": data["file"],
                "slug": data["slug"],
                "path": str(out_path.relative_to(ROOT)),
                "pageCount": data["pageCount"],
                "pagesWithText": data["pagesWithText"],
                "ocrPages": data["ocrPages"],
                "totalChars": data["totalChars"],
                "extractQuality": data["extractQuality"],
            }
        )
        print(
            f"  → {data['totalChars']} chars, {data['pagesWithText']}/{data['pageCount']} pages, quality={data['extractQuality']}",
            flush=True,
        )

    payload = {
        "generated": date.today().isoformat(),
        "ocrEnabled": use_ocr,
        "books": manifest_entries,
    }
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nManifest: {MANIFEST.relative_to(ROOT)} ({len(manifest_entries)} books)")


if __name__ == "__main__":
    main()
