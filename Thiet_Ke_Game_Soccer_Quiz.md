# TÀI LIỆU THIẾT KẾ GAME CHI TIẾT (GAME DESIGN DOCUMENT)
## Tên dự án: Soccer Quiz Adventure (Game Giải Đố Bóng Đá 2D)

Tài liệu này đặc tả chi tiết giao diện, vị trí các đối tượng và kịch bản hoạt họa (animation) cho trò chơi giải đố bóng đá dựa trên bản phác thảo hình ảnh **IMG_2189.jpg**. Game tích hợp cơ chế "Lượt sút" (Mạng) và kết thúc bằng một "Trận đấu Trùm" đối đầu với Thủ môn để ghi bàn thắng quyết định.

---

## 1. TỔNG QUAN HỆ THỐNG CƠ CHẾ CHÍNH

### 1.1 Cơ chế "Lượt sút" (Shooting Lives)
*   **Số lượng ban đầu:** Người chơi bắt đầu mỗi màn chơi với **3 Lượt sút** (được hiển thị bằng 3 biểu tượng Quả bóng vàng ở góc trên màn hình).
*   **Logic vận hành:**
    *   **Trả lời ĐÚNG:** Giữ nguyên lượt sút, bóng vượt qua đối thủ, camera cuộn sang phải để gặp đối thủ tiếp theo.
    *   **Trả lời SAI:** Bị trừ **1 Lượt sút**. Đối thủ sút/đánh đầu phá bóng bật ngược lại. Người chơi phải thực hiện lại câu hỏi đó hoặc nhận một câu hỏi thay thế cùng cấp độ tại vị trí đó.
    *   **Game Over:** Khi số Lượt sút về 0, màn hình *Defeat* xuất hiện, người chơi phải chọn Chơi lại (Retry) từ đầu màn hoặc dùng vật phẩm hồi sinh.

### 1.2 Tiến trình màn chơi & Trận đấu cuối (Boss Battle)
*   Mỗi màn chơi (Level) gồm **4 chặng đối đầu**:
    *   **Chặng 1, 2, 3 (Hậu vệ thường):** Độ khó câu hỏi tăng dần (Dễ -> Trung bình -> Khó). Bố cục giống như bản vẽ Scene 1, 2, 3 trong **IMG_2189.jpg**.
    *   **Chặng 4 (Trận đấu cuối - Thủ môn / Boss Battle):** Câu hỏi đặc biệt (Cực khó hoặc Câu hỏi chuỗi). Phía sau thủ môn là **Khung thành**. Trả lời đúng chặng này sẽ sút tung lưới và CHIẾN THẮNG màn chơi.

---

## 2. BỐ CỤC MÀN HÌNH & VỊ TRÍ ĐỐI TƯỢNG (SCREEN LAYOUT & POSITIONS)

Giao diện game sử dụng màn hình dọc hoặc ngang (tối ưu nhất là màn hình ngang tỉ lệ 16:9). Hệ tọa độ giả định với **X (0 đến 100 từ trái sang phải)** và **Y (0 đến 100 từ trên xuống dưới)**.

### 2.1 Khu vực UI cố định (Phần trên màn hình: Y: 0% - Y: 35%)
*   **Thanh tiến trình (Progress Bar):** Vị trí `[X: 50%, Y: 5%]`, căn giữa. Hiển thị 4 mốc chấm tròn (3 Hậu vệ và 1 biểu tượng Vương miện/Cúp cho Thủ môn).
*   **Hệ thống Lượt sút (Lives UI):** Vị trí `[X: 5%, Y: 5%]`, góc trên bên trái. Gồm 3 icon Quả bóng xếp ngang. Khi mất mạng, quả bóng chuyển sang màu xám và vỡ ra.
*   **Khung câu hỏi (Question Box):** Vị trí `[X: 10% đến 90%, Y: 12% đến Y: 22%]`. Hộp thoại bo góc nền bán trong suốt. Văn bản câu hỏi căn giữa, font chữ đậm, màu trắng.
*   **Khung chứa 3 nút đáp án (A, B, C):** Vị trí `[X: 10% đến 90%, Y: 24% đến Y: 34%]`. Ba nút A, B, C được chia đều theo chiều ngang:
    *   **Nút A:** Tâm tại `[X: 25%, Y: 29%]`
    *   **Nút B:** Tâm tại `[X: 50%, Y: 29%]`
    *   **Nút C:** Tâm tại `[X: 75%, Y: 29%]`

### 2.2 Khu vực Sân cỏ & Nhân vật (Phần dưới màn hình: Y: 35% - Y: 100%)
*   **Đường chân trời / Vạch kẻ sân:** Nằm ngang tại `[Y: 65%]`, phân tách phần hậu cảnh sân vận động và thảm cỏ phía trước.
*   **Cầu thủ người chơi (Striker):** Vị trí đứng yên (Idle) tại `[X: 20%, Y: 75%]`, hướng mặt sang phải.
*   **Quả bóng (Ball):** Vị trí nằm ngay trước mũi giày cầu thủ tại `[X: 26%, Y: 78%]`.
*   **Đối thủ (Hậu vệ / Thủ môn):**
    *   *Trường hợp Hậu vệ thường (Chặng 1-3):* Đứng yên tại `[X: 80%, Y: 75%]`, hướng mặt sang trái.
    *   *Trường hợp Thủ môn + Khung thành (Chặng 4):* Thủ môn đứng tại `[X: 75%, Y: 75%]`. Phía sau thủ môn là Khung thành kéo dài từ `[X: 85% đến X: 100%, Y: 50% đến Y: 85%]`.

---

## 3. MÔ TẢ CHI TIẾT HOẠT HỌA & KỊCH BẢN TỪNG SCENE

### 🎬 SCENE 1 & 2: TRẠNG THÁI CHỜ VÀ PHẢN HỒI LỰA CHỌN
*   **Vị trí ban đầu:** Theo bản vẽ Scene 1 trong **IMG_2189.jpg**, cầu thủ ở `X:20%`, hậu vệ ở `X:80%`. Bóng nằm ở chân cầu thủ. 
*   **Hoạt họa Chờ (Idle Loop):** Cầu thủ dậm chân nhẹ nhịp nhàng, mắt nhìn về phía trước. Hậu vệ dang tay nhún nhảy phòng thủ qua lại (sang trái/phải khoảng 2%).
*   **Kịch bản khi Người dùng tương tác (Chọn đáp án A):**
    1.  **UI Đáp án:** Ngay khi chạm vào nút A, nút B và C lập tức áp dụng hiệu ứng *Fade out* (Độ mờ giảm từ 100% về 0% trong vòng 0.2 giây).
    2.  **Highlight Blink:** Nút A phóng to lên 110% trong 0.1 giây, sau đó nhấp nháy sáng (Blink) liên tục 3 lần với ánh sáng viền màu vàng Neon nhạt để tạo cảm giác xác nhận lựa chọn thành công (Giống mô tả Scene 2 trong ảnh).
    3.  **Nhân vật chuyển thế:** Cầu thủ kết thúc trạng thái Idle, chuyển sang tư thế chạy đà 2 bước tiến về phía quả bóng.

---

### 🎬 SCENE 3: KỊCH BẢN TRẢ LỜI ĐÚNG (USER CORRECT)
*   **Bước 1: Hoạt họa sút bóng (Kick Animation)**
    *   Cầu thủ thực hiện động tác vung chân đá (Duration: 0.3 giây). Tại thời điểm chân chạm bóng, một hiệu ứng tia sáng nhỏ góc rộng phát ra tại tâm quả bóng.
*   **Bước 2: Quỹ đạo di chuyển của quả bóng (Ball Trajectory)**
    *   Tùy thuộc vào đáp án người chơi chọn, quả bóng sẽ bay theo đường cong Bezier (Bézier Curve) hướng về phía khung thành/phía sau đối thủ:
        *   **Nếu chọn A (Đá bổng):** Bóng bay vồng lên cao. Đỉnh đường cong đạt `[X: 50%, Y: 40%]`, sau đó hạ cánh xuống vị trí `[X: 88%, Y: 78%]`.
        *   **Nếu chọn B (Đá thẳng/Tầm trung):** Bóng bay căng, hơi vồng nhẹ. Đỉnh đường cong đạt `[X: 50%, Y: 55%]`, đáp xuống `[X: 88%, Y: 78%]`.
        *   **Nếu chọn C (Đá sệt):** Bóng lăn nhanh, nảy nhẹ sát mặt đất `[Y: 76% - 78%]`, xuyên qua hai chân hậu vệ.
*   **Bước 3: Phản ứng của đối thủ**
    *   Hậu vệ máy đổ người hoặc di chuyển sai hướng. Ví dụ: Nếu người chơi chọn A (đá bổng), hậu vệ sẽ diễn hoạt ảnh cúi người hụt bóng; nếu chọn C (đá sệt), hậu vệ sẽ nhảy lên hụt bóng. Hậu vệ bất lực nhìn bóng bay qua (Duration: 0.5 giây).
*   **Bước 4: Cuộn màn hình chuyển cảnh (Slide Scroll Transition)**
    *   Sau khi quả bóng lăn quá vị trí đối thủ (`X > 85%`), hoạt ảnh chuyển cảnh kích hoạt:
    *   Hậu vệ cũ chạy lùi ra khỏi rìa trái màn hình và biến mất.
    *   Cầu thủ chính chạy đuổi theo quả bóng theo hướng từ trái sang phải với tốc độ hối hả.
    *   Toàn bộ hậu cảnh sân cỏ cuộn mượt mà sang bên trái (`Slide scroll`). 
    *   Sau 1.2 giây cuộn màn hình, một Hậu vệ mới (hoặc Thủ môn nếu là chặng cuối) từ rìa phải màn hình trượt vào vị trí `[X: 80%]`. Màn hình dừng lại, câu hỏi tiếp theo hiện lên, reset về trạng thái Scene 1.

---

### 🎬 SCENE 4: KỊCH BẢN TRẢ LỜI SAI (USER WRONG)
*   **Bước 1: Sút bóng**
    *   Cầu thủ vẫn thực hiện động tác sút bóng đi tương tự như khi trả lời đúng (Bóng bay theo hướng đáp án đã chọn).
*   **Bước 2: Đối thủ cản phá xuất sắc (Jump/Block Animation)**
    *   Hậu vệ máy đoán trúng hướng bóng một cách chính xác (Dựa trên hình vẽ Scene 4 trong **IMG_2189.jpg**).
    *   **Hoạt họa của đối thủ:** Đối thủ bật nhảy cao (`Jump`) nếu bóng đi bổng (A, B) hoặc xoạc chân cản phá nếu bóng đi sệt (C). Bộ phận cản phá (Đầu/Chân) chạm trúng tâm bóng tại vị trí giao nhau tầm `[X: 72%]`. Một hiệu ứng va đập chớp lóe màu đỏ (Hit VFX) xuất hiện tại điểm tiếp xúc.
*   **Bước 3: Bóng bật ngược lại (Ball Fall Back)**
    *   Quả bóng bị dội ngược lực lực mạnh, bay theo quỹ đạo hình parabol ngược từ phải sang trái, rớt lại vị trí cũ trước chân cầu thủ `[X: 26%, Y: 78%]`. Cầu thủ chính đưa tay lên đầu hoặc ôm mặt thể hiện sự tiếc nuối (Animation: Disappointment).
*   **Bước 4: UI Khấu trừ mạng**
    *   1 Icon quả bóng trên thanh Lượt sút (Lives UI) rung lên và nổ vỡ đổi sang màu xám đen. Nếu còn mạng, hệ thống hiện hiệu ứng "Thử lại câu hỏi" (Retry Indicator).

---

### 🏆 CHẶNG ĐẶC BIỆT: TRẬN ĐẤU CUỐI VỚI THỦ MÔN (BOSS BATTLE)
Màn đối đầu này áp dụng toàn bộ logic của Scene 1, 2, 3, 4 nhưng thay đổi hoàn toàn về mặt hình ảnh đồ họa nhằm đẩy cao tính cao trào:

1.  **Thay đổi Bố cục hình ảnh:**
    *   Hậu vệ thường được thay thế bằng **Thủ môn** to lớn hơn, mặc áo khác màu (ví dụ áo vàng hoặc dạ quang), đứng ở vị trí `[X: 72%, Y: 72%]`.
    *   Phía sau thủ môn xuất hiện một **Khung thành bóng đá lớn** phủ lưới trắng chiếm trọn góc phải màn hình từ `[X: 82% đến 100%]`.
2.  **Kịch bản TRẢ LỜI ĐÚNG (Chiến thắng hoàn toàn):**
    *   Cầu thủ tung cú sút sấm sét (Thêm hiệu ứng vệt lửa/đuôi ánh sáng bám theo quả bóng).
    *   Thủ môn đổ người bay người hết cỡ (Dive animation) nhưng không chạm được vào bóng.
    *   Quả bóng găm thẳng vào góc lưới khung thành (Lưới rung lên bần bật theo hiệu ứng vật lý thực).
    *   **Màn hình chiến thắng (Victory Screen):** Cầu thủ chạy ăn mừng Slide đầu gối trên cỏ, pháo hoa nổ tung tóe trên UI, dòng chữ **"MÀN CHƠI HOÀN THÀNH - GOAL!!!"** xuất hiện hoành tráng giữa màn hình.
3.  **Kịch bản TRẢ LỜI SAI:**
    *   Thủ môn bay người đấm bóng hoặc ôm gọn quả bóng vào lòng.
    *   Trừ 1 lượt sút của người chơi. Bóng được thủ môn ôm giữ, màn hình reset về lượt sút phạt tiếp theo cho đến khi người chơi sút tung lưới thành công hoặc hết lượt sút hoàn toàn.
