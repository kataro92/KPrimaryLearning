# Trích xuất nội dung SGK (`pdfs/`)

## Lệnh

| Lệnh | Mô tả |
|------|--------|
| `npm run extract:sgk-index` | Mục lục → `scripts/data/sgk-index.json` |
| `npm run extract:sgk-content` | Toàn bộ trang (pypdf) → `scripts/data/sgk-content/*.json` |
| `npm run extract:sgk-content:ocr` | Thêm OCR (tesseract) cho trang ít chữ |
| `npm run tag:math-sgkref` | Gắn `sgkRef` toán HK1 vào bank |

Manifest: `scripts/data/sgk-content-manifest.json` (commit). File JSON từng sách **gitignore** (lớn).

## Chất lượng (2026-05-24)

| PDF | Ký tự | Ghi chú |
|-----|-------|---------|
| TV CTST T1/T2 | ~150k+ | `npm run extract:sgk-content:ocr-tv` (force OCR); Bút Sen trích bài Nghe–viết từ JSON |
| Toán KNTT T1, CTST T2 | ~45–70k | pypdf ổn |
| Toán Cánh Diều T1/T2 | ~70–87k | Cần `--ocr` |
| Sử–Địa KNTT/CTST | ~138–151k | pypdf tốt |
| Đạo đức CTST | ~56k | pypdf tốt → game **Đạo Đức Nhí** |
| Công nghệ CTST / Cánh Diều | ~43–53k | OCR cho bản Cánh Diều |
| Family & Friends 4 | ~55k | pypdf (có watermark) |

## Dùng cho game

1. **Bút Sen** — chỉ câu **nguyên văn** đã đối chiếu SGK; không parse tự động từ JSON TV khi font lỗi.
2. **Toán** — `sgkRef: toan-hk1-bai-XX` (script tag theo từ khóa).
3. **Trống Đồng** — `sgkRef` trên passage chính; supplement cần rà soát nguồn.
4. **Đạo Đức Nhí** — tình huống theo Bài 1–12 CTST.

## OCR từng file

```bash
npm run extract:sgk-content:ocr -- --pdf=Toan-4-T1
npm run extract:sgk-content:ocr -- --pdf=SGK\ Mĩ\ thuật
```
