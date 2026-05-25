# Bản đồ tham chiếu — SGK Lịch sử và Địa lí 4 (KNTT)

## Nguồn

| Mục | Giá trị |
|-----|---------|
| Sách | *Lịch sử và Địa lí lớp 4* — Kết nối tri thức với cuộc sống |
| File gốc | `SGK Lịch sử và Địa lí 4 KNTT.pdf` (người dùng cung cấp) |
| Bản đồ chính | **Hình 1. Bản đồ hành chính Việt Nam** (trang sách in **14**; file PDF trang **16**) |
| File ảnh trong repo | `page-16-admin-map-reference.png` (render 3× từ PDF, chỉ để trace/QA) |

**Lưu ý bản quyền:** Ảnh scan/PDF thuộc NXB Giáo dục Việt Nam. Bản phát hành game phải dùng **SVG tự vector hóa** bám đúng hình học và nhãn SGK, không nhúng nguyên trang sách.

## Nhãn bắt buộc trên bản đồ (theo Hình 1 SGK)

### Quần đảo / đảo (không được thiếu)

| Nhãn trên SGK | Ghi chú game |
|---------------|--------------|
| **quần đảo Hoàng Sa** (thành phố Đà Nẵng – Việt Nam) | Vùng drop `hoang-sa` |
| **quần đảo Trường Sa** (tỉnh Khánh Hòa – Việt Nam) | Vùng drop `truong-sa` |
| **Đảo Phú Quốc** | Vùng drop `phu-quoc` |
| Đảo Cồn Cỏ | `con-co` (cấp 2+) |
| Đảo Lý Sơn | `ly-son` |
| Đảo Phú Quý | `phu-quy` |
| Đảo Côn Sơn | `con-son` |
| QĐ. Thổ Chu | `tho-chu` |
| đảo Bạch Long Vĩ | `bach-long-vi` |

### Chú giải SGK (Hình 1)

- Ngôi sao đỏ: Thủ đô (Hà Nội)
- Vòng tròn đỏ: Thành phố trực thuộc TW (Hải Phòng, Đà Nẵng, TP. Hồ Chí Minh, Cần Thơ)
- Chữ IN HOA: Tên tỉnh
- Viền xám: Địa giới tỉnh
- Gạch chấm: Biên giới quốc gia

### Vùng lục địa (theo chương trình sách)

Sách chia **vùng** (không chỉ 3 miền hành chính):

1. Địa phương em (địa lí + văn hóa địa phương)
2. Trung du và miền núi **Bắc Bộ**
3. Đồng bằng **Bắc Bộ**
4. Duyên hải **miền Trung**
5. Tây Nguyên
6. Đồng bằng sông Cửu Long (**Nam Bộ**)

Game **Hành trình Sử Địa** — vùng drop cấp 1 (level 1): `bac-bo` | `trung-bo` | `nam-bo` (gom theo SGK); cấp 2+: tách đồng bằng Bắc Bộ / Tây Nguyên / ĐBSCL khi câu hỏi yêu cầu.

## Cách làm SVG cho game

1. Mở `page-16-admin-map-reference.png` trong Figma/Inkscape.
2. Trace contour lục địa + ô biển Đông; đặt `id` cho từng vùng drop.
3. Xuất `vietnam-admin-kntt.svg` (không nhúng ảnh scan).
4. QA checklist trong `docs/planning/GAME_BUT_SEN_AND_SU_DIA.md`.

## Liên kết code (dự kiến)

- `src/games/hanh-trinh-su-dia/map/vietnamAdminMap.ts` — load SVG, hit-test vùng
- `src/games/hanh-trinh-su-dia/suDiaBank.ts` — câu hỏi bám chủ đề SGK
