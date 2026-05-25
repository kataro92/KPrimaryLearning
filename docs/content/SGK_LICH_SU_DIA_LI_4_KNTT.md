# Ma trận nội dung — SGK Lịch sử và Địa lí 4 KNTT

Tài liệu trích **chủ đề và bản đồ** từ sách giáo khoa người dùng cung cấp (`SGK Lịch sử và Địa lí 4 KNTT.pdf`) để soạn game **Hành trình Sử Địa** và tách câu khỏi **Đọc Hiểu Sử Việt**.

> Không sao chép nguyên văn đề/bài tập có bản quyền; chỉ dùng **cấu trúc chương**, **tên địa danh**, **dạng bài** phù hợp lớp 4.

## Bản đồ hành chính (Hình 1)

- **Vị trí:** PDF trang 16 → tiêu đề *Hình 1. Bản đồ hành chính Việt Nam*.
- **Ảnh tham chiếu trong repo:** `public/maps/sgk-kntt-grade4/page-16-admin-map-reference.png`
- **Tỷ lệ:** 0 – 400 km (thanh tỷ lệ SGK).
- **Lưới:** kinh tuyến / vĩ tuyến (độ).

### Đảo và quần đảo (nhãn đúng như SGK — game phải khớp)

| Nhãn SGK | Thuộc hành chính (theo SGK) |
|----------|----------------------------|
| quần đảo Hoàng Sa | thành phố Đà Nẵng – Việt Nam |
| quần đảo Trường Sa | tỉnh Khánh Hòa – Việt Nam |
| Đảo Phú Quốc | (vịnh Thái Lan, Kiên Giang) |
| Đảo Cồn Cỏ, Đảo Lý Sơn, Đảo Phú Quý, Đảo Côn Sơn, QĐ. Thổ Chu, đảo Bạch Long Vĩ | theo chú giải / bản đồ |

## Cấu trúc chương trình (địa lí — làm ngân hàng câu)

Theo mục lục và các trang có từ khóa **Bắc Bộ**, **Nam Bộ**, **lược đồ**, **Bản đồ**:

| Chủ đề SGK | Nội dung game (địa lí) | Vùng drop gợi ý |
|------------|------------------------|-----------------|
| Thiên nhiên và con người — **Địa phương em** | Vị trí, khí hậu, sông, cây, nghề, bảo vệ môi trường địa phương | `dia-phuong` / tỉnh em |
| **Trung du và miền núi Bắc Bộ** | Địa hình, khí hậu, sông; Phan-xi-păng, Hoàng Liên Sơn, Mộc Châu | `bac-bo` |
| **Đồng bằng Bắc Bộ** | Đồng bằng, sông Hồng, Hà Nội, Hải Phòng | `bac-bo` |
| **Duyên hải miền Trung** | Đèo Hải Vân, bão, hạn hán, du lịch | `trung-bo` |
| **Tây Nguyên** | Cao nguyên, đất đỏ bazan, rừng, cà phê | `tay-nguyen` |
| **Đồng bằng sông Cửu Long** | Sông Mekong, miệt vườn, lúa, cá, ĐBSCL | `nam-bo` |

## Lịch sử (trong cùng SGK — game Sử Địa, badge «Sử»)

- Văn hóa truyền thống địa phương (bánh chưng, lễ hội, danh nhân).
- Các bài **Lịch sử và văn hóa** theo vùng (song song địa lí).
- Game **Đọc Hiểu Sử Việt** giữ: đoạn văn dài, Đúng/Sai, sự kiện quốc gia (Văn Lang → 1945).
- Game **Sử Địa** thêm: MCQ / kéo-thả — *«Sông Bạch Đằng thuộc miền nào?»*, *«Phan-xi-păng nằm ở vùng nào?»* (không trùng câu Đúng/Sai dài).

## Dạng câu hỏi game (bám SGK)

SGK yêu cầu HS (trích mục tiêu bài 4 — Trung du Bắc Bộ):

- Xác định vị trí địa danh trên **bản đồ hoặc lược đồ**.
- Mô tả đặc điểm thiên nhiên (địa hình, khí hậu, sông).
- Nêu ảnh hưởng đến đời sống, sản xuất.

→ Game kéo-thả: thẻ *«Dãy núi Hoàng Liên Sơn»* → vùng **Bắc Bộ**; thẻ *«Đồng bằng Cửu Long»* → **Nam Bộ**; thẻ *«quần đảo Hoàng Sa»* → ô **Hoàng Sa**.

## Câu cần chuyển từ `doc-hieu-su-viet`

Rà `historyBank.ts` — chuyển sang `suDiaBank` nếu:

- Sai/không phải sự kiện lịch sử (vd. *«Sông Bạch Đằng nằm ở tỉnh An Giang»* → địa lí).
- Thuần địa danh / vị trí địa lí.

Giữ ở Sử Việt: nhân vật, năm, triều đại, ý chính đoạn sử.

## Độ phủ ngân hàng game (2026-05-24)

| Mục SGK | Số câu (≥5/mục) |
|---------|-----------------|
| Địa phương em | 10 |
| Trung du & miền núi Bắc Bộ | 11 |
| Đồng bằng Bắc Bộ | 11 |
| Duyên hải miền Trung | 11 |
| Tây Nguyên | 10 |
| ĐBSCL | 13 |
| Lịch sử & văn hóa vùng | 14 |
| Bản đồ — đảo (Hình 1) | 22 |
| **Tổng** | **~200** (bank + extra + supplement) |

Kiểm tra trong code: `SU_DIA_COVERAGE` (`src/games/hanh-trinh-su-dia/questions.ts`).

## Liên kết

- Kế hoạch game: `docs/planning/GAME_BUT_SEN_AND_SU_DIA.md`
- README bản đồ: `public/maps/sgk-kntt-grade4/README.md`
