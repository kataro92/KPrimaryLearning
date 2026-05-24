# Models — Hình học Thăng Long

Game dùng **mô hình procedural** (100 mẫu `o001`–`o100`) và tự ánh xạ câu hỏi bổ sung `o101`–`o250` về mẫu gần nhất theo nhãn.

## GLTF tùy chọn (chính xác hơn)

Đặt file theo **builder id** (ví dụ `o072` cho miếng pizza):

```
public/models/hinh-hoc-thang-long/props/o072.glb
public/models/hinh-hoc-thang-long/props/o072/scene.gltf
```

Khi có file, preview 3D ưu tiên GLTF; không có thì dùng procedural.

## Tải từ Sketchfab

```bash
# Cần SKETCHFAB_API_TOKEN trong .env
node scripts/download-sketchfab-model.mjs
```

Các mục trong script (dice, pizza, book, ruler, …) — xem `scripts/download-sketchfab-model.mjs`.

## Giấy phép

Chỉ thêm model **CC0** hoặc **CC BY** có ghi `license.txt` trong thư mục model.
