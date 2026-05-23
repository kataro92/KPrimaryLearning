# Current System State

Last updated: 2026-05-23

## Product Snapshot

- Ứng dụng web game học tập lớp 4 chạy frontend-only.
- Có 9/9 game playable với luồng đầy đủ:
  - Welcome -> Home -> Game Select -> Game Play -> Result/Celebration.
- Welcome đã hỗ trợ profile picker nhiều hồ sơ (chọn profile cũ hoặc tạo profile mới theo tên).
- Home có dock nổi 2 bên: trái (Nhân vật/Thoát), phải (3 toggle cấu hình nhanh).
- Game Hội An: thẻ từ vựng; thuyền đêm 3D + đèn lồng glTF Sketchfab (fallback procedural).
- Game Trạng Tí: T-Rex glTF trong cảnh bắn pháo (fallback khối procedural).
- Game Văn Miếu: hero rùa 3D glTF tiến về bia khi trả lời đúng (fallback procedural).
- Game Trống Đồng: hero 3D glTF (Sketchfab CC BY) + fallback procedural; đáp án dạng bia đá (thống nhất Trạng Nguyên); trả lời đúng có tiếng đánh trống + hiệu ứng nền rực rỡ, trống quay mặt về người chơi, hoa văn sáng lên.
- Game Thăng Long: 100 đồ vật, mỗi lượt 10–14 câu; 100 mẫu 3D riêng + vật liệu ảnh (Poly Haven CC0 + họa tiết); tên không gợi ý dạng hình; chọn đáp án (không kéo-thả).
- Game Cửu Long (FPS nỏ): toàn màn hình; HUD trong thế giới 3D (bảng gỗ + texture canvas gắn camera, thanh đếm ngược khối, chấm tiến độ voxel, tâm ngắm 3D); đáp án A/B/C trên bảng mục tiêu trong scene; chỉ còn nút « Về » HTML nổi.
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
  - SFX qua Web Audio API.
  - Tài liệu: `docs/planning/TTS_LOCAL_ARCHITECTURE.md`.
- Deployment:
  - GitHub Actions tự động build và publish lên GitHub Pages khi push `main`.
  - Base path production: `/KPrimaryLearning/`.
- Build status: `npm run build` pass (có warning chunk size).

## Known Gaps

- Chưa có backend/API và đồng bộ cloud đa thiết bị.
- Chưa có màn Progress riêng cho phụ huynh/giáo viên.
- Chưa có test tự động chính thức (unit/e2e) trong repo hiện tại.

## Next Priorities

1. Tối ưu bundle/chunk để giảm kích thước JS ban đầu.
2. Refactor TTS foundation theo hướng worker + fallback provider.
3. Thêm test tự động cho score/unlock và smoke e2e tối thiểu.
4. Chuẩn hóa telemetry/observability runtime ở mức local.
