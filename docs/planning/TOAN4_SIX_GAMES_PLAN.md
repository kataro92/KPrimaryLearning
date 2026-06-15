# Kế hoạch 6 game Toán 4 — theo phân loại Cánh Diều

**Ngày:** 2026-06-15  
**Nguồn nội dung:** `docs/content/TOAN-4-CANH-DIEU-SESSIONS.md` (55 bài học cốt lõi, 6 chủ đề)  
**Stack:** vanilla TypeScript + Vite + Three.js (hero nhẹ) + pattern `play.ts` / bank / `catalog.ts` / `registry.ts`

## 1. Ánh xạ phân loại → game

| # | Phân loại SGK | Game | `gameId` | Trạng thái |
|---|---------------|------|----------|------------|
| 1 | Các số trong phạm vi 1 000 000 | **Tháp Triệu Số** | `thap-trieu-so` | Phase 1 — scaffold + bank L1 |
| 2 | Các phép tính với số tự nhiên | **Thương Nhân Sông Hồng** | `thuong-nhan-song-hong` | Phase 1 — scaffold + bank L1 |
| 3 | Phân số | **Chia Bánh Trăng Rằm** | `chia-banh-trang-ram` | Phase 2 — playable |
| 4 | Hình học và đo lường | **Đo Đất Cổ Thành** | `do-dat-co-thanh` | Phase 2 — playable |
| 5 | Các phép tính với phân số | **Bếp Bác Học Trò** | `bep-bac-hoc-tro` | Phase 3 — playable |
| 6 | Thống kê và xác suất | **Chợ Số Liệu** | `cho-so-lieu` | Phase 3 — playable |

## 2. Nguyên tắc thiết kế

- **Không trùng** game Toán hiện có: Trạng Nguyên (MCQ tổng hợp), Trạng Tí (nhẩm), Thăng Long (nhận dạng hình), Cửu Chương (bảng nhân/chia).
- Mỗi câu có `sgkRef` theo chủ đề/bài (vd. `toan-so-trieu-lam-tron`), không copy nguyên đề SGK.
- 3 cấp danh hiệu: nhận biết → vận dụng → tổng hợp.
- Feedback ngay (đúng/sai/hết giờ), TTS đọc câu hỏi, timer theo cấp.
- `dispose()` dọn listener, timer, RAF, scene hero.

## 3. Chi tiết từng game

### 3.1. Tháp Triệu Số (`thap-trieu-so`)

**Mục tiêu:** đọc/viết/so sánh/làm tròn số lớn, đổi đơn vị, rút về đơn vị, góc cơ bản (16 bài SGK).

**Cơ chế:** MCQ bia đá; hero = tháp CSS — mỗi câu đúng thêm một tầng.

**Bank `sgkRef` gợi ý:**

| `sgkRef` | Chủ đề |
|----------|--------|
| `toan-so-trieu-doc-viet` | Đọc/viết số 6 chữ số |
| `toan-so-trieu-so-sanh` | So sánh, xếp thứ tự |
| `toan-so-trieu-lam-tron` | Làm tròn hàng trăm nghìn |
| `toan-doi-yen-ta-tan` | Yến, tạ, tấn |
| `toan-thoi-gian-giay` | Giây, phút |
| `toan-the-ky` | Thế kỷ |
| `toan-rut-ve-don-vi` | Rút về đơn vị |
| `toan-goc-co-ban` | Góc nhọn/tù/bẹt, độ |

### 3.2. Thương Nhân Sông Hồng (`thuong-nhan-song-hong`)

**Mục tiêu:** cộng/trừ/nhân/chia số lớn, tính chất, trung bình, tổng–hiệu, ước lượng, biểu thức chữ (15 bài SGK).

**Cơ chế:** MCQ chợ nổi; hero = gian hàng đầy dần khi bán đúng.

**Bank `sgkRef` gợi ý:**

| `sgkRef` | Chủ đề |
|----------|--------|
| `toan-stn-cong-tru` | Cộng, trừ số lớn |
| `toan-stn-tinh-chat-cong` | Tính chất cộng |
| `toan-stn-trung-binh` | Trung bình cộng |
| `toan-stn-tong-hieu` | Tổng và hiệu |
| `toan-stn-nhan` | Nhân 1–2 chữ số |
| `toan-stn-tinh-chat-nhan` | Tính chất nhân |
| `toan-stn-chia` | Chia số lớn |
| `toan-stn-uoc-luong` | Ước lượng |
| `toan-stn-bieu-thuc-chu` | Biểu thức có chữ |

### 3.3–3.6. Phase 2–3 (tóm tắt)

- **Chia Bánh Trăng Rằm:** Canvas tô phần + ghép thẻ phân số; phụ thuộc hiểu phân số trước phép tính.
- **Đo Đất Cổ Thành:** diện tích m²/dm²/mm², hình bình hành/thoi; bổ sung Thăng Long.
- **Bếp Bác Học Trò:** cộng/trừ/nhân/chia phân số; picker tử/mẫu ở cấp cao.
- **Chợ Số Liệu:** biểu đồ cột SVG + mô phỏng đếm sự kiện.

## 4. Lộ trình triển khai

| Phase | Việc | Deliverable | Trạng thái |
|-------|------|-------------|------------|
| **1** | Tháp Triệu Số + Thương Nhân | bank ~58 câu/game, playable | ✅ |
| **2** | Chia Bánh + Đo Đất | bank + hero CSS | ✅ |
| **3** | Bếp Bác + Chợ Số Liệu | phân số tính toán; biểu đồ | ✅ |
| **4** | Mở rộng bank, visual, SGK index | hình tô phần; bank ~45+; `SGK_MASTER_INDEX` | ✅ (2026-06-15) |

### Checklist mỗi game

- [ ] `src/games/<id>/questions.ts` + bank
- [ ] `src/games/<id>/play.ts`
- [ ] `catalog.ts` + `registry.ts` + `PLAYABLE_GAME_IDS`
- [ ] CSS module (`game-play--<id>`)
- [ ] `npm run build` pass
- [ ] Playtest: đúng / sai / timeout / hoàn thành

## 5. Phân công với game Toán hiện có

| Game mới | Game cũ | Ghi chú |
|----------|---------|---------|
| Tháp Triệu Số | Trạng Nguyên | Số lớn, làm tròn, đơn vị → Tháp; MCQ tổng hợp giữ ở Trạng Nguyên |
| Thương Nhân | Trạng Tí | Bài toán lời, tính chất → Thương Nhân; nhẩm nhanh → Trạng Tí |
| Đo Đất | Thăng Long | Thăng Long = nhận dạng; Đo Đất = diện tích & đổi đơn vị |

## 6. Rủi ro

| Rủi ro | Giảm thiểu |
|--------|------------|
| Quá nhiều nội dung | Bank L1 trước (~40 câu/game), L2–L3 sau |
| Trùng Trạng Nguyên | Lọc bank theo `sgkRef` chủ đề; không trộn câu số lớn vào `mcqBank` chung |
| Nhập phân số khó trên mobile | Phase 3: MCQ/ghép thẻ trước; nhập sau |
