# TTS Local-First Architecture (To-Be)

Last updated: 2026-05-22

## 1. Mục tiêu

- Nâng cấp hệ thống TTS từ `Web Speech API` đơn giản sang kiến trúc **client-side local-first**.
- Đảm bảo dữ liệu văn bản và voice sample không rời khỏi trình duyệt.
- Tạo nền tảng để mở rộng sang voice cloning tiếng Việt khi model sẵn sàng.

## 2. Nguyên tắc áp dụng cho KVPrimaryFunLearning

- **Frontend-only:** không thêm backend suy luận TTS.
- **Privacy-by-default:** không upload text/voice sample lên Internet.
- **Progressive enhancement:** ưu tiên local neural engine, fallback về Web Speech để không vỡ luồng chơi hiện tại.
- **Game-safe UX:** TTS không được block gameplay loop và timer.

## 3. Kiến trúc đề xuất

```text
[UI Game + Overlay]
    |
    +--> TTS Orchestrator (main thread)
            |
            +--> Local Neural TTS Worker (preferred)
            |       - Transformers.js + ONNX Runtime Web
            |       - Backend: WebGPU -> WASM fallback
            |       - Inference non-blocking
            |
            +--> Web Speech Provider (fallback compatibility)
            |
            +--> OPFS Cache Layer
                    - Quantized model artifacts
                    - Voice profile embeddings
                    - Generation metadata
```

## 4. Luồng dữ liệu mục tiêu

### 4.1 Khởi tạo (first run)
1. Kiểm tra OPFS xem đã có model quantized chưa.
2. Nếu chưa có, tải model từ static hosting (CDN/GitHub Releases) rồi lưu OPFS.
3. Khởi động worker và warm-up backend (`webgpu` nếu hỗ trợ, nếu không dùng `wasm`).

### 4.2 Chuẩn bị giọng mẫu
1. Người dùng upload file `.wav` (10-20 giây).
2. Web Audio API normalize về `mono + target sample rate`.
3. Trích xuất `speaker embedding`, lưu OPFS theo profile local.

### 4.3 Suy luận TTS
1. UI gửi `text + speaker embedding id` vào worker.
2. Worker chạy ONNX inference, trả về PCM/WAV bytes.
3. Main thread phát audio qua `<audio>` hoặc `AudioBufferSourceNode`.

### 4.4 Fallback
- Nếu worker/model/backend fail: fallback sang Web Speech API (`vi-VN`) để giữ trải nghiệm liên tục.

## 5. Yêu cầu kỹ thuật bắt buộc

- Worker tách riêng khỏi main thread để tránh lag UI.
- Có progress states rõ ràng: `idle`, `downloading-model`, `warming-up`, `ready`, `generating`, `error`.
- Có timeout và cancellation cho request TTS khi người chơi đổi câu hỏi nhanh.
- Quản lý tài nguyên audio và worker lifecycle (dispose/recreate an toàn).

## 6. Định hướng tối ưu model

- Mục tiêu dung lượng: ~150MB-300MB sau quantization (INT8 ưu tiên, INT4 nếu chất lượng chấp nhận được).
- Ưu tiên quality phù hợp ngữ cảnh học sinh lớp 4: rõ, chậm vừa, dễ nghe.
- Kiểm thử quality theo 3 kiểu câu: hướng dẫn, phản hồi đúng/sai, câu dài đọc hiểu.

## 7. Lộ trình áp dụng theo pha

### Phase 0 - Foundation (không đổi gameplay)
- Refactor `speechService` thành provider-based orchestrator.
- Thêm backend detection (`webgpu`/`wasm`) + health status.
- Thêm docs và telemetry local cho TTS path.

### Phase 1 - Local neural runtime
- Tích hợp worker + ONNX runtime web.
- Hỗ trợ preload model + progress UI.
- Chưa bắt buộc voice cloning, ưu tiên neural TTS tiếng Việt có sẵn.

### Phase 2 - Voice cloning
- Thêm luồng upload voice sample và trích xuất embedding.
- Mapping profile người chơi -> voice profile local.
- Thêm UX quản lý voice profile trong settings.

### Phase 3 - Production hardening
- Cache invalidation theo model version.
- Resume download + integrity checksum.
- Device compatibility matrix và fallback policy chi tiết.

## 8. KPI và acceptance cho TTS mới

- Thời gian khởi tạo lần đầu có model cache: <= 2s trên máy đã warm cache.
- TTS generation cho câu ngắn (<= 15 từ): target <= 1.5s trên máy có WebGPU.
- Main UI không bị drop frame đáng kể khi đang generate.
- 100% luồng game vẫn có audio feedback (neural hoặc fallback Web Speech).

## 9. Giới hạn hiện tại (honest status)

- Codebase hiện tại vẫn đang chạy `Web Speech API` cho TTS runtime.
- Chưa tích hợp model ONNX/Transformers.js trong nhánh hiện tại.
- Tài liệu này là định hướng to-be để triển khai dần, không khai báo đã hoàn tất.
