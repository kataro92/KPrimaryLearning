# Cursor Setup

Thư mục này chứa cấu hình để dự án vận hành theo hướng Cursor-first.

## Thành phần

- `rules/kvprimaryfunlearning-first.mdc`: Rule mặc định áp dụng cho mọi phiên làm việc.
- `rules/typescript-conventions.mdc`: Rule code style áp dụng khi làm việc với `src/**/*.{ts,tsx}`.
- `skills/kv-3d-models/`: Skill tạo/sửa mô hình 3D (procedural Three.js, glTF, Sketchfab).
- `skills/lobehub-skills-search-engine/`: LobeHub Skills Marketplace — tìm và cài skill mới qua CLI khi gặp tác vụ chưa biết cách làm.
- `skills/davila7-claude-code-templates-3d-web-experience/`: Three.js / WebGL — thiết kế scene 3D web, PBR, tối ưu GLB, animation.
- `skills/davila7-claude-code-templates-3d-games/`: Nguyên tắc game 3D — rendering, shader, physics, camera.

## LobeHub Skills Marketplace

Đã đăng ký identity Cursor và cài skill tìm kiếm marketplace.

- **Credentials:** `C:\Users\Ryzen5-PC\.lobehub-market\credentials.json`
- **Tìm skill:** `npx -y @lobehub/market-cli skills search --q "KEYWORD"`
- **Cài skill (Cursor):** `npx -y @lobehub/market-cli skills install <identifier> --agent cursor`
- **Đánh giá sau khi dùng:** `npx -y @lobehub/market-cli skills comment <identifier> -c "..." --rating 4`

## Mục tiêu

- Giữ agent bám đúng tài liệu chính thức trong `docs/`.
- Ưu tiên thay đổi nhỏ, có kiểm thử smoke/build sau chỉnh sửa.
- Giữ tính nhất quán giữa code, tài liệu, và quy trình phát triển.
