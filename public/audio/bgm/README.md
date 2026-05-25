# Background music (BGM)

Nhạc nền **vui, sáng** cho học sinh tiểu học — mỗi game một track loop riêng.

**Artist:** Eric Matyas  
**Source:** https://soundimage.org  
**License:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — ghi công bắt buộc.

Attribution: *Music by Eric Matyas (soundimage.org), used under CC BY 4.0.*

## Nhạc Việt Nam

Hiện chưa có bản **nhạc thiếu nhi Việt Nam** (ví dụ *Thuyền buồm xinh xinh*) với giấy phép CC BY rõ ràng để đóng gói trong app. Các track dưới đây là nhạc game **vui / quirky** (không lời), phù hợp lứa tuổi. Có thể bổ sung file `.ogg` tự sản xuất hoặc có license sau.

## Tracks (2026 — upbeat set)

| Game ID | File | Track title | Source URL |
| --- | --- | --- | --- |
| `dao-duc-nhi` | `dao-duc-nhi.ogg` | Good Morning Doctor Weird | https://soundimage.org/wp-content/uploads/2025/10/Good-Morning-Doctor-Weird.ogg |
| `doc-hieu-su-viet` | `doc-hieu-su-viet.ogg` | Puzzle Dreams | https://soundimage.org/wp-content/uploads/2025/10/Puzzle-Dreams.ogg |
| `hanh-trinh-su-dia` | `hanh-trinh-su-dia.ogg` | Cool Adventure Intro | https://soundimage.org/wp-content/uploads/2025/10/Cool-Adventure-Intro.ogg |
| `but-sen-viet` | `but-sen-viet.ogg` | Fishbowl Circus | https://soundimage.org/wp-content/uploads/2025/10/Fishbowl-Circus.ogg |
| `trong-dong` | `trong-dong.ogg` | Monkey Drama | https://soundimage.org/wp-content/uploads/2025/10/Monkey-Drama.ogg |
| `hinh-hoc-thang-long` | `hinh-hoc-thang-long.ogg` | Whimsical Popsicle | https://soundimage.org/wp-content/uploads/2025/10/Whimsical-Popsicle.ogg |
| `cuu-chuong-van-mieu` | `cuu-chuong-van-mieu.ogg` | Monkey Island Band | https://soundimage.org/wp-content/uploads/2025/10/Monkey-Island-Band_Looping.ogg |
| `tham-hiem-cuu-long` | `tham-hiem-cuu-long.ogg` | Arcade Fantasy | https://soundimage.org/wp-content/uploads/2025/10/Arcade-Fantasy.ogg |
| `trang-nguyen-toan` | `trang-nguyen-toan.ogg` | Arcade Adventures | https://soundimage.org/wp-content/uploads/2025/10/Arcade-Adventures_Looping.ogg |
| `tinh-nham-trang-ti` | `tinh-nham-trang-ti.ogg` | Coin-Op Chaos | https://soundimage.org/wp-content/uploads/2025/10/Coin-Op-Chaos_Looping.ogg |
| `tu-vung-hoi-an` | `tu-vung-hoi-an.ogg` | Bustling Village | https://soundimage.org/wp-content/uploads/2025/10/Bustling-Village.ogg |

## Download

```bash
npm run fetch:bgm
# một game:
node scripts/download-bgm.mjs --only=dao-duc-nhi
node scripts/download-bgm.mjs --force   # ghi đè file cũ
```

## Playback

`src/features/audio/bgmService.ts` — `HTMLAudioElement` loop, toggle **Nhạc nền**, duck khi TTS.
