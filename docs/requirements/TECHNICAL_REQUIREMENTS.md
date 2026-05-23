# Technical Baseline (As-Is) - KVPrimaryFunLearning

Tài liệu này mô tả **hiện trạng kỹ thuật đang chạy trong code** (không phải tài liệu đề xuất tương lai).

## 1. Kiến trúc tổng thể hiện tại

- Ứng dụng frontend-only, không có backend server.
- Runtime: Vite + TypeScript + Three.js.
- UI game dùng HTML/CSS overlay trên nền scene/canvas.
- Điều hướng màn hình do app-state nội bộ quản lý:
  - `welcome` -> `home` -> `game-select` -> `game-play` -> `result`/`celebration`.

## 2. Stack và cấu hình thực tế

- Package chính:
  - `three`
  - `vite`
  - `typescript`
  - `@types/three`
- Build scripts:
  - `npm run dev`
  - `npm run build` (`tsc && vite build`)
  - `npm run preview`
- Alias import:
  - `@/*` trỏ vào `src/*` (khai báo trong `tsconfig.json` và `vite.config.ts`).
- State management:
  - Không dùng Zustand runtime.
  - Dùng store thuần TypeScript ở `src/app/store.ts` (API tương thích `useAppStore`).

## 3. Dữ liệu local và persistence

### 3.1 IndexedDB (`src/data/indexeddb/db.ts`)
- Database: `kv_fun_learning` (version 1).
- Object stores:
  - `profile`
  - `progress`
  - `sessions`

### 3.2 Mô hình dữ liệu hiện có (`src/data/types.ts`)
- `PlayerProfile`: thông tin người chơi local.
- `GameProgress`: bậc danh hiệu đã mở + best score + best time.
- `PlaySession`: kết quả mỗi lượt chơi.
- `AppSettings`: `soundEnabled`, `musicEnabled`, `largeText`.

### 3.3 localStorage
- Key: `kv_settings`.
- Dùng để lưu tùy chọn TTS/SFX/chữ lớn (`soundEnabled`, `musicEnabled`, `largeText`, `ttsMode`).

## 4. Gameplay engine hiện tại

- Có **9/9 game playable** với renderer riêng (xem `src/games/registry.ts`).
- Mỗi game có `play.ts` riêng trong `src/games/<game-id>/`.
- Cơ chế điểm chung (`src/features/scoring/scoreEngine.ts`):
  - score 0-10
  - làm tròn bước 0.5
  - stars: 0..3
  - grade: Xuất sắc / Tốt / Đạt / Cần cố gắng
- Mở khóa danh hiệu (`src/features/progress/userProgressStore.ts`):
  - chỉ mở khóa bậc kế tiếp khi score >= 7.

## 5. Audio và speech

- SFX: Web Audio (`src/features/audio/sfxService.ts`).
- TTS orchestrator (`src/features/speech/ttsOrchestrator.ts`):
  - Worker + ONNX: `@huggingface/transformers`, model `Xenova/mms-tts-vie` (`neural/neuralTtsEngine.ts`).
  - Device: WebGPU nếu có, ngược lại WASM (`dtype: q8`).
  - Fallback: Web Speech API (`providers/webSpeechProvider.ts`) khi lỗi / văn bản dài / `ttsMode: webspeech`.
  - API public: `speakVietnamese`, `cancelSpeech`, `preloadLocalTts`, `subscribeTtsState`, `getTtsRuntimeSnapshot`.
- Giọng mẫu upload (OPFS): chỉ preview local trong modal Nhân vật, không thay đổi TTS synthesis.
- Interactive text: rule-based theo game/kind (`src/features/speech/interactiveText.ts`), không gọi cloud AI.
- Tài liệu: `docs/planning/TTS_LOCAL_ARCHITECTURE.md`.

## 6. UI và styling

- CSS được import trong `src/main.ts`:
  - `global.css`
  - `clay.css`
  - `clay-game.css`
  - `clay-themes.css`
- Hệ giao diện claymorphism + theme đặc biệt cho game `net-chu-rong-tien`.
- Chi tiết style: xem `docs/STYLING.md`.

## 7. Trạng thái kiểm chứng gần nhất

- Lệnh kiểm chứng: `npm run build`
- Kết quả: **pass**.
- Ghi chú hiện trạng build:
  - Có cảnh báo chunk lớn hơn 500 kB sau minify (Vite warning), chưa phải lỗi build.

## 8. Những mục chưa có trong hiện trạng

- Chưa có backend/API/cloud sync.
- Chưa có hệ telemetry event schema đầy đủ ra server.
- Chưa có module PWA/service worker chính thức trong code hiện tại.

## 9. Nguồn sự thật khi cập nhật tài liệu

Khi cập nhật tài liệu kỹ thuật, ưu tiên đối chiếu trực tiếp từ các file sau:

- `package.json`
- `src/app/App.ts`
- `src/app/store.ts`
- `src/games/registry.ts`
- `src/features/scoring/scoreEngine.ts`
- `src/features/progress/userProgressStore.ts`
- `src/data/indexeddb/db.ts`
