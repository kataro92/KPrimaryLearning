# Project Documentation

Tất cả tài liệu dự án được gom về thư mục `docs/` để dễ bảo trì và tra cứu.

## Structure

- `requirements/BUSINESS_REQUIREMENTS.md`: BRD mục tiêu + bảng trạng thái triển khai hiện tại.
- `requirements/TECHNICAL_REQUIREMENTS.md`: Baseline kỹ thuật **as-is** theo code đang chạy.
- `planning/IMPLEMENTATION_ROADMAP.md`: Snapshot hiện trạng + backlog ưu tiên tiếp theo.
- `planning/TTS_LOCAL_ARCHITECTURE.md`: Định hướng to-be cho TTS local-first (WebGPU/WASM/ONNX + fallback).
- `workflow/DEVELOPMENT_WORKFLOW.md`: Quy trình dev/test bắt buộc.
- `workflow/DOCS_DEFINITION_OF_DONE.md`: Checklist bắt buộc khi thay đổi docs.
- `status/CURRENT_STATE.md`: Snapshot hiện trạng hệ thống theo ngày cập nhật.
- `GLOSSARY.md`: Chuẩn hóa thuật ngữ product/technical/scoring.
- `STYLING.md`: Hệ thống giao diện claymorphism và quy ước style.

## Nguồn sự thật

- Mô tả hiện trạng hệ thống: ưu tiên `requirements/TECHNICAL_REQUIREMENTS.md` và `planning/IMPLEMENTATION_ROADMAP.md`.
- Định hướng sản phẩm dài hạn: xem `requirements/BUSINESS_REQUIREMENTS.md`.
- Snapshot nhanh theo ngày: xem `status/CURRENT_STATE.md`.

## Recommended Reading Order

1. `requirements/TECHNICAL_REQUIREMENTS.md`
2. `planning/IMPLEMENTATION_ROADMAP.md`
3. `planning/TTS_LOCAL_ARCHITECTURE.md` (khi làm việc với audio/TTS)
4. `status/CURRENT_STATE.md`
5. `workflow/DEVELOPMENT_WORKFLOW.md`
6. `workflow/DOCS_DEFINITION_OF_DONE.md`
7. `requirements/BUSINESS_REQUIREMENTS.md`
8. `GLOSSARY.md`
9. `STYLING.md`
