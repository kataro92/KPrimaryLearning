# Implementation Roadmap (As-Is + Next)

## 1. Mục tiêu tài liệu

- Ghi nhận **hiện trạng triển khai thực tế** trong codebase.
- Chỉ ra backlog ưu tiên cho giai đoạn tiếp theo.
- Dùng như tài liệu theo dõi ngắn hạn, thay vì kế hoạch giả định 24 tuần.

## 2. Trạng thái hiện tại (đã hoàn thành)

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Nền tảng Vite + TypeScript + Three.js | Done | Build/dev chạy ổn định |
| App flow nhiều màn hình | Done | Welcome, Home, Game Select, Game Play, Result/Celebration |
| 9 game playable | Done | Có renderer và gameplay riêng cho từng game |
| Lưu profile/progress/session local | Done | IndexedDB stores: `profile`, `progress`, `sessions` |
| Cài đặt người dùng | Done | `soundEnabled`, `sfxEnabled`, `musicEnabled`, `largeText` qua localStorage |
| Điểm + xếp loại + sao | Done | Thang điểm 0-10, làm tròn 0.5 |
| Mở khóa danh hiệu 1->2->3 | Done | Rule hiện tại: score >= 7 |
| TTS tiếng Việt | Done | Web Speech API, có fallback theo hỗ trợ trình duyệt |
| Interactive microcopy theo game | Done | Rule-based text bank theo đúng/sai/hết giờ |

## 3. Kết quả kiểm chứng gần nhất

- `npm run build`: **pass**
- Không có lỗi TypeScript chặn build.
- Có warning chunk size (>500 kB) cần tối ưu thêm ở giai đoạn performance.

## 4. Backlog ưu tiên tiếp theo

| Ưu tiên | Hạng mục | Mục tiêu |
|---|---|---|
| P0 | Tối ưu bundle/chunk | Giảm cảnh báo chunk size, cải thiện thời gian tải ban đầu |
| P0 | Chuẩn hóa smoke test runbook | Đồng bộ checklist test giữa dev và QA |
| P0 | TTS local-first (MMS + Web Speech) | Done |
| P1 | Bổ sung test tự động cơ bản | Thêm unit test cho score/unlock và smoke test e2e tối thiểu |
| P2 | TTS progress UI trên Home | Hiển thị `downloading-model` khi preload MMS |
| P1 | Voice profile local | Luồng upload `.wav`, normalize audio, lưu embedding theo profile local |
| P1 | Tăng observability local | Bổ sung logging chuẩn cho lỗi runtime và gameplay edge cases |
| P2 | Nâng cấp data tools | Cân nhắc export/import dữ liệu local cho phụ huynh/giáo viên |
| P2 | UX polish theo game | Tinh chỉnh microcopy/animation dựa trên feedback chơi thực tế |

## 5. Rủi ro chính hiện tại

| Rủi ro | Mức độ | Hướng xử lý |
|---|---|---|
| Bundle JS lớn | Trung bình | Tách chunk theo màn/game, lazy-load renderer |
| Khác biệt hỗ trợ TTS giữa trình duyệt | Trung bình | Giữ fallback text + test đa trình duyệt định kỳ |
| Model TTS local dung lượng lớn | Trung bình | Quantization + preload theo nhu cầu + cache OPFS theo version |
| Regression khi chỉnh game riêng lẻ | Trung bình | Bắt buộc chạy smoke checklist + build mỗi phiên |

## 6. Định nghĩa “xong” cho mỗi task mới

Một task được coi là hoàn thành khi:

1. Chạy được luồng chính trong `docs/workflow/DEVELOPMENT_WORKFLOW.md`.
2. `npm run build` pass.
3. Không làm sai logic điểm/mở khóa hiện hành.
4. Nếu thay đổi behavior, cập nhật docs tương ứng trong cùng task.
