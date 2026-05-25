# Kế hoạch: Bút Sen Việt + Hành Trình Sử Địa

Trạng thái: **đã chốt quyết định** (2026-05-24)

## Quyết định đã chốt

| # | Nội dung | Quyết định |
|---|----------|------------|
| 1 | Game chính tả | `but-sen-viet` — **Bút Sen Việt**, DOM + Telex; hero **bút 3D** (Sketchfab CC BY `pen.glb`, fallback procedural) |
| 2 | Game Sử–Địa | **Kéo-thả vùng trên bản đồ**; bản đồ phải **chính xác** theo chuẩn SGK/Bản đồ hành chính VN |
| 3 | Đọc Hiểu Sử Việt | Giữ **sử**; nội dung **địa lí** chuyển sang game Sử–Địa mới |

---

## Game 1: Bút Sen Việt (`but-sen-viet`)

### Phạm vi
- Chính tả: s/x (cấp 1), ch/tr (cấp 2), d/gi/r/đ (cấp 3).
- Câu điền từ; TTS đọc `before … after` (không đọc đáp án).
- UI: câu trên, hàng nhập 7:3 (Telex + ký tự xáo trộn).
- Ngân hàng: `banks/level{1,2,3}Bank.ts` (ưu tiên bank chính; supplement chỉ bật sau QA).

### File
- `src/games/but-sen-viet/`
- Đăng ký: `catalog`, `registry`, `gameSprites`, `bgmService`, `interactiveText`
- Theme: `src/styles/game-but-sen.css`

### Ước lượng: 3–4 ngày (đã scaffold bank từ Nét Chữ)

---

## Game 2: Hành Trình Sử Địa (`hanh-trinh-su-dia`)

### Phạm vi học tập
- **Sử:** mốc, nhân vật, sự kiện lớp 4 (tách khỏi game Sử Việt — sâu đoạn văn + Đúng/Sai).
- **Địa:** vùng miền, sông, núi, khí hậu, đặc sản, thủ đô/tỉnh (chuyển từ Sử Việt + ma trận S48, S50).

### Cơ chế
- Mỗi câu: thẻ gợi ý (tên địa danh / sự kiện / đặc trưng) + **kéo thả thẻ vào vùng** trên bản đồ.
- Vùng drop: 3 miền Bắc–Trung–Nam + **vùng biển đảo** (xem bản đồ bên dưới).
- Level 1: 3 vùng lớn; level 2–3: thêm ô đảo / tỉnh trọng điểm.

### Bản đồ Việt Nam — yêu cầu bắt buộc (chủ đề nhạy cảm)

**Nguồn tham chiếu (đã có file SGK):**
1. **SGK *Lịch sử và Địa lí 4 KNTT*** — *Hình 1. Bản đồ hành chính Việt Nam* (PDF trang **16**).
2. Ảnh QA: `public/maps/sgk-kntt-grade4/page-16-admin-map-reference.png`
3. Ma trận chủ đề: `docs/content/SGK_LICH_SU_DIA_LI_4_KNTT.md`
4. SVG prototype vùng drop: `public/maps/vietnam-admin-kntt.svg` (hiệu chỉnh tọa độ khi trace; **thay ảnh nền bằng path vector** trước release).

**Phải hiển thị đầy đủ lãnh thổ Việt Nam (không được thiếu):**
| Vùng | Ghi chú |
|------|---------|
| Lục địa | Đủ đường biên giới phía Bắc, Tây, Nam (hình chữ S) |
| **quần đảo Hoàng Sa** (TP Đà Nẵng – VN) | Nhãn đúng SGK Hình 1 |
| **quần đảo Trường Sa** (tỉnh Khánh Hòa – VN) | Nhãn đúng SGK Hình 1 |
| **Đảo Phú Quốc** | Vịnh Thái Lan, không tách khỏi VN |
| Đảo Cồn Cỏ, Lý Sơn, Phú Quý, Côn Sơn, QĐ. Thổ Chu, Bạch Long Vĩ | Có trên SGK — cấp 2+ |

**Quy ước hiển thị (đề xuất):**
- Bản đồ chính: lục địa + ô inset biển Đông (chuẩn sách giáo khoa VN).
- Hoàng Sa, Trường Sa, Phú Quốc: **cùng màu lãnh thổ VN**, có đường viền và nhãn chữ rõ.
- Không dùng bản đồ thế giới/Google mặc định (dễ sai biên giới).

**QA bản đồ (checklist trước release):**
- [ ] So sánh pixel/khung với ảnh SGK lớp 4 (in hoặc PDF).
- [ ] Có nhãn «Hoàng Sa», «Trường Sa», «Phú Quốc» (hoặc đúng tên SGK).
- [ ] Không cắt mất quần đảo khi responsive.
- [ ] Review nội dung nội bộ / phụ huynh giáo viên nếu có.

**Kỹ thuật đề xuất:**
- `public/maps/vietnam-grade4.svg` — một file SVG duy nhất, tọa độ cố định.
- Vùng drop: `<path id="drop-hoang-sa">` … gắn `data-region` cho hit-test.
- Không dùng tile map nước ngoài không kiểm soát biên giới.

### Tách nội dung từ Đọc Hiểu Sử Việt
- Rà `historyBank.ts` + supplements: câu **địa danh địa lí thuần** (sông ở tỉnh X sai, khí hậu miền…) → chuyển sang `suDiaBank`.
- Giữ trong Sử Việt: sự kiện, nhân vật, năm, Đúng/Sai về **lịch sử**.

### Ước lượng: 5–7 ngày (bản đồ + QA chiếm ~2 ngày)

---

## Thứ tự triển khai

1. **Bút Sen Việt** — chơi được trên Home (đang làm).
2. **SVG bản đồ VN** — duyệt nguồn + QA trước khi code gameplay.
3. **Hành Trình Sử Địa** — drag-drop + bank.
4. **Migration** câu địa lí từ Sử Việt.
5. Cập nhật `CURRENT_STATE.md`, thumbnail, `EXAM_SOURCES_GRADE4.md`.

---

## Trạng thái Sử–Địa (2026-05-24)

- [x] Gameplay kéo-thả + đăng ký catalog (10 game).
- [x] Ngân hàng ~200 câu, phủ 8 mục SGK (`suDiaCoverage.ts`, `suDiaBankSupplement.ts`).
- [x] Hiệu chỉnh vùng thả trên ảnh SGK (2026-05-24, `mapDropZones.ts` + `vietnam-admin-kntt.svg` 13 vùng).
- [ ] QA checklist bản đồ (Hoàng Sa, Trường Sa, Phú Quốc) — xác nhận trên thiết bị thật trước Pages.
- [x] Chạm vùng thả (thay kéo) + nhãn vùng trên bản đồ (2026-05-24).
- [x] Supplement wave 3 (`suDiaBankSupplement.ts`, tổng ~200 câu).

## Sau khi xong: 10 game trên Home

8 game gốc + Bút Sen Việt + Hành Trình Sử & Địa.
