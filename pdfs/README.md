# SGK lớp 4 — kho PDF cục bộ

Thư mục này chứa sách giáo khoa PDF phục vụ soạn nội dung game. **Không commit file PDF lên Git** (dung lượng lớn + bản quyền NXBGD) — chỉ giữ README và index trong `docs/`.

## Danh sách file (2026-05-24)

### Tải từ thư viện PM (`npm run fetch:sgk`)

| File | Bộ | Môn |
|------|-----|-----|
| `Toan-4-T1-Canh-Dieu.pdf` | CTST (Cánh diều) | Toán HK1 |
| `Toan-4-T2-Canh-Dieu.pdf` | CTST (Cánh diều) | Toán HK2 |
| `tieng-viet-lop-4-tap-1-chan-troi-sang-tao.pdf` | CTST | Tiếng Việt HK1 |
| `tieng-viet-lop-4-tap-2-chan-troi-sang-tao-pdf.pdf` | CTST | Tiếng Việt HK2 |
| `Cong-nghe-4-Canh-dieu.pdf` | CTST (Cánh diều) | Công nghệ |
| `Tin-hoc-4-Canh-dieu.pdf` | CTST (Cánh diều) | Tin học |

### Có sẵn local (thêm tay / bản cũ)

| File | Bộ | Môn |
|------|-----|-----|
| `SGK Toán 4 KNTT tập 1.pdf` | KNTT | Toán HK1 |
| `SGK Toán 4 CTST tập 2.pdf` | CTST | Toán HK2 (trùng nội dung với `Toan-4-T2-Canh-Dieu.pdf`) |
| `SGK Lịch sử và Địa lí 4 KNTT.pdf` | KNTT | Sử–Địa |
| `SGK Lich su va Dia li 4 - CTST.pdf` | CTST | Sử–Địa |
| `2 Family and Friends 4.pdf` | — | Tiếng Anh |
| `SGK Dao duc 4 - CTST.pdf` | CTST | Đạo đức |
| `SGK Cong nghe 4 - CTST.pdf` | CTST | Công nghệ (bản cũ; có thêm `Cong-nghe-4-Canh-dieu.pdf`) |
| `SGK Am nhac 4 - CTST.pdf` | CTST | Âm nhạc |
| `SGK Mĩ thuật 4 CTST BẢN 1.pdf` | CTST | Mĩ thuật |
| `SGK My thuat 4 - CTST BẢN 2.pdf` | CTST | Mĩ thuật |

## Thiếu (nên thêm nếu trường học KNTT)

- Toán 4 KNTT tập 2  
- Tiếng Việt 4 KNTT tập 1 & 2  
- Khoa học 4 KNTT tập 1 & 2  

## Tải thêm từ thư viện trường

```bash
npm run fetch:sgk              # tất cả sách trong catalog
npm run fetch:sgk -- --id tv-ctst-t1
```

Nguồn: [TH Nguyễn Văn Trỗi — Thư viện lớp 4](https://nguyenvantroipm.edu.vn/thu-vien/?theloai=sach-giao-khoa&lop_hoc=L%E1%BB%9Bp+4).  
KNTT và CTST **cùng đề cương** — dùng cả hai. Chi tiết: [`docs/content/SGK_DOWNLOAD_SOURCES.md`](../docs/content/SGK_DOWNLOAD_SOURCES.md).

## Mục lục & nội dung đầy đủ

```bash
npm run extract:sgk-index      # mục lục
npm run extract:sgk-content    # toàn bộ trang (pypdf)
npm run extract:sgk-content:ocr -- --pdf=Ten-file   # OCR nếu scan
```

→ [`docs/content/SGK_CONTENT_EXTRACTION.md`](../docs/content/SGK_CONTENT_EXTRACTION.md), `scripts/data/sgk-content-manifest.json`.

## Kế hoạch sử dụng

Xem [`docs/planning/SGK_CURRICULUM_INTEGRATION_PLAN.md`](../docs/planning/SGK_CURRICULUM_INTEGRATION_PLAN.md).

## Lưu ý kỹ thuật

Nhiều file là bản scan có watermark → cần OCR hoặc bản PDF từ [Hành trang số](http://hanhtrangso.nxbgd.vn) để trích chữ tự động.
