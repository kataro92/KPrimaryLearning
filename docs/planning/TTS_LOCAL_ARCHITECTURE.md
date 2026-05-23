# TTS Local-First Architecture

Last updated: 2026-05-22

## 1. Mục tiêu

- Đọc tiếng Việt trong game **100% trên trình duyệt**, không gửi text lên server.
- Phản hồi nhanh cho học sinh lớp 4; fallback khi thiết bị yếu hoặc lỗi model.

## 2. Giải pháp chính thức (đang dùng)

| Thành phần | Công nghệ | Vai trò |
|------------|-----------|---------|
| TTS neural tiếng Việt | `Xenova/mms-tts-vie` + `@huggingface/transformers` | Đọc câu trong game (`ttsMode: auto`) |
| Runtime | Web Worker + ONNX (`q8`, WebGPU → WASM) | Không block UI |
| Fallback | Web Speech API `vi-VN` | Khi neural lỗi / câu quá dài / `ttsMode: webspeech` |
| Cache model | `env.useBrowserCache` (Transformers.js) | Lần sau tải nhanh hơn |

**Không dùng:** viXTTS, SpeechT5 clone, WavLM embedding cho synthesis (đã gỡ).

## 3. Kiến trúc

```text
[Game UI]
    |
    +--> speechService / ttsOrchestrator
            |
            +--> localTts.worker
            |       └── MMS Vietnamese ONNX (mms-tts-vie)
            |
            +--> webSpeechProvider (fallback)
```

## 4. Luồng hoạt động

### 4.1 Khởi tạo
1. Bật **Giọng** trên Home → `preloadLocalTts()`.
2. Worker tải MMS (lần đầu có progress `downloading-model`).
3. State `ready` → có thể đọc neural.

### 4.2 Đọc câu
1. `speakVietnamese(text)` → cancel request cũ.
2. Câu ≤ 280 ký tự → worker synthesize → phát WAV.
3. Lỗi / timeout → Web Speech `vi-VN`.

### 4.3 File giọng mẫu (tùy chọn)
- Upload trong modal **Nhân vật** → lưu OPFS local.
- Chỉ dùng để **nghe lại mẫu** (phụ huynh/giáo viên), **không** đổi giọng đọc trong game.

## 5. Yêu cầu kỹ thuật

- Worker tách main thread; states: `idle`, `downloading-model`, `warming-up`, `ready`, `generating`, `error`.
- Cancel + timeout synthesize (20s) và init (180s).
- `dispose()` khi `beforeunload`.

## 6. File chính

- `src/features/speech/ttsOrchestrator.ts`
- `src/features/speech/localTts.worker.ts`
- `src/features/speech/neural/neuralTtsEngine.ts`
- `src/features/speech/neural/modelConfig.ts`
- `src/features/speech/providers/webSpeechProvider.ts`
- `src/features/speech/voice/` — OPFS reference sample (preview only)

## 7. Rủi ro & giới hạn

- Lần đầu tải model + WASM ORT (~vài chục MB + ~23MB wasm).
- Neural chậm hơn Web Speech trên máy yếu → fallback tự động.
- MMS một giọng cố định; không voice cloning từ file upload.

## 8. Backlog (tùy chọn sau)

- UI progress tải MMS trên Home.
- Tốc độ đọc (`rate`) trên output neural.
- Preset giọng thứ hai nếu có model MMS/VITS VN khác trên Hugging Face.
