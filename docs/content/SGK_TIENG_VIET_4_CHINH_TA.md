# Nguồn câu — Bút Sen Việt (chính tả lớp 4)

Ngân hàng **chỉ** dùng đoạn văn, thơ, bài tập chính tả có trong SGK lớp 4 (**KNTT**, **CTST**, hoặc bài chính tả chung chương trình TT22/27 — cùng đề cương). Không tự ghép câu luyện âm.

## KNTT — Tiếng Việt 4

| Mã nguồn | Bài | Dùng cho |
|----------|-----|----------|
| `kntt-bai-01` | Điều kì diệu (Huỳnh Mai Liên) | Đọc + chính tả (s/x, ch/tr, d/gi) |
| `kntt-vbt-12` | Người đào núi (VBT Chính tả, tr/ch) | Danh hiệu 2 |
| `kntt-chau-ba` | Cháu nghe câu chuyện của bà (thơ) | Danh hiệu 2 |
| `kntt-trai-ngoc` | Trai ngọc và hải quỳ (đọc HK1) | Danh hiệu 3 |

## Chính tả lớp 4 (bài nghe–viết / nhớ–viết thường gặp trong CTST & đề luyện lớp 4)

| Mã nguồn | Bài | Tác giả / ghi chú |
|----------|-----|------------------|
| `ct-chiec-ao` | Chiếc áo búp bê (nghe–viết, phân biệt s/x) | Nguyễn Thanh Bình |
| `ct-cho-tet` | Chợ Tết (nhớ–viết, s/x) | Nguyễn Đình Thi, SGK TV4 T2 ~tr.44 |
| `ct-xe-khong-kinh` | Bài thơ về tiểu đội xe không kính (nhớ–viết, s/x) | Phạm Huy Thông |
| `ct-keo-co` | Kéo co (nghe–viết, r/d/gi) | Bài chính tả lớp 4 |
| `ct-ngoi-truong-sinh-ton` | Ngôi trường nơi đầu ngọn sóng (Nghe–viết) | CTST T1 ~tr.77 (OCR) |
| `ct-nha-trang` | Nha Trang (Nghe–viết) | CTST T2 ~tr.75 (OCR) |
| `ct-xuan-bach-long-vi` | Xuân trên đảo Bạch Long Vĩ (Nghe–viết) | CTST T1 ~tr.146 (OCR) |
| `ct-len-nuong` | Lên nương (đọc + luyện chính tả) | CTST T1 ~tr.25 (OCR) |
| `ct-mua-thu` | Mùa thu (Huỳnh Thị Thu Hương) | CTST T1 ~tr.39 (OCR) |
| `ct-gieo-ngay-moi` | Gieo ngày mới (Ngọc Hà) | CTST T1 ~tr.20 (OCR) |
| `ct-ca-dao-tinh-yeu` | Ca dao về tình yêu thương | CTST T1 ~tr.47 (OCR) |
| `ct-dat-lanh-chim-dau` | Đất lành chim đậu (Sơn Nam) | CTST T2 Nghe–viết ~tr.135 (OCR) |

## OCR Tiếng Việt

```bash
npm run extract:sgk-content:ocr-tv   # --force-ocr, phát hiện font lỗi
python3 scripts/extract-chinh-ta-seeds.py
```

Nguồn văn bản: `scripts/data/sgk-content/tieng-viet-lop-4-tap-*.json` (local, gitignore).

## Quy ước game

- `before` + `answer` + `after` = **nguyên văn** câu/ dòng trong văn bản gốc (dấu câu giữ nguyên).
- `distractors` chỉ phục vụ Telex, không xuất hiện trong câu gốc.
- File bank: `src/games/but-sen-viet/banks/level{1,2,3}Bank.ts`.
- `*Supplement.ts` **không** dùng trong game cho đến khi có trích SGK tương ứng.

## Liên kết

- `docs/content/EXAM_SOURCES_GRADE4.md` — đề tham khảo S03, S09, S20 (Tiếng Việt).
