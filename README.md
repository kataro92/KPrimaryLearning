<a id="readme-top"></a>

# KV Primary Fun Learning

Website game học tập lớp 4 (frontend-only) với trải nghiệm 3D, tập trung vào học qua chơi.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-6e56cf?style=for-the-badge)](https://kataro92.github.io/KPrimaryLearning/)
[![Repo](https://img.shields.io/badge/Repository-KPrimaryLearning-24292f?style=for-the-badge&logo=github)](https://github.com/kataro92/KPrimaryLearning)

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Bắt đầu nhanh](#bắt-đầu-nhanh)
- [Sử dụng](#sử-dụng)
- [Roadmap](#roadmap)
- [Tài liệu](#tài-liệu)
- [Contributing](#contributing)
- [License](#license)
- [Liên hệ](#liên-hệ)

## Giới thiệu

- Nền tảng web game học tập cho học sinh lớp 4.
- Hiện có **8/8 game** playable theo luồng: Welcome -> Home -> Game Select -> Gameplay -> Result/Celebration.
- Persistence local qua IndexedDB (`profile`, `progress`, `sessions`) và localStorage (`kv_settings`).
- Demo online: [https://kataro92.github.io/KPrimaryLearning/](https://kataro92.github.io/KPrimaryLearning/)

## Công nghệ sử dụng

- `TypeScript`
- `Vite`
- `Three.js`
- `Modular CSS` + phong cách Claymorphism
- `GitHub Actions` + `GitHub Pages`

## Bắt đầu nhanh

### Điều kiện

- `Node.js` 20+ (khuyến nghị)
- `npm`

### Cài đặt và chạy local

```bash
git clone https://github.com/kataro92/KPrimaryLearning.git
cd KPrimaryLearning
npm install
cp .env.example .env   # tùy chọn — đã có .env mặc định cho dev
npm run dev
```

Mở URL do Vite in ra (thường là `http://localhost:5173`).

### Biến môi trường

| File | Mục đích |
|------|----------|
| `.env` | Dev local (gitignore) — `VITE_BASE_PATH=/` |
| `.env.production` | Build GitHub Pages — `VITE_BASE_PATH=/KPrimaryLearning/` |
| `.env.example` | Mẫu + mô tả biến |

Biến chính:

- `VITE_BASE_PATH` — base URL asset (dev: `/`, production: `/KPrimaryLearning/`)
- `VITE_NEURAL_TTS_ENABLED` — bật/tắt TTS neural (`true`/`false`)
- `SKETCHFAB_API_TOKEN` — token Sketchfab cho `npm run fetch:models` (không vào bundle)

### Build production

```bash
npm run build
npm run preview
```

## Sử dụng

### Demo nhanh

![Demo Flow](docs/screenshots/demo-flow.gif)

### Các màn hình chính

1. Welcome  
   ![Welcome](docs/screenshots/01-welcome.png)

2. Home (dashboard 9 game + toggle nhanh)  
   ![Home](docs/screenshots/02-home.png)

3. Chọn game và danh hiệu  
   ![Game Select Tier](docs/screenshots/03-game-select-tier.png)

4. Gameplay (ví dụ Trạng Nguyên Toán Việt - giữa trận)  
   ![Gameplay](docs/screenshots/04-gameplay.png)

5. Báo cáo nhân vật và tiến độ  
   ![Character Report](docs/screenshots/05-character-report.png)

## Roadmap

- Tối ưu bundle/chunk để giảm kích thước JS ban đầu.
- Bổ sung test tự động cho score/unlock và smoke e2e tối thiểu.
- Chuẩn hóa telemetry/observability runtime ở mức local.
- TTS local: `Xenova/mms-tts-vie` (ONNX) + Web Speech fallback — `docs/planning/TTS_LOCAL_ARCHITECTURE.md`.

## Tài liệu

- `docs/README.md` (điểm vào chính)
- `docs/requirements/BUSINESS_REQUIREMENTS.md`
- `docs/requirements/TECHNICAL_REQUIREMENTS.md`
- `docs/planning/IMPLEMENTATION_ROADMAP.md`
- `docs/planning/TTS_LOCAL_ARCHITECTURE.md`
- `docs/status/CURRENT_STATE.md`
- `docs/workflow/DEVELOPMENT_WORKFLOW.md`
- `docs/workflow/DOCS_DEFINITION_OF_DONE.md`
- `docs/STYLING.md`
- `docs/GLOSSARY.md`

## Contributing

Contributions luôn được chào đón. Quy trình đề xuất:

1. Fork repository
2. Tạo branch mới (`feature/...` hoặc `fix/...`)
3. Commit thay đổi
4. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

### Third-party 3D assets

| Game | Asset | Source | License |
| --- | --- | --- | --- |
| Giải Mã Trống Đồng | Trống Đồng Đông Sơn | [Sketchfab — @Aaannnn](https://sketchfab.com/3d-models/trong-ong-ong-son-dong-son-bronze-drum-c91e55f6db8742f09ad2d5815ca6b749) | [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) |
| Hành Trình Từ Vựng Hội An | Japanese paper lantern | [Sketchfab — @abelGB](https://sketchfab.com/3d-models/japanese-paper-lantern-4450069fee444ae0920aa5babd5d9239) | CC BY 4.0 |
| Tính Nhẩm Trạng Tí | Low Poly T Rex (Walk Cycle) | [Sketchfab — Jerome Angeles](https://sketchfab.com/3d-models/low-poly-t-rex-walk-cycle-free-download-80f501c8b7754f43a06c7463bb34419b) | CC BY 4.0 |
| Bảng Cửu Chương Văn Miếu | Sea turtle low poly | [Sketchfab — @C.J..Goldman](https://sketchfab.com/3d-models/sea-turtle-low-poly-c92be549c8194136914883309a13a6b5) | CC BY 4.0 |
| Trạng Nguyên Toán *(catalog)* | Low Poly Mech | [Sketchfab — @abdomash847](https://sketchfab.com/3d-models/low-poly-mech-with-sword-and-gun-arm-e6758a6e5b0e44918bdad7fa19a39814) | CC BY 4.0 |

Download all listed models:

```bash
SKETCHFAB_API_TOKEN=your_token npm run fetch:models
```

See `public/models/*/README.md` per game. Missing files fall back to procedural geometry.

### Third-party audio (BGM)

| Scope | Asset | Source | License |
| --- | --- | --- | --- |
| All 9 games (per-game track) | Background music OGG | [Eric Matyas — soundimage.org](https://soundimage.org) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

See `public/audio/bgm/README.md` for track titles and download URLs per game.

## Liên hệ

- Repository: [https://github.com/kataro92/KPrimaryLearning](https://github.com/kataro92/KPrimaryLearning)
- Live site: [https://kataro92.github.io/KPrimaryLearning/](https://kataro92.github.io/KPrimaryLearning/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
