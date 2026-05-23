# Claymorphism UI

Ứng dụng dùng hệ thống giao diện **clay** (Nunito + DM Sans, nền `#F4F1FA`, thẻ kính mờ, bóng nhiều lớp).

## Tệp CSS (thứ tự import trong `main.ts`)

| Tệp | Vai trò |
|-----|---------|
| `global.css` | Layout, grid game-play, animation kết quả, media queries |
| `clay-tokens.css` | Biến màu, radius, shadow (import từ `global.css`) |
| `clay.css` | Nền blob, card, nút, input, HUD, badge, shell `game-play--clay` |
| `clay-game.css` | Widget trò chơi, passage, kết quả, khóa đáp án |
| `clay-themes.css` | Theme riêng (Mario typing — `game-play--net-chu`) |

## Class quy ước

- Màn hình: `screen screen--clay` (+ `screen--games`, `screen--welcome`, …)
- Thẻ: `card clay-card`
- Ván chơi: `game-play game-play--clay` + `game-play--<game-id>`
- Nút phụ: `btn--toolbar` (Về, không full width)

## Theme đặc biệt

**Nét Chữ Rồng Tiên** giữ giao diện Mario pixel trong `clay-themes.css`; shell HUD vẫn dùng layout chung nhưng header/arena bị override bởi theme.

Các game khác dùng clay đầy đủ trên header, arena, và control.

## Âm thanh hiệu ứng (SFX)

- Module: `src/features/audio/sfxService.ts` (Web Audio, không cần file `.mp3`)
- Bật/tắt SFX: Trang chủ → **SFX** (`sfxEnabled` trong settings)
- Bật/tắt nhạc nền: Trang chủ → **Nhạc** (`musicEnabled` trong settings)
- TTS riêng: **Đọc câu bằng giọng nói** (`soundEnabled`)
- Gắn tự động: `setGameFeedback` (đúng/sai/hết giờ), màn kết quả, thanh timer, nút UI, FPS bắn/trượt, lật đèn Hội An, Mario gõ đúng/sai

## Thêm style mới

1. Layout / breakpoint → `global.css`
2. Component dùng chung → `clay.css`
3. Widget trong game → `clay-game.css`
4. Brand/theme riêng → `clay-themes.css`
