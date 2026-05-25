# Current System State

Last updated: 2026-05-25

## Product Snapshot

- Ứng dụng web game học tập lớp 4 chạy frontend-only.
- Có **11** game playable với luồng đầy đủ:
  - Welcome -> Home -> Game Select -> Game Play -> Result/Celebration.
- Welcome đã hỗ trợ profile picker nhiều hồ sơ (chọn profile cũ hoặc tạo profile mới theo tên).
- Home có dock nổi 2 bên: trái (Nhân vật/Thoát), phải (4 toggle cấu hình nhanh: Giọng, SFX, Nhạc nền, Chữ+).
- Game Hội An: thẻ từ vựng; thuyền đêm 3D — thuyền glTF (`models/tu-vung-hoi-an/boat/`, cao ~16.2u, scale ×12) + đèn lồng glTF (`lantern/`); fallback procedural cùng tỷ lệ; camera lùi theo kích thước thuyền.
- Game Trạng Nguyên: robot mech glTF Sketchfab trên bục lắp ráp (fallback khối procedural).
- Game Trạng Tí: T-Rex glTF lớn quay mặt người chơi, nền kỷ Jura (đồi, cây cọ, núi lửa); bắn pháo khi đúng (fallback khối procedural).
- Game Văn Miếu: hero rùa 3D glTF da xanh (texture PBR Turtle.001, bóng đổ) tiến về bia khi trả lời đúng (fallback procedural xanh).
- Game Trống Đồng: hero 3D glTF (Sketchfab CC BY) + fallback procedural; đáp án dạng bia đá (thống nhất Trạng Nguyên); trả lời đúng có tiếng đánh trống + hiệu ứng nền rực rỡ, trống quay mặt về người chơi, hoa văn sáng lên.
- Game Thăng Long: **538** đồ vật; **538** nét vẽ procedural (**o001–o538**, mỗi câu một tranh, gán `oNNN→oNNN`); **o001–o100** chi tiết (`parts2d.ts`), **o101–o538** (`parts2dExtra.ts`); mỗi vòng chơi **không trùng tranh**; sinh lại: `npm run generate:hinh-hoc-drawings` (hoặc `assign:hinh-hoc-illustrations`).
- Game Bút Sen Việt: chính tả điền từ (Telex); hero 3D bút (`butSenPenScene`, `public/models/but-sen-viet/pen.glb` hoặc procedural); bank **~70 câu** trích SGK (OCR TV CTST: Mùa thu, Gieo ngày mới, Ca dao, Đất lành chim đậu, Kéo co, Chợ Tết, …); `npm run extract:sgk-content:ocr-tv`; xem `docs/content/SGK_TIENG_VIET_4_CHINH_TA.md`.
- Game **Đạo Đức Nhí** (`dao-duc-nhi`): tình huống 3 lựa chọn, Bài 1–12 SGK Đạo đức CTST; đáp án **bia đá** (`stone-tablet`, cùng Trống Đồng/Trạng Nguyên); hero 3D trái tim hồng (đập/to khi đúng, mọc cánh nhảy khi hết vòng).
- Game Hành Trình Sử & Địa: kéo thẻ vào bản đồ SGK Hình 1; **~200 câu** (`suDiaBank` + `Extra` + `Supplement`) phủ 8 mục SGK; 13 vùng thả (đã hiệu chỉnh 2026-05-24); DOM. **Còn:** QA vùng thả trên thiết bị thật, SVG vector thay ảnh scan NXB.
- Game Cửu Long (FPS): toàn màn hình; câu hỏi cố định trên bảng gỗ lớn (cao gấp đôi) dưới hàng mục tiêu; nhãn lựa chọn (Động vật / Thực vật / Hiện tượng) trực tiếp trên mặt bia — không còn A/B/C; HUD timer/tiến độ cố định trong scene; không còn model nỏ — chỉ tâm ngắm mảnh + viên sáng bay tới mục tiêu; ngắm/chọn tự do; bấm « Về » dừng RAF/timer/TTS/BGM và hủy timeout câu tiếp; các game DOM khác: câu hỏi cố định phía trên lựa chọn (không animation).
- Có popup "Nhân vật" hiển thị **bảng cấp 1–10** (điểm kinh nghiệm từ lượt chơi, điểm TB, mốc game), tổng quan lượt chơi, độ chính xác, điểm và thống kê theo từng game (lọc theo profile đang chọn), kèm hiệp sĩ 3D chibi — giáp tầng chi tiết (ngực/vai/ống chân/tấm bụng), khiên & huy hiệu **cờ đỏ sao vàng**, cờ cắm bậc cao; **Giọng đọc**: nếu trình duyệt chỉ có ≤1 giọng `vi` → một dòng thông báo (giọng AI); nếu ≥2 giọng → panel preset nữ/nam/hoạt hình + file mẫu tùy chọn.
- Hệ điểm 0-10 (làm tròn 0.5), sao, xếp loại và mở khóa danh hiệu 1 -> 2 -> 3.
- Quy tắc mở khóa hiện hành: đạt `score >= 7` sẽ mở bậc kế tiếp (nếu còn).

## Technical Snapshot

- Stack: Vite + TypeScript + Three.js (+ `GLTFLoader` cho asset Sketchfab tại `public/models/`).
- Agent skill `.cursor/skills/kv-3d-models/`: hướng dẫn tạo/sửa mô hình 3D (procedural, glTF, Sketchfab, fallback); Blender tùy chọn qua CLI-Hub.
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
  - Nhạc nền OGG **vui/sáng** riêng từng game (`public/audio/bgm/`, Eric Matyas CC BY; `npm run fetch:bgm`); ví dụ Đạo Đức Nhí → *Good Morning Doctor Weird*, Bút Sen → *Fishbowl Circus*; chưa có nhạc thiếu nhi Việt có license — xem `public/audio/bgm/README.md`.
  - Tài liệu: `docs/planning/TTS_LOCAL_ARCHITECTURE.md`.
- Deployment:
  - GitHub Actions tự động build và publish lên GitHub Pages khi push `main`.
  - Base path production: `/KPrimaryLearning/`.
- Build status: `npm run build` pass (có warning chunk size).
- Ngân hàng câu hỏi: ưu tiên **trích SGK** (`pdfs/`); `npm run extract:sgk-content` → `scripts/data/sgk-content/` (manifest commit); `extract:sgk-index` → mục lục. Toán: `sgkRef` trên `mcqBank`/`mathBank` (`npm run tag:math-sgkref`). Trống Đồng: `sgkRef` passage chính. **Không** `generate:questions` cho câu không có `sgkRef`.

## Known Gaps

- Chưa có backend/API và đồng bộ cloud đa thiết bị.
- Chưa có màn Progress riêng cho phụ huynh/giáo viên.
- Chưa có test tự động chính thức (unit/e2e) trong repo hiện tại.

## Next Priorities

1. Tối ưu bundle/chunk để giảm kích thước JS ban đầu.
2. Refactor TTS foundation theo hướng worker + fallback provider.
3. Thêm test tự động cho score/unlock và smoke e2e tối thiểu.
4. Chuẩn hóa telemetry/observability runtime ở mức local.
