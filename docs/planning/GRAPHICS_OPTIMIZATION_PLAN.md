# Kế hoạch tối ưu đồ họa — KV Primary Fun Learning

> **Trạng thái triển khai (2026-06-26):** Giai đoạn 1 và 2 đã hoàn tất trong mã nguồn.
>
> **Giai đoạn 1 (đã làm):** thêm `src/core/rendering/frameLoop.ts` (cap FPS + tự pause khi ẩn tab + clamp delta); `SceneHost` chạy nền ở 30fps, tự pause khi ẩn tab, có API `pause()/resume()`; 10 scene game có renderer riêng đều chuyển sang `FrameLoop` (cap 60fps + auto-pause); trex/dongSon clamp `getDelta` ≤ 0.05s; xóa code chết `mechaRobotScene.ts`.
>
> **Giai đoạn 2 (đã làm):** hạ shadow map 2048²→1024² ở 5 scene (thanhGiong, fps, trex, gundam, boatLantern); xác nhận mỗi scene chỉ có **1 đèn đổ bóng** (key/sun) nên không cần cắt thêm; hạ trần DPR 2→1.5 ở 5 scene có bloom để giảm ~44% pixel (bloom + toàn cảnh) với độ mềm rất nhẹ.
>
> **Giai đoạn 3 (đã làm):** thêm `src/core/rendering/qualityTier.ts` (dò tầng low/mid/high theo CPU cores + RAM + DPR, có `setQualityTier()` để ép thủ công) và `src/core/rendering/createGameRenderer.ts` (factory renderer dùng chung). Cả 10 scene 3D chuyển sang factory: DPR, antialias, bật/tắt + kiểu shadow đều theo tầng. Kích thước shadow map theo tầng (high 2048 / mid 1024 / low 512); bloom tự tắt ở tầng low (`if (getTierProfile().bloomEnabled)`). Giảm segment các mesh nền lớn (sky dome trex 32→24, ground thanhGiong 48→32, floor gundam 64→36, glow sphere gundam 36→24).
>
> Bảng tầng: **high** DPR 2 · shadow 2048 PCFSoft · bloom · AA · 60fps; **mid** DPR 1.5 · shadow 1024 PCF · bloom · AA · 60fps; **low** DPR 1 · không shadow · không bloom · không AA · 30fps.
>
> Bản standalone **World Cup 2026** cũng đã được phủ: `scene3d` dùng `FrameLoop` (cap 60 + auto-pause), `LightingRig.configureRenderer` + shadow map của `sun` đọc theo tầng chất lượng.
>
> **Không làm (có chủ đích):** base class cho scene — đây là refactor rủi ro cao nhất; vì `FrameLoop` + factory đã gom phần lớn lặp (vòng lặp + tạo renderer), nên bỏ qua việc ép migrate toàn bộ scene sang base class khi chưa có build để kiểm chứng.
>
> **Công cụ Giai đoạn 4 (đã làm):** thêm `src/core/rendering/perfOverlay.ts` — overlay đo FPS (tức thời + trung bình) và nút chọn tầng Low/Mid/High/Auto, bật bằng **Ctrl+Shift+P** hoặc mở trang với **?perf=1**. Lựa chọn tầng lưu localStorage (bền vững sau tải lại). Dùng để tự đo trước/sau trên máy thật.
>
> **Còn lại (Giai đoạn 4 — cần chạy trên thiết bị):** dùng overlay đo FPS nhóm game nặng trên một máy yếu; kiểm thử hồi quy hình ảnh (so ảnh trước/sau); kiểm tra rò rỉ bộ nhớ (vào/ra mỗi game ~20 lần, theo dõi số WebGL context và heap).
>
> **⚠ Quan trọng — cần build trên máy:** sandbox không chạy được `npm run build` đáng tin (lỗi đồng bộ file mirror). Mọi thay đổi đã được rà soát tĩnh trên file thật, nhưng **bạn cần chạy `npm run build` (tsc + vite) trên máy** để xác nhận TypeScript xanh trước khi deploy.

---


> Phạm vi: rà soát toàn bộ 15 game trong `src/games/*` + scene nền dùng chung (`SceneHost`) và bản standalone World Cup 2026. Mục tiêu: giữ nguyên chất lượng hình ảnh cảm nhận được, giảm tải GPU/CPU/pin trên máy yếu (Chromebook, máy tính bảng, laptop tích hợp), và dọn code chết.

Ngày rà soát: 2026-06-26. Stack: Three.js `^0.170.0`, TypeScript, Vite.

---

## 1. Kiến trúc render hiện tại (tóm tắt)

Ứng dụng có **hai lớp WebGL độc lập** chạy đồng thời:

1. `SceneHost` (`src/core/rendering/sceneHost.ts`) — một canvas nền 2.5D dùng chung, dựng decor theo theme từng game, camera orthographic, có hiệu ứng "lắc nhẹ" (parallax sway). Loop `requestAnimationFrame` của nó **chạy liên tục suốt vòng đời app**, kể cả khi một game 3D nặng đang mở đè lên trên.
2. Mỗi game 3D nặng tự tạo **một `WebGLRenderer` + canvas riêng** (overlay), với loop rAF riêng.

Tổng cộng có **13 nơi khởi tạo `WebGLRenderer`** (11 trong `src/games`, 1 ở `SceneHost`, 1 ở standalone World Cup).

Hệ quả quan trọng: khi người chơi vào một game như Gundam/FPS/Trex, có **ít nhất 2 context WebGL render song song mỗi khung hình** — scene game phía trên và nền `SceneHost` phía dưới (dù bị che gần hết).

---

## 2. Bảng kiểm kê đồ họa theo game

| Game (thư mục) | Scene | Dòng | Loại đồ họa | Renderer riêng | Shadow map | Đèn | Bloom/Post | Mức tải |
|---|---|---|---|---|---|---|---|---|
| trang-nguyen-toan | gundamRobotScene | 1115 | 3D PBR robot | ✔ | 2048² | 7 | ✔ Bloom | **Rất cao** |
| trang-nguyen-toan | mechaRobotScene | 878 | 3D PBR robot | ✔ | 2048² | 9 | ✔ Bloom | **Chết (không dùng)** |
| doc-hieu-su-viet | thanhGiongScene | 823 | 3D nhân vật | ✔ | 2048² | 4 (8 caster) | ✔ Bloom | **Rất cao** |
| tham-hiem-cuu-long | fpsCrossbowScene | 830 | 3D FPS | ✔ | 2048² | 4 (5 caster) | ✔ Bloom | **Rất cao** |
| tinh-nham-trang-ti | trexBattleScene | 715 | 3D battle | ✔ | 2048² | 4 (6 caster) | ✔ Bloom | **Rất cao** |
| tu-vung-hoi-an | boatLanternScene | 641 | 3D thuyền/đèn | ✔ | 2048² | 8 (5 caster) | ✔ Bloom | **Cao** |
| thuong-nhan-song-hong | marketScene | 358 | 3D chợ | ✔ | — | 4 | — | Trung bình |
| but-sen-viet | butSenPenScene | 310 | 3D bút | ✔ | — | 4 | — | Trung bình |
| trong-dong | dongSonDrumScene | 274 | 3D trống đồng | ✔ | — | 5 | — | Trung bình |
| dao-duc-nhi | ethicsHeartScene | 235 | 3D trái tim | ✔ | — | 4 | — | Trung bình |
| cuu-chuong-van-mieu | vanMieuTurtleScene | 232 | 3D rùa | ✔ | 1024² | 4 (2 caster) | — | Trung bình |
| do-dat-co-thanh | landPlotScene | 40 | Decor SceneHost | — | — | — | — | Thấp |
| thap-trieu-so | towerScene | 40 | Decor SceneHost | — | — | — | — | Thấp |
| chia-banh-trang-ram | mooncakeScene + fractionVisual | 41 | Decor + canvas 2D | — | — | — | — | Thấp |
| bep-bac-hoc-tro | kitchenScene | 44 | Decor SceneHost | — | — | — | — | Thấp |
| cho-so-lieu | statsMarketScene + statsChart | 44 | Decor + canvas 2D | — | — | — | — | Thấp |
| hanh-trinh-su-dia | vietnamMapView | — | Bản đồ SVG | — | — | — | — | Thấp |

(Standalone: `world-cup-2026` có renderer + lighting rig riêng, shadow 1024², ngoài luồng 15 game chính.)

---

## 3. Các vấn đề hệ thống (xếp theo mức tác động)

### P0 — Tác động lớn, sửa rẻ

**3.1. Nền `SceneHost` không bị tạm dừng khi game 3D nặng đang chạy (double-render).**
`createGameStage.ts` chỉ gọi `setGameTheme`, không hề dừng hay ẩn loop của `SceneHost`. Với 6 game nặng nhất, GPU phải vẽ 2 cảnh mỗi khung hình một cách lãng phí. Đây là khoản tiết kiệm dễ và lớn nhất.

**3.2. Không có cơ chế tạm dừng khi tab ẩn / cửa sổ mất focus.**
Tìm toàn repo: không có `visibilitychange`, `document.hidden`, hay `IntersectionObserver`. Mọi loop rAF tiếp tục vẽ ngay cả khi người dùng chuyển tab — hao pin vô ích, đặc biệt trên laptop/tablet.

**3.3. Không có giới hạn FPS.**
Không scene nào throttle về 30/60 FPS. Trên màn 120Hz, scene cố vẽ 120 khung/giây — gấp đôi tải mà trẻ em không cảm nhận được khác biệt trong game học tập.

**3.4. Xóa code chết: `mechaRobotScene.ts`.**
`play.ts` của trang-nguyen-toan chỉ import `GundamRobotScene`. File `mechaRobotScene.ts` (878 dòng, 9 đèn, 14 vật đổ bóng, có bloom) hoàn toàn không được dùng nhưng vẫn nằm trong bundle nếu được tham chiếu ở đâu đó. Cần xác nhận và xóa để giảm kích thước build và tránh nhầm lẫn.

### P1 — Tác động cao trên máy yếu

**3.5. Shadow map 2048² + `PCFSoftShadowMap` ở 6 game.**
2048×2048 là quá mức cho cảnh nhỏ gọn của game học tập. Mỗi đèn đổ bóng = thêm một lượt render scene vào shadow map. `thanhGiongScene` có tới 8 vật caster, `fpsCrossbow`/`trex` 5–6.

**3.6. Bloom (UnrealBloomPass) full-resolution ở 6 game.**
`EffectComposer` + `UnrealBloomPass` render ở độ phân giải đầy đủ là một trong những pass đắt nhất, nhân với `pixelRatio` tối đa 2.

**3.7. `antialias: true` cộng dồn với `pixelRatio` tối đa 2 và bloom.**
Khi đã bật bloom/post hoặc chạy ở DPR 2 trên màn Retina, MSAA phần cứng vừa tốn vừa thừa. Nên hạ trần `pixelRatio` cho cảnh nặng và để post-process lo khử răng cưa (hoặc tắt AA khi DPR ≥ 2).

### P2 — Dọn dẹp & nhất quán

**3.8. Geometry phân đoạn cao không cần thiết:** ví dụ `SphereGeometry(44, 32)`, `CircleGeometry(2.55, 64)`, `TorusGeometry(..., 8, 64)`. Cảnh tĩnh/nhỏ có thể giảm segment 30–50% mà mắt không phân biệt được.
**3.9. Lặp thiết lập renderer** ở 11 file — nên gom vào một factory dùng chung để áp policy chất lượng đồng nhất (mục 5).
**3.10. Không có "tầng chất lượng" (quality tier)** thích ứng theo phần cứng — mọi máy chạy cùng một mức nặng.

---

## 4. Kế hoạch tối ưu theo giai đoạn

### Giai đoạn 1 — "Quick wins" (rủi ro thấp, không đổi hình ảnh cảm nhận)

1. **Tạm dừng `SceneHost` khi game 3D nặng mở.** Thêm `pause()`/`resume()` vào `SceneHost` (dừng/khởi động lại rAF). Gọi `pause()` trong `createGameStage` cho các game có renderer riêng; `resume()` khi thoát game. → Loại bỏ double-render.
2. **Tạm dừng theo `visibilitychange`** ở cả `SceneHost` và base class scene game: khi `document.hidden` thì hủy rAF, khi hiện lại thì chạy tiếp.
3. **Giới hạn FPS 60** (tùy chọn 30 cho tier thấp) bằng cách so sánh delta thời gian trong loop.
4. **Xóa `mechaRobotScene.ts`** sau khi grep xác nhận không còn import (đã xác nhận `play.ts` không dùng). Kiểm tra cả bundle để chắc chắn tree-shaking.

*Kỳ vọng:* giảm 30–50% thời gian GPU/khung hình ở các game nặng và gần như loại bỏ tiêu hao pin khi nền/tab ẩn — gần như không thay đổi hình ảnh.

### Giai đoạn 2 — Hạ chi phí shadow & post-process

5. **Giảm shadow map 2048² → 1024²** (hoặc 512² cho cảnh rất nhỏ) ở 6 game. Mắt trẻ em trong game học tập gần như không thấy khác biệt.
6. **Gộp/giảm số đèn đổ bóng:** chỉ để **một** đèn "key" đổ bóng; các đèn fill/rim đặt `castShadow = false`. Riêng `thanhGiongScene` (8 caster) và `trex`/`fps` (5–6) cần rà từng đèn.
7. **Bloom rẻ hơn:** render bloom ở nửa độ phân giải (downsample), hoặc giảm `strength`/`radius`, hoặc thay bằng glow bằng sprite/emissive cho cảnh ít cần. Cân nhắc chỉ bật bloom ở tier "cao".
8. **Chính sách AA/DPR:** khi `devicePixelRatio ≥ 2` thì tắt `antialias` phần cứng (post-process hoặc độ nét màn hình đã đủ); hạ trần `pixelRatio` xuống 1.5 cho cảnh nặng.

*Kỳ vọng:* giảm thêm 20–35% tải GPU trên máy tầm trung/yếu, khác biệt hình ảnh rất nhỏ.

### Giai đoạn 3 — Hạ tầng dùng chung & tầng chất lượng

9. **Factory renderer dùng chung** (`createGameRenderer(options)`): tập trung `pixelRatio`, `antialias`, `shadowMap`, `toneMapping`, `outputColorSpace`. Toàn bộ 11 scene gọi qua factory → policy nhất quán, sửa một chỗ áp mọi nơi.
10. **Base class cho scene 3D** xử lý vòng đời chuẩn: rAF, FPS cap, pause theo visibility, `dispose()` (geometry/material/texture/renderer) — giảm lặp và rò rỉ bộ nhớ.
11. **Tầng chất lượng thích ứng** (`low` / `mid` / `high`): dò nhanh phần cứng (số nhân logic, ước lượng GPU, DPR) hoặc cho người dùng chọn. Tier quyết định: bật/tắt bloom, kích thước shadow map, trần DPR, FPS cap, số đèn đổ bóng.
12. **Giảm segment geometry** cho cảnh tĩnh: hạ các giá trị 48/64 xuống 24/32 ở những mesh không quay cận cảnh.

### Giai đoạn 4 — Đo lường & chốt

13. **Đo trước/sau** bằng `chrome://tracing` hoặc overlay `stats.js` (GPU ms/khung, draw calls, triangles) trên một máy yếu đại diện, cho 6 game nặng.
14. **Kiểm thử hồi quy hình ảnh:** chụp ảnh từng scene trước/sau để đảm bảo chất lượng cảm nhận không giảm.
15. **Kiểm tra rò rỉ bộ nhớ:** vào/ra mỗi game 20 lần, theo dõi số WebGL context và heap không tăng dần (đảm bảo `dispose()` đầy đủ).

---

## 5. Đề xuất kỹ thuật cụ thể (mẫu)

**Factory renderer dùng chung** — gom thiết lập đang lặp ở 11 file:

```ts
// src/core/rendering/createGameRenderer.ts
export function createGameRenderer(canvas: HTMLCanvasElement, tier: QualityTier) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: tier !== 'low' && window.devicePixelRatio < 2,
    powerPreference: 'high-performance',
  });
  const dprCap = tier === 'high' ? 2 : tier === 'mid' ? 1.5 : 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
  renderer.shadowMap.enabled = tier !== 'low';
  renderer.shadowMap.type = THREE.PCFShadowMap; // rẻ hơn PCFSoft
  return renderer;
}
```

**Pause/resume cho SceneHost** (Giai đoạn 1, ý 1–2):

```ts
pause() { if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = 0; } }
resume() { if (!this.rafId && !this.disposed) this.loop(); }
// + lắng nghe 'visibilitychange' để tự pause khi document.hidden
```

**FPS cap trong loop:**

```ts
private loop = (t: number) => {
  this.rafId = requestAnimationFrame(this.loop);
  if (t - this.lastFrame < this.frameInterval) return; // ví dụ 1000/60
  this.lastFrame = t;
  this.renderer.render(this.scene, this.camera);
};
```

---

## 6. Tóm tắt ưu tiên

| Ưu tiên | Việc | Nỗ lực | Tác động |
|---|---|---|---|
| P0 | Pause SceneHost khi game nặng chạy | Thấp | Rất cao |
| P0 | Pause theo visibility (tab ẩn) | Thấp | Cao (pin) |
| P0 | FPS cap 60 | Thấp | Cao |
| P0 | Xóa `mechaRobotScene.ts` | Thấp | TB (bundle) |
| P1 | Shadow 2048→1024, gộp đèn đổ bóng | TB | Cao |
| P1 | Bloom nửa độ phân giải / theo tier | TB | Cao |
| P1 | Policy AA/DPR | Thấp | TB |
| P2 | Factory renderer + base scene | TB | TB (bảo trì) |
| P2 | Tầng chất lượng thích ứng | Cao | Cao (máy yếu) |
| P2 | Giảm segment geometry | Thấp | TB |

Khuyến nghị bắt đầu từ **Giai đoạn 1** vì gần như không rủi ro hình ảnh mà tiết kiệm lớn nhất, sau đó đo lường (Giai đoạn 4) trước khi quyết định mức độ làm Giai đoạn 2–3.
