# Models — Hình học Thăng Long

Game dùng **mô hình procedural** (`propParts.ts`, builders `o001`–`o100`) và tự ánh xạ câu `o101`–`o250` về builder gần nhất.

Khi có **glTF/GLB** trong `props/{builderId}/`, preview 3D **ưu tiên model thật**; không có file thì dùng procedural.

## Tải model Sketchfab (CC BY)

```bash
# Cần SKETCHFAB_API_TOKEN trong .env
npm run fetch:hinh-hoc-models

# Một builder cụ thể
node scripts/download-sketchfab-model.mjs --only=o013

# Tải lại (ghi đè)
node scripts/download-sketchfab-model.mjs --only=o013 --force
```

Danh mục UID: `scripts/data/hinh-hoc-sketchfab.json` (28 builder).

## Builder đã có glTF (2026-05)

| Builder | Đồ vật (gợi ý) | Sketchfab UID |
|---------|----------------|---------------|
| o003 | Ô bàn cờ | d7c57b9b… |
| o007 | Hộp quà | 33bb8031… |
| o008 | Đồng hồ treo | 8e920e8b… |
| o009 | Gương | a3348d3e… |
| o010 | Khay sushi | c76c23f8… |
| o013 | Rubik | 2a9ee6ab… |
| o016 | Pin mặt trời | 8f094196… |
| o017 | Khung cửa sổ | 45d2d222… |
| o020 | Sandwich | 2ee0a6ea… |
| o023 | Xúc xắc | a2274ddb… |
| o030 | LEGO | 0292ebb0… |
| o040 | Thước kẻ | ab7ec42d… |
| o042 | Hộp bút | 62d50825… |
| o043 | Bánh mì | 6c974828… |
| o045 | Hộp sữa | 5b1e483e… |
| o050 | Mặt sách | 739a23b9… |
| o051 | Bút chì | 77b406f2… |
| o056 | Bảng đen | 84c2350e… |
| o061 | Quạt trần | 226e34b1… |
| o063 | Remote TV | 52f142c0… |
| o069 | Cờ Việt Nam | 55edbce2… |
| o072 | Pizza | 11a147c2… |
| o076 | Nón lá | 4eed68df… |
| o079 | Kim tự tháp | b03835b1… |
| o082 | Nêm / cone | 774f986b… |
| o083 | Lều | 21cc274c… |
| o095 | Onigiri | 6b52802c… |
| o098 | Diều | 52847140… |

Mỗi thư mục `props/oNNN/` có `scene.gltf` (+ textures) và `license.txt`.

## Giấy phép

Chỉ thêm model **CC Attribution** (hoặc CC BY-SA có ghi rõ trong `license.txt`). Ghi credit Sketchfab khi phát hành công khai.
