# Business Requirements - Website Game Học Tập Lớp 4

## Trạng thái triển khai hiện tại (As-Is)

Tài liệu này giữ vai trò BRD mục tiêu. Phần dưới mô tả đầy đủ định hướng sản phẩm; tuy nhiên trạng thái hệ thống hiện tại đang ở mức:

| Hạng mục | Trạng thái hiện tại |
|---|---|
| 9 game học tập theo chủ đề | Đã triển khai và chơi được |
| Luồng màn hình Welcome -> Home -> Chọn danh hiệu -> Chơi -> Kết quả | Đã triển khai |
| Điểm 0-10, sao, xếp loại, celebration | Đã triển khai |
| Mở khóa danh hiệu theo thứ tự 1 -> 2 -> 3 | Đã triển khai (ngưỡng hiện tại: score >= 7) |
| Lưu tiến độ local theo game | Đã triển khai (IndexedDB) |
| TTS + phản hồi microcopy theo game | Đã triển khai |
| Chọn avatar trên màn Welcome | Chưa có UI chọn avatar (đang dùng `default`) |
| Màn Progress riêng cho phụ huynh/giáo viên | Chưa có màn riêng |
| Đồng bộ đa thiết bị/tài khoản cloud | Chưa triển khai |

> Khi có khác biệt giữa BRD mục tiêu và hệ thống đang chạy, ưu tiên đối chiếu thêm ở `docs/requirements/TECHNICAL_REQUIREMENTS.md` và `docs/planning/IMPLEMENTATION_ROADMAP.md`.

## 1. Mục tiêu sản phẩm
Xây dựng website game học tập dành cho học sinh lớp 4 Việt Nam, giúp các em:
- Ôn tập kiến thức Toán, Tiếng Việt, Tiếng Anh, Khoa học theo cách vui nhộn, dễ hiểu.
- Duy trì động lực học thông qua phản hồi nhanh và phần thưởng tích cực.
- Theo dõi tiến bộ rõ ràng qua điểm số, thời gian, và mức độ cải thiện.

Mục tiêu kinh doanh:
- Tăng tần suất tự luyện của học sinh (số phiên chơi/tuần).
- Tăng tỷ lệ hoàn thành game.
- Cung cấp dữ liệu chất lượng để tối ưu nội dung học và trải nghiệm.

## 2. Đối tượng người dùng
### 2.1 Người dùng chính
- Học sinh lớp 4 (9-10 tuổi), khả năng đọc hiểu cơ bản, thời gian tập trung ngắn.

### 2.2 Người dùng đồng hành
- Phụ huynh/giáo viên cần theo dõi:
  - Điểm theo chủ đề.
  - Thời gian hoàn thành.
  - Các lỗi học sinh hay sai.
  - Mức độ tiến bộ theo tuần/tháng.

## 3. Phạm vi MVP (phiên bản 1)
### 3.1 Các màn hình chính
- Welcome: nhập tên người chơi, chọn avatar đơn giản.
- Home/Game Selection: danh sách trò chơi theo môn học và danh hiệu.
- Game Play: khu vực câu hỏi, đếm giờ, điểm hiện tại, nút trợ giúp.
- Result: điểm 0-10, số câu đúng/sai, thời gian, gợi ý học tiếp.
- Celebration: hiển thị khi đạt mức xuất sắc.
- Progress (cơ bản): lịch sử 5 lần chơi gần nhất theo từng game.

### 3.2 Ngoài phạm vi MVP
- Đăng nhập tài khoản phức tạp, đồng bộ nhiều thiết bị.
- Chế độ thi đấu giữa nhiều người chơi.
- Nội dung tự tạo bởi giáo viên trên giao diện admin.

## 4. Luồng người dùng chính
1. Học sinh vào trang -> nhập tên.
2. Chọn môn học -> chọn trò chơi -> chọn danh hiệu đã mở khóa của game đó.
3. Chơi trong 3-7 phút, nhận phản hồi ngay cho mỗi câu.
4. Xem kết quả sau khi hoàn thành.
5. Nhận thưởng (sao/huy hiệu) nếu đạt mốc.
6. Được gợi ý trò chơi tiếp theo dựa trên kết quả vừa chơi.

## 5. Bộ trò chơi đề xuất (thiết kế cụ thể)
Nguyên tắc chung:
- Mỗi lượt chơi kéo dài 3-7 phút.
- Mỗi trò chơi có 10-15 câu hoặc nhiệm vụ nhỏ.
- Điểm quy về thang 0-10.
- Mỗi game có 3 danh hiệu riêng (Bậc 1/Bậc 2/Bậc 3) để tạo bản sắc khác biệt.
- Tên trò chơi lấy cảm hứng từ văn hóa, lịch sử Việt Nam để tăng cảm giác gần gũi.
- Cơ chế mở khóa danh hiệu:
  - Mặc định chỉ mở danh hiệu Bậc 1 của mỗi game.
  - Chỉ mở danh hiệu Bậc 2 khi hoàn thành danh hiệu Bậc 1 cùng game.
  - Chỉ mở danh hiệu Bậc 3 khi hoàn thành danh hiệu Bậc 2 cùng game.
  - Không cho vào thẳng danh hiệu cao nếu chưa hoàn thành danh hiệu thấp hơn.
- Bộ danh hiệu riêng theo từng game:
  - Game 1 - Trạng Nguyên Toán Việt: Học Trò Chăm -> Sĩ Tử Toán -> Trạng Nguyên Toán.
  - Game 2 - Nét Chữ Rồng Tiên: Mầm Nét Đẹp -> Bút Non Tài Hoa -> Rồng Tiên Thư Pháp.
  - Game 3 - Hành Trình Từ Vựng Hội An: Khách Lữ Hành Nhí -> Sứ Giả Đèn Lồng -> Học Giả Hội An.
  - Game 4 - Giải Mã Trống Đồng: Người Tìm Dấu Vết -> Nhà Khảo Cổ Nhí -> Bậc Thầy Trống Đồng.
  - Game 5 - Săn Hình Học Thành Thăng Long: Thợ Xây Tập Sự -> Kiến Trúc Sư Nhí -> Thần Đồng Thăng Long.
  - Game 6 - Đọc Hiểu Sử Việt Nhí: Bạn Đọc Sử Nhí -> Sứ Giả Sử Việt -> Hậu Duệ Sử Gia.
  - Game 7 - Bảng Cửu Chương Văn Miếu: Người Giữ Nhịp -> Cao Thủ Nhân Chia -> Rùa Vàng Toán Học.
  - Game 8 - Nhà Thám Hiểm Cửu Long: Bạn Đồng Xanh -> Thám Hiểm Miệt Vườn -> Sứ Giả Cửu Long.
  - Game 9 - Tính Nhẩm Trạng Tí: Tí Nhanh Trí -> Tí Siêu Nhẩm -> Trạng Tí Xuất Chúng.

### Game 1: Trạng Nguyên Toán Việt (Toán)
- Mục tiêu học tập: cộng/trừ/nhân/chia lớp 4, bài toán có lời văn ngắn.
- Ngữ cảnh hình ảnh:
  - Bối cảnh sân Văn Miếu, bảng gỗ và bút lông cách điệu.
  - Mascot: bé Trạng Nguyên đội khăn xếp.
  - Icon chính: cuộn giấy thi và ngôi sao vàng.
- Cơ chế:
  - Hiển thị câu hỏi trắc nghiệm 4 lựa chọn.
  - Mỗi câu có giới hạn 20-30 giây (tùy danh hiệu).
  - Trả lời đúng nhận điểm + phản hồi âm thanh/tương tác vui.
- Luật tính điểm:
  - Tỷ lệ đúng 70%, tốc độ 20%, chuỗi đúng liên tiếp 10%.
  - Công thức:
    - AccuracyScore = (Số câu đúng / Tổng số câu) * 10
    - SpeedScore = max(0, 10 - (Thời gian trung bình mỗi câu / Mốc thời gian))
    - ComboScore = min(10, (Số câu đúng liên tiếp tối đa / Tổng số câu) * 10)
    - Final = 0.7 * AccuracyScore + 0.2 * SpeedScore + 0.1 * ComboScore
- Điều kiện xuất sắc:
  - Điểm >= 9 và tỷ lệ đúng >= 90%.
- Dữ liệu cần log:
  - game_start, question_view, answer_submit, hint_used, game_complete, game_exit.

### Game 2: Nét Chữ Rồng Tiên (Tiếng Việt)
- Mục tiêu học tập: phân biệt âm/vần dễ nhầm (s/x, ch/tr, d/gi/r), điền từ vào chỗ trống.
- Ngữ cảnh hình ảnh:
  - Bối cảnh lớp học thư pháp thiếu nhi, họa tiết mây lạc Việt.
  - Mascot: cô Tiên bút mực thân thiện.
  - Icon chính: nghiên mực, bút lông, trang vở.
- Cơ chế:
  - Câu điền từ vào chỗ trống hoặc chọn từ đúng.
  - Có audio đọc câu (tùy chọn bật/tắt) hỗ trợ học sinh.
- Luật tính điểm:
  - Độ chính xác 80%, tốc độ 20%.
  - Trừ điểm nhẹ nếu dùng quá nhiều gợi ý (>3 lần/lượt).
- Điều kiện xuất sắc:
  - Điểm >= 8.5, số lỗi sai <= 2.
- Dữ liệu cần log:
  - audio_play, answer_change, answer_submit, hint_used.

### Game 3: Hành Trình Từ Vựng Hội An (Tiếng Anh)
- Mục tiêu học tập: từ vựng chủ đề lớp 4 (school, family, animals, food), ghép từ-ảnh.
- Ngữ cảnh hình ảnh:
  - Bối cảnh phố đèn lồng Hội An, tông màu vàng ấm.
  - Mascot: chú đèn lồng biết nói dẫn đường.
  - Icon chính: đèn lồng, bản đồ mini, tem hành trình.
- Cơ chế:
  - Dạng thẻ nhớ (memory cards) hoặc ghép cặp (word-picture).
  - Mỗi ván chơi 8-12 cặp từ tùy danh hiệu.
- Luật tính điểm:
  - Đúng cặp: +điểm.
  - Sai cặp: không cộng điểm, khuyến khích thử lại.
  - Thưởng nếu hoàn thành trong thời gian mục tiêu.
- Điều kiện xuất sắc:
  - Hoàn thành 100% cặp, điểm >= 9.
- Dữ liệu cần log:
  - card_flip, pair_attempt, pair_correct, pair_wrong, game_complete.

### Game 4: Giải Mã Trống Đồng (Khoa học/Kỹ năng đọc hiểu)
- Mục tiêu học tập: đọc hiểu thông tin ngắn, suy luận đơn giản.
- Ngữ cảnh hình ảnh:
  - Bối cảnh khu khảo cổ giả lập với họa tiết trống đồng Đông Sơn.
  - Mascot: nhà khảo cổ nhí.
  - Icon chính: mảnh ghép trống đồng, kính lúp, la bàn.
- Cơ chế:
  - Đưa đoạn văn 2-4 câu + 3-5 câu hỏi.
  - Có minh họa hình ảnh để tăng dễ hiểu.
- Luật tính điểm:
  - Độ chính xác 75%, tốc độ 15%, không bỏ câu 10%.
- Điều kiện xuất sắc:
  - Điểm >= 8.5 và hoàn thành tất cả câu hỏi.
- Dữ liệu cần log:
  - passage_view_time, question_answered, skipped_question.

### Game 5: Săn Hình Học Thành Thăng Long (Toán - Hình học)
- Mục tiêu học tập: nhận biết hình, chu vi, diện tích cơ bản theo chương trình lớp 4.
- Ngữ cảnh hình ảnh:
  - Bối cảnh mô hình Thành Thăng Long với các khối hình học.
  - Mascot: lính canh nhí hướng dẫn xây thành.
  - Icon chính: gạch thành, thước đo, khối vuông/chữ nhật.
- Cơ chế:
  - Chọn đáp án đúng cho câu hỏi về hình vuông, hình chữ nhật, hình bình hành.
  - Một số câu kéo-thả công thức vào bài toán.
- Luật tính điểm:
  - Độ chính xác 75%, số lần thử lại 15%, tốc độ 10%.
  - Nếu trả lời đúng ngay lần đầu: cộng thưởng nhỏ.
- Điều kiện xuất sắc:
  - Điểm >= 9, trả lời đúng ngay lần đầu ít nhất 80% câu.
- Dữ liệu cần log:
  - question_type_select, drag_drop_submit, retry_count.

### Game 6: Đọc Hiểu Sử Việt Nhí (Tiếng Việt)
- Mục tiêu học tập: tìm ý chính, xác định thông tin đúng/sai trong đoạn văn.
- Ngữ cảnh hình ảnh:
  - Bối cảnh cuốn sử tranh Việt Nam, trình bày theo khung truyện.
  - Mascot: sử quan nhí cầm cuốn sách.
  - Icon chính: sách mở, mốc thời gian, lá cờ nhỏ.
- Cơ chế:
  - Mỗi lượt gồm 2 đoạn văn ngắn, mỗi đoạn 4-6 câu hỏi.
  - Có chế độ đọc từng câu hoặc đọc toàn đoạn.
- Luật tính điểm:
  - Độ chính xác 80%, tốc độ 20%.
  - Thưởng nếu hoàn thành đủ câu mà không bỏ trống.
- Điều kiện xuất sắc:
  - Điểm >= 8.5 và không bỏ câu nào.
- Dữ liệu cần log:
  - passage_scroll_depth, sentence_highlight, answer_submit.

### Game 7: Bảng Cửu Chương Văn Miếu (Toán)
- Mục tiêu học tập: ghi nhớ và phản xạ bảng nhân/chia.
- Ngữ cảnh hình ảnh:
  - Bối cảnh sân bia tiến sĩ cách điệu thành đường chạy câu hỏi.
  - Mascot: rùa đá hoạt hình cổ vũ người chơi.
  - Icon chính: bia đá mini, đồng hồ cát, huy hiệu vàng.
- Cơ chế:
  - Dạng quiz nhanh liên tiếp 15 câu.
  - Mỗi câu có giới hạn 10-15 giây.
- Luật tính điểm:
  - Độ chính xác 60%, tốc độ 30%, chuỗi đúng 10%.
  - Sai 3 câu liên tiếp thì hiện gợi ý ôn nhanh.
- Điều kiện xuất sắc:
  - Điểm >= 9.5, thời gian trung bình mỗi câu dưới 8 giây.
- Dữ liệu cần log:
  - timer_warning, streak_up, streak_break, quick_hint_show.

### Game 8: Nhà Thám Hiểm Cửu Long (Khoa học)
- Mục tiêu học tập: phân loại động vật/thực vật, hiện tượng tự nhiên cơ bản.
- Ngữ cảnh hình ảnh:
  - Bối cảnh sông nước miền Tây với chợ nổi và rừng ngập mặn.
  - Mascot: bạn thám hiểm nhí đi thuyền.
  - Icon chính: chiếc xuồng, lá dừa, kính thiên nhiên.
- Cơ chế:
  - Kéo-thả vật thể vào nhóm đúng (sống/không sống, trên cạn/dưới nước...).
  - Câu hỏi tình huống ngắn với hình minh họa.
- Luật tính điểm:
  - Độ chính xác 70%, hoàn thành nhiệm vụ 20%, tốc độ 10%.
- Điều kiện xuất sắc:
  - Điểm >= 8.5 và hoàn thành tất cả nhiệm vụ phân loại.
- Dữ liệu cần log:
  - classify_attempt, classify_correct, classify_wrong, mission_complete.

### Game 9: Tính Nhẩm Trạng Tí (Toán)
- Mục tiêu học tập: luyện phản xạ tính nhẩm với phép cộng, trừ, nhân, chia đơn giản.
- Ngữ cảnh hình ảnh:
  - Bối cảnh sân đình làng Việt, bảng tính treo giữa sân.
  - Mascot: Trạng Tí phiên bản thiếu nhi.
  - Icon chính: trống nhỏ, bảng số, tia chớp thời gian.
- Cơ chế:
  - Mỗi lượt hiển thị lần lượt 10-20 phép toán ngắn (ví dụ: 7 + 8, 24 : 6, 9 x 4).
  - Mỗi câu có đồng hồ đếm ngược (5-12 giây tùy danh hiệu).
  - Người chơi nhập kết quả vào ô trả lời và nhấn "Xác nhận" hoặc Enter.
  - Hết thời gian mà chưa trả lời thì tự động chuyển câu tiếp theo và tính là sai.
- Luật tính điểm:
  - Độ chính xác 70%, tốc độ trả lời 20%, số câu trả lời trong giới hạn thời gian 10%.
  - Trả lời đúng liên tiếp từ 5 câu trở lên được cộng thưởng chuỗi.
- Điều kiện xuất sắc:
  - Điểm >= 9, tỷ lệ đúng >= 90%, không có câu hết giờ.
- Dữ liệu cần log:
  - math_question_show, countdown_start, answer_input, answer_submit, time_up, streak_bonus, game_complete.

## 6. Quy tắc điểm và xếp loại chung
- Điểm cuối cùng được làm tròn theo bước 0.5 (0, 0.5, 1, …, 10); ví dụ 9.9 hiển thị là 10.
- Mức xếp loại:
  - 9.0-10.0: Xuất sắc (màn hình chúc mừng + 3 sao).
  - 7.0-8.9: Tốt (2 sao).
  - 5.0-6.9: Đạt (1 sao).
  - <5.0: Cần cố gắng (gợi ý học lại bài dễ hơn).

## 7. Yêu cầu chức năng cốt lõi
- Bắt đầu game trong <= 2 bước từ màn Home.
- Mỗi game ghi nhận kết quả: điểm, thời gian, số câu đúng/sai, danh hiệu đã chơi.
- Hiển thị kết quả ngay sau khi kết thúc game.
- Hiển thị gợi ý "chơi trò tiếp theo" dựa trên kết quả vừa chơi:
  - Nếu điểm < 7: gợi ý chơi lại cùng game ở cùng danh hiệu để củng cố.
  - Nếu điểm từ 7 đến dưới 9: gợi ý chơi thêm 1 lượt cùng danh hiệu.
  - Nếu điểm >= 9: gợi ý mở khóa/chơi danh hiệu kế tiếp hoặc chuyển sang game mới.
- Lưu lịch sử tối thiểu 30 phiên chơi gần nhất cho mỗi người chơi.
- Quy tắc mở khóa bắt buộc:
  - Hoàn thành danh hiệu Bậc 1 mới mở Bậc 2 trong cùng game.
  - Hoàn thành danh hiệu Bậc 2 mới mở Bậc 3 trong cùng game.
  - "Hoàn thành danh hiệu" được tính khi kết thúc lượt chơi hợp lệ và điểm >= 7.

## 8. Yêu cầu UX/UI cho trẻ em
- Nút bấm lớn, rõ, dễ click trên tablet/laptop.
- Mỗi màn hình tối đa 1 mục tiêu chính, hạn chế nhiều chữ.
- Màu sắc tươi nhưng dịu mắt, độ tương phản cao để dễ đọc.
- Mỗi game có bộ nhận diện riêng (background + icon + mascot), nhưng vẫn thống nhất style toàn hệ thống.
- Không hiển thị bảng điều kiện mở khóa chi tiết cho học sinh; chỉ hiển thị tiến trình trực quan, dễ hiểu.
- Phản hồi tức thì cho mỗi hành động:
  - Đúng: màu xanh + icon vui.
  - Sai: màu cam/đỏ nhẹ + gợi ý ngắn.
- Âm thanh có thể bật/tắt.
- Có chế độ chữ to (large text) cho học sinh đọc chậm.

## 9. Art Direction (Định hướng mỹ thuật)
### 9.1 Màu sắc hệ thống
- Bảng màu chính (đề xuất):
  - Xanh lá tích cực: #22C55E (trạng thái đúng/thưởng).
  - Xanh dương tin cậy: #3B82F6 (nút chính/thông tin).
  - Vàng năng lượng: #FACC15 (huy hiệu, sao, điểm nhấn).
  - Cam cảnh báo nhẹ: #FB923C (gợi ý sai, nhắc thử lại).
  - Đỏ dịu: #F87171 (trạng thái sai, tránh gây áp lực).
- Màu nền ưu tiên sáng, dịu mắt (kem nhạt/xanh nhạt), không dùng nền bão hòa cao toàn màn hình.
- Tỷ lệ màu gợi ý: 60% nền trung tính, 30% màu thương hiệu, 10% màu nhấn.

### 9.2 Typography
- Font tiêu đề: kiểu tròn, thân thiện, dễ đọc (ví dụ: Baloo 2, Nunito, SVN rounded tương đương).
- Font nội dung: sans-serif rõ ràng, ưu tiên hỗ trợ tiếng Việt đầy đủ dấu.
- Kích thước tối thiểu:
  - Nội dung chính: 18px.
  - Nút bấm: 20-24px.
  - Tiêu đề màn hình: 28-36px.
- Khoảng cách dòng rộng (line-height >= 1.4) để trẻ dễ đọc.

### 9.3 Minh họa và icon
- Phong cách minh họa: 2D vui nhộn, nét tròn, ít chi tiết rối, màu tươi dịu.
- Mỗi game có 1 mascot chính và bộ icon riêng theo chủ đề văn hóa/lịch sử Việt Nam.
- Icon cần đồng bộ độ dày nét, bo góc, và cùng hệ phối màu.
- Tránh yếu tố gây hiểu sai lịch sử; hình ảnh văn hóa cần mang tính giáo dục, tích cực, trung tính.

### 9.4 Chuyển động (Motion)
- Animation ngắn, rõ mục đích, thời lượng 150-350ms cho thao tác thường.
- Hiệu ứng đúng/sai có thể dài hơn (300-600ms) nhưng không chặn thao tác kế tiếp quá lâu.
- Đồng hồ đếm ngược dùng chuyển động mượt, dễ nhìn, có cảnh báo 3 giây cuối bằng màu + rung nhẹ.
- Tránh hiệu ứng nhấp nháy nhanh liên tục để đảm bảo an toàn thị giác.

### 9.5 Âm thanh
- Âm thanh đúng/sai phân biệt rõ, âm lượng vừa phải, không gây giật mình.
- Nhạc nền nhẹ, lặp ngắn, có thể tắt riêng với hiệu ứng âm thanh.
- Có tối thiểu 3 nhóm âm thanh: thao tác, kết quả câu hỏi, hoàn thành màn.

### 9.6 Bố cục và thành phần UI chuẩn
- Thanh trên cùng cố định: tên game, tiến độ, điểm hiện tại, nút âm thanh.
- Khu vực trung tâm: câu hỏi/nhiệm vụ là trọng tâm thị giác.
- Khu vực dưới: hành động chính (trả lời/xác nhận/tiếp tục) với nút lớn.
- Khoảng cách chạm tối thiểu 44x44px cho mọi nút tương tác.

### 9.7 Accessibility cho trẻ em
- Tương phản văn bản/nền đạt tối thiểu chuẩn đọc tốt (khuyến nghị >= WCAG AA).
- Không chỉ dùng màu để truyền tải đúng/sai; luôn kèm icon hoặc chữ ngắn.
- Hỗ trợ đọc to nội dung câu hỏi cho game ngôn ngữ.
- Có tùy chọn giảm chuyển động (reduce motion) cho thiết bị yếu hoặc người nhạy cảm.

## 10. Thu thập dữ liệu và phân tích
### 10.1 Sự kiện cần thu thập (event schema tối thiểu)
Trường chung:
- event_name
- user_name_or_id
- session_id
- game_id
- achievement_level
- achievement_name
- timestamp
- metadata (JSON)

Danh sách event bắt buộc:
- session_start, session_end
- game_start, game_pause, game_resume, game_exit, game_complete
- question_view, answer_submit, answer_correct, answer_wrong
- hint_used, audio_play, reward_earned
- result_view, next_game_click

### 10.2 KPI theo dõi
- Tỷ lệ hoàn thành game.
- Điểm trung bình theo game/chủ đề/danh hiệu.
- Thời gian trung bình hoàn thành.
- Số phiên chơi mỗi học sinh mỗi tuần.
- Tỷ lệ quay lại trong 7 ngày.
- Tỷ lệ cải thiện điểm sau 3 lần chơi cùng một game.
- Tỷ lệ dùng gợi ý theo từng game để phát hiện phần khó.

## 11. Yêu cầu phi chức năng
- Hiệu năng:
  - Thời gian phản hồi thao tác chính < 200ms.
  - Tải màn game đầu tiên < 3 giây với mạng ổn định.
- Tương thích:
  - Hoạt động tốt trên laptop, tablet (ưu tiên màn hình 10 inch trở lên).
- Bảo mật dữ liệu:
  - Không lưu thông tin nhạy cảm không cần thiết.
  - Dữ liệu trẻ em được ẩn danh hóa khi phân tích.
- Độ ổn định:
  - Nếu mất kết nối tạm thời, hệ thống có thông báo thân thiện và cho phép chơi lại.

## 12. Lộ trình nội dung học
- Mỗi game có ngân câu hỏi theo danh hiệu:
  - Bậc 1 (danh hiệu khởi đầu): nhận biết, mức nền tảng.
  - Bậc 2 (danh hiệu trung gian): vận dụng, độ thử thách trung bình.
  - Bậc 3 (danh hiệu cao nhất): phản xạ nhanh, độ chính xác cao.
- Sau mỗi lượt, hệ thống đề xuất:
  - 1 game cùng chủ đề để ôn tập.
  - 1 game khác chủ đề để tạo cảm giác mới.

### 12.1 Ngưỡng mở khóa danh hiệu theo từng game
Quy ước chung:
- Mở Bậc 2: phải đạt đủ điều kiện ở cột "Mở Bậc 2" khi chơi Bậc 1.
- Mở Bậc 3: phải đạt đủ điều kiện ở cột "Mở Bậc 3" khi chơi Bậc 2.
- Nếu chưa đạt, hệ thống giữ nguyên danh hiệu hiện tại và gợi ý chơi lại.
- Bảng dưới đây là tài liệu nội bộ cho Product/Dev/QA, không hiển thị trực tiếp cho học sinh.

| Game | Mở Bậc 2 (từ Bậc 1) | Mở Bậc 3 (từ Bậc 2) |
|---|---|---|
| Trạng Nguyên Toán Việt | Điểm >= 7.0, tỷ lệ đúng >= 70%, thời gian <= 7 phút | Điểm >= 8.5, tỷ lệ đúng >= 85%, combo đúng >= 5 |
| Nét Chữ Rồng Tiên | Điểm >= 7.0, lỗi sai <= 4, dùng gợi ý <= 4 lần | Điểm >= 8.5, lỗi sai <= 2, dùng gợi ý <= 2 lần |
| Hành Trình Từ Vựng Hội An | Điểm >= 7.0, ghép đúng >= 70% cặp, thời gian <= 7 phút | Điểm >= 8.5, ghép đúng >= 90% cặp, số lần sai liên tiếp <= 2 |
| Giải Mã Trống Đồng | Điểm >= 7.0, hoàn thành đủ câu, bỏ trống = 0 | Điểm >= 8.5, hoàn thành đủ câu, thời gian đọc hiểu <= 6 phút |
| Săn Hình Học Thành Thăng Long | Điểm >= 7.0, đúng ngay lần đầu >= 60%, thời gian <= 7 phút | Điểm >= 8.5, đúng ngay lần đầu >= 80%, retry_count <= 2 |
| Đọc Hiểu Sử Việt Nhí | Điểm >= 7.0, không bỏ câu, tỷ lệ đúng >= 70% | Điểm >= 8.5, không bỏ câu, tỷ lệ đúng >= 85% |
| Bảng Cửu Chương Văn Miếu | Điểm >= 7.5, tỷ lệ đúng >= 75%, thời gian TB/câu <= 12 giây | Điểm >= 9.0, tỷ lệ đúng >= 90%, thời gian TB/câu <= 8 giây |
| Nhà Thám Hiểm Cửu Long | Điểm >= 7.0, nhiệm vụ hoàn thành >= 80%, phân loại sai <= 4 | Điểm >= 8.5, nhiệm vụ hoàn thành = 100%, phân loại sai <= 2 |
| Tính Nhẩm Trạng Tí | Điểm >= 7.5, tỷ lệ đúng >= 75%, câu hết giờ <= 2 | Điểm >= 9.0, tỷ lệ đúng >= 90%, câu hết giờ = 0 |

### 12.2 Cách hiển thị cho học sinh (đơn giản và mang tính hình ảnh)
- Màn hình chọn danh hiệu chỉ hiển thị 3 huy hiệu lớn theo thứ tự trái sang phải:
  - Huy hiệu hiện tại: sáng màu, có nhãn "Đang chơi".
  - Huy hiệu tiếp theo: hiện khóa + dòng "Sắp mở khóa".
  - Huy hiệu cao nhất chưa mở: mờ nhẹ, không cho bấm.
- Dùng thanh tiến trình trực quan thay vì số liệu kỹ thuật:
  - Ví dụ: thanh "Tiến tới danh hiệu tiếp theo" với 5 nấc sao.
  - Mỗi lần chơi tốt tăng 1-2 nấc, chơi chưa đạt vẫn có phản hồi tích cực.
- Thông điệp sau mỗi lượt phải ngắn, rõ, khích lệ:
  - "Giỏi lắm! Con còn 1 bước nữa để mở danh hiệu mới."
  - "Tuyệt vời! Danh hiệu mới đã được mở."
  - "Thử lại nhé, con đang tiến bộ rất nhanh."
- Không hiển thị các chỉ số gây quá tải như: tỷ lệ %, điều kiện tổ hợp, retry_count, combo kỹ thuật.
- Chỉ hiển thị tối đa 3 chỉ số dễ hiểu trên màn kết quả:
  - Điểm, thời gian, số câu đúng.
- Khi mở khóa danh hiệu mới:
  - Phát animation ăn mừng 1-2 giây (pháo giấy, sao bay).
  - Hiển thị tên danh hiệu mới bằng chữ lớn + mascot tương ứng của game.

### 12.3 Bộ microcopy mẫu cho UI (ngắn, tích cực, dễ hiểu)
Nguyên tắc:
- Mỗi câu tối đa 8-12 từ, ưu tiên từ quen thuộc với học sinh lớp 4.
- Tông giọng khích lệ, không dùng từ mang tính phán xét nặng.
- Có thể hiển thị kèm emoji/icon, nhưng không lạm dụng.

Thông điệp khi trả lời đúng:
- "Chính xác! Con làm rất tốt."
- "Giỏi quá! Thêm một câu đúng rồi."
- "Tuyệt vời! Con đang tiến bộ nhanh."
- "Đúng rồi! Cùng chinh phục câu tiếp theo nhé."

Thông điệp khi trả lời sai:
- "Không sao, mình thử lại nhé!"
- "Gần đúng rồi, con bình tĩnh làm lại."
- "Sai một chút thôi, câu sau sẽ tốt hơn."
- "Cố lên! Con đang học rất tốt."

Thông điệp khi gần mở khóa danh hiệu:
- "Con còn 1 sao nữa để mở danh hiệu mới!"
- "Sắp mở khóa rồi, cố thêm chút nữa nhé!"
- "Tuyệt! Danh hiệu mới gần trong tầm tay."

Thông điệp khi mở khóa danh hiệu mới:
- "Chúc mừng! Con đã mở danh hiệu mới."
- "Xuất sắc! Huy hiệu mới thuộc về con."
- "Wow! Con vừa lên danh hiệu tiếp theo."
- "Con làm được rồi! Cùng thử thử thách mới."

Thông điệp khi cần chơi lại để củng cố:
- "Chơi thêm một lượt, con sẽ giỏi hơn."
- "Mình luyện lại nhé, con sắp đạt rồi."
- "Cố thêm lần nữa, con đang tiến bộ từng bước."

Thông điệp nút bấm gợi ý:
- "Chơi tiếp"
- "Thử lại"
- "Nhận thưởng"
- "Mở danh hiệu"
- "Về trang trò chơi"
- "Xem thành tích"

### 12.4 Microcopy riêng theo từng game (theme-based)
Game 1 - Trạng Nguyên Toán Việt:
- "Con tính nhanh như Trạng Nguyên rồi!"
- "Thêm một câu đúng, bảng vàng đợi con."
- "Cố lên, sĩ tử giỏi không bỏ cuộc."

Game 2 - Nét Chữ Rồng Tiên:
- "Nét chữ đẹp lắm, con làm rất khéo."
- "Thử lại chữ này nhé, con sắp đúng rồi."
- "Rồng Tiên khen con viết ngày càng chuẩn."

Game 3 - Hành Trình Từ Vựng Hội An:
- "Đèn lồng sáng lên vì con ghép đúng!"
- "Tuyệt lắm! Con vừa tìm đúng từ mới."
- "Đi tiếp nào, Hội An còn nhiều thử thách."

Game 4 - Giải Mã Trống Đồng:
- "Con đã tìm đúng manh mối rồi!"
- "Giỏi quá! Bí mật trống đồng sắp mở ra."
- "Thử lại nhé, nhà khảo cổ nhí rất kiên trì."

Game 5 - Săn Hình Học Thành Thăng Long:
- "Khối hình này con xử lý rất chuẩn!"
- "Thành Thăng Long đang dần hoàn thiện rồi."
- "Cố thêm chút nữa, con xây giỏi lắm."

Game 6 - Đọc Hiểu Sử Việt Nhí:
- "Con đọc rất tốt, ý chính đúng rồi."
- "Thêm một câu nữa là mở trang sử mới."
- "Bình tĩnh đọc lại, con sẽ làm được ngay."

Game 7 - Bảng Cửu Chương Văn Miếu:
- "Nhanh và đúng! Rùa Vàng cổ vũ con."
- "Giữ nhịp thật tốt, con làm rất chắc."
- "Thử lại phép này nhé, con sắp vượt qua."

Game 8 - Nhà Thám Hiểm Cửu Long:
- "Phân loại chuẩn quá, nhà thám hiểm nhí ơi!"
- "Con vừa khám phá đúng một vùng mới."
- "Tiếp tục nào, Cửu Long còn điều thú vị."

Game 9 - Tính Nhẩm Trạng Tí:
- "Nhẩm nhanh quá! Trạng Tí cũng bất ngờ."
- "Đúng rồi! Con vừa vượt thêm một mốc."
- "Cố thêm câu nữa, danh hiệu đang chờ con."

## 13. Tiêu chí chấp nhận MVP
- Học sinh có thể chơi ít nhất 9 game như thiết kế trên.
- Mỗi game trả kết quả theo thang điểm 0-10.
- Có màn hình kết quả và màn hình chúc mừng mức xuất sắc.
- Dữ liệu event được ghi đầy đủ cho toàn bộ luồng chơi chính.
- Phụ huynh/giáo viên xem được lịch sử kết quả cơ bản của học sinh.

