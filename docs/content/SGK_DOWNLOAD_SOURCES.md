# Nguồn tải SGK lớp 4

## Thư viện chính (đề xuất)

**Trường Tiểu học Nguyễn Văn Trỗi — Thư viện số**

- Trang lọc: [Sách giáo khoa — Lớp 4](https://nguyenvantroipm.edu.vn/thu-vien/?theloai=sach-giao-khoa&lop_hoc=L%E1%BB%9Bp+4)
- Lọc theo môn (vd. Toán): [Thư viện — Toán lớp 4](https://nguyenvantroipm.edu.vn/thu-vien/?theloai=sach-giao-khoa&mon_hoc=To%C3%A1n&lop_hoc=L%E1%BB%9Bp+4&nha_xuat_ban=&chu_bien=)

Mỗi sách có trang chi tiết `/sach/{slug}/` với nút **TẢI VỀ** → PDF dạng:

`https://nguyenvantroipm.edu.vn/wp-content/uploads/.../*.pdf?action=tai_ve`

Một số trang ghi cần đăng nhập để mượn; link `?action=tai_ve` thường vẫn tải được khi truy cập trực tiếp (kiểm tra lại khi NXB/trường đổi chính sách).

### Sách lớp 4 đã lập chỉ mục (máy đọc)

Xem `scripts/data/sgk-library-nguyenvantroi.json`. Tải hàng loạt:

```bash
npm run fetch:sgk
# hoặc một cuốn:
node scripts/fetch-sgk-pdfs.mjs --id tv-ctst-t1
```

File lưu vào `pdfs/` (đã `.gitignore`).

## KNTT và CTST — cùng đề cương

Hai bộ sách (**Kết nối tri thức** — NXBGD, **Chân trời sáng tạo** / **Cánh diều** — ĐHSP) chỉ khác cách diễn đạt và bố cục bài; **cùng Chương trình GDPT 2018 / Thông tư 22–27 lớp 4**.

Trong repo:

- Dùng **cả hai** làm nguồn trích đoạn.
- `sgkRef` gắn theo **chủ đề / bài / kỹ năng** (vd. `tv-hk1-chinh-ta-26`, `toan-hk1-bai-12`), không gắn cứng một NXB.
- Trường `series` tùy chọn: `kntt` | `ctst` | `cd` (Cánh diều trên thư viện trường).

## Nguồn bổ sung

| Nguồn | Khi nào dùng |
|--------|----------------|
| [Hành trang số NXBGD](http://hanhtrangso.nxbgd.vn) | Bản PDF/text chính thống KNTT (mã tem sách) |
| `pdfs/` cục bộ | Bản đã tải — dùng cho `scripts/extract-sgk-index.mjs` (kế hoạch) |
| `docs/content/EXAM_SOURCES_GRADE4.md` | Ma trận dạng đề / chủ đề — **không** thay SGK |

## Bản quyền

PDF thuộc NXBGD / ĐHSP. Chỉ lưu cục bộ phục vụ soạn nội dung game; không phát hành lại nguyên sách. Trong game chỉ trích **đoạn ngắn** đúng mục tiêu học tập.
