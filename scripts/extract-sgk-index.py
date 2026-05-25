#!/usr/bin/env python3
"""Trích mục lục SGK từ pdfs/ + curated → scripts/data/sgk-index.json và docs/content/SGK_MASTER_INDEX.md"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, asdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "pdfs"
DATA_DIR = Path(__file__).resolve().parent / "data"
OUT_JSON = DATA_DIR / "sgk-index.json"
OUT_MD = ROOT / "docs/content/SGK_MASTER_INDEX.md"

GAME_BY_SUBJECT = {
    "toan": ["trang-nguyen-toan", "tinh-nham-trang-ti", "cuu-chuong-van-mieu", "hinh-hoc-thang-long"],
    "tieng-viet": ["but-sen-viet", "doc-hieu-su-viet"],
    "lich-su-dia-li": ["hanh-trinh-su-dia", "doc-hieu-su-viet"],
    "khoa-hoc": ["trong-dong", "tham-hiem-cuu-long"],
    "tieng-anh": ["tu-vung-hoi-an"],
    "dao-duc": ["dao-duc-nhi"],
    "cong-nghe": ["tho-nhi-cong-nghe"],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
}

SUBJECT_FROM_FILE = [
    (r"toan|Toán", "toan"),
    (r"tieng-viet|Tiếng Việt", "tieng-viet"),
    (r"lich-su|Lich su|Lịch sử", "lich-su-dia-li"),
    (r"Dao duc|Đạo đức", "dao-duc"),
    (r"Cong nghe|Công nghệ|cong-nghe", "cong-nghe"),
    (r"Am nhac|Âm nhạc", "am-nhac"),
    (r"thuat|Mĩ thuật|My thuat", "my-thuat"),
    (r"Family and Friends|Tiếng Anh", "tieng-anh"),
    (r"Tin-hoc|Tin học", "tin-hoc"),
    (r"Khoa học|khoa-hoc", "khoa-hoc"),
]

SERIES_FROM_FILE = [
    (r"kntt|KNTT|Kết nối", "kntt"),
    (r"chan-troi|CTST|Chân trời|Canh-Dieu|Cánh diều|canh-dieu", "ctst"),
]


@dataclass
class Entry:
    sgkRef: str
    subject: str
    series: str
    type: str
    number: str
    title: str
    theme: str | None
    page: int | None
    pdfFile: str
    source: str
    extractQuality: str
    games: list[str]


def guess_meta(filename: str) -> tuple[str, str]:
    subject = "unknown"
    series = "unknown"
    for pat, sub in SUBJECT_FROM_FILE:
        if re.search(pat, filename, re.I):
            subject = sub
            break
    for pat, ser in SERIES_FROM_FILE:
        if re.search(pat, filename, re.I):
            series = ser
            break
    if "Canh-Dieu" in filename or "canh-dieu" in filename:
        series = "ctst"
    return subject, series


def extract_pdf_toc(pdf_path: Path, toc_pages: int = 35) -> list[Entry]:
    from pypdf import PdfReader

    subject, series = guess_meta(pdf_path.name)
    reader = PdfReader(str(pdf_path))
    entries: list[Entry] = []
    seen: set[str] = set()

    patterns = [
        ("bai", re.compile(r"^Bài\s*(\d+)\s*[\.:\-–]\s*(.{3,100}?)(?:\s*\.{2,}|\s*$)", re.I)),
        ("chu-de", re.compile(r"^(CHỦ ĐỀ|Chủ đề)\s*(\d+)\s*[\.:\-–]?\s*(.{3,80})", re.I)),
        ("phan", re.compile(r"^(PHẦN|Phần)\s*(\d+)\s*[\.:\-–]?\s*(.{3,80})", re.I)),
    ]

    for i in range(min(toc_pages, len(reader.pages))):
        text = reader.pages[i].extract_text() or ""
        for line in text.splitlines():
            line = re.sub(r"\s+", " ", line.strip())
            if len(line) < 6 or len(line) > 150:
                continue
            for typ, pat in patterns:
                m = pat.match(line)
                if not m:
                    continue
                if typ == "bai":
                    num, title = m.group(1), m.group(2).strip(" .(")
                    sgk_ref = f"{subject}-bai-{num.zfill(2)}"
                else:
                    num, title = m.group(2), m.group(3).strip(" .(")
                    sgk_ref = f"{subject}-{typ}-{num}"
                if sgk_ref in seen:
                    continue
                seen.add(sgk_ref)
                entries.append(
                    Entry(
                        sgkRef=sgk_ref,
                        subject=subject,
                        series=series,
                        type=typ,
                        number=num,
                        title=title[:120],
                        theme=None,
                        page=i + 1,
                        pdfFile=pdf_path.name,
                        source="pdf-toc",
                        extractQuality="text",
                        games=GAME_BY_SUBJECT.get(subject, []),
                    )
                )
                break

    quality = "text" if entries else "scan-or-font"
    if not entries:
        return []
    for e in entries:
        if e.extractQuality == "text":
            continue
    return entries


def load_curated_tv_t1() -> list[Entry]:
    path = DATA_DIR / "sgk-curated-tv-ctst-t1.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    out: list[Entry] = []
    for theme in data["themes"]:
        for les in theme["lessons"]:
            num = str(les["num"])
            sgk_ref = f"tv-hk1-bai-{num.zfill(2)}"
            out.append(
                Entry(
                    sgkRef=sgk_ref,
                    subject="tieng-viet",
                    series=data["series"],
                    type="bai",
                    number=num,
                    title=les["title"],
                    theme=theme["title"],
                    page=les.get("page"),
                    pdfFile=data["pdfFile"],
                    source=data["sourceUrl"],
                    extractQuality="curated-toc",
                    games=GAME_BY_SUBJECT["tieng-viet"],
                )
            )
    return out


def load_curated_toan_cd_t1() -> list[Entry]:
    titles = {
        1: "Ôn tập các số đến 100 000",
        2: "Ôn tập phép cộng, phép trừ",
        3: "Ôn tập phép nhân, phép chia",
        4: "Số chẵn, số lẻ",
        5: "Em làm được những gì?",
        6: "Bài toán liên quan đến rút về đơn vị",
        7: "Bài toán liên quan đến rút về đơn vị (tiếp theo)",
        8: "Bài toán bằng ba bước tính",
        9: "Ôn tập biểu thức số",
        10: "Biểu thức có chứa chữ",
        11: "Biểu thức có chứa chữ (tiếp theo)",
        12: "Biểu thức có chứa chữ (tiếp theo)",
        13: "Tính chất giao hoán, tính chất kết hợp của phép cộng",
        14: "Tính chất giao hoán, tính chất kết hợp của phép nhân",
        15: "Em làm được những gì?",
        16: "Dãy số liệu",
        17: "Biểu đồ cột",
        18: "Số lần lặp lại của một sự kiện",
        19: "Tìm số trung bình cộng",
        20: "Đề-xi-mét vuông",
        21: "Mét vuông",
        22: "Em làm được những gì?",
        23: "Các số có sáu chữ số - Hàng và lớp",
        24: "Triệu - lớp triệu",
        25: "Đọc, viết các số tự nhiên trong hệ thập phân",
        26: "So sánh và xếp thứ tự các số tự nhiên",
        27: "Dãy số tự nhiên",
        28: "Em làm được những gì?",
        29: "Đo góc - Góc nhọn, góc tù, góc bẹt",
        30: "Hai đường thẳng vuông góc",
        31: "Hai đường thẳng song song",
        32: "Em làm được những gì?",
        33: "Giây",
        34: "Thế kỉ",
        35: "Yến, tạ, tấn",
        36: "Em làm được những gì?",
        37: "Em làm được những gì?",
        38: "Ôn tập học kì 1",
    }
    source = "https://kenhgiaovien.com/tai-lieu/giao-ki-1-toan-4-chan-troi-sang-tao"
    out: list[Entry] = []
    for num, title in titles.items():
        out.append(
            Entry(
                sgkRef=f"toan-hk1-bai-{num:02d}",
                subject="toan",
                series="ctst",
                type="bai",
                number=str(num),
                title=title,
                theme="Ôn tập và bổ sung" if num <= 22 else "Số tự nhiên / Hình học / Đo lường",
                page=None,
                pdfFile="Toan-4-T1-Canh-Dieu.pdf",
                source=source,
                extractQuality="curated-toc",
                games=GAME_BY_SUBJECT["toan"],
            )
        )
    return out


def merge_entries(all_lists: list[list[Entry]]) -> list[Entry]:
    by_ref: dict[str, Entry] = {}
    priority = {"curated-toc": 3, "text": 2, "scan-or-font": 1}
    for entries in all_lists:
        for e in entries:
            prev = by_ref.get(e.sgkRef)
            if not prev or priority.get(e.extractQuality, 0) >= priority.get(prev.extractQuality, 0):
                by_ref[e.sgkRef] = e
    return sorted(by_ref.values(), key=lambda x: (x.subject, x.type, x.number))


def write_markdown(entries: list[Entry], pdf_stats: dict) -> None:
    by_subject: dict[str, list[Entry]] = {}
    for e in entries:
        by_subject.setdefault(e.subject, []).append(e)

    lines = [
        "# Ma trận mục lục SGK lớp 4",
        "",
        f"Cập nhật: {date.today().isoformat()} — sinh bởi `npm run extract:sgk-index`.",
        "",
        "KNTT và CTST **cùng đề cương** (TT22/27); `sgkRef` theo chủ đề/bài, không theo NXB.",
        "",
        "## Tóm tắt trích xuất PDF",
        "",
        "| PDF | Trang | Mục trích được | Chất lượng |",
        "|-----|-------|----------------|------------|",
    ]
    for name, st in sorted(pdf_stats.items()):
        lines.append(f"| `{name}` | {st['pages']} | {st['entries']} | {st['quality']} |")

    lines.extend(
        [
            "",
            "## Game gợi ý theo môn",
            "",
            "| Môn | Game |",
            "|-----|------|",
        ]
    )
    for sub, games in sorted(GAME_BY_SUBJECT.items()):
        if games:
            lines.append(f"| {sub} | {', '.join(f'`{g}`' for g in games)} |")

    for sub, sub_entries in sorted(by_subject.items()):
        lines.extend(["", f"## {sub}", ""])
        cur = [e for e in sub_entries if e.extractQuality == "curated-toc"]
        pdf = [e for e in sub_entries if e.extractQuality == "text"]
        if cur:
            lines.append("### Mục lục curated (PDF scan / font lỗi)")
            lines.append("")
            lines.append("| sgkRef | Bài | Tiêu đề | PDF |")
            lines.append("|--------|-----|---------|-----|")
            for e in cur[:80]:
                lines.append(
                    f"| `{e.sgkRef}` | {e.number} | {e.title} | `{e.pdfFile}` |"
                )
            if len(cur) > 80:
                lines.append(f"| … | | *({len(cur) - 80} mục nữa trong JSON)* | |")
        if pdf:
            lines.append("")
            lines.append("### Trích trực tiếp từ PDF")
            lines.append("")
            for e in pdf[:40]:
                lines.append(f"- **{e.title or e.type + ' ' + e.number}** (`{e.sgkRef}`, p.{e.page}, `{e.pdfFile}`)")

    lines.extend(
        [
            "",
            "## Việc tiếp theo",
            "",
            "1. Bút Sen: trích **Chính tả** từ TV CTST (mục lục trên) + PDF khi OCR.",
            "2. Toán: gắn `sgkRef` vào `mcqBank` / `mathBank` theo `toan-hk1-bai-XX`.",
            "3. Sử–Địa: đối chiếu `suDiaCoverage` với mục `lich-su-dia-li` trong JSON.",
            "4. Tải thêm PDF: `npm run fetch:sgk` — Khoa học KNTT khi có trên thư viện.",
            "",
            "JSON đầy đủ: `scripts/data/sgk-index.json`.",
            "",
        ]
    )
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    all_lists: list[list[Entry]] = []
    pdf_stats: dict = {}

    all_lists.append(load_curated_tv_t1())
    all_lists.append(load_curated_toan_cd_t1())

    for pdf in sorted(PDF_DIR.glob("*.pdf")):
        extracted = extract_pdf_toc(pdf)
        quality = "text" if extracted else "scan-or-font"
        pdf_stats[pdf.name] = {
            "pages": len(__import__("pypdf").PdfReader(str(pdf)).pages),
            "entries": len(extracted),
            "quality": quality,
        }
        if extracted:
            all_lists.append(extracted)

    merged = merge_entries(all_lists)

    payload = {
        "generated": date.today().isoformat(),
        "curriculumNote": "KNTT và CTST cùng đề cương TT22/27 lớp 4",
        "downloadSource": "https://nguyenvantroipm.edu.vn/thu-vien/?theloai=sach-giao-khoa&lop_hoc=L%E1%BB%9Bp+4",
        "entryCount": len(merged),
        "entries": [asdict(e) for e in merged],
        "pdfStats": pdf_stats,
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(merged, pdf_stats)

    print(f"Wrote {len(merged)} entries → {OUT_JSON.relative_to(ROOT)}")
    print(f"Wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
