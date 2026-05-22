# Current System State

Last updated: 2026-05-22

## Product Snapshot

- Ứng dụng web game học tập lớp 4 chạy frontend-only.
- Có 9/9 game playable với luồng đầy đủ:
  - Welcome -> Home -> Game Select -> Game Play -> Result/Celebration.
- Welcome đã hỗ trợ profile picker nhiều hồ sơ (chọn profile cũ hoặc tạo profile mới theo tên).
- Home có dock nổi 2 bên: trái (Nhân vật/Thoát), phải (3 toggle cấu hình nhanh).
- Có popup "Nhân vật" hiển thị tổng quan lượt chơi, độ chính xác, điểm và thống kê theo từng game (lọc theo profile đang chọn), kèm hiệp sĩ 3D (giáp/trang bị tăng theo chỉ số).
- Hệ điểm 0-10 (làm tròn 0.5), sao, xếp loại và mở khóa danh hiệu 1 -> 2 -> 3.
- Quy tắc mở khóa hiện hành: đạt `score >= 7` sẽ mở bậc kế tiếp (nếu còn).

## Technical Snapshot

- Stack: Vite + TypeScript + Three.js.
- State: store thuần TypeScript (`useAppStore` API tương thích).
- Persistence:
  - IndexedDB: `profile`, `progress`, `sessions`.
  - localStorage: `kv_settings`.
- Speech/Audio:
  - TTS qua Web Speech API.
  - SFX qua Web Audio API.
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
2. Thêm test tự động cho score/unlock và smoke e2e tối thiểu.
3. Chuẩn hóa telemetry/observability runtime ở mức local.
