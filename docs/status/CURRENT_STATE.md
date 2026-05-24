# Current System State

Last updated: 2026-05-24

## Product Snapshot

- Ứng dụng web game học tập lớp 4 chạy frontend-only.
- Có 8/8 game playable với luồng đầy đủ:
  - Welcome -> Home -> Game Select -> Game Play -> Result/Celebration.
- Welcome đã hỗ trợ profile picker nhiều hồ sơ (chọn profile cũ hoặc tạo profile mới theo tên).
- Home có dock nổi 2 bên: trái (Nhân vật/Thoát), phải (4 toggle cấu hình nhanh: Giọng, SFX, Nhạc nền, Chữ+).
- Game Hội An: thẻ từ vựng; thuyền đêm 3D — thuyền glTF (`models/tu-vung-hoi-an/boat/`, cao ~16.2u, scale ×12) + đèn lồng glTF (`lantern/`); fallback procedural cùng tỷ lệ; camera lùi theo kích thước thuyền.
- Game Trạng Nguyên: robot mech glTF Sketchfab trên bục lắp ráp (fallback khối procedural).
- Game Trạng Tí: T-Rex glTF lớn quay mặt người chơi, nền kỷ Jura (đồi, cây cọ, núi lửa); bắn pháo khi đúng (fallback khối procedural).
- Game Văn Miếu: hero rùa 3D glTF da xanh (texture PBR Turtle.001, bóng đổ) tiến về bia khi trả lời đúng (fallback procedural xanh).
- Game Trống Đồng: hero 3D glTF (Sketchfab CC BY) + fallback procedural; đáp án dạng bia đá (thống nhất Trạng Nguyên); trả lời đúng có tiếng đánh trống + hiệu ứng nền rực rỡ, trống quay mặt về người chơi, hoa văn sáng lên.
- Game Thăng Long: 250 đồ vật, mỗi lượt 10–14 câu; 100 mẫu procedural + ánh xạ nhãn o101–o250 về mẫu gần đúng; tự xoay mặt vuông/chữ nhật/tam giác về camera; GLTF tùy chọn `models/hinh-hoc-thang-long/props/{builderId}.glb` (Sketchfab script: xúc xắc, pizza); tên không gợi ý dạng hình; chọn đáp án (không kéo-thả).
- Game Cửu Long (FPS): toàn màn hình; câu hỏi cố định trên bảng gỗ lớn (cao gấp đôi) dưới hàng mục tiêu; nhãn lựa chọn (Động vật / Thực vật / Hiện tượng) trực tiếp trên mặt bia — không còn A/B/C; HUD timer/tiến độ cố định trong scene; không còn model nỏ — chỉ tâm ngắm mảnh + viên sáng bay tới mục tiêu; ngắm/chọn tự do; bấm « Về » dừng RAF/timer/TTS/BGM và hủy timeout câu tiếp; các game DOM khác: câu hỏi cố định phía trên lựa chọn (không animation).
- Có popup "Nhân vật" hiển thị tổng quan lượt chơi, độ chính xác, điểm và thống kê theo từng game (lọc theo profile đang chọn), kèm hiệp sĩ 3D (giáp/trang bị tăng theo chỉ số).
- Hệ điểm 0-10 (làm tròn 0.5), sao, xếp loại và mở khóa danh hiệu 1 -> 2 -> 3.
- Quy tắc mở khóa hiện hành: đạt `score >= 7` sẽ mở bậc kế tiếp (nếu còn).

## Technical Snapshot

- Stack: Vite + TypeScript + Three.js (+ `GLTFLoader` cho asset Sketchfab tại `public/models/`).
- State: store thuần TypeScript (`useAppStore` API tương thích).
- Persistence:
  - IndexedDB: `profile`, `progress`, `sessions`.
  - localStorage: `kv_settings`.
- Speech/Audio:
  - TTS: `Xenova/mms-tts-vie` (ONNX, Web Worker) + fallback Web Speech `vi-VN`.
  - Upload giọng mẫu OPFS: chỉ nghe lại trong modal Nhân vật (không clone giọng).
  - `ttsMode` mặc định `auto`; câu > 280 ký tự → Web Speech.
  - Cancel/timeout/preload worker từ Home khi bật giọng.
  - Mỗi game đọc câu hỏi/lượt khi hiển thị (tôn trọng toggle Giọng); game ghép thẻ Hội An chỉ đọc hướng dẫn mở đầu vì không có câu hỏi từng lượt.
  - SFX qua Web Audio API (`sfxService.ts`, toggle `sfxEnabled`).
  - Nhạc nền file OGG riêng cho từng game (`public/audio/bgm/`, Eric Matyas / soundimage.org, CC BY); phát qua `HTMLAudioElement` trong `bgmService.ts` (toggle `musicEnabled`); tự duck khi TTS đang phát; fade in/out khi vào/ra game.
  - Tài liệu: `docs/planning/TTS_LOCAL_ARCHITECTURE.md`.
- Deployment:
  - GitHub Actions tự động build và publish lên GitHub Pages khi push `main`.
  - Base path production: `/KPrimaryLearning/`.
- Build status: `npm run build` pass (có warning chunk size).
- Ngân hàng câu hỏi lớp 4 (HK1/HK2): **55 nguồn đề** (2020–2025) trong `docs/content/EXAM_SOURCES_GRADE4.md` + `scripts/exam-sources-grade4.json`; mỗi game có ngân hàng gốc + `*Supplement*` + `*Extra*` (~300+ mục/game); sinh lại: `npm run generate:questions`.

## Known Gaps

- Chưa có backend/API và đồng bộ cloud đa thiết bị.
- Chưa có màn Progress riêng cho phụ huynh/giáo viên.
- Chưa có test tự động chính thức (unit/e2e) trong repo hiện tại.

## Next Priorities

1. Tối ưu bundle/chunk để giảm kích thước JS ban đầu.
2. Refactor TTS foundation theo hướng worker + fallback provider.
3. Thêm test tự động cho score/unlock và smoke e2e tối thiểu.
4. Chuẩn hóa telemetry/observability runtime ở mức local.
