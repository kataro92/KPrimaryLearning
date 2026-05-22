# Quy trình phát triển

Mỗi lần phát triển tính năng hoặc sửa lỗi, **bắt buộc** chạy web và kiểm thử thủ công trước khi coi là xong.

## 1. Chạy dev server

```bash
npm run dev
```

URL mặc định: `http://localhost:5173/`

Nếu port bận, dùng URL Vite in ra trong terminal.

## 2. Checklist test nhanh (smoke)

| # | Bước | Kỳ vọng |
|---|------|---------|
| 1 | Mở trang Welcome | Có ô nhập tên + nút "Bắt đầu", canvas nền Three.js hiển thị |
| 2 | Nhập tên → Bắt đầu | Vào Home, hiển thị danh sách 9 game |
| 3 | Kiểm tra card game ở Home | Có hiển thị bậc danh hiệu và kỷ lục (nếu đã chơi) |
| 4 | Chọn **Tính Nhẩm Trạng Tí** | Vào màn chọn danh hiệu + có phần "Cách chơi" |
| 5 | Chọn danh hiệu đã mở | Vào màn chơi, có phép toán + thanh đếm ngược |
| 6 | Nhập đáp án đúng → xác nhận | Có phản hồi đúng/sai và chuyển câu tiếp |
| 7 | Chọn **Nét Chữ Rồng Tiên** | Gameplay gõ chữ kiểu Mario hoạt động, không kẹt input |
| 8 | Chọn **Từ Vựng Hội An** | Lật ghép cặp đèn lồng, ghép đúng thì lock cặp |
| 9 | Hoàn thành một lượt bất kỳ | Màn kết quả có: điểm, sao, đúng/tổng, thời gian |
| 10 | Từ màn kết quả bấm "Chơi lại" | Quay lại đúng game/danh hiệu vừa chọn |
| 11 | Reload trang (F5) | Vẫn nhớ tên + tiến độ danh hiệu/kỷ lục (IndexedDB) |
| 12 | `npm run build` | Build pass, không lỗi TypeScript |

## 3. Kiểm tra console

- Không có lỗi đỏ nghiêm trọng trên Console khi đi luồng chính.
- Cảnh báo TTS/giọng nói trên một số trình duyệt là chấp nhận được.
- Cảnh báo chunk size khi build là cảnh báo tối ưu, không phải build fail.

## 4. Khi sửa xong

- Ghi ngắn trong commit/PR hoặc tin nhắn: đã test các bước nào.
- Nếu thêm game mới: bổ sung dòng tương ứng vào checklist trên.

## 5. Agent (Cursor)

Sau mỗi phiên code:

1. Chạy `npm run dev` (hoặc xác nhận server đang chạy).
2. Mở trình duyệt và test luồng smoke.
3. Chạy `npm run build` xác nhận không regress build.
